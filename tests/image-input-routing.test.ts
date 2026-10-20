/**
 * Image-input routing regression tests.
 *
 * Enforces the distinction introduced after the 2026-10-19 live Skin Analysis
 * failure (YouCam: "input image is smaller than the minimum size (320x320px)"
 * when a full-body shot was sent to /api/skin):
 *
 *   1. /api/skin  consumes ONLY the face selfie (imageDataUrl) — step 2 input.
 *   2. /api/vto   consumes ONLY the full-body photo (fullBodyDataUrl) — VTO modal
 *      input; the face selfie must never be reused as the VTO source.
 *   3. The full-body preview is retained on failure (upload errors never clear
 *      fullBodyDataUrl).
 *   4. A dedicated face-selfie test asset exists at >=320x320 native pixels
 *      (no upscaling of a tiny face).
 *
 * No external test framework — plain Node assert (stdlib), no network calls,
 * no YouCam API usage.
 */

import { strict as assert } from "node:assert";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

function readSource(relativePath: string): string {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

// ── 1. /api/skin is face-selfie-only ─────────────────────────────────────────

const skinSource = readSource("src/app/api/skin/route.ts");
assert(skinSource.includes("imageDataUrl"), "skin route must read imageDataUrl (face selfie)");
assert(
  !skinSource.includes("fullBodyDataUrl"),
  "skin route must not consume the full-body VTO source"
);
console.log("PASS: /api/skin consumes only the face selfie (imageDataUrl)");

// ── 2. /api/vto is full-body-only, never the face selfie ─────────────────────

const vtoSource = readSource("src/app/api/vto/route.ts");
assert(vtoSource.includes("fullBodyDataUrl"), "vto route must read fullBodyDataUrl");
assert(
  !vtoSource.includes("imageDataUrl"),
  "vto route must never accept or fall back to the face selfie field"
);
assert(
  vtoSource.includes("A full-body photo is required for virtual try-on"),
  "live vto must reject a missing full-body source instead of substituting a sample"
);
console.log("PASS: /api/vto consumes only fullBodyDataUrl and rejects a missing source");

// ── 3. Frontend routing: selfie -> /api/skin, full body -> /api/vto ──────────

const pageSource = readSource("src/app/page.tsx");

// Selfie upload handler feeds analyzeSkin, which posts imageDataUrl to /api/skin.
assert(
  /selfie-file[\s\S]{0,600}compressImageForUpload[\s\S]{0,200}analyzeSkin\(dataUrl\)/.test(pageSource),
  "the selfie file input must feed analyzeSkin"
);
assert(
  pageSource.includes("body: JSON.stringify({ imageDataUrl: dataUrl })"),
  "analyzeSkin must POST { imageDataUrl } to /api/skin"
);

// runVTO posts the full-body source; the body must not contain the selfie field.
const vtoFetchBody = pageSource.match(/body: JSON.stringify\(\{[\s\S]*?fullBodyDataUrl[\s\S]*?\}\);/);
assert(vtoFetchBody, "runVTO must POST a body containing fullBodyDataUrl");
assert(
  !vtoFetchBody[0].includes("imageDataUrl"),
  "runVTO body must not include the face-selfie field"
);
assert(
  /const src = source \?\? fullBodyDataUrl \?\? null;/.test(pageSource),
  "runVTO must source from fullBodyDataUrl only (no selfie fallback)"
);
console.log("PASS: frontend routes selfie -> /api/skin and full-body -> /api/vto");

// ── 4. Preview retained on failure ────────────────────────────────────────────

// No code path may clear the selected photo; upload failures only set an error.
assert(
  !pageSource.includes("setFullBodyDataUrl(null)"),
  "upload-failure handling must never clear fullBodyDataUrl (preview must be retained)"
);
assert(
  pageSource.includes('src={fullBodyDataUrl}'),
  "the VTO modal must render the full-body preview from fullBodyDataUrl"
);
// The oversized/type upload errors live in handleFullBodyFile alongside the preview.
assert(
  /Full-body photo must be under 10MB/.test(pageSource) &&
    /Please upload an image file/.test(pageSource),
  "sanitized full-body upload errors must remain present"
);
console.log("PASS: full-body preview retained on failure (state never cleared)");

// ── 5. Dedicated face-selfie test asset: native pixels >= 320x320 ────────────

const faceAssetPath = path.join(projectRoot, "public/garment_test/face_selfie_test.png");
assert(fs.existsSync(faceAssetPath), "face_selfie_test.png test asset must exist");
const png = fs.readFileSync(faceAssetPath);
assert(png.readUInt32BE(12) === 0x49484452, "asset must be a PNG (IHDR chunk expected)");
const width = png.readUInt32BE(16);
const height = png.readUInt32BE(20);
assert(width >= 320 && height >= 320, `face asset must be >=320x320, got ${width}x${height}`);
console.log(`PASS: face_selfie_test.png is ${width}x${height} native pixels (no upscaling)`);

// ── 6. Behavioral: a selfie-only submission cannot drive live VTO ────────────
// MOCK_MODE unset (falsy) + dummy key => live path; a body carrying only the
// selfie field must 400 before ANY network call. (Async IIFE: tsx compiles
// this file as CJS, where top-level await is unsupported.)

void (async () => {
  process.env.MOCK_MODE = "false";
  process.env.YOUCAM_API_KEY = "dummy-key-for-offline-test";

  let networkAttempted = false;
  const realFetch = globalThis.fetch;
  globalThis.fetch = (async () => {
    networkAttempted = true;
    throw new Error("network must not be reached in this offline test");
  }) as typeof fetch;

  try {
    const { OUTFITS } = await import("../src/data/outfits.ts");
    const supported = OUTFITS.find(o => o.vtoSupported && o.tryOnReference);
    assert(supported, "at least one vtoSupported outfit with a reference must exist");

    const { POST } = await import("../src/app/api/vto/route.ts");
    const request = new Request("http://localhost/api/vto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Face-selfie-shaped body: no fullBodyDataUrl anywhere.
      body: JSON.stringify({
        imageDataUrl: "data:image/png;base64,aGVsbG8=",
        garmentId: supported.id,
        referenceAsset: supported.tryOnReference,
        vtoSupported: true,
        displayImage: supported.imageUrl,
      }),
    }) as never;

    const res = await POST(request);
    assert.equal(res.status, 400, "selfie-only VTO submission must be rejected with 400");
    const data = await res.json();
    assert.equal(
      data.error,
      "A full-body photo is required for virtual try-on",
      "rejection must name the missing full-body source"
    );
    assert.equal(networkAttempted, false, "no upload/task call may fire for a selfie-only body");
    console.log("PASS: selfie-only VTO submission rejected (400) before any network call");
    console.log("\nAll image-input routing tests passed.");
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    globalThis.fetch = realFetch;
  }
})();
