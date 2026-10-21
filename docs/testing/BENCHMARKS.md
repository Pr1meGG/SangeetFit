# Offline benchmark evidence

Targets are acceptance goals, not achieved results. The checked-in `benchmark-records.json` contains twelve proposed cases and **no test outcomes**. `p01`–`p05` are reserved pseudonyms, not evidence of recruited participants or consent. Fix exact photos and garment references before testing; consent happens separately. Do not put participant names, photos, URLs, credentials, or medical information in this file.

## Run without provider requests

Use Node22+ (or the bundled Node) to execute:

```sh
node --experimental-strip-types scripts/benchmark-report.ts
node --experimental-strip-types scripts/benchmark-report.ts docs/testing/benchmark-records.json --check
node --experimental-strip-types tests/benchmarks.test.ts
```

Default execution reports evidence and exits0 for a valid pending/failing report. `--check` exits1 unless every quality gate passes. Invalid JSON, unexpected fields, invalid ratings or unmatched cases exit1. No command calls YouCam, reads `.env.local`, or spends units.

## Record one outcome per predeclared case

Before an explicitly approved live batch, fix the case list: at least 12 cases across five consenting people, with eight owned-garment uploads and four permitted references; each person tries at least two looks. The first six cases form a separately approved pilot: `p01` and `p02` each try one owned upper-body garment, one owned full outfit and one permitted reference. Those six outcomes stay in the final denominator. Record a failed attempt even when generation or display fails. Never remove a failed case or replace its outcome with a successful retry. Count additional task submissions on its original record; a retry automatically fails the zero-duplicates gate. A new diagnostic batch needs a separate predeclared evidence file; it must not silently replace the reported original batch.

Record shape:

```json
{
  "caseId": "upload-01",
  "participantId": "p01",
  "kind": "upload",
  "mode": "live",
  "status": "failed",
  "rendered": false,
  "identityRating": null,
  "garmentRating": null,
  "durationMs": null,
  "taskSubmissions": 1
}
```

This is a schema example, not a recorded attempt. `status` means task success/failure; successful tasks whose result will not render have `rendered:false`. Rate the identity yourself (participant) and garment fidelity against the reference. Use 5 for clear preservation, 4 for minor non-distracting differences, 3 or below for changes affecting trust. Ratings without a rendered successful result are invalid. Duration is milliseconds from explicit Generate to displayed result; keep unknown durations null. Failed attempts have no image ratings.

All planned cases stay in the denominator. Every outcome must record the actual live/mock mode; mock references cannot be identity/garment-rated or pass the live-quality gate. Unrecorded cases and missing successful-image ratings/durations keep affected gates pending. No evidence yields null rates, never a pass. One output per case is scored; multiple submissions are still disclosed. The report includes median and observed range for successfully displayed live results; retain timeout/failure observations separately.

## Release targets

| Metric | Gate |
|---|---|
| Task success plus rendered image | ≥11/12 planned cases |
| Identity rating ≥4 | ≥11/12 planned cases |
| Garment rating ≥4 | ≥10/12 planned cases |
| Both ratings ≥4 | ≥10/12 planned cases |
| Median successful displayed-result latency | ≤60,000ms |
| Additional task submissions | 0 |

Small-sample gates do not establish production reliability or guaranteed identity preservation. Report failures and the actual sample, not only percentages. The fixed schema does not establish immutable history: retain the original batch file and review changes rather than editing inconvenient outcomes away.

## Budget is a feasibility calculation

Enter `availableUnits`, `vtoUnitCost`, and `skinUnitCost` only after checking the actual account and current applicable pricing. Unknown values stay null. The report reserves 25%, caps development at 40 VTO and 5 optional skin tasks, and calculates an affordable mix prioritizing VTO before optional skin. `fullCeilingFits` says whether the full 40+5 fits; it does not authorize any spend. Insufficient units reduce the caps. `approved` defaults false; even a true value is merely recorded metadata and never submits tasks. Every actual batch still needs specific approval. Stop on 429; no blind retries.

**Read-only snapshot, 21 October 2026:** the signed-in [YouCam dashboard](https://yce.perfectcorp.com/api-console/en/) displayed **916 units**. The official [unit calculator](https://yce.perfectcorp.com/ai-api/unit-calculator), with **AI Clothes Virtual Try-On V4.0** selected, displayed **2 units/call** with no cost-changing parameters. **AI Facial Color Tones Analyzer V1.0** displayed **20 units/call**; this corresponds to the app's optional `skin-tone-analysis` feature. No API task, top-up or account setting change was made.

Reserve: **229 units**; development allowance: **687 units**. The six-case pilot needs **12 units**, and all twelve planned VTO cases need **24 units**. `plannedVtoUnits` and `plannedVtoFits` report this calculation; the development ceiling of 40 VTO +5 optional skin tasks would cost 180 units. Recheck balance and pricing before any approved batch because other account use can change them. `approved` remains false.

This snapshot belongs to the active signed-in console project. API-key-to-project mapping and actual task deductions were not inspected; confirm the intended project before spending.

## Separate five-person usability protocol

Recruit five consenting participants. With photos ready, observe whether each person independently chooses a celebration occasion, understands a recommendation reason, generates and compares two looks, then saves a choice. The two pilot participants can contribute their first two looks; their third pilot case remains in the quality denominator. Record time to first Generate (target median≤60s), independent completion (target 4/5), reason understanding/preference choice (target 4/5), navigation failures and device/browser used in a separate pseudonymous note. These observations are not fabricated from the VTO scoring data. Actual Android Chrome and iPhone Safari checks are required before claiming both tested.
