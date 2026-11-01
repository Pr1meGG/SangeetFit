// Transport-only fixture: provider route tests keep their upload/task counters separate.
export function configureOfflineBudget(): void {
  process.env.UPSTASH_REDIS_REST_URL = "https://offline-budget.upstash.io";
  process.env.UPSTASH_REDIS_REST_TOKEN = "offline-budget-token";
}

export function offlineBudgetResponse(input: unknown, init?: RequestInit): Response | null {
  if (String(input) !== "https://offline-budget.upstash.io/") return null;
  const command = JSON.parse(String(init?.body));
  if (command[0] !== "EVAL" || command[2] !== 2 || command[3] !== "sangeetfit:live-budget:v1" || !/^sangeetfit:visitor:v1:[0-9a-f]{32}$/.test(command[4]) || !["vto", "skin"].includes(command[5])) throw new Error("Invalid budget reservation contract");
  if (init?.cache !== "no-store" || init?.redirect !== "error" || !init.signal) throw new Error("Unsafe budget transport");
  return Response.json({ result: 1 });
}
