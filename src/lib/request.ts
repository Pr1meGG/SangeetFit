import { NextResponse } from "next/server";
import { MAX_VTO_REQUEST_BYTES, VtoInputError } from "./vto-input";

export function privateJson(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function readPhotoJson(req: Request, signal: AbortSignal): Promise<unknown> {
  signal.throwIfAborted();
  const declared = req.headers.get("content-length");
  if (declared && /^\d+$/.test(declared) && Number(declared) >= MAX_VTO_REQUEST_BYTES) {
    throw new VtoInputError("Photo request must be under 4 MB", 413);
  }
  if (!req.body) throw new VtoInputError("Photo request must contain valid JSON");
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  const cancel = () => { void reader.cancel().catch(() => {}); };
  signal.addEventListener("abort", cancel, { once: true });
  try {
    while (true) {
      signal.throwIfAborted();
      const { done, value } = await reader.read();
      signal.throwIfAborted();
      if (done) break;
      size += value.byteLength;
      if (size >= MAX_VTO_REQUEST_BYTES) {
        cancel();
        throw new VtoInputError("Photo request must be under 4 MB", 413);
      }
      chunks.push(value);
    }
    try { return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks))); }
    catch { throw new VtoInputError("Photo request must contain valid JSON"); }
  } finally {
    signal.removeEventListener("abort", cancel);
    reader.releaseLock();
  }
}
