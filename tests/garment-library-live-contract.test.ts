// Exercise local JPEG/PNG reference loading through the live route with fake fetch only.
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { INDIAN_WEAR_LIBRARY } from "../src/data/indian-wear.ts";
import { EDITORIAL_LOOKS } from "../src/data/editorial.ts";
import { pngDataUrl } from "./fixtures/png.ts";

void (async () => {
  process.env.MOCK_MODE = "false";
  process.env.YOUCAM_API_KEY = "offline-contract-test";
  process.env.LIVE_ACCESS_CODE = "offline-preview-code-at-least-24-characters";
  process.env.YOUCAM_BASE_URL = "https://example.test/s2s/v2.0";
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const realFetch = globalThis.fetch;
  const uploads: { content_type: string; file_name: string; file_size: number; bytes?: Buffer }[] = [];
  let tasks = 0;
  globalThis.fetch = (async (input, init) => {
    const url = String(input);
    if (url.endsWith("/file")) {
      const file = JSON.parse(String(init?.body)).files[0];
      uploads.push(file);
      return Response.json({ data: { files: [{ ...file, file_id: `file-${uploads.length}`, requests: [{
        method: "PUT", url: `https://example.test/upload/${uploads.length}`, headers: { "Content-Type": file.content_type },
      }] }] } });
    }
    if (url.startsWith("https://example.test/upload/")) {
      const upload = uploads[Number(url.split("/").pop()) - 1];
      upload.bytes = Buffer.from(init?.body as Uint8Array);
      assert.equal(upload.bytes.length, upload.file_size);
      return new Response(null, { status: 200 });
    }
    if (url.endsWith("/task/cloth-v4")) {
      assert.deepEqual(JSON.parse(String(init?.body)), { src_file_id: `file-${uploads.length - 1}`, ref_file_id: `file-${uploads.length}`, garment_category: "auto" });
      tasks++;
      return Response.json({ data: { task_id: "offline-task" } });
    }
    assert(url.endsWith("/task/cloth-v4/offline-task"), `unexpected fake request: ${url}`);
    return Response.json({ data: { task_status: "success", results: { url: "https://example.test/result.png" } } });
  }) as typeof fetch;
  try {
    const { POST } = await import("../src/app/api/vto/route.ts");
    const cases = [
      INDIAN_WEAR_LIBRARY.find(item => item.vtoSupported && item.tryOnReference?.endsWith(".jpg"))!,
      INDIAN_WEAR_LIBRARY.find(item => item.vtoSupported && item.tryOnReference?.endsWith(".png"))!,
      EDITORIAL_LOOKS[0],
    ];
    for (const outfit of cases) {
      const suffix = path.extname(outfit.tryOnReference!);
      const res = await POST(new Request("http://localhost/api/vto", { method: "POST", headers: { "Content-Type": "application/json", "x-sangeetfit-access-code": process.env.LIVE_ACCESS_CODE! }, body: JSON.stringify({
        fullBodyDataUrl: pngDataUrl(), garmentId: outfit.id, referenceAsset: outfit.tryOnReference, vtoSupported: true,
      }) }) as never);
      assert.equal(res.status, 200);
      assert.equal((await res.json()).mode, "live");
      const uploaded = uploads[uploads.length - 1];
      assert.equal(uploaded.file_name, path.basename(outfit.tryOnReference!));
      assert.equal(uploaded.content_type, suffix === ".jpg" ? "image/jpeg" : "image/png");
      assert.deepEqual(uploaded.bytes, readFileSync(path.join(root, "public", outfit.imageUrl)));
    }
    assert.equal(tasks, 3);
    console.log("PASS: sourced JPEG/PNG and original concept references load exact local bytes with correct MIME/basename (all fetches stubbed)");
  } finally { globalThis.fetch = realFetch; }
})().catch(error => { console.error(error); process.exit(1); });
