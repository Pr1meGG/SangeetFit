/**
 * Client-side image downscale/compress for uploads.
 *
 * Vercel serverless functions cap request bodies at 4.5 MB, and the API
 * expects base64-encoded images inside JSON (base64 adds ~33%). We resize
 * to a sane max dimension and re-encode as JPEG with decreasing quality
 * until the serialized data URL fits inside the per-image byte budget.
 */

export const MAX_UPLOAD_BYTES = 3_400_000; // fits ~4.5MB serialized total
const OUTPUT_MIME = "image/jpeg";

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
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser");
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
  const original = await readAsDataUrl(file);
  const img = await loadImage(original);

  if (file.size <= maxBytes && file.type === "image/jpeg") {
    return original; // already small enough JPEG; skip re-encoding
  }

  const qualities = [0.85, 0.7, 0.55, 0.4];
  let dim = maxDim;
  for (let attempt = 0; attempt < 8; attempt++) {
    const quality = qualities[attempt % qualities.length];
    const dataUrl = canvasDataUrl(img, dim, quality);
    if (dataUrl.length - "data:image/jpeg;base64,".length <= maxBytes) {
      return dataUrl;
    }
    if (quality === qualities[qualities.length - 1]) {
      dim = Math.round(dim * 0.7); // shrink dimensions once quality bottoms out
    }
  }
  throw new Error("This image is too large even after compression. Please use a smaller photo.");
}

export { readAsDataUrl };
