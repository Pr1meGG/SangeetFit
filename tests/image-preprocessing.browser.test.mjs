// Synthetic pixels only; no personal files, provider requests, or app server required.
// Optional TEST_BASE_URL exercises the helper in the local app's browser origin.
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const ts = require("typescript");
const source = ts.transpileModule(readFileSync(new URL("../src/lib/image.ts", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || "chromium", headless: true });
try {
  const page = await browser.newPage();
  if (process.env.TEST_BASE_URL) await page.goto(process.env.TEST_BASE_URL);
  await page.addScriptTag({ content: `window.imageHelpers = {}; (() => { const exports = window.imageHelpers; ${source}\n})();` });
  const result = await page.evaluate(async () => {
    const { compressImageForUpload } = window.imageHelpers;
    const canvas = (width, height) => Object.assign(document.createElement("canvas"), { width, height });
    const file = async (c, type = "image/jpeg") => new File([await new Promise((resolve) => c.toBlob(resolve, type, 0.95))], "synthetic", { type });
    const inspect = async (url, pixel) => {
      const image = new Image();
      image.src = url;
      await image.decode();
      const c = canvas(image.naturalWidth, image.naturalHeight);
      c.getContext("2d").drawImage(image, 0, 0);
      return { width: c.width, height: c.height, length: url.length, pixel: pixel ? [...c.getContext("2d").getImageData(...pixel, 1, 1).data] : null };
    };
    const oversized = canvas(5000, 2000);
    oversized.getContext("2d").fillRect(0, 0, 5000, 2000);
    const oversizedFile = await file(oversized);
    const resized = await inspect(await compressImageForUpload(oversizedFile, 1600));
    const maximum = await inspect(await compressImageForUpload(oversizedFile, 8000));

    const alpha = canvas(512, 256);
    alpha.getContext("2d").fillStyle = "#ff0000";
    alpha.getContext("2d").fillRect(0, 0, 128, 256);
    const white = await inspect(await compressImageForUpload(await file(alpha, "image/png"), 1600), [400, 100]);
    const small = await inspect(await compressImageForUpload(await file(canvas(320, 180)), 1600));

    const noise = canvas(512, 512);
    const context = noise.getContext("2d");
    const pixels = context.createImageData(512, 512);
    let seed = 12345;
    for (let i = 0; i < pixels.data.length; i += 4) {
      for (let channel = 0; channel < 3; channel++) {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        pixels.data[i + channel] = seed >>> 24;
      }
      pixels.data[i + 3] = 255;
    }
    context.putImageData(pixels, 0, 0);
    const budgeted = await inspect(await compressImageForUpload(await file(noise), 512, 80_000));

    // Inject a real EXIF orientation=6 segment into a generated JPEG.
    const jpeg = new Uint8Array(await (await file(canvas(300, 200))).arrayBuffer());
    const exif = new Uint8Array([
      0xff, 0xe1, 0, 34, 69, 120, 105, 102, 0, 0,
      73, 73, 42, 0, 8, 0, 0, 0, 1, 0,
      0x12, 1, 3, 0, 1, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0,
    ]);
    const rotatedFile = new File([jpeg.slice(0, 2), exif, jpeg.slice(2)], "rotated.jpg", { type: "image/jpeg" });
    const rotated = await inspect(await compressImageForUpload(rotatedFile, 1600));
    const errors = [];
    for (const [input, limit] of [
      [await file(canvas(64, 64)), 1000],
      [new File(["not an image"], "fake.jpg", { type: "image/jpeg" }), 1000],
      [new File([new Uint8Array([255, 216, 255, 0])], "broken.jpg", { type: "image/jpeg" }), 1000],
      [await file(canvas(320, 180)), 10],
    ]) {
      try { await compressImageForUpload(input, 1600, limit); errors.push("NO ERROR"); }
      catch (error) { errors.push(error.message); }
    }
    return { sourceBytes: oversizedFile.size, resized, maximum, white, small, budgeted, rotated, errors };
  });
  assert(result.sourceBytes < 3_400_000, "fixture must reproduce a large-dimension, small-byte JPEG");
  assert.deepEqual([result.resized.width, result.resized.height], [1600, 640]);
  assert.equal(result.maximum.width, 4096);
  console.log("PASS: low-byte JPEGs still resize; every image respects the 4096-pixel maximum");
  assert(result.white.pixel.slice(0, 3).every((channel) => channel >= 250));
  assert.deepEqual([result.small.width, result.small.height], [320, 180]);
  console.log("PASS: actual PNG transparency flattens to white and small images never upscale");
  assert(result.budgeted.length <= 80_000);
  assert(result.budgeted.width < 512, "noisy fixture must exercise dimension fallback");
  console.log("PASS: actual JPEG output obeys the complete data-URL budget after compression fallback");
  assert.deepEqual([result.rotated.width, result.rotated.height], [200, 300]);
  console.log("PASS: actual EXIF-rotated JPEG normalizes to the displayed orientation");
  assert.match(result.errors[0], /too small/);
  assert.match(result.errors[1], /valid JPG or PNG/);
  assert.match(result.errors[2], /decode/);
  assert.match(result.errors[3], /too large even after compression/);
  console.log("PASS: tiny, spoofed, undecodable, and uncompressible images fail with useful errors");
} finally {
  await browser.close();
}
