import { isRecord } from "./youcam";

export const LIVE_BUDGET_KEY = "sangeetfit:live-budget:v1";

// Integer hundredths avoid floating-point accounting. Missing state never resets the allowance.
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
redis.call('HINCRBY', KEYS[1], 'used', cost)
return 1
`;

export const INITIALIZE_BUDGET_SCRIPT = `
if redis.call('EXISTS', KEYS[1]) ~= 0 then return 0 end
redis.call('HSET', KEYS[1], 'limit', ARGV[1], 'used', '0', 'vto', ARGV[2], 'skin', ARGV[3])
return 1
`;

function configuration(): { url: string; token: string } | null {
  try {
    const url = new URL(process.env.UPSTASH_REDIS_REST_URL || "");
    const token = process.env.UPSTASH_REDIS_REST_TOKEN || "";
    if (url.protocol !== "https:" || !url.hostname.endsWith(".upstash.io") || url.port || url.username || url.password || url.pathname !== "/" || url.search || url.hash || !token || token.length > 4096 || /[\r\n]/.test(token)) return null;
    return { url: url.href, token };
  } catch { return null; }
}

export function liveBudgetConfigured(): boolean { return configuration() !== null; }

export class LiveBudgetError extends Error {
  readonly status = 503;
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

export async function reserveLiveBudget(operation: "vto" | "skin", signal: AbortSignal): Promise<void> {
  const result = await budgetCommand(["EVAL", RESERVE_BUDGET_SCRIPT, 1, LIVE_BUDGET_KEY, operation], signal);
  if (result === 0) throw new LiveBudgetError("Live generation allowance is exhausted. Browsing and saved results remain available.");
  if (result !== 1) throw new LiveBudgetError("Live generation budget is unavailable. No photo was uploaded or task started.");
  // shortcut: failed/uncertain attempts retain reservations; reconcile manually before increasing the allowance.
}
