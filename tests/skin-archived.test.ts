// Active tombstone: old clients cannot read photos, reserve allowance or contact providers.
import { strict as assert } from "node:assert";

void (async () => {
  const originalFetch = globalThis.fetch;
  const originalMode = process.env.MOCK_MODE;
  let calls = 0;
  globalThis.fetch = (async () => { calls++; throw new Error("archived skin endpoint must not fetch"); }) as typeof fetch;
  try {
    const { POST } = await import("../src/app/api/skin/route.ts");
    const retired = POST as (request: Request) => Response | Promise<Response>;
    for (const mode of ["true", "false"]) {
      process.env.MOCK_MODE = mode;
      for (const [body, headers] of [
        [JSON.stringify({ imageDataUrl: "data:image/png;base64,private-photo" }), { "Content-Type": "application/json" }],
        ["{invalid JSON", { "Content-Type": "application/json" }],
        ["private photo", { "Content-Type": "text/plain", Origin: "https://foreign.example" }],
      ] as const) {
        const request = new Request("http://localhost/api/skin", { method: "POST", headers, body });
        const response = await retired(request);
        assert.equal(response.status, 410, "skin remains archived in both mock and live modes");
        assert.equal(response.headers.get("cache-control"), "no-store");
        assert.match((await response.json()).error, /archiv/i);
        assert.equal(request.bodyUsed, false, "retirement must not read a submitted photo or malformed body");
      }
      let pulls = 0;
      const body = new ReadableStream<Uint8Array>({ pull() { pulls++; throw new Error("must not read"); } }, { highWaterMark: 0 });
      const request = new Request("http://localhost/api/skin", { method: "POST", body, duplex: "half" } as RequestInit);
      assert.equal((await retired(request)).status, 410);
      assert.equal(request.bodyUsed, false);
      assert.equal(pulls, 0, "streaming photos must remain unread");
    }
    assert.equal(calls, 0, "archived endpoint must not reserve budget, upload or generate");
    console.log("PASS: active skin endpoint returns private 410 for valid, malformed and streaming bodies without reads or network calls");
  } finally {
    globalThis.fetch = originalFetch;
    if (originalMode === undefined) delete process.env.MOCK_MODE;
    else process.env.MOCK_MODE = originalMode;
  }
})().catch(error => { console.error(error); process.exit(1); });
