// Original model-led assets and their exact VTO references; no provider calls.
import { strict as assert } from "node:assert";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { EDITORIAL_LOOKS } from "../src/data/editorial.ts";
import { OUTFITS, TRY_ON_REFERENCES } from "../src/data/outfits.ts";
import { isPrimaryEligible } from "../src/lib/styling.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
assert.equal(EDITORIAL_LOOKS.length, 5);
assert.equal(EDITORIAL_LOOKS.filter(look => look.audience === "women").length, 3);
assert.equal(EDITORIAL_LOOKS.filter(look => look.audience === "men").length, 2);
for (const look of EDITORIAL_LOOKS) {
  assert(look.generatedConcept && !look.source && !look.seller);
  assert.equal(look.tryOnStatus, "candidate");
  assert.equal(look.vtoSupported, true);
  assert.equal(look.imageUrl, `/garment_test/${look.tryOnReference}`);
  assert(TRY_ON_REFERENCES.includes(look.tryOnReference!));
  assert.equal(OUTFITS.filter(item => item.id === look.id).length, 1);
  assert.equal(isPrimaryEligible(look), false);
  assert.equal(isPrimaryEligible({ ...look, tryOnStatus: "live-reviewed" }), true);
  const bytes = readFileSync(path.join(root, "public", look.imageUrl));
  assert(bytes.subarray(0, 3).equals(Buffer.from([255, 216, 255])), `${look.id}: JPEG expected`);
  assert.equal(createHash("sha256").update(bytes).digest("hex"), look.generatedConcept.sha256);
}
console.log("PASS: five original AI concepts, exact display/reference images, hashes and candidate-only status");
