"use client";

// force-dynamic: useSearchParams() 在 client component 中需要动态渲染
export const dynamic = "force-dynamic";

import { useState, useCallback, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { X, CheckCircle, Shirt, ArrowLeft, Palette, Heart, Loader2, AlertCircle, Download, Share2, MessageCircle, Bell } from "lucide-react";
import Navbar from "@/components/Navbar";
import { OUTFITS, type Outfit, type Occasion, type Audience } from "@/data/outfits";
import { hueSimilarity } from "@/lib/color";
import { compressImageForUpload } from "@/lib/image";
import { FaceCameraCapture } from "@/components/FaceCameraCapture";

const OCCASIONS: { id: Occasion; label: string }[] = [
  { id: "sangeet", label: "Sangeet" },
  { id: "mehendi", label: "Mehendi" },
  { id: "haldi", label: "Haldi" },
  { id: "wedding", label: "Wedding" },
  { id: "reception", label: "Reception" },
];

const AUDIENCES: { id: Audience | "all"; label: string }[] = [
  { id: "women", label: "Women's wear" },
  { id: "men", label: "Men's wear" },
  { id: "all", label: "All styles" },
];

type Step = 1 | 2 | 3;

interface SkinResult {
  success: boolean;
  skin_color?: string;
  mode?: string;
  error?: string;
}

interface VTOResult {
  success: boolean;
  resultUrl?: string;
  mode?: string;
  error?: string;
}

// Warm-tinted hue names for the honest colour-harmony explanation line.
function harmonyNote(skinHex: string, outfit: Outfit): string | null {
  const r = parseInt(skinHex.slice(1, 3), 16);
  const g = parseInt(skinHex.slice(3, 5), 16);
  const b = parseInt(skinHex.slice(5, 7), 16);
  const warmth = r - b; // positive = warm/golden, negative = cool
  const warmOutfit = (hueSimilarity(skinHex, outfit.primaryColor) ?? 0) >= 0.5;
  if (warmth > 30 && warmOutfit) return "Golden tones suit this warm palette";
  if (warmth > 30) return "Golden tones pair well with richer variants of this palette";
  if (warmth < -30 && !warmOutfit) return "Cooler tones suit this palette";
  if (warmth < -30) return "Cooler tones pair well with lighter variants of this palette";
  return "Neutral tones work across this palette";
}

// Separate component to use useSearchParams() — wrapped in Suspense for prerendering
function SearchParamHandler({
  onRestore,
}: {
  onRestore: (params: { step?: Step; occasion?: Occasion; skin?: string; vto?: string }) => void;
}) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const s = searchParams.get("step");
    const o = searchParams.get("occasion") as Occasion | null;
    const sk = searchParams.get("skin");
    const v = searchParams.get("vto");

    const result: { step?: Step; occasion?: Occasion; skin?: string; vto?: string } = {};
    if (o && OCCASIONS.some(x => x.id === o)) result.occasion = o;
    if (sk && /^#[0-9A-Fa-f]{6}$/.test(sk)) result.skin = sk;
    if (s === "2") result.step = 2;
    else if (s === "3") result.step = 3;
    if (v) result.vto = v;

    if (Object.keys(result).length > 0) onRestore(result);
  }, [searchParams, onRestore]);

  return null;
}

export default function Home() {
  const [step, setStep] = useState<Step>(1);
  const [occasion, setOccasion] = useState<Occasion>("sangeet");
  const [audience, setAudience] = useState<Audience | "all">("all");
  const [skinColor, setSkinColor] = useState<string | null>(null);
  const [fullBodyDataUrl, setFullBodyDataUrl] = useState<string | null>(null);
  const [fullBodyError, setFullBodyError] = useState<string | null>(null);
  const [skinError, setSkinError] = useState<string | null>(null);
  const [showFaceCamera, setShowFaceCamera] = useState(false);
  const [skinLoading, setSkinLoading] = useState(false);
  const [vtoLoading, setVtoLoading] = useState(false);
  const [vtoError, setVtoError] = useState<string | null>(null);
  const [vtoModal, setVtoModal] = useState<{ open: boolean; outfit: Outfit; resultUrl: string; mode: string } | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const [showShortlist, setShowShortlist] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  const runVTO = useCallback(
    async (outfit: Outfit, source?: string) => {
      const src = source ?? fullBodyDataUrl ?? null;
      if (!src) {
        setVtoError("Please upload a full-body photo before trying on outfits.");
        return;
      }
      if (!outfit.vtoSupported || !outfit.tryOnReference) {
        setVtoError("Try-on is not available for this piece yet.");
        return;
      }
      setVtoLoading(true);
      try {
        const res = await fetch("/api/vto", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullBodyDataUrl: src,
            garmentId: outfit.id,
            referenceAsset: outfit.tryOnReference,
            vtoSupported: outfit.vtoSupported,
            displayImage: outfit.imageUrl,
          }),
        });
        const data: VTOResult = await res.json();
        if (data.success && typeof data.resultUrl === "string") {
          const resultUrl = data.resultUrl;
          setVtoModal(prev => prev ? { ...prev, resultUrl, mode: data.mode || "mock" } : null);
        } else {
          setVtoError(data.error || "VTO failed");
        }
      } catch (err: any) {
        setVtoError(err.message || "VTO request failed");
      } finally {
        setVtoLoading(false);
      }
    },
    [fullBodyDataUrl]
  );

  const handleRestore = useCallback((params: { step?: Step; occasion?: Occasion; skin?: string; vto?: string }) => {
    if (params.occasion) setOccasion(params.occasion);
    if (params.skin) setSkinColor(params.skin);
    if (params.step) setStep(params.step);
    if (params.vto && params.skin) {
      const outfit = OUTFITS.find(o => o.id === params.vto);
      if (outfit) {
        setVtoModal({ open: true, outfit, resultUrl: "", mode: "" });
        if (fullBodyDataUrl) {
          setTimeout(() => runVTO(outfit), 100);
        }
      }
    }
  }, [fullBodyDataUrl, runVTO]);

  const analyzeSkin = useCallback(async (dataUrl: string) => {
    setSkinError(null);
    setSkinLoading(true);
    try {
      const res = await fetch("/api/skin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageDataUrl: dataUrl }),
      });
      const data: SkinResult = await res.json();
      if (!data.success || !data.skin_color) throw new Error(data.error || "Skin analysis failed");
      setSkinColor(data.skin_color);
    } catch (err: any) {
      setSkinError(err.message || "Skin analysis failed");
    } finally {
      setSkinLoading(false);
    }
  }, []);

  const openVTO = useCallback((outfit: Outfit) => {
    if (!outfit.vtoSupported) return;
    setVtoModal({ open: true, outfit, resultUrl: "", mode: "" });
    setVtoError(null);
    setFullBodyError(null);
    if (fullBodyDataUrl) runVTO(outfit);
  }, [fullBodyDataUrl, runVTO]);


  const retryVTO = useCallback(() => {
    if (vtoModal) runVTO(vtoModal.outfit);
  }, [vtoModal, runVTO]);

  const closeVTO = useCallback(() => {
    setVtoModal(null);
    setVtoLoading(false);
    setVtoError(null);
  }, []);

  const copyShareLink = useCallback(async () => {
    if (!vtoModal?.resultUrl) return;
    const pageUrl = `${window.location.origin}/?step=3&occasion=${encodeURIComponent(vtoModal.outfit.occasion)}&skin=${encodeURIComponent(skinColor || '')}&vto=${encodeURIComponent(vtoModal.outfit.id)}`;
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopyStatus("copied");
      setTimeout(() => setCopyStatus("idle"), 2000);
    } catch {
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 2000);
    }
  }, [vtoModal, skinColor]);

  const shareWhatsApp = useCallback(() => {
    if (!vtoModal?.outfit) return;
    const text = `Check out this ${vtoModal.outfit.name} I found on SangeetFit for the ${vtoModal.outfit.occasion}! Try it on: ${window.location.origin}/?step=3&occasion=${encodeURIComponent(vtoModal.outfit.occasion)}&vto=${encodeURIComponent(vtoModal.outfit.id)}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }, [vtoModal]);

  const toggleFavorite = useCallback((outfitId: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(outfitId)) next.delete(outfitId);
      else next.add(outfitId);
      return next;
    });
  }, []);

  const curated = useMemo(() => {
    const filtered = OUTFITS.filter(o => o.occasion === occasion)
      .filter(o => audience === "all" || o.audience === audience || o.audience === "unisex");
    if (showShortlist) return filtered.filter(o => favorites.has(o.id));
    return filtered.sort((a, b) => {
      const sa = skinColor ? hueSimilarity(skinColor, a.primaryColor) : null;
      const sb = skinColor ? hueSimilarity(skinColor, b.primaryColor) : null;
      if (sa === null && sb === null) return 0;
      if (sa === null) return 1;
      if (sb === null) return -1;
      return sb - sa;
    });
  }, [occasion, audience, skinColor, favorites, showShortlist]);

  const shortlistCount = favorites.size;

  const stepLabel = (s: Step) => (s === 1 ? "Select occasion" : s === 2 ? "Skin-tone analysis" : "Curated gallery");

  const handleFullBodyFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) { setFullBodyError("Please upload an image file"); return; }
    if (file.size > 10 * 1024 * 1024) { setFullBodyError("Full-body photo must be under 10MB"); return; }
    setFullBodyError(null);
    compressImageForUpload(file, 1600)
      .then(dataUrl => {
        setFullBodyDataUrl(dataUrl);
        if (vtoModal) runVTO(vtoModal.outfit, dataUrl);
      })
      .catch(err => setFullBodyError((err as Error).message || "Could not process the image"));
  };

  return (
    <main className="min-h-screen">
      <Suspense fallback={<div className="p-8 text-center text-gray-400">加载中...</div>}>
        <SearchParamHandler onRestore={handleRestore} />
      </Suspense>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="glass rounded-xl p-6 mb-6">
          <h1 className="font-bold text-xl gradient-text mb-2">SangeetFit</h1>
          <p className="text-sm text-gray-400">Occasion → Skin-tone analysis → Occasion-curated gallery → Virtual try-on</p>
          <div className="step-indicator mt-4">
            <div className={`step-dot ${step >= 1 ? "active" : ""}`} />
            <div className={`step-line ${step >= 2 ? "active" : ""}`} />
            <div className={`step-dot ${step >= 2 ? "active" : ""}`} />
            <div className={`step-line ${step === 3 ? "active" : ""}`} />
            <div className={`step-dot ${step === 3 ? "active" : ""}`} />
            <span className="text-xs text-gray-500 ml-2">{stepLabel(step)}</span>
          </div>
        </div>

        {/* ── Step 1: Occasion ── */}
        {step === 1 && (
          <div className="glass rounded-xl p-6">
            <h2 className="font-semibold mb-4">Choose the wedding function</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {OCCASIONS.map(o => (
                <button
                  key={o.id}
                  onClick={() => { setOccasion(o.id); setStep(2); }}
                  className={`p-4 rounded-lg border transition-all ${
                    occasion === o.id
                      ? "border-violet-500 bg-violet-500/10"
                      : "border-gray-700 hover:border-gray-500 hover:bg-gray-800"
                  }`}
                >
                  <Shirt className="w-5 h-5 text-violet-400 mb-1" />
                  <div className="text-sm font-medium">{o.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 2: Skin-tone analysis ── */}
        {step === 2 && (
          <div className="glass rounded-xl p-6 space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <ArrowLeft className="w-4 h-4 text-gray-500 cursor-pointer hover:text-violet-400" onClick={() => setStep(1)} />
              <h2 className="font-semibold">Skin-tone analysis</h2>
            </div>
            <p className="text-sm text-gray-400 mb-4">Upload a front-facing selfie. YouCam returns a skin-tone hex we use to score colour harmony.</p>

            {showFaceCamera ? (
              <FaceCameraCapture
                showRetryHint={!!skinError}
                onClose={() => setShowFaceCamera(false)}
                onCapture={file => {
                  setShowFaceCamera(false);
                  setSkinError(null);
                  compressImageForUpload(file, 1280, 1_500_000)
                    .then(dataUrl => analyzeSkin(dataUrl))
                    .catch(err => setSkinError((err as Error).message || "Could not process the captured photo"));
                }}
              />
            ) : null}

            <button type="button" onClick={() => setShowFaceCamera(v => !v)}
              className="mx-auto flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors">
              <Palette className="w-3 h-3" /> {showFaceCamera ? "Hide camera" : "Use camera instead"}
            </button>

            <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-violet-500 transition-colors cursor-pointer"
                 onClick={() => (document.getElementById("selfie-file") as HTMLInputElement)?.click()}>
              <Palette className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Click to upload selfie</p>
              <p className="text-xs text-gray-600 mt-1">JPG/PNG under 10MB</p>
              <input id="selfie-file" type="file" accept="image/*" className="hidden" onChange={e => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (!file.type.startsWith("image/")) { setSkinError("Please upload an image file"); return; }
                if (file.size > 10 * 1024 * 1024) { setSkinError("Image must be under 10MB"); return; }
                setSkinError(null);
                compressImageForUpload(file, 1280, 1_500_000)
                  .then(dataUrl => analyzeSkin(dataUrl))
                  .catch(err => setSkinError((err as Error).message || "Could not process the image"));
              }} />
            </div>

            {skinError && (
              <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                <X className="w-3 h-3" /> {skinError}
              </p>
            )}

            {skinLoading && (
              <p className="text-sm text-gray-400 flex items-center gap-2">Analyzing with YouCam API…</p>
            )}

            {skinColor && (
              <div className="space-y-3 p-4 rounded-lg border border-violet-500/30 bg-violet-500/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg border" style={{ backgroundColor: skinColor }} />
                  <div>
                    <div className="text-xs text-gray-400">Detected skin tone</div>
                    <div className="font-mono text-sm">{skinColor}</div>
                  </div>
                  <button onClick={() => setStep(3)} className="ml-auto px-3 py-1.5 text-xs border border-violet-500 text-violet-400 rounded hover:bg-violet-500/10 transition-colors">
                    Continue to gallery
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Step 3: Gallery ── */}
        {step === 3 && (
          <div className="glass rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4 text-gray-500 cursor-pointer hover:text-violet-400" onClick={() => setStep(2)} />
                <h2 className="font-semibold">Curated gallery — {occasion.charAt(0).toUpperCase() + occasion.slice(1)}</h2>
              </div>
              <div className="flex items-center gap-3">
                {skinColor && (
                  <span className="text-xs text-gray-500">Sorted by colour harmony to skin tone <span className="font-mono">{skinColor}</span></span>
                )}
                <button
                  onClick={() => setShowShortlist(v => !v)}
                  className={`flex items-center gap-1 px-3 py-1.5 text-xs border rounded transition-colors ${
                    showShortlist
                      ? "border-violet-500 bg-violet-500/10 text-violet-400"
                      : "border-gray-700 text-gray-500 hover:border-gray-500"
                  }`}
                >
                  <Heart className="w-3 h-3" fill={showShortlist ? "currentColor" : "none"} />
                  Shortlist{shortlistCount > 0 && ` (${shortlistCount})`}
                </button>
              </div>
            </div>

            {/* Collection selector — explicit choice, never inferred from photos */}
            <div className="flex items-center gap-2 flex-wrap">
              {AUDIENCES.map(a => (
                <button
                  key={a.id}
                  onClick={() => setAudience(a.id)}
                  className={`px-4 py-1.5 text-xs border rounded-full transition-colors ${
                    audience === a.id
                      ? "border-violet-500 bg-violet-500/10 text-violet-400"
                      : "border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-400"
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {curated.map((o: Outfit) => {
                const sim = skinColor ? hueSimilarity(skinColor, o.primaryColor) : null;
                const score = sim == null ? null : Math.round(sim * 100);
                const note = skinColor ? harmonyNote(skinColor, o) : null;
                return (
                  <div
                    key={o.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => openVTO(o)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openVTO(o); } }}
                    className={`group p-3 rounded-lg border transition-all ${
                      o.vtoSupported
                        ? vtoLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer border-gray-700 hover:border-violet-500 hover:bg-violet-500/5"
                        : "border-gray-700 opacity-90"
                    }`}
                    aria-disabled={!o.vtoSupported}
                  >
                    <div className="relative">
                      <div className="w-full h-32 rounded mb-2 bg-gray-900" style={{ aspectRatio: "1 / 1" }}>
                        <img src={o.imageUrl} alt={o.name} className="w-full h-full object-cover rounded" />
                      </div>
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 text-[10px] rounded bg-black/60 text-gray-300 capitalize">
                        {o.audience}
                      </span>
                      {!o.vtoSupported && (
                        <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 text-[10px] rounded bg-black/70 text-yellow-400">
                          Try-on not available
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(o.id); }}
                        disabled={vtoLoading}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                        aria-label={favorites.has(o.id) ? "Remove from shortlist" : "Add to shortlist"}
                      >
                        <Heart className="w-3.5 h-3.5" fill={favorites.has(o.id) ? "var(--violet-400, #a78bfa)" : "none"} style={{ color: favorites.has(o.id) ? "#a78bfa" : "white" }} />
                      </button>
                    </div>
                    <div className="text-sm font-medium">{o.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{o.garmentType} · {o.collection}</div>
                    {score != null && (
                      <div className="mt-2 text-xs flex items-center gap-1">
                        <Palette className="w-3 h-3" style={{ backgroundColor: o.primaryColor }} />
                        <span className="text-green-400">{score}% harmony</span>
                      </div>
                    )}
                    {note && <div className="mt-1 text-xs text-gray-500">{note}</div>}
                    {!o.vtoSupported && (
                      <div className="mt-2 text-xs text-gray-600 flex items-start gap-1">
                        <Bell className="w-3 h-3 mt-0.5 shrink-0 text-gray-600" />
                        <span>Try-on not available for this piece yet — new garment models are coming.</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── VTO Modal ── */}
            {vtoModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeVTO} />
                <div className="relative glass rounded-2xl p-6 w-full max-w-lg max-h-[90vh] flex flex-col border border-violet-500/30">
                  <button onClick={closeVTO} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10">
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-3 mb-5 shrink-0">
                    <img src={vtoModal.outfit.imageUrl} alt={vtoModal.outfit.name} className="w-16 h-16 object-cover rounded-lg bg-gray-900" />
                    <div>
                      <div className="font-semibold">{vtoModal.outfit.name}</div>
                      <div className="text-xs text-gray-500 capitalize">{vtoModal.outfit.garmentType} · {vtoModal.outfit.occasion}</div>
                      <div className="text-[10px] text-gray-600 mt-0.5">Catalog preview image — not your photo, not an AI result</div>
                    </div>
                  </div>

                  <div className="overflow-y-auto flex-1 min-h-0 pr-1">
                  {/* Loading */}
                  {vtoLoading && (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                      <Loader2 className="w-10 h-10 animate-spin text-violet-400" />
                      <div className="text-sm text-gray-400 text-center">
                        YouCam VTO {vtoModal.mode === "live" ? "processing" : "rendering in mock mode"}…
                        <br />
                        <span className="text-xs text-gray-600">This may take 30–90 seconds</span>
                      </div>
                    </div>
                  )}

                  {/* Error */}
                  {vtoError && !vtoLoading && (
                    <div className="py-8 text-center">
                      <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
                      <p className="text-sm text-red-400 mb-1">{vtoError}</p>
                      <p className="text-xs text-gray-600 mb-4">
                        {vtoModal.mode === "live"
                          ? "Check YOUCAM_API_KEY and source files."
                          : "Connect YOUCAM_API_KEY for real API processing."}
                      </p>
                      <button
                        onClick={retryVTO}
                        disabled={vtoLoading}
                        className="px-4 py-2 text-xs border border-violet-500 text-violet-400 rounded hover:bg-violet-500/10 transition-colors"
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  {/* Result */}
                  {!vtoLoading && !vtoError && vtoModal.resultUrl && (
                    <div className="space-y-3">
                      <div className="w-full rounded-lg bg-gray-900" style={{ aspectRatio: "3 / 4" }}>
                        <img
                          src={vtoModal.resultUrl}
                          alt={`Try-on result for ${vtoModal.outfit.name}`}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            if (vtoModal.resultUrl) {
                              const link = document.createElement("a");
                              link.href = vtoModal.resultUrl;
                              link.download = `vto-${vtoModal.outfit.id}.png`;
                              link.click();
                            }
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {vtoModal.mode === "live" ? (
                          <>
                            <CheckCircle className="w-3 h-3 text-green-400" />
                            <span>Generated result — live render from YouCam API</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3 text-yellow-400" />
                            <span>Mock placeholder — set YOUCAM_API_KEY for real renders</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Full-body source (before any request with the current outfit is possible) */}
                  {!vtoLoading && !vtoError && !vtoModal.resultUrl && (
                    <div className="py-4 text-center">
                      <p className="text-sm text-gray-400 mb-3">
                        Start virtual try-on with a photo of yourself.
                      </p>
                      {!consentGiven ? (
                        <div className="space-y-3">
                          <div className="p-3 rounded-lg border border-violet-500/30 bg-violet-500/5 text-xs text-gray-400 text-left">
                            Your photo is sent to YouCam&apos;s AI to generate the try-on. It is used only to render this result and is not stored by us.
                          </div>
                          <button
                            onClick={() => setConsentGiven(true)}
                            className="px-4 py-2 text-xs border border-violet-500 text-violet-400 rounded hover:bg-violet-500/10 transition-colors"
                          >
                            I understand — continue
                          </button>
                        </div>
                      ) : fullBodyDataUrl ? (
                        <div className="flex flex-col items-center gap-3">
                          <img
                            src={fullBodyDataUrl}
                            alt="Your full-body photo"
                            className="w-24 h-40 object-cover rounded-lg border border-violet-500/30"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              onClick={retryVTO}
                              className="px-4 py-2 text-xs border border-violet-500 text-violet-400 rounded hover:bg-violet-500/10 transition-colors"
                            >
                              Start try-on
                            </button>
                            <button
                              onClick={() => (document.getElementById("fullbody-file") as HTMLInputElement)?.click()}
                              className="px-4 py-2 text-xs border border-gray-700 text-gray-400 rounded hover:border-gray-500 transition-colors"
                            >
                              Replace photo
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div
                            className="border-2 border-dashed border-gray-700 rounded-xl p-6 cursor-pointer hover:border-violet-500 transition-colors"
                            onClick={() => (document.getElementById("fullbody-file") as HTMLInputElement)?.click()}
                          >
                            <Shirt className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-400">Upload a full-body photo</p>
                            <p className="text-xs text-gray-600 mt-1">Front-facing, standing, unobstructed. JPG/PNG under 10MB.</p>
                          </div>
                          {fullBodyError && (
                            <p className="mt-2 text-xs text-red-400 flex items-center justify-center gap-1">
                              <X className="w-3 h-3" /> {fullBodyError}
                            </p>
                          )}
                        </>
                      )}
                      <input
                        id="fullbody-file"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFullBodyFile}
                      />
                    </div>
                  )}
                  </div>

                  {/* Actions — sticky within the modal on small screens */}
                  {fullBodyDataUrl && (
                  <div className="flex items-center gap-2 flex-wrap mt-4 pt-4 border-t border-gray-800 shrink-0 sticky bottom-0 bg-inherit">
                    <button
                      onClick={retryVTO}
                      disabled={vtoLoading}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs border border-violet-500 text-violet-400 rounded-lg hover:bg-violet-500/10 transition-colors disabled:opacity-50"
                    >
                      <Loader2 className={`w-3 h-3 ${vtoLoading ? "animate-spin" : ""}`} />
                      {vtoLoading ? "Processing…" : "Re-render"}
                    </button>
                    {vtoModal.resultUrl && !vtoLoading && (
                      <>
                        <a
                          href={vtoModal.resultUrl}
                          download={`vto-${vtoModal.outfit.id}.png`}
                          className="flex items-center gap-1.5 px-3 py-2 text-xs border border-gray-700 text-gray-400 rounded-lg hover:border-gray-500 transition-colors"
                          title="Download result"
                        >
                          <Download className="w-3 h-3" />
                          Save
                        </a>
                        <button
                          onClick={shareWhatsApp}
                          disabled={vtoLoading || !vtoModal?.outfit}
                          className="flex items-center gap-1.5 px-3 py-2 text-xs border border-gray-700 text-gray-400 rounded-lg hover:border-green-500 hover:text-green-400 transition-colors disabled:opacity-50"
                          title="Share via WhatsApp"
                        >
                          <MessageCircle className="w-3 h-3" />
                          WhatsApp
                        </button>
                        <button
                          onClick={copyShareLink}
                          disabled={vtoLoading}
                          className={`flex items-center gap-1.5 px-3 py-2 text-xs border rounded-lg transition-colors ${
                            copyStatus === "copied"
                              ? "border-green-500/50 text-green-400 bg-green-500/10"
                              : "border-gray-700 text-gray-400 hover:border-gray-500"
                          } disabled:opacity-50`}
                          title={copyStatus === "copied" ? "Link copied!" : "Copy share link"}
                        >
                          {copyStatus === "copied" ? <CheckCircle className="w-3 h-3" /> : <Share2 className="w-3 h-3" />}
                          {copyStatus === "copied" ? "Copied" : "Share"}
                        </button>
                      </>
                    )}
                  </div>
                  )}
                  {copyStatus === "error" && (
                    <p className="text-xs text-red-400 mt-2 text-center">Failed to copy link — please copy manually.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
