"use client";

import { useState } from "react";

export default function BeforeAfterSlider({ before, after, name, onAfterError }: { before: string; after: string; name: string; onAfterError: () => void }) {
  const [reveal, setReveal] = useState(50);
  return <div className="sf-before-after">
    <img src={before} alt={`Original photo for ${name}`} />
    <img src={after} alt={`Generated try-on for ${name}`} style={{ clipPath: `inset(0 0 0 ${100 - reveal}%)` }} onError={onAfterError} />
    <span className="sf-before-after-label is-before">Original</span>
    <span className="sf-before-after-label is-after">Generated look</span>
    <span className="sf-before-after-divider" style={{ left: `${100 - reveal}%` }} aria-hidden="true" />
    <input type="range" min="0" max="100" value={reveal} onChange={event => setReveal(Number(event.target.value))} aria-label={`Reveal before and after for ${name}`} aria-valuetext={`${reveal}% of generated result visible`} className="sf-before-after-range" />
  </div>;
}
