import { strict as assert } from "node:assert";
import { randomUUID } from "node:crypto";
import { pngDataUrl } from "./fixtures/png.ts";
import { createSharedResult, deleteSharedResult, getSharedResult, issueSharingReceipt, listSharedResults, loginSharedResults, logoutSharedResults, MAX_SHARED_IMAGE_BYTES, SHARED_RESULTS_PREFIX, SHARED_RESULTS_TTL, STORE_SHARED_RESULT_SCRIPT } from "../src/lib/shared-results.ts";

void (async () => {
  const originalFetch = globalThis.fetch;
  const originalNow = Date.now;
  const originalEnv = { ...process.env };
  let currentTime = 1_800_000_000_000;
  Date.now = () => currentTime;
  process.env.MOCK_MODE = "false";
  process.env.RESULTS_ADMIN_SECRET = "offline-gallery-secret-" + "x".repeat(32);
  process.env.UPSTASH_REDIS_REST_URL = "https://offline-results.upstash.io";
  process.env.UPSTASH_REDIS_REST_TOKEN = "offline-results-token";
  const image = Buffer.from(pngDataUrl().split(",")[1], "base64");
  const records = new Map<string, { value: string; expires: number }>();
  const index = new Map<string, number>();
  let storeWrites = 0;
  let downloads = 0;
  let failStore = false;
  let loseCommitReply = false;
  let download: () => Response = () => new Response(image, { headers: { "Content-Type": "image/png" } });
  const seconds = () => Math.floor(currentTime / 1000);
  function get(key: string) {
    const stored = records.get(key);
    if (!stored || stored.expires <= seconds()) { records.delete(key); return null; }
    return stored.value;
  }
  const activeRecords = () => [...records.keys()].filter(key => { const value = get(key); return value !== null && value !== '{"deleted":true}'; }).length;
  globalThis.fetch = (async (url, init) => {
    if (String(url) === "https://offline-results.upstash.io/") {
      assert.equal(init?.redirect, "error"); assert.equal(init?.cache, "no-store");
      if (failStore) throw new Error("private database credential must not leak");
      const args = JSON.parse(String(init?.body));
      let result: unknown;
      if (args[0] === "GET") result = get(args[1]);
      else if (args[0] === "MGET") result = args.slice(1).map(get);
      else if (args[0] === "ZRANGEBYSCORE") result = [...index].filter(([, expiry]) => expiry >= Number(args[2])).map(([id]) => id).slice(0, 20);
      else if (args[0] === "EVAL" && args[1] === STORE_SHARED_RESULT_SCRIPT) {
        const [, , keys, metadataKey, imageKey, indexKey, metadata, bytes, createdAt, expiresAt, visitor, id] = args;
        assert.equal(keys, 3); assert.equal(indexKey, `${SHARED_RESULTS_PREFIX}index`);
        const existing = get(metadataKey);
        if (existing) {
          const item = JSON.parse(existing);
          result = item.deleted ? -3 : item.visitor === visitor ? item.expiresAt : -2;
        }
        else {
          for (const [indexedId, expiry] of index) if (expiry <= createdAt) index.delete(indexedId);
          if (index.size >= 20) result = -1;
          else {
            records.set(metadataKey, { value: metadata, expires: createdAt + SHARED_RESULTS_TTL });
            records.set(imageKey, { value: bytes, expires: createdAt + SHARED_RESULTS_TTL });
            index.set(id, expiresAt); storeWrites++; result = expiresAt;
            if (loseCommitReply) { loseCommitReply = false; throw new Error("Database committed but reply was lost"); }
          }
        }
      } else if (args[0] === "EVAL") {
        assert.match(args[1], /SET', KEYS\[1\], '\{"deleted":true\}', 'EX', 3600/);
        assert.match(args[1], /DEL', KEYS\[2\]/);
        records.set(args[3], { value: '{"deleted":true}', expires: seconds() + 3600 });
        records.delete(args[4]); index.delete(args[6]); result = 1;
      } else throw new Error(`Unexpected offline Redis command: ${args[0]}`);
      return Response.json({ result });
    }
    assert.match(String(url), /^https:\/\/yce-us\.s3-accelerate\.amazonaws\.com\//);
    assert.equal(init?.redirect, "error"); assert.equal(init?.cache, "no-store"); assert(init?.signal);
    downloads++; return download();
  }) as typeof fetch;
  const req = (path: string, body?: unknown, credential?: string, method = body ? "POST" : "GET", origin = "https://app.test") => new Request(`https://app.test/api/shared-results${path}`, { method, headers: { ...(body ? { "Content-Type": "application/json" } : {}), ...(credential ? credential.startsWith("Bearer ") ? { Authorization: credential } : { Cookie: credential } : {}), Origin: origin }, ...(body ? { body: JSON.stringify(body) } : {}) });
  const cookie = (response: Response) => response.headers.get("set-cookie")!.split(";")[0];
  const receipt = () => issueSharingReceipt("https://yce-us.s3-accelerate.amazonaws.com/output/synthetic.png?signature=offline", "Synthetic outfit")!;
  const share = (item: ReturnType<typeof receipt>) => createSharedResult(req("", { receipt: item.receipt, consent: true }));
  try {
    assert.match(STORE_SHARED_RESULT_SCRIPT, /SET', KEYS\[1\].*'EX', 86400/);
    assert.match(STORE_SHARED_RESULT_SCRIPT, /SET', KEYS\[2\].*'EX', 86400/);
    assert.match(STORE_SHARED_RESULT_SCRIPT, /ZCARD'.*>= 20/);
    assert.match(STORE_SHARED_RESULT_SCRIPT, /if item.deleted then return -3 end/);
    for (const url of ["https://evil.test/image.png", "http://yce-us.s3-accelerate.amazonaws.com/image.png", "https://yce-us.s3-accelerate.amazonaws.com.evil.test/image.png", "https://user:pass@yce-us.s3-accelerate.amazonaws.com/image.png", "https://yce-us.s3-accelerate.amazonaws.com:444/image.png", "https://yce-us.s3-accelerate.amazonaws.com/image.png#fragment"]) assert.equal(issueSharingReceipt(url, "Test"), undefined);
    process.env.MOCK_MODE = "true"; assert.equal(receipt(), undefined);
    assert.equal((await createSharedResult(req("", { receipt: "mock", consent: true }))).status, 400);
    process.env.MOCK_MODE = "false";
    const issued = receipt();
    assert.equal(storeWrites, 0); assert.equal(downloads, 0, "receipt issuance must not archive or download images");
    for (const consent of [undefined, false, "true", 1]) assert.equal((await createSharedResult(req("", { receipt: issued.receipt, consent }))).status, 400);
    assert.equal((await createSharedResult(req("", { receipt: issued.receipt, consent: true }, undefined, "POST", "https://evil.test"))).status, 403);
    assert.equal((await createSharedResult(req("", { receipt: issued.receipt + "x", consent: true }))).status, 400);
    assert.equal(downloads, 0); assert.equal(storeWrites, 0);
    const first = await share(issued);
    assert.equal(first.status, 200); assert.equal(first.headers.get("cache-control"), "no-store");
    assert.equal(first.headers.get("set-cookie"), null, "result access must not depend on a cookie arriving after persistence");
    const access = `Bearer ${issued.accessToken}`;
    const firstBody = await first.json();
    assert.deepEqual(firstBody, { id: issued.id, expiresAt: seconds() + SHARED_RESULTS_TTL });
    assert.equal(activeRecords(), 2); assert.equal(storeWrites, 1);
    const storedMetadata = JSON.parse([...records].find(([key]) => key.endsWith(":meta"))![1].value);
    assert(!JSON.stringify(storedMetadata).includes("signature")); assert(!("resultUrl" in storedMetadata)); assert(!("sourceDataUrl" in storedMetadata));
    const status = await getSharedResult(req(`/${issued.id}`, undefined, access), issued.id);
    assert.deepEqual(await status.json(), { ...firstBody, outfitLabel: "Synthetic outfit" });
    const binary = await getSharedResult(req(`/${issued.id}?image=1`, undefined, access), issued.id);
    assert.equal(binary.status, 200); assert.equal(binary.headers.get("content-type"), "image/png");
    assert(Buffer.from(await binary.arrayBuffer()).equals(image));
    assert.equal((await getSharedResult(req(`/${issued.id}`), issued.id)).status, 404);
    assert.equal((await getSharedResult(req(`/${randomUUID()}`, undefined, access), randomUUID())).status, 404);
    assert.equal((await listSharedResults(req(""))).status, 401);
    const foreign = receipt();
    assert.equal((await getSharedResult(req(`/${issued.id}`, undefined, `Bearer ${foreign.accessToken}`), issued.id)).status, 404);
    assert.equal((await getSharedResult(req(`/${issued.id}`, undefined, `${access}x`), issued.id)).status, 404);
    assert.equal((await getSharedResult(req(`/${issued.id}?accessToken=${issued.accessToken}`), issued.id)).status, 404, "private keys in query parameters are not authentication");
    assert.equal((await getSharedResult(req(`/${issued.id}`, undefined, `Bearer ${issued.receipt}`), issued.id)).status, 404, "a save receipt is not a view key");
    const accessPayload = JSON.parse(Buffer.from(issued.accessToken.split(".")[0], "base64url").toString("utf8"));
    assert.equal(accessPayload.purpose, "result-access");
    assert.equal(accessPayload.id, issued.id);
    assert.equal(accessPayload.exp, seconds() + SHARED_RESULTS_TTL);
    assert(!("resultUrl" in accessPayload));
    currentTime += 5_000;
    const repeated = await share(issued);
    assert.deepEqual(await repeated.json(), firstBody); assert.equal(storeWrites, 1); assert.equal(downloads, 1, "a receipt retry must not download or extend expiry");
    const wrongLogin = await loginSharedResults(req("/admin", { password: "wrong" })); assert.equal(wrongLogin.status, 401);
    const login = await loginSharedResults(req("/admin", { password: process.env.RESULTS_ADMIN_SECRET }));
    assert.equal(login.status, 200); const admin = cookie(login);
    assert.match(login.headers.get("set-cookie")!, /HttpOnly/); assert.match(login.headers.get("set-cookie")!, /Secure/); assert.match(login.headers.get("set-cookie")!, /SameSite=strict/);
    const listing = await listSharedResults(req("", undefined, admin));
    assert.deepEqual((await listing.json()).results, [{ id: issued.id, outfitLabel: "Synthetic outfit", createdAt: firstBody.expiresAt - SHARED_RESULTS_TTL, expiresAt: firstBody.expiresAt, imageUrl: `/api/shared-results/${issued.id}?image=1` }]);
    assert.equal((await getSharedResult(req(`/${issued.id}?image=1`, undefined, admin), issued.id)).status, 200);
    assert.equal((await deleteSharedResult(req(`/${issued.id}`, undefined, undefined, "DELETE"), issued.id)).status, 404);
    assert.equal((await deleteSharedResult(req(`/${issued.id}`, undefined, access, "DELETE", "https://evil.test"), issued.id)).status, 403);
    assert.equal((await deleteSharedResult(req(`/${issued.id}`, undefined, access, "DELETE"), issued.id)).status, 200);
    assert.equal(activeRecords(), 0); assert.equal(index.size, 0);
    assert.equal((await getSharedResult(req(`/${issued.id}`, undefined, admin), issued.id)).status, 404);
    assert.equal(get(`${SHARED_RESULTS_PREFIX}${issued.id}:meta`), '{"deleted":true}');
    assert.equal(records.get(`${SHARED_RESULTS_PREFIX}${issued.id}:meta`)!.expires, seconds() + 3600);
    assert.equal((await share(issued)).status, 410, "a valid old receipt must not recreate a removed result");
    assert.equal(get(`${SHARED_RESULTS_PREFIX}${issued.id}:image`), null);
    assert.equal((await deleteSharedResult(req(`/${issued.id}`, undefined, access, "DELETE"), issued.id)).status, 404);
    const logout = await logoutSharedResults(req("/admin", undefined, admin, "DELETE")); assert.match(logout.headers.get("set-cookie")!, /Max-Age=0/);
    console.log("PASS: no opt-in writes, mock/forged/origin protection, private per-result access, owner auth, idempotence and deletion");

    const uncertain = receipt();
    loseCommitReply = true;
    const uncertainResponse = await share(uncertain);
    assert.equal(uncertainResponse.status, 503);
    assert.equal(activeRecords(), 2, "simulate persistence succeeding before its transport fails");
    const uncertainAccess = `Bearer ${uncertain.accessToken}`;
    assert.equal((await getSharedResult(req(`/${uncertain.id}`, undefined, uncertainAccess), uncertain.id)).status, 200, "the previously issued key must recover a committed result without a cookie or POST reply");
    const uncertainStored = JSON.parse(get(`${SHARED_RESULTS_PREFIX}${uncertain.id}:meta`)!);
    const writesBeforeRetry = storeWrites, downloadsBeforeRetry = downloads;
    currentTime += 1_000;
    assert.deepEqual(await share(uncertain).then(r => r.json()), { id: uncertain.id, expiresAt: uncertainStored.expiresAt });
    assert.equal(storeWrites, writesBeforeRetry); assert.equal(downloads, downloadsBeforeRetry);
    assert.equal((await deleteSharedResult(req(`/${uncertain.id}`, undefined, uncertainAccess, "DELETE"), uncertain.id)).status, 200);
    const parallel = [receipt(), receipt()];
    assert.deepEqual((await Promise.all(parallel.map(share))).map(response => response.status), [200, 200]);
    for (const item of parallel) {
      const privateAccess = `Bearer ${item.accessToken}`;
      assert.equal((await getSharedResult(req(`/${item.id}`, undefined, privateAccess), item.id)).status, 200, "parallel results must each retain access independent of cookies");
      assert.equal((await deleteSharedResult(req(`/${item.id}`, undefined, privateAccess, "DELETE"), item.id)).status, 200);
    }
    assert.equal(activeRecords(), 0); assert.equal(index.size, 0);
    console.log("PASS: commit/reply loss recovers with the pre-issued key; concurrent results retain independent access");

    const racing = receipt();
    let releaseImage!: () => void;
    let notifyStarted!: () => void;
    const imageStarted = new Promise<void>(resolve => { notifyStarted = resolve; });
    download = () => {
      const waiting = new Promise<void>(resolve => { releaseImage = resolve; });
      return new Response(new ReadableStream<Uint8Array>({ async start(controller) {
        notifyStarted();
        await waiting;
        controller.enqueue(image); controller.close();
      } }), { headers: { "Content-Type": "image/png" } });
    };
    const delayedPost = share(racing);
    await imageStarted;
    download = () => new Response(image, { headers: { "Content-Type": "image/png" } });
    assert.equal((await share(racing)).status, 200);
    assert.equal((await deleteSharedResult(req(`/${racing.id}`, undefined, `Bearer ${racing.accessToken}`, "DELETE"), racing.id)).status, 200);
    releaseImage();
    assert.equal((await delayedPost).status, 410, "a POST already downloading when deletion occurs must not restore the removed image");
    assert.equal(get(`${SHARED_RESULTS_PREFIX}${racing.id}:meta`), '{"deleted":true}');
    assert.equal(get(`${SHARED_RESULTS_PREFIX}${racing.id}:image`), null);
    assert.equal(index.has(racing.id), false);
    assert.equal(activeRecords(), 0);
    console.log("PASS: deletion prevents receipt replay and delayed in-flight save resurrection");

    const delayedSave = receipt();
    currentTime += 1_000;
    assert.equal((await share(delayedSave)).status, 200);
    currentTime += (SHARED_RESULTS_TTL - 1) * 1000;
    assert.notEqual(get(`${SHARED_RESULTS_PREFIX}${delayedSave.id}:meta`), null, "record has one second of TTL left");
    assert.equal((await getSharedResult(req(`/${delayedSave.id}`, undefined, `Bearer ${delayedSave.accessToken}`), delayedSave.id)).status, 404, "the private key expires at 24 hours even if the saved record has not expired yet");
    const expiryAdmin = cookie(await loginSharedResults(req("/admin", { password: process.env.RESULTS_ADMIN_SECRET })));
    assert.equal((await getSharedResult(req(`/${delayedSave.id}`, undefined, expiryAdmin), delayedSave.id)).status, 200);
    assert.equal((await deleteSharedResult(req(`/${delayedSave.id}`, undefined, expiryAdmin, "DELETE"), delayedSave.id)).status, 200);
    assert.equal(activeRecords(), 0);

    for (const [response, status] of [[() => new Response("redirect", { status: 302, headers: { Location: "http://127.0.0.1/secret" } }), 502], [() => new Response("not an image", { headers: { "Content-Type": "text/html" } }), 502], [() => new Response("invalid", { headers: { "Content-Type": "image/png" } }), 400], [() => new Response(image, { headers: { "Content-Type": "image/png", "Content-Length": String(MAX_SHARED_IMAGE_BYTES + 1) } }), 413], [() => new Response(new Uint8Array(MAX_SHARED_IMAGE_BYTES + 1), { headers: { "Content-Type": "image/png" } }), 413]] as const) {
      download = response;
      assert.equal((await share(receipt())).status, status);
      assert.equal(activeRecords(), 0);
    }
    download = () => new Response(image, { headers: { "Content-Type": "image/png" } });
    failStore = true;
    const failure = await share(receipt()); assert.equal(failure.status, 503); assert(!JSON.stringify(await failure.json()).includes("credential"));
    failStore = false;
    const expiringReceipt = receipt(); currentTime += 3_601_000;
    const beforeExpired = downloads; assert.equal((await share(expiringReceipt)).status, 400); assert.equal(downloads, beforeExpired);
    for (let index = 0; index < 20; index++) assert.equal((await share(receipt())).status, 200);
    assert.equal(activeRecords(), 40); assert.equal((await share(receipt())).status, 409);
    const [oldId] = index.keys();
    currentTime += (SHARED_RESULTS_TTL + 1) * 1000;
    assert.equal((await getSharedResult(req(`/${oldId}`, undefined, admin), oldId)).status, 404, "expired metadata must never reveal bytes");
    const newLogin = await loginSharedResults(req("/admin", { password: process.env.RESULTS_ADMIN_SECRET }));
    assert.deepEqual(await listSharedResults(req("", undefined, cookie(newLogin))).then(r => r.json()), { results: [] });
    assert.equal((await share(receipt())).status, 200, "expired index entries must release capacity");
    process.env.RESULTS_ADMIN_SECRET = "short";
    assert.equal(receipt(), undefined); assert.equal((await listSharedResults(req("", undefined, admin))).status, 503);
    console.log("PASS: bounded provider MIME/bytes/redirect failures, safe storage errors, receipt expiry, 20-result cap and 24-hour expiry");
  } finally {
    globalThis.fetch = originalFetch; Date.now = originalNow;
    for (const key of Object.keys(process.env)) if (!(key in originalEnv)) delete process.env[key];
    Object.assign(process.env, originalEnv);
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
