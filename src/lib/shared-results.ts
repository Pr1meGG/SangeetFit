import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { budgetCommand, liveBudgetConfigured } from "./live-budget";
import { privateJson, readPhotoJson } from "./request";
import { parseVtoImage, VtoInputError } from "./vto-input";
import { isRecord, parseDataUrl } from "./youcam";

const AUTO_SAVED_INDEX = "sangeetfit:shared-results:v1:autosave:index";
const AUTO_SAVED_MAX_BYTES = 8_000_000;
const autoSavedKey = (id: string) => `${SHARED_RESULTS_PREFIX}autosave:${id}:meta`;
const autoSavedSummaryKey = (id: string) => `${SHARED_RESULTS_PREFIX}autosave:${id}:summary`;

export const STORE_AUTO_SAVED_SCRIPT = `
local existing = redis.call('GET', KEYS[1])
if existing then
  local item = cjson.decode(existing)
  if item.deleted then return -3 end
  if item.visitor ~= ARGV[4] then return -2 end
  return tonumber(item.expiresAt)
end
redis.call('ZREMRANGEBYSCORE', KEYS[2], '-inf', ARGV[2])
if redis.call('ZCARD', KEYS[2]) >= 50 then return -1 end
redis.call('SET', KEYS[1], ARGV[1], 'EX', 86400)
redis.call('SET', KEYS[3], ARGV[6], 'EX', 86400)
redis.call('ZADD', KEYS[2], ARGV[3], ARGV[5])
redis.call('EXPIRE', KEYS[2], 86400)
return tonumber(ARGV[3])
`;
export const DELETE_AUTO_SAVED_SCRIPT = `redis.call('SET', KEYS[1], '{"deleted":true}', 'EX', 3600); redis.call('ZREM', KEYS[2], ARGV[1]); redis.call('DEL', KEYS[3]); return 1`;

type AutoSavedResult = {
  id: string;
  visitor: string;
  outfitLabel: string;
  personImageDataUrl: string;
  garmentImageDataUrl: string;
  resultImageDataUrl: string;
  mode: "live";
  createdAt: number;
  expiresAt: number;
};
type AutoSavedSummary = Pick<AutoSavedResult, "id" | "outfitLabel" | "mode" | "createdAt" | "expiresAt">;
function parseAutoSavedSummary(value: unknown): AutoSavedSummary | null {
  if (typeof value !== "string" || Buffer.byteLength(value) > 1024) return null;
  try {
    const item: unknown = JSON.parse(value);
    if (!isRecord(item) || typeof item.id !== "string" || !UUID.test(item.id) ||
      typeof item.outfitLabel !== "string" || item.outfitLabel.length > 160 || item.mode !== "live" ||
      typeof item.createdAt !== "number" || !Number.isInteger(item.createdAt) ||
      item.expiresAt !== item.createdAt + SHARED_RESULTS_TTL || item.expiresAt <= now()) return null;
    return { id: item.id, outfitLabel: item.outfitLabel, mode: item.mode, createdAt: item.createdAt, expiresAt: item.expiresAt };
  } catch { return null; }
}
function parseAutoSaved(value: unknown): AutoSavedResult | null {
  if (typeof value !== "string" || Buffer.byteLength(value) > AUTO_SAVED_MAX_BYTES) return null;
  try {
    const item: unknown = JSON.parse(value);
    if (!isRecord(item) || typeof item.id !== "string" || !UUID.test(item.id) ||
      typeof item.visitor !== "string" || !/^[a-f0-9]{64}$/.test(item.visitor) ||
      typeof item.outfitLabel !== "string" || item.outfitLabel.length > 160 || item.mode !== "live" ||
      typeof item.createdAt !== "number" || !Number.isInteger(item.createdAt) ||
      item.expiresAt !== item.createdAt + SHARED_RESULTS_TTL || item.expiresAt <= now()) return null;
    for (const key of ["personImageDataUrl", "garmentImageDataUrl", "resultImageDataUrl"]) {
      if (typeof item[key] !== "string" || !parseDataUrl(item[key])) return null;
    }
    return item as AutoSavedResult;
  } catch { return null; }
}
async function readAutoSaved(id: string, signal: AbortSignal): Promise<AutoSavedResult | null> {
  if (!UUID.test(id)) return null;
  const item = parseAutoSaved(await command(["GET", autoSavedKey(id)], signal));
  return item?.id === id ? item : null;
}
const imageHash = (data: string) => createHash("sha256").update(data).digest("hex");

const AUTO_SAVE_MAX_MS = 20_000, AUTO_SAVE_MIN_MS = 3_000, RESPONSE_MARGIN_MS = 5_000;
// Saving must never push a paid, finished try-on past its request deadline; 0 means skip the save.
export function autoSaveTimeoutMs(deadline: number, current = Date.now()): number {
  const available = Math.min(AUTO_SAVE_MAX_MS, deadline - current - RESPONSE_MARGIN_MS);
  return available >= AUTO_SAVE_MIN_MS ? available : 0;
}

export async function autoSaveVtoResult(params: {
  receipt: string;
  personImageDataUrl: string;
  garmentImageDataUrl: string;
}, signal = AbortSignal.timeout(20_000)): Promise<{ id: string; expiresAt: number }> {
  requireStore();
  if (process.env.MOCK_MODE === "true") throw new VtoInputError("Mock previews are not saved.", 400);
  const receipt = verify(params.receipt, "result");
  if (!receipt || typeof receipt.id !== "string" || !UUID.test(receipt.id) ||
    typeof receipt.visitor !== "string" || !UUID.test(receipt.visitor) ||
    !trustedResultUrl(receipt.resultUrl) || typeof receipt.outfitLabel !== "string" ||
    receipt.outfitLabel.length > 160 || typeof receipt.exp !== "number" || receipt.exp > now() + 3600 ||
    typeof params.personImageDataUrl !== "string" || typeof params.garmentImageDataUrl !== "string" ||
    receipt.personHash !== imageHash(params.personImageDataUrl) || receipt.garmentHash !== imageHash(params.garmentImageDataUrl)) {
    throw new VtoInputError("This save request is invalid or has expired.");
  }
  const existing = await readAutoSaved(receipt.id, signal);
  if (existing) return { id: existing.id, expiresAt: existing.expiresAt };
  parseVtoImage(params.personImageDataUrl, "Full-body photo");
  parseVtoImage(params.garmentImageDataUrl, "Garment photo");
  const image = await downloadImage(receipt.resultUrl, signal, AUTO_SAVED_MAX_BYTES);
  const createdAt = now();
  const item: AutoSavedResult = {
    id: receipt.id, visitor: visitorHash(receipt.visitor), outfitLabel: receipt.outfitLabel,
    personImageDataUrl: params.personImageDataUrl, garmentImageDataUrl: params.garmentImageDataUrl,
    resultImageDataUrl: `data:${image.contentType};base64,${image.buffer.toString("base64")}`,
    mode: "live", createdAt, expiresAt: createdAt + SHARED_RESULTS_TTL,
  };
  const serialized = JSON.stringify(item);
  if (Buffer.byteLength(serialized) > AUTO_SAVED_MAX_BYTES) throw new VtoInputError("This look is too large to save. Save the image on your device.", 413);
  const summary: AutoSavedSummary = { id: item.id, outfitLabel: item.outfitLabel, mode: item.mode, createdAt, expiresAt: item.expiresAt };
  const stored = await command(["EVAL", STORE_AUTO_SAVED_SCRIPT, 3, autoSavedKey(item.id), AUTO_SAVED_INDEX, autoSavedSummaryKey(item.id), serialized, createdAt, item.expiresAt, item.visitor, item.id, JSON.stringify(summary)], signal);
  if (stored === -1) throw new VtoInputError("The saved gallery is full. Save the image on your device.", 409);
  if (stored === -2) throw new VtoInputError("This look has already been saved.", 409);
  if (stored === -3) throw new VtoInputError("This saved look was removed.", 410);
  if (typeof stored !== "number" || stored <= createdAt || stored > item.expiresAt) throw new VtoInputError("This look could not be saved.", 503);
  return { id: item.id, expiresAt: stored };
}

export function retryAutoSavedResult(req: Request) {
  return guarded(req, async signal => {
    const body = await readPhotoJson(req, signal);
    if (!isRecord(body) || typeof body.receipt !== "string" || typeof body.personImageDataUrl !== "string" || typeof body.garmentImageDataUrl !== "string") throw new VtoInputError("Invalid save request.");
    return privateJson(await autoSaveVtoResult({ receipt: body.receipt, personImageDataUrl: body.personImageDataUrl, garmentImageDataUrl: body.garmentImageDataUrl }, signal));
  });
}
export function getAutoSavedVtoResult(req: Request, id: string) {
  return guarded(req, async signal => {
    requireStore();
    const item = await readAutoSaved(id, signal);
    if (!item || !canRead(req, item)) throw new VtoInputError("Saved look not found.", 404);
    const image = new URL(req.url).searchParams.get("image");
    if (image) {
      const data = image === "person" ? item.personImageDataUrl : image === "garment" ? item.garmentImageDataUrl : image === "result" ? item.resultImageDataUrl : null;
      const parsed = data ? parseDataUrl(data) : null;
      if (!parsed) throw new VtoInputError("Saved image not found.", 404);
      return new Response(new Uint8Array(parsed.buffer), { headers: { "Content-Type": parsed.contentType, "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
    }
    const { visitor: _visitor, ...result } = item;
    return privateJson(result);
  });
}
export function listAutoSavedVtoResults(req: Request) {
  return guarded(req, async signal => {
    requireStore();
    if (!isAdmin(req)) throw new VtoInputError("Sign in to view saved looks.", 401);
    const ids = await command(["ZRANGEBYSCORE", AUTO_SAVED_INDEX, now() + 1, "+inf", "LIMIT", 0, 50], signal);
    if (!Array.isArray(ids) || !ids.every(id => typeof id === "string" && UUID.test(id))) throw new VtoInputError("Saved looks are unavailable.", 503);
    const rows = ids.length ? await command(["MGET", ...ids.map(autoSavedSummaryKey)], signal) : [];
    if (!Array.isArray(rows)) throw new VtoInputError("Saved looks are unavailable.", 503);
    const results = rows.map(parseAutoSavedSummary).filter((item): item is AutoSavedSummary => item !== null);
    return privateJson({ results });
  });
}
export function deleteAutoSavedResult(req: Request, id: string) {
  return guarded(req, async signal => {
    assertOrigin(req); requireStore();
    const item = await readAutoSaved(id, signal);
    if (!item || !canRead(req, item)) throw new VtoInputError("Saved look not found.", 404);
    await command(["EVAL", DELETE_AUTO_SAVED_SCRIPT, 3, autoSavedKey(id), AUTO_SAVED_INDEX, autoSavedSummaryKey(id), id], signal);
    return privateJson({ deleted: true });
  });
}

export const SHARED_RESULTS_TTL = 86_400;
export const SHARED_RESULTS_PREFIX = "sangeetfit:shared-results:v1:";
export const MAX_SHARED_IMAGE_BYTES = 100_000_000;
const INDEX = `${SHARED_RESULTS_PREFIX}index`;
const ADMIN_COOKIE = "sf_result_admin_v2";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const now = () => Math.floor(Date.now() / 1000);
const metaKey = (id: string) => `${SHARED_RESULTS_PREFIX}${id}:meta`;
const imageKey = (id: string) => `${SHARED_RESULTS_PREFIX}${id}:image`;

// shortcut: capped Redis image storage is for this friends test; use private object storage before wider rollout.
export const STORE_SHARED_RESULT_SCRIPT = `
local existing = redis.call('GET', KEYS[1])
if existing then
  local item = cjson.decode(existing)
  if item.deleted then return -3 end
  if item.visitor ~= ARGV[5] then return -2 end
  return tonumber(item.expiresAt)
end
redis.call('ZREMRANGEBYSCORE', KEYS[3], '-inf', ARGV[3])
if redis.call('ZCARD', KEYS[3]) >= 20 then return -1 end
redis.call('SET', KEYS[1], ARGV[1], 'EX', 86400)
redis.call('SET', KEYS[2], ARGV[2], 'EX', 86400)
redis.call('ZADD', KEYS[3], ARGV[4], ARGV[6])
redis.call('EXPIRE', KEYS[3], 86400)
return tonumber(ARGV[4])
`;
// Keep a marker until every pre-delete receipt has expired, so delayed saves cannot restore bytes.
const DELETE_SCRIPT = `redis.call('SET', KEYS[1], '{"deleted":true}', 'EX', 3600); redis.call('DEL', KEYS[2]); redis.call('ZREM', KEYS[3], ARGV[1]); return 1`;

function secret(): string | undefined {
  const value = process.env.RESULTS_ADMIN_SECRET;
  return value && value.length >= 32 && value.length <= 4096 && !/[\r\n]/.test(value) ? value : undefined;
}
export function sharedResultsConfigured(): boolean { return Boolean(secret()) && liveBudgetConfigured(); }
function sign(payload: Record<string, unknown>): string {
  const key = secret();
  if (!key) throw new VtoInputError("Sharing is unavailable.", 503);
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${createHmac("sha256", key).update(body).digest("base64url")}`;
}
function verify(value: unknown, purpose: string): Record<string, unknown> | null {
  const key = secret();
  if (!key || typeof value !== "string" || value.length > 12_000) return null;
  const parts = value.split(".");
  if (parts.length !== 2 || !/^[A-Za-z0-9_-]+$/.test(parts[0]) || !/^[A-Za-z0-9_-]{43}$/.test(parts[1])) return null;
  const expected = createHmac("sha256", key).update(parts[0]).digest();
  const signature = Buffer.from(parts[1], "base64url");
  if (signature.length !== expected.length || !timingSafeEqual(signature, expected)) return null;
  try {
    const payload: unknown = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
    return isRecord(payload) && payload.purpose === purpose && typeof payload.exp === "number" && payload.exp > now() ? payload : null;
  } catch { return null; }
}
function trustedResultUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 8_000) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "yce-us.s3-accelerate.amazonaws.com" && !url.port && !url.username && !url.password && !url.hash && url.pathname !== "/";
  } catch { return false; }
}
export function issueSharingReceipt(resultUrl: string, outfitLabel: string, images?: { personImageDataUrl: string; garmentImageDataUrl: string }): { id: string; receipt: string; accessToken: string } | undefined {
  if (!sharedResultsConfigured() || process.env.MOCK_MODE === "true" || !trustedResultUrl(resultUrl)) return undefined;
  try {
    const id = randomUUID();
    const visitor = randomUUID();
    return {
      id,
      receipt: sign({ purpose: "result", id, visitor, resultUrl, outfitLabel: outfitLabel.slice(0, 160), ...(images ? { personHash: imageHash(images.personImageDataUrl), garmentHash: imageHash(images.garmentImageDataUrl) } : {}), exp: now() + 3600 }),
      accessToken: sign({ purpose: "result-access", id, visitor, exp: now() + SHARED_RESULTS_TTL }),
    };
  } catch { return undefined; }
}
function cookie(req: Request, name: string): string | undefined {
  return req.headers.get("cookie")?.split(";").map(part => part.trim()).find(part => part.startsWith(`${name}=`))?.slice(name.length + 1);
}
function visitorHash(id: string): string { return createHash("sha256").update(id).digest("hex"); }
function isAdmin(req: Request): boolean { return verify(cookie(req, ADMIN_COOKIE), "admin") !== null; }
function setCookie(response: NextResponse, req: Request, name: string, value: string, maxAge: number) {
  response.cookies.set(name, value, { httpOnly: true, secure: new URL(req.url).protocol === "https:", sameSite: "strict", path: "/api", maxAge });
}
function assertOrigin(req: Request) {
  const origin = req.headers.get("origin");
  const url = new URL(req.url);
  const host = req.headers.get("host");
  if (origin !== null && origin !== (host ? new URL(`${url.protocol}//${host}`).origin : url.origin)) throw new VtoInputError("Request must come from this app.", 403);
}
function requireStore() { if (!sharedResultsConfigured()) throw new VtoInputError("Sharing is unavailable.", 503); }
async function command(args: (string | number)[], signal: AbortSignal): Promise<unknown> {
  try { return await budgetCommand(args, signal); }
  catch { throw new VtoInputError("Sharing is temporarily unavailable. Your generated look is still available.", 503); }
}
type StoredResult = { id: string; visitor: string; outfitLabel: string; createdAt: number; expiresAt: number; contentType: "image/png" | "image/jpeg" };
function parseStored(value: unknown): StoredResult | null {
  if (typeof value !== "string") return null;
  try {
    const item: unknown = JSON.parse(value);
    if (isRecord(item) && typeof item.id === "string" && UUID.test(item.id) && typeof item.visitor === "string" && /^[a-f0-9]{64}$/.test(item.visitor) && typeof item.outfitLabel === "string" && item.outfitLabel.length <= 160 && typeof item.createdAt === "number" && Number.isInteger(item.createdAt) && typeof item.expiresAt === "number" && item.expiresAt === item.createdAt + SHARED_RESULTS_TTL && item.expiresAt > now() && (item.contentType === "image/png" || item.contentType === "image/jpeg")) return item as StoredResult;
  } catch { /* Malformed records are inaccessible. */ }
  return null;
}
async function readStored(id: string, signal: AbortSignal): Promise<StoredResult | null> {
  if (!UUID.test(id)) return null;
  const result = parseStored(await command(["GET", metaKey(id)], signal));
  return result?.id === id ? result : null;
}
function canRead(req: Request, item: Pick<StoredResult, "id" | "visitor">): boolean {
  if (isAdmin(req)) return true;
  const token = req.headers.get("authorization")?.match(/^Bearer (.+)$/i)?.[1];
  const access = verify(token, "result-access");
  return access !== null && access.id === item.id && typeof access.visitor === "string" && UUID.test(access.visitor) && item.visitor === visitorHash(access.visitor);
}
async function downloadImage(url: string, signal: AbortSignal, maxBytes = MAX_SHARED_IMAGE_BYTES) {
  const response = await fetch(url, { signal, cache: "no-store", redirect: "error" });
  const contentType = response.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  if (!response.ok || (contentType !== "image/png" && contentType !== "image/jpeg") || !response.body) throw new VtoInputError("This look could not be shared. You can still save it on your device.", 502);
  const declared = response.headers.get("content-length");
  if (declared && (!/^\d+$/.test(declared) || Number(declared) > maxBytes)) throw new VtoInputError("This look is too large to share. You can still save it on your device.", 413);
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      signal.throwIfAborted();
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) throw new VtoInputError("This look is too large to share. You can still save it on your device.", 413);
      chunks.push(value);
    }
  } finally { await reader.cancel().catch(() => {}); reader.releaseLock(); }
  return parseVtoImage(`data:${contentType};base64,${Buffer.concat(chunks).toString("base64")}`, "Generated look");
}
async function guarded(req: Request, operation: (signal: AbortSignal) => Promise<Response>): Promise<Response> {
  try { return await operation(AbortSignal.any([req.signal, AbortSignal.timeout(25_000)])); }
  catch (error) { return privateJson({ error: error instanceof VtoInputError ? error.message : "Sharing is temporarily unavailable. Your generated look is still available." }, error instanceof VtoInputError ? error.status : 503); }
}
export function createSharedResult(req: Request) {
  return guarded(req, async signal => {
    requireStore();
    if (process.env.MOCK_MODE === "true") throw new VtoInputError("Only live generated looks can be shared.", 400);
    const body = await readPhotoJson(req, signal);
    if (!isRecord(body) || body.consent !== true) throw new VtoInputError("Choose to share this look first.");
    const receipt = verify(body.receipt, "result");
    if (!receipt || typeof receipt.id !== "string" || !UUID.test(receipt.id) || typeof receipt.visitor !== "string" || !UUID.test(receipt.visitor) || !trustedResultUrl(receipt.resultUrl) || typeof receipt.outfitLabel !== "string" || receipt.outfitLabel.length > 160 || typeof receipt.exp !== "number" || receipt.exp > now() + 3600) throw new VtoInputError("This share link has expired. Your generated look is still available.");
    const visitor = receipt.visitor;
    const existing = await readStored(receipt.id, signal);
    if (existing) {
      if (existing.visitor !== visitorHash(visitor)) throw new VtoInputError("This look has already been shared.", 409);
      return privateJson({ id: existing.id, expiresAt: existing.expiresAt });
    }
    const image = await downloadImage(receipt.resultUrl, signal);
    const createdAt = now();
    const item: StoredResult = { id: receipt.id, visitor: visitorHash(visitor), outfitLabel: receipt.outfitLabel, createdAt, expiresAt: createdAt + SHARED_RESULTS_TTL, contentType: image.contentType as StoredResult["contentType"] };
    const stored = await command(["EVAL", STORE_SHARED_RESULT_SCRIPT, 3, metaKey(item.id), imageKey(item.id), INDEX, JSON.stringify(item), image.buffer.toString("base64"), createdAt, item.expiresAt, item.visitor, item.id], signal);
    if (stored === -1) throw new VtoInputError("The shared gallery is full. You can still save this look on your device.", 409);
    if (stored === -2) throw new VtoInputError("This look has already been shared.", 409);
    if (stored === -3) throw new VtoInputError("This shared look was removed.", 410);
    if (typeof stored !== "number" || stored <= createdAt || stored > item.expiresAt) throw new VtoInputError("This look could not be shared.", 503);
    return privateJson({ id: item.id, expiresAt: stored });
  });
}
export function listSharedResults(req: Request) {
  return guarded(req, async signal => {
    requireStore();
    if (!isAdmin(req)) throw new VtoInputError("Sign in to view shared looks.", 401);
    const ids = await command(["ZRANGEBYSCORE", INDEX, now() + 1, "+inf", "LIMIT", 0, 20], signal);
    if (!Array.isArray(ids) || !ids.every(id => typeof id === "string" && UUID.test(id))) throw new VtoInputError("Shared looks are unavailable.", 503);
    const rows = ids.length ? await command(["MGET", ...ids.map(metaKey)], signal) : [];
    if (!Array.isArray(rows)) throw new VtoInputError("Shared looks are unavailable.", 503);
    const results = rows.map(parseStored).filter((item): item is StoredResult => item !== null).map(({ id, outfitLabel, createdAt, expiresAt }) => ({ id, outfitLabel, createdAt, expiresAt, imageUrl: `/api/shared-results/${id}?image=1` }));
    return privateJson({ results });
  });
}
export function getSharedResult(req: Request, id: string) {
  return guarded(req, async signal => {
    requireStore();
    const item = await readStored(id, signal);
    if (!item || !canRead(req, item)) throw new VtoInputError("Shared look not found.", 404);
    if (new URL(req.url).searchParams.get("image") !== "1") return privateJson({ id, outfitLabel: item.outfitLabel, expiresAt: item.expiresAt });
    const image = await command(["GET", imageKey(id)], signal);
    if (typeof image !== "string" || image.length > Math.ceil(MAX_SHARED_IMAGE_BYTES / 3) * 4 || !/^[A-Za-z0-9+/]+={0,2}$/.test(image) || item.expiresAt <= now()) throw new VtoInputError("Shared look not found.", 404);
    return new Response(Buffer.from(image, "base64"), { headers: { "Content-Type": item.contentType, "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", "Content-Disposition": "inline" } });
  });
}
export function deleteSharedResult(req: Request, id: string) {
  return guarded(req, async signal => {
    assertOrigin(req); requireStore();
    const item = await readStored(id, signal);
    if (!item || !canRead(req, item)) throw new VtoInputError("Shared look not found.", 404);
    await command(["EVAL", DELETE_SCRIPT, 3, metaKey(id), imageKey(id), INDEX, id], signal);
    return privateJson({ deleted: true });
  });
}
export function loginSharedResults(req: Request) {
  return guarded(req, async signal => {
    requireStore();
    const body = await readPhotoJson(req, signal);
    const password = isRecord(body) && typeof body.password === "string" && body.password.length <= 4096 ? body.password : "";
    const supplied = createHash("sha256").update(password).digest();
    const expected = createHash("sha256").update(secret()!).digest();
    if (!timingSafeEqual(supplied, expected)) throw new VtoInputError("Incorrect password.", 401);
    const response = privateJson({ authenticated: true });
    setCookie(response, req, ADMIN_COOKIE, sign({ purpose: "admin", exp: now() + 3600 }), 3600);
    return response;
  });
}
export function logoutSharedResults(req: Request) {
  return guarded(req, async () => {
    assertOrigin(req);
    const response = privateJson({ authenticated: false });
    setCookie(response, req, ADMIN_COOKIE, "", 0);
    return response;
  });
}
