/**
 * Outfit catalog for SangeetFit — Indian wedding occasion styling.
 *
 * Each outfit carries a primary and secondary hex colour used by
 * the hue-similarity scoring engine in `@/lib/color`.
 */

export type Occasion = "sangeet" | "mehendi" | "haldi" | "wedding" | "reception";

export interface Outfit {
  id: string;
  name: string;
  occasion: Occasion;
  category: string;
  primaryColor: string;
  secondaryColor: string;
  imageUrl: string;
  description: string;
}

export const OUTFITS: Outfit[] = [
  // ── Sangeet (2) ────────────────────────────────────────────────────────
  {
    id: "sangeet-01",
    name: "Embroidered Lehenga",
    occasion: "sangeet",
    category: "lehenga",
    primaryColor: "#8B008B",
    secondaryColor: "#FFD700",
    imageUrl: "/outfits/sangeet-01.svg",
    description:
      "Deep purple lehenga with gold zardozi embroidery — bold and festive.",
  },
  {
    id: "sangeet-02",
    name: "Anarkali Suit",
    occasion: "sangeet",
    category: "anarkali",
    primaryColor: "#DC143C",
    secondaryColor: "#FFF8DC",
    imageUrl: "/outfits/sangeet-02.svg",
    description:
      "Crimson anarkali with ivory threadwork — elegant for evening celebrations.",
  },

  // ── Mehendi (2) ────────────────────────────────────────────────────────
  {
    id: "mehendi-01",
    name: "Cotton Saree",
    occasion: "mehendi",
    category: "saree",
    primaryColor: "#228B22",
    secondaryColor: "#FFDAB9",
    imageUrl: "/outfits/mehendi-01.svg",
    description:
      "Forest-green cotton saree with peach border — fresh and daytime-appropriate.",
  },
  {
    id: "mehendi-02",
    name: "Palazzo Set",
    occasion: "mehendi",
    category: "palazzo",
    primaryColor: "#32CD32",
    secondaryColor: "#90EE90",
    imageUrl: "/outfits/mehendi-02.svg",
    description:
      "Lime-green sharara set with mint dupatta — vibrant mehendi-energy.",
  },

  // ── Haldi (2) ────────────────────────────────────────────────────────
  {
    id: "haldi-01",
    name: "Yellow Chaniya",
    occasion: "haldi",
    category: "lehenga",
    primaryColor: "#FFD700",
    secondaryColor: "#FFA500",
    imageUrl: "/outfits/haldi-01.svg",
    description:
      "Bright-yellow chaniya choli with orange border — the classic haldi look.",
  },
  {
    id: "haldi-02",
    name: "Turmeric Kurti",
    occasion: "haldi",
    category: "kurti",
    primaryColor: "#DAA520",
    secondaryColor: "#F0E68C",
    imageUrl: "/outfits/haldi-02.svg",
    description:
      "Mustard-yellow kurti with pale-gold dupatta — earthy and joyful.",
  },

  // ── Wedding (2) ────────────────────────────────────────────────────────
  {
    id: "wedding-01",
    name: "Red Bridal Lehenga",
    occasion: "wedding",
    category: "lehenga",
    primaryColor: "#8B0000",
    secondaryColor: "#FFD700",
    imageUrl: "/outfits/wedding-01.svg",
    description:
      "Burgundy bridal lehenga with heavy gold embroidery — traditional centerpiece.",
  },
  {
    id: "wedding-02",
    name: "Maroon Sharara",
    occasion: "wedding",
    category: "sharara",
    primaryColor: "#800020",
    secondaryColor: "#FFC0CB",
    imageUrl: "/outfits/wedding-02.svg",
    description:
      "Deep maroon sharara with blush-pink dupatta — regal yet soft.",
  },

  // ── Reception (2) ──────────────────────────────────────────────────────
  {
    id: "reception-01",
    name: "Ballerina Gown",
    occasion: "reception",
    category: "gown",
    primaryColor: "#4B0082",
    secondaryColor: "#C0C0C0",
    imageUrl: "/outfits/reception-01.svg",
    description:
      "Indigo ballerina gown with silver sequin detailing — modern and chic.",
  },
  {
    id: "reception-02",
    name: "Velvet Suit",
    occasion: "reception",
    category: "suit",
    primaryColor: "#800080",
    secondaryColor: "#FFD700",
    imageUrl: "/outfits/reception-02.svg",
    description:
      "Plum velvet co-ord set with gold jewellery — luxe evening glamour.",
  },
];
