import { strict as assert } from "node:assert";
import * as session from "../src/lib/session";
import { OUTFITS, type Occasion } from "../src/data/outfits";

// Catches stale/reference assignments inflating owned counts or leaking media into export data.
assert.equal(typeof session.summarizeWardrobePlan, "function", "wardrobe plans need a text-only summary");
const occasions = [
  { id: "sangeet", label: "Sangeet" }, { id: "mehendi", label: "Mehendi" },
  { id: "haldi", label: "Haldi" }, { id: "wedding", label: "Wedding" },
  { id: "reception", label: "Reception" },
] satisfies { id: Occasion; label: string }[];
const owned = { ...OUTFITS[0], id: "owned-one", origin: "upload" as const, name: "My kurta", imageUrl: "https://private.invalid/garment" };
const second = { ...owned, id: "owned-two", name: "My full outfit" };
const reference = { ...OUTFITS.find(item => item.generatedConcept)!, id: "reference-one", tryOnStatus: "candidate" as const };
const outfits = [owned, second, reference];

const summary = session.summarizeWardrobePlan(occasions, outfits, {
  sangeet: owned.id, mehendi: owned.id, haldi: second.id,
  wedding: reference.id, reception: "removed-garment",
});
assert.equal(summary.plannedCount, 4);
assert.equal(summary.ownedOutfitCount, 2);
assert.equal(summary.plannedRewears, 1);
assert.equal(summary.entries[3].sourceLabel, "AI inspiration · try-on unreviewed");
assert.equal(summary.entries[4].garmentName, "Not planned");
assert.equal(summary.entries[4].outfitId, null);
assert(!JSON.stringify(summary).includes("private.invalid"), "print data must exclude image URLs");

const repeatedReference = session.summarizeWardrobePlan(occasions, outfits, { sangeet: reference.id, wedding: reference.id });
assert.equal(repeatedReference.plannedCount, 2);
assert.equal(repeatedReference.ownedOutfitCount, 0);
assert.equal(repeatedReference.plannedRewears, 0);
const empty = session.summarizeWardrobePlan(occasions, [], { sangeet: owned.id });
assert.equal(empty.plannedCount, 0);
assert.equal(empty.plannedRewears, 0);
assert.equal(empty.entries.length, 5);
assert(empty.entries.every(entry => entry.garmentName === "Not planned"));
console.log("PASS: valid text-only event plan, owned reuse counts, reference exclusion and stale-ID handling");
