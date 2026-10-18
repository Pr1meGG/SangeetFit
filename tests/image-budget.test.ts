import { strict as assert } from "node:assert";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

// Offline source-contract test for the client-side image compression helper.
// Canvas itself is browser-only; here we verify the module's budget logic,
// exports, and that callers wire errors to the existing UI fields.

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const imageSource = fs.readFileSync(path.join(projectRoot, "src/lib/image.ts"), "utf8");
const pageSource = fs.readFileSync(path.join(projectRoot, "src/app/page.tsx"), "utf8");

// Budget constant must stay below Vercel's 4.5MB body limit (base64 adds ~33%).
const budget = Number(/MAX_UPLOAD_BYTES\s*=\s*([0-9_]+)/.exec(imageSource)?.[1]?.replace(/_/g, "") ?? "0");
assert(budget > 0 && budget <= 3_500_000, `upload budget must be >0 and <=3.5MB (got ${budget})`);
console.log("PASS: MAX_UPLOAD_BYTES stays within the 4.5MB request-body limit");

// Quality ladder must descend below 1.0 and eventually shrink dimensions.
assert(imageSource.includes("canvas.toDataURL(OUTPUT_MIME, quality)"), "JPEG re-encode missing");
assert(/Math\.round\(dim \* 0\.7\)/.test(imageSource), "dimension-shrink fallback missing");
assert(imageSource.includes("too large even after compression"), "over-budget error message missing");
console.log("PASS: compression ladder has quality + dimension fallbacks and an over-budget error");

// Callers must surface compression failures (no silent drops).
assert(pageSource.includes("compressImageForUpload(file, 1280, 1_500_000)"), "selfie upload must compress with a tight budget");
assert(pageSource.includes("compressImageForUpload(file, 1600)"), "full-body upload must compress");
assert(pageSource.includes("Could not process the image"), "callers must show a user-facing compression error");
console.log("PASS: both uploads compressed; failures surfaced to the UI");
