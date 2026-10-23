"use client";

import { useState } from "react";
import { Layers, Check } from "lucide-react";
import type { SessionOutfit } from "@/lib/session";

interface TopBottomComboProps {
  top: SessionOutfit | null;
  bottom: SessionOutfit | null;
  onError?: (msg: string) => void;
}

type CategoryMode = "upper" | "lower";

export default function TopBottomCombo({ top, bottom, onError }: TopBottomComboProps) {
  const [open, setOpen] = useState(false);
  const mode: CategoryMode = top && !bottom ? "lower" : "upper";

  if (!top && !bottom) {
    return (
      <div className="sf-combo-preview">
        <h4>Top + Bottom preview</h4>
        <p className="sf-combo-empty">Select an outfit to see how a top and bottom look together</p>
      </div>
    );
  }

  const topImage = top?.uploadedGarment?.imageDataUrl || "/garment_test/library/blue-dhoti-kurta.jpg";
  const bottomImage = bottom?.uploadedGarment?.imageDataUrl || "/garment_test/library/blush-bridal-saree.jpg";

  return (
    <div className="sf-combo-preview">
      <button
        className="sf-button sf-button-secondary sf-full"
        onClick={() => setOpen(!open)}
      >
        <Layers size={17} />{mode === "upper" ? "Showing top — switch to lower" : "Showing bottom — switch to upper"}
      </button>

      {open && (
        <div className="sf-combo-modal">
          <div className="sf-combo-pair">
            <div className="sf-combo-col">
              <h5>Top</h5>
              <img src={topImage} alt="Top outfit" />
            </div>
            <div className="sf-combo-divider" />
            <div className="sf-combo-col">
              <h5>Bottom</h5>
              <img src={bottomImage} alt="Bottom outfit" />
            </div>
          </div>

          {!top && <p className="sf-combo-error">Please pick a top first.</p>}
          {!bottom && <p className="sf-combo-error">Please pick a bottom first.</p>}
        </div>
      )}

      {onError && open && (
        <div role="alert" className="sf-combo-hint">
          <Check size={14} />Both images load together
        </div>
      )}
    </div>
  );
}
