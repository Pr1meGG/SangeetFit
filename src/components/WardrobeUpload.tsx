"use client";

import { useState, type FormEvent } from "react";
import { Upload, X } from "lucide-react";
import type { Occasion, StyleLevel } from "@/data/outfits";
import type { GarmentCategory, SessionOutfit } from "@/lib/session";
import { compressImageForUpload, GARMENT_UPLOAD_BYTES } from "@/lib/image";

const occasions: Occasion[] = ["sangeet", "mehendi", "haldi", "wedding", "reception"];

export default function WardrobeUpload({ occasion, onAdd, onClose }: {
  occasion: Occasion;
  onAdd: (outfit: SessionOutfit) => void;
  onClose: () => void;
}) {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<GarmentCategory>("full_body");
  const [style, setStyle] = useState<StyleLevel>("festive");
  const [color, setColor] = useState("#6b1e3a");
  const [tags, setTags] = useState<Occasion[]>([occasion]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!image || !tags.length || !name.trim()) {
      setError("Add a garment photo, a name and at least one occasion.");
      return;
    }
    onAdd({
      id: `upload-${crypto.randomUUID()}`, origin: "upload", name: name.trim(),
      audience: "unisex", collection: "indian", garmentType: category === "upper_body" ? "upper-body garment" : "full outfit",
      occasion: tags[0], occasionTags: tags, styleLevel: style, primaryColor: color, secondaryColor: color,
      imageUrl: image, description: "Your garment. Details and occasion tags confirmed by you.",
      tryOnReference: null, youcamCategory: "auto", vtoSupported: true, tryOnStatus: "candidate",
      uploadedGarment: { imageDataUrl: image, category },
    });
  }

  return (
    <form className="sf-wardrobe-form" onSubmit={submit} aria-label="Add your own outfit">
      <div className="sf-panel-heading"><div><h2>Add an outfit you own.</h2><p>Kept in this page session. No AI task runs when you add it.</p></div><button type="button" className="sf-icon-button" aria-label="Close outfit form" onClick={onClose}><X size={19} /></button></div>
      <div className="sf-wardrobe-fields">
        <label className="sf-upload">
          {image ? <img src={image} alt="Your garment preview" /> : <Upload size={28} />}
          <strong>{processing ? "Preparing photo…" : image ? "Replace garment photo" : "Choose garment photo"}</strong>
          <span>JPG/PNG up to 10 MB · clear, front-facing</span>
          <input id="garment-file" aria-label="Garment photo" type="file" accept="image/jpeg,image/png" className="sr-only" disabled={processing} onChange={async event => {
            const file = event.target.files?.[0]; event.target.value = "";
            if (!file) return;
            if (file.size > 10 * 1024 * 1024) { setError("Garment photo must be under 10 MB."); return; }
            setError(""); setProcessing(true);
            try { setImage(await compressImageForUpload(file, 1600, GARMENT_UPLOAD_BYTES)); }
            catch (err) { setError(err instanceof Error ? err.message : "Could not prepare your garment photo."); }
            finally { setProcessing(false); }
          }} />
        </label>
        <div className="sf-form-stack">
          <label>Outfit name<input required maxLength={80} value={name} onChange={event => setName(event.target.value)} placeholder="My burgundy kurta" /></label>
          <label>Garment reference<select value={category} onChange={event => setCategory(event.target.value as GarmentCategory)}><option value="full_body">Full outfit — worn reference</option><option value="upper_body">Upper-body garment — front view</option></select></label>
          <p className="sf-form-help">For a full outfit, use a complete, front-facing worn look. For an upper-body garment, use a clear single garment or worn reference. Avoid folded clothes, collages and obstructed details.</p>
          <div className="sf-form-row"><label>Main colour<input type="color" value={color} onChange={event => setColor(event.target.value)} /></label><label>Style level<select value={style} onChange={event => setStyle(event.target.value as StyleLevel)}><option value="minimal">Minimal</option><option value="festive">Festive</option><option value="statement">Statement</option></select></label></div>
          <fieldset><legend>Occasions you would wear it for</legend><div className="sf-tag-options">{occasions.map(tag => <label key={tag}><input type="checkbox" checked={tags.includes(tag)} onChange={() => setTags(previous => previous.includes(tag) ? previous.filter(value => value !== tag) : [...previous, tag])} />{tag}</label>)}</div></fieldset>
        </div>
      </div>
      {error && <p className="sf-alert sf-alert-error" role="alert">{error}</p>}
      <div className="sf-action-row"><button type="submit" className="sf-button sf-button-primary" disabled={processing || !image}>Add to my clothes</button><button type="button" className="sf-button sf-button-secondary" onClick={onClose}>Cancel</button></div>
      <p className="sf-form-help">These details come from you, not image analysis. Photos reach YouCam only after you consent and explicitly generate a try-on.</p>
    </form>
  );
}
