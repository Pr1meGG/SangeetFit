// Offline trust-boundary checks. Every provider request is replaced with a stub.
import { strict as assert } from "node:assert";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { pngDataUrl } from "./fixtures/png.ts";
import { configureOfflineBudget, offlineBudgetResponse } from "./fixtures/budget.ts";

const png = pngDataUrl();
const mock = process.argv.includes("--mock");

void (async () => {
  process.env.MOCK_MODE = String(mock);
  configureOfflineBudget();
  process.env.YOUCAM_API_KEY = "offline-test-key";
  process.env.YOUCAM_BASE_URL = "https://example.test/s2s/v2.0";
  const { POST: skin } = await import("../src/app/api/skin/route.ts");
  const { POST: vto } = await import("../src/app/api/vto/route.ts");
  const { GET: mode } = await import("../src/app/api/mode/route.ts");
  const realFetch = globalThis.fetch;
  let fetchCalls = 0;
  let calls: string[] = [];
  let tasks = 0;
  let failure = "";
  let stage = "";
  let deadline: AbortController | null = null;
  let sharedSignal: AbortSignal | null = null;
  let resultUrl = "https://example.test/result.jpg";
  const request = (body: unknown, extraHeaders: Record<string, string> = {}) => new Request("http://localhost/api/photo", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...extraHeaders },
    body: JSON.stringify(body),
  });
  globalThis.fetch = (async (input, init) => {
    fetchCalls++;
    const budget = offlineBudgetResponse(input, init);
    if (budget) return budget;
    const url = String(input);
    const currentStage = url.includes("/upload/") ? "binary" : url.endsWith("/file") ? "metadata" : /\/task\/(?:skin-tone-analysis|cloth-v4)$/.test(url) ? "submit" : "poll";
    calls.push(currentStage);
    assert(init?.signal, "all provider stages have a shared deadline");
    sharedSignal ??= init.signal;
    assert.equal(init.signal, sharedSignal);
    if (currentStage === stage) {
      if (failure === "429") return new Response("provider details are private", { status: 429 });
      if (failure === "timeout") { deadline!.abort(); init.signal.throwIfAborted(); }
      if (failure === "malformed") return Response.json({ data: {} });
      if (failure === "throw") throw new Error("private provider URL https://example.test/signed?token=secret");
    }
    if (currentStage === "metadata") return Response.json({ data: { files: [{ file_id: "offline-file", requests: [{ method: "PUT", url: "https://example.test/upload/file", headers: {} }] }] } });
    if (currentStage === "binary") return new Response(null, { status: 200 });
    if (currentStage === "submit") { tasks++; return Response.json({ data: { task_id: "offline-task" } }); }
    if (failure === "task-error") return Response.json({ data: { task_status: "error", error_message: "private provider URL https://example.test/signed?token=secret" } });
    if (failure === "bad-colour") return Response.json({ data: { task_status: "success", results: { color: { skin_color: "javascript:invalid" } } } });
    return Response.json({ data: { task_status: "success", results: url.includes("cloth-v4") ? { url: resultUrl } : { color: { skin_color: "#A97F61" } } } });
  }) as typeof fetch;
  try {
    assert.deepEqual(await mode().then(response => response.json()), mock ? { mode: "mock" } : { mode: "live" });
    for (const [endpoint, body] of [[skin, { imageDataUrl: png }], [vto, { fullBodyDataUrl: png, garmentImageDataUrl: png, garmentCategory: "upper_body" }]] as const) {
      for (const [headers, status] of [
        [{ Origin: "https://foreign.example" }, 403],
        [{ Origin: "null" }, 403],
        [{ "Content-Type": "text/plain" }, 415],
        [{ "Content-Type": "application/x-www-form-urlencoded" }, 415],
      ] as const) {
        const req = request(body, headers);
        const response = await endpoint(req as never);
        assert.equal(response.status, status, "foreign origins and non-JSON bodies must be rejected");
        assert.equal(req.bodyUsed, false, "rejected requests must not read photos");
        assert.equal(response.headers.get("cache-control"), "no-store");
        assert.equal(fetchCalls, 0, "rejected requests must not reserve budget or reach the provider");
      }
    }
    console.log("PASS: foreign/null origins and non-JSON photo requests reject before reading photos or making any fetch");
    for (const endpoint of [skin, vto]) {
      for (const [origin, status] of [["http://127.0.0.1:3566", 400], ["http://localhost:3566", 403]] as const) {
        const req = new Request("http://localhost:3566/api/photo", {
          method: "POST",
          headers: { "Content-Type": "application/json", Host: "127.0.0.1:3566", Origin: origin, "X-Forwarded-Host": "localhost:3566" },
          body: JSON.stringify({}),
        });
        const response = await endpoint(req as never);
        assert.equal(response.status, status, "origin must match the actual Host, not Next's internal URL or forwarded host");
        assert.equal(req.bodyUsed, status === 400);
        assert.equal(fetchCalls, 0);
      }
    }
    console.log("PASS: actual Host origin survives Next internal localhost normalization; foreign and forwarded host origins reject");
    if (mock) {
      const response = await skin(request({ imageDataUrl: png }) as never);
      assert.deepEqual(await response.json(), { success: true, skin_color: "#b9947c", mode: "mock" });
      assert.equal(response.headers.get("cache-control"), "no-store");
      assert.equal(calls.length, 0);
      console.log("PASS: mock remains labelled and never calls provider");
      return;
    }
    for (const endpoint of [skin, vto]) {
      const req = request({}, { Origin: "http://localhost", "Content-Type": "application/json; charset=utf-8" });
      const response = await endpoint(req as never);
      assert.equal(response.status, 400, "requests without an access code must reach image validation");
      assert.equal(req.bodyUsed, true);
      assert.equal(response.headers.get("cache-control"), "no-store");
    }
    assert.equal(calls.length, 0);
    console.log("PASS: live routes accept requests without a code while invalid images stop before provider work");

    for (const endpoint of [skin, vto]) {
      let chunk = 0;
      let cancelled = false;
      const stream = new ReadableStream<Uint8Array>({
        pull(controller) { controller.enqueue(new Uint8Array(++chunk === 1 ? 3_000_000 : 1_000_000)); },
        cancel() { cancelled = true; },
      }, { highWaterMark: 0 });
      const init = { method: "POST", headers: { "Content-Type": "application/json" }, body: stream, duplex: "half" };
      const response = await endpoint(new Request("http://localhost/api/photo", init) as never);
      assert.equal(response.status, 413);
      assert.equal(chunk, 2, "reader stops at the byte limit instead of buffering an unbounded body");
      assert(cancelled);
      const declared = request({}, { "Content-Length": "4000000" });
      assert.equal((await endpoint(declared as never)).status, 413);
      assert.equal(declared.bodyUsed, false);
    }
    for (const body of [null, [], {}, { imageDataUrl: "data:image/png;base64,aGVsbG8=" }, { imageDataUrl: png.replace("image/png", "image/jpeg") }, { imageDataUrl: pngDataUrl(1, 1) }, { imageDataUrl: pngDataUrl(127, 127) }]) {
      assert.equal((await skin(request(body) as never)).status, 400);
    }
    assert.equal(calls.length, 0);
    console.log("PASS: declared/chunked oversized bodies, malformed JSON objects and spoofed selfie images reject before provider calls");

    let response = await skin(request({ imageDataUrl: png }, { Origin: "http://localhost", "Content-Type": "application/json; charset=utf-8" }) as never);
    assert.deepEqual(await response.json(), { success: true, skin_color: "#A97F61", mode: "live" });
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(tasks, 1);
    for (const [kind, target] of [["malformed", "metadata"], ["malformed", "submit"], ["malformed", "poll"], ["throw", "binary"], ["task-error", "poll"], ["bad-colour", "poll"]]) {
      failure = kind; stage = target; calls = []; tasks = 0; sharedSignal = null;
      response = await skin(request({ imageDataUrl: png }) as never);
      assert.equal(response.status, 502);
      assert.equal(response.headers.get("cache-control"), "no-store");
      const text = await response.text();
      assert(!text.includes("token=secret") && !text.includes("javascript:"));
      assert(tasks <= 1);
    }
    console.log("PASS: skin contracts validate task/result shapes and sanitize provider failures without another task");
    failure = "task-error"; stage = "poll"; calls = []; tasks = 0; sharedSignal = null;
    response = await vto(request({ fullBodyDataUrl: png, garmentImageDataUrl: png, garmentCategory: "upper_body" }) as never);
    assert.equal(response.status, 502);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert(!(await response.text()).includes("token=secret"));
    assert.equal(tasks, 1);
    console.log("PASS: try-on task errors expose no raw provider message or signed URL");
    for (const invalidUrl of ["http://example.test/result.jpg", "https://", "not-a-url", "https://user:password@example.test/result.jpg", "https://example.test:invalid/result.jpg"]) {
      resultUrl = invalidUrl; failure = ""; calls = []; tasks = 0; sharedSignal = null;
      response = await vto(request({ fullBodyDataUrl: png, garmentImageDataUrl: png, garmentCategory: "upper_body" }) as never);
      assert.equal(response.status, 502);
      assert.equal(tasks, 1);
      assert(!(await response.text()).includes(invalidUrl));
    }
    resultUrl = "https://example.test/result.jpg"; calls = []; tasks = 0; sharedSignal = null;
    response = await vto(request({ fullBodyDataUrl: png, garmentImageDataUrl: png, garmentCategory: "upper_body" }) as never);
    assert.equal(response.status, 200);
    assert.equal((await response.json()).resultUrl, resultUrl);
    console.log("PASS: try-on results require parseable HTTPS URLs without credentials");
    for (const target of ["metadata", "binary", "submit", "poll"]) {
      failure = "429"; stage = target; calls = []; tasks = 0; sharedSignal = null;
      response = await skin(request({ imageDataUrl: png }) as never);
      assert.equal(response.status, 429);
      assert.equal(calls.filter(item => item === target).length, 1);
      assert(tasks <= 1);
    }
    const realTimeout = AbortSignal.timeout;
    AbortSignal.timeout = milliseconds => { if (milliseconds === 5_000) return realTimeout(milliseconds); assert.equal(milliseconds, 180_000); deadline = new AbortController(); return deadline.signal; };
    try {
      for (const target of ["metadata", "binary", "submit", "poll"]) {
        failure = "timeout"; stage = target; calls = []; tasks = 0; sharedSignal = null;
        response = await skin(request({ imageDataUrl: png }) as never);
        assert.equal(response.status, 504);
        assert.equal(calls.filter(item => item === target).length, 1);
        assert(tasks <= 1);
      }
    } finally { AbortSignal.timeout = realTimeout; }
    console.log("PASS: skin metadata/binary/submission/poll preserve 429 and one deadline with zero automatic retries");
  } finally { globalThis.fetch = realFetch; }
  const child = spawnSync(process.execPath, [...process.execArgv, fileURLToPath(import.meta.url), "--mock"], { stdio: "inherit" });
  assert.equal(child.status, 0);
})().catch(error => { console.error(error); process.exit(1); });
