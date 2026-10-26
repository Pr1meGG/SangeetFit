// Offline route tests: every fetch is stubbed, including signed image uploads.
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { INDIAN_WEAR_LIBRARY } from "../src/data/indian-wear.ts";
import { pngDataUrl } from "./fixtures/png.ts";
import { configureOfflineBudget, offlineBudgetResponse } from "./fixtures/budget.ts";

const png = pngDataUrl();
const jpegOutfit = INDIAN_WEAR_LIBRARY.find(item => item.vtoSupported && item.tryOnReference?.endsWith(".jpg"))!;
const jpeg = `data:image/jpeg;base64,${readFileSync(`public/garment_test/${jpegOutfit.tryOnReference}`).toString("base64")}`;
const mock = process.argv.includes("--mock");

void (async () => {
  process.env.MOCK_MODE = String(mock);
  configureOfflineBudget();
  process.env.YOUCAM_API_KEY = "offline-test-key";
  process.env.YOUCAM_BASE_URL = "https://example.test/s2s/v2.0";
  let calls: string[] = [];
  let tasks: Record<string, unknown>[] = [];
  let stopAt = "";
  let uploadCount = 0;
  let timeoutAt = "";
  let deadlineController: AbortController | null = null;
  let requestSignal: AbortSignal | undefined;
  const realFetch = globalThis.fetch;
  globalThis.fetch = (async (input, init) => {
    const budget = offlineBudgetResponse(input, init);
    if (budget) return budget;
    const url = String(input);
    calls.push(url);
    if (timeoutAt) {
      assert(init?.signal, "every external stage needs the request deadline signal");
      requestSignal ??= init.signal;
      assert.equal(init.signal, requestSignal, "one shared deadline spans every external stage");
      if (url.endsWith(timeoutAt)) {
        deadlineController!.abort(new DOMException("deadline elapsed", "TimeoutError"));
        init.signal.throwIfAborted();
      }
    }
    if (stopAt && url.endsWith(stopAt)) return new Response(null, { status: 429 });
    if (url.endsWith("/file")) {
      const file = JSON.parse(String(init?.body)).files[0];
      assert(["image/png", "image/jpeg"].includes(file.content_type));
      uploadCount++;
      return Response.json({ data: { files: [{ file_id: `file-${uploadCount}`, requests: [{
        method: "PUT", url: `https://example.test/upload/${uploadCount}`, headers: {},
      }] }] } });
    }
    if (url.includes("/upload/")) {
      assert(init?.body instanceof Uint8Array);
      return new Response(null, { status: 200 });
    }
    if (url.endsWith("/task/cloth-v4")) {
      tasks.push(JSON.parse(String(init?.body)));
      return Response.json({ data: { task_id: "offline-task" } });
    }
    assert(url.endsWith("/task/cloth-v4/offline-task"));
    return Response.json({ data: { task_status: "success", results: { url: "https://example.test/result.png" } } });
  }) as typeof fetch;
  try {
    const { POST } = await import("../src/app/api/vto/route.ts");
    const send = (body: unknown) => POST(new Request("http://localhost/api/vto", {
      method: "POST", body: typeof body === "string" ? body : JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    }) as never);
    const upload = { fullBodyDataUrl: png, garmentImageDataUrl: png, garmentCategory: "upper_body" };
    let response = await send(upload);
    assert.equal(response.status, 200, JSON.stringify(await response.clone().json()));
    const result = await response.json();
    assert.equal(result.mode, mock ? "mock" : "live");
    if (mock) {
      assert.equal(result.resultUrl, png, "mock is the reference, never a claimed composite");
      assert.equal(calls.length, 0);
      console.log("PASS: uploaded mock returns the reference with honest mode and zero fetches");
      return;
    }
    assert.equal(tasks.length, 1);
    assert.equal(tasks[0].garment_category, "upper_body");
    assert.equal(calls.length, 6);
    for (const body of [
      { ...upload, fullBodyDataUrl: jpeg, garmentCategory: "full_body" },
      { ...upload, garmentImageDataUrl: jpeg },
      { fullBodyDataUrl: png, garmentId: jpegOutfit.id, referenceAsset: jpegOutfit.tryOnReference, vtoSupported: true, displayImage: jpegOutfit.imageUrl },
    ]) {
      response = await send(body);
      assert.equal(response.status, 200, JSON.stringify(await response.clone().json()));
    }
    assert.equal(tasks.length, 4, "one task per explicit route request");
    assert.equal(tasks[1].garment_category, "full_body");
    console.log("PASS: valid PNG/JPEG person and garment uploads and legacy catalogue submit one task each");

    const tooWide = Buffer.from(png.split(",")[1], "base64");
    tooWide.writeUInt32BE(4097, 16);
    const zeroHeight = Buffer.from(png.split(",")[1], "base64");
    zeroHeight.writeUInt32BE(0, 20);
    const invalidBodies: unknown[] = [
      null, [], "{", { ...upload, garmentCategory: "auto" },
      { ...upload, fullBodyDataUrl: undefined }, { ...upload, garmentImageDataUrl: undefined },
      { ...upload, garmentImageDataUrl: "https://example.test/image.png" },
      { ...upload, garmentImageDataUrl: "/etc/passwd" },
      { ...upload, garmentImageDataUrl: "data:image/png;base64,aGVsbG8=" },
      { ...upload, garmentImageDataUrl: `data:image/png;base64,${Buffer.from(png.split(",")[1], "base64").subarray(0, 24).toString("base64")}` },
      { ...upload, garmentImageDataUrl: `data:image/png;base64,${Buffer.from(png.split(",")[1], "base64").subarray(0, -12).toString("base64")}` },
      { ...upload, garmentImageDataUrl: `data:image/jpeg;base64,${Buffer.from(jpeg.split(",")[1], "base64").subarray(0, -2).toString("base64")}` },
      { ...upload, fullBodyDataUrl: "data:image/png;base64,aGVsbG8=" },
      { ...upload, garmentImageDataUrl: jpeg.replace("image/jpeg", "image/png") },
      { ...upload, garmentImageDataUrl: `data:image/png;base64,${tooWide.toString("base64")}` },
      { ...upload, fullBodyDataUrl: `data:image/png;base64,${zeroHeight.toString("base64")}` },
      { ...upload, fullBodyDataUrl: 123 },
      { ...upload, fullBodyDataUrl: pngDataUrl(127, 127) },
      { ...upload, garmentImageDataUrl: pngDataUrl(1, 1) },
      { ...upload, garmentCategory: undefined },
      { ...upload, imageDataUrl: png },
      { fullBodyDataUrl: png, garmentId: "unknown", referenceAsset: "../../bad.png", vtoSupported: true },
      { fullBodyDataUrl: png, garmentId: jpegOutfit.id, referenceAsset: "../../bad.png", vtoSupported: true },
      { fullBodyDataUrl: png, garmentId: jpegOutfit.id, referenceAsset: "constructor", vtoSupported: true },
      { fullBodyDataUrl: png, garmentId: jpegOutfit.id, referenceAsset: "user_saree.png", vtoSupported: true },
      { fullBodyDataUrl: png, garmentId: jpegOutfit.id, referenceAsset: jpegOutfit.tryOnReference, vtoSupported: false },
    ];
    for (const key of ["garmentId", "referenceAsset", "vtoSupported", "displayImage"]) {
      invalidBodies.push({ ...upload, [key]: key === "vtoSupported" ? false : "" });
    }
    for (const body of invalidBodies) {
      calls = [];
      response = await send(body);
      assert.equal(response.status, 400, `invalid body accepted: ${JSON.stringify(body).slice(0, 120)}`);
      assert.equal(calls.length, 0, "invalid inputs rejected before external calls");
    }
    const raw = JSON.stringify({ ...upload, padding: "x".repeat(4_000_000) });
    calls = [];
    response = await send(raw);
    assert.equal(response.status, 413);
    assert.equal(calls.length, 0);
    calls = [];
    response = await send({ ...upload, padding: "é".repeat(2_000_000) });
    assert.equal(response.status, 413, "budget counts UTF8 bytes, not JS characters");
    assert.equal(calls.length, 0);
    console.log("PASS: malformed/mixed inputs, spoofed MIME, dimension bounds and combined budget reject before fetch");

    const { OUTFITS } = await import("../src/data/outfits.ts");
    const blocked = OUTFITS.find(item => item.id === jpegOutfit.id)!;
    const previousStatus = blocked.tryOnStatus;
    try {
      blocked.tryOnStatus = "blocked";
      calls = [];
      response = await send({ fullBodyDataUrl: png, garmentId: blocked.id, referenceAsset: blocked.tryOnReference, vtoSupported: true });
      assert.equal(response.status, 400, "quality-blocked references reject even when their wiring remains");
      assert.equal(calls.length, 0);
    } finally { blocked.tryOnStatus = previousStatus; }
    console.log("PASS: blocked review status overrides stale catalogue links and valid reference wiring");

    for (const stage of ["/file", "/upload/" + (uploadCount + 1), "/task/cloth-v4", "/task/cloth-v4/offline-task"]) {
      calls = []; tasks = []; stopAt = stage;
      response = await send(upload);
      assert.equal(response.status, 429, "upstream rate limiting must reach the client stop state");
      assert.match((await response.json()).error, /429/);
      assert.equal(calls.filter(url => url.endsWith(stage)).length, 1, "429 is not retried");
      assert(tasks.length <= 1);
    }
    console.log("PASS: metadata/binary upload, submission and poll 429 stop immediately, with no task resubmission");
    stopAt = "";
    const realTimeout = AbortSignal.timeout;
    AbortSignal.timeout = milliseconds => {
      if (milliseconds === 5_000) return realTimeout(milliseconds);
      assert.equal(milliseconds, 180_000, "whole request budget is 180 seconds");
      deadlineController = new AbortController();
      return deadlineController.signal;
    };
    try {
      for (const stage of ["/file", "/upload/" + (uploadCount + 1), "/task/cloth-v4", "/task/cloth-v4/offline-task"]) {
        timeoutAt = stage; calls = []; tasks = []; requestSignal = undefined;
        response = await send(upload);
        assert.equal(response.status, 504);
        assert.match((await response.json()).error, /timed out/i);
        assert.equal(calls.filter(url => url.endsWith(stage)).length, 1);
        assert(tasks.length <= 1, "timeout never resubmits a task");
      }
    } finally { AbortSignal.timeout = realTimeout; }
    console.log("PASS: one 180-second request deadline reaches metadata/binary/submission/poll and aborts without resubmitting");
  } finally { globalThis.fetch = realFetch; }
  const child = spawnSync(process.execPath, [...process.execArgv, fileURLToPath(import.meta.url), "--mock"], { stdio: "inherit" });
  assert.equal(child.status, 0, "mock process must pass");
})().catch(error => { console.error(error); process.exit(1); });
