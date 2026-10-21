// Offline policy and ranking regression checks; synthetic review flags are test fixtures only.
import { strict as assert } from "node:assert";
import { OUTFITS } from "../src/data/outfits.ts";
import type { Outfit, VerifiedSeller } from "../src/data/outfits.ts";
import { getVerifiedSellerUrl, isPrimaryEligible, recommendOutfits } from "../src/lib/styling.ts";

const candidate = OUTFITS.find(outfit => outfit.id === "library-navy-gold-lehenga")!;
assert(candidate);
for (const outfit of OUTFITS) {
  assert(outfit.occasionTags.includes(outfit.occasion));
  assert(["minimal", "festive", "statement"].includes(outfit.styleLevel));
  assert.equal(outfit.tryOnStatus, outfit.vtoSupported && outfit.tryOnReference ? "candidate" : "blocked");
  assert.equal(isPrimaryEligible(outfit), false, "no current asset has reviewed live-output evidence");
  assert.equal(getVerifiedSellerUrl(outfit), null, "image-source links must not become product listings");
}
assert(candidate.occasionTags.includes("reception"), "editorial tags can cover a second relevant occasion");
assert.equal(recommendOutfits(OUTFITS, { occasion: "reception" }).length, 0);
assert(recommendOutfits(OUTFITS, { occasion: "reception", includeCandidates: true }).some(item => item.outfit.id === candidate.id));
assert(!recommendOutfits(OUTFITS, { occasion: "reception", includeCandidates: true }).some(item => item.outfit.tryOnStatus === "blocked"));

const reviewed: Outfit = { ...candidate, tryOnStatus: "live-reviewed" };
assert(isPrimaryEligible(reviewed));
assert(!isPrimaryEligible({ ...reviewed, source: undefined }));
assert(!isPrimaryEligible({ ...reviewed, tryOnReference: "another-outfit.jpg" }));
assert(!isPrimaryEligible({ ...reviewed, vtoSupported: false }));
assert(!isPrimaryEligible({ ...reviewed, source: { ...reviewed.source!, license: "Unknown" } }));
assert(!isPrimaryEligible({ ...reviewed, source: { ...reviewed.source!, sha256: "missing" } }));
assert(!isPrimaryEligible({ ...reviewed, source: { ...reviewed.source!, retrievedAt: "2026-02-30" } }));
assert(!isPrimaryEligible({ ...reviewed, source: { ...reviewed.source!, url: "javascript:alert(1)" } }));
console.log("PASS: truthful catalogue states, provenance/reference gates and explicit candidate opt-in");

const fixtures: Outfit[] = [
  { ...reviewed, id: "colour-only", styleLevel: "minimal", primaryColor: "#ffffff" },
  { ...reviewed, id: "style-first", styleLevel: "festive", primaryColor: "#000000" },
  { ...reviewed, id: "both-first", styleLevel: "festive", primaryColor: "#ffffff" },
  { ...reviewed, id: "both-second", styleLevel: "festive", primaryColor: "#ffffff" },
  { ...reviewed, id: "other-audience", audience: "men" },
  { ...reviewed, id: "other-occasion", occasionTags: ["haldi"] },
];
const originalOrder = fixtures.map(outfit => outfit.id);
const ranked = recommendOutfits(fixtures, { occasion: "reception", audience: "women", styleLevel: "festive", preferredColor: "#FFFFFF" });
assert.deepEqual(ranked.map(item => item.outfit.id), ["both-first", "both-second", "style-first", "colour-only"]);
assert.deepEqual(fixtures.map(outfit => outfit.id), originalOrder, "ranking must not mutate input order");
assert(ranked[0].reason.includes("Tagged for Reception"));
assert(ranked[0].reason.includes("festive style preference"));
assert(ranked[0].reason.includes("selected colour"));
assert(!ranked[2].reason.includes("selected colour"), "reasons must describe actual matched metadata");
assert(!ranked[3].reason.includes("style preference"));
assert(!ranked.some(item => /skin|perfect|fit accuracy|\d+%|analysed/i.test(item.reason)));
assert.equal(recommendOutfits(fixtures, { occasion: "haldi", audience: "women" }).length, 1);
assert.equal(recommendOutfits([{ ...reviewed, audience: "unisex" }], { occasion: "sangeet", audience: "men" }).length, 1);
const owned = { ...reviewed, id: "owned", origin: "upload" as const, tryOnStatus: "candidate" as const, source: undefined, tryOnReference: null, uploadedGarment: "fixture-only" };
const ownResults = recommendOutfits([owned], { occasion: "sangeet", audience: "women" });
assert.equal(ownResults.length, 1, "user-confirmed uploads participate without catalogue review");
assert.equal(ownResults[0].outfit.uploadedGarment, "fixture-only", "generic result retains upload fields");
assert(ownResults[0].reason.includes("by you"));
assert(!isPrimaryEligible({ ...owned, tryOnStatus: "live-reviewed" }), "uploads are not reviewed catalogue references");
assert.equal(recommendOutfits([{ ...owned, vtoSupported: false }], { occasion: "sangeet" }).length, 0);
console.log("PASS: multi-occasion ranking, declared style/colour precedence, audience, stable ties and own uploads");

const seller: VerifiedSeller = {
  name: "Test seller", url: "https://example.com/product/exact-fixture",
  exactItemVerified: true, verifiedAt: "2026-10-20", imagePermissionVerifiedAt: "2026-10-20",
};
assert.equal(getVerifiedSellerUrl({ seller }), seller.url);
assert.equal(getVerifiedSellerUrl({ seller: { ...seller, url: "http://example.com/product" } }), null);
assert.equal(getVerifiedSellerUrl({ seller: { ...seller, url: "javascript:alert(1)" } }), null);
assert.equal(getVerifiedSellerUrl({ seller: { ...seller, url: "https://name:password@example.com/product" } }), null);
assert.equal(getVerifiedSellerUrl({ seller: { ...seller, exactItemVerified: false } as unknown as VerifiedSeller }), null);
assert.equal(getVerifiedSellerUrl({ seller: { ...seller, verifiedAt: "" } }), null);
assert.equal(getVerifiedSellerUrl({ seller: { ...seller, imagePermissionVerifiedAt: "2026-02-30" } }), null);
console.log("PASS: exact-item seller checks, HTTPS, credentials rejection and separate permission dates");
