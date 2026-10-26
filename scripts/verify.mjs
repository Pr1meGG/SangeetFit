import { spawnSync } from "node:child_process";

for (const script of ["test", "typecheck", "lint", "build", "test:browser"]) {
  const result = spawnSync(process.platform === "win32" ? "npm.cmd" : "npm", ["run", script], {
    stdio: "inherit", env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1", MOCK_MODE: "true", YOUCAM_API_KEY: "" },
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
