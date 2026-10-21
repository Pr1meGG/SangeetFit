"use client";

// force-dynamic: useSearchParams() 在 client component 中需要动态渲染
export const dynamic = "force-dynamic";

import { useState, useCallback, useMemo, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { X, CheckCircle, Shirt, ArrowLeft, ArrowRight, ArrowUpRight, Palette, Heart, Loader2, AlertCircle, Download, Share2, MessageCircle, Camera, Upload, ShieldCheck, Music2, Leaf, Sun, Sparkles, House, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import { OUTFITS, type Outfit, type Occasion, type Audience, type StyleLevel } from "@/data/outfits";
import { recommendOutfits, getVerifiedSellerUrl } from "@/lib/styling";
import type { SessionOutfit, GeneratedLook } from "@/lib/session";
import WardrobeUpload from "@/components/WardrobeUpload";
import LookComparison from "@/components/LookComparison";
import { compressImageForUpload, PERSON_UPLOAD_BYTES, assertVtoPayloadSize } from "@/lib/image";
import { FaceCameraCapture } from "@/components/FaceCameraCapture";
import GarmentCredit from "@/components/GarmentCredit";

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
  const [stylePreference, setStylePreference] = useState<StyleLevel | "">("");
  const [preferredColor, setPreferredColor] = useState("");
  const [skinColor, setSkinColor] = useState<string | null>(null);
  const [skinMode, setSkinMode] = useState("");
  const [skinError, setSkinError] = useState<string | null>(null);
  const [skinLoading, setSkinLoading] = useState(false);
  const [showFaceCamera, setShowFaceCamera] = useState(false);
  const [owned, setOwned] = useState<SessionOutfit[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [fullBodyDataUrl, setFullBodyDataUrl] = useState<string | null>(null);
  const [fullBodyError, setFullBodyError] = useState<string | null>(null);
  const [photoProcessing, setPhotoProcessing] = useState(false);
  const [photoVersion, setPhotoVersion] = useState(0);
  const [vtoLoading, setVtoLoading] = useState(false);
  const [vtoError, setVtoError] = useState<{ outfitId: string; message: string } | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [vtoModal, setVtoModal] = useState<{ outfit: SessionOutfit; resultUrl: string; mode: string } | null>(null);
  const [looks, setLooks] = useState<GeneratedLook[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const [showShortlist, setShowShortlist] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [query, setQuery] = useState("");
  const [resultImageError, setResultImageError] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const dialogRef = useRef<HTMLElement>(null);
  const inFlight = useRef(false);
  const photoSelection = useRef(0);
  const modalId = step === 3 ? vtoModal?.outfit.id : undefined;

  useEffect(() => {
    if (!modalId) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setVtoModal(null);
      }
      if (event.key !== "Tab") return;
      const controls = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]):not(.hidden), [tabindex="0"]') ?? []).filter(el => el.getClientRects().length > 0);
      const first = controls[0], last = controls[controls.length - 1];
      if (!first) { event.preventDefault(); return; }
      const outside = !dialogRef.current?.contains(document.activeElement) || document.activeElement === dialogRef.current;
      if (event.shiftKey && (document.activeElement === first || outside)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || outside)) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = overflow; document.removeEventListener("keydown", onKeyDown); previous?.focus(); };
  }, [modalId]);

  const runVTO = useCallback(async (outfit: SessionOutfit) => {
    const src = fullBodyDataUrl;
    if (inFlight.current || photoProcessing || rateLimited) return;
    if (!src) { setVtoError({ outfitId: outfit.id, message: "Please upload a full-body photo before trying on outfits." }); return; }
    if (outfit.tryOnStatus === "blocked" || (!outfit.uploadedGarment && (!outfit.vtoSupported || !outfit.tryOnReference))) {
      setVtoError({ outfitId: outfit.id, message: "Try-on is not available for this piece." }); return;
    }
    const payload = outfit.uploadedGarment ? {
      fullBodyDataUrl: src,
      garmentImageDataUrl: outfit.uploadedGarment.imageDataUrl,
      garmentCategory: outfit.uploadedGarment.category,
    } : {
      fullBodyDataUrl: src, garmentId: outfit.id, referenceAsset: outfit.tryOnReference,
      vtoSupported: outfit.vtoSupported, displayImage: outfit.imageUrl,
    };
    try { assertVtoPayloadSize(payload); }
    catch (error) { setVtoError({ outfitId: outfit.id, message: error instanceof Error ? error.message : "Photos are too large together." }); return; }
    const started = performance.now();
    inFlight.current = true; setVtoLoading(true); setVtoError(null); setResultImageError(false); setShowOriginal(false);
    try {
      const res = await fetch("/api/vto", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.status === 429) setRateLimited(true);
      const data: VTOResult = await res.json().catch(() => ({ success: false, error: res.status === 429 ? "Rate limit reached. Wait before another attempt." : "The try-on server returned an unreadable response." }));
      if (!data.success || !data.resultUrl || (data.mode !== "live" && data.mode !== "mock")) throw new Error(data.error || "Try-on did not complete. Check your photos and try again.");
      const look: GeneratedLook = {
        id: `${outfit.id}:${photoVersion}`, outfit, resultUrl: data.resultUrl, mode: data.mode,
        sourceDataUrl: src, sourceVersion: photoVersion, durationMs: Math.round(performance.now() - started),
      };
      setLooks(previous => [look, ...previous.filter(item => item.id !== look.id)].slice(0, 2));
      // Photo replacement is locked while pending; reopening this outfit must reuse its completed task.
      setVtoModal(previous => previous?.outfit.id === outfit.id ? { ...previous, resultUrl: look.resultUrl, mode: look.mode } : previous);
    } catch (error) {
      setVtoError({ outfitId: outfit.id, message: error instanceof Error ? error.message : "VTO request failed" });
    } finally { inFlight.current = false; setVtoLoading(false); }
  }, [fullBodyDataUrl, photoProcessing, photoVersion, rateLimited]);

  const handleRestore = useCallback((params: { step?: Step; occasion?: Occasion; skin?: string; vto?: string }) => {
    if (params.occasion) setOccasion(params.occasion);
    if (params.skin) setSkinColor(params.skin);
    if (params.step) setStep(params.step);
    if (params.vto) {
      const outfit = OUTFITS.find(item => item.id === params.vto && item.vtoSupported && item.tryOnStatus !== "blocked");
      if (outfit) { setStep(3); setVtoModal({ outfit, resultUrl: "", mode: "" }); }
    }
  }, []);

  const analyzeSkin = useCallback(async (dataUrl: string) => {
    setSkinError(null); setSkinLoading(true);
    try {
      const res = await fetch("/api/skin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ imageDataUrl: dataUrl }) });
      const data: SkinResult = await res.json();
      if (!data.success || !data.skin_color) throw new Error(data.error || "Skin analysis failed");
      setSkinColor(data.skin_color); setSkinMode(data.mode || "mock");
    } catch (error) { setSkinError(error instanceof Error ? error.message : "Skin analysis failed"); }
    finally { setSkinLoading(false); }
  }, []);

  const openVTO = useCallback((outfit: SessionOutfit) => {
    if (!outfit.vtoSupported || outfit.tryOnStatus === "blocked") return;
    const saved = looks.find(look => look.outfit.id === outfit.id && look.sourceVersion === photoVersion);
    setVtoModal({ outfit, resultUrl: saved?.resultUrl || "", mode: saved?.mode || "" });
    setFullBodyError(null); setResultImageError(false); setShowOriginal(false);
  }, [looks, photoVersion]);

  const retryVTO = () => { if (vtoModal) void runVTO(vtoModal.outfit); };
  const closeVTO = () => setVtoModal(null);
  const copyShareLink = async () => {
    if (!vtoModal || vtoModal.outfit.origin === "upload") return;
    const url = `${window.location.origin}/?step=3&occasion=${encodeURIComponent(occasion)}&vto=${encodeURIComponent(vtoModal.outfit.id)}`;
    try { await navigator.clipboard.writeText(url); setCopyStatus("copied"); }
    catch { setCopyStatus("error"); }
  };
  const shareWhatsApp = () => {
    if (!vtoModal || vtoModal.outfit.origin === "upload") return;
    const text = `${vtoModal.outfit.name} for ${occasion}: ${window.location.origin}/?step=3&occasion=${encodeURIComponent(occasion)}&vto=${encodeURIComponent(vtoModal.outfit.id)}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };
  const toggleFavorite = (outfitId: string) => setFavorites(previous => {
    const next = new Set(previous); if (next.has(outfitId)) next.delete(outfitId); else next.add(outfitId); return next;
  });

  const allOutfits = useMemo<SessionOutfit[]>(() => [...owned, ...OUTFITS], [owned]);
  const recommendations = useMemo(() => recommendOutfits(allOutfits, {
    occasion, audience, styleLevel: stylePreference || undefined, preferredColor: preferredColor || undefined,
  }), [allOutfits, occasion, audience, stylePreference, preferredColor]);
  const curated = useMemo(() => {
    const list = showShortlist ? allOutfits.filter(outfit => favorites.has(outfit.id)).map(outfit => ({ outfit, reason: "Saved by you in this session." })) : recommendations;
    return list.filter(({ outfit }) => `${outfit.name} ${outfit.garmentType}`.toLowerCase().includes(query.trim().toLowerCase()));
  }, [allOutfits, showShortlist, favorites, recommendations, query]);
  const shortlistCount = favorites.size;
  const failedOutfit = vtoError ? allOutfits.find(outfit => outfit.id === vtoError.outfitId) : undefined;

  const handleFullBodyFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; event.target.value = "";
    if (!file || inFlight.current) return;
    if (!file.type.startsWith("image/")) { setFullBodyError("Please upload an image file"); return; }
    if (file.size > 10 * 1024 * 1024) { setFullBodyError("Full-body photo must be under 10MB"); return; }
    const selection = ++photoSelection.current;
    setFullBodyError(null); setPhotoProcessing(true);
    try {
      const dataUrl = await compressImageForUpload(file, 2048, PERSON_UPLOAD_BYTES);
      if (selection !== photoSelection.current) return;
      setFullBodyDataUrl(dataUrl); setPhotoVersion(previous => previous + 1);
      setVtoModal(previous => previous ? { ...previous, resultUrl: "", mode: "" } : previous);
      setVtoError(null); setResultImageError(false);
    } catch (error) { setFullBodyError(error instanceof Error ? error.message : "Could not process the image"); }
    finally { if (selection === photoSelection.current) setPhotoProcessing(false); }
  };

  return (
    <main className="sf-app">
      <Suspense fallback={null}><SearchParamHandler onRestore={handleRestore} /></Suspense>
      <Navbar />
      <div className="sf-main">
        {step === 1 && (
          <>
            <section className="sf-welcome">
              <div className="sf-welcome-copy">
                <span className="sf-season"><span aria-hidden="true">✳</span> A celebration to dress for</span>
                <h1>Your occasion.<br />Your kind of look.</h1>
                <p>A little inspiration. A look that feels like you. Browse celebration outfits now, then try one on your own photo when you’re ready.</p>
                <Link className="sf-button sf-button-primary" href="/library">Explore outfits <ArrowRight size={18} /></Link>
                <button className="sf-text-link" onClick={() => { setStep(3); setShowUpload(true); }}>Try my own clothes <ArrowRight size={17} /></button>
                <span className="sf-welcome-foot"><Shirt size={16} /> Outfit ideas, made personal.</span>
              </div>
              <div className="sf-collage" aria-label="Indian celebration outfit inspiration">
                <div className="sf-collage-main"><img src="/garment_test/library/navy-gold-lehenga.png" alt="Navy and gold lehenga inspiration" /><span>Sangeet nights</span></div>
                <div className="sf-collage-small"><img src="/garment_test/library/gold-silk-kurta.jpg" alt="Gold silk kurta inspiration" /><span>A little festive</span></div>
                <span className="sf-collage-flower" aria-hidden="true">✳</span>
                <div className="sf-collage-note"><Heart size={16} /> Find your festive side.</div>
              </div>
            </section>
            <section id="occasions" className="sf-occasion-section">
              <div className="sf-section-heading"><div><h2>What are we dressing for?</h2><p>Pick a function. We’ll bring the outfit ideas.</p></div><span className="sf-small-note">Your plans, your style</span></div>
              <div className="sf-occasions">
                {OCCASIONS.map((o, i) => {
                  const Icon = [Music2, Leaf, Sun, Heart, Sparkles][i];
                  return <button key={o.id} aria-label={o.label} className={`sf-occasion sf-occasion-${o.id}`} onClick={() => { setOccasion(o.id); setStep(2); setShowShortlist(false); }}>
                    <span className="sf-occasion-icon"><Icon size={25} strokeWidth={1.4} /></span><strong>{o.label}</strong><span>{["Dance-floor moments", "Colourful afternoons", "A little sunshine", "The big celebration", "An evening to remember"][i]}</span><ArrowUpRight className="sf-occasion-arrow" size={17} />
                  </button>;
                })}
              </div>
            </section>
            <section className="sf-home-footer"><div><Sparkles size={20} /><p><strong>Just looking for inspiration?</strong><span>Explore the reference collection. No selfie needed.</span></p></div><Link href="/library" className="sf-text-link">See full collection <ArrowRight size={17} /></Link></section>
            <div className="sf-photo-attribution"><GarmentCredit source={OUTFITS.find(o => o.id === "library-navy-gold-lehenga")?.source} /><GarmentCredit source={OUTFITS.find(o => o.id === "library-gold-silk-kurta")?.source} /></div>
          </>
        )}

        {step === 2 && (
          <section className="sf-personalize">
            <div className="sf-personalize-copy">
              <button className="sf-back" onClick={() => { setShowFaceCamera(false); setStep(1); }}><ArrowLeft size={17} /> Occasions</button>
              <span className="sf-context">Getting ready for {occasion}</span>
              <h1>A little more you.</h1>
              <p>Add a selfie to explore colours close to your skin tone. Or go straight to the outfits—your taste leads the way.</p>
              <div className="sf-personalize-note"><Palette size={22} /><div><strong>Colour is a starting point.</strong><p>Similar colours aren’t a rule for what suits you. Try a look and decide for yourself.</p></div></div>
              <button className="sf-text-link" disabled={skinLoading} onClick={() => { setShowFaceCamera(false); setStep(3); }}>Skip for now, explore outfits <ArrowRight size={17} /></button>
            </div>
            <div className="sf-selfie-panel">
              <div className="sf-panel-heading"><div><h2>Skin-tone analysis</h2><p>Optional · a clear, front-facing selfie</p></div><Camera size={22} /></div>
              {showFaceCamera && <FaceCameraCapture onClose={() => setShowFaceCamera(false)} onCapture={file => {
                setShowFaceCamera(false); setSkinError(null);
                compressImageForUpload(file, 1280, 1_500_000)
                  .then(dataUrl => analyzeSkin(dataUrl))
                  .catch(err => setSkinError((err as Error).message || "Could not process the captured photo"));
              }} />}
              <button type="button" disabled={skinLoading} className="sf-button sf-button-primary sf-full" onClick={() => setShowFaceCamera(v => !v)}><Camera size={18} /> {showFaceCamera ? "Hide camera" : "Use camera instead"}</button>
              <div className="sf-or"><span />or upload a photo<span /></div>
              <label className={`sf-upload ${skinLoading ? "sf-upload-disabled" : ""}`}>
                <Upload size={26} strokeWidth={1.5} /><strong>Click to upload selfie</strong><span>JPG or PNG · up to 10 MB</span>
                <input id="selfie-file" type="file" accept="image/jpeg,image/png" className="sr-only" disabled={skinLoading} onChange={e => {
                  const file = e.target.files?.[0]; e.target.value = "";
                  if (!file) return;
                  if (!file.type.startsWith("image/")) { setSkinError("Please upload an image file"); return; }
                  if (file.size > 10 * 1024 * 1024) { setSkinError("Image must be under 10MB"); return; }
                  setSkinError(null);
                  compressImageForUpload(file, 1280, 1_500_000)
                    .then(dataUrl => analyzeSkin(dataUrl))
                    .catch(err => setSkinError((err as Error).message || "Could not process the image"));
                }} />
              </label>
              <p className="sf-privacy"><ShieldCheck size={15} /> By adding a photo, you agree to send it to YouCam for analysis when live AI is enabled.</p>
              {skinError && <p role="alert" className="sf-alert sf-alert-error"><AlertCircle size={17} />{skinError}</p>}
              {skinLoading && <p role="status" className="sf-alert"><Loader2 size={18} className="animate-spin" />Analyzing with YouCam API…</p>}
              {skinColor && <div className="sf-tone-result" role="status"><div className="sf-tone-swatch" style={{ backgroundColor: skinColor }} /><div><strong>Detected skin tone</strong><span>{skinColor}{skinMode === "mock" ? " · Mock sample" : " · Colour reference"}</span></div><CheckCircle size={20} /><button className="sf-button sf-button-primary sf-full" onClick={() => setStep(3)}>Continue to gallery <ArrowRight size={17} /></button></div>}
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="sf-gallery">
            <button className="sf-back" onClick={() => { setShowShortlist(false); setStep(1); }}><ArrowLeft size={17} /> Occasions</button>
            <div className="sf-gallery-heading"><div><span className="sf-context">{showShortlist ? "Saved by you, this session" : `Getting dressed for ${occasion}`}</span><h1>{showShortlist ? "Your shortlist." : "Your clothes. Your kind of look."}</h1><p>Choose from your clothes or a live-reviewed reference. Try a look on your photo, compare two results, and keep your favourite.</p></div><div className="sf-action-row"><button className="sf-button sf-button-primary" onClick={() => setShowUpload(true)}><Upload size={17} />Add my outfit</button><button className="sf-button sf-button-secondary" aria-pressed={showShortlist} onClick={() => setShowShortlist(value => !value)}><Heart size={17} />Shortlist ({shortlistCount})</button></div></div>
            {vtoError && failedOutfit && modalId !== failedOutfit.id && <div role="alert" className="sf-alert sf-alert-error"><span>Try-on for {failedOutfit.name}: {vtoError.message}</span><button className="sf-text-link" onClick={() => openVTO(failedOutfit)}>Review try-on</button></div>}
            {showUpload && <WardrobeUpload occasion={occasion} onClose={() => setShowUpload(false)} onAdd={outfit => { setOwned(previous => [...previous, outfit]); setShowUpload(false); setShowShortlist(false); }} />}
            <div className="sf-occasion-tabs" aria-label="Choose occasion">{OCCASIONS.map(item => <button key={item.id} aria-pressed={occasion === item.id} className={`sf-chip ${occasion === item.id ? "is-active" : ""}`} onClick={() => setOccasion(item.id)}>{item.label}</button>)}</div>
            <div className="sf-gallery-toolbar"><div className="sf-audiences" aria-label="Collection">{AUDIENCES.map(item => <button key={item.id} className={audience === item.id ? "is-active" : ""} aria-pressed={audience === item.id} onClick={() => setAudience(item.id)}>{item.label}</button>)}</div><label className="sf-search"><Search size={17} /><span className="sr-only">Search outfit ideas</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Find one of your outfits…" type="search" /></label></div>
            <div className="sf-preferences"><label>Style preference<select value={stylePreference} onChange={event => setStylePreference(event.target.value as StyleLevel | "")}><option value="">Any style</option><option value="minimal">Minimal</option><option value="festive">Festive</option><option value="statement">Statement</option></select></label><label>Preferred colour<select value={preferredColor} onChange={event => setPreferredColor(event.target.value)}><option value="">Any colour</option><option value="#6b1e3a">Burgundy</option><option value="#d4af37">Gold</option><option value="#1f3a5f">Navy</option><option value="#f7f1e5">Ivory</option><option value="#111111">Black</option><option value="#35634c">Green</option></select></label><button className="sf-text-link" onClick={() => setStep(2)}><Palette size={16} />{skinColor ? "View skin-tone reference" : "Optional skin-tone analysis"}</button></div>
            <div className="sf-gallery-meta"><span>{curated.length} {showShortlist ? "saved" : "recommended"} {curated.length === 1 ? "outfit" : "outfits"}</span><span>Occasion tags · your style · your colours</span></div>
            {curated.length === 0 && <div className="sf-empty"><Shirt size={34} strokeWidth={1.2} /><h2>{showShortlist ? "Keep a look you love." : "Start with something you own."}</h2><p>{showShortlist ? "Tap the heart on an outfit to keep it here." : "No live-reviewed catalogue options or tagged personal outfits match these choices yet. Add your own garment to get started."}</p><button className="sf-button sf-button-primary" onClick={() => { setShowUpload(true); setShowShortlist(false); }}>Add an outfit</button><Link className="sf-text-link" href="/library">Browse reference candidates</Link></div>}
            <div className="sf-outfit-grid">{curated.map(({ outfit: item, reason }) => <article key={item.id} className="sf-outfit-card">
              <div className="sf-outfit-image"><button className="sf-outfit-open" onClick={() => openVTO(item)} aria-label={`Try on ${item.name}`}><img src={item.imageUrl} alt={item.name} loading="lazy" /></button><button type="button" className={`sf-heart ${favorites.has(item.id) ? "is-active" : ""}`} aria-pressed={favorites.has(item.id)} onClick={() => toggleFavorite(item.id)} aria-label={`${favorites.has(item.id) ? "Remove" : "Add"} ${item.name} ${favorites.has(item.id) ? "from" : "to"} shortlist`}><Heart size={18} fill={favorites.has(item.id) ? "currentColor" : "none"} /></button><span className="sf-outfit-badge">{item.origin === "upload" ? "Your clothes" : "Live-reviewed reference"}</span></div>
              <div className="sf-outfit-info"><div className="sf-outfit-type"><span>{item.styleLevel}</span><span className="sf-palette"><i style={{ backgroundColor: item.primaryColor }} /></span></div><h2>{item.name}</h2><p className="sf-recommendation-reason">{reason}</p><button className="sf-outfit-action" onClick={() => openVTO(item)}><Shirt size={16} />Try this look <ArrowUpRight size={16} /></button>{getVerifiedSellerUrl(item) && <a className="sf-text-link" href={getVerifiedSellerUrl(item)!} target="_blank" rel="noopener noreferrer">View at seller</a>}<GarmentCredit source={item.source} /></div>
            </article>)}</div>
            {owned.length > 0 && <details className="sf-my-clothes"><summary>All my clothes ({owned.length})</summary><p>Your outfits stay here even when they don’t match this occasion’s tags. You can always try one manually.</p><div className="sf-owned-list">{owned.map(item => <div key={item.id}><img src={item.imageUrl} alt="" /><div><strong>{item.name}</strong><span>{item.occasionTags.join(", ")}</span></div><button className="sf-text-link" onClick={() => openVTO(item)}>Try my {item.name}</button><button className="sf-icon-button" aria-label={`Remove garment ${item.name}`} disabled={vtoLoading} onClick={() => { setOwned(previous => previous.filter(outfit => outfit.id !== item.id)); setFavorites(previous => { const next = new Set(previous); next.delete(item.id); return next; }); }}><X size={17} /></button></div>)}</div></details>}
            <LookComparison looks={looks} onRemove={id => setLooks(previous => previous.filter(look => look.id !== id))} />
            <p className="sf-gallery-footnote"><Sparkles size={16} />Recommendations use confirmed tags and preferences. Your personal style gets the final say.</p>
          </section>
        )}
      </div>
      {!showFaceCamera && <nav className="sf-bottom-nav" aria-label="App navigation"><button aria-current={step !== 3 || !showShortlist ? "page" : undefined} onClick={() => { setStep(1); setShowShortlist(false); }}><House size={20} />For you</button><Link href="/library"><Search size={20} />Explore</Link><button onClick={() => { setStep(3); setShowUpload(true); setShowShortlist(false); }}><Shirt size={20} />My clothes</button><button aria-current={step === 3 && showShortlist ? "page" : undefined} onClick={() => { setStep(3); setShowShortlist(true); setQuery(""); setAudience("all"); }}><Heart size={20} />Shortlist{shortlistCount > 0 && <span>{shortlistCount}</span>}</button></nav>}
      {step === 3 && vtoModal && (
        <div className="sf-modal-backdrop" onClick={closeVTO}>
          <section className="sf-tryon-dialog" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="tryon-title" tabIndex={-1} onClick={event => event.stopPropagation()}>
            <header className="sf-dialog-header"><div><span className="sf-context">Your fitting room</span><h2 id="tryon-title">Make this look yours.</h2></div><button className="sf-icon-button" aria-label="Close try-on" onClick={closeVTO}><X size={21} /></button></header>
            <div className="sf-dialog-content">
              <div className="sf-selected-outfit"><img src={vtoModal.outfit.imageUrl} alt={vtoModal.outfit.name} /><div><strong>{vtoModal.outfit.name}</strong><span>{occasion} · {vtoModal.outfit.garmentType.replaceAll("-", " ")}</span><small>{vtoModal.outfit.origin === "upload" ? "Your garment reference" : "Catalogue reference"}</small></div></div>
              {vtoLoading && <div className="sf-generating" role="status"><div className="sf-generating-icon"><Shirt size={34} strokeWidth={1.2} /><Loader2 className="animate-spin" size={20} /></div><h3>Putting your look together.</h3><p>One try-on is processing. You can close this view; the submitted task may still finish. No extra task will start while it is pending.</p></div>}
              {rateLimited && <p role="alert" className="sf-alert sf-alert-error">Rate limit reached. No task will be retried automatically. Wait before reloading to try again.</p>}
              {vtoError?.outfitId === vtoModal.outfit.id && !vtoLoading && <p className="sf-alert sf-alert-error" role="alert">{vtoError.message}</p>}
              {!vtoLoading && vtoModal.resultUrl && <div className="sf-result"><div className="sf-result-image">{resultImageError ? <div className="sf-empty" role="alert"><AlertCircle size={26} /><p>The result couldn’t load; its link may have expired. Reopen or reload this image before generating another look.</p><a className="sf-button sf-button-secondary" href={vtoModal.resultUrl} target="_blank" rel="noopener noreferrer">Open image</a><button className="sf-text-link" onClick={() => setResultImageError(false)}>Reload image</button></div> : <img src={showOriginal && fullBodyDataUrl ? fullBodyDataUrl : vtoModal.resultUrl} alt={`Try-on result for ${vtoModal.outfit.name}`} onError={() => setResultImageError(true)} />}</div><button className="sf-text-link" aria-pressed={showOriginal} onClick={() => { setShowOriginal(value => !value); setResultImageError(false); }}>{showOriginal ? "Show result" : "Show original"}</button><p className={`sf-result-status ${vtoModal.mode === "live" ? "is-live" : ""}`}>{vtoModal.mode === "live" ? <><CheckCircle size={16} />Generated result — live render from YouCam API</> : <><AlertCircle size={16} />Mock preview — reference outfit, not a personal try-on</>}</p><p className="sf-result-caption">{vtoModal.mode === "live" ? "Check your face and garment details. AI previews don’t establish physical fit or guarantee identity preservation." : "This shows the garment reference only, not a generated image of you."}</p></div>}
              {!vtoLoading && !vtoModal.resultUrl && <div className="sf-source"><h3>A photo of you. A whole new look.</h3><p>Start virtual try-on with a photo of yourself.</p>{!consentGiven ? <div className="sf-consent"><ShieldCheck size={26} strokeWidth={1.5} /><p>When you generate in live mode, your person and garment photos are sent to YouCam. They stay in this page session on our side; the provider handles its own retention.</p><button className="sf-button sf-button-primary sf-full" onClick={() => setConsentGiven(true)}>I understand — continue <ArrowRight size={17} /></button></div> : <><label className="sf-upload sf-body-upload">{fullBodyDataUrl ? <img src={fullBodyDataUrl} alt="Your full-body photo" /> : <Upload size={30} />}<strong>{fullBodyDataUrl ? "Replace your photo" : "Upload a full-body photo"}</strong><span>Front-facing · head to toe · clear face</span><span>JPG or PNG under 10 MB</span><span className="sf-button sf-button-secondary">Choose photo</span><input aria-label="Full-body photo" type="file" accept="image/jpeg,image/png" className="sr-only" disabled={photoProcessing || vtoLoading} onChange={handleFullBodyFile} /></label><p className="sf-form-help">{photoProcessing ? "Preparing your photo…" : fullBodyDataUrl ? "Photo ready. Uploading did not start a task." : "Add a photo, review it, then generate explicitly."}</p></>}</div>}
              <input id="fullbody-file" aria-label="Replace full-body photo" type="file" accept="image/jpeg,image/png" className="hidden" disabled={photoProcessing || vtoLoading || !consentGiven} onChange={handleFullBodyFile} />
              {fullBodyError && <p className="sf-alert sf-alert-error" role="alert">{fullBodyError}</p>}
              {vtoModal.outfit.tryOnStatus === "candidate" && vtoModal.outfit.origin !== "upload" && <p className="sf-reference-note">Candidate reference: generated garment quality has not been visually reviewed. This is a testing preview.</p>}
              <GarmentCredit source={vtoModal.outfit.source} />
            </div>
            <footer className="sf-dialog-actions">
              {!vtoModal.resultUrl && <button className="sf-button sf-button-primary" disabled={!fullBodyDataUrl || !consentGiven || photoProcessing || vtoLoading || rateLimited} onClick={retryVTO}>{vtoLoading ? "Processing…" : "Generate try-on"}</button>}
              {consentGiven && fullBodyDataUrl && <button className="sf-button sf-button-secondary" disabled={photoProcessing || vtoLoading} onClick={() => document.getElementById("fullbody-file")?.click()}>Replace photo</button>}
              {vtoModal.resultUrl && !vtoLoading && <><a className="sf-button sf-button-primary" href={vtoModal.resultUrl} download={`vto-${vtoModal.outfit.id}.png`} target="_blank" rel="noopener noreferrer"><Download size={17} />Save / open image</a>{vtoModal.outfit.origin !== "upload" && <><button className="sf-button sf-button-secondary" onClick={shareWhatsApp}><MessageCircle size={17} />WhatsApp outfit</button><button className="sf-icon-button" onClick={copyShareLink} aria-label="Copy outfit link">{copyStatus === "copied" ? <CheckCircle size={19} /> : <Share2 size={19} />}</button></>}<p role="status">{copyStatus === "copied" ? "Outfit link copied." : copyStatus === "error" ? "Could not copy the link. Please try again." : vtoModal.outfit.origin === "upload" ? "Your clothes and results are session-only. Save/open the image to keep it; no public outfit link is created." : "Share links open this outfit, not your personal photo."}</p></>}
            </footer>
          </section>
        </div>
      )}
    </main>
  );
}
