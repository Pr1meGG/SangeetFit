import { EDITORIAL_LOOKS } from "./editorial";
import { enrichCatalogOutfit } from "../lib/styling";

/**
 * Outfit catalog for SangeetFit — women's & men's Indian/western occasion styling.
 *
 * Each outfit carries primary/secondary hex colours used by the hue-similarity
 * scoring engine in `@/lib/color`, plus try-on wiring: an outfit is only
 * vtoSupported when `tryOnReference` names a real garment asset in
 * public/garment_test that VISUALLY CORRESPONDS to the product (same garment &
 * colour family). Products without a matching reference are honest about it:
 * tryOnReference null + vtoSupported false — never a substituted garment.
 */

export type Occasion = "sangeet" | "mehendi" | "haldi" | "wedding" | "reception";
export type Audience = "women" | "men" | "unisex";
export type Collection = "indian" | "western" | "indo-western";
export type StyleLevel = "minimal" | "festive" | "statement";
export type TryOnStatus = "candidate" | "live-reviewed" | "blocked";

export interface VerifiedSeller {
  name: string;
  url: string;
  exactItemVerified: true;
  verifiedAt: string;
  imagePermissionVerifiedAt: string;
}

/** Real garment reference assets available in public/garment_test. */
export const TRY_ON_REFERENCES: readonly string[] = [
  ...EDITORIAL_LOOKS.map(outfit => outfit.tryOnReference!),
] as const;

export type TryOnReference = (typeof TRY_ON_REFERENCES)[number] | null;

export interface Outfit {
  id: string;
  name: string;
  audience: Audience;
  collection: Collection;
  garmentType: string;
  occasion: Occasion;
  occasionTags: Occasion[];
  styleLevel: StyleLevel;
  tryOnStatus: TryOnStatus;
  seller?: VerifiedSeller;
  origin?: "catalogue" | "upload";
  primaryColor: string;
  secondaryColor: string;
  imageUrl: string;
  description: string;
  tryOnReference: TryOnReference;
  youcamCategory: "auto";
  vtoSupported: boolean;
  source?: {
    title: string;
    url: string;
    author: string;
    license: string;
    licenseUrl: string;
    originalUrl: string;
    downloadedUrl: string;
    retrievedAt: string;
    changes: string;
    sha256: string;
    width: number;
    height: number;
  };
  referenceStatus?: "candidate" | "browse-only";
  referenceNotes?: string;
  generatedConcept?: { createdAt: string; tool: "OpenAI image generation"; sha256: string };
}

export type RawOutfit = Omit<Outfit, "occasionTags" | "styleLevel" | "tryOnStatus"> &
  Partial<Pick<Outfit, "occasionTags" | "styleLevel" | "tryOnStatus">>;

const CATALOG: RawOutfit[] = [
  ...EDITORIAL_LOOKS,
];

export const OUTFITS: Outfit[] = CATALOG.map(enrichCatalogOutfit);

export function getOutfitById(id: string): Outfit | undefined {
  return OUTFITS.find(o => o.id === id);
}
