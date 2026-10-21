// Offline report: never reads provider credentials or submits tasks.
import { readFileSync } from "node:fs";
import { scoreBenchmarkEvidence } from "../src/lib/benchmarks.ts";

try {
  const args = process.argv.slice(2);
  if (args.some((arg) => arg.startsWith("--") && arg !== "--check") || args.filter((arg) => arg !== "--check").length > 1) {
    throw new Error("Usage: benchmark-report.ts [evidence.json] [--check]");
  }
  const file = args.find((arg) => arg !== "--check");
  const evidence = JSON.parse(readFileSync(file ?? new URL("../docs/testing/benchmark-records.json", import.meta.url), "utf8"));
  const report = scoreBenchmarkEvidence(evidence);
  console.log(JSON.stringify(report, null, 2));
  if (args.includes("--check") && report.status !== "pass") process.exitCode = 1;
} catch (error) {
  console.error(`Invalid benchmark evidence: ${error instanceof Error ? error.message : "unknown error"}`);
  process.exitCode = 1;
}
