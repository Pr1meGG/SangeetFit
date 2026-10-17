"use client";

// force-dynamic: useSearchParams() 在 client component 中需要动态渲染
export const dynamic = "force-dynamic";

import { useState, useCallback, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { X, CheckCircle, Shirt, ArrowLeft, Palette, Heart, Loader2, AlertCircle, Download, Share2, Link, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import { OUTFITS, type Outfit, type Occasion } from "@/data/outfits";
import { hueSimilarity } from "@/lib/color";

const OCCASIONS: { id: Occasion; label: string }[] = [
  { id: "sangeet", label: "Sangeet" },
  { id: "mehendi", label: "Mehendi" },
  { id: "haldi", label: "Haldi" },
  { id: "wedding", label: "Wedding" },
  { id: "reception", label: "Reception" },
];

type Step = 1 | 2 | 3;

interface SkinResult {
  success: boolean;
  skin_color?: string;
  mode?: string;
  error?: string;
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
  const [skinColor, setSkinColor] = useState<string | null>(null);
  const [skinError, setSkinError] = useState<string | null>(null);
  const [skinLoading, setSkinLoading] = useState(false);
  const [vtoLoading, setVtoLoading] = useState(false);
  const [vtoError, setVtoError] = useState<string | null>(null);
  const [vtoModal, setVtoModal] = useState<{ open: boolean; outfit: Outfit; resultUrl: string; mode: string } | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const [showShortlist, setShowShortlist] = useState(false);

  const handleRestore = useCallback((params: { step?: Step; occasion?: Occasion; skin?: string; vto?: string }) => {
    if (params.occasion) setOccasion(params.occasion);
    if (params.skin) setSkinColor(params.skin);
    if (params.step) setStep(params.step);
    if (params.vto && params.skin) {
      const outfit = OUTFITS.find(o => o.id === params.vto);
      if (outfit) {
        setVtoModal({ open: true, outfit, resultUrl: "", mode: "" });
        setTimeout(() => runVTO(outfit.id, outfit.category), 100);
      }
    }
  }, []);

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
    setVtoModal({ open: true, outfit, resultUrl: "", mode: "" });
    setVtoError(null);
    runVTO(outfit.id, outfit.category);
  }, []);

  const runVTO = useCallback(
    async (garmentId: string, category: string) => {
      setVtoLoading(true);
      try {
        const res = await fetch("/api/vto", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: "user_skin", garmentId, category }),
        });
        const data = await res.json();
        if (data.success && data.resultUrl) {
      setVtoModal(prev => prev ? { ...prev, resultUrl: data.resultUrl, mode: data.mode || "mock" } : null);
        } else {
          setVtoError(data.error || "VTO failed");
        }
      } catch (err: any) {
        setVtoError(err.message || "VTO request failed");
      } finally {
        setVtoLoading(false);
      }
    },
    []
  );

  const retryVTO = useCallback(() => {
    if (vtoModal) runVTO(vtoModal.outfit.id, vtoModal.outfit.category);
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
    const text = `我在 SangeetFit 为你找到了这件 ${vtoModal.outfit.name}，适合${vtoModal.outfit.occasion}！来看看：${window.location.origin}/?step=3&occasion=${encodeURIComponent(vtoModal.outfit.occasion)}&vto=${encodeURIComponent(vtoModal.outfit.id)}`;
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
    const filtered = OUTFITS.filter(o => o.occasion === occasion);
    if (showShortlist) return filtered.filter(o => favorites.has(o.id));
    return filtered.sort((a, b) => {
      const sa = skinColor ? hueSimilarity(skinColor, a.primaryColor) : null;
      const sb = skinColor ? hueSimilarity(skinColor, b.primaryColor) : null;
      if (sa === null && sb === null) return 0;
      if (sa === null) return 1;
      if (sb === null) return -1;
      return sb - sa;
    });
  }, [occasion, skinColor, favorites, showShortlist]);

  const shortlistCount = favorites.size;

  const stepLabel = (s: Step) => (s === 1 ? "Select occasion" : s === 2 ? "Skin-tone analysis" : "Curated gallery");

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
                const reader = new FileReader();
                reader.onload = (ev) => analyzeSkin(ev.target?.result as string);
                reader.readAsDataURL(file);
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
            <div className="flex items-center justify-between">
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

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {curated.map((o: Outfit) => {
                const sim = skinColor ? hueSimilarity(skinColor, o.primaryColor) : null;
                const score = sim == null ? null : Math.round(sim * 100);
                return (
                  <div
                    key={o.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => openVTO(o)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openVTO(o); } }}
                    className={`group p-3 rounded-lg border transition-all cursor-pointer ${
                      vtoLoading ? "opacity-60 cursor-not-allowed" : "border-gray-700 hover:border-violet-500 hover:bg-violet-500/5"
                    }`}
                  >
                    <div className="relative">
                      <img src={o.imageUrl} alt={o.name} className="w-full h-32 object-cover rounded mb-2 bg-gray-900" />
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
                    <div className="text-xs text-gray-500">{o.category}</div>
                    {score != null && (
                      <div className="mt-2 text-xs flex items-center gap-1">
                        <Palette className="w-3 h-3" style={{ backgroundColor: o.primaryColor }} />
                        <span className="text-green-400">{score}% harmony</span>
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
                <div className="relative glass rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-violet-500/30">
                  <button onClick={closeVTO} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-3 mb-5">
                    <img src={vtoModal.outfit.imageUrl} alt={vtoModal.outfit.name} className="w-16 h-16 object-cover rounded-lg bg-gray-900" />
                    <div>
                      <div className="font-semibold">{vtoModal.outfit.name}</div>
                      <div className="text-xs text-gray-500">{vtoModal.outfit.category} · {vtoModal.outfit.occasion}</div>
                    </div>
                  </div>

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
                      <img
                        src={vtoModal.resultUrl.startsWith("/") ? vtoModal.resultUrl : ""}
                        alt={`Try-on result for ${vtoModal.outfit.name}`}
                        className="w-full rounded-lg bg-gray-900"
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
                      {!vtoModal.resultUrl.startsWith("http") && !vtoModal.resultUrl.startsWith("/") && (
                        <div className="p-3 rounded-lg bg-violet-500/5 border border-violet-500/20 text-xs text-gray-400 font-mono break-all">
                          {vtoModal.resultUrl}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {vtoModal.mode === "live" ? (
                          <CheckCircle className="w-3 h-3 text-green-400" />
                        ) : (
                          <AlertCircle className="w-3 h-3 text-yellow-400" />
                        )}
                        <span>
                          {vtoModal.mode === "live"
                            ? "Live render from YouCam API"
                            : "Mock result — set YOUCAM_API_KEY for real renders"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Initial state (before any request) */}
                  {!vtoLoading && !vtoError && !vtoModal.resultUrl && (
                    <div className="py-8 text-center text-sm text-gray-500">
                      Click below to start virtual try-on
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-5 pt-4 border-t border-gray-800">
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
