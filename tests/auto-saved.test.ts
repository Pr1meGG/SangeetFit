import { strict as assert } from "node:assert";
import { randomUUID } from "node:crypto";
import { GET, POST, DELETE } from "../src/app/api/auto-saved/route.ts";
import { autoSaveVtoResult, issueSharingReceipt, loginSharedResults, logoutSharedResults, SHARED_RESULTS_PREFIX, SHARED_RESULTS_TTL, STORE_AUTO_SAVED_SCRIPT } from "../src/lib/shared-results.ts";
import { pngDataUrl } from "./fixtures/png.ts";

void (async () => {
  const originalFetch = globalThis.fetch, originalNow = Date.now, originalEnv = { ...process.env };
  let timestamp = 1_800_000_000_000, downloads = 0, writes = 0, failStore = false, loseReply = false;
  Date.now = () => timestamp;
  process.env.MOCK_MODE = "false";
  process.env.RESULTS_ADMIN_SECRET = "synthetic-autosave-" + "x".repeat(32);
  process.env.UPSTASH_REDIS_REST_URL = "https://offline-autosave.upstash.io";
  process.env.UPSTASH_REDIS_REST_TOKEN = "synthetic-token";
  const photo = pngDataUrl(), garment = pngDataUrl(128, 160), bytes = Buffer.from(photo.split(",")[1], "base64");
  const values = new Map<string, { value: string; expiry: number }>(), index = new Map<string, number>();
  let imageResponse = () => new Response(bytes, { headers: { "Content-Type": "image/png" } });
  const seconds = () => Math.floor(timestamp / 1000);
  const get = (key: string) => { const value = values.get(key); return value && value.expiry > seconds() ? value.value : null; };
  globalThis.fetch = (async (url, options) => {
    if (String(url) === "https://offline-autosave.upstash.io/") {
      if (failStore) throw new Error("synthetic storage failure");
      const args = JSON.parse(String(options?.body));
      let result: unknown;
      if (args[0] === "GET") result = get(args[1]);
      else if (args[0] === "MGET") {
        assert(args.slice(1).every((key: string) => key.endsWith(":summary")), "gallery listing must fetch only small summaries, never photo records");
        result = args.slice(1).map(get);
      }
      else if (args[0] === "ZRANGEBYSCORE") result = [...index].filter(([, score]) => score >= Number(args[2])).map(([id]) => id).slice(0, 50);
      else if (args[0] === "EVAL" && args[1] === STORE_AUTO_SAVED_SCRIPT) {
        const [, , count, key, indexKey, summaryKey, json, created, expires, visitor, id, summary] = args;
        assert.equal(count, 3); assert.equal(summaryKey, `${SHARED_RESULTS_PREFIX}autosave:${id}:summary`);
        assert.deepEqual(Object.keys(JSON.parse(summary)).sort(), ["createdAt", "expiresAt", "id", "mode", "outfitLabel"]);
        assert(Buffer.byteLength(summary) <= 1024); assert(!summary.includes("data:image"));
        assert.equal(indexKey, `${SHARED_RESULTS_PREFIX}autosave:index`);
        const existing = get(key);
        if (existing) { const item = JSON.parse(existing); result = item.deleted ? -3 : item.visitor === visitor ? item.expiresAt : -2; }
        else {
          for (const [oldId, score] of index) if (score <= created) index.delete(oldId);
          if (index.size >= 50) result = -1;
          else {
            values.set(key, { value: json, expiry: expires }); values.set(summaryKey, { value: summary, expiry: expires }); index.set(id, expires); writes++; result = expires;
            if (loseReply) { loseReply = false; throw new Error("synthetic reply loss after commit"); }
          }
        }
      } else if (args[0] === "EVAL") {
        assert.match(args[1], /SET', KEYS\[1\], '\{"deleted":true\}', 'EX', 3600/);
        assert.match(args[1], /ZREM', KEYS\[2\]/);
        values.set(args[3], { value: '{"deleted":true}', expiry: seconds() + 3600 }); values.delete(args[5]); index.delete(args[6]); result = 1;
      } else throw new Error(`Unexpected synthetic storage command: ${args[0]}`);
      return Response.json({ result });
    }
    assert.equal(String(url), "https://yce-us.s3-accelerate.amazonaws.com/output/synthetic.png?signature=offline");
    assert.equal(options?.redirect, "error"); assert.equal(options?.cache, "no-store");
    downloads++; return imageResponse();
  }) as typeof fetch;
  const req = (query = "", body?: unknown, auth?: string, method = body ? "POST" : "GET", origin = "https://app.test") => new Request(`https://app.test/api/auto-saved${query}`, { method, headers: { Origin: origin, ...(body ? { "Content-Type": "application/json" } : {}), ...(auth ? auth.startsWith("Bearer ") ? { Authorization: auth } : { Cookie: auth } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
  const receipt = () => issueSharingReceipt("https://yce-us.s3-accelerate.amazonaws.com/output/synthetic.png?signature=offline", "Synthetic outfit", { personImageDataUrl: photo, garmentImageDataUrl: garment })!;
  const payload = (item: ReturnType<typeof receipt>) => ({ receipt: item.receipt, personImageDataUrl: photo, garmentImageDataUrl: garment });
  const save = (item: ReturnType<typeof receipt>) => autoSaveVtoResult(payload(item));
  try {
    assert.match(STORE_AUTO_SAVED_SCRIPT, /ZREMRANGEBYSCORE'.*ARGV\[2\]/);
    assert.match(STORE_AUTO_SAVED_SCRIPT, /ZADD'.*ARGV\[3\]/, "score must be expiry, not creation time");
    assert.match(STORE_AUTO_SAVED_SCRIPT, /ZCARD'.*>= 50/);
    assert.match(STORE_AUTO_SAVED_SCRIPT, /SET', KEYS\[3\], ARGV\[6\], 'EX', 86400/);
    assert.equal((await GET(req())).status, 401);
    assert.equal((await GET(req(`?id=${randomUUID()}`))).status, 404);
    const first = receipt(), second = receipt();
    const saved = await save(first); timestamp += 1000; await save(second);
    assert.equal(index.size, 2, "a later save must retain the earlier record");
    assert.equal((await GET(req(`?id=${first.id}`))).status, 404);
    assert.equal((await GET(req(`?id=${first.id}`, undefined, `Bearer ${second.accessToken}`))).status, 404);
    assert.equal((await DELETE(req(`?id=${first.id}`, undefined, `Bearer ${second.accessToken}`, "DELETE"))).status, 404);
    assert.equal((await GET(req(`?id=${first.id}&accessToken=${first.accessToken}`))).status, 404);
    const access = `Bearer ${first.accessToken}`;
    const own = await GET(req(`?id=${first.id}`, undefined, access));
    assert.equal(own.status, 200); const ownBody = await own.json();
    assert.equal(ownBody.personImageDataUrl, photo); assert.equal(ownBody.garmentImageDataUrl, garment); assert.equal(ownBody.resultImageDataUrl, photo); assert(!("visitor" in ownBody));
    const binary = await GET(req(`?id=${first.id}&image=person`, undefined, access));
    assert.equal(binary.headers.get("cache-control"), "no-store"); assert.equal(binary.headers.get("content-type"), "image/png"); assert(Buffer.from(await binary.arrayBuffer()).equals(bytes));
    assert.equal((await GET(req(`?id=${first.id}&image=wrong`, undefined, access))).status, 404);
    assert.equal((await loginSharedResults(req("", { password: "wrong" }))).status, 401);
    const login = await loginSharedResults(req("", { password: process.env.RESULTS_ADMIN_SECRET }));
    assert.equal(login.status, 200); const cookie = login.headers.get("set-cookie")!.split(";")[0];
    assert.match(login.headers.get("set-cookie")!, /Path=\/api(?:;|$)/); assert.match(login.headers.get("set-cookie")!, /HttpOnly/);
    const listing = await GET(req("", undefined, cookie)); assert.equal(listing.status, 200);
    const listed = (await listing.json()).results; assert.equal(listed.length, 2); assert(!JSON.stringify(listed).includes("data:image"), "listing must not embed original photos");
    assert.equal((await GET(req(`?id=${second.id}`, undefined, cookie))).status, 200);
    assert.equal((await GET(req("", undefined, `Bearer ${first.accessToken}`))).status, 401, "visitor access cannot list everyone");
    const beforeRetry = { writes, downloads };
    assert.deepEqual(await POST(req("", payload(first))).then(response => response.json()), saved);
    assert.deepEqual({ writes, downloads }, beforeRetry, "retries must not download, duplicate or extend a saved result");
    assert.equal((await POST(req("", { ...payload(first), personImageDataUrl: garment }))).status, 400, "receipt binds the original person photo");
    assert.equal((await POST(req("", payload(first), undefined, "POST", "https://foreign.test"))).status, 403);
    assert.equal((await DELETE(req(`?id=${first.id}`, undefined, access, "DELETE", "https://foreign.test"))).status, 403);
    assert.equal((await DELETE(req(`?id=${first.id}`, undefined, access, "DELETE"))).status, 200);
    assert.equal((await GET(req(`?id=${first.id}`, undefined, access))).status, 404);
    assert.equal((await POST(req("", payload(first)))).status, 410, "deletion prevents a receipt from restoring saved photos");
    assert.equal(index.size, 1); assert.equal(get(`${SHARED_RESULTS_PREFIX}autosave:${first.id}:summary`), null, "deletion removes the summary atomically with the photos");
    assert.equal((await DELETE(req(`?id=${second.id}`, undefined, cookie, "DELETE"))).status, 200);
    const logout = await logoutSharedResults(req("", undefined, cookie, "DELETE")); assert.match(logout.headers.get("set-cookie")!, /Max-Age=0/); assert.match(logout.headers.get("set-cookie")!, /Path=\/api(?:;|$)/);
    console.log("PASS: automatic private saves, creator login, visitor isolation, metadata-only listing, deletion and idempotent storage retries");

    const uncertain = receipt(); loseReply = true;
    assert.equal((await POST(req("", payload(uncertain)))).status, 503);
    assert.equal((await GET(req(`?id=${uncertain.id}`, undefined, `Bearer ${uncertain.accessToken}`))).status, 200, "pre-issued token recovers a committed record after reply loss");
    const writesAfterLoss = writes, downloadsAfterLoss = downloads;
    assert.equal((await POST(req("", payload(uncertain)))).status, 200); assert.equal(writes, writesAfterLoss); assert.equal(downloads, downloadsAfterLoss);
    failStore = true;
    assert.equal((await GET(req("", undefined, cookie))).status, 503, "storage outage must not masquerade as an empty gallery");
    assert.equal((await POST(req("", payload(receipt())))).status, 503);
    failStore = false;
    imageResponse = () => new Response(bytes, { headers: { "Content-Type": "text/html" } });
    assert.equal((await POST(req("", payload(receipt())))).status, 502);
    imageResponse = () => new Response(bytes, { headers: { "Content-Type": "image/png", "Content-Length": "8000001" } });
    assert.equal((await POST(req("", payload(receipt())))).status, 413);
    imageResponse = () => new Response(bytes, { headers: { "Content-Type": "image/png" } });
    console.log("PASS: commit/reply-loss recovery, visible storage failure and bounded provider result downloads without task submission");

    values.clear(); index.clear();
    const oldest = receipt(); const oldestSaved = await save(oldest); timestamp += 2000;
    for (let count = 1; count < 50; count++) await save(receipt());
    assert.equal(index.size, 50); assert.equal((await POST(req("", payload(receipt())))).status, 409);
    timestamp = oldestSaved.expiresAt * 1000;
    assert.equal((await GET(req(`?id=${oldest.id}`, undefined, `Bearer ${oldest.accessToken}`))).status, 404);
    await save(receipt()); assert.equal(index.size, 50, "expiry clears only the expired record and permits one new save");
    assert.equal((await GET(req("", undefined, cookie))).status, 401, "creator session also expires");
    process.env.MOCK_MODE = "true";
    assert.equal((await POST(req("", { receipt: "synthetic", personImageDataUrl: photo, garmentImageDataUrl: garment }))).status, 400);
    assert.equal(issueSharingReceipt("https://yce-us.s3-accelerate.amazonaws.com/output/synthetic.png", "Mock", { personImageDataUrl: photo, garmentImageDataUrl: garment }), undefined);
    console.log("PASS: 50-record cap, expiry pruning, expired authentication and no persistence in mock mode");
  } finally { globalThis.fetch = originalFetch; Date.now = originalNow; process.env = originalEnv; }
})();
