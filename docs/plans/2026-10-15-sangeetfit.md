# SangeetFit — Implementation Plan

## Goal

Build a complete Indian wedding outfit styling product: upload selfie → analyze skin tone → browse occasion-curated outfits → virtual try-on → share shortlist.

## Architecture

```
User flow: Home (occasion select) → Analyze (skin tone) → Try-On (garment gallery + VTO) → Share
API layer: POST /api/skin-tone (new) + extended POST /api/vto (multi-garment support)
Data: Hardcoded outfit catalog in src/data/outfits.ts
State: Client-side useState; no external state library needed
```

## Tech Stack

- Next.js 14 (App Router, already installed)
- TypeScript + Tailwind CSS (already installed)
- lucide-react icons (already installed)
- YouCam API (v2.0 endpoints)

## Files to Create

| File | Purpose |
|------|---------|
| `src/app/api/skin-tone/route.ts` | Skin tone analysis API route |
| `src/data/outfits.ts` | Outfit catalog with metadata |
| `src/lib/color.ts` | Color harmony calculations |
| `src/components/OccasionPicker.tsx` | Wedding function selector |
| `src/components/SkinToneResult.tsx` | Skin tone display + palette |
| `src/components/GarmentGallery.tsx` | Outfit grid with filtering |
| `src/components/TryOnPanel.tsx` | VTO result modal |
| `src/components/ShareSheet.tsx` | Share/shortlist UI |
| `src/app/analyze/page.tsx` | Skin tone analysis page |
| `src/app/tryon/page.tsx` | Main try-on page |

## Files to Modify

| File | Change |
|------|--------|
| `src/app/layout.tsx` | Update title/description for SangeetFit |
| `src/app/page.tsx` | Replace with occasion landing page |
| `src/app/api/vto/route.ts` | Add batch mode support |
| `src/components/Navbar.tsx` | Update branding to SangeetFit |
| `src/app/globals.css` | Add gradient-text, scroll styles |

---

## Phase 1: Foundation & Data

### Task 1.1 — Create Outfit Catalog

**File:** `src/data/outfits.ts`

```typescript
export type Occasion = "sangeet" | "mehendi" | "haldi" | "wedding" | "reception";

export interface Outfit {
  id: string;
  name: string;
  occasion: Occasion;
  category: "lehenga" | "saree" | "kurta" | "anarkali" | "cocktail";
  primaryColor: string;
  secondaryColor: string;
  imageUrl: string;
  description: string;
}

export const OUTFITS: Outfit[] = [
  {
    id: "sangeet-1",
    name: "Embellished Lehenga",
    occasion: "sangeet",
    category: "lehenga",
    primaryColor: "#C41E3A",
    secondaryColor: "#FFD700",
    imageUrl: "/outfits/sangeet_lehenga_red.jpg",
    description: "Deep red lehenga with gold embroidery — perfect for sangeet nightlife",
  },
  {
    id: "sangeet-2",
    name: "Yellow Anarkali",
    occasion: "sangeet",
    category: "anarkali",
    primaryColor: "#FFD700",
    secondaryColor: "#228B22",
    imageUrl: "/outfits/sangeet_anarkali_yellow.jpg",
    description: "Bright yellow anarkali with green accents",
  },
  {
    id: "mehendi-1",
    name: "Green Sharara",
    occasion: "mehendi",
    category: "lehenga",
    primaryColor: "#228B22",
    secondaryColor: "#FFD700",
    imageUrl: "/outfits/mehendi_sharara_green.jpg",
    description: "Fresh green sharara set for mehendi ceremony",
  },
  {
    id: "mehendi-2",
    name: "Turmeric Kurta Set",
    occasion: "mehendi",
    category: "kurta",
    primaryColor: "#DAA520",
    secondaryColor: "#8B4513",
    imageUrl: "/outfits/mehendi_kurta_yellow.jpg",
    description: "Comfortable turmeric-themed kurta set",
  },
  {
    id: "wedding-1",
    name: "Red Banarasi Saree",
    occasion: "wedding",
    category: "saree",
    primaryColor: "#8B0000",
    secondaryColor: "#FFD700",
    imageUrl: "/outfits/wedding_saree_banarasi.jpg",
    description: "Classic red Banarasi silk for the main ceremony",
  },
  {
    id: "wedding-2",
    name: "Maroon Lehenga",
    occasion: "wedding",
    category: "lehenga",
    primaryColor: "#800000",
    secondaryColor: "#FFD700",
    imageUrl: "/outfits/wedding_lehenga_maroon.jpg",
    description: "Rich maroon lehenga with heavy zari work",
  },
  {
    id: "reception-1",
    name: "Black Cocktail Gown",
    occasion: "reception",
    category: "cocktail",
    primaryColor: "#000000",
    secondaryColor: "#C0C0C0",
    imageUrl: "/outfits/reception_gown_black.jpg",
    description: "Modern black gown for reception party",
  },
  {
    id: "reception-2",
    name: "Navy Anarkali",
    occasion: "reception",
    category: "anarkali",
    primaryColor: "#000080",
    secondaryColor: "#FFD700",
    imageUrl: "/outfits/reception_anarkali_navy.jpg",
    description: "Elegant navy blue anarkali for evening reception",
  },
];

export const OCCASIONS: { id: Occasion; name: string; description: string; emoji: string }[] = [
  { id: "sangeet", name: "Sangeet", description: "Music & dance night", emoji: "🎵" },
  { id: "mehendi", name: "Mehendi", description: "Henna ceremony", emoji: "🌿" },
  { id: "haldi", name: "Haldi", description: "Turmeric ceremony", emoji: "🌼" },
  { id: "wedding", name: "Wedding", description: "Main ceremony", emoji: "💍" },
  { id: "reception", name: "Reception", description: "After-party celebration", emoji: "✨" },
];
```

**Verify:** `npx tsc --noEmit` passes with no errors.

---

### Task 1.2 — Color Harmony Library

**File:** `src/lib/color.ts`

```typescript
/** Convert hex color to HSL values (0-360, 0-100, 0-100) */
export function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

/** Determine undertone from ITA angle (degrees) */
export function getUndertone(itaAngle: number): "warm" | "cool" | "neutral" {
  if (itaAngle > 25) return "cool";
  if (itaAngle < -15) return "warm";
  return "neutral";
}

/** Get the complementary hex color (180° opposite on color wheel) */
export function getComplementary(hex: string): string {
  const { h, s, l } = hexToHSL(hex);
  const compH = (h + 180) % 360;
  return hslToHex(compH, s, l);
}

/** Score harmony between a skin tone and an outfit primary color (0-1) */
export function harmonyScore(skinHex: string, outfitHex: string): number {
  const skin = hexToHSL(skinHex);
  const outfit = hexToHSL(outfitHex);

  const hueDiff = Math.abs(skin.h - outfit.h);
  const normalizedDiff = Math.min(hueDiff, 360 - hueDiff) / 180; // 0 = same, 1 = opposite

  if (normalizedDiff < 0.17) return 1.0;       // analogous
  if (normalizedDiff < 0.33) return 0.8;       // close
  if (normalizedDiff < 0.5) return 0.6;        // neutral
  return 0.4;                                   // clash
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
```

**Verify:** `npx tsc --noEmit` passes.

---

### Task 1.3 — Skin Tone API Route

**File:** `src/app/api/skin-tone/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const YOUCAM_API_KEY = process.env.YOUCAM_API_KEY || "";
const YOUCAM_BASE = process.env.YOUCAM_BASE_URL || "https://yce-api-01.makeupar.com/s2s/v2.0";
const MOCK_MODE = process.env.MOCK_MODE === "true";

interface SkinToneResult {
  ita_value: number;
  skin_color: string;
  eye_color: string;
  lip_color: string;
  hair_color: string;
  Fitzpatrick_type?: number;
}

async function uploadFile(apiKey: string, filePath: string, fileName: string): Promise<string> {
  const fileSize = (await fs.stat(filePath)).st_size;

  const uploadRes = await fetch(`${YOUCAM_BASE}/file/skin-tone-analysis`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      files: [{
        content_type: "image/jpeg",
        file_name: fileName,
        file_size: fileSize,
      }],
    }),
  });

  if (!uploadRes.ok) {
    throw new Error(`Upload failed: ${uploadRes.status} ${await uploadRes.text()}`);
  }

  const uploadData = await uploadRes.json();
  const fileId = uploadData.data.files[0].file_id;
  const putUrl = uploadData.data.files[0].upload_url;

  const fileBuffer = await fs.readFile(filePath);
  const putRes = await fetch(putUrl, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "image/jpeg",
    },
    body: fileBuffer,
  });

  if (!putRes.ok) {
    throw new Error(`PUT failed: ${putRes.status}`);
  }

  return fileId;
}

async function submitTask(apiKey: string, srcFileId: string): Promise<string> {
  const res = await fetch(`${YOUCAM_BASE}/task/skin-tone-analysis`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      src_file_id: srcFileId,
      format: "json",
    }),
  });

  if (!res.ok) {
    throw new Error(`Submit failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return data.data.task_id;
}

async function pollTask(apiKey: string, taskId: string, timeout = 60000): Promise<SkinToneResult> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const res = await fetch(`${YOUCAM_BASE}/task/skin-tone-analysis/${taskId}`, {
      headers: { "Authorization": `Bearer ${apiKey}` },
    });

    if (!res.ok) throw new Error(`Poll failed: ${res.status}`);

    const data = await res.json();
    if (data.data.task_status === "success") return data.data.result as SkinToneResult;
    if (data.data.task_status === "failed") throw new Error(`Task failed: ${data.data.error || "unknown"}`);

    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error("Timeout waiting for skin tone analysis");
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json({ success: false, error: "No image provided" }, { status: 400 });
    }

    if (MOCK_MODE || !YOUCAM_API_KEY) {
      return NextResponse.json({
        success: true,
        result: {
          ita_value: -5.2,
          skin_color: "#8D5524",
          eye_color: "#3D2314",
          lip_color: "#A0522D",
          hair_color: "#1a1a1a",
          Fitzpatrick_type: 4,
        },
        mode: "mock",
      });
    }

    const outDir = path.join(process.cwd(), "out", "skin_tone");
    await fs.mkdir(outDir, { recursive: true });
    const imagePath = path.join(outDir, `skin_${Date.now()}.jpg`);
    const bytes = await image.arrayBuffer();
    await fs.writeFile(imagePath, Buffer.from(bytes));

    const fileId = await uploadFile(YOUCAM_API_KEY, imagePath, image.name);
    const taskId = await submitTask(YOUCAM_API_KEY, fileId);
    const result = await pollTask(YOUCAM_API_KEY, taskId);

    return NextResponse.json({ success: true, result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
```

**Verify:** `npx tsc --noEmit` passes. Mock mode returns correct shape.

---

### Task 1.4 — Extend VTO Route for Batch Mode

**File:** `src/app/api/vto/route.ts` (append batch handler)

Add a batch handler function and route it when `?batch=true`:

```typescript
// Add these functions after the existing pollTask function, before the POST export:

async function handleBatchVTO(req: NextRequest) {
  const body: { userId: string; garmentIds: string[]; category: string } = await req.json();
  const { userId, garmentIds, category } = body;

  if (MOCK_MODE || !YOUCAM_API_KEY) {
    return NextResponse.json({
      success: true,
      results: garmentIds.map((id) => ({
        garmentId: id,
        resultUrl: `/garment_test/${id}_hd_result.png`,
        mode: "mock",
      })),
    });
  }

  const outDir = path.join(process.cwd(), "out", "garment_test");
  const userPath = path.join(outDir, `${userId}.jpg`);

  await fs.access(userPath);
  const srcFileId = await uploadFile(YOUCAM_API_KEY, userPath, path.basename(userPath));

  const results = [];
  for (const garmentId of garmentIds) {
    const garmentPath = path.join(outDir, `${garmentId}.png`);
    try {
      await fs.access(garmentPath);
      const refFileId = await uploadFile(YOUCAM_API_KEY, garmentPath, path.basename(garmentPath));
      const taskId = await submitTask(YOUCAM_API_KEY, srcFileId, refFileId, category);
      const resultUrl = await pollTask(YOUCAM_API_KEY, taskId);
      results.push({ garmentId, resultUrl });
    } catch (err) {
      results.push({ garmentId, error: err instanceof Error ? err.message : "unknown" });
    }
  }

  return NextResponse.json({ success: true, results });
}
```

Then modify the existing `POST` export to dispatch to batch:

```typescript
export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    if (searchParams.get("batch") === "true") {
      return handleBatchVTO(req);
    }

    // ... existing single-garment logic unchanged below ...
```

**Verify:** `npx tsc --noEmit` passes.

---

## Phase 2: Components

### Task 2.1 — OccasionPicker Component

**File:** `src/components/OccasionPicker.tsx`

```tsx
"use client";

import { cn } from "tailwind-merge";

interface Props {
  selected: string | null;
  onSelect: (occasion: string) => void;
}

const OCCASION_EMOJIS: Record<string, string> = {
  sangeet: "🎵",
  mehendi: "🌿",
  haldi: "🌼",
  wedding: "💍",
  reception: "✨",
};

export default function OccasionPicker({ selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {(["sangeet", "mehendi", "haldi", "wedding", "reception"] as const).map((id) => (
        <button
          key={id}
          type="button"
          onClick={() => onSelect(id)}
          className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200",
            selected === id
              ? "border-violet-500 bg-violet-500/10 scale-105"
              : "border-gray-700 hover:border-gray-500 hover:bg-gray-800/50"
          )}
        >
          <span className="text-2xl">{OCCASION_EMOJIS[id]}</span>
          <span className="text-xs font-medium text-gray-300 capitalize">{id}</span>
          {selected === id && <div className="w-2 h-2 rounded-full bg-violet-400" />}
        </button>
      ))}
    </div>
  );
}
```

**Verify:** Renders 5 buttons. Clicking updates selection state via `onSelect`.

---

### Task 2.2 — SkinToneResult Component

**File:** `src/components/SkinToneResult.tsx`

```tsx
"use client";

import { CheckCircle, Loader2 } from "lucide-react";

interface SkinToneData {
  ita_value: number;
  skin_color: string;
  eye_color: string;
  lip_color: string;
  hair_color: string;
  Fitzpatrick_type?: number;
}

interface Props {
  result: SkinToneData | null;
  loading: boolean;
  onSelect: (data: SkinToneData) => void;
}

export default function SkinToneResult({ result, loading, onSelect }: Props) {
  if (loading) {
    return (
      <div className="glass rounded-xl p-6 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-400 mx-auto mb-3" />
        <p className="text-sm text-gray-400">Analyzing your skin tone...</p>
        <p className="text-xs text-gray-600 mt-1">This takes ~10 seconds</p>
      </div>
    );
  }

  if (!result) return null;

  const undertone = result.ita_value > 25 ? "Cool" : result.ita_value < -15 ? "Warm" : "Neutral";
  const fitzpatrick = result.Fitzpatrick_type ?? "?";

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="w-5 h-5 text-green-400" />
        <h3 className="font-semibold">Skin Profile Complete</h3>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div
          className="w-16 h-16 rounded-full border-2 border-gray-600 shadow-lg"
          style={{ backgroundColor: result.skin_color }}
        />
        <div className="space-y-1">
          <p className="text-sm text-gray-300">
            <span className="text-gray-500">Undertone:</span> {undertone}
          </p>
          <p className="text-sm text-gray-300">
            <span className="text-gray-500">Fitzpatrick:</span> Type {fitzpatrick}
          </p>
          <p className="text-sm text-gray-300">
            <span className="text-gray-500">ITA:</span> {result.ita_value.toFixed(1)}°
          </p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">Your palette colors</p>
        <div className="flex gap-2">
          {(
            ["skin_color", "eye_color", "lip_color", "hair_color"] as const
          ).map((key) => (
            <div
              key={key}
              className="w-8 h-8 rounded-lg border border-gray-700"
              style={{ backgroundColor: result[key] }}
              title={`${key.replace("_", " ")}: ${result[key]}`}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onSelect(result)}
        className="w-full py-3 bg-gradient-to-r from-violet-600 to-blue-600 rounded-lg font-medium text-sm hover:from-violet-500 hover:to-blue-500 transition-all"
      >
        Continue to Outfits →
      </button>
    </div>
  );
}
```

**Verify:** Shows loading spinner when `loading=true`, result card when data present, nothing when null.

---

### Task 2.3 — GarmentGallery Component

**File:** `src/components/GarmentGallery.tsx`

```tsx
"use client";

import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { cn } from "tailwind-merge";
import type { Outfit } from "@/data/outfits";

interface Props {
  outfits: Outfit[];
  skinTone: string | null;
  onSelect: (outfit: Outfit) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  results: Record<string, string>;
}

export default function GarmentGallery({
  outfits,
  skinTone,
  onSelect,
  favorites,
  onToggleFavorite,
  results,
}: Props) {
  const [view, setView] = useState<"all" | "shortlist">("all");

  const shortlisted = outfits.filter((o) => favorites.includes(o.id));
  const displayOutfits = view === "shortlist" ? shortlisted : outfits;

  if (outfits.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No outfits found for this occasion.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-400">
          {displayOutfits.length} outfit{displayOutfits.length !== 1 ? "s" : ""}
          {skinTone && <span className="text-violet-400"> · Skin-matched</span>}
        </p>
        <div className="flex gap-2">
          {(["all", "shortlist"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={cn(
                "px-3 py-1 text-xs rounded-lg transition-colors",
                view === v ? "bg-violet-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
              )}
            >
              {v === "shortlist" ? `Shortlist (${shortlisted.length})` : "All"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayOutfits.map((outfit) => {
          const hasResult = !!results[outfit.id];
          const isFav = favorites.includes(outfit.id);

          return (
            <div
              key={outfit.id}
              className={cn(
                "relative group rounded-xl overflow-hidden border transition-all duration-200",
                hasResult ? "border-green-500/50" : "border-gray-700",
                "hover:border-violet-500 hover:shadow-lg hover:shadow-violet-500/10"
              )}
            >
              <div className="aspect-[3/4] relative overflow-hidden bg-gray-800">
                <img
                  src={outfit.imageUrl}
                  alt={outfit.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 opacity-20"
                  style={{ background: `linear-gradient(to top, ${outfit.primaryColor}40, transparent)` }}
                />
              </div>

              <div className="p-3">
                <p className="text-sm font-medium text-gray-200 truncate">{outfit.name}</p>
                <p className="text-xs text-gray-500 capitalize">{outfit.category}</p>
                <div className="flex gap-1 mt-2">
                  <div
                    className="w-4 h-4 rounded-full border border-gray-600"
                    style={{ backgroundColor: outfit.primaryColor }}
                  />
                  <div
                    className="w-4 h-4 rounded-full border border-gray-600"
                    style={{ backgroundColor: outfit.secondaryColor }}
                  />
                </div>
              </div>

              <div className="absolute top-2 right-2 flex gap-1">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onToggleFavorite(outfit.id); }}
                  className="p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                  aria-label={isFav ? "Remove from shortlist" : "Add to shortlist"}
                >
                  <Heart className={cn("w-4 h-4", isFav ? "fill-red-500 text-red-500" : "text-white")} />
                </button>
              </div>

              <button
                type="button"
                onClick={() => onSelect(outfit)}
                className={cn(
                  "absolute inset-x-0 bottom-0 py-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-sm font-medium",
                  hasResult && "opacity-100"
                )}
              >
                {hasResult ? (
                  <span className="text-green-400">✓ Tried on</span>
                ) : (
                  "Try On"
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

**Verify:** Grid renders, hover shows Try On button, favorites toggle works.

---

### Task 2.4 — TryOnPanel Component

**File:** `src/components/TryOnPanel.tsx`

```tsx
"use client";

import { X, Loader2, ImageOff } from "lucide-react";

interface Props {
  outfitName: string;
  resultUrl: string | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
}

export default function TryOnPanel({ outfitName, resultUrl, loading, error, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass rounded-2xl max-w-2xl w-full p-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <h3 className="text-lg font-semibold mb-4">{outfitName} — Try-On Result</h3>

        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="w-12 h-12 animate-spin text-violet-400 mb-4" />
            <p className="text-sm">Generating your look...</p>
            <p className="text-xs text-gray-600 mt-1">This may take 15–30 seconds</p>
          </div>
        ) : error ? (
          <div className="h-96 flex flex-col items-center justify-center text-red-400">
            <ImageOff className="w-12 h-12 mb-3" />
            <p className="text-sm">{error}</p>
          </div>
        ) : resultUrl ? (
          <div className="space-y-3">
            <img
              src={resultUrl}
              alt={`You wearing ${outfitName}`}
              className="w-full rounded-xl"
            />
            {process.env.NEXT_PUBLIC_MOCK_MODE === "true" && (
              <p className="text-xs text-gray-500 text-center">
                Mock mode — set YOUCAM_API_KEY for real renders
              </p>
            )}
          </div>
        ) : (
          <div className="h-96 flex items-center justify-center text-gray-600">No result yet</div>
        )}
      </div>
    </div>
  );
}
```

**Verify:** Modal opens/closes. Shows correct state for loading/error/result/empty.

---

### Task 2.5 — ShareSheet Component

**File:** `src/components/ShareSheet.tsx`

```tsx
"use client";

import { useState } from "react";
import { WhatsApp, Link as LinkIcon, Check } from "lucide-react";
import { cn } from "tailwind-merge";

interface Props {
  outfits: Array<{ name: string; resultUrl: string }>;
  occasion: string;
}

export default function ShareSheet({ outfits, occasion }: Props) {
  const [copied, setCopied] = useState(false);

  const shareText = `I'm going to a ${occasion}! Check out my outfit shortlist:\n${outfits.map((o) => `• ${o.name}`).join("\n")}`;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://wa.me/?text=${encoded}`, "_blank", "noopener,noreferrer");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass rounded-xl p-5 mt-6">
      <h3 className="font-semibold mb-3 flex items-center gap-2">Share Your Shortlist</h3>
      <p className="text-xs text-gray-400 mb-4">Send your outfit choices to family for approval</p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleWhatsApp}
          className="flex-1 py-3 bg-green-600 hover:bg-green-500 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors"
        >
          <WhatsApp className="w-4 h-4" /> WhatsApp
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "flex-1 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors",
            copied ? "bg-violet-600 text-white" : "bg-gray-700 hover:bg-gray-600 text-gray-200"
          )}
        >
          {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>
    </div>
  );
}
```

**Verify:** WhatsApp opens a new tab. Copy button transitions to "Copied!" state.

---

## Phase 3: Pages

### Task 3.1 — Landing Page

**File:** `src/app/page.tsx`

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "tailwind-merge";
import Navbar from "@/components/Navbar";
import OccasionPicker from "@/components/OccasionPicker";

export default function Home() {
  const router = useRouter();
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);

  const handleContinue = () => {
    if (!selectedOccasion) return;
    router.push(`/analyze?occasion=${selectedOccasion}`);
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">
            <span className="gradient-text">SangeetFit</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Find the perfect outfit for every wedding function
          </p>
          <p className="text-gray-600 text-sm mt-2">
            AI-powered skin tone analysis · Virtual try-on · Share with family
          </p>
        </div>

        <div className="glass rounded-2xl p-8 mb-8">
          <h2 className="text-lg font-semibold mb-2">Which event are you dressing for?</h2>
          <p className="text-sm text-gray-500 mb-6">Select the occasion to see curated outfits</p>
          <OccasionPicker selected={selectedOccasion} onSelect={setSelectedOccasion} />
        </div>

        <button
          type="button"
          onClick={handleContinue}
          disabled={!selectedOccasion}
          className={cn(
            "w-full py-4 rounded-xl font-semibold text-lg transition-all",
            selectedOccasion
              ? "bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white shadow-lg shadow-violet-500/20"
              : "bg-gray-800 text-gray-500 cursor-not-allowed"
          )}
        >
          {selectedOccasion
            ? `Find Outfits for ${selectedOccasion} →`
            : "Select an occasion to continue"}
        </button>
      </div>
    </main>
  );
}
```

**Verify:** Renders hero, picker, and conditional button. Navigate to `/analyze` on selection.

---

### Task 3.2 — Analyze Page

**File:** `src/app/analyze/page.tsx`

```tsx
"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Camera, Loader2, AlertCircle } from "lucide-react";
import { cn } from "tailwind-merge";
import Navbar from "@/components/Navbar";
import SkinToneResult from "@/components/SkinToneResult";

type SkinToneData = {
  ita_value: number;
  skin_color: string;
  eye_color: string;
  lip_color: string;
  hair_color: string;
  Fitzpatrick_type?: number;
};

export default function AnalyzePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const occasion = searchParams.get("occasion") || "wedding";

  const [photo, setPhoto] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<SkinToneData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10MB");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!photo) return;
    setAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const byteCharacters = atob(photo.split(",")[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("image", blob, "selfie.jpg");

      const res = await fetch("/api/skin-tone", { method: "POST", body: formData });
      const data = await res.json();

      if (data.success) {
        setResult(data.result);
      } else {
        setError(data.error || "Analysis failed");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleContinue = (skinData: SkinToneData) => {
    const params = new URLSearchParams({ occasion, skinColor: skinData.skin_color });
    router.push(`/tryon?${params.toString()}`);
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-300 mb-6 flex items-center gap-1"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold mb-2">
          Analyze Your <span className="gradient-text">Skin Tone</span>
        </h1>
        <p className="text-gray-400 mb-8">
          For <span className="text-violet-400 capitalize">{occasion}</span> — we will match outfits to your complexion
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="glass rounded-xl p-6">
              {photo ? (
                <div className="space-y-3">
                  <img src={photo} alt="Selfie" className="w-full aspect-[3/4] object-cover rounded-lg" />
                  <p className="text-xs text-green-400">✓ Photo ready</p>
                </div>
              ) : (
                <div
                  className="aspect-[3/4] border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-violet-500 transition-colors"
                  onClick={() => fileRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
                >
                  <Camera className="w-10 h-10 text-gray-600 mb-3" />
                  <p className="text-sm text-gray-400">Upload your selfie</p>
                  <p className="text-xs text-gray-600 mt-1">Frontal face, even lighting</p>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                </div>
              )}
              {error && (
                <p className="text-xs text-red-400 flex items-center gap-1 mt-2">
                  <AlertCircle className="w-3 h-3" /> {error}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!photo || analyzing}
              className={cn(
                "w-full py-3 rounded-xl font-medium transition-all",
                photo && !analyzing
                  ? "bg-violet-600 hover:bg-violet-500 text-white"
                  : "bg-gray-800 text-gray-500 cursor-not-allowed"
              )}
            >
              {analyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
                </span>
              ) : "Analyze Skin Tone"}
            </button>
          </div>

          <div>
            <SkinToneResult result={result} loading={analyzing} onSelect={handleContinue} />
          </div>
        </div>
      </div>
    </main>
  );
}
```

**Verify:** Upload triggers FileReader. Analyze calls API. Result flows to try-on page via URL params.

---

### Task 3.3 — Try-On Page

**File:** `src/app/tryon/page.tsx`

```tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import GarmentGallery from "@/components/GarmentGallery";
import TryOnPanel from "@/components/TryOnPanel";
import ShareSheet from "@/components/ShareSheet";
import { OUTFITS, type Outfit } from "@/data/outfits";
import { harmonyScore } from "@/lib/color";

export default function TryOnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const occasion = searchParams.get("occasion") || "wedding";
  const skinColor = searchParams.get("skinColor") || "#8D5524";

  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [results, setResults] = useState<Record<string, string>>({});
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [panelResult, setPanelResult] = useState<string | null>(null);
  const [panelLoading, setPanelLoading] = useState(false);
  const [panelError, setPanelError] = useState<string | null>(null);

  useEffect(() => {
    const filtered = OUTFITS.filter((o) => o.occasion === occasion);
    const scored = filtered.sort((a, b) => {
      const scoreA = harmonyScore(skinColor, a.primaryColor);
      const scoreB = harmonyScore(skinColor, b.primaryColor);
      return scoreB - scoreA;
    });
    setOutfits(scored);
  }, [occasion, skinColor]);

  const handleSelect = async (outfit: Outfit) => {
    setSelectedOutfit(outfit);
    setPanelLoading(true);
    setPanelResult(null);
    setPanelError(null);

    try {
      const res = await fetch("/api/vto?batch=true", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "user_fullbody_hd",
          garmentIds: [outfit.id],
          category: outfit.category,
        }),
      });

      const data = await res.json();
      if (data.success && data.results?.[0]?.resultUrl) {
        setPanelResult(data.results[0].resultUrl);
        setResults((prev) => ({ ...prev, [outfit.id]: data.results[0].resultUrl }));
      } else {
        setPanelError(data.error || "Try-on failed");
      }
    } catch {
      setPanelError("Network error");
    } finally {
      setPanelLoading(false);
    }
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:text-gray-300 mb-4 flex items-center gap-1"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold mb-1">
            Your <span className="gradient-text">{occasion.charAt(0).toUpperCase() + occasion.slice(1)}</span> Outfits
          </h1>
          <p className="text-gray-400 text-sm">
            {outfits.length} outfits matched to your skin tone — click to try on
          </p>
        </div>

        <GarmentGallery
          outfits={outfits}
          skinTone={skinColor}
          onSelect={handleSelect}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          results={results}
        />

        {favorites.length > 0 && (
          <ShareSheet
            outfits={favorites
              .map((id) => outfits.find((o) => o.id === id))
              .filter((o): o is Outfit => !!o)
              .map((o) => ({ name: o.name, resultUrl: results[o.id] || "" }))}
            occasion={occasion}
          />
        )}

        {selectedOutfit && (
          <TryOnPanel
            outfitName={selectedOutfit.name}
            resultUrl={panelResult}
            loading={panelLoading}
            error={panelError}
            onClose={() => setSelectedOutfit(null)}
          />
        )}
      </div>
    </main>
  );
}
```

**Verify:** Page loads, filters by occasion, try-on modal processes correctly.

---

### Task 3.4 — Update Navbar & Layout

**File:** `src/components/Navbar.tsx`

```tsx
import { Shirt } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-amber-500 flex items-center justify-center">
            <Shirt className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg gradient-text">SangeetFit</h1>
            <p className="text-xs text-gray-500">AI Wedding Stylist</p>
          </div>
        </div>
        <span className="text-xs text-gray-600">
          {process.env.NEXT_PUBLIC_MOCK_MODE === "true" ? "Mock mode" : "Live API"}
        </span>
      </div>
    </nav>
  );
}
```

**File:** `src/app/layout.tsx`

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SangeetFit — AI Wedding Outfit Stylist",
  description: "Find the perfect outfit for every Indian wedding function. AI-powered skin tone analysis and virtual try-on.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0a0f] text-gray-100">
        {children}
      </body>
    </html>
  );
}
```

**Verify:** `npx tsc --noEmit` clean. `npm run dev` starts without errors.

---

## Phase 4: Polish

### Task 4.1 — Extend globals.css

**File:** `src/app/globals.css` — append after existing content:

```css
/* Gradient text utility */
.gradient-text {
  background: linear-gradient(135deg, #a78bfa, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
```

### Task 4.2 — Sample Garment Images

Place 8 garment images in `public/outfits/`:

```
public/outfits/
├── sangeet_lehenga_red.jpg
├── sangeet_anarkali_yellow.jpg
├── mehendi_sharara_green.jpg
├── mehendi_kurta_yellow.jpg
├── wedding_saree_banarasi.jpg
├── wedding_lehenga_maroon.jpg
├── reception_gown_black.jpg
└── reception_anarkali_navy.jpg
```

Source from Unsplash/Pexels (search: "Indian wedding outfit", filter: free commercial use) or generate with AI.

### Task 4.3 — Environment Setup

**File:** `.env.local`

```bash
YOUCAM_API_KEY=your_key_here
YOUCAM_BASE_URL=https://yce-api-01.makeupar.com/s2s/v2.0
MOCK_MODE=true
NEXT_PUBLIC_MOCK_MODE=true
```

**File:** `.gitignore` — ensure these lines exist:

```
.env.local
.next/
out/
```

---

## Testing

### Manual Test Checklist

- [ ] `npm run dev` starts without errors
- [ ] Homepage shows occasion picker
- [ ] Selecting occasion navigates to analyze page with query param
- [ ] Uploading photo shows preview
- [ ] "Analyze" button calls API, shows loading, displays result
- [ ] "Continue to Outfits" navigates to try-on page with skinColor param
- [ ] Try-on page shows filtered outfits sorted by harmony score
- [ ] Clicking "Try On" opens modal, shows mock result after ~1s
- [ ] Favorites toggle works, shortlist view filters correctly
- [ ] Share sheet appears when favorites > 0
- [ ] WhatsApp button opens wa.me link
- [ ] Copy Link copies to clipboard with "Copied!" feedback

### Unit Tests (optional)

**File:** `src/lib/color.test.ts`

```typescript
import { describe, it, expect } from "vitest";
import { hexToHSL, harmonyScore, getUndertone } from "./color";

describe("hexToHSL", () => {
  it("converts white", () => {
    expect(hexToHSL("#ffffff")).toEqual({ h: 0, s: 0, l: 100 });
  });
  it("converts black", () => {
    expect(hexToHSL("#000000")).toEqual({ h: 0, s: 0, l: 0 });
  });
});

describe("harmonyScore", () => {
  it("scores same hue highest", () => {
    expect(harmonyScore("#8D5524", "#8D5524")).toBe(1.0);
  });
  it("scores complementary lower", () => {
    expect(harmonyScore("#8D5524", "#24558D")).toBeLessThan(0.6);
  });
});

describe("getUndertone", () => {
  it("returns warm for negative ITA", () => {
    expect(getUndertone(-10)).toBe("warm");
  });
  it("returns cool for high ITA", () => {
    expect(getUndertone(30)).toBe("cool");
  });
  it("returns neutral for mid ITA", () => {
    expect(getUndertone(0)).toBe("neutral");
  });
});
```

---

## Commit Plan

| # | Command | Message |
|---|---------|---------|
| 1 | `git add src/data/outfits.ts src/lib/color.ts` | `feat: add outfit catalog and color utilities` |
| 2 | `git add src/app/api/skin-tone/route.ts` | `feat: add skin-tone API route` |
| 3 | `git add src/app/api/vto/route.ts` | `feat: extend VTO route with batch support` |
| 4 | `git add src/components/OccasionPicker.tsx src/components/SkinToneResult.tsx` | `feat: add occasion picker and skin tone result` |
| 5 | `git add src/app/page.tsx src/app/analyze/page.tsx` | `feat: add landing and analyze pages` |
| 6 | `git add src/components/GarmentGallery.tsx src/components/TryOnPanel.tsx src/components/ShareSheet.tsx src/app/tryon/page.tsx` | `feat: add try-on gallery and sharing` |
| 7 | `git add src/components/Navbar.tsx src/app/layout.tsx src/app/globals.css` | `chore: update navbar, layout, and styles` |
| 8 | `git add .env.local .gitignore` | `chore: add env setup` |

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| VTO fails on ethnic wear | Mock mode ensures demo works regardless |
| Skin tone API inaccurate on deep skin | Fall back to manual color picker (add input in analyze page) |
| Garment images unavailable | Use AI-generated placeholders via YouCam text-to-image |
| API unit budget exceeded | Prioritize mock mode for demo; use ≤3 real API calls |
| Time runs out | Ship core flow (occasion → analyze → 1 VTO) first, add polish after |
