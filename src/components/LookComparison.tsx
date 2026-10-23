"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Heart, X, ZoomIn } from "lucide-react";
import type { GeneratedLook } from "@/lib/session";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";

export default function LookComparison({ looks, onRemove, occasionLabel, plannedOutfitId, onPlanOutfit }: {
  looks: GeneratedLook[];
  onRemove: (id: string) => void;
  occasionLabel: string;
  plannedOutfitId?: string;
  onPlanOutfit: (outfitId: string) => void;
}) {
  const [originals, setOriginals] = useState<string[]>([]);
  const [failed, setFailed] = useState<string[]>([]);
  const [zoom, setZoom] = useState<GeneratedLook | null>(null);
  const zoomRef = useRef<HTMLDialogElement>(null);
  const removeLook = (id: string) => {
    setOriginals(previous => previous.filter(value => value !== id));
    setFailed(previous => previous.filter(value => value !== id));
    onRemove(id);
  };
  useEffect(() => {
    if (!zoom) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    const dialog = zoomRef.current;
    document.body.style.overflow = "hidden";
    dialog?.showModal();
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [zoom]);
  if (!looks.length) return null;
  const mixedSources = looks.length === 2 && looks[0].sourceVersion !== looks[1].sourceVersion;
  return (
    <section className="sf-comparison" aria-label="Compare session looks">
      <div className="sf-section-heading"><div><h2>{looks.length === 2 ? "Which look feels like you?" : "Your first look, kept here."}</h2><p>Two recent results, in this session. Comparing doesn’t generate another image.</p></div></div>
      {mixedSources && <p role="status" className="sf-alert">These looks use different source photos. Their pose and proportions aren’t directly comparable.</p>}
      <div className="sf-compare-grid">{looks.map(look => {
        const original = originals.includes(look.id);
        const planned = plannedOutfitId === look.outfit.id;
        return <article key={look.id} className="sf-compare-card">
          <div className="sf-compare-heading"><div><strong>{look.outfit.name}</strong><span>Photo {look.sourceVersion} · {look.mode === "live" ? "Live AI preview" : "Mock reference only"}</span></div><button className="sf-icon-button" aria-label={`Remove result for ${look.outfit.name}`} onClick={() => removeLook(look.id)}><X size={17} /></button></div>
          {look.mode === "live" && <p className="sf-reference-note">This preview uses a live garment render. It does not establish physical fit or guarantee identity preservation.</p>}
          <div className="sf-result-image">{failed.includes(look.id) && !original ? <div className="sf-empty"><p>This result couldn’t load; its link may have expired. Reopen or reload the image first.</p><a href={look.resultUrl} target="_blank" rel="noopener noreferrer" className="sf-text-link">Open result image</a><button className="sf-text-link" onClick={() => setFailed(previous => previous.filter(id => id !== look.id))}>Reload result image</button></div> : look.mode === "live" && !original ? <BeforeAfterSlider before={look.sourceDataUrl} after={look.resultUrl} name={look.outfit.name} onAfterError={() => setFailed(previous => [...previous, look.id])} /> : <img src={original ? look.sourceDataUrl : look.resultUrl} alt={`${original ? "Original photo" : "Saved try-on"} for ${look.outfit.name}`} onError={() => !original && setFailed(previous => [...previous, look.id])} />}</div>
          <div className="sf-action-row"><button className="sf-button sf-button-secondary" aria-pressed={original} onClick={() => setOriginals(previous => original ? previous.filter(id => id !== look.id) : [...previous, look.id])}>{original ? "Show result" : "Show original"}</button><button className="sf-icon-button" aria-label={`Zoom result for ${look.outfit.name}`} onClick={() => setZoom(look)}><ZoomIn size={19} /></button><a className="sf-icon-button" href={look.resultUrl} download={`sangeetfit-${look.outfit.id}.png`} target="_blank" rel="noopener noreferrer" aria-label={`Save or open ${look.outfit.name}`}><Download size={18} /></a><button className="sf-button sf-button-secondary" aria-pressed={planned} onClick={() => onPlanOutfit(look.outfit.id)}><Heart size={16} fill={planned ? "currentColor" : "none"} />{planned ? `Planned for ${occasionLabel}` : `Plan for ${occasionLabel}`}</button></div>
          <p className="sf-form-help">{look.mode === "mock" ? "Reference image only. This is not a generated image of you." : "Review your face and garment details. This preview does not establish physical fit."}</p>
        </article>;
      })}</div>
      {zoom && <dialog ref={zoomRef} className="sf-zoom" aria-label={`Zoom ${zoom.outfit.name}`} onCancel={event => { event.preventDefault(); setZoom(null); }} onClick={event => { if (event.target === event.currentTarget) setZoom(null); }}><button className="sf-icon-button" aria-label="Close zoom" autoFocus onClick={() => setZoom(null)}><X size={22} /></button><img src={zoom.resultUrl} alt={`Enlarged try-on for ${zoom.outfit.name}`} /></dialog>}
    </section>
  );
}
