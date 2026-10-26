// Missing budget must block both live photo routes before any provider upload.
import { strict as assert } from "node:assert";
import { pngDataUrl } from "./fixtures/png.ts";
import { spawnSync } from "node:child_process";

void (async () => {
  process.env.MOCK_MODE = "false";
  process.env.YOUCAM_API_KEY = "offline-test-key";
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  delete process.env.KV_REST_API_URL;
  delete process.env.KV_REST_API_TOKEN;
  delete process.env.KV_REST_API_READ_ONLY_TOKEN;
  let calls = 0;
  const realFetch = globalThis.fetch;
  globalThis.fetch = (async () => { calls++; throw new Error("provider must not be reached"); }) as typeof fetch;
  try {
    const { POST: skin } = await import("../src/app/api/skin/route.ts");
    const { POST: vto } = await import("../src/app/api/vto/route.ts");
    const { GET: mode } = await import("../src/app/api/mode/route.ts");
    const png = pngDataUrl();
    for (const [endpoint, body] of [[skin, { imageDataUrl: png }], [vto, { fullBodyDataUrl: png, garmentImageDataUrl: png, garmentCategory: "upper_body" }]] as const) {
      const response: Response = await endpoint(new Request("http://localhost/api/photo", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }) as never);
      assert.equal(response.status, 503, "missing shared budget must fail closed");
      assert.match((await response.json()).error, /budget/i);
    }
    assert.equal(calls, 0);
    assert.deepEqual(await mode().then(r => r.json()), { mode: "unconfigured" });
    console.log("PASS: missing shared budget blocks both live routes before provider work");

    const { liveBudgetConfigured, reserveLiveBudget } = await import("../src/lib/live-budget.ts");
    let expectedUrl = "https://offline-kv.upstash.io/";
    let expectedToken = "offline-kv-token";
    let reply: unknown = { result: 1 };
    globalThis.fetch = (async (url, init) => {
      calls++;
      assert.equal(String(url), expectedUrl, "budget must use the selected URL family");
      assert.equal(new Headers(init?.headers).get("authorization"), `Bearer ${expectedToken}`, "budget must use the selected write token");
      assert.equal(init?.cache, "no-store"); assert.equal(init?.redirect, "error");
      assert(init?.signal);
      const command = JSON.parse(String(init.body));
      assert.equal(command[0], "EVAL"); assert.equal(command[2], 1);
      assert.equal(command[3], "sangeetfit:live-budget:v1");
      assert(["vto", "skin"].includes(command[4]));
      if (reply === "throw") throw new Error("private-token-or-url");
      if (reply === "http-error") return new Response("private-token-or-url", { status: 429 });
      return Response.json(reply);
    }) as typeof fetch;
    process.env.KV_REST_API_URL = "https://offline-kv.upstash.io";
    process.env.KV_REST_API_TOKEN = "offline-kv-token";
    process.env.KV_REST_API_READ_ONLY_TOKEN = "offline-read-only-token";
    assert.equal(liveBudgetConfigured(), true, "a complete Vercel KV pair must configure the shared budget");
    assert.deepEqual(await mode().then(r => r.json()), { mode: "live" });
    await reserveLiveBudget("skin", new AbortController().signal);
    assert.equal(calls, 1, "KV-only configuration must use the existing reservation transport");

    const invalidUrls = ["http://test.upstash.io", "https://evil.test", "https://test.upstash.io.evil.test", "https://user:pass@test.upstash.io", "https://test.upstash.io/path", "https://test.upstash.io/?secret=1", "https://test.upstash.io:444"];
    calls = 0;
    for (const [url, token] of [["", "offline-kv-token"], ["https://offline-kv.upstash.io", ""], ["https://offline-kv.upstash.io", "invalid\r\ntoken"], ["https://offline-kv.upstash.io", "x".repeat(4097)], ...invalidUrls.map(url => [url, "offline-kv-token"])]) {
      process.env.KV_REST_API_URL = url;
      process.env.KV_REST_API_TOKEN = token;
      assert.equal(liveBudgetConfigured(), false, "incomplete or invalid KV configuration must fail closed, including read-only tokens");
      assert.deepEqual(await mode().then(r => r.json()), { mode: "unconfigured" });
      await assert.rejects(reserveLiveBudget("vto", new AbortController().signal), /not configured/);
    }
    assert.equal(calls, 0);
    process.env.KV_REST_API_URL = "https://offline-kv.upstash.io";
    process.env.KV_REST_API_TOKEN = "offline-kv-token";
    for (const [url, token] of [["", "offline-budget-token"], ["https://offline-budget.upstash.io", ""], ["https://offline-budget.upstash.io", "invalid\r\ntoken"], ...invalidUrls.map(url => [url, "offline-budget-token"])]) {
      process.env.UPSTASH_REDIS_REST_URL = url;
      process.env.UPSTASH_REDIS_REST_TOKEN = token;
      assert.equal(liveBudgetConfigured(), false, "an incomplete or invalid explicit Upstash pair must not fall back to valid KV credentials");
      assert.deepEqual(await mode().then(r => r.json()), { mode: "unconfigured" });
      await assert.rejects(reserveLiveBudget("vto", new AbortController().signal), /not configured/);
    }
    assert.equal(calls, 0);
    process.env.UPSTASH_REDIS_REST_URL = "";
    process.env.UPSTASH_REDIS_REST_TOKEN = "";
    assert.equal(liveBudgetConfigured(), true, "empty explicit Upstash fields must allow the complete KV pair");
    await reserveLiveBudget("skin", new AbortController().signal);
    assert.equal(calls, 1);

    process.env.UPSTASH_REDIS_REST_URL = "https://offline-budget.upstash.io";
    process.env.UPSTASH_REDIS_REST_TOKEN = "offline-budget-token";
    expectedUrl = "https://offline-budget.upstash.io/";
    expectedToken = "offline-budget-token";
    assert.equal(liveBudgetConfigured(), true);
    assert.deepEqual(await mode().then(r => r.json()), { mode: "live" });
    calls = 0;
    await reserveLiveBudget("vto", new AbortController().signal);
    assert.equal(calls, 1, "explicit Upstash credentials must take precedence when both families are configured");
    console.log("PASS: KV aliases share validated transport and mode; explicit Upstash pairs take precedence without mixing or fallback");

    for (const badReply of [{ result: 0 }, { result: -1 }, { result: "1" }, { error: "private-token-or-url" }, {}, "throw", "http-error"]) {
      reply = badReply;
      for (const [endpoint, body] of [[skin, { imageDataUrl: png }], [vto, { fullBodyDataUrl: png, garmentImageDataUrl: png, garmentCategory: "upper_body" }]] as const) {
        calls = 0;
        const response: Response = await endpoint(new Request("http://localhost/api/photo", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }) as never);
        assert.equal(response.status, 503);
        assert.equal(response.headers.get("cache-control"), "no-store");
        assert.equal(calls, 1, "denied reservation must never retry");
        assert(!(await response.text()).includes("private-token-or-url"));
      }
    }
    calls = 0;
    const cancelled = AbortSignal.abort();
    await assert.rejects(reserveLiveBudget("skin", cancelled));
    assert.equal(calls, 0, "cancelled requests must not reserve");
    const realTimeout = AbortSignal.timeout;
    let storeDeadline: AbortController | undefined;
    AbortSignal.timeout = milliseconds => {
      assert.equal(milliseconds, 5_000, "storage has a short deadline independent of the task deadline");
      storeDeadline = new AbortController();
      return storeDeadline.signal;
    };
    globalThis.fetch = (async (_url, init) => new Promise((_resolve, reject) => {
      init!.signal!.addEventListener("abort", () => reject(new Error("private-store-timeout")), { once: true });
      storeDeadline!.abort();
    })) as typeof fetch;
    try { await assert.rejects(reserveLiveBudget("vto", new AbortController().signal), /budget could not be checked/); }
    finally { AbortSignal.timeout = realTimeout; }
    console.log("PASS: exhausted, missing, malformed and unavailable budgets fail closed with no upload or retry");

    for (const args of [["init", "1.001", "2", "20"], ["init", "0", "2", "20"], ["init", "1", "-2", "20"], ["init", "Infinity", "2", "20"], ["init", "10", "2"], ["reset"]]) {
      const child = spawnSync(process.execPath, ["--import", "tsx", "scripts/live-budget.mjs", ...args], { encoding: "utf8" });
      assert.equal(child.status, 1);
      assert.match(child.stderr, /Usage:|positive|decimal/i);
      assert(!child.stderr.includes("offline-budget-token"));
    }
    console.log("PASS: operator input rejects zero, negative, fractional precision and reset before storage access");
  } finally { globalThis.fetch = realFetch; }
})().catch(error => { console.error(error); process.exit(1); });
