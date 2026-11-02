import { strict as assert } from "node:assert";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { parseDataUrl, uploadYouCamFile } from "../src/lib/youcam.ts";
import { parseVtoInput, parseVtoImage } from "../src/lib/vto-input.ts";
import { OUTFITS } from "../src/data/outfits.ts";
import { EDITORIAL_LOOKS } from "../src/data/editorial.ts";
import { pngDataUrl } from "./fixtures/png.ts";

const validPng = pngDataUrl();

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readSource(relativePath: string): string {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

assert(parseDataUrl("data:image/jpeg;base64,aGVsbG8="), "JPEG data URL should parse");
assert(parseDataUrl("data:image/png;base64,aGVsbG8="), "PNG data URL should parse");
assert.equal(parseDataUrl("data:text/plain;base64,aGVsbG8="), null);
console.log("PASS: data URL parser accepts supported images");

const fakeFetch = (async (input: unknown, init?: RequestInit) => {
  const url = String(input);
  if (url.endsWith("/file")) {
    const body = JSON.parse(String(init?.body));
    assert.deepEqual(Object.keys(body.files[0]).sort(), ["content_type", "file_name", "file_size"]);
    return new Response(JSON.stringify({
      status: 200,
      data: {
        files: [{
          content_type: "image/png",
          file_name: "selfie.png",
          file_id: "file-id",
          requests: [{
            method: "PUT",
            url: "https://example.com/presigned-upload-url",
            headers: { "Content-Type": "image/png", "Content-Length": 9 },
          }],
        }],
      },
    }), { status: 200 });
  }

  assert.equal(url, "https://example.com/presigned-upload-url");
  assert.equal(init?.method, "PUT");
  assert.deepEqual(init?.headers, { "Content-Type": "image/png", "Content-Length": "9" });
  return new Response(null, { status: 200 });
}) as typeof fetch;

const malformedFetch = (async () => new Response(JSON.stringify({
  status: 200,
  data: {
    files: [{
      content_type: "image/png",
      file_name: "selfie.png",
      file_id: "file-id",
    }],
  },
}), { status: 200 })) as typeof fetch;

function testUploadHelper(): void {
  void (async () => {
    try {
      await uploadYouCamFile({
        apiKey: "test-key",
        baseUrl: "https://example.com/s2s/v2.0",
        buffer: Buffer.from("mock-file"),
        fileName: "selfie.png",
        contentType: "image/png",
        fetchImpl: malformedFetch,
      });
      assert.fail("Malformed upload response should fail");
    } catch (error) {
      assert.match(String(error), /Malformed upload metadata response/);
    }
    console.log("PASS: malformed upload response fails safely");

    const fileId = await uploadYouCamFile({
      apiKey: "test-key",
      baseUrl: "https://example.com/s2s/v2.0",
      buffer: Buffer.from("mock-file"),
      fileName: "selfie.png",
      contentType: "image/png",
      fetchImpl: fakeFetch,
    });
    assert.equal(fileId, "file-id");
    console.log("PASS: upload helper reads requests[0]");
  })();
}

testUploadHelper();

const skinSource = readSource("docs/archive/skin-tone/route.ts");
assert(skinSource.includes("body: JSON.stringify({ src_file_id: fileId })"));
assert(skinSource.includes("/task/skin-tone-analysis/${taskId}"));
assert(!skinSource.includes("pollTask(YOUCAM_API_KEY, fileId)"));
assert(skinSource.includes('data.data.task_status === "error"'));
assert(!skinSource.includes('data.data.task_status === "failed"'));
console.log("PASS: archived skin task uses src_file_id and task_id");

const vtoSource = readSource("src/app/api/vto/route.ts");
// Per-outfit reference allowlist with garmentType scoping (no category collapse).
assert(vtoSource.includes("EDITORIAL_LOOKS.filter(outfit => outfit.vtoSupported)"), "allowlist must be derived from vto-supported editorial looks");
assert(vtoSource.includes("garmentTypes: [outfit.garmentType]"), "each reference keeps its own garmentType (no category collapse)");
for (const garmentType of ["lehenga-choli", "saree", "kurta-set", "anarkali", "bandhgala", "sharara", "jacket-set"]) {
  assert(EDITORIAL_LOOKS.some(outfit => outfit.vtoSupported && outfit.garmentType === garmentType), `${garmentType} must have a vto-supported reference`);
}
assert(!/fullbody_mock/.test(vtoSource.match(/const REFERENCE_ASSETS[\s\S]{0,600}};/)?.[0] ?? ""), "fullbody_mock.png must not be allowlisted as a garment reference");
// VTO uses the separate full-body input, not the face selfie.
const supported = OUTFITS.find(outfit => outfit.vtoSupported && outfit.tryOnReference)!;
const parsedVto = parseVtoInput({ fullBodyDataUrl: validPng, garmentId: supported.id, referenceAsset: supported.tryOnReference, vtoSupported: true });
assert.equal(parsedVto.kind, "catalogue");
assert(parsedVto.fullBody?.buffer.equals(Buffer.from(validPng.split(",")[1], "base64")));
assert(!vtoSource.includes("selfieDataUrl"), "VTO must not reference the face selfie");
assert(vtoSource.includes("Try-on is not supported for this outfit yet"));
assert(vtoSource.includes('garment_category: category'), "Cloth V4 request must use the documented category field");
assert(vtoSource.includes('mode: "live"'));
assert(vtoSource.includes("/task/cloth-v4/${taskId}"));
assert(vtoSource.includes('data.data.task_status === "error"'));
assert(!vtoSource.includes("/file/cloth-v3"));
assert(!vtoSource.includes("format:"));
// Missing/invalid live VTO source is rejected before any external request.
assert(vtoSource.includes('A full-body photo is required for virtual try-on'), "live mode must reject missing full-body source");
assert.throws(() => parseVtoImage("data:image/png;base64,aGVsbG8=", "Full-body photo"), /Full-body photo must be a valid JPG or PNG image/);
assert.throws(() => parseVtoImage(pngDataUrl(127, 127), "Photo"), /at least 128 pixels/);
assert(parseVtoImage(pngDataUrl(128, 1), "Photo"), "minimum uses longest side without upscaling");
// Do not reuse the face selfie and do not silently fall back to a sample in live mode.
assert(vtoSource.includes("never fall back to a sample"), "live mode must not fall back to a sample");
console.log("PASS: VTO category, full-body source, and live contract");

const pageSource = readSource("src/app/page.tsx");
assert(pageSource.includes("garmentId: outfit.id"));
assert(pageSource.includes("referenceAsset: outfit.tryOnReference"));
assert(pageSource.includes("vtoSupported: outfit.vtoSupported"));
assert(pageSource.includes("displayImage: outfit.imageUrl"));
assert(!pageSource.includes("selfieDataUrl, garmentId"), "frontend must not send the face selfie to VTO");
assert(pageSource.includes("vtoModal.resultUrl"));
assert(pageSource.includes('data.mode !== "live" && data.mode !== "mock"'), "unknown result modes must be rejected, not silently labelled mock");
// Candidate references do not appear as primary recommendations; own uploads remain valid.
assert(pageSource.includes("!outfit.vtoSupported || !outfit.tryOnReference"));
assert(pageSource.includes("Generate try-on"), "generation must remain an explicit user action");
// Client-side validation for the full-body photo.
assert(pageSource.includes('file.type.startsWith("image/")'));
assert(pageSource.includes("10 * 1024 * 1024"));
// Outfit change preserves the full-body input (kept in state, not read directly).
assert(pageSource.includes("fullBodyDataUrl"));
console.log("PASS: frontend forwards per-outfit fields and renders live URLs");

const skinMockSource = skinSource.match(/MOCK_MODE[\s\S]{0,240}mode: "mock"/)?.[0] ?? "";
assert(skinMockSource.includes('skin_color: "#b9947c"'));
void (async () => {
  process.env.MOCK_MODE = "true";
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => { throw new Error("Mock must not call the network"); }) as typeof fetch;
  try {
    const { POST } = await import("../src/app/api/vto/route.ts");
    const response = await POST(new Request("http://localhost/api/vto", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
      garmentId: supported.id, referenceAsset: supported.tryOnReference, vtoSupported: true, displayImage: "https://example.test/unrelated.png",
    }) }) as never);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { success: true, resultUrl: supported.imageUrl, displayImage: supported.imageUrl, mode: "mock", autoSave: null });
    console.log("PASS: mock placeholder comes from server catalogue, not client displayImage, with zero network calls");
  } finally { globalThis.fetch = originalFetch; }
})().catch(error => { console.error(error); process.exit(1); });

for (const source of [skinSource, vtoSource, pageSource]) {
  assert(!source.includes("console.log"));
}
assert(/Authorization[^\n]*`Bearer \$\{apiKey\}`/.test(vtoSource));
assert(!pageSource.includes("process.env.YOUCAM_API_KEY"));
console.log("PASS: credentials remain server-side and unlogged");
