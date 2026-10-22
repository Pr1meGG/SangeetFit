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
const pilotIds = new Set(["concept-emerald-kurta", "concept-sapphire-sherwani"]);
const evidence = JSON.parse(readFileSync(path.join(root, "docs/testing/benchmark-records.json"), "utf8"));
assert.equal(EDITORIAL_LOOKS.length, 26);
assert.equal(new Set(EDITORIAL_LOOKS.map(look => look.id)).size, EDITORIAL_LOOKS.length);
assert.equal(new Set(EDITORIAL_LOOKS.map(look => look.tryOnReference)).size, EDITORIAL_LOOKS.length);
for (const occasion of ["sangeet", "mehendi", "haldi", "wedding", "reception"] as const) {
  for (const audience of ["women", "men"] as const) {
    assert.equal(EDITORIAL_LOOKS.filter(look => look.audience === audience && look.occasionTags.includes(occasion)).length, 5, `${occasion} ${audience}: exactly five model-led looks`);
  }
}
for (const look of EDITORIAL_LOOKS) {
  assert(look.generatedConcept && !look.source && !look.seller);
  const reviewed = pilotIds.has(look.id);
  assert.equal(look.tryOnStatus, reviewed ? "live-reviewed" : "candidate");
  if (reviewed) assert(evidence.records.some((record: { caseId: string; mode: string; rendered: boolean; identityRating: number; garmentRating: number }) => record.caseId === look.id && record.mode === "live" && record.rendered && record.identityRating >= 4 && record.garmentRating >= 4), "promotion requires recorded live pilot evidence");
  assert.equal(look.vtoSupported, true);
  assert.equal(look.imageUrl, `/garment_test/${look.tryOnReference}`);
  assert(TRY_ON_REFERENCES.includes(look.tryOnReference!));
  assert.equal(OUTFITS.filter(item => item.id === look.id).length, 1);
  assert.equal(isPrimaryEligible(look), reviewed);
  assert.equal(isPrimaryEligible({ ...look, tryOnStatus: "live-reviewed" }), true);
  const bytes = readFileSync(path.join(root, "public", look.imageUrl));
  assert(bytes.subarray(0, 3).equals(Buffer.from([255, 216, 255])), `${look.id}: JPEG expected`);
  assert.equal(createHash("sha256").update(bytes).digest("hex"), look.generatedConcept.sha256);
}
assert.equal(EDITORIAL_LOOKS.filter(isPrimaryEligible).length, 2);
console.log("PASS: 26 original concepts retain exact hashes and coverage; only the two scored live pilot references are primary-eligible");
