/**
 * RGB color variations for optional palette inspiration.
 * These heuristics do not identify undertone or establish personal suitability.
 */

type ColorPalette = {
  primary: string; // The original skin tone
  complementary: string[];
  analogous: string[];
  triadic: string[];
  monochromatic: string[];
};

/**
 * Convert hex to RGB
 */
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) throw new Error(`Invalid hex color: ${hex}`);

  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ];
}

/**
 * Convert RGB to hex
 */
function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Shift RGB channels toward white for positive amounts and away for negative amounts.
 */
function adjustBrightness(rgb: [number, number, number], amount: number): [number, number, number] {
  return rgb.map(c => Math.max(0, Math.min(255, Math.round(c + (255 - c) * amount)))) as [number, number, number];
}

/**
 * Generate color palette from skin tone hex
 */
export function derivePalette(skinToneHex: string): ColorPalette {
  const [r, g, b] = hexToRgb(skinToneHex);

  // Channel inversions, rather than a perceptual hue rotation.
  const complementary = [
    rgbToHex(255 - r, 255 - g, 255 - b),
    rgbToHex(255 - r, g, b),
    rgbToHex(r, 255 - g, 255 - b)
  ];

  // Red-channel variations.
  const analogous = [
    rgbToHex(Math.max(0, r - 30), g, b),
    skinToneHex,
    rgbToHex(Math.min(255, r + 30), g, b)
  ];

  // Paired-channel variations, rather than true triadic hues.
  const triadic = [
    rgbToHex(r, Math.min(255, g + 50), Math.min(255, b + 50)),
    rgbToHex(Math.min(255, r + 50), g, Math.min(255, b + 50)),
    rgbToHex(Math.min(255, r + 50), Math.min(255, g + 50), b)
  ];

  // Monochromatic variations
  const monochromatic = [
    rgbToHex(...adjustBrightness([r, g, b], 0.3)), // Lighter
    rgbToHex(...adjustBrightness([r, g, b], 0.1)), // Slightly lighter
    rgbToHex(...adjustBrightness([r, g, b], -0.1)), // Slightly darker
    rgbToHex(...adjustBrightness([r, g, b], 0.3)) // Lighter
  ];

  return {
    primary: skinToneHex,
    complementary,
    analogous,
    triadic,
    monochromatic
  };
}

/**
 * Get optional color inspiration from a simple RGB ratio.
 * The output is not an undertone analysis or a suitability recommendation.
 */
export function getRecommendedColors(skinToneHex: string): string[] {
  const warmColors = [
    '#d4af37', // Gold
    '#8b4513', // Brown
    '#dc143c', // Crimson
    '#ff6b6b', // Coral
    '#ffa500', // Orange
    '#daa520'  // Goldenrod
  ];

  const coolColors = [
    '#4169e1', // Royal blue
    '#9370db', // Medium purple
    '#00ced1', // Dark turquoise
    '#4682b4', // Steel blue
    '#5f9ea0'  // Cadet blue
  ];

  // Select a preset using channel values; this does not infer skin undertone.
  const [r, g, b] = hexToRgb(skinToneHex);
  const channelRatio = (r + g) / (b + 1);

  return channelRatio > 1.5 ? warmColors : coolColors;
}

/**
 * Format color name for display
 */
export function getColorName(hex: string): string {
  const colorNames: Record<string, string> = {
    '#d4af37': 'Gold',
    '#8b4513': 'Brown',
    '#dc143c': 'Crimson',
    '#ff6b6b': 'Coral',
    '#ffa500': 'Orange',
    '#daa520': 'Goldenrod',
    '#4169e1': 'Royal Blue',
    '#9370db': 'Purple',
    '#00ced1': 'Turquoise',
    '#4682b4': 'Steel Blue',
    '#5f9ea0': 'Cadet Blue',
    '#6b1e3a': 'Burgundy',
    '#f7f1e5': 'Ivory',
    '#111111': 'Black',
    '#35634c': 'Green'
  };

  return colorNames[hex.toLowerCase()] || hex.toUpperCase();
}
