"use client";

import { useState, useCallback } from "react";
import { X, CheckCircle, Shirt, ArrowLeft, Palette } from "lucide-react";
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

export default function Home() {
  const [step, setStep] = useState<Step>(1);
  const [occasion, setOccasion] = useState<Occasion>("sangeet");
  const [skinColor, setSkinColor] = useState<string | null>(null);
  const [skinError, setSkinError] = useState<string | null>(null);
  const [skinLoading, setSkinLoading] = useState(false);
  const [vtoResult, setVtoResult] = useState<string | null>(null);
  const [vtoLoading, setVtoLoading] = useState(false);
  const [vtoError, setVtoError] = useState<string | null>(null);

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

  const runVTO = useCallback(
    async (garmentId: string, category: string) => {
      setVtoLoading(true);
      setVtoResult(null);
      setVtoError(null);
      try {
        const res = await fetch("/api/vto", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: "user_skin", garmentId, category }),
        });
        const data = await res.json();
        if (data.success) {
          setVtoResult(data.resultUrl || `Rendered ${garmentId}`);
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

  const curated = OUTFITS.filter(o => o.occasion === occasion).sort((a, b) => {
    const sa = skinColor ? hueSimilarity(skinColor, a.primaryColor) : null;
    const sb = skinColor ? hueSimilarity(skinColor, b.primaryColor) : null;
    if (sa === null && sb === null) return 0;
    if (sa === null) return 1;
    if (sb === null) return -1;
    return sb - sa;
  });

  const stepLabel = (s: Step) => (s === 1 ? "Select occasion" : s === 2 ? "Skin-tone analysis" : "Curated gallery");

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="glass rounded-xl p-6 mb-6">
          <h1 className="font-bold text-xl gradient-text mb-2">SangeetFit</h1>
          <p className="text-sm text-gray-400">Occasion → Skin-tone analysis → Occasion-curated gallery</p>
          <div className="step-indicator mt-4">
            <div className={`step-dot ${step >= 1 ? "active" : ""}`} />
            <div className={`step-line ${step >= 2 ? "active" : ""}`} />
            <div className={`step-dot ${step >= 2 ? "active" : ""}`} />
            <div className={`step-line ${step === 3 ? "active" : ""}`} />
            <div className={`step-dot ${step === 3 ? "active" : ""}`} />
            <span className="text-xs text-gray-500 ml-2">{stepLabel(step)} ({step} of 3)</span>
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
              {skinColor && (
                <span className="text-xs text-gray-500">Sorted by colour harmony to skin tone <span className="font-mono">{skinColor}</span></span>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {curated.map(o => {
                const sim = skinColor ? hueSimilarity(skinColor, o.primaryColor) : null;
                const score = sim == null ? null : Math.round(sim * 100);
                return (
                  <button
                    key={o.id}
                    onClick={() => runVTO(o.id, o.category)}
                    disabled={vtoLoading}
                    className={`group p-3 rounded-lg border transition-all ${
                      vtoLoading ? "opacity-60 cursor-not-allowed" : "border-gray-700 hover:border-violet-500 hover:bg-violet-500/5"
                    }`}
                  >
                    <img src={o.imageUrl} alt={o.name} className="w-full h-32 object-cover rounded mb-2 bg-gray-900" />
                    <div className="text-sm font-medium">{o.name}</div>
                    <div className="text-xs text-gray-500">{o.category}</div>
                    {score != null && (
                      <div className="mt-2 text-xs flex items-center gap-1">
                        <Palette className="w-3 h-3" style={{ backgroundColor: o.primaryColor }} />
                        <span className="text-green-400">{score}% harmony</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {vtoLoading && (
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle className="w-4 h-4 animate-spin text-violet-400" /> Rendering try-on…
              </div>
            )}
            {vtoError && (
              <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                <X className="w-3 h-3" /> {vtoError}
              </p>
            )}
            {vtoResult && !vtoError && (
              <div className="p-4 rounded-lg border border-green-500/30 bg-green-500/5">
                <div className="text-xs text-gray-400 mb-1">Try-on result</div>
                <div className="font-mono text-sm text-green-400">{vtoResult}</div>
                <p className="text-xs text-gray-600 mt-1">Mock mode active — connect YOUCAM_API_KEY for real renders.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
