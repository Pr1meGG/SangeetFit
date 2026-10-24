# Final-week release readiness — 24 October 2026

Execution record for the [accepted 24–30 October plan](../plans/2026-10-24-final-week-release.md). **Local mock evidence is not live quality, physical-phone verification, public judging access or a submitted entry.** Target submission: 30 October; official deadline: 2 November 2026, 22:15 IST. No guests are scheduled this sprint.

## Source and preservation

- Managed release worktree: `codex/final-week-release`, isolated from `CC-P`, based on `853f955492df727df6abe5475798cef086b0d128`.
- Original checkout retained its local settings, generated AGENTS edits, three pending API-route edits, draft branding, planning skill, images, scripts and traces. No reset/clean or bulk restoration occurred.
- Release application remains the reviewed baseline, including its original three-second polling cadence. No API contract, storage or feature expansion was needed to establish the baseline.
- Reviewed application/config checkpoint: `82b33c1b0a385cd5c75e0901031a7b7bf27c0afe`, pushed to `origin/codex/final-week-release`; `git ls-remote` matched the full local SHA. This record identifies that application/config source separately from subsequent evidence-only documentation commits. Release-SHA real-Redis CI receipt is recorded below when verified.

## Fresh local evidence

| Check | Actual result |
|---|---|
| Node / isolated dependency install | Node 22.23.3; `npm ci --ignore-scripts --no-audit --no-fund` exited 0; peer-range warnings retained |
| `TEST_PORT=3540 npm run verify` — baseline | Exit 0 |
| `TEST_PORT=3541 npm run verify` — final integrated check | Exit 0 after the documentation/config changes; same 15 executed offline suites, Redis skip, 22 warnings and 10 browser suites |
| `TEST_PORT=3541 npm run verify` — after the CI geometry correction | Exit 0; 15 executed offline suites/one Redis skip, TypeScript/build, 0 lint errors/22 warnings, all 10 mock browser suites |
| Offline contracts | 16 enumerated; 15 executed; real Redis explicitly skipped locally |
| Canonical route types / TypeScript | Pass |
| ESLint | Exit 0; zero errors, 22 warnings |
| Mock production build | Pass; all six app routes built |
| Mock browser suites | All 10 pass |
| Local deployment-rule assertion | Pass: both `codex/ui-revamp` and `codex/final-week-release` explicitly false, no wildcard enable rule |
| Actual PDF read-back | One page; all five events, both synthetic owned garment names and undecided slot; zero images/annotations/private test markers |
| Responsive and keyboard evidence | Browser wardrobe test exercised 320/390/1440px, no overflow, contained images, ≥44px print control and keyboard print |
| Whitespace / document links | `git diff --check` exited 0; relative links/artifacts exist in all 12 changed Markdown documents |
| Initial checkpoint review | `sf-reviewer` and `code-reviewer` found no actionable findings in `82b33c1`; app/APIs/tests/dependencies unchanged from baseline there, exact branch deployment rule approved. Later test-only correction is recorded below. |

The suites cover explicit one-request behavior, zero-task browsing/upload/compare/plan/export, invalid uploads, camera-denial recovery, stale results, source replacement, plain-text 429 stop, exhausted-budget errors and session clearing. Live-shaped responses are synthetic intercepts, never provider results. The wardrobe regression made exactly three explicit intercepted mock requests to cover multiple photo versions; those are not the planned two live attempts.

Retained synthetic artifacts: [320px board](final-week-2026-10-24/board-320.png), [390px board](final-week-2026-10-24/board-390.png), [1440px board](final-week-2026-10-24/board-1440.png), [print view](final-week-2026-10-24/print-view.png), [actual PDF](final-week-2026-10-24/wardrobe-plan.pdf), [extracted text](final-week-2026-10-24/plan-text.txt), [rendered PDF](final-week-2026-10-24/plan-page-1.png). The 320px and 1440px boards, print view and rendered PDF were visually inspected. Solid-colour uploads are synthetic fixtures. These are test evidence, not final public live screenshots.

## Vercel Git audit — read-only

Inspected the authenticated project's [Git settings](https://vercel.com/ryuk-codes/sangeet-fit/settings/git) and [Preview environment](https://vercel.com/ryuk-codes/sangeet-fit/settings/environments/preview):

- Connected repository: `Pr1meGG/SangeetFit`; no deploy hooks listed.
- Preview **Branch Tracking enabled**, matching **All unassigned branches**. The original repo configuration disabled only `codex/ui-revamp`, leaving the new release branch eligible for automatic deployment.
- Added an exact local `git.deploymentEnabled` false entry for `codex/final-week-release`, preserving the older rule. [Official configuration semantics](https://vercel.com/docs/project-configuration/git-configuration#git.deploymentenabled) say unspecified branches default true. This permits reviewed source sync while manual deployment remains separately gated. No Vercel UI setting or environment value was changed/revealed.
- The current dashboard also showed an existing UI-v2 preview for “Surface labelled reference outfits in the default gallery”; this is newer than the older protected mock-preview record. It was not tested as the release. Do not label the older snapshot the latest cloud UI without rechecking.
- The connector's deployment list returned the older production deployment `dpl_4inrWPNEV24ExC7CR8TPcMwQP6dc`; its summary does not expose project Git rules. The authenticated settings above are the evidence for branch tracking.

A successful GitHub push is not a deployment. After source sync, verify the remote SHA, mock CI/Redis results and absence of a release-branch Vercel deployment separately.

After the checkpoint push, the authenticated Deployments → Branch search for `codex/final-week-release` returned **No matches found**. The displayed newest existing deployment remained UI-v2 `02c9d8f` from 23 October. No release-branch deployment was observed; this is a timestamped check, not a guarantee against later operator actions.

## First CI outcome and focused correction

[Run 40066936191](https://github.com/Pr1meGG/SangeetFit/actions/runs/40066936191) on `82b33c1` **failed**, so that full CI gate is not a pass. All 16 offline suites, including real Redis concurrency, passed; TypeScript, lint and production build passed. Redis checks admitted exactly five of 20 concurrent reservations within ten units, retained shared mixed-price state, rejected corrupt/expiring state and retained ambiguous reservations without retry/refund. These are isolated CI-store tests, not the deployed ledger.

The browser suite failed `garment-library.browser.test.mjs:64`: “narrow phones must show readable single-column outfit cards.” The test starts a deep scroll under global smooth scrolling, then reads first/second viewport rectangles in separate protocol calls. A controlled 100px viewport movement between those reads reproduced false overlap with unchanged one-column CSS; sampling both rectangles in the same evaluation passed. The local browser completed the original smooth-scroll request immediately, so the Linux timing itself was not reproduced on Mac.

Correction: sample both rectangles in one `evaluateAll`, retain alignment/non-overlap and additionally require positive dimensions. No CSS/UI change, longer wait or weakened expectation. `TEST_ORIGIN=http://127.0.0.1:3540 node tests/garment-library.browser.test.mjs`, focused ESLint and whitespace checks exited 0; code and JavaScript/TypeScript reviewers found no actionable findings. Final integrated mock verification after the fix exited 0 with all 10 browser suites. Subsequent CI status is available in the [release branch workflow runs](https://github.com/Pr1meGG/SangeetFit/actions?query=branch%3Acodex%2Ffinal-week-release); initial CI failure remains retained rather than overwritten.

## Demo-source discovery — local inspection only

At the user's request, located four SangeetFit mock PNGs in Downloads. Validated all four PNGs and inspected the two full-body candidates once. The user confirmed they are fictional AI-generated assets; the creation tool/account was not supplied and processing/public derived-output rights remain to be verified. No image was copied into Git/public folders or sent to YouCam.

| Private receipt alias | Dimensions | Bytes | Framing assessment |
|---|---|---|---|
| demo-male-v1 | 1024×2398 | 1,875,089 | Face and feet visible, front-facing with arms clear; proposed candidate for compatible garments, not a quality pass |
| demo-female-v1 | 635×1024 | 660,576 | Face and feet visible; one arm behind torso, requiring care with garment/pose compatibility |

Hashes and exact local paths are kept only in ignored `out/final-week-inputs/source-candidates.json`; file metadata contains no creation/provenance fields. Face crops were validated but are outside the clothing pilot. Do not interpret a filename, successful decode or user confirmation of fictional generation as evidence that a particular output has passed live quality. Select one source version to match the eventual two garment references before declaring the live batch.

The male candidate was also prepared through the actual app's local file chooser in mock mode: JPEG875×2048, encoded data URL152,655 bytes, visible “Photo ready. Uploading did not start a task.” No Generate action was pressed. This ad-hoc check did not instrument request counts; the server remained mock, and zero-task upload behavior is separately covered by the passing browser suites. No source/output image was added to public assets.

## Remaining gates and exact next inputs

| Gate | Current state / required next evidence |
|---|---|
| Demo-person source | Two full-body candidates found and privately indexed above; user confirms fictional AI generation. Exact source selection, creation tool/account and rights receipt for YouCam processing/transformation and public derived-output/footage use remain pending. Do not assume sample files have permission from their names. |
| Two owned references | User supplies one upper-body garment photo and a different complete-outfit photo; confirm ownership/rights, category and exact input receipts. No catalogue substitutions. |
| Physical phone | Not exercised in this run. `adb` is absent from PATH and the standard local Android SDK path. User phone/browser walkthrough and actual native result/PDF saving remain pending; desktop emulation is not a substitute. |
| Release configuration / deployment | Present reviewed SHA, target URL/environment, manual deployment/live-activation changes and rollback for specific approval. Verify runtime duration and assets after approval. |
| Provider inspection / budget | Current price/balance/ledger inspection not authorized or run. Proposed 20 judging VTO attempts need exact unit cap/reserve and separate approval; historical allowance is not current capacity. |
| Two live attempts | Zero performed here. Exactly `OWN-01` upper_body and `OWN-02` full_body on the same licensed demo source; no skin or retries. See [pilot](OWN_GARMENT_PILOT.md). |
| Recording / quality | User evaluator source likeness and garment fidelity ≥4/5 per rendered result; capture/save entire journey during those same two attempts. No participant-satisfaction/independent-usability claim. |
| Public/judge package | Five final screenshots, 2:30 English video, exact-build clean-browser test, private repository sharing and judge credential delivery remain pending. Publication/submission need specific approval. |

If one live case fails, preserve it and narrow claims. If neither passes, block owned-clothes live signoff and prepare a separately bounded retest proposal. Stop on 429; failed or uncertain submissions retain reservations. A lost session or expired link does not authorize replacement recording calls.

## Daily judging operations — user-owned, manual

Through 20 November, the user checks home/collection/access daily and follows an approved allowance-inspection cadence before judging and after usage. Record date/time, release SHA/URL, access outcome, permitted aggregate allowance status and unresolved issue; never credentials or private provider URLs. Confirm host/store validity through the judging window. Broken access, depleted allowance or resource expiry requires operator review; no automatic refill, reset, paid upgrade, external messages or monitoring automation.

All live/device/publication outcomes remain pending. Completed local preparation must not mark later sprint days complete.
