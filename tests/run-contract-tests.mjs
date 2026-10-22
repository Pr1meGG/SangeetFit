import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";

const suites = readdirSync("tests").filter(file => file.endsWith(".test.ts")).sort();
for (const suite of suites) {
  const result = spawnSync(process.execPath, ["--import", "tsx", `tests/${suite}`], {
    stdio: "inherit", env: { ...process.env, MOCK_MODE: "true", YOUCAM_API_KEY: "", LIVE_ACCESS_CODE: "" },
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
console.log(`PASS: ${suites.length} offline suites`);
