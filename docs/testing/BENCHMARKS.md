# Offline VTO engineering benchmark

Targets are acceptance goals, not achieved results. The checked-in [benchmark-records.json](benchmark-records.json) predeclares **16 distinct men's catalogue looks on one person** and now contains **two live pilot outcomes**. `p01` is a pseudonym for the consenting pilot tester. Both images rendered; the participant rated face and garment fidelity 5/5 for each. Displayed-result timings remain unknown. This sweep tests candidate reference behaviour for one source image; it does not validate uploaded own clothes, independent usability or reliability across people. Never store names, photos, signed result URLs, credentials or medical information in evidence.

## Run without provider requests

Use Node 22+:

```sh
node --experimental-strip-types scripts/benchmark-report.ts
node --experimental-strip-types scripts/benchmark-report.ts docs/testing/benchmark-records.json --check
node --experimental-strip-types tests/benchmarks.test.ts
```

Normal reporting exits 0 for valid pending or failing evidence. `--check` exits 1 until all engineering gates pass. Invalid JSON, unexpected fields, invalid ratings or unmatched cases exit 1. These commands never call YouCam or read `.env.local`.

## Record one outcome per predeclared look

The 16 `caseId` values in the fixture are exact server-owned outfit IDs. The first two are `concept-emerald-kurta` and `concept-sapphire-sherwani`. Preflight the full-body photo and exact references, then obtain separate approval for the two-task pilot. Continue with at most 14 remaining cases only after the pilot meets [the review gate](REAL_USER_VALIDATION.md) and a new bounded approval is given. Every task attempt, including a failure, remains in the denominator. Do not replace a failed outcome with a successful retry; count any extra submissions and disclose them.

Set the same non-sensitive `sourceVersion` token on every planned case and its outcome. `photo-v1` is a placeholder until the actual photo is selected; it is neither a filename nor an image hash. The scorer checks the declared token and requires both pilot looks to render with identity and garment ratings ≥4 before the full sweep can pass. The tester must still verify that the token really refers to the same photo.

Record shape (example only, not an observed result):

```json
{
  "caseId": "concept-emerald-kurta",
  "participantId": "p01",
  "sourceVersion": "photo-v1",
  "kind": "catalogue",
  "mode": "live",
  "status": "failed",
  "rendered": false,
  "identityRating": null,
  "garmentRating": null,
  "durationMs": null,
  "taskSubmissions": 1
}
```

`status` describes task success/failure; a successful task whose image fails to render has `rendered:false`. The participant rates identity against their source photo and garment fidelity against the exact reference. Use 5 for clear preservation, 4 for minor non-distracting differences, 3 or lower for changes affecting trust. No output counts as a failed case, never a positive rating. Time is measured from explicit Generate to displayed result. Keep unknown duration null and failed attempts unrated.

All planned cases stay in the denominator. Actual live/mock mode is mandatory; mock placeholders cannot pass a live-quality gate. Unrecorded cases and missing successful-image ratings/durations keep affected gates pending. Every recorded case must have at least one actual submission; a failure before submission cannot count as testing that look. One output per case is scored; extra task submissions fail the duplicate gate. Report the median and observed range of rendered live results plus all timeout/failure observations. Preserve the original batch if a separately authorized diagnostic retest occurs.

## Engineering targets

| Metric | Gate |
|---|---|
| Live task success plus rendered image | ≥15/16 |
| Participant-rated identity ≥4 | ≥15/16 |
| Garment fidelity ≥4 | ≥13/16 |
| Both ratings ≥4 | ≥13/16 |
| Median successful displayed-result latency | ≤60,000ms |
| Additional task submissions | 0 |
| Planned looks actually submitted | 16/16 |
| First two pilot looks rendered, identity and garment ≥4 | 2/2 |
| Declared source-photo version | Same across 16/16 |

A pass is one-person engineering evidence only. It cannot be called a five-user study, independent usability result, own-garment proof, or guarantee that every face is preserved. The scorer checks declared composition and outcomes; it does not establish immutable history. Review evidence edits and report failures rather than editing inconvenient rows away.

## Budget is a feasibility calculation

Enter `availableUnits`, `vtoUnitCost` and `skinUnitCost` only after checking the actual account and current applicable pricing. Unknown values stay null. The report reserves 25%, caps development at 40 VTO and 5 optional skin tasks and calculates an affordable mix prioritizing VTO. `approved` defaults false; setting it true is only metadata and never submits a task. Every live batch still needs specific authorization. Stop on 429; do not retry blindly.

**21 October pilot:** immediately before the approved batch, both the signed-in [YouCam dashboard](https://yce.perfectcorp.com/api-console/en/) and the configured key's read-only [unit API](https://docs.perfectcorp.com/reference/unit_system/paths/~1s2s~1v1.0~1client~1credit/get) reported **914 units**. The signed-in [unit calculator](https://yce.perfectcorp.com/ai-api/unit-calculator) showed **2 units/call** for Clothes V4.0. After exactly two successful live tasks, the unit API reported **910**: a four-unit deduction. No top-up or account setting change was made. The optional facial colour analyzer's 20-unit cost comes from the earlier same-day calculator snapshot and was not used in this pilot.

At the current 910-unit balance, the 25% reserve is **228 units** (rounded up), leaving 682 development units. The first two VTO tasks used **4 units**; the remaining 14 would use 28 more at the current quoted rate but are not approved. The route returned live result URLs in 13.7 and 20.7 seconds; full Generate-to-displayed-image latency was not timed, so `durationMs` stays null. `plannedVtoUnits` and `plannedVtoFits` calculate feasibility, never authorization.

## Separate product validation

Self-testing occasion → recommendation → two looks → choice can reveal defects, but it is not an independent-user completion rate. Own-clothes try-on and real Android Chrome/iPhone Safari checks are also separate pending evidence. Record only observed devices and capabilities. Public screenshots or video should use a permitted demo asset unless the participant explicitly consents to publication.
