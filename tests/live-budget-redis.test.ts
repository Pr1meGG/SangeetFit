// Runs the production Lua on disposable Redis, never the cloud or YouCam.
import { strict as assert } from "node:assert";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { LIVE_BUDGET_KEY, INITIALIZE_BUDGET_SCRIPT, reserveLiveBudget } from "../src/lib/live-budget.ts";
import { pngDataUrl } from "./fixtures/png.ts";

const execute = promisify(execFile);
const container = process.env.TEST_REDIS_CONTAINER;
const command = container ? "docker" : "redis-cli";
const prefix = container ? ["exec", container, "redis-cli", "--json"] : ["--json"];
async function redis(...args: string[]): Promise<unknown> {
  const { stdout } = await execute(command, [...prefix, ...args], { timeout: 10_000 });
  return JSON.parse(stdout);
}

void (async () => {
  try { assert.equal(await redis("PING"), "PONG"); }
  catch (error) {
    if (process.env.REQUIRE_REDIS_TEST === "true") throw error;
    console.log("SKIP: real Redis budget tests require redis-cli or TEST_REDIS_CONTAINER; CI requires Redis.");
    return;
  }
  // The fixed production key is used only on an explicitly disposable test server.
  assert.equal(process.env.REQUIRE_REDIS_TEST, "true", "Set REQUIRE_REDIS_TEST=true only for a disposable Redis instance");
  process.env.MOCK_MODE = "false";
  process.env.YOUCAM_API_KEY = "offline-test-key";
  process.env.UPSTASH_REDIS_REST_URL = "https://offline-budget.upstash.io";
  process.env.UPSTASH_REDIS_REST_TOKEN = "offline-budget-token";
  const realFetch = globalThis.fetch;
  let providerCalls = 0;
  globalThis.fetch = (async (input, init) => {
    if (String(input) !== "https://offline-budget.upstash.io/") {
      providerCalls++;
      throw new Error("simulated provider upload failure");
    }
    try { return Response.json({ result: await redis(...JSON.parse(String(init?.body)).map(String)) }); }
    catch { return Response.json({ error: "Redis rejected the command" }); }
  }) as typeof fetch;
  const signal = new AbortController().signal;
  const seed = async (limit = "1000", vto = "200", skin = "300") => {
    await redis("DEL", LIVE_BUDGET_KEY);
    assert.equal(await redis("EVAL", INITIALIZE_BUDGET_SCRIPT, "1", LIVE_BUDGET_KEY, limit, vto, skin), 1);
  };
  try {
    await seed();
    assert.equal(await redis("EVAL", INITIALIZE_BUDGET_SCRIPT, "1", LIVE_BUDGET_KEY, "999999", "1", "1"), 0);
    assert.equal(await redis("HGET", LIVE_BUDGET_KEY, "limit"), "1000", "initialization cannot overwrite an allowance");
    const secondWorker = await import(new URL("../src/lib/live-budget.ts?worker=2", import.meta.url).href);
    const results = await Promise.allSettled(Array.from({ length: 20 }, (_, index) => (index % 2 ? secondWorker.reserveLiveBudget : reserveLiveBudget)("vto", signal)));
    assert.equal(results.filter(result => result.status === "fulfilled").length, 5);
    assert.equal(await redis("HGET", LIVE_BUDGET_KEY, "used"), "1000");
    await assert.rejects(reserveLiveBudget("skin", signal), /exhausted/);
    console.log("PASS: 20 concurrent reservations across workers admit exactly five within a ten-unit allowance");

    await seed();
    await Promise.all([reserveLiveBudget("skin", signal), secondWorker.reserveLiveBudget("vto", signal), reserveLiveBudget("skin", signal), secondWorker.reserveLiveBudget("vto", signal)]);
    assert.equal(await redis("HGET", LIVE_BUDGET_KEY, "used"), "1000", "both APIs share the same counter at their own costs");
    await assert.rejects(secondWorker.reserveLiveBudget("vto", signal), /exhausted/);
    assert.equal(await redis("TTL", LIVE_BUDGET_KEY), -1);
    console.log("PASS: mixed task prices and reloaded workers retain the same persistent allowance");

    for (const [field, value] of [["limit", "-1"], ["used", "0.5"], ["used", "1000000001"], ["vto", "0"], ["skin", "NaN"]]) {
      await seed();
      await redis("HSET", LIVE_BUDGET_KEY, field, value);
      await assert.rejects(reserveLiveBudget("vto", signal), /unavailable/);
    }
    await seed(); await redis("EXPIRE", LIVE_BUDGET_KEY, "60");
    await assert.rejects(reserveLiveBudget("vto", signal), /unavailable/);
    await redis("DEL", LIVE_BUDGET_KEY);
    await assert.rejects(reserveLiveBudget("vto", signal), /unavailable/);
    assert.equal(await redis("EXISTS", LIVE_BUDGET_KEY), 0, "missing state never auto-initializes");
    await redis("SET", LIVE_BUDGET_KEY, "wrong-type");
    await assert.rejects(reserveLiveBudget("skin", signal));
    console.log("PASS: deleted, corrupt, wrong-type and expiring state blocks reservations without a reset");

    await seed();
    const { POST } = await import("../src/app/api/skin/route.ts");
    const response = await POST(new Request("http://localhost/api/skin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ imageDataUrl: pngDataUrl() }) }) as never);
    assert.equal(response.status, 502);
    assert.equal(providerCalls, 1);
    assert.equal(await redis("HGET", LIVE_BUDGET_KEY, "used"), "300", "a failed upload keeps its reservation");
    console.log("PASS: provider failure does not refund an ambiguous reservation or retry work");
  } finally {
    globalThis.fetch = realFetch;
    await redis("DEL", LIVE_BUDGET_KEY);
  }
})().catch(error => { console.error(error); process.exit(1); });
