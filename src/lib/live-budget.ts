import { createHash } from "node:crypto";
import { isRecord } from "./youcam";

export const LIVE_BUDGET_KEY = "sangeetfit:live-budget:v1";
export const VISITOR_KEY_PREFIX = "sangeetfit:visitor:v1:";
const VISITOR_DAILY_LIMIT = 3;
const VISITOR_WINDOW_SECONDS = 86_400;

// Integer hundredths avoid floating-point accounting. Missing state never resets the allowance.
// KEYS[2] caps live tasks per visitor; it is counted only when the shared allowance is actually spent.
export const RESERVE_BUDGET_SCRIPT = `
if redis.call('TTL', KEYS[1]) ~= -1 then return -1 end
local values = redis.call('HMGET', KEYS[1], 'limit', 'used', 'vto', 'skin')
for i = 1, 4 do
  if not values[i] or not string.match(values[i], '^%d+$') then return -1 end
  values[i] = tonumber(values[i])
  if values[i] > 1000000000 then return -1 end
end
if values[3] <= 0 or values[4] <= 0 then return -1 end
local cost
if ARGV[1] == 'vto' then cost = values[3]
elseif ARGV[1] == 'skin' then cost = values[4]
else return -1 end
if values[2] > values[1] or cost > values[1] - values[2] then return 0 end
if tonumber(redis.call('GET', KEYS[2]) or '0') >= tonumber(ARGV[2]) then return 2 end
redis.call('HINCRBY', KEYS[1], 'used', cost)
if redis.call('INCR', KEYS[2]) == 1 then redis.call('EXPIRE', KEYS[2], ARGV[3]) end
return 1
`;

export const INITIALIZE_BUDGET_SCRIPT = `
if redis.call('EXISTS', KEYS[1]) ~= 0 then return 0 end
redis.call('HSET', KEYS[1], 'limit', ARGV[1], 'used', '0', 'vto', ARGV[2], 'skin', ARGV[3])
return 1
`;

function configuration(): { url: string; token: string } | null {
  try {
    const explicitUpstash = process.env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_TOKEN;
    const url = new URL((explicitUpstash ? process.env.UPSTASH_REDIS_REST_URL : process.env.KV_REST_API_URL) || "");
    const token = (explicitUpstash ? process.env.UPSTASH_REDIS_REST_TOKEN : process.env.KV_REST_API_TOKEN) || "";
    if (url.protocol !== "https:" || !url.hostname.endsWith(".upstash.io") || url.port || url.username || url.password || url.pathname !== "/" || url.search || url.hash || !token || token.length > 4096 || /[\r\n]/.test(token)) return null;
    return { url: url.href, token };
  } catch { return null; }
}

export function liveBudgetConfigured(): boolean { return configuration() !== null; }

export class LiveBudgetError extends Error {
  constructor(message: string, readonly status: 429 | 503 = 503) { super(message); }
}

// Vercel overwrites these headers with the real client address; only a hash is stored.
// ponytail: per-address cap only; someone rotating addresses (e.g. an IPv6 range) can still drain the shared allowance — add bot protection if that happens.
export function visitorKey(headers: Headers): string {
  const forwarded = headers.get("x-vercel-forwarded-for") || headers.get("x-forwarded-for") || headers.get("x-real-ip") || "";
  const address = forwarded.split(",")[0].trim() || "unknown";
  return VISITOR_KEY_PREFIX + createHash("sha256").update(address).digest("hex").slice(0, 32);
}

export async function budgetCommand(command: (string | number)[], signal: AbortSignal): Promise<unknown> {
  const config = configuration();
  if (!config) throw new LiveBudgetError("Live generation budget is not configured.");
  try {
    signal.throwIfAborted();
    const response = await fetch(config.url, {
      method: "POST", headers: { Authorization: `Bearer ${config.token}`, "Content-Type": "application/json" },
      body: JSON.stringify(command), signal: AbortSignal.any([signal, AbortSignal.timeout(5_000)]), cache: "no-store", redirect: "error",
    });
    if (!response.ok) throw new Error("Budget store unavailable");
    const body: unknown = await response.json();
    if (!isRecord(body) || "error" in body || !("result" in body)) throw new Error("Invalid budget response");
    return body.result;
  } catch {
    throw new LiveBudgetError("Live generation budget could not be checked. No photo was uploaded or task started.");
  }
}

export async function reserveLiveBudget(operation: "vto" | "skin", signal: AbortSignal, visitor: string): Promise<void> {
  const result = await budgetCommand(["EVAL", RESERVE_BUDGET_SCRIPT, 2, LIVE_BUDGET_KEY, visitor, operation, VISITOR_DAILY_LIMIT, VISITOR_WINDOW_SECONDS], signal);
  if (result === 0) throw new LiveBudgetError("Live generation allowance is exhausted. Browsing and saved results remain available.");
  if (result === 2) throw new LiveBudgetError(`You've used today's ${VISITOR_DAILY_LIMIT} live try-ons on this connection, so the shared allowance stays available for others. Planning, browsing and saved results still work.`, 429);
  if (result !== 1) throw new LiveBudgetError("Live generation budget is unavailable. No photo was uploaded or task started.");
  // shortcut: failed/uncertain attempts retain reservations; reconcile manually before increasing the allowance.
}
