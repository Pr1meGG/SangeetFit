"use client";

// force-dynamic: useSearchParams() 在 client component 中需要动态渲染
export const dynamic = "force-dynamic";

import { useState, useCallback, useMemo, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { X, CheckCircle, Shirt, ArrowLeft, ArrowRight, ArrowUpRight, Palette, Heart, Loader2, AlertCircle, Download, Share2, MessageCircle, Camera, Upload, ShieldCheck, Music2, Leaf, Sun, Sparkles, House, Search, CalendarHeart } from "lucide-react";
import Navbar, { type NavigationView } from "@/components/Navbar";
import HomeGuide from "@/components/HomeGuide";
import SharedResultAction from "@/components/SharedResultAction";
import { OUTFITS, type Outfit, type Occasion, type Audience, type StyleLevel } from "@/data/outfits";
import { recommendOutfits, recommendReferenceOutfits, getVerifiedSellerUrl } from "@/lib/styling";
import { getColorName, getRecommendedColors } from "@/lib/palette";
import { summarizeWardrobePlan, type SessionOutfit, type GeneratedLook, type ResultSharing, type ResultAutoSave } from "@/lib/session";
import WardrobeUpload from "@/components/WardrobeUpload";
import LookComparison from "@/components/LookComparison";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { compressImageForUpload, PERSON_UPLOAD_BYTES, assertVtoPayloadSize } from "@/lib/image";
import { FaceCameraCapture } from "@/components/FaceCameraCapture";
import GarmentCredit from "@/components/GarmentCredit";
import WeddingWeekBoard from "@/components/WeddingWeekBoard";
import WardrobePlanPrint from "@/components/WardrobePlanPrint";

const OCCASIONS: { id: Occasion; label: string }[] = [
  { id: "sangeet", label: "Sangeet" },
  { id: "mehendi", label: "Mehendi" },
  { id: "haldi", label: "Haldi" },
  { id: "wedding", label: "Wedding" },
  { id: "reception", label: "Reception" },
];

const OCCASION_TAGLINES = ["Dance-floor moments", "Colourful afternoons", "A little sunshine", "The big celebration", "An evening to remember"] as const;
const SAMPLE_MODEL_PHOTO = "/garment_test/fullbody_mock.png";

const OCCASION_IMAGES: Record<Occasion, string> = {
  sangeet: "midnight-lehenga.jpg",
  mehendi: "mint-floral-anarkali.jpg",
  haldi: "saffron-sharara.jpg",
  wedding: "ivory-lehenga.jpg",
  reception: "emerald-kurta.jpg",
};

const AUDIENCES: { id: Audience | "all"; label: string }[] = [
  { id: "women", label: "Women's wear" },
  { id: "men", label: "Men's wear" },
  { id: "all", label: "All styles" },
];

type Step = 1 | 2 | 3;
type RestoreParams = { step?: Step; occasion?: Occasion; skin?: string; vto?: string; view?: "clothes" | "shortlist" | "plan" };

interface SkinResult {
  success: boolean;
  skin_color?: string;
  mode?: string;
  error?: string;
}

interface VTOResult {
  success: boolean;
  sharing?: Pick<ResultSharing, "id" | "receipt" | "accessToken">;
  resultUrl?: string;
  mode?: string;
  error?: string;
  autoSave?: { id: string; expiresAt: number } | null;
  autoSaveError?: string;
}

// Separate component to use useSearchParams() — wrapped in Suspense for prerendering
function SearchParamHandler({
  onRestore,
}: {
  onRestore: (params: RestoreParams) => void;
}) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const s = searchParams.get("step");
    const o = searchParams.get("occasion") as Occasion | null;
    const sk = searchParams.get("skin");
    const v = searchParams.get("vto");
    const view = searchParams.get("view");

    const result: RestoreParams = {};
    if (o && OCCASIONS.some(x => x.id === o)) result.occasion = o;
    if (sk && /^#[0-9A-Fa-f]{6}$/.test(sk)) result.skin = sk;
    if (s === "2") result.step = 2;
    else if (s === "3") result.step = 3;
    if (v) result.vto = v;
    if (view === "clothes" || view === "shortlist" || view === "plan") { result.step = 3; result.view = view; }

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
  const [selfieDataUrl, setSelfieDataUrl] = useState<string | null>(null);
  const [skinPreparing, setSkinPreparing] = useState(false);
  const [apiState, setApiState] = useState("checking");
  const [showFaceCamera, setShowFaceCamera] = useState(false);
  const [owned, setOwned] = useState<SessionOutfit[]>([]);
  const [weekPlan, setWeekPlan] = useState<Partial<Record<Occasion, string>>>({});
  const [showUpload, setShowUpload] = useState(false);
  const [fullBodyDataUrl, setFullBodyDataUrl] = useState<string | null>(null);
  const [fullBodyError, setFullBodyError] = useState<string | null>(null);
  const [photoProcessing, setPhotoProcessing] = useState(false);
  const [photoVersion, setPhotoVersion] = useState(0);
  const [vtoLoading, setVtoLoading] = useState(false);
  const [vtoError, setVtoError] = useState<{ outfitId: string; message: string } | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [vtoModal, setVtoModal] = useState<{ outfit: SessionOutfit; resultUrl: string; mode: string; sharing?: ResultSharing; saveRequested?: boolean; lookId?: string; autoSave?: ResultAutoSave } | null>(null);
  const [looks, setLooks] = useState<GeneratedLook[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const [showShortlist, setShowShortlist] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [autoSaveResults, setAutoSaveResults] = useState(false);
  const [query, setQuery] = useState("");
  const [resultImageError, setResultImageError] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [guideView, setGuideView] = useState<"how-it-works" | "faq" | null>(null);
  const [navigationTarget, setNavigationTarget] = useState<{ id: string } | null>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const wardrobeAnchor = useRef<HTMLDivElement>(null);
  const referenceSection = useRef<HTMLElement>(null);
  const inFlight = useRef(false);
  const savingResults = useRef(new Set<string>());
  const photoSelection = useRef(0);
  const skinSelection = useRef(0);
  const sessionEpoch = useRef(0);
  const skinInFlight = useRef(false);
  const vtoController = useRef<AbortController | null>(null);
  const skinController = useRef<AbortController | null>(null);
  const currentSession = sessionEpoch.current;
  const modalId = step === 3 ? vtoModal?.outfit.id : undefined;
  const hasSession = Boolean(fullBodyDataUrl || selfieDataUrl || owned.length || looks.length || favorites.size || Object.keys(weekPlan).length || photoProcessing || skinPreparing || vtoLoading || skinLoading);
  const generationUnavailable = apiState !== "live" && apiState !== "mock";
  const cancelPending = useCallback(() => {
    photoSelection.current++; skinSelection.current++;
    vtoController.current?.abort(); skinController.current?.abort();
  }, []);

  const loadMode = useCallback(async () => {
    setApiState("checking");
    try {
      const response = await fetch("/api/mode");
      const data = await response.json();
      if (!response.ok || !["mock", "live", "unconfigured"].includes(data.mode)) throw new Error("Mode unavailable");
      setApiState(data.mode);
    } catch { setApiState("error"); }
  }, []);

  useEffect(() => {
    void loadMode();
    return cancelPending;
  }, [loadMode, cancelPending]);

  useEffect(() => {
    if (!hasSession) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [hasSession]);

  // Each step is a separate surface. Keep its heading at the top instead of
  // inheriting the previous step's scroll offset under the sticky navbar.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [step]);

  // The wardrobe form opens inline above the catalogue. Bring it into view so
  // the bottom-nav action never appears to do nothing from deep in the grid.
  useEffect(() => {
    if (showUpload) wardrobeAnchor.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [showUpload]);

  useEffect(() => {
    const id = navigationTarget?.id || window.location.hash.slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [navigationTarget]);

  const navigateTo = useCallback((view: NavigationView) => {
    setShowFaceCamera(false);
    setShowUpload(view === "clothes");
    setShowShortlist(view === "shortlist");
    setGuideView(view === "how-it-works" || view === "faq" ? view : null);
    setStep(view === "home" || view === "how-it-works" || view === "faq" ? 1 : 3);
    if (view === "shortlist") { setQuery(""); setAudience("all"); }
    const hash = view === "how-it-works" || view === "faq" ? `#${view}` : ["#how-it-works", "#faq"].includes(window.location.hash) ? "" : window.location.hash;
    const search = new URLSearchParams(window.location.search);
    if (view !== "how-it-works" && view !== "faq") for (const key of ["step", "view", "vto"]) search.delete(key);
    const destination = window.location.pathname + (search.size ? `?${search}` : "") + hash;
    if (destination !== window.location.pathname + window.location.search + window.location.hash) {
      window.history.replaceState(window.history.state, "", destination);
    }
    setNavigationTarget({ id: view === "plan" ? "wedding-plan" : view === "clothes" ? "my-wardrobe" : view === "how-it-works" || view === "faq" ? view : "main-content" });
  }, []);

  useEffect(() => {
    const restoreGuide = () => {
      const view = window.location.hash.slice(1);
      if (view === "how-it-works" || view === "faq") navigateTo(view);
    };
    restoreGuide();
    window.addEventListener("hashchange", restoreGuide);
    return () => window.removeEventListener("hashchange", restoreGuide);
  }, [navigateTo]);

  const browseLooks = () => {
    navigateTo("plan");
    setNavigationTarget({ id: "main-content" });
  };

  const clearSession = () => {
    if (!window.confirm("Clear your photos, outfits, plan and results from this page? A submitted YouCam task may still finish; clearing this page does not delete provider copies or looks you shared with the creator.")) return;
    sessionEpoch.current++; cancelPending();
    inFlight.current = false; skinInFlight.current = false;
    setFullBodyDataUrl(null); setSelfieDataUrl(null); setOwned([]); setLooks([]); setWeekPlan({}); setFavorites(new Set());
    setVtoModal(null); setShowUpload(false); setShowFaceCamera(false); setConsentGiven(false); setAutoSaveResults(false);
    setSkinColor(null); setSkinMode(""); setSkinError(null); setFullBodyError(null); setVtoError(null);
    setVtoLoading(false); setSkinLoading(false); setPhotoProcessing(false); setSkinPreparing(false);
    setCopyStatus("idle"); setShowOriginal(false); setResultImageError(false); setPhotoVersion(0);
  };

  const removeOwned = (id: string) => {
    setOwned(previous => previous.filter(outfit => outfit.id !== id));
    setLooks(previous => previous.filter(look => look.outfit.id !== id));
    setVtoModal(previous => previous?.outfit.id === id ? null : previous);
    setVtoError(previous => previous?.outfitId === id ? null : previous);
    setWeekPlan(previous => { const next = { ...previous }; for (const event of OCCASIONS) if (next[event.id] === id) delete next[event.id]; return next; });
    setFavorites(previous => { const next = new Set(previous); next.delete(id); return next; });
  };

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

  const updateSharing = useCallback((id: string, changes: Partial<ResultSharing>) => {
    setLooks(previous => previous.map(look => look.sharing?.id === id ? { ...look, sharing: { ...look.sharing, ...changes } } : look));
    setVtoModal(previous => previous?.sharing?.id === id ? { ...previous, sharing: { ...previous.sharing, ...changes } } : previous);
  }, []);

  const privateResultLink = (sharing: ResultSharing) => `${window.location.origin}/view/${encodeURIComponent(sharing.id)}#key=${encodeURIComponent(sharing.accessToken)}`;

  const copyPrivateResult = useCallback(async (sharing: ResultSharing, epoch: number) => {
    try {
      await navigator.clipboard.writeText(privateResultLink(sharing));
      if (epoch === sessionEpoch.current) updateSharing(sharing.id, { copyFailed: false });
    } catch {
      if (epoch === sessionEpoch.current) updateSharing(sharing.id, { copyFailed: true });
    }
  }, [updateSharing]);

  const saveSharedResult = useCallback(async (sharing: ResultSharing, epoch: number) => {
    if (savingResults.current.has(sharing.id)) return;
    savingResults.current.add(sharing.id);
    updateSharing(sharing.id, { state: "saving" });
    try {
      const response = await fetch("/api/shared-results", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receipt: sharing.receipt, consent: true }), signal: AbortSignal.timeout(30_000),
      });
      if (!response.ok) throw new Error();
      const result = await response.json();
      if (result.id !== sharing.id || !Number.isFinite(result.expiresAt) || result.expiresAt * 1000 <= Date.now()) throw new Error();
      if (epoch !== sessionEpoch.current) return;
      updateSharing(sharing.id, { state: "ready", expiresAt: result.expiresAt });
      void copyPrivateResult(sharing, epoch);
    } catch {
      if (epoch === sessionEpoch.current) updateSharing(sharing.id, { state: "error" });
    } finally { savingResults.current.delete(sharing.id); }
  }, [copyPrivateResult, updateSharing]);

  const removeSharedResult = async (sharing: ResultSharing) => {
    if (savingResults.current.has(sharing.id)) return;
    const epoch = sessionEpoch.current;
    savingResults.current.add(sharing.id);
    try {
      const response = await fetch(`/api/shared-results/${encodeURIComponent(sharing.id)}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${sharing.accessToken}` }, signal: AbortSignal.timeout(15_000),
      });
      if (!response.ok && response.status !== 404) throw new Error();
      if (epoch === sessionEpoch.current) updateSharing(sharing.id, { state: "removed", copyFailed: false });
    } finally { savingResults.current.delete(sharing.id); }
  };

  const retryAutoSave = async (look: GeneratedLook) => {
    const receipt = look.autoSave?.receipt;
    const lock = `auto:${receipt}`;
    if (!receipt || savingResults.current.has(lock)) return;
    const epoch = sessionEpoch.current;
    const update = (changes: Partial<ResultAutoSave>) => {
      if (epoch !== sessionEpoch.current) return;
      setLooks(previous => previous.map(item => item.id === look.id && item.autoSave?.receipt === receipt ? { ...item, autoSave: { ...item.autoSave, ...changes } } : item));
      setVtoModal(previous => previous?.lookId === look.id && previous.autoSave?.receipt === receipt ? { ...previous, autoSave: { ...previous.autoSave, ...changes } } : previous);
    };
    savingResults.current.add(lock);
    update({ state: "saving" });
    try {
      const signal = AbortSignal.timeout(30_000);
      let garmentImageDataUrl = look.outfit.uploadedGarment?.imageDataUrl;
      if (!garmentImageDataUrl) {
        const response = await fetch(`/garment_test/${look.outfit.tryOnReference}`, { signal });
        if (!response.ok) throw new Error();
        const blob = await response.blob();
        garmentImageDataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error());
          reader.onerror = () => reject(new Error());
          reader.readAsDataURL(blob);
        });
      }
      const response = await fetch("/api/auto-saved", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receipt, personImageDataUrl: look.sourceDataUrl, garmentImageDataUrl }), signal,
      });
      if (!response.ok) throw new Error();
      const result = await response.json();
      if (result.id !== look.autoSave?.id || !Number.isFinite(result.expiresAt) || result.expiresAt * 1000 <= Date.now()) throw new Error();
      update({ state: "ready", expiresAt: result.expiresAt });
    } catch { update({ state: "error" }); }
    finally { savingResults.current.delete(lock); }
  };

  const runVTO = useCallback(async (outfit: SessionOutfit) => {
    const src = fullBodyDataUrl;
    if (inFlight.current || skinInFlight.current || photoProcessing || rateLimited) return;
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
    const epoch = sessionEpoch.current;
    const controller = new AbortController();
    vtoController.current = controller;
    inFlight.current = true; setVtoLoading(true); setVtoError(null); setResultImageError(false); setShowOriginal(false);
    try {
      const res = await fetch("/api/vto", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: controller.signal });
      if (epoch !== sessionEpoch.current) return;
      if (res.status === 429) setRateLimited(true);
      const data: VTOResult = await res.json().catch(() => ({ success: false, error: res.status === 429 ? "Rate limit reached. Wait before another attempt." : "The try-on server returned an unreadable response." }));
      if (epoch !== sessionEpoch.current) return;
      if (!data.success || !data.resultUrl || (data.mode !== "live" && data.mode !== "mock")) throw new Error(data.error || "Try-on did not complete. Check your photos and try again.");
      const look: GeneratedLook = {
        id: `${outfit.id}:${photoVersion}`, outfit, resultUrl: data.resultUrl, mode: data.mode,
        sharing: data.mode === "live" && autoSaveResults && data.sharing && typeof data.sharing.id === "string" && typeof data.sharing.receipt === "string" && typeof data.sharing.accessToken === "string" ? { ...data.sharing, state: "saving" } : undefined,
        saveRequested: data.mode === "live" && autoSaveResults,
        autoSave: data.mode === "live" && (data.autoSave !== undefined || data.autoSaveError !== undefined) ? {
          state: data.autoSave && data.autoSave.id === data.sharing?.id ? "ready" : "error",
          id: data.sharing?.id, receipt: data.sharing?.receipt, accessToken: data.sharing?.accessToken,
          expiresAt: data.autoSave?.expiresAt,
        } : undefined,
        sourceDataUrl: src, sourceVersion: photoVersion, durationMs: Math.round(performance.now() - started),
      };
      setLooks(previous => [look, ...previous.filter(item => item.id !== look.id)].slice(0, 2));
      // Photo replacement is locked while pending; reopening this outfit must reuse its completed task.
      setVtoModal(previous => previous?.outfit.id === outfit.id ? { ...previous, resultUrl: look.resultUrl, mode: look.mode, sharing: look.sharing, saveRequested: look.saveRequested, lookId: look.id, autoSave: look.autoSave } : previous);
      if (look.sharing) void saveSharedResult(look.sharing, epoch);
    } catch (error) {
      if (epoch !== sessionEpoch.current) return;
      setVtoError({ outfitId: outfit.id, message: error instanceof Error ? error.message : "VTO request failed" });
    } finally { if (epoch === sessionEpoch.current) { inFlight.current = false; setVtoLoading(false); } }
  }, [fullBodyDataUrl, photoProcessing, photoVersion, rateLimited, autoSaveResults, saveSharedResult]);

  const handleRestore = useCallback((params: RestoreParams) => {
    const guide = window.location.hash.slice(1);
    if (guide === "how-it-works" || guide === "faq") { navigateTo(guide); return; }
    if (params.occasion) setOccasion(params.occasion);
    if (params.skin) { setSkinColor(params.skin); setSkinMode("link"); }
    if (params.step) setStep(params.step);
    if (params.view === "clothes") { setShowShortlist(false); setShowUpload(true); setStep(3); }
    if (params.view === "shortlist") { setShowUpload(false); setShowShortlist(true); setQuery(""); setAudience("all"); setStep(3); }
    if (params.view === "plan") { setShowUpload(false); setShowShortlist(false); setStep(3); setNavigationTarget({ id: "wedding-plan" }); }
    if (params.vto) {
      const outfit = OUTFITS.find(item => item.id === params.vto && item.vtoSupported && item.tryOnStatus !== "blocked");
      if (outfit) { setStep(3); setVtoModal({ outfit, resultUrl: "", mode: "" }); }
    }
  }, [navigateTo]);

  const prepareSelfie = async (file: File) => {
    if (skinInFlight.current) return;
    const selection = ++skinSelection.current;
    setSkinError(null); setSkinPreparing(true); setShowFaceCamera(false);
    try {
      if (!["image/jpeg", "image/png"].includes(file.type)) throw new Error("Please upload an image file in JPG or PNG format");
      if (file.size > 10 * 1024 * 1024) throw new Error("Image must be under 10MB");
      const dataUrl = await compressImageForUpload(file, 1280, 1_500_000);
      if (selection !== skinSelection.current) return;
      setSelfieDataUrl(dataUrl); setSkinColor(null); setSkinMode("");
    } catch (error) { if (selection === skinSelection.current) setSkinError(error instanceof Error ? error.message : "Could not prepare this photo"); }
    finally { if (selection === skinSelection.current) setSkinPreparing(false); }
  };

  const analyzeSkin = async () => {
    const dataUrl = selfieDataUrl;
    if (!dataUrl || skinInFlight.current || inFlight.current || skinPreparing || rateLimited) return;
    const epoch = sessionEpoch.current;
    const controller = new AbortController();
    skinController.current = controller; skinInFlight.current = true;
    setSkinError(null); setSkinLoading(true);
    try {
      const res = await fetch("/api/skin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ imageDataUrl: dataUrl }), signal: controller.signal });
      if (epoch !== sessionEpoch.current) return;
      if (res.status === 429) setRateLimited(true);
      const data: SkinResult = await res.json().catch(() => ({ success: false, error: "The analysis server returned an unreadable response." }));
      if (epoch !== sessionEpoch.current) return;
      if (!data.success || !data.skin_color || !/^#[0-9a-f]{6}$/i.test(data.skin_color) || (data.mode !== "mock" && data.mode !== "live")) throw new Error(data.error || "Skin analysis did not complete");
      setSkinColor(data.skin_color); setSkinMode(data.mode);
    } catch (error) { if (epoch === sessionEpoch.current) setSkinError(error instanceof Error ? error.message : "Skin analysis failed"); }
    finally { if (epoch === sessionEpoch.current) { skinInFlight.current = false; setSkinLoading(false); } }
  };

  const openVTO = useCallback((outfit: SessionOutfit) => {
    if (!outfit.vtoSupported || outfit.tryOnStatus === "blocked") return;
    const saved = looks.find(look => look.outfit.id === outfit.id && look.sourceVersion === photoVersion);
    setVtoModal({ outfit, resultUrl: saved?.resultUrl || "", mode: saved?.mode || "", sharing: saved?.sharing, saveRequested: saved?.saveRequested, lookId: saved?.id, autoSave: saved?.autoSave });
    setFullBodyError(null); setResultImageError(false); setShowOriginal(false);
    setCopyStatus("idle");
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
  const jumpToReferences = () => {
    // The section can mount after a shortlist exit, so wait two frames before scrolling.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const section = referenceSection.current;
      section?.focus({ preventScroll: true });
      section?.scrollIntoView({ block: "start", behavior: "instant" });
    }));
  };

  const allOutfits = useMemo<SessionOutfit[]>(() => [...owned, ...OUTFITS], [owned]);
  const recommendations = useMemo(() => recommendOutfits(allOutfits, {
    occasion, audience, styleLevel: stylePreference || undefined, preferredColor: preferredColor || undefined,
  }), [allOutfits, occasion, audience, stylePreference, preferredColor]);
  const referenceCandidates = useMemo(() => recommendReferenceOutfits(allOutfits, {
    occasion, audience, styleLevel: stylePreference || undefined, preferredColor: preferredColor || undefined,
  }), [allOutfits, occasion, audience, stylePreference, preferredColor]);
  const curated = useMemo(() => {
    const list = showShortlist ? allOutfits.filter(outfit => favorites.has(outfit.id)).map(outfit => ({ outfit, reason: "Saved by you in this session." })) : recommendations;
    const needle = query.trim().toLowerCase();
    return list.filter(({ outfit }) => `${outfit.name} ${outfit.garmentType}`.toLowerCase().includes(needle));
  }, [allOutfits, showShortlist, favorites, recommendations, query]);
  const references = useMemo(() => {
    if (showShortlist) return [];
    const needle = query.trim().toLowerCase();
    return referenceCandidates.filter(({ outfit }) => `${outfit.name} ${outfit.garmentType}`.toLowerCase().includes(needle));
  }, [showShortlist, referenceCandidates, query]);
  const shortlistCount = favorites.size;
  const failedOutfit = vtoError ? allOutfits.find(outfit => outfit.id === vtoError.outfitId) : undefined;

  const renderLookCard = (item: SessionOutfit, reason: string, kind: "recommended" | "reference") => (
    <article key={item.id} className={`sf-look-card is-editorial ${kind === "reference" ? "sf-reference-card" : "sf-outfit-card"}`}>
      <div className="sf-outfit-image"><button className="sf-outfit-open" onClick={() => openVTO(item)} aria-label={`Try on ${item.name}`}><img src={item.imageUrl} alt={item.name} loading="lazy" /></button><button type="button" className={`sf-heart ${favorites.has(item.id) ? "is-active" : ""}`} aria-pressed={favorites.has(item.id)} onClick={() => toggleFavorite(item.id)} aria-label={`${favorites.has(item.id) ? "Remove" : "Add"} ${item.name} ${favorites.has(item.id) ? "from" : "to"} shortlist`}><Heart size={18} fill={favorites.has(item.id) ? "currentColor" : "none"} /></button><span className="sf-outfit-badge">{item.origin === "upload" ? "Your clothes" : item.tryOnStatus === "candidate" ? "Inspiration" : "Tested on a real photo"}</span></div>
      <div className="sf-outfit-info"><div className="sf-outfit-type"><span>{item.styleLevel}</span><span className="sf-palette"><i style={{ backgroundColor: item.primaryColor }} /></span></div><h2>{item.name}</h2><p className={kind === "reference" ? "sf-reference-reason" : "sf-recommendation-reason"}>{reason}</p><button className="sf-outfit-action" onClick={() => openVTO(item)}><Shirt size={16} />Try this look <ArrowUpRight size={16} /></button>{getVerifiedSellerUrl(item) && <a className="sf-text-link" href={getVerifiedSellerUrl(item)!} target="_blank" rel="noopener noreferrer">View at seller</a>}<GarmentCredit source={item.source} /></div>
    </article>
  );

  const handleFullBodyFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; event.target.value = "";
    if (file) void prepareFullBody(file);
  };
  // Judges and first-time visitors can try the flow without uploading a photo of themselves.
  const loadSamplePhoto = async () => {
    if (inFlight.current) return;
    try {
      const response = await fetch(SAMPLE_MODEL_PHOTO);
      if (!response.ok) throw new Error();
      const blob = await response.blob();
      await prepareFullBody(new File([blob], "sample-model.png", { type: blob.type || "image/png" }));
    } catch { setFullBodyError("Could not load the sample photo. Please upload your own."); }
  };
  const prepareFullBody = async (file: File) => {
    if (inFlight.current) return;
    if (!file.type.startsWith("image/")) { setFullBodyError("Please upload an image file"); return; }
    if (file.size > 10 * 1024 * 1024) { setFullBodyError("Full-body photo must be under 10MB"); return; }
    const selection = ++photoSelection.current;
    setFullBodyError(null); setPhotoProcessing(true);
    try {
      const dataUrl = await compressImageForUpload(file, 2048, PERSON_UPLOAD_BYTES);
      if (selection !== photoSelection.current) return;
      setFullBodyDataUrl(dataUrl); setPhotoVersion(previous => previous + 1);
      setVtoModal(previous => previous ? { ...previous, resultUrl: "", mode: "", sharing: undefined, saveRequested: false } : previous);
      setVtoError(null); setResultImageError(false);
    } catch (error) { if (selection === photoSelection.current) setFullBodyError(error instanceof Error ? error.message : "Could not process the image"); }
    finally { if (selection === photoSelection.current) setPhotoProcessing(false); }
  };

  return (<>
    <main className={`sf-app${step === 1 ? " sf-home" : ""}`} onClickCapture={event => {
      const anchor = (event.target as HTMLElement).closest?.("a[href]");
      if (!hasSession || !(anchor instanceof HTMLAnchorElement) || anchor.target === "_blank" || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const url = new URL(anchor.href);
      if (url.origin === window.location.origin && url.pathname !== window.location.pathname && !window.confirm("Leaving clears this session's clothes, photos and results. Save any result images first. Continue?")) event.preventDefault();
    }}>
      <Suspense fallback={null}><SearchParamHandler onRestore={handleRestore} /></Suspense>
      <Navbar activeView={step === 1 ? guideView ?? "home" : showShortlist ? "shortlist" : showUpload ? "clothes" : "plan"} onNavigate={navigateTo} shortlistCount={shortlistCount} />
      {hasSession && <div className="sf-session-strip"><button className="sf-text-link" onClick={clearSession}>Clear private session</button></div>}
      {(apiState === "error" || apiState === "unconfigured") && <div className="sf-session-strip" role="status"><span>{apiState === "error" ? "Could not check generation availability." : "Generation is unavailable on this preview. You can still browse and plan looks."}</span><button className="sf-text-link" onClick={() => { void loadMode(); }}>Check availability again</button></div>}
      <div className="sf-main" id="main-content" tabIndex={-1}>
        {step === 1 && guideView && <HomeGuide view={guideView} onNavigate={navigateTo} onBrowse={browseLooks} />}
        {step === 1 && !guideView && (
          <>
            <section className="sf-editorial-wrap sf-home-enter">
              <div className="sf-editorial-hero">
                <div className="sf-welcome-copy">
                  <span className="sf-season">The celebration wardrobe</span>
                  <h1>Five moments.<br /><em>One wardrobe.</em></h1>
                  <p>Your clothes. Your celebrations. Find your look, try it on your photo, and choose what feels like you.</p>
                  <div className="sf-cta-row">
                    <button className="sf-button sf-button-primary" onClick={() => navigateTo("plan")}>Plan my five looks <ArrowRight size={18} /></button>
                    <Link className="sf-text-link" href="/library">Explore outfits <ArrowRight size={17} /></Link>
                  </div>
                  <button className="sf-text-link sf-own-clothes-link" onClick={() => { setStep(3); setShowUpload(true); }}><Shirt size={16} />Try my own clothes <ArrowRight size={17} /></button>
                  <p className="sf-hero-note"><ShieldCheck size={15} aria-hidden="true" />Start planning without a photo.</p>
                </div>
                <div className="sf-campaign-images" aria-label="Indian celebration outfit inspiration">
                  <figure><img src="/garment_test/editorial/midnight-lehenga.jpg" alt="AI outfit concept: midnight and gold lehenga" fetchPriority="high" width={768} height={1024} /><figcaption><span>The evening edit</span><small>AI outfit concept</small></figcaption></figure>
                  <figure><img src="/garment_test/editorial/emerald-kurta.jpg" alt="AI outfit concept: emerald silk kurta" width={768} height={1024} /><figcaption><span>A little festive</span><small>AI outfit concept</small></figcaption></figure>
                </div>
              </div>
            </section>
            <section id="occasions" className="sf-editorial-wrap sf-occasion-section" aria-labelledby="occasion-heading">
              <div className="sf-section-heading"><div id="occasion-heading"><h2>What are we dressing for?</h2><p>Pick a function. We’ll bring the outfit ideas.</p></div><span className="sf-small-note">Your plans, your style</span></div>
              <div className="sf-occasions">
                {OCCASIONS.map((o, i) => {
                  const Icon = [Music2, Leaf, Sun, Heart, Sparkles][i];
                  return <button key={o.id} className={`sf-occasion sf-occasion-${o.id}`} onClick={() => { setOccasion(o.id); setStep(2); setShowShortlist(false); }}>
                    <img src={`/garment_test/editorial/${OCCASION_IMAGES[o.id]}`} alt="" loading="lazy" width={768} height={1024} />
                    <span className="sf-occasion-caption"><span className="sf-occasion-name"><Icon size={16} strokeWidth={1.5} /><strong>{o.label}</strong><ArrowUpRight size={17} /></span><span>{OCCASION_TAGLINES[i]}</span></span>
                  </button>;
                })}
              </div>
            </section>
            <HomeGuide view="home" onNavigate={navigateTo} onBrowse={browseLooks} />
          </>
        )}

        {step === 2 && (
          <section className="sf-editorial-wrap sf-personalize">
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
              {showFaceCamera && <FaceCameraCapture onClose={() => setShowFaceCamera(false)} onCapture={file => { void prepareSelfie(file); }} />}
              <button type="button" disabled={skinLoading || skinPreparing} className="sf-button sf-button-primary sf-full" onClick={() => setShowFaceCamera(v => !v)}><Camera size={18} /> {showFaceCamera ? "Hide camera" : "Use camera instead"}</button>
              <div className="sf-or"><span />or upload a photo<span /></div>
              <label className={`sf-upload ${skinLoading || skinPreparing ? "sf-upload-disabled" : ""}`}>
                <Upload size={26} strokeWidth={1.5} /><strong>Click to upload selfie</strong><span>JPG or PNG · up to 100 MB</span>
                <input id="selfie-file" aria-label="Selfie photo" type="file" accept="image/jpeg,image/png" className="sr-only" disabled={skinLoading || skinPreparing} onChange={e => {
                  const file = e.target.files?.[0]; e.target.value = "";
                  if (!file) return;
                  void prepareSelfie(file);
                }} />
              </label>
              {selfieDataUrl && <img className="sf-selfie-ready" src={selfieDataUrl} alt="Your prepared selfie" />}
              {skinPreparing && <p role="status" className="sf-form-help">Preparing your selfie…</p>}
              {selfieDataUrl && !skinPreparing && <p className="sf-form-help">Selfie ready. Uploading did not start an analysis.</p>}
                                          <button className="sf-button sf-button-primary sf-full" disabled={generationUnavailable || !selfieDataUrl || skinPreparing || skinLoading || vtoLoading || rateLimited} onClick={() => { setConsentGiven(true); void analyzeSkin(); }}>Analyze selfie</button>
              <p className="sf-privacy"><ShieldCheck size={15} /> Analyze sends this selfie to YouCam in live mode. The photo stays in this page session on our side; provider retention is separate.</p>
              {skinError && <p role="alert" className="sf-alert sf-alert-error"><AlertCircle size={17} />{skinError}</p>}
              {skinLoading && <p role="status" className="sf-alert"><Loader2 size={18} className="animate-spin" />Analyzing with YouCam API…</p>}
              {skinColor && (
                <div className="sf-tone-result" role="status">
                  <div className="sf-tone-swatch" style={{ backgroundColor: skinColor }} />
                  <div>
                    <strong>{skinMode === "link" ? "Shared colour reference" : skinMode === "mock" ? "Sample skin-tone reference" : "Detected skin tone"}</strong>
                    <span>{skinColor}{skinMode === "mock" ? " · Mock sample" : " · Colour reference"}</span>
                  </div>
                  <CheckCircle size={20} />
                  <button className="sf-button sf-button-primary sf-full" onClick={() => setStep(3)}>
                    Continue to gallery <ArrowRight size={17} />
                  </button>
                </div>
              )}
              {skinColor && (
                <div className="sf-palette-viz" aria-label="Optional colour inspiration">
                  <h4>Explore colour ideas</h4>
                  <div className="sf-palette-row">
                    {(() => {
                      const recommended = getRecommendedColors(skinColor);
                      return recommended.slice(0, 6).map((color, i) => (
                        <span
                          key={i}
                          className="sf-palette-swatch"
                          role="img"
                          aria-label={getColorName(color)}
                          style={{ backgroundColor: color }}
                          title={getColorName(color)}
                        />
                      ));
                    })()}
                  </div>
                  <p className="sf-palette-note">Exploratory colour ideas, not an undertone analysis or a measure of what suits you. Your preferences lead the way.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="sf-editorial-wrap sf-gallery">
            <button className="sf-back" onClick={() => { setShowShortlist(false); setStep(1); }}><ArrowLeft size={17} /> Occasions</button>
            <div className="sf-gallery-heading"><div><span className="sf-context">{showShortlist ? "Saved by you, this session" : `Getting dressed for ${occasion}`}</span><h1>{showShortlist ? "Your shortlist." : "Your clothes. Your kind of look."}</h1><p>Choose from your clothes or browse reference previews. Try a look on your photo, compare two results, and keep your favourite.</p></div><div className="sf-action-row"><button className="sf-button sf-button-primary" onClick={() => setShowUpload(true)}><Upload size={17} />Add my outfit</button><button className="sf-button sf-button-secondary" disabled={showShortlist || references.length === 0} onClick={() => { setShowShortlist(false); jumpToReferences(); }}>Explore reference outfits</button><button className="sf-button sf-button-secondary" aria-pressed={showShortlist} onClick={() => setShowShortlist(value => !value)}><Heart size={17} />Shortlist ({shortlistCount})</button></div></div>
            {vtoError && failedOutfit && modalId !== failedOutfit.id && <div role="alert" className="sf-alert sf-alert-error"><span>Try-on for {failedOutfit.name}: {vtoError.message}</span><button className="sf-text-link" onClick={() => openVTO(failedOutfit)}>Review try-on</button></div>}
            {showUpload && <div id="my-wardrobe" tabIndex={-1} ref={wardrobeAnchor}><WardrobeUpload occasion={occasion} onClose={() => setShowUpload(false)} onAdd={outfit => { if (currentSession !== sessionEpoch.current) return; setOwned(previous => [...previous, outfit]); setWeekPlan(previous => previous[occasion] ? previous : { ...previous, [occasion]: outfit.id }); setShowUpload(false); setShowShortlist(false); }} /></div>}
            <div className="sf-occasion-tabs" role="group" aria-label="Choose occasion">{OCCASIONS.map(item => <button key={item.id} aria-pressed={occasion === item.id} className={`sf-chip ${occasion === item.id ? "is-active" : ""}`} onClick={() => setOccasion(item.id)}>{item.label}</button>)}</div>
            <div className="sf-gallery-toolbar"><div className="sf-audiences" role="group" aria-label="Collection">{AUDIENCES.map(item => <button key={item.id} className={audience === item.id ? "is-active" : ""} aria-pressed={audience === item.id} onClick={() => setAudience(item.id)}>{item.label}</button>)}</div><label className="sf-search"><Search size={17} /><span className="sr-only">Search outfit ideas</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Find one of your outfits…" type="search" /></label></div>
            <div className="sf-preferences"><label>Style preference<select value={stylePreference} onChange={event => setStylePreference(event.target.value as StyleLevel | "")}><option value="">Any style</option><option value="minimal">Minimal</option><option value="festive">Festive</option><option value="statement">Statement</option></select></label><label>Preferred colour<select value={preferredColor} onChange={event => setPreferredColor(event.target.value)}><option value="">Any colour</option><option value="#6b1e3a">Burgundy</option><option value="#d4af37">Gold</option><option value="#1f3a5f">Navy</option><option value="#f7f1e5">Ivory</option><option value="#111111">Black</option><option value="#35634c">Green</option></select></label><button className="sf-text-link" onClick={() => setStep(2)}><Palette size={16} />{skinColor ? "View skin-tone reference" : "Optional skin-tone analysis"}</button></div>
            <div className="sf-gallery-meta"><span>{showShortlist ? `${curated.length} saved` : `${curated.length} recommended · ${references.length} reference outfits`}</span><span>Occasion tags · your style · your colours</span></div>
            {!showShortlist && <p className="sf-reference-note">Looks marked “Tested on a real photo” have been tried on a real person. Inspiration looks are AI outfit concepts we haven’t tried on yet.</p>}
            {curated.length === 0 && <div className={`sf-empty${!showShortlist && references.length > 0 ? " is-compact" : ""}`}><Shirt size={34} strokeWidth={1.2} /><h2>{showShortlist ? "Keep a look you love." : "Start with something you own."}</h2><p>{showShortlist ? "Tap the heart on an outfit to keep it here." : references.length > 0 ? `No tested looks match these choices yet. Add a garment you own, or explore the ${references.length} inspiration look${references.length === 1 ? "" : "s"} below.` : "No looks match these choices. Add your own garment to get started."}</p><button className="sf-button sf-button-primary" onClick={() => { setShowUpload(true); setShowShortlist(false); }}>Add an outfit</button><button className="sf-text-link" onClick={() => { setQuery(""); setAudience("all"); setShowShortlist(false); jumpToReferences(); }}>Browse inspiration looks</button></div>}
            <div className="sf-editorial-wrap sf-editorial-grid">{curated.map(({ outfit: item, reason }) => renderLookCard(item, reason, "recommended"))}</div>
            {!showShortlist && references.length > 0 && <section ref={referenceSection} tabIndex={-1} className="sf-reference-section" aria-labelledby="reference-outfits-heading"><div className="sf-section-heading"><div><span className="sf-context">The wider edit</span><h2 id="reference-outfits-heading">Inspiration for {occasion.charAt(0).toUpperCase() + occasion.slice(1)}</h2><p>AI outfit concepts to spark ideas. Nothing is generated until you tap Generate.</p></div><span className="sf-small-note">{references.length} idea{references.length === 1 ? "" : "s"}</span></div><div className="sf-editorial-wrap sf-editorial-grid">{references.map(({ outfit: item, reason }) => renderLookCard(item, reason, "reference"))}</div></section>}
            {owned.length > 0 && <details className="sf-my-clothes"><summary>All my clothes ({owned.length})</summary><p>Your outfits stay here even when they don’t match this occasion’s tags. You can always try one manually.</p><div className="sf-owned-list">{owned.map(item => <div key={item.id}><img src={item.imageUrl} alt="" /><div><strong>{item.name}</strong><span>{item.occasionTags.join(", ")}</span></div><button className="sf-text-link" onClick={() => openVTO(item)}>Try my {item.name}</button><button className="sf-icon-button" aria-label={`Remove garment ${item.name}`} disabled={vtoLoading} onClick={() => removeOwned(item.id)}><X size={17} /></button></div>)}</div></details>}
            <LookComparison key={currentSession} looks={looks} onRemove={id => setLooks(previous => previous.filter(look => look.id !== id))} occasionLabel={OCCASIONS.find(event => event.id === occasion)!.label} plannedOutfitId={weekPlan[occasion]} onPlanOutfit={outfitId => setWeekPlan(previous => ({ ...previous, [occasion]: outfitId }))} />
            <div id="wedding-plan" tabIndex={-1}><WeddingWeekBoard occasions={OCCASIONS} outfits={allOutfits} plan={weekPlan} onChoose={(event, outfitId) => setWeekPlan(previous => ({ ...previous, [event]: outfitId }))} onTryOn={(event, outfit) => { setOccasion(event); openVTO(outfit); }} onAddOwn={event => { setOccasion(event); setShowUpload(true); }} /></div>
            <p className="sf-gallery-footnote"><Sparkles size={16} />Recommendations use confirmed tags and preferences. Your personal style gets the final say.</p>
          </section>
        )}
      </div>
      <nav className="sf-bottom-nav" aria-label="App navigation">
        <button aria-current={step === 1 ? "page" : undefined} onClick={() => navigateTo("home")}><House size={20} />For you</button>
        <Link href="/library"><Search size={20} />Explore</Link>
        <button aria-current={step === 3 && !showUpload && !showShortlist ? "page" : undefined} onClick={() => navigateTo("plan")}><CalendarHeart size={20} />Plan</button>
        <button aria-current={step === 3 && showUpload && !showShortlist ? "page" : undefined} onClick={() => navigateTo("clothes")}><Shirt size={20} />My clothes</button>
        <button aria-current={step === 3 && showShortlist ? "page" : undefined} onClick={() => navigateTo("shortlist")}><Heart size={20} />Shortlist{shortlistCount > 0 && <span>{shortlistCount}</span>}</button>
      </nav>
      {step === 3 && vtoModal && (
        <div className="sf-modal-backdrop" onClick={closeVTO}>
          <section className="sf-tryon-dialog" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="tryon-title" tabIndex={-1} onClick={event => event.stopPropagation()}>
            <header className="sf-dialog-header"><div><span className="sf-context">Your fitting room</span><h2 id="tryon-title">Make this look yours.</h2></div><button className="sf-icon-button" aria-label="Close try-on" onClick={closeVTO}><X size={21} /></button></header>
            <div className="sf-dialog-content">
              <div className="sf-selected-outfit"><img src={vtoModal.outfit.imageUrl} alt={vtoModal.outfit.name} /><div><strong>{vtoModal.outfit.name}</strong><span>{occasion} · {vtoModal.outfit.garmentType.replaceAll("-", " ")}</span><small>{vtoModal.outfit.origin === "upload" ? "Your garment reference" : vtoModal.outfit.generatedConcept ? "AI outfit concept · no retail listing" : "Catalogue reference"}</small></div></div>
              {vtoLoading && <div className="sf-generating" role="status"><div className="sf-generating-icon"><Shirt size={34} strokeWidth={1.2} /><Loader2 className="animate-spin" size={20} /></div><h3>Putting your look together.</h3><p>One try-on is processing. You can close this view; the submitted task may still finish. No extra task will start while it is pending.</p></div>}
              {rateLimited && <p role="alert" className="sf-alert sf-alert-error">Rate limit reached. No task will be retried automatically. Wait before reloading to try again.</p>}
              {vtoError?.outfitId === vtoModal.outfit.id && !vtoLoading && <p className="sf-alert sf-alert-error" role="alert">{vtoError.message}</p>}
              {!vtoLoading && vtoModal.resultUrl && <div className="sf-result"><p className={`sf-result-status ${vtoModal.mode === "live" ? "is-live" : ""}`}>{vtoModal.mode === "live" ? <><CheckCircle size={16} />Generated result — live render from YouCam API</> : <><AlertCircle size={16} />Mock preview — reference outfit, not a personal try-on</>}</p><p className="sf-result-caption">{vtoModal.mode === "live" ? "Check your face and garment details. AI previews don’t establish physical fit or guarantee identity preservation." : "This shows the garment reference only, not a generated image of you."}</p>
              <div className="sf-result-image">{resultImageError ? <div className="sf-empty" role="alert"><AlertCircle size={26} /><p>The result couldn’t load; its link may have expired. Reopen or reload this image before generating another look.</p><a className="sf-button sf-button-secondary" href={vtoModal.resultUrl} target="_blank" rel="noopener noreferrer">Open image</a><button className="sf-text-link" onClick={() => setResultImageError(false)}>Reload image</button></div> : vtoModal.mode === "live" && fullBodyDataUrl && !showOriginal ? <BeforeAfterSlider before={fullBodyDataUrl} after={vtoModal.resultUrl} name={vtoModal.outfit.name} onAfterError={() => setResultImageError(true)} /> : <img src={showOriginal && fullBodyDataUrl ? fullBodyDataUrl : vtoModal.resultUrl} alt={`Try-on result for ${vtoModal.outfit.name}`} onError={() => setResultImageError(true)} />}</div><button className="sf-text-link" aria-pressed={showOriginal} onClick={() => { setShowOriginal(value => !value); setResultImageError(false); }}>{showOriginal ? "Show result" : "Show original"}</button></div>}
              {!vtoLoading && !vtoModal.resultUrl && <div className="sf-source"><h3>A photo of you. A whole new look.</h3><p>Start virtual try-on with a photo of yourself.</p>{!consentGiven ? <div className="sf-photo-permission"><ShieldCheck size={26} strokeWidth={1.5} /><p>When you generate in live mode, your person and garment photos are sent to YouCam to create the look. We keep your photo, the garment and the result privately for 24 hours so the look stays saved, then delete them automatically. YouCam handles its own retention.</p><button className="sf-button sf-button-primary sf-full" onClick={() => setConsentGiven(true)}>I understand — continue <ArrowRight size={17} /></button></div> : <><label className="sf-upload sf-body-upload">{fullBodyDataUrl ? <img src={fullBodyDataUrl} alt="Your full-body photo" /> : <Upload size={30} />}<strong>{fullBodyDataUrl ? "Replace your photo" : "Upload a full-body photo"}</strong><span>Front-facing · head to toe · clear face</span><span>JPG or PNG under 10 MB</span><span className="sf-button sf-button-secondary">Choose photo</span><input aria-label="Full-body photo" type="file" accept="image/jpeg,image/png" className="sr-only" disabled={photoProcessing || vtoLoading} onChange={handleFullBodyFile} /></label>{!fullBodyDataUrl && <button type="button" className="sf-text-link" disabled={photoProcessing || vtoLoading} onClick={() => { void loadSamplePhoto(); }}>No photo handy? Use our sample model <ArrowRight size={16} /></button>}<p className="sf-form-help">{photoProcessing ? "Preparing your photo…" : fullBodyDataUrl ? "Photo ready. Uploading did not start a task." : "Add a photo, review it, then generate explicitly."}</p></>}</div>}
              <input id="fullbody-file" aria-label="Replace full-body photo" type="file" accept="image/jpeg,image/png" className="hidden" disabled={photoProcessing || vtoLoading || !consentGiven} onChange={handleFullBodyFile} />
              {fullBodyError && <p className="sf-alert sf-alert-error" role="alert">{fullBodyError}</p>}
              {vtoModal.outfit.tryOnStatus === "candidate" && vtoModal.outfit.origin !== "upload" && <p className="sf-reference-note">Inspiration look: we haven’t tried this AI concept on a real photo yet, so results may vary.</p>}
              {!vtoLoading && vtoModal.resultUrl && vtoModal.mode === "live" && vtoModal.sharing && <SharedResultAction key={vtoModal.sharing.id} sharing={vtoModal.sharing} onRetry={() => { void saveSharedResult(vtoModal.sharing!, sessionEpoch.current); }} onCopy={() => { void copyPrivateResult(vtoModal.sharing!, sessionEpoch.current); }} onRemove={() => removeSharedResult(vtoModal.sharing!)} />}
              {!vtoLoading && vtoModal.resultUrl && vtoModal.saveRequested && !vtoModal.sharing && <p role="alert" className="sf-alert sf-alert-error">Automatic saving is unavailable. Your try-on is still here; save/open the image to keep it.</p>}
              {!vtoLoading && vtoModal.resultUrl && vtoModal.autoSave?.state === "saving" && <p role="status">Saving your generated look…</p>}
              {!vtoLoading && vtoModal.resultUrl && vtoModal.autoSave?.state === "error" && <div className="sf-alert sf-alert-error"><p role="alert">Automatic saving could not finish. Your try-on is still here.</p>{vtoModal.autoSave.receipt ? <button type="button" className="sf-button sf-button-secondary" onClick={() => { const look = looks.find(item => item.id === vtoModal.lookId); if (look) void retryAutoSave(look); }}>Retry saving</button> : <p>Save / open image to keep this result.</p>}</div>}
              <GarmentCredit source={vtoModal.outfit.source} />
            </div>
            <footer className="sf-dialog-actions">
              {!vtoModal.resultUrl && <button className="sf-button sf-button-primary" disabled={generationUnavailable || !fullBodyDataUrl || !consentGiven || photoProcessing || vtoLoading || skinLoading || rateLimited} onClick={retryVTO}>{vtoLoading ? "Processing…" : "Generate try-on"}</button>}
              {consentGiven && fullBodyDataUrl && <button className="sf-button sf-button-secondary" disabled={photoProcessing || vtoLoading} onClick={() => document.getElementById("fullbody-file")?.click()}>Replace photo</button>}
              {vtoModal.resultUrl && !vtoLoading && <><a className="sf-button sf-button-primary" href={vtoModal.resultUrl} download={`vto-${vtoModal.outfit.id}.png`} target="_blank" rel="noopener noreferrer"><Download size={17} />Save / open image</a>{vtoModal.outfit.origin !== "upload" && <><button className="sf-button sf-button-secondary" onClick={shareWhatsApp}><MessageCircle size={17} />WhatsApp outfit</button><button className="sf-icon-button" onClick={copyShareLink} aria-label="Copy outfit link">{copyStatus === "copied" ? <CheckCircle size={19} /> : <Share2 size={19} />}</button></>}<p role="status">{copyStatus === "copied" ? "Outfit link copied." : copyStatus === "error" ? "Could not copy the link. Please try again." : vtoModal.outfit.origin === "upload" ? "Save/open the image to keep it. Sharing with the creator is optional; no public outfit link is created." : "Share links open this outfit, not your personal photo."}</p></>}
            </footer>
          </section>
        </div>
      )}
    </main>
    <WardrobePlanPrint summary={summarizeWardrobePlan(OCCASIONS, allOutfits, weekPlan)} />
  </>);
}
