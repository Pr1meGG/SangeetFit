# SangeetFit — Five-person validation protocol

Updated 21 October 2026. **No participant session or new live attempt is recorded by this document.** Skin analysis is optional; genuine live VTO is required for VTO evidence. Mock sessions may test navigation but never count as live image-quality validation.

## Preconditions

- Review current working-tree state and preserve user work. Run the offline suites, TypeScript, lint, mock production build and relevant browser regressions before recruiting.
- Recheck available credits and applicable pricing before each batch; the 21 October snapshot is 916 units, Cloth V4 2 units/call and optional facial colour analysis 20 units/call. Preserve 25% of available units. Each capped live batch needs explicit approval; this protocol does not grant it.
- Fix the test cases and photo/reference selections before the batch. Existing case IDs reserve pseudonyms only; they do not establish consent or actual participants.
- Get informed permission to send person and garment images to YouCam. Explain that app-session retention differs from the provider's handling, that AI can change face/garment details, and that evidence will not publish photos or signed result URLs.
- Review original inputs manually for clear face, full-body pose and appropriate garment references. The app's byte validation does not prove suitability.

## Two separate evidence sets

### Input readiness — 21 October

Participant and personal-photo preparation is deferred at the user's request. These are reserved slots, not recruited or consenting people. Keep original photos and the private mapping from case IDs to inputs outside GitHub.

| Participant slot | Planned cases | Input roles | Status |
|---|---|---|---|
| p01 | upload-01, upload-02, catalogue-01 | Owned upper-body, owned full outfit, permitted reference; same person photo | Deferred; first pilot tranche |
| p02 | upload-03, upload-04, catalogue-02 | Owned upper-body, owned full outfit, permitted reference; same person photo | Deferred; first pilot tranche |
| p03 | upload-05, upload-06 | Two owned garments; same person photo | Deferred |
| p04 | upload-07, catalogue-03 | Owned garment and permitted reference; same person photo | Deferred |
| p05 | upload-08, catalogue-04 | Owned garment and permitted reference; same person photo | Deferred |

Candidate menu for the two pilot reference slots (choose exact IDs only after participant preferences and input suitability are known):

| Audience | New model-led concept | Sourced alternative | What this tests |
|---|---|---|---|
| Women | `concept-coral-anarkali` (Mehendi/Haldi) or `concept-midnight-lehenga` (Sangeet/Reception) | `library-coral-embroidered-kurta` (CC0, frontal upper garment) | A current collection reference versus a simpler sourced upper garment. |
| Men | `concept-emerald-kurta` (Sangeet/Mehendi) or `concept-cream-embroidered-bandhgala` (Sangeet/Wedding) | `library-ivory-button-kurta` (public domain, frontal upper garment) or `library-ivory-nehru-ensemble` (public domain, full outfit) | A current collection reference versus a sourced upper/full outfit. |

The concept edit has recorded local-image hashes and generation provenance in [`editorial.ts`](../../src/data/editorial.ts); sourced-photo licences are in the [source register](../garment-library/SOURCE_FEASIBILITY.md). All are **candidates**, not visually reviewed VTO results or seller products. Prefer at least one model-led concept across `catalogue-01/02` so the current collection receives direct evidence. If both slots use sourced alternatives, report that the new edit remains untested. Do not promote any reference based on upload success alone.

Before requesting the six-task pilot approval, complete this private preflight without committing person photos or signed URLs: obtain p01/p02 consent and one suitable person photo each; choose one owned upper-body photo, one owned full-outfit photo and an exact candidate ID for each participant; check that the intended clothing area is fully visible and the source pose is usable; record the case-to-input mapping outside GitHub. Confirm the running app says **Live AI**, recheck the account/project balance and current Cloth V4 cost, reserve 25%, then request approval for **exactly six tasks**. The current app sends `auto` for catalogue garment categories, which the [V4 task reference](https://docs.perfectcorp.com/reference/ai_clothes/v4.0/paths/~1s2s~1v2.0~1task~1cloth-v4/post) supports; output quality is still unknown. Never submit a diagnostic seventh task or retry a failed case under this approval.

**VTO quality:** predeclare 12 cases across five consenting people: eight owned garments and four permitted references, with at least two looks per person. Cases assigned to `p01` and `p02` form the six-task pilot; each person supplies one upper-body and one full-outfit owned reference, plus one permitted reference. The pilot passes only if at least five of six results render and both identity and garment are rated ≥4/5. These six cases count in the twelve-case scorecard. Record one output per case, including failed tasks, render failures, elapsed time and task-submission count in [benchmark-records.json](benchmark-records.json). See [BENCHMARKS](BENCHMARKS.md) for exact record fields, ratings, denominators and report commands. Do not remove failures or overwrite an outcome with a successful retry.

**Usability:** recruit five distinct consenting participants. With photos ready, each independently chooses a celebration occasion, understands a recommendation reason, generates two looks, compares them and saves/opens a choice. Reuse predeclared quality outputs for the usability study; the pilot participants' third results are additional quality evidence. Do not spend twice merely to maintain two spreadsheets. Any additional tasks count against the approved batch and total budget.

Skin analysis is recorded separately as skipped, live success, live failure or mock. Skipping it does not invalidate live VTO evidence. A mock garment result is a reference placeholder, not a generated person.

## Participant procedure

1. Record pseudonym, consent, date, device/browser and actual mode. Do not retain names or raw photos in evidence.
2. Start timing with photos ready. Select an occasion and add an owned garment or choose a candidate explicitly labelled for testing. Confirm metadata is user/editor supplied, not image-analysis output.
3. Ask the participant to explain why the outfit was recommended. Record their words without coaching.
4. Provide/review the person photo; press **Generate** once. Record upload/submit/poll/render failure stage when applicable. A timeout does not authorize a new task.
5. For a rendered live result, have the participant rate identity and compare garment fidelity against the reference. A successful API status alone is not a visual pass.
6. Generate the second predeclared look within the approved cap, preferably using the same person photo. Confirm comparison/original toggles/reopening send zero tasks.
7. Choose a look; try save/open, zoom and applicable catalogue outfit sharing. Mark device download or share limitations honestly. Do not send messages to other people as part of testing without explicit authorization.
8. Record independent completion, time to first Generate, reason understanding/preferred choice, failures and whether they would use it again.

Use this empty template; rows must be actual observations:

| Participant | Date | Device/browser | Consent | Live VTO case IDs | Skin mode/outcome | First Generate seconds | Independent completion | Reason understood / choice made | Save/open | Notes |
|---|---|---|---|---|---|---|---|---|---|---|

## Acceptance and follow-up

- Quality targets: rendered task success ≥11/12; identity rating ≥4 for ≥11/12; garment rating ≥4 for ≥10/12; both ≥4 for ≥10/12; successful displayed-result median ≤60s; zero duplicate submissions. Missing outcomes/ratings keep affected gates pending. No result counts as failure.
- Usability targets: ≥4/5 independent completions, ≥4/5 understanding the reason and choosing a preference; median first-Generate time ≤60s with photos ready.
- Actual Android Chrome and iPhone Safari checks are separate evidence requirements. Desktop emulation is not proof of phone camera or save/share behaviour.
- Stop on 429. Record failures and fix critical defects. Retests are new approved evidence; retain the original batch rather than editing failures away.
- Update the project state/task board only with executed outcomes. Report the sample size, device coverage, failure count and limits rather than calling the product universally reliable.

The balance/pricing snapshot is recorded in [BENCHMARKS](BENCHMARKS.md). No participant outcome or phone result exists yet; the user deferred participant/photo preparation on 21 October.
