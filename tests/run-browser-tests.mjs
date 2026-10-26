import { spawn, spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { setTimeout as wait } from "node:timers/promises";

const port = process.env.TEST_PORT || "3503";
const base = `http://127.0.0.1:${port}`;
const env = { ...process.env, MOCK_MODE: "true", YOUCAM_API_KEY: "", TEST_ORIGIN: base, TEST_BASE_URL: base };
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-H", "127.0.0.1", "-p", port], { env, stdio: ["ignore", "pipe", "pipe"] });
let output = "";
server.stdout.on("data", data => { output += data; });
server.stderr.on("data", data => { output += data; });
let exitCode = 0;
try {
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    if (server.exitCode !== null) throw new Error(`Mock server exited: ${output}`);
    if (!output.includes("Ready")) { await wait(300); continue; }
    try {
      const mode = await fetch(`${base}/api/mode`, { signal: AbortSignal.timeout(1000) }).then(response => response.json());
      if (mode.mode !== "mock") throw new Error("Refusing browser tests against a non-mock server");
      ready = true; break;
    } catch (error) {
      if (error instanceof Error && error.message.includes("non-mock")) throw error;
      await wait(300);
    }
  }
  if (!ready) throw new Error(`Mock server did not start: ${output}`);
  const suites = readdirSync("tests").filter(file => file.endsWith(".browser.test.mjs") || file === "face-camera.test.mjs").sort();
  for (const suite of suites) {
    const result = spawnSync(process.execPath, [`tests/${suite}`], { env, stdio: "inherit" });
    if (result.status !== 0) { exitCode = result.status ?? 1; break; }
  }
  if (!exitCode) console.log(`PASS: ${suites.length} mock-only browser suites`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error); exitCode = 1;
} finally {
  server.kill("SIGTERM");
}
process.exitCode = exitCode;
