import type { Outfit } from "@/data/outfits";

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
