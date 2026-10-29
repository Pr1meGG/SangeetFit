# SangeetFit submission audit — 29 October 2026

## Decision

**Not ready for final submission.** The core experience exists, production is reachable, and local compilation succeeds. Autosave access/privacy and reliability are release blockers. Current-source browser verification, a reproducible release, judge capacity and final submission materials remain open.

This is an engineering readiness audit, not a claim of comprehensive security certification. It covers current tracked and untracked source, local synthetic tests, release documentation, GitHub metadata, anonymous production reachability and official contest requirements. No live YouCam task, photo retrieval from production, allowance mutation, deployment, push or publication was performed. Application code was not changed.

## Current release surface

- Checkout: `codex/redesign-v2`, committed HEAD `4c4ed65`, with substantial staged deletions, modified files and untracked application files. HEAD alone does not represent this release.
- Current catalogue has 26 AI outfit concepts; catalog-mapping tests check all display assets exist. Older sourced-photo library records describe removed material.
- Production `https://sangeet-fit.vercel.app`: anonymous GET `/`, `/library`, `/results`, `/admin` and `/api/mode` returned HTTP 200; mode reported `live`. This proves reachability/configuration, not successful generation or access to saved photos. The sensitive autosave API was not queried against production.
- GitHub repository `Pr1meGG/SangeetFit` is private. Latest listed successful CI is October 24 run `40089231989`, source `e2eb6cdf690f6870385b774fced3d47a37a1a11c` on `codex/final-week-release`. It does not certify the current source.
- `vercel.json` disables automatic deployment for three older branches, but does not explicitly disable `codex/redesign-v2`. Verify effective hosting integration before a release push.

## Findings, in priority order

### P0 — Saved original photos have an unauthenticated API

`src/app/api/auto-saved/route.ts:7` performs both listing and individual retrieval without authentication. `src/lib/shared-results.ts:147` accepts but ignores `visitorId` and returns person, garment and result photos from a global index. `src/app/admin/page.tsx:24` fetches that endpoint without sign-in.

Impact: when this implementation has configured storage and saved records, any caller can obtain the indexed original photos. A random result ID is not adequate protection when listing exposes IDs and images. Source defect confirmed; current production record contents/exposure were deliberately not fetched.

Required exit: authenticate creator access; isolate visitor access; enforce authorization on both list and individual retrieval; test unauthorized and cross-visitor access with synthetic records. Preserve automatic saving as requested while making saved photos private.

### P1 — Every autosave hides the earlier gallery entries

At `src/lib/shared-results.ts:68`, Lua prunes scores through `createdAt`, while new index entries are also scored with `createdAt`. Each subsequent save removes all earlier listings, including same-second entries. Their image records remain until the 24-hour TTL expires, and the intended 50-record index cap does not constrain accumulated records.

Required exit: use a consistent expiry-based index or correct creation-time cutoff; prove multiple saves remain listed, expiry removes only expired entries and the cap actually works.

### P1 — Photo disclosure and deletion do not match autosave

`src/app/page.tsx:644` says person/garment photos stay in the page session on the app side. `src/app/api/vto/route.ts:220` always attempts to persist all three photos to Redis for 24 hours. The consent-based shared-result deletion path uses a different key/store from these autosaves.

Required exit: disclose automatic server retention before Generate, keep automatic saving private, define which original photos are needed, and provide deletion that covers the actual saved record. A session reset must not imply deletion of cloud photos unless it performs that operation.

### P1 — Two saving systems have inconsistent UI and failure behavior

Autosave returns `null` silently on storage/download failure (`shared-results.ts:101`); listing failures look like an empty gallery (`:189`). Catalogue mock saves pass ordinary asset paths into a data-URL-only saver (`vto/route.ts:149`, `shared-results.ts:28`), so they cannot exercise a successful autosave. Existing shared-result tests cover the older, separate consent-based store, not the new autosave path.

The page has no longer-rendered sharing opt-in checkbox, while the browser sharing test still requires it. `autoSaveResults` is enabled as a side effect of Analyze selfie (`page.tsx:564`), which couples optional skin analysis to the other sharing path. The autosave receipt itself has no visible recovery action equivalent to the older sharing component.

Required exit: define one coherent automatic private save contract; show save failure and allow storage retry without another paid generation; test reload/reopen, multiple records, deletion and failure recovery through the actual current UI.

### P1 — No reserved judging capacity is established

The global Redis reservation is atomic and occurs before provider uploads. Missing/exhausted storage fails closed, and failed/uncertain tasks retain reservations. These are useful spend protections.

However, reachable live endpoints have no per-visitor/server abuse limit or separate judge allocation. Origin checks prevent some browser cross-origin submissions but are not caller authentication. Any caller with valid input can consume the same finite allowance.

The last documented October 27 ledger was total 50 units, 40 reserved, 10 remaining: five VTOs **then** at two units each. No current ledger/provider balance was read. `/api/mode` checks configuration, not available balance.

Required exit: verify current allowance, agree capacity for judging, protect it from public exhaustion and provide honest exhausted-state guidance. No arbitrary number of judge attempts is an official contest requirement.

### P1 — Release source, deployed snapshot and CI are not tied together

The checkout contains untracked autosave/admin/results code and changed catalogue files; prior deployment records describe packaged dirty snapshots. Latest passing CI predates these changes.

Required exit: review a complete release diff, exclude private/local files, checkpoint exact approved text, get current-source CI including disposable Redis, deploy that tested revision with approval, record revision/deployment pairing and rollback path.

### P2 — Final product claims and artifacts need reconciliation

- README still names `experiments` and removed `indian-wear.json`; session-only retention copy conflicts with autosave.
- Earlier deployment/access blockers in older documents are superseded by later October 27 production records and today's reachability checks. Reachability still does not prove generation/save correctness.
- Catalogue live outcomes have dated evidence. The current uploaded-own-garment path lacks current release validation in the reviewed durable records. Either validate the exact headline journey with a separately approved bounded run or limit demo claims to proven behavior.
- The local 88-second video is recorded as prepared, with creative/listening review and public upload pending. Existing screenshots are from older UI. Artifact existence and audiovisual quality were not revalidated in this audit.
- Independent demand, savings and broad identity reliability remain unmeasured. These are limits on claims, not requirements to launch a new user study before submission.
- No application LICENSE file is present. A public source route requires relevant licensing; the rules also allow private sharing. Decide source access and verify actual judge permissions. Review imagery/music/AI-source rights for the final chosen assets.

## Fresh verification

Tests run in a separate credential-free temporary snapshot, using existing installed dependencies, mock mode and synthetic fixtures. The original checkout's `.next` and environment files were not used. Source JSON evidence was included for benchmark/editorial tests. Snapshot path and raw logs are retained locally at:

`/var/folders/rz/fmskt4393gg_sm__cbxgstj00000gn/T/sangeetfit-audit-ebn20mkd`

- All 14 executed offline suites passed individually; one actual-Redis suite was skipped because no disposable Redis was provisioned.
- `npm run typecheck`: exit 0.
- `npm run lint`: exit 0; zero errors, 25 warnings.
- Mock production build: exit 0, including Next.js TypeScript checks.
- `git diff --check`: exit 0 before audit documentation edits.
- Browser suites executed independently: **9 passed, 3 failed**. Sharing waits for the removed optional save/share checkbox (`tests/shared-results.browser.test.mjs:54`); library still expects the removed sourced-photo filter (`tests/garment-library.browser.test.mjs:53`); before/after expects a 49% clip after moving the control to 51%, while the component now clips at 51% (`tests/before-after.browser.test.mjs:35`). Reconcile intended behavior and tests rather than excluding these suites.
- The slider's generated area is `100 - reveal` percent while `aria-valuetext` says `reveal` percent is generated (`src/components/BeforeAfterSlider.tsx:9`). Correct this accessible description alongside the intended reveal behavior.
- All 81 checked source/test/script code/config files matched the checkout after verification. Parent independently inspected offline/browser status JSON and build/typecheck logs. Mock server was stopped.

Green tests for the old sharing API do not cover the new autosave authorization/index defects. Fresh real-provider behavior, phone saving, allowance state and hosted source identity are not certified by these checks.

## Six stages left before submission

| Stage | Work | Exit condition |
|---|---|---|
| 1. Autosave/privacy repair | Protect saved photos; correct index, retention copy, deletion and save recovery | Synthetic tests prove visitor isolation, multiple saves, expiry, deletion and storage retries without paid regeneration |
| 2. Regression signoff | Resolve browser failures; run canonical verification and disposable-Redis tests | All release-critical checks pass on the intended source; no excluded failing core suite |
| 3. Release freeze | Reconcile docs, review complete changes, checkpoint and CI, deploy tested revision | Remote SHA, CI and deployed revision are explicitly paired; rollback is known |
| 4. Hosted judge/phone acceptance | Fresh anonymous access, bounded approved generation if needed, result autosave/reopen and native image/PDF save/open, exhaustion/failure recovery | Working current deployed journey and approved judging capacity through November 20 |
| 5. Submission assets/access | Final 1–3-minute video, current screenshots, concise accurate description, source/setup access and rights review | Approved final copy and media; public video URL and verified judge repository access |
| 6. Submit and verify receipt | Complete Devpost fields, final link check, submit with approval | Devpost confirms submission; retain confirmation and maintain judging access |

Suggested schedule from October 29: stages 1–2 first; release/phone acceptance October 30–31; materials and submission by November 1. Keep November 2 for recovery. This is a working schedule, not a guarantee of repair effort.

## Official requirements, rechecked October 29

Source: [official Devpost rules](https://youcam-api-skin-ai-ecommerce.devpost.com/rules).

- Deadline: **November 2, 2026, 11:45 AM EST = 10:15 PM IST**.
- Working application integrating at least one YouCam API, with consumer or eCommerce value.
- Repository with necessary source, assets and setup instructions; public with relevant licensing, or privately shared via the organizer's specified route.
- English description/materials or English translations, plus a **1–3-minute end-to-end video**, explaining the API and showing the intended device experience. Video must be publicly visible on YouTube or Vimeo.
- Working judge access free of charge and without restriction through the judging period, **November 3–20**. Login instructions must be supplied if private.
- Required fields and actual submission confirmation. Social promotion is optional and does not affect judging.

The four equally weighted judging criteria are implementation, design, potential impact and idea quality. The five-event wardrobe plan supplies a concrete differentiation story; show a real decision-to-plan journey and describe only the quality/impact actually demonstrated.

## Next action

Repair the automatic-save privacy and multi-result behavior as one bounded change, preserving the user's automatic-save requirement. Then verify the actual current UI before spending remaining provider units on final release evidence.
