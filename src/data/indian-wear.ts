import type { Outfit, RawOutfit } from "./outfits";
import { enrichCatalogOutfit } from "../lib/styling";
import library from "./indian-wear.json";

// Internet-sourced assets with file-level provenance. See docs/garment-library/README.md.
// Candidate means a matching reference is wired, not that live VTO quality is validated.
export type SourcedOutfit = Outfit & {
  source: NonNullable<Outfit["source"]>;
  referenceStatus: "candidate" | "browse-only";
  referenceNotes: string;
};

// The offline catalog test validates the JSON schema, asset hashes and mapping.
export const INDIAN_WEAR_LIBRARY: SourcedOutfit[] = (library as (RawOutfit & Pick<SourcedOutfit, "source" | "referenceStatus" | "referenceNotes">)[])
  .map(outfit => ({ ...outfit, ...enrichCatalogOutfit(outfit) }));
