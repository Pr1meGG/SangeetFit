/**
 * Color utilities for SangeetFit — purely mathematical, no styling claims.
 *
 * `hueSimilarity` computes angular hue distance on the colour wheel.
 * It does not assert whether a garment suits a person; that logic
 * belongs in the recommendation layer (Phase 3).
 */

// ── Hex parsing helpers ────────────────────────────────────────────────────

type HexTuple = [number, number, number];

/**
 * Parse a `#RGB` or `#RRGGBB` string into [r, g, b] ∈ [0, 255].
 * Returns null for any malformed input.
 */
function parseHex(hex: unknown): HexTuple | null {
  if (typeof hex !== "string") return null;

  if (!hex.startsWith("#")) return null;
  const clean = hex.slice(1);

  // 3-char shorthand
  if (/^[0-9a-fA-F]{3}$/.test(clean)) {
    return [
      parseInt(clean[0] + clean[0], 16),
      parseInt(clean[1] + clean[1], 16),
      parseInt(clean[2] + clean[2], 16),
    ];
  }

  // 6-char full form
  if (/^[0-9a-fA-F]{6}$/.test(clean)) {
    return [
      parseInt(clean.slice(0, 2), 16),
      parseInt(clean.slice(2, 4), 16),
      parseInt(clean.slice(4, 6), 16),
    ];
  }

  return null;
}

// ── RGB → HSL ──────────────────────────────────────────────────────────────

/**
 * Convert an [r, g, b] tuple (each 0–255) to HSL.
 * Hue is in degrees [0, 360); saturation and lightness are percents [0, 100].
 */
function rgbToHSL(r: number, g: number, b: number): {
  h: number;
  s: number;
  l: number;
} {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Convert a hex colour string to HSL.
 * Accepts 3-char (#RGB) and 6-char (#RRGGBB) formats.
 * Returns null for malformed input.
 */
export function hexToHSL(hex: string): { h: number; s: number; l: number } | null {
  const rgb = parseHex(hex);
  if (!rgb) return null;
  return rgbToHSL(rgb[0], rgb[1], rgb[2]);
}

/**
 * Compute angular hue similarity between two hex colours (0–1 | null).
 *
 * Formula: similarity = 1 − (shortestHueDifference / 180)
 *
 * Identical hues → 1.0
 * Opposite hues (180° apart) → 0.0
 *
 * Returns null when either input is an invalid hex string
 * or when either colour has zero saturation (achromatic / grayscale),
 * because hue similarity is undefined for those cases.
 *
 * This is a purely mathematical metric. It makes no claim about
 * personal suitability or styling recommendations.
 */
export function hueSimilarity(colorA: string, colorB: string): number | null {
  const hslA = hexToHSL(colorA);
  const hslB = hexToHSL(colorB);

  if (!hslA || !hslB) return null;
  if (hslA.s === 0 || hslB.s === 0) return null;

  const diff = Math.abs(hslA.h - hslB.h);
  const shortestDiff = Math.min(diff, 360 - diff);

  return 1 - shortestDiff / 180;
}
