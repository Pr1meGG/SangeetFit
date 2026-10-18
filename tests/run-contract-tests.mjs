import { spawnSync } from "node:child_process";

const result = spawnSync("node", ["--experimental-strip-types", "tests/youcam-api-contract.test.ts"], {
  stdio: "inherit",
  cwd: process.cwd(),
});

if (result.status !== 0) process.exit(result.status ?? 1);
