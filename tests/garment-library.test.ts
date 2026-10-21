// Offline provenance, catalog and route checks. No real YouCam requests.
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { INDIAN_WEAR_LIBRARY } from "../src/data/indian-wear.ts";
import { OUTFITS, TRY_ON_REFERENCES } from "../src/data/outfits.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const occasions = ["sangeet", "mehendi", "haldi", "wedding", "reception"];
const licenses = ["CC0", "Public domain", "CC BY-SA 3.0", "CC BY-SA 4.0"];
assert(INDIAN_WEAR_LIBRARY.length >= 14);
const hashes = new Set<string>();
for (const outfit of INDIAN_WEAR_LIBRARY) {
  assert(outfit.id.startsWith("library-"));
  assert(["men", "women"].includes(outfit.audience));
  assert(occasions.includes(outfit.occasion));
  assert.equal(outfit.collection, "indian");
  assert.equal(outfit.youcamCategory, "auto");
  assert(outfit.name && outfit.description && outfit.garmentType && outfit.referenceNotes);
  assert(/^#[0-9a-f]{6}$/i.test(outfit.primaryColor) && /^#[0-9a-f]{6}$/i.test(outfit.secondaryColor));
  assert(/^\/garment_test\/library\/[a-z-]+\.(jpg|png)$/.test(outfit.imageUrl));
  const bytes = readFileSync(path.join(root, "public", outfit.imageUrl));
  assert(bytes.subarray(0, 3).equals(Buffer.from([255, 216, 255])) || bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])));
  const source = outfit.source;
  assert(source.title && source.author && source.changes && source.retrievedAt);
  assert.equal(new URL(source.url).hostname, "commons.wikimedia.org");
  assert(["upload.wikimedia.org", "thumb.wikimedia.org"].includes(new URL(source.originalUrl).hostname));
  assert(["upload.wikimedia.org", "thumb.wikimedia.org"].includes(new URL(source.downloadedUrl).hostname));
  assert(["creativecommons.org", "commons.wikimedia.org"].includes(new URL(source.licenseUrl).hostname));
  assert(licenses.includes(source.license));
  assert(source.width >= 320 && source.height >= 320);
  assert.equal(createHash("sha256").update(bytes).digest("hex"), source.sha256, `${outfit.id}: file no longer matches provenance`);
  assert(!hashes.has(source.sha256), "duplicate library photo");
  hashes.add(source.sha256);
  assert.equal(OUTFITS.filter(item => item.id === outfit.id).length, 1);
  assert.equal(outfit.vtoSupported, outfit.referenceStatus === "candidate");
  if (outfit.vtoSupported) {
    assert.equal(outfit.imageUrl, `/garment_test/${outfit.tryOnReference}`);
    assert(TRY_ON_REFERENCES.includes(outfit.tryOnReference!));
  } else {
    assert.equal(outfit.tryOnReference, null);
    assert(!TRY_ON_REFERENCES.includes(`library/${path.basename(outfit.imageUrl)}`));
  }
}
for (const audience of ["men", "women"]) {
  for (const occasion of occasions) assert(INDIAN_WEAR_LIBRARY.some(outfit => outfit.audience === audience && outfit.occasion === occasion), `missing ${audience}/${occasion}`);
  assert(INDIAN_WEAR_LIBRARY.some(outfit => outfit.audience === audience && outfit.occasion === "sangeet" && outfit.vtoSupported));
}
console.log("PASS: 14 unique photos, file hashes, provenance, local assets, audience/occasion coverage and exact reference mapping");

void (async () => {
  process.env.MOCK_MODE = "true";
  const realFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = (async () => { calls++; throw Error("No network allowed"); }) as typeof fetch;
  try {
    const { POST } = await import("../src/app/api/vto/route.ts");
    const submit = async (outfit: (typeof INDIAN_WEAR_LIBRARY)[number], override = {}) => {
      return POST(new Request("http://localhost/api/vto", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        garmentId: outfit.id, referenceAsset: outfit.tryOnReference, vtoSupported: true,
        displayImage: "/outfits/unrelated-image.svg", ...override,
      }) }) as never);
    };
    for (const outfit of INDIAN_WEAR_LIBRARY.filter(item => item.vtoSupported)) {
      const res = await submit(outfit);
      assert.equal(res.status, 200);
      assert.deepEqual(await res.json(), { success: true, resultUrl: outfit.imageUrl, displayImage: outfit.imageUrl, mode: "mock" });
    }
    const lehengas = INDIAN_WEAR_LIBRARY.filter(item => item.garmentType === "lehenga-choli" && item.vtoSupported);
    assert.equal((await submit(lehengas[0], { referenceAsset: lehengas[1].tryOnReference })).status, 400, "reject another garment even within the same type");
    assert.equal((await submit(lehengas[0], { referenceAsset: "../../.env.local" })).status, 400);
    assert.equal((await submit(lehengas[0], { vtoSupported: false })).status, 400);
    const browseOnly = INDIAN_WEAR_LIBRARY.find(item => !item.vtoSupported)!;
    assert.equal((await submit(browseOnly, { referenceAsset: lehengas[0].tryOnReference })).status, 400);
    assert.equal(calls, 0);
    console.log("PASS: all 8 new mock try-on candidates work; client image substitution, reference swaps, traversal and browse-only submissions cannot bypass the catalog");
  } finally { globalThis.fetch = realFetch; }
})().catch(error => { console.error(error); process.exit(1); });
