import type { Audience, Occasion, Outfit, RawOutfit, StyleLevel } from "../data/outfits";

// Editorial tags describe occasions/styles, not physical fit or AI image analysis.
const EDITORIAL: Record<string, { occasions?: Occasion[]; style: StyleLevel }> = {
  "sangeet-01": { style: "statement" },
  "sangeet-02": { occasions: ["sangeet", "reception"], style: "festive" },
  "mehendi-01": { occasions: ["mehendi", "haldi"], style: "minimal" },
  "mehendi-02": { occasions: ["mehendi", "haldi"], style: "minimal" },
  "haldi-01": { style: "festive" },
  "haldi-02": { occasions: ["haldi", "mehendi"], style: "minimal" },
  "wedding-01": { style: "statement" },
  "wedding-02": { occasions: ["wedding", "sangeet"], style: "festive" },
  "reception-01": { style: "festive" },
  "reception-02": { occasions: ["reception", "sangeet"], style: "statement" },
  "reception-03": { occasions: ["reception", "sangeet"], style: "statement" },
  "mens-wedding-01": { style: "statement" },
  "mens-sangeet-01": { occasions: ["sangeet", "mehendi", "haldi"], style: "minimal" },
  "mens-reception-01": { occasions: ["reception", "sangeet"], style: "festive" },
  "mens-sangeet-02": { occasions: ["sangeet", "reception"], style: "festive" },
  "mens-sangeet-03": { occasions: ["sangeet", "reception"], style: "festive" },
  "mens-mehendi-01": { occasions: ["mehendi", "haldi"], style: "minimal" },
  "library-ivory-embroidered-lehenga": { occasions: ["wedding", "reception"], style: "festive" },
  "library-navy-gold-lehenga": { occasions: ["sangeet", "reception"], style: "statement" },
  "library-champagne-pink-lehenga": { occasions: ["haldi", "mehendi"], style: "festive" },
  "library-yellow-asymmetric-kurta": { occasions: ["haldi", "mehendi"], style: "minimal" },
  "library-coral-embroidered-kurta": { occasions: ["mehendi", "haldi"], style: "festive" },
  "library-ivory-floral-kurta": { occasions: ["mehendi", "haldi"], style: "festive" },
  "library-purple-embroidered-saree": { occasions: ["reception", "wedding"], style: "statement" },
  "library-blush-bridal-saree": { style: "statement" },
  "library-gold-silk-kurta": { occasions: ["haldi", "mehendi", "sangeet"], style: "festive" },
  "library-ivory-nehru-ensemble": { occasions: ["sangeet", "reception", "wedding"], style: "festive" },
  "library-ivory-button-kurta": { occasions: ["wedding", "mehendi", "sangeet"], style: "minimal" },
  "library-blue-khadi-kurta": { occasions: ["mehendi", "haldi"], style: "minimal" },
  "library-blue-dhoti-kurta": { occasions: ["mehendi", "haldi"], style: "minimal" },
  "library-red-embroidered-bandhgala": { occasions: ["reception", "wedding", "sangeet"], style: "statement" },
};

export function enrichCatalogOutfit(outfit: RawOutfit): Outfit {
  const metadata = EDITORIAL[outfit.id];
  return {
    ...outfit,
    occasionTags: [...(outfit.occasionTags ?? metadata?.occasions ?? [outfit.occasion])],
    styleLevel: outfit.styleLevel ?? metadata?.style ?? "festive",
    // Wiring a reference is not evidence of visual output quality.
    tryOnStatus: outfit.tryOnStatus ?? (outfit.vtoSupported && outfit.tryOnReference ? "candidate" : "blocked"),
  };
}

function httpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch { return false; }
}

function verifiedDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function hasReferencePermission(outfit: Partial<Outfit>): boolean {
  const source = outfit.source;
  const concept = outfit.generatedConcept;
  return Boolean(
    outfit.vtoSupported && outfit.tryOnReference &&
    outfit.imageUrl === `/garment_test/${outfit.tryOnReference}` &&
    ((concept?.tool === "OpenAI image generation" && verifiedDate(concept.createdAt) && /^[a-f0-9]{64}$/i.test(concept.sha256)) ||
      (source?.author.trim() && source.title.trim() &&
        ["CC0", "Public domain", "CC BY-SA 3.0", "CC BY-SA 4.0"].includes(source.license) &&
        httpsUrl(source.url) && httpsUrl(source.licenseUrl) && httpsUrl(source.originalUrl) &&
        verifiedDate(source.retrievedAt) && /^[a-f0-9]{64}$/i.test(source.sha256)))
  );
}

export function isPrimaryEligible(outfit: Partial<Outfit>): boolean {
  return outfit.origin !== "upload" && outfit.tryOnStatus === "live-reviewed" && hasReferencePermission(outfit);
}

export function getVerifiedSellerUrl(outfit: Pick<Outfit, "seller">): string | null {
  const seller = outfit.seller;
  if (!seller || !seller.name.trim() || seller.exactItemVerified !== true ||
    !httpsUrl(seller.url) || !verifiedDate(seller.verifiedAt) || !verifiedDate(seller.imagePermissionVerifiedAt)) return null;
  return seller.url;
}

export interface StylingPreferences {
  occasion: Occasion;
  audience?: Audience | "all";
  styleLevel?: StyleLevel;
  preferredColor?: string;
  /** Include candidate references; the gallery renders them in a separately labelled group. */
  includeCandidates?: boolean;
}

export function recommendOutfits<T extends Outfit>(outfits: readonly T[], prefs: StylingPreferences): { outfit: T; reason: string }[] {
  const colourMatch = (outfit: T) => Boolean(prefs.preferredColor &&
    [outfit.primaryColor, outfit.secondaryColor].some(colour => colour.toLowerCase() === prefs.preferredColor!.toLowerCase()));
  const styleMatch = (outfit: T) => Boolean(prefs.styleLevel && outfit.styleLevel === prefs.styleLevel);
  return outfits
    .filter(outfit => outfit.occasionTags.includes(prefs.occasion) &&
      (!prefs.audience || prefs.audience === "all" || outfit.audience === "unisex" || outfit.audience === prefs.audience) &&
      (outfit.origin === "upload" ? outfit.vtoSupported && outfit.tryOnStatus !== "blocked" :
        isPrimaryEligible(outfit) || (prefs.includeCandidates && outfit.tryOnStatus === "candidate" && hasReferencePermission(outfit))))
    .map((outfit, index) => ({ outfit, index }))
    .sort((a, b) => Number(styleMatch(b.outfit)) - Number(styleMatch(a.outfit)) ||
      Number(colourMatch(b.outfit)) - Number(colourMatch(a.outfit)) || a.index - b.index)
    .map(({ outfit }) => ({
      outfit,
      reason: [
        `Tagged for ${prefs.occasion.charAt(0).toUpperCase() + prefs.occasion.slice(1)}${outfit.origin === "upload" ? " by you" : " in our collection"}.`,
        styleMatch(outfit) ? `Matches your ${prefs.styleLevel} style preference.` : "",
        colourMatch(outfit) ? "Includes your selected colour." : "",
      ].filter(Boolean).join(" "),
    }));
}

/** Unreviewed catalogue references are browsable alongside reviewed recommendations.
 *  They are never mixed into the recommendation list, and own uploads are excluded. */
export function recommendReferenceOutfits<T extends Outfit>(outfits: readonly T[], prefs: StylingPreferences): { outfit: T; reason: string }[] {
  return recommendOutfits(outfits, { ...prefs, includeCandidates: true })
    .filter(({ outfit }) => outfit.origin !== "upload" && outfit.tryOnStatus === "candidate");
}
