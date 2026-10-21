/**
 * Client-side image downscale/compress for uploads.
 *
 * Vercel serverless functions cap request bodies at 4.5 MB, and the API
 * expects base64-encoded images inside JSON (base64 adds ~33%). We resize
 * to a sane max dimension and re-encode as JPEG with decreasing quality
 * until the serialized data URL fits inside the per-image byte budget.
 */

// Budgets include the complete base64 data URL, not decoded image bytes.
export const MAX_UPLOAD_BYTES = 3_400_000;
export const MAX_VTO_REQUEST_BYTES = 4_000_000;
export const PERSON_UPLOAD_BYTES = 2_400_000;
export const GARMENT_UPLOAD_BYTES = 1_400_000;
const OUTPUT_MIME = "image/jpeg";

export function assertVtoPayloadSize(payload: unknown): void {
  const json = JSON.stringify(payload);
  if (!json || new TextEncoder().encode(json).byteLength >= MAX_VTO_REQUEST_BYTES) {
    throw new Error("These photos are too large together. Please choose smaller photos and try again.");
  }
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read the selected image"));
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not decode the selected image"));
    img.src = dataUrl;
  });
}

function canvasDataUrl(img: HTMLImageElement, maxDim: number, quality: number): string {
  const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL(OUTPUT_MIME, quality);
}

/**
 * Downscale and JPEG-compress an uploaded photo to a data URL that stays
 * under `maxBytes` once base64-encoded. PNG sources with transparency are
 * flattened onto white (JPEG has no alpha).
 */
export async function compressImageForUpload(
  file: File,
  maxDim: number,
  maxBytes: number = MAX_UPLOAD_BYTES,
): Promise<string> {
  const header = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  const jpeg = header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
  const png = [137, 80, 78, 71, 13, 10, 26, 10].every((byte, index) => header[index] === byte);
  if (!jpeg && !png) throw new Error("Please choose a valid JPG or PNG image.");
  if (!Number.isFinite(maxDim) || maxDim < 128 || !Number.isFinite(maxBytes) || maxBytes <= 0) {
    throw new Error("Invalid image upload limits.");
  }
  const original = await readAsDataUrl(file);
  const img = await loadImage(original);
  if (Math.max(img.naturalWidth, img.naturalHeight) < 128) {
    throw new Error("This image is too small. Please choose a photo with a longest side of at least 128 pixels.");
  }

  // Re-encoding applies browser EXIF orientation and removes source metadata.
  const qualities = [0.85, 0.7, 0.55, 0.4];
  let dim = Math.min(4096, Math.floor(maxDim));
  for (let attempt = 0; attempt < 8; attempt++) {
    const quality = qualities[attempt % qualities.length];
    const dataUrl = canvasDataUrl(img, dim, quality);
    if (dataUrl.length <= maxBytes) {
      return dataUrl;
    }
    if (quality === qualities[qualities.length - 1]) {
      dim = Math.max(128, Math.round(dim * 0.7));
    }
  }
  throw new Error("This image is too large even after compression. Please use a smaller photo.");
}

export { readAsDataUrl };
