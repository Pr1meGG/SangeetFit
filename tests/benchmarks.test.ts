import { strict as assert } from "node:assert";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseBenchmarkEvidence, scoreBenchmarkEvidence, type BenchmarkEvidence } from "../src/lib/benchmarks.ts";

const template = JSON.parse(readFileSync(new URL("../docs/testing/benchmark-records.json", import.meta.url), "utf8")) as BenchmarkEvidence;
assert.equal(scoreBenchmarkEvidence(template).planned.gate, true);
const pending: BenchmarkEvidence = { plannedCases: template.plannedCases, records: [], budget: { availableUnits: 1000, vtoUnitCost: 2, skinUnitCost: 20 } };
const passing: BenchmarkEvidence = {
  plannedCases: template.plannedCases,
  records: template.plannedCases.map((item, index) => ({
    ...item,
    mode: "live",
    status: index === 11 ? "failed" : "success",
    rendered: index !== 11,
    identityRating: index === 11 ? null : 4,
    garmentRating: index === 11 ? null : index === 10 ? 3 : 4,
    durationMs: (index + 1) * 10_000,
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
assert.equal(empty.budget.plannedVtoUnits, 24);
assert.equal(empty.budget.plannedVtoFits, true);
assert.equal(empty.budget.approved, false);
assert.equal(empty.missingCaseIds.length, 12);
console.log("PASS: empty template is pending, with no fabricated measurements or approval");

const report = scoreBenchmarkEvidence(passing);
assert.equal(report.status, "pass");
assert.equal(report.metrics.technical.passed, 11);
assert.equal(report.metrics.identity.passed, 11);
assert.equal(report.metrics.garment.passed, 10);
assert.equal(report.metrics.both.passed, 10);
assert.equal(report.metrics.latency.medianMs, 60_000);
assert.deepEqual(report.metrics.latency.rangeMs, [10_000, 110_000]);
assert.equal(report.metrics.duplicates.count, 0);
console.log("PASS: exact quality thresholds pass with failed attempts in the denominator");

const incomplete = copy();
incomplete.records.pop();
const partial = scoreBenchmarkEvidence(incomplete);
assert.equal(partial.status, "pending");
assert.equal(partial.metrics.technical.denominator, 12);
assert.equal(partial.metrics.technical.rate, 11 / 12);
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
console.log("PASS: identity drift, slow generations and retry submissions fail their gates");

const mockEvidence = copy();
mockEvidence.records[0] = { ...mockEvidence.records[0], mode: "mock", identityRating: null, garmentRating: null };
assert.equal(scoreBenchmarkEvidence(mockEvidence).status, "fail");
assert.equal(scoreBenchmarkEvidence(mockEvidence).metrics.liveMode.gate, false);
assert.equal(scoreBenchmarkEvidence(mockEvidence).metrics.technical.passed, 10);
assert.throws(() => parseBenchmarkEvidence({ ...copy(), records: passing.records.map(({ mode, ...item }) => item) }), /explicit live\/mock/);
console.log("PASS: mock or unspecified modes cannot produce a passing live-quality report");

const onePerson = copy();
onePerson.plannedCases.forEach((item) => { item.participantId = "p01"; });
onePerson.records.forEach((item) => { item.participantId = "p01"; });
assert.equal(scoreBenchmarkEvidence(onePerson).planned.gate, false);
const fewUploads = copy();
fewUploads.plannedCases[0].kind = "catalogue";
fewUploads.records[0].kind = "catalogue";
assert.equal(scoreBenchmarkEvidence(fewUploads).planned.gate, false);
const fewReferences = copy();
fewReferences.plannedCases[2].kind = "upload";
fewReferences.records[2].kind = "upload";
assert.equal(scoreBenchmarkEvidence(fewReferences).planned.gate, false);
const oneLookParticipant = copy();
oneLookParticipant.plannedCases[10].participantId = "p04";
oneLookParticipant.records[10].participantId = "p04";
assert.equal(scoreBenchmarkEvidence(oneLookParticipant).planned.gate, false);
const mismatch = copy();
mismatch.records[0].kind = "catalogue";
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
assert.equal(funded.plannedVtoUnits, 120);
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
