/** Offline evidence only: this module never submits tasks or reads image data. */
export type BenchmarkCase = { caseId: string; participantId: string; sourceVersion: string; kind: "upload" | "catalogue" };
export type BenchmarkRecord = BenchmarkCase & {
  mode: "live" | "mock";
  status: "success" | "failed";
  rendered: boolean;
  identityRating: number | null;
  garmentRating: number | null;
  durationMs: number | null;
  taskSubmissions: number;
};
export type BenchmarkEvidence = {
  plannedCases: BenchmarkCase[];
  records: BenchmarkRecord[];
  budget?: { availableUnits?: number | null; vtoUnitCost?: number | null; skinUnitCost?: number | null; approved?: boolean };
};

export const MEN_VTO_CASE_IDS = [
  "concept-emerald-kurta",
  "concept-sapphire-sherwani",
  "concept-oxblood-bandhgala",
  "concept-mint-kurta",
  "concept-saffron-kurta",
  "concept-marigold-jacket-set",
  "concept-sage-embroidered-kurta",
  "concept-ivory-gold-kurta",
  "concept-cream-embroidered-bandhgala",
  "concept-navy-velvet-bandhgala",
  "concept-plum-brocade-sherwani",
  "concept-antique-gold-sherwani",
  "concept-charcoal-bandhgala",
  "library-gold-silk-kurta",
  "library-ivory-nehru-ensemble",
  "library-ivory-button-kurta",
] as const;

function object(value: unknown, allowed: string[], context: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${context} must be an object`);
  const result = value as Record<string, unknown>;
  if (Object.keys(result).some((key) => !allowed.includes(key))) throw new Error(`${context} has unsupported fields; do not store photos, URLs, or personal details`);
  return result;
}

function benchmarkCase(value: unknown, record: boolean): BenchmarkCase {
  const item = object(value, ["caseId", "participantId", "sourceVersion", "kind", ...(record ? ["mode", "status", "rendered", "identityRating", "garmentRating", "durationMs", "taskSubmissions"] : [])], "Case");
  for (const key of ["caseId", "participantId", "sourceVersion"]) {
    if (typeof item[key] !== "string" || !/^[a-z][a-z0-9_-]{0,63}$/.test(item[key] as string)) throw new Error(`${key} must be a short pseudonymous ID`);
  }
  if (item.kind !== "upload" && item.kind !== "catalogue") throw new Error("Case kind must be upload or catalogue");
  return item as BenchmarkCase;
}

export function parseBenchmarkEvidence(value: unknown): BenchmarkEvidence {
  const root = object(value, ["plannedCases", "records", "budget"], "Evidence");
  if (!Array.isArray(root.plannedCases) || !Array.isArray(root.records)) throw new Error("Evidence needs plannedCases and records arrays");
  const plannedCases = root.plannedCases.map((item) => benchmarkCase(item, false));
  const cases = new Map(plannedCases.map((item) => [item.caseId, item]));
  if (cases.size !== plannedCases.length) throw new Error("Planned case IDs must be unique");
  const seen = new Set<string>();
  const records = root.records.map((value) => {
    const item = benchmarkCase(value, true) as BenchmarkRecord;
    const planned = cases.get(item.caseId);
    if (!planned || planned.participantId !== item.participantId || planned.sourceVersion !== item.sourceVersion || planned.kind !== item.kind) throw new Error(`Record ${item.caseId} does not match a predeclared case`);
    if (seen.has(item.caseId)) throw new Error(`Duplicate outcome for ${item.caseId}; preserve its first outcome and count retries in taskSubmissions`);
    seen.add(item.caseId);
    if (item.mode !== "live" && item.mode !== "mock") throw new Error(`Record ${item.caseId} needs an explicit live/mock mode`);
    if (item.status !== "success" && item.status !== "failed") throw new Error(`Invalid status for ${item.caseId}`);
    if (typeof item.rendered !== "boolean") throw new Error(`Missing rendered boolean for ${item.caseId}`);
    if (item.status === "failed" && item.rendered) throw new Error(`Failed case ${item.caseId} cannot have a rendered result`);
    for (const key of ["identityRating", "garmentRating"] as const) {
      const rating = item[key];
      if (rating !== null && (!Number.isInteger(rating) || rating < 1 || rating > 5)) throw new Error(`${key} must be 1–5 or null`);
      if (rating !== null && (item.mode !== "live" || !item.rendered || item.status !== "success")) throw new Error(`Cannot rate a non-live or unavailable image in ${item.caseId}`);
    }
    if (item.durationMs !== null && (typeof item.durationMs !== "number" || !Number.isFinite(item.durationMs) || item.durationMs < 0)) throw new Error("durationMs must be a finite nonnegative number or null");
    if (!Number.isInteger(item.taskSubmissions) || item.taskSubmissions < 0 || (item.status === "success" && item.taskSubmissions === 0)) throw new Error("taskSubmissions must count actual submissions (success requires at least one)");
    return item;
  });
  let budget: BenchmarkEvidence["budget"];
  if (root.budget !== undefined) {
    const raw = object(root.budget, ["availableUnits", "vtoUnitCost", "skinUnitCost", "approved"], "Budget");
    for (const key of ["availableUnits", "vtoUnitCost", "skinUnitCost"]) {
      const amount = raw[key];
      if (amount !== undefined && amount !== null && (typeof amount !== "number" || !Number.isFinite(amount) || (key === "availableUnits" ? amount < 0 : amount <= 0))) throw new Error(`Invalid ${key}; use verified numbers or null`);
    }
    if (raw.approved !== undefined && typeof raw.approved !== "boolean") throw new Error("Budget approved must be boolean");
    budget = { ...raw, approved: raw.approved === true } as BenchmarkEvidence["budget"];
  }
  return { plannedCases, records, ...(budget ? { budget } : {}) };
}

export function scoreBenchmarkEvidence(input: unknown) {
  const evidence = parseBenchmarkEvidence(input);
  const { plannedCases, records } = evidence;
  const total = plannedCases.length;
  const complete = total > 0 && records.length === total;
  const technical = records.filter((item) => item.mode === "live" && item.status === "success" && item.rendered);
  const identity = technical.filter((item) => (item.identityRating ?? 0) >= 4);
  const garment = technical.filter((item) => (item.garmentRating ?? 0) >= 4);
  const both = technical.filter((item) => (item.identityRating ?? 0) >= 4 && (item.garmentRating ?? 0) >= 4);
  const durations = technical.flatMap((item) => item.durationMs === null ? [] : [item.durationMs]).sort((a, b) => a - b);
  const median = durations.length ? (durations[Math.floor((durations.length - 1) / 2)] + durations[Math.floor(durations.length / 2)]) / 2 : null;
  const duplicates = records.reduce((sum, item) => sum + Math.max(0, item.taskSubmissions - 1), 0);
  const metric = (passed: number, ready: boolean, target: number) => ({
    passed, denominator: total, rate: records.length && total ? passed / total : null,
    target, gate: ready ? passed / total >= target : null,
  });
  const uploads = plannedCases.filter((item) => item.kind === "upload").length;
  const catalogue = plannedCases.filter((item) => item.kind === "catalogue").length;
  const casesPerPerson = new Map<string, number>();
  plannedCases.forEach((item) => casesPerPerson.set(item.participantId, (casesPerPerson.get(item.participantId) ?? 0) + 1));
  const people = casesPerPerson.size;
  const expected = new Set<string>(MEN_VTO_CASE_IDS);
  const composition = total === expected.size && people === 1 && new Set(plannedCases.map((item) => item.sourceVersion)).size === 1 && uploads === 0 && catalogue === expected.size && plannedCases.every((item) => expected.has(item.caseId));
  const pilot = records.filter((item) => item.caseId === MEN_VTO_CASE_IDS[0] || item.caseId === MEN_VTO_CASE_IDS[1]);
  const pilotGate = pilot.some((item) => item.mode !== "live" || item.status !== "success" || !item.rendered || (item.identityRating !== null && item.identityRating < 4) || (item.garmentRating !== null && item.garmentRating < 4)) ? false
    : pilot.length === 2 && pilot.every((item) => item.identityRating !== null && item.garmentRating !== null) ? true : null;
  const metrics = {
    liveMode: metric(records.filter(item => item.mode === "live").length, complete, 1),
    taskCoverage: metric(records.filter(item => item.taskSubmissions >= 1).length, complete, 1),
    pilot: { passed: pilot.filter((item) => item.mode === "live" && item.status === "success" && item.rendered && (item.identityRating ?? 0) >= 4 && (item.garmentRating ?? 0) >= 4).length, target: 2, gate: pilotGate },
    technical: metric(technical.length, complete, 0.9),
    identity: metric(identity.length, complete && technical.every((item) => item.identityRating !== null), 0.9),
    garment: metric(garment.length, complete && technical.every((item) => item.garmentRating !== null), 0.8),
    both: metric(both.length, complete && technical.every((item) => item.identityRating !== null && item.garmentRating !== null), 0.8),
    latency: { medianMs: median, rangeMs: durations.length ? [durations[0], durations[durations.length - 1]] : null, targetMs: 60_000, gate: complete && technical.length > 0 && durations.length === technical.length ? median! <= 60_000 : null },
    duplicates: { count: duplicates, target: 0, gate: duplicates ? false : complete ? true : null },
  };
  const gates = [composition, ...Object.values(metrics).map((metric) => metric.gate)];
  const budget = evidence.budget;
  const available = budget?.availableUnits;
  const vtoCost = budget?.vtoUnitCost;
  const skinCost = budget?.skinUnitCost;
  const knownBudget = typeof available === "number" && typeof vtoCost === "number" && typeof skinCost === "number";
  const developmentUnits = knownBudget ? available * 0.75 : null;
  const affordableVto = knownBudget ? Math.min(40, Math.floor(developmentUnits! / vtoCost)) : null;
  const affordableSkin = knownBudget ? Math.max(0, Math.min(5, Math.floor((developmentUnits! - affordableVto! * vtoCost) / skinCost))) : null;
  return {
    status: records.length === 0 ? "pending" : gates.some((gate) => gate === false) ? "fail" : gates.every((gate) => gate === true) ? "pass" : "pending",
    planned: { total, participants: people, uploads, catalogue, gate: composition },
    recorded: records.length,
    missingCaseIds: plannedCases.filter((item) => !records.some((record) => record.caseId === item.caseId)).map((item) => item.caseId),
    metrics,
    budget: {
      approved: budget?.approved === true,
      status: knownBudget ? "calculated" : "pending",
      reserveUnits: knownBudget ? available * 0.25 : null,
      developmentUnits,
      plannedVtoUnits: knownBudget ? total * vtoCost : null,
      plannedVtoFits: knownBudget ? total * vtoCost <= developmentUnits! : null,
      ceilings: { vto: 40, skin: 5 },
      fullCeilingFits: knownBudget ? 40 * vtoCost + 5 * skinCost <= developmentUnits! : null,
      affordableCaps: { vto: affordableVto, skin: affordableSkin },
    },
  };
}
