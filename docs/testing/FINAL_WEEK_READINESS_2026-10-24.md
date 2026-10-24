# Final-week release readiness — 24 October 2026

Execution record for the [accepted 24–30 October plan](../plans/2026-10-24-final-week-release.md). **Local mock evidence is not live quality, physical-phone verification, public judging access or a submitted entry.** Target submission: 30 October; official deadline: 2 November 2026, 22:15 IST. No guests are scheduled this sprint.

## Source and preservation

- Managed release worktree: `codex/final-week-release`, isolated from `CC-P`, based on `853f955492df727df6abe5475798cef086b0d128`.
- Original checkout retained its local settings, generated AGENTS edits, three pending API-route edits, draft branding, planning skill, images, scripts and traces. No reset/clean or bulk restoration occurred.
- Release application remains the reviewed baseline, including its original three-second polling cadence. No API contract, storage or feature expansion was needed to establish the baseline.
- Checkpoint commit/remote SHA and release-SHA real-Redis CI: pending final review and source-control sync. This record identifies app source separately from later documentation/config commits.

## Fresh local evidence

| Check | Actual result |
|---|---|
| Node / isolated dependency install | Node 22.23.3; `npm ci --ignore-scripts --no-audit --no-fund` exited 0; peer-range warnings retained |
| `TEST_PORT=3540 npm run verify` — baseline | Exit 0 |
| `TEST_PORT=3541 npm run verify` — final integrated check | Exit 0 after the documentation/config changes; same 15 executed offline suites, Redis skip, 22 warnings and 10 browser suites |
| Offline contracts | 16 enumerated; 15 executed; real Redis explicitly skipped locally |
| Canonical route types / TypeScript | Pass |
| ESLint | Exit 0; zero errors, 22 warnings |
| Mock production build | Pass; all six app routes built |
| Mock browser suites | All 10 pass |
| Local deployment-rule assertion | Pass: both `codex/ui-revamp` and `codex/final-week-release` explicitly false, no wildcard enable rule |
| Actual PDF read-back | One page; all five events, both synthetic owned garment names and undecided slot; zero images/annotations/private test markers |
| Responsive and keyboard evidence | Browser wardrobe test exercised 320/390/1440px, no overflow, contained images, ≥44px print control and keyboard print |
| Whitespace / document links | `git diff --check` exited 0; relative links/artifacts exist in all 12 changed Markdown documents |
| Independent review | `sf-reviewer` and `code-reviewer` found no actionable findings; app/APIs/tests/dependencies unchanged from baseline, exact branch deployment rule approved |

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

## Remaining gates and exact next inputs

| Gate | Current state / required next evidence |
|---|---|
| Licensed demo-person source | Not selected/verified. Need one exact front-facing full-body source/version and private rights receipt covering YouCam processing/transformation and public derived-output/footage use, including applicable likeness rights. Do not assume existing sample assets have this permission. |
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
