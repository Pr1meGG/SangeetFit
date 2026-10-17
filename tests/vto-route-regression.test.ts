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
  vtoRouteSource.includes('MOCK_MODE || !YOUCAM_API_KEY'),
  "FAIL: mock-mode guard missing"
);
assert(
  vtoRouteSource.includes('const MOCK_RESULT: Record<string, string>'),
  "FAIL: mock category-to-image mapping missing"
);
assert(
  vtoRouteSource.includes('resultUrl: mockUrl'),
  "FAIL: mock resultUrl should use category-mapped mockUrl"
);
console.log("PASS: mock mode guard and category-mapped resultUrl intact");

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
