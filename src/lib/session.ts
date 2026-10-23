import type { Outfit, Occasion } from "@/data/outfits";

export type GarmentCategory = "upper_body" | "full_body";
export type SessionOutfit = Outfit & {
  uploadedGarment?: { imageDataUrl: string; category: GarmentCategory };
};

export interface GeneratedLook {
  id: string;
  outfit: SessionOutfit;
  resultUrl: string;
  mode: "live" | "mock";
  sourceDataUrl: string;
  sourceVersion: number;
  durationMs: number;
}

/** Scalar plan data only: safe to pass to the text-only print view. */
export function summarizeWardrobePlan(
  occasions: readonly { id: Occasion; label: string }[],
  outfits: readonly SessionOutfit[],
  plan: Partial<Record<Occasion, string>>,
) {
  const entries = occasions.map(event => {
    const outfit = outfits.find(item => item.id === plan[event.id]);
    const owned = outfit?.origin === "upload";
    return {
      occasion: event.id,
      label: event.label,
      outfitId: outfit?.id ?? null,
      garmentName: outfit?.name ?? "Not planned",
      sourceLabel: !outfit ? "No outfit selected" : owned ? "Your clothes" :
        `${outfit.generatedConcept ? "AI inspiration" : "Reference outfit"} · ${outfit.tryOnStatus === "live-reviewed" ? "live-reviewed" : "try-on unreviewed"}`,
      owned,
    };
  });
  const ownedAssignments = entries.filter(entry => entry.owned);
  const ownedOutfitCount = new Set(ownedAssignments.map(entry => entry.outfitId)).size;
  return {
    entries,
    plannedCount: entries.filter(entry => entry.outfitId !== null).length,
    ownedOutfitCount,
    plannedRewears: ownedAssignments.length - ownedOutfitCount,
  };
}

export type WardrobePlanSummary = ReturnType<typeof summarizeWardrobePlan>;
