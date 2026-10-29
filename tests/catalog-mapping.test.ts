/**
 * Offline catalog-mapping test — verifies the honest per-item try-on contract.
 * No network: reads src/data, src/app sources and public/ asset files.
 */

import { strict as assert } from "node:assert";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { OUTFITS, TRY_ON_REFERENCES } from "../src/data/outfits.ts";
import { EDITORIAL_LOOKS } from "../src/data/editorial.ts";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const garmentTestDir = path.join(projectRoot, "public", "garment_test");

// ── Ids unique; displayImage exists on disk ───────────────────────────────────
const ids = new Set<string>();
for (const o of OUTFITS) {
  assert(!ids.has(o.id), `duplicate outfit id ${o.id}`);
  ids.add(o.id);
  assert(o.imageUrl.startsWith("/outfits/") || o.imageUrl.startsWith("/garment_test/library/") || o.imageUrl.startsWith("/garment_test/editorial/"), `unexpected asset path: ${o.imageUrl}`);
  assert(fs.existsSync(path.join(projectRoot, "public", o.imageUrl)), `displayImage missing on disk: ${o.imageUrl}`);
}
console.log(`PASS: ${OUTFITS.length} outfits, unique ids, all displayImages exist`);

// ── Type invariant: supported ⟺ real per-item reference (no category collapse) ─
const ALLOWLIST = new Set<string>(TRY_ON_REFERENCES);
for (const ref of Array.from(ALLOWLIST)) {
  assert(fs.existsSync(path.join(garmentTestDir, ref)), `allowlisted reference missing on disk: ${ref}`);
}
assert(!ALLOWLIST.has("fullbody_mock.png"), "fullbody_mock.png is a person, not a garment reference");

for (const o of OUTFITS) {
  if (o.vtoSupported) {
    assert(o.tryOnReference !== null, `${o.id}: vtoSupported=true but tryOnReference null`);
    assert(ALLOWLIST.has(o.tryOnReference), `${o.id}: reference ${o.tryOnReference} not in allowlist`);
  } else {
    assert(o.tryOnReference === null, `${o.id}: vtoSupported=false must have tryOnReference=null`);
  }
}
console.log("PASS: vtoSupported ⟺ per-item reference within allowlist");

// ── Visual-correspondence whitelist — hand-verified, explicit, per outfit ─────
const VISUAL_WHITELIST: Record<string, string> = {
  ...Object.fromEntries(EDITORIAL_LOOKS.map(o => [o.id, o.tryOnReference!])),
};
for (const o of OUTFITS) {
  if (o.vtoSupported) {
    assert.equal(o.tryOnReference, VISUAL_WHITELIST[o.id], `${o.id}: reference not on the visual whitelist`);
  } else {
    assert(!(o.id in VISUAL_WHITELIST), `${o.id}: whitelisted outfit must be vtoSupported`);
  }
}
assert.equal(OUTFITS.length, EDITORIAL_LOOKS.length, "catalogue contains only AI editorial concepts");
console.log("PASS: visual whitelist exact; catalogue is AI-concepts-only");

// ── page.tsx sends per-outfit fields (id + display image + reference), not category ─
const pageSource = fs.readFileSync(path.join(projectRoot, "src/app/page.tsx"), "utf8");
assert(pageSource.includes("garmentId: outfit.id"));
assert(pageSource.includes("displayImage: outfit.imageUrl"));
assert(pageSource.includes("referenceAsset: outfit.tryOnReference"));
assert(pageSource.includes("vtoSupported: outfit.vtoSupported"));
assert(!/body: JSON\.stringify\(\{[^}]*category[^}]*\}\)/.test(pageSource), "frontend must not send raw category");
console.log("PASS: page sends per-outfit identity fields to /api/vto");

// ── Route: per-identity validation + no-substitute 400 + honest unsupported path ─
const vtoSource = fs.readFileSync(path.join(projectRoot, "src/app/api/vto/route.ts"), "utf8");
assert(vtoSource.includes("REFERENCE_ASSETS"), "per-asset allowlist missing");
assert(vtoSource.includes('garmentTypes.includes(outfit.garmentType)'), "reference must be scoped to garmentType");
assert(vtoSource.includes("Try-on is not supported for this outfit yet"), "no-substitute 400 missing");
assert(vtoSource.includes("!input.vtoSupported || !outfit.vtoSupported || outfit.tryOnReference !== input.referenceAsset"), "server must re-derive support from the catalog, not trust the client");
assert(vtoSource.includes("Unknown garment reference"), "invalid reference rejected");
assert(vtoSource.includes('mode: "live"'), "live mode label missing");
console.log("PASS: route validates per identity and never substitutes");

// ── Mock contract: displayImage echo + mode "mock" preserved ──────────────────
const mockBlock = vtoSource.split("if (MOCK_MODE)")[1]?.split("// Live mode")[0] ?? "";
assert(mockBlock.includes("displayImage: outfit.imageUrl"), "mock result must echo outfit displayImage");
assert(mockBlock.includes('mode: "mock"'), "mock label missing");
assert(mockBlock.includes('resultUrl: mockUrl'), "mock result path changed");
console.log("PASS: mock mode contract preserved (displayImage + mode:mock)");

// ── Navbar badging driven by /api/mode ─────────────────────────────────────────
const navbarSource = fs.readFileSync(path.join(projectRoot, "src/app/api/mode/route.ts"), "utf8");
assert(/MOCK_MODE === "true"/.test(navbarSource), "mode route mirrors MOCK_MODE env logic");
assert(navbarSource.includes("YOUCAM_API_KEY"), "mode route mirrors credential logic");
for (const label of ["Live AI", "Mock Mode", "API Not Configured"]) {
  const nav = fs.readFileSync(path.join(projectRoot, "src/components/Navbar.tsx"), "utf8");
  assert(nav.includes(label), `navbar missing truthful label: ${label}`);
}
console.log("PASS: mode badges derived from /api/mode");

console.log("\nAll catalog-mapping tests passed.");
