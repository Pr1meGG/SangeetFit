import type { Outfit, RawOutfit } from "./outfits";
import { enrichCatalogOutfit } from "../lib/styling";

// Each original concept image doubles as its exact try-on reference.
const CONCEPTS: RawOutfit[] = [
  {
    id: "concept-midnight-lehenga", name: "Midnight & Gold Lehenga", audience: "women", collection: "indian",
    garmentType: "lehenga-choli", occasion: "sangeet", occasionTags: ["sangeet", "reception"], styleLevel: "statement",
    primaryColor: "#172541", secondaryColor: "#B79A61", imageUrl: "/garment_test/editorial/midnight-lehenga.jpg",
    description: "Midnight-blue lehenga with antique-gold embroidery and a sheer matching dupatta.",
    tryOnReference: "editorial/midnight-lehenga.jpg", youcamCategory: "auto", vtoSupported: true,
    referenceStatus: "candidate", referenceNotes: "Single front-facing generated model; live garment transfer unreviewed.",
    generatedConcept: { createdAt: "2026-10-21", tool: "OpenAI image generation", sha256: "4715d4eab961d87eb0bcac8e139d9b331d1ede42f517303b9aaf316f54d26dc0" },
  },
  {
    id: "concept-ivory-lehenga", name: "Ivory Embroidered Lehenga", audience: "women", collection: "indian",
    garmentType: "lehenga-choli", occasion: "wedding", occasionTags: ["wedding", "reception"], styleLevel: "festive",
    primaryColor: "#EAE1CD", secondaryColor: "#BFA66D", imageUrl: "/garment_test/editorial/ivory-lehenga.jpg",
    description: "Ivory lehenga with champagne-gold embroidery and an airy dupatta.",
    tryOnReference: "editorial/ivory-lehenga.jpg", youcamCategory: "auto", vtoSupported: true,
    referenceStatus: "candidate", referenceNotes: "Single front-facing generated model; live garment transfer unreviewed.",
    generatedConcept: { createdAt: "2026-10-21", tool: "OpenAI image generation", sha256: "e37d5ae3cba664a257c94ad8965f9ed22de974dd64c3694656889fea145e15ae" },
  },
  {
    id: "concept-coral-anarkali", name: "Coral Embroidered Anarkali", audience: "women", collection: "indian",
    garmentType: "anarkali", occasion: "mehendi", occasionTags: ["mehendi", "haldi"], styleLevel: "festive",
    primaryColor: "#E57D77", secondaryColor: "#C9A269", imageUrl: "/garment_test/editorial/coral-anarkali.jpg",
    description: "Coral anarkali with fine gold embroidery and a light draped dupatta.",
    tryOnReference: "editorial/coral-anarkali.jpg", youcamCategory: "auto", vtoSupported: true,
    referenceStatus: "candidate", referenceNotes: "Single front-facing generated model; live garment transfer unreviewed.",
    generatedConcept: { createdAt: "2026-10-21", tool: "OpenAI image generation", sha256: "28f30f7b3124e01097df91df55c7432905b4a939ebdcdd5e22931742485536b3" },
  },
  {
    id: "concept-emerald-kurta", name: "Emerald Silk Kurta", audience: "men", collection: "indian",
    garmentType: "kurta-set", occasion: "sangeet", occasionTags: ["sangeet", "mehendi"], styleLevel: "festive",
    primaryColor: "#1B493E", secondaryColor: "#D6BA8C", imageUrl: "/garment_test/editorial/emerald-kurta.jpg",
    description: "Deep-emerald silk kurta with tonal embroidery and matching trousers.",
    tryOnReference: "editorial/emerald-kurta.jpg", youcamCategory: "auto", vtoSupported: true,
    referenceStatus: "candidate", referenceNotes: "Single front-facing generated model; live garment transfer unreviewed.",
    generatedConcept: { createdAt: "2026-10-21", tool: "OpenAI image generation", sha256: "a3464154fbe72bb25caf351d22c402ba252e5058cc9576e7733dc603a0641d64" },
  },
  {
    id: "concept-oxblood-bandhgala", name: "Oxblood Bandhgala", audience: "men", collection: "indian",
    garmentType: "bandhgala", occasion: "reception", occasionTags: ["reception", "wedding"], styleLevel: "statement",
    primaryColor: "#57282D", secondaryColor: "#B79B67", imageUrl: "/garment_test/editorial/oxblood-bandhgala.jpg",
    description: "Oxblood tailored bandhgala with restrained gold details and dark trousers.",
    tryOnReference: "editorial/oxblood-bandhgala.jpg", youcamCategory: "auto", vtoSupported: true,
    referenceStatus: "candidate", referenceNotes: "Single front-facing generated model; live garment transfer unreviewed.",
    generatedConcept: { createdAt: "2026-10-21", tool: "OpenAI image generation", sha256: "f3fcf45b196d1cd0742d818b2d1b0f6522473620d155a73966b7732a901c0a19" },
  },
];

export const EDITORIAL_LOOKS: Outfit[] = CONCEPTS.map(enrichCatalogOutfit);
