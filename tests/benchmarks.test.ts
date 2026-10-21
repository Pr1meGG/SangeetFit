import { strict as assert } from "node:assert";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { MEN_VTO_CASE_IDS, parseBenchmarkEvidence, scoreBenchmarkEvidence, type BenchmarkEvidence } from "../src/lib/benchmarks.ts";

const template = JSON.parse(readFileSync(new URL("../docs/testing/benchmark-records.json", import.meta.url), "utf8")) as BenchmarkEvidence;
assert.deepEqual(template.plannedCases.map((item) => item.caseId), MEN_VTO_CASE_IDS);
const editorial = readFileSync(new URL("../src/data/editorial.ts", import.meta.url), "utf8");
const editorialMen = Array.from(editorial.matchAll(/id: "([^"]+)", name: "[^"]+", audience: "men"[\s\S]*?vtoSupported: (true|false)/g))
  .filter((match) => match[2] === "true").map((match) => match[1]);
const library = JSON.parse(readFileSync(new URL("../src/data/indian-wear.json", import.meta.url), "utf8")) as Array<{ id: string; audience: string; vtoSupported: boolean }>;
const libraryMen = library.filter((item) => item.audience === "men" && item.vtoSupported).map((item) => item.id);
assert.deepEqual(new Set(MEN_VTO_CASE_IDS), new Set([...editorialMen, ...libraryMen]));
assert.equal(scoreBenchmarkEvidence(template).planned.gate, true);
assert.equal(scoreBenchmarkEvidence(template).planned.participants, 1);
assert.equal(scoreBenchmarkEvidence(template).planned.catalogue, 16);
const pending: BenchmarkEvidence = { plannedCases: template.plannedCases, records: [], budget: { availableUnits: 1000, vtoUnitCost: 2, skinUnitCost: 20 } };
const passing: BenchmarkEvidence = {
  plannedCases: template.plannedCases,
  records: template.plannedCases.map((item, index) => ({
    ...item,
    mode: "live",
    status: index === 15 ? "failed" : "success",
    rendered: index !== 15,
    identityRating: index === 15 ? null : 4,
    garmentRating: index === 15 ? null : index >= 13 ? 3 : 4,
    durationMs: (index + 1) * 5_000,
    taskSubmissions: 1,
  })),
};
const copy = () => structuredClone(passing);
const empty = scoreBenchmarkEvidence(pending);
assert.equal(empty.status, "pending");
assert.equal(empty.metrics.technical.rate, null);
assert.equal(empty.metrics.identity.gate, null);
assert.equal(empty.metrics.latency.medianMs, null);
assert.equal(empty.budget.reserveUnits, 250);
assert.equal(empty.budget.plannedVtoUnits, 32);
assert.equal(empty.budget.plannedVtoFits, true);
assert.equal(empty.budget.approved, false);
assert.equal(empty.missingCaseIds.length, 16);
console.log("PASS: empty template is pending, with no fabricated measurements or approval");

const report = scoreBenchmarkEvidence(passing);
assert.equal(report.status, "pass");
assert.equal(report.metrics.technical.passed, 15);
assert.equal(report.metrics.identity.passed, 15);
assert.equal(report.metrics.garment.passed, 13);
assert.equal(report.metrics.both.passed, 13);
assert.equal(report.metrics.latency.medianMs, 40_000);
assert.deepEqual(report.metrics.latency.rangeMs, [5_000, 75_000]);
assert.equal(report.metrics.duplicates.count, 0);
assert.equal(report.metrics.taskCoverage.gate, true);
assert.equal(report.metrics.pilot.gate, true);
console.log("PASS: exact quality thresholds pass with failed attempts in the denominator");

const incomplete = copy();
incomplete.records.pop();
const partial = scoreBenchmarkEvidence(incomplete);
assert.equal(partial.status, "pending");
assert.equal(partial.metrics.technical.denominator, 16);
assert.equal(partial.metrics.technical.rate, 15 / 16);
assert.equal(partial.metrics.technical.gate, null);
const missingRatings = copy();
missingRatings.records[0].identityRating = null;
assert.equal(scoreBenchmarkEvidence(missingRatings).status, "pending");
assert.equal(scoreBenchmarkEvidence(missingRatings).metrics.identity.gate, null);
console.log("PASS: missing outcomes cannot shrink the denominator; missing ratings cannot pass");

const identityFailure = copy();
identityFailure.records[0].identityRating = 3;
assert.equal(scoreBenchmarkEvidence(identityFailure).metrics.identity.gate, false);
assert.equal(scoreBenchmarkEvidence(identityFailure).status, "fail");
const slow = copy();
slow.records.forEach((item) => { item.durationMs = 60_001; });
assert.equal(scoreBenchmarkEvidence(slow).metrics.latency.gate, false);
const retry = copy();
retry.records[0].taskSubmissions = 2;
assert.equal(scoreBenchmarkEvidence(retry).metrics.duplicates.count, 1);
assert.equal(scoreBenchmarkEvidence(retry).status, "fail");
const unsubmitted = copy();
unsubmitted.records[15].taskSubmissions = 0;
assert.equal(scoreBenchmarkEvidence(unsubmitted).metrics.taskCoverage.gate, false);
assert.equal(scoreBenchmarkEvidence(unsubmitted).status, "fail");
const failedPilot = copy();
failedPilot.records[0] = { ...failedPilot.records[0], status: "failed", rendered: false, identityRating: null, garmentRating: null };
assert.equal(scoreBenchmarkEvidence(failedPilot).metrics.pilot.gate, false);
assert.equal(scoreBenchmarkEvidence(failedPilot).status, "fail");
console.log("PASS: identity drift, slow generations and retry submissions fail their gates");

const mockEvidence = copy();
mockEvidence.records[0] = { ...mockEvidence.records[0], mode: "mock", identityRating: null, garmentRating: null };
assert.equal(scoreBenchmarkEvidence(mockEvidence).status, "fail");
assert.equal(scoreBenchmarkEvidence(mockEvidence).metrics.liveMode.gate, false);
assert.equal(scoreBenchmarkEvidence(mockEvidence).metrics.technical.passed, 14);
assert.throws(() => parseBenchmarkEvidence({ ...copy(), records: passing.records.map(({ mode, ...item }) => item) }), /explicit live\/mock/);
console.log("PASS: mock or unspecified modes cannot produce a passing live-quality report");

const secondPerson = copy();
secondPerson.plannedCases[15].participantId = "p02";
secondPerson.records[15].participantId = "p02";
assert.equal(scoreBenchmarkEvidence(secondPerson).planned.gate, false);
const secondPhoto = copy();
secondPhoto.plannedCases[15].sourceVersion = "photo-v2";
secondPhoto.records[15].sourceVersion = "photo-v2";
assert.equal(scoreBenchmarkEvidence(secondPhoto).planned.gate, false);
const mismatchedPhoto = copy();
mismatchedPhoto.records[15].sourceVersion = "photo-v2";
assert.throws(() => parseBenchmarkEvidence(mismatchedPhoto), /predeclared/);
const uploadedLook = copy();
uploadedLook.plannedCases[0].kind = "upload";
uploadedLook.records[0].kind = "upload";
assert.equal(scoreBenchmarkEvidence(uploadedLook).planned.gate, false);
const shortSweep = copy();
shortSweep.plannedCases.pop();
shortSweep.records.pop();
assert.equal(scoreBenchmarkEvidence(shortSweep).planned.gate, false);
const fabricatedLook = copy();
fabricatedLook.plannedCases[2].caseId = "fabricated-look";
fabricatedLook.records[2].caseId = "fabricated-look";
assert.equal(scoreBenchmarkEvidence(fabricatedLook).planned.gate, false);
assert.equal(scoreBenchmarkEvidence(fabricatedLook).status, "fail");
const swappedAudience = copy();
swappedAudience.plannedCases[2].caseId = "concept-midnight-lehenga";
swappedAudience.records[2].caseId = "concept-midnight-lehenga";
assert.equal(scoreBenchmarkEvidence(swappedAudience).planned.gate, false);
const mismatch = copy();
mismatch.records[0].kind = "upload";
assert.throws(() => parseBenchmarkEvidence(mismatch), /predeclared/);
const duplicate = copy();
duplicate.records.push(duplicate.records[0]);
assert.throws(() => parseBenchmarkEvidence(duplicate), /Duplicate outcome/);
const invalid = copy();
invalid.records[0].identityRating = 6;
assert.throws(() => parseBenchmarkEvidence(invalid), /1–5/);
assert.throws(() => parseBenchmarkEvidence({ ...passing, photos: [] }), /unsupported fields/);
console.log("PASS: composition and case identity enforced; duplicate, invalid and sensitive fields rejected");

const budget = { ...passing, budget: { availableUnits: 1000, vtoUnitCost: 10, skinUnitCost: 20 } };
const funded = scoreBenchmarkEvidence(budget).budget;
assert.equal(funded.reserveUnits, 250);
assert.equal(funded.developmentUnits, 750);
assert.equal(funded.fullCeilingFits, true);
assert.deepEqual(funded.affordableCaps, { vto: 40, skin: 5 });
assert.equal(funded.approved, false);
assert.equal(funded.plannedVtoUnits, 160);
assert.equal(funded.plannedVtoFits, true);
const limited = scoreBenchmarkEvidence({ ...budget, budget: { ...budget.budget, availableUnits: 100 } }).budget;
assert.equal(limited.fullCeilingFits, false);
assert.deepEqual(limited.affordableCaps, { vto: 7, skin: 0 });
assert.equal(limited.plannedVtoFits, false);
assert.equal(scoreBenchmarkEvidence({ ...budget, budget: { availableUnits: 100 } }).budget.status, "pending");
assert.throws(() => scoreBenchmarkEvidence({ ...budget, budget: { vtoUnitCost: 0 } }), /Invalid/);
console.log("PASS: verified budget inputs reserve25%, prioritize VTO and cap40/5; unknown costs remain pending");

const runner = fileURLToPath(new URL("../scripts/benchmark-report.ts", import.meta.url));
const fixtureDirectory = mkdtempSync(join(tmpdir(), "sangeetfit-benchmark-"));
try {
  const fixture = join(fixtureDirectory, "pending.json");
  writeFileSync(fixture, JSON.stringify(pending));
  const normal = spawnSync(process.execPath, [...process.execArgv, runner, fixture], { encoding: "utf8" });
  assert.equal(normal.status, 0);
  assert.equal(JSON.parse(normal.stdout).status, "pending");
  const check = spawnSync(process.execPath, [...process.execArgv, runner, fixture, "--check"], { encoding: "utf8" });
  assert.equal(check.status, 1);
  const invalidJson = spawnSync(process.execPath, [...process.execArgv, runner, "/dev/null"], { encoding: "utf8" });
  assert.equal(invalidJson.status, 1);
  assert.match(invalidJson.stderr, /Invalid benchmark evidence/);
} finally {
  rmSync(fixtureDirectory, { recursive: true });
}
console.log("PASS: CLI reports pending, fails --check without evidence, and rejects invalid evidence");
