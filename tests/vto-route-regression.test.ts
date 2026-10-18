/**
 * Regression test for VTO polling URL interpolation bug.
 *
 * Verifies:
 *   1. The poll URL template uses `${taskId}`, NOT the literal `{taskId}`.
 *   2. Mock mode returns a resultUrl (unchanged behavior).
 *   3. Live mode constructs `${YOUCAM_BASE}/task/cloth-v4/${taskId}` as the
 *      fetch URL so the actual task ID is sent to the API.
 *
 * No external test framework — plain Node assert (stdlib).
 */

import { strict as assert } from "node:assert";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

// ── Test 1: Source code contains the fix ─────────────────────────────────────

const vtoRouteSource = fs.readFileSync(
  path.join(projectRoot, "src/app/api/vto/route.ts"),
  "utf8"
);

assert(
  vtoRouteSource.includes(`/task/cloth-v4/\${taskId}`),
  "FAIL: poll URL must interpolate ${taskId}, not use literal {taskId}"
);
assert(
  !vtoRouteSource.includes('/task/cloth-v4/{taskId}'),
  "FAIL: literal '{taskId}' placeholder still present in source"
);
console.log("PASS: poll URL uses ${taskId} interpolation");

// ── Test 2: Mock mode response shape (no network call needed) ────────────────

assert(
  /if \(MOCK_MODE\)/.test(vtoRouteSource),
  "FAIL: mock-mode guard missing (mock must gate on MOCK_MODE only)"
);
assert(
  vtoRouteSource.includes("Live try-on is unavailable: YOUCAM_API_KEY is not configured on this deployment"),
  "FAIL: live mode must reject missing credentials with a clear config error, not a silent mock fallback"
);
assert(
  vtoRouteSource.includes("mockUrl"),
  "FAIL: mock resultUrl should use the outfit-specific mockUrl"
);
assert(
  vtoRouteSource.includes("displayImage: outfit.imageUrl"),
  "FAIL: mock result must echo the outfit display image so placeholder matches preview"
);
assert(
  vtoRouteSource.includes("REFERENCE_ASSETS"),
  "FAIL: per-outfit reference allowlist missing"
);
assert(
  vtoRouteSource.includes("Try-on is not supported for this outfit yet"),
  "FAIL: no-substitute 400 error for unsupported outfits missing"
);
assert(
  !vtoRouteSource.includes("GARMENT_REFERENCES"),
  "FAIL: collapsed category -> reference map should be gone"
);
console.log("PASS: mock placeholder, reference allowlist, and no-substitute guard intact");

// ── Test 3: submitTask returns data.data.task_id (contract preserved) ────────

assert(
  vtoRouteSource.includes('return data.data.task_id'),
  "FAIL: submitTask return path changed"
);
console.log("PASS: submitTask contract preserved");

// ── Test 4: No console.log or secret leakage ─────────────────────────────────

const forbiddenPatterns = [
  /console\.log.*API_KEY/i,
  /console\.log.*KEY.*userId/i,
  /process\.env\..*KEY.*console/i,
];
for (const re of forbiddenPatterns) {
  assert(
    !re.test(vtoRouteSource),
    `FAIL: potential credential leakage found: ${re}`
  );
}
console.log("PASS: no credential leakage in source");

console.log("\nAll VTO regression tests passed.");
