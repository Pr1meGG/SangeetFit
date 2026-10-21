import { INDIAN_WEAR_LIBRARY } from "./indian-wear";
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
  "lehenga_ethnic_hd.png",
  "user_saree.png",
  "kurta_set_hd.png",
  "western_dress_hd.png",
  ...INDIAN_WEAR_LIBRARY.filter(outfit => outfit.vtoSupported).map(outfit => outfit.tryOnReference!),
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
}

export type RawOutfit = Omit<Outfit, "occasionTags" | "styleLevel" | "tryOnStatus"> &
  Partial<Pick<Outfit, "occasionTags" | "styleLevel" | "tryOnStatus">>;

const CATALOG: RawOutfit[] = [
  // ── Women's · Sangeet ─────────────────────────────────────────────────
  {
    id: "sangeet-01",
    name: "Purple Embroidered Lehenga",
    audience: "women",
    collection: "indian",
    garmentType: "lehenga-choli",
    occasion: "sangeet",
    primaryColor: "#8B008B",
    secondaryColor: "#FFD700",
    imageUrl: "/outfits/sangeet-01.svg",
    description:
      "Deep purple lehenga choli with gold zardozi embroidery — bold and festive.",
    tryOnReference: null,
    youcamCategory: "auto",
    vtoSupported: false,
  },
  {
    id: "sangeet-02",
    name: "Crimson Anarkali",
    audience: "women",
    collection: "indian",
    garmentType: "anarkali",
    occasion: "sangeet",
    primaryColor: "#DC143C",
    secondaryColor: "#FFF8DC",
    imageUrl: "/outfits/sangeet-02.svg",
    description:
      "Crimson anarkali with ivory threadwork — elegant for evening celebrations.",
    tryOnReference: null,
    youcamCategory: "auto",
    vtoSupported: false,
  },

  // ── Women's · Mehendi ─────────────────────────────────────────────────
  {
    id: "mehendi-01",
    name: "Ivory Chanderi Saree",
    audience: "women",
    collection: "indian",
    garmentType: "saree",
    occasion: "mehendi",
    primaryColor: "#F5E6D3",
    secondaryColor: "#C9A227",
    imageUrl: "/outfits/mehendi-01.svg",
    description:
      "Cream chanderi saree with a soft gold border — airy and daytime-appropriate.",
    tryOnReference: "user_saree.png",
    youcamCategory: "auto",
    vtoSupported: true,
  },
  {
    id: "mehendi-02",
    name: "Blush Pink Kurta Set",
    audience: "women",
    collection: "indian",
    garmentType: "kurta-set",
    occasion: "mehendi",
    primaryColor: "#E8A0BF",
    secondaryColor: "#FFF0F5",
    imageUrl: "/outfits/mehendi-02.svg",
    description:
      "Blush-pink kurta with chikankari detailing and matching salwar — soft daytime look.",
    tryOnReference: "kurta_set_hd.png",
    youcamCategory: "auto",
    vtoSupported: true,
  },

  // ── Women's · Haldi ───────────────────────────────────────────────────
  {
    id: "haldi-01",
    name: "Yellow Chaniya Choli",
    audience: "women",
    collection: "indian",
    garmentType: "lehenga-choli",
    occasion: "haldi",
    primaryColor: "#FFD700",
    secondaryColor: "#FFA500",
    imageUrl: "/outfits/haldi-01.svg",
    description:
      "Bright-yellow chaniya choli with orange border — the classic haldi look.",
    tryOnReference: null,
    youcamCategory: "auto",
    vtoSupported: false,
  },
  {
    id: "haldi-02",
    name: "Mustard Chikankari Kurti",
    audience: "women",
    collection: "indian",
    garmentType: "kurti-set",
    occasion: "haldi",
    primaryColor: "#DAA520",
    secondaryColor: "#F0E68C",
    imageUrl: "/outfits/haldi-02.svg",
    description:
      "Mustard-yellow kurti with pale-gold dupatta — earthy and joyful.",
    tryOnReference: null,
    youcamCategory: "auto",
    vtoSupported: false,
  },

  // ── Women's · Wedding ─────────────────────────────────────────────────
  {
    id: "wedding-01",
    name: "Maroon Bridal Lehenga",
    audience: "women",
    collection: "indian",
    garmentType: "lehenga-choli",
    occasion: "wedding",
    primaryColor: "#8B0000",
    secondaryColor: "#FFD700",
    imageUrl: "/outfits/wedding-01.svg",
    description:
      "Deep-maroon bridal lehenga with heavy gold embroidery — traditional centerpiece.",
    tryOnReference: "lehenga_ethnic_hd.png",
    youcamCategory: "auto",
    vtoSupported: true,
  },
  {
    id: "wedding-02",
    name: "Maroon Sharara",
    audience: "women",
    collection: "indian",
    garmentType: "sharara",
    occasion: "wedding",
    primaryColor: "#800020",
    secondaryColor: "#FFC0CB",
    imageUrl: "/outfits/wedding-02.svg",
    description:
      "Deep maroon sharara with blush-pink dupatta — regal yet soft.",
    tryOnReference: null,
    youcamCategory: "auto",
    vtoSupported: false,
  },

  // ── Women's · Reception ───────────────────────────────────────────────
  {
    id: "reception-01",
    name: "Indigo Ballerina Gown",
    audience: "women",
    collection: "western",
    garmentType: "gown",
    occasion: "reception",
    primaryColor: "#4B0082",
    secondaryColor: "#C0C0C0",
    imageUrl: "/outfits/reception-01.svg",
    description:
      "Indigo ballerina gown with silver sequin detailing — modern and chic.",
    tryOnReference: null,
    youcamCategory: "auto",
    vtoSupported: false,
  },
  {
    id: "reception-02",
    name: "Velvet Suit",
    audience: "women",
    collection: "indian",
    garmentType: "co-ord-set",
    occasion: "reception",
    primaryColor: "#800080",
    secondaryColor: "#FFD700",
    imageUrl: "/outfits/reception-02.svg",
    description:
      "Plum velvet co-ord set with gold jewellery — luxe evening glamour.",
    tryOnReference: null,
    youcamCategory: "auto",
    vtoSupported: false,
  },
  {
    id: "reception-03",
    name: "Black Sequin Gown",
    audience: "women",
    collection: "western",
    garmentType: "gown",
    occasion: "reception",
    primaryColor: "#111111",
    secondaryColor: "#C0C0C0",
    imageUrl: "/outfits/reception-03.svg",
    description:
      "Black western gown with silver sequin work — a western reception statement piece.",
    tryOnReference: "western_dress_hd.png",
    youcamCategory: "auto",
    vtoSupported: true,
  },

  // ── Men's · all try-on blocked until real men's reference assets exist ─
  {
    id: "mens-wedding-01",
    name: "Ivory Sherwani",
    audience: "men",
    collection: "indian",
    garmentType: "sherwani",
    occasion: "wedding",
    primaryColor: "#F5F0E1",
    secondaryColor: "#C9A227",
    imageUrl: "/outfits/mens-wedding-01.svg",
    description:
      "Cream silk sherwani with gold embroidery — classic groom attire.",
    tryOnReference: null,
    youcamCategory: "auto",
    vtoSupported: false,
  },
  {
    id: "mens-sangeet-01",
    name: "Sage Kurta-Pajama Set",
    audience: "men",
    collection: "indian",
    garmentType: "kurta-pajama",
    occasion: "sangeet",
    primaryColor: "#9CAF88",
    secondaryColor: "#F5F5DC",
    imageUrl: "/outfits/mens-sangeet-01.svg",
    description:
      "Sage-green kurta with off-white pajama and contrast buttons — understated and festive.",
    tryOnReference: null,
    youcamCategory: "auto",
    vtoSupported: false,
  },
  {
    id: "mens-reception-01",
    name: "Navy Bandhgala",
    audience: "men",
    collection: "indo-western",
    garmentType: "bandhgala",
    occasion: "reception",
    primaryColor: "#1F3A5F",
    secondaryColor: "#B0C4DE",
    imageUrl: "/outfits/mens-reception-01.svg",
    description:
      "Midnight-navy bandhgala with steel-grey sheen — sharp evening tailoring.",
    tryOnReference: null,
    youcamCategory: "auto",
    vtoSupported: false,
  },
  {
    id: "mens-sangeet-02",
    name: "Black Nehru Jacket Combo",
    audience: "men",
    collection: "indian",
    garmentType: "nehru-jacket",
    occasion: "sangeet",
    primaryColor: "#222222",
    secondaryColor: "#D4AF37",
    imageUrl: "/outfits/mens-sangeet-02.svg",
    description:
      "Black nehru jacket over an ivory kurta — sharp, modern, dance-floor ready.",
    tryOnReference: null,
    youcamCategory: "auto",
    vtoSupported: false,
  },
  {
    id: "mens-sangeet-03",
    name: "Maroon Indo-Western Festive",
    audience: "men",
    collection: "indo-western",
    garmentType: "indo-western",
    occasion: "sangeet",
    primaryColor: "#70043A",
    secondaryColor: "#E8B4B8",
    imageUrl: "/outfits/mens-sangeet-03.svg",
    description:
      "Maroon indo-western jacket with mandarin collar — festive fusion tailoring.",
    tryOnReference: null,
    youcamCategory: "auto",
    vtoSupported: false,
  },
  {
    id: "mens-mehendi-01",
    name: "Emerald Dhoti-Kurta",
    audience: "men",
    collection: "indian",
    garmentType: "dhoti-kurta",
    occasion: "mehendi",
    primaryColor: "#0F6B41",
    secondaryColor: "#FFEA88",
    imageUrl: "/outfits/mens-mehendi-01.svg",
    description:
      "Emerald kurta paired with a cream dhoti — breezy for daytime functions.",
    tryOnReference: null,
    youcamCategory: "auto",
    vtoSupported: false,
  },
  ...INDIAN_WEAR_LIBRARY,
];

export const OUTFITS: Outfit[] = CATALOG.map(enrichCatalogOutfit);

export function getOutfitById(id: string): Outfit | undefined {
  return OUTFITS.find(o => o.id === id);
}
