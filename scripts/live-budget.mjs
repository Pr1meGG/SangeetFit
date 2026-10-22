// Operator-only: run with `node --import tsx scripts/live-budget.mjs ...`.
import { budgetCommand, INITIALIZE_BUDGET_SCRIPT, LIVE_BUDGET_KEY } from "../src/lib/live-budget.ts";

const usage = "Usage: live-budget.mjs status | init <allowance-units> <vto-units> <skin-units>";
const [operation, ...args] = process.argv.slice(2);
function hundredths(value) {
  if (!/^(0|[1-9]\d{0,7})(\.\d{1,2})?$/.test(value || "")) throw new Error("Use positive unit values with at most two decimal places.");
  const [whole, fraction = ""] = value.split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  if (cents <= 0 || cents > 1_000_000_000) throw new Error("Use positive unit values up to 10000000.");
  return cents;
}

try {
  if (operation === "init" && args.length === 3) {
    const values = args.map(hundredths);
    const result = await budgetCommand(["EVAL", INITIALIZE_BUDGET_SCRIPT, 1, LIVE_BUDGET_KEY, ...values], AbortSignal.timeout(10_000));
    if (result !== 1) throw new Error("Budget already exists or could not be initialized; nothing was overwritten.");
    console.log("Budget initialized. This does not deploy the app or submit a YouCam task.");
  } else if (operation === "status" && args.length === 0) {
    const result = await budgetCommand(["HMGET", LIVE_BUDGET_KEY, "limit", "used", "vto", "skin"], AbortSignal.timeout(10_000));
    const ttl = await budgetCommand(["TTL", LIVE_BUDGET_KEY], AbortSignal.timeout(10_000));
    if (ttl !== -1 || !Array.isArray(result) || result.length !== 4 || result.some(value => typeof value !== "string" || !/^\d+$/.test(value) || Number(value) > 1_000_000_000)) throw new Error("Budget is missing, invalid or expiring.");
    const [limit, used, vto, skin] = result.map(Number);
    if (vto <= 0 || skin <= 0 || used > limit) throw new Error("Budget state is invalid.");
    console.log(JSON.stringify({ allowanceUnits: limit / 100, reservedUnits: used / 100, remainingUnits: (limit - used) / 100, vtoUnits: vto / 100, skinUnits: skin / 100 }));
  } else throw new Error(usage);
} catch (error) {
  console.error(error instanceof Error ? error.message : "Budget operation failed.");
  process.exitCode = 1;
}
