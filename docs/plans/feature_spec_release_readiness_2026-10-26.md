# SangeetFit release readiness: specification and execution plan

**Source:** 26 October request to audit the complete product, plan the remaining work, and continue iterating; accepted [24–30 October release plan](2026-10-24-final-week-release.md).
**Date:** 26 October 2026. **Target:** 30 October; recovery 31 October–1 November. **Official deadline:** 2 November 2026, 22:15 IST / 11:45 EST. Judging ends 20 November. [Official rules](https://youcam-api-skin-ai-ecommerce.devpost.com/rules), rechecked 26 October.
**Goal:** demonstrate add owned clothes → two genuine previews → compare → choose → plan five events → save/open an actual PDF on the reviewed release.
**Architecture:** retain the existing Next.js app, page-session data, server-only YouCam integration, shared Redis budget, and native PDF export. Reconcile existing release work into the current local candidate selectively; fix observed blockers only.
**Stack:** Next.js 16.4.1, React 19.3.1, TypeScript, Tailwind, Playwright, Redis 7.4 CI; no new dependencies.

## Outcome, scope and ambition lenses

- **Altitude:** a guest makes and keeps a wardrobe decision across five celebrations; success is the complete usable journey and a judge-accessible release.
- **Depth:** prove the current source with fresh tests, real-Redis CI, two rendered owned-garment outcomes, physical-phone saving, and an inspected PDF. This lens changes the result most: implementation alone cannot establish live quality.
- **Range:** check interaction, accessibility, privacy, source/image rights, budget, deployment access, and submission requirements together. The user supplies visual ratings; this is not independent usability research.
- **Speed:** reuse the accepted pilot/preflight, existing application, CI fixes and the same two outputs for validation plus recording. Defer guest research, the fourteen-reference sweep, redesign, new logo integration, accounts, persistence, checkout, family features and optional skin analysis.

The user has already requested local execution. Work continues in this session; this document creates no deployment, provider-call, account-inspection, spending, sharing or publication authorization.

## Current user steering — 26 October

The user reports creating the demo-person image using AI and gives the green signal to use it. Record this as user-cleared AI-created content; do not invent a licence, model/tool attribution or real-participant consent. Exact source/version identification remains a receipt task. **Garment selection and the two-case live pilot are on hold at the user’s request.** Continue local release preparation; no request to resume garments, live spending or deployment is implied. This supersedes the older licensed-source wording for active work without rewriting the historical plan.

### Subsequent authorized catalogue batch

The user then selected the male and female AI full-body images and requested their use for exactly two live attempts, choosing existing catalogue outfits. The current batch is male → Emerald Silk Kurta and female → Midnight & Gold Lehenga, up to four units total at the verified two-unit tariff, no skin/retries/extra attempts. This is a catalogue pilot on two different sources; it does not satisfy the held owned-garment or same-person comparison gates. See the [batch declaration and input/preflight receipts](../testing/CATALOGUE_AI_PILOT_2026_10_26.md). **This batch is now complete:** after the user configured credentials locally, both normal app-driven catalogue cases rendered and were saved in 15.712s/15.959s. Exactly two generation requests deducted four units; provider balance906 and shared allowance6 remaining. A zero-send local fingerprint mismatch was corrected before either provider task. Temporary live settings were process-only and the server stopped afterward. User quality scores, deployed release and physical-phone saving remain unverified; owned garments stay on hold. No additional generation is implied.

## Current facts and decisions

| Area | Verified repository or remote fact | Consequence |
|---|---|---|
| Local source | `experiments` at `d0ab65f61971887e9a7a8b2eb74c28d80adc0eeb`, with pre-existing UI/test/docs/branding changes | Preserve these changes; identify the candidate by HEAD plus reviewed working diff until committed |
| Remote candidate | `codex/final-week-release` at `e2eb6cdf690f6870385b774fced3d47a37a1a11c`; private repository | This source has CI evidence; it does not include the later experimental UI |
| CI | [40089231989](https://github.com/Pr1meGG/SangeetFit/actions/runs/40089231989) succeeded for `e2eb6cd`; logs prove real Redis and ten mock browser suites | Current local candidate still needs its own approved checkpoint and CI |
| Branch split | Release has a card-geometry test fix, CI artifact retention, accepted plan and later Android evidence; experiments has repository reorganization, adaptive polling and premium UI | Integrate only reviewed differences, without resetting or cherry-picking whole worktrees |
| Core implementation | Scoped source review found owned upload, explicit generation, comparison, event assignment, scalar PDF data and reset paths present; no confirmed blocking defect | Verify rather than add features |
| Live proof | Two historical catalogue results on one private person source; owned-garment cases remain unrun | Catalogue results cannot sign off owned-garment quality or provide public footage |
| Access | Anonymous GET of known Preview `/library` returns 302 to Vercel | Clean-browser judge access is still a blocker |
| Hardware | Release worktree records 24 October physical Android mock comparison/plan/native result and PDF saving, tied to `e2eb6cd` | Carry dated evidence forward; do not claim current UI, cloud or live hardware verification |

## Scope of changes and blast radius

**Size: medium.** Several release-preparation surfaces change; application data and API contracts do not. External release actions remain separate gates.

| Area / files | Change and dependents | Evidence / regression risk |
|---|---|---|
| `tests/garment-library.browser.test.mjs` | Reuse release branch's one-frame card geometry sampling; consumed by `tests/run-browser-tests.mjs` and `scripts/verify.mjs` | Confirmed upstream CI flake: smooth scrolling moved between two sequential rectangle reads. Keep positive dimensions, alignment and nonoverlap assertions |
| `vercel.json` | Explicitly disable Git auto-deployment for `experiments` and retain disabled release branches | Confirmed file at audit baseline protected only `codex/ui-revamp`; integrated local configuration protects all three named branches. Local rules do not prove remote deployment behavior; inspect effective settings before any approved push |
| `.github/workflows/verify.yml` | Reuse reviewed release synthetic-evidence retention, restricted to five known fixture outputs | Confirmed existing release CI succeeded. Upload only synthetic board/print/PDF files, never broad temp directories |
| `docs/plans/`, `docs/testing/`, `docs/agent-workflow/`, README | Reconcile accepted scope, dated evidence and current gates; retain historical records and source identifiers | Stale guest-study requirements and extra smoke batches could cause unnecessary work/spending; missing relative links can hide proof |
| API polling | Existing experimental cadence differs from fixed-three-second release cadence | Confirmed branch diff; do not change it speculatively. Require current source CI; retain unproved-live limitation |

No schema, stored-user-data, endpoint, request/response, export, dependency or credential change. Photos/results stay session-only. Undo local work by reverting only the new scoped changes; preserve pre-existing edits. Remote settings, image licences, account state and live provider behavior stop the local audit boundary.

## Execution tasks

### 1. Establish the candidate and reconcile accepted scope

- [x] Inspect current Git status, existing worktrees, relevant source/tests and latest project evidence.
- [x] Verify official deadline, private remote visibility, release SHA/CI logs and anonymous Preview access.
- [x] Save the current audit, import the accepted 24 October plan, and link it from project entry points.
- [x] Reconcile owned-garment/preflight protocols to exactly two attempts total, one user-created AI source, user ratings and no guest study. Preserve pending rights and authorization fields.
- [x] Carry Android evidence with its original build/date; retain synthetic-only limits and private-data exclusions.

### 2. Finish the smallest local release-preparation integration

- [x] Bring across the proven geometry test correction and synthetic-only CI retention.
- [x] Add explicit false deployment rules for `experiments` and `codex/final-week-release`; preserve `codex/ui-revamp`.
- [x] Verify the changed browser assertion, configuration, workflow evidence staging and Markdown links. Obtain independent review. Do not change application logic without a reproduced defect.
- [x] Record fresh `TEST_PORT=3543 npm run verify` output, all actual exit codes, lint warnings and Redis skip. Rerun affected checks after integration; do not relabel older CI as current-source CI.
- [ ] Prepare a scoped checkpoint only after reviewed changes, exact commit text and destination have been shown and approved. Verify remote SHA and real-Redis CI after any approved push. No merge, deploy or history rewrite is included.

### 3. Prepare the two-attempt live session — on hold at user request

- [ ] User identifies exactly one owned upper-body garment and one owned complete outfit after resuming garments; identify the already user-cleared AI image as `demo-source-v1`.
- [ ] Retain private receipts for processing/transformation and intended public source/reference/output/footage rights. Existing private catalogue photos/results remain excluded.
- [ ] Prepare the actual reviewed release SHA, intended URL/environment, rollback source, function-duration settings and private judge credential route.
- [ ] Obtain specific authorization for current provider tariff/balance and ledger inspection; calculate a two-attempt unit ceiling and 25% reserve. Twenty judging attempts remain proposed capacity, not approved spending.
- [ ] Present one concrete release/task approval package with exact inputs, build, environment, settings, maximum units, no-skin/no-retry rules and recording destination. No placeholder-based approval or implicit deployment.

### 4. Execute release proof and capture once — on hold with garment pilot

- [ ] Deploy/activate only the approved source; verify home/library/assets and private access in a clean browser without developer login. Confirm runtime supports the 180-second internal deadline.
- [ ] Run OWN-01 and OWN-02 once each on the same source. Capture raw upload/generation/comparison/planning/PDF footage during these same attempts. Stop on 429; preserve every failure or uncertain submission; no extra smoke or recording generations.
- [ ] Both results must visibly render and receive the user's separate source-likeness and garment-fidelity scores ≥4/5 for two-case signoff. Record actual latency, one app request per Generate and ledger reservation changes.
- [ ] On the user's phone, compare and assign results, populate five events, save/open a genuine result and populated/partial PDF. Check correct counts/text and absence of photos, private URLs, credentials and annotations in the PDF.
- [ ] If one case fails, narrow the demo and claims; do not mark the two-case gate passed. If neither passes, withhold owned-garment live signoff and propose a separately approved diagnostic. A retest is a new bounded approval.

### 5. Complete the submission package and operation

- [ ] Edit permitted footage into a 2:30 English video within the official 1–3 minute range; refresh five screenshots against the exact build.
- [ ] Review the Devpost description against observed outcomes. Distinguish concepts, mock results and live results; no independent-usability, sizing or savings claims.
- [ ] Keep the repository private; verify organizer recipient, source/assets/setup access and code/asset licensing before authorized sharing. A new public open-source licence is not presumed necessary for the private route.
- [ ] Rehearse judge instructions and privately delivered credentials; agree a separately approved judging cap and manual access/allowance checks through 20 November. Do not create automation or silently refill/reset the ledger.
- [ ] Show the exact final public text, media destinations, audience and submission fields for approval, then publish/submit and retain actual confirmation. Target 30 October; recover 31 October–1 November if needed.

## Verification: Success and Proof

These criteria define release signoff; completed local checks are separately recorded in [today's audit](../testing/READINESS_AUDIT_2026_10_26.md).

| Criterion | Method | Passing result |
|---|---|---|
| Local candidate software | `TEST_PORT=3543 npm run verify`; inspect complete log and exit code | Offline suites/typecheck/build/browser checks pass; zero lint errors; actual warning/skip counts recorded |
| Current release CI | Read CI and real-Redis job logs for the final approved SHA | 20 concurrent reservations admit exactly five within ten units; failed/corrupt/unavailable budget fails closed; all suites pass |
| Explicit generation and recovery | Existing browser/API suites; malformed uploads, denied permission, replacement, timeout, 429, reset | Zero tasks for preparation/compare/plan/export; one per explicit Generate; no hidden retry; state/privacy recovery works |
| Geometry and evidence retention | Library browser suite, deployment-rule assertion, workflow staging fixture self-check, relative-link check | One-frame geometry still checks positive dimensions/nonoverlap; only five expected synthetic files staged; successful missing evidence fails |
| Judge access and runtime | Fresh browser on approved deployed SHA, no developer login | Home/library/assets load; intended private access works; unauthorized calls fail before photo transmission; duration and budget reservations verified |
| Owned-garment quality | Exactly two approved app-driven attempts, one source, user visual ratings | Both visibly render with likeness and fidelity ≥4/5; all failures/timings/request/reservation counts retained |
| Phone decision and export | Real phone through upload → Generate → comparison → event plan → save/open image and PDF | Usable image and five-event PDF with accurate counts/text; no extra generation or private-data leak |
| Submission | Exact reviewed text/media, private-repo access, verified video and form confirmation | Accurate public package submitted by deadline and working access maintained through judging |

**End-to-end proof:** start with a fresh page session on the approved judging URL. Prepare the user-cleared AI source and two garment inputs through normal controls, consent, explicitly generate once for each, compare, choose an event, complete all five choices, and save/open the image and PDF. Capture the actual user path and retained outputs, not internal state injection. Synthetic fixtures prove local logic only; the live path remains unverified until authorized execution succeeds.

## Assumptions, open questions and boundaries

- The accepted 30 October target, user-created AI demo source, no guest study and exactly two attempts remain the working scope. Today's broader audit request does not replace them.
- The current `experiments` UI is a local integration candidate, not yet the approved deployed release. Decide the final checkpoint/source after review and current-source CI; preserve the existing release worktree.
- **On hold / missing inputs:** exact two garment receipts, exact AI source/version receipt, garment processing/public-use receipts, deployment/live/account-inspection approvals and current unit bound. User clearance for their AI-created source is already recorded; do not ask for it again. Without those, local preparation continues but provider calls cannot start.
- **Missing release facts:** current authenticated hosting settings, final deployed SHA, runtime budget behavior, clean-browser judging access and live phone saving.
- **No unrequested expansion:** no guest recruitment, extra generation batch, redesign, database or new dependency. iPhone is listed as untested if unavailable; it is not a prerequisite for the agreed own-phone demo.

## Iteration record

- Initial plan saved before release-preparation edits. Source review found no confirmed core-flow blocker. Final integrated `TEST_PORT=3543 npm run verify` exited 0: 15 offline suites executed/one Redis skip, TypeScript/build, zero lint errors/22 warnings, ten mock browser suites. Workflow staging fixtures, YAML/configuration and code reviews passed; documentation/final-diff review approved after two wording corrections, with no remaining findings. Final document links resolve; the reusable workflow staging self-check passes. Details are in today's audit.
- Latest steering records the user-created AI demo source as cleared and holds garment selection/live-pilot work. Local integration and documentation proceed; no external operation has occurred.

## Release-package iteration — 26 October 2026

Prepared the [concrete checkpoint/media/deployment package](../submission/RELEASE_PACKAGE_2026-10-26.md), including the exact commit draft and selected source boundaries. Captured the local reference planner/PDF path without generation and assembled the existing genuine live catalogue evidence into a captioned two-minute review draft. The user has not supplied quality ratings, so catalogue status stays unchanged. Read-only hosting inspection found Node24 versus the declared/tested Node22, Fluid Compute enabled and SSO-protected Preview; these are deployment preparation findings, not changes. No additional provider task, ledger mutation, push or deployment occurred.
