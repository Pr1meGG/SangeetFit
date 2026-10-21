# PROJECT_STATE.md

Durable, verified facts about SangeetFit. Prior-generation results not rechecked in the current working tree are explicitly labeled **[prior report]**. Update this file when durable facts, verified outcomes, major decisions, or blockers change — not as a running log.

## Current personal-stylist implementation and 21 October direction

This section supersedes earlier journey/UI behaviour descriptions below; historical live evidence keeps its original limited scope.

- User authorized the milestone plan on `codex/ui-revamp`. The hackathon story now centers on choosing between celebration outfits already owned. Implemented session own-clothes upload with confirmed category/colour/style/occasion metadata, deterministic explainable recommendations, explicit VTO generation and two recent result comparison/choice. Skin analysis remains optional and separate from the person VTO source. No permanent wardrobe or checkout; top-and-bottom combinations and everyday occasions are deferred.
- `/api/vto` accepts mutually exclusive server-owned catalogue IDs or uploaded JPEG/PNG bytes with `upper_body|full_body` category. Both encoded images and JSON must total under 4,000,000 bytes. Input signatures/dimensions/structure, references and blocked status are validated before external requests. Browser preprocessing normalizes orientation and byte budgets without upscaling. JPEG entropy is not fully decoded server-side; browser uploads are decoded/re-encoded.
- One client request stays pending across closing/reopening; successful matching results are reused, stale selections are not reopened and failures remain visible with a recovery action. Image reload/original/zoom/comparison submit no new tasks. Upstream 429 reaches a session stop state, including non-JSON 429 responses. A shared 180s deadline covers upload/submission/polling; timeout cannot cancel an accepted provider task.
- Primary catalogue recommendations require matching reference/provenance plus live-reviewed status. **No catalogue reference is yet live-reviewed.** New sessions prominently offer own-clothes upload; candidate testing remains at `/library`. Multiple occasion tags and selected-occasion links are supported. No seller product/permission has been verified or invented.
- The collection is directly reachable from the home primary action and mobile navigation. It defaults to 26 original model-led concepts, while fourteen sourced outfits remain accessible through filters and search. Visible occasion and audience controls expose five women's and five men's concepts per each of five events. Its first phone screen shows an outfit, and copy distinguishes photo-free browsing from personal generation. This does not add a no-photo VTO result.
- The 26-look original AI concept edit uses front-facing fictional models and exact same-file VTO references. JPEGs, hashes and generation provenance are in `public/garment_test/editorial/` and `src/data/editorial.ts`. The fourteen sourced photos remain in the optional archive. Concept cards and the try-on dialog identify AI concepts, no retail listing and unreviewed output quality. **No new live YouCam task or model-person fidelity review** has occurred.
- New offline benchmark tool retains the full planned denominator, rejects missing/mock modes as live evidence, reports latency median/range, fails incomplete release checks and reserves 25% of a verified budget. Revised template targets twelve cases: eight owned-garment and four permitted-reference attempts across five people, at least two looks each; the first six are the pilot awaiting separate authorization. **Zero outcomes** are recorded. Tests use synthetic empty evidence so entering real outcomes cannot break their pending-state assertions. No script authorizes or submits live work.
- Read-only budget check on 21 October: signed-in dashboard balance **916 units**; official calculator **Cloth V4 2 units/call**, **AI Facial Color Tones Analyzer V1.0 20 units/call**. Reserve 229, development allowance 687; pilot 12 and full scorecard 24 units. Budget metadata stays `approved:false`; recheck before any batch. No account settings or provider tasks were changed. See [budget evidence](../testing/BENCHMARKS.md).
- Current mock production browser checks passed: camera 7 groups, reference library 3, own-clothes/UI 5 and image preprocessing 5. Coverage includes explicit one-task behaviour, pending success/failure reopen, plain-text429 stop, comparison without tasks, photo-version warnings, expired-image reload, orientation/compression, optional skin and mobile layout. Extra own-upload form checks passed at 320/375/768/1440 px; mobile screenshots were visually inspected. Synthetic/stubbed tests are not physical-phone or live-quality evidence.
- Independent code/React/TypeScript/security review findings were addressed. Standalone ESLint now has a bounded `next/core-web-vitals` configuration; warnings remain for `<img>` and the pre-existing camera cleanup ref. Dev `.next-dev` and production `.next` are isolated after diagnosing cache collisions; `/api/mode` is dynamic so its badge reflects the running server.
- Fresh 21 October integrated verification passed: all ten offline suites; `npx --no-install tsc --noEmit --incremental false`; `npm run lint` (14 existing warnings); `MOCK_MODE=true npm run build`; all four mock browser suites; `git diff --check`. Production VTO tracing includes all 14 local library photos. Independent QA and code/TypeScript review completed; the evidence-fixture review finding was fixed and the affected suite/type check re-run. The actual benchmark CLI reports pending with zero outcomes and calculated budget; `--check` exits1 until quality evidence passes.
- Product/tests checkpoint committed as `52a8487`; the user authorized meaningful verified commits and pushes. `vercel.json` disables automatic Git deployments only for `codex/ui-revamp` so GitHub sync does not deploy the app; other branches keep their existing behaviour. Existing unrelated settings and draft branding are preserved locally. Local 3400 is the user-approved live manual preview; 3500 is the isolated mock QA preview. No new live YouCam task or manual deployment was submitted.
- GitHub branch `codex/ui-revamp` was created and upstream tracking set on 21 October. Product checkpoint `52a8487` and validation/workflow checkpoint `3c8c6cd` were pushed; local and remote SHA `3c8c6cd64e7c1d53cb6c6d0214f99e98780fb9e1` matched with zero ahead/behind. GitHub reported no branch deployments/check runs and a read-only Vercel list showed no new deployment after the push. Only `.claude/settings.local.json` and unpromoted `branding/` remained outside version control; traces/temp screenshot are ignored. Later checkpoint hashes should be verified from Git refs.

**Unmet external gates:** participant/photo preparation (deferred by user on 21 October), approved six-case pilot, twelve-case identity/fidelity benchmark, five consenting users, physical Android/iPhone tests, reference output reviews, final screenshots/video and judge-access/deployment verification. Public live access needs credit/access controls; the client guard is not a server-wide quota. No application licence file exists yet; README no longer asserts an unsupported MIT grant. Do not call M0–M6 complete from implementation alone. See [milestones](../plans/2026-10-20-personal-stylist-milestones.md) and [benchmark protocol](../testing/BENCHMARKS.md).

## Stack

- Next.js, TypeScript, Tailwind CSS. Indian-wedding outfit styling app ("SangeetFit").
- YouCam API integration (skin analysis + clothing virtual try-on), server-side keys; mock mode for local development.

## Core journey

Occasion → owned-clothes/eligible reference recommendations → explicit personal VTO → compare two looks → choose/save. Skin analysis and verified exact seller links are optional.

## Product history — labeled, not reverified

- **[prior report]** Controlled Skin Tone Analysis test: reported successful.
- **[prior report]** Controlled Cloth V4 test: reported failure with engine category `error_pose`.
- **Diagnosis (2026-10-18):** Likely root cause — the app sends the skin-analysis face selfie as VTO source; YouCam Cloth V4 requires a full-body photo. `fullbody_mock.png` (1.9 MB) exists but is never sent by the web app. The `garment_category` param sends `"auto"` for all categories. Hypothesis unverified without live test.
- **[prior report]** Asset mapping:
  - `public/garment_test/fullbody_mock.png` — source/person sample
  - `public/garment_test/user_saree.png` — cream/beige saree
  - `public/garment_test/kurta_set_hd.png` — pink kurta/suit set
  - `public/garment_test/lehenga_ethnic_hd.png` — maroon bridal lehenga
  - `public/garment_test/western_dress_hd.png` — black evening gown
- No successful live VTO output has been established in the supplied history.
- **[prior report]** After asset-reference correction, local contract/regression tests, TypeScript check, production build, and `git diff --check` all passed. These are prior reported results, not proof of the current state.
- **[prior report]** `scripts/garment_test.py` contained the legacy `/file/cloth-v3` contract and stale reduced-asset references. Treat it as a diagnostic script, not the authoritative live VTO workflow, until verified.
- VTO V4 cost is unknown in current evidence. Do not assume V2/V3 pricing applies.

## Hackathon submission verification (2026-10-18)

- Event: YouCam API Skin AI & eCommerce VTO Hackathon on **Devpost**, rules at `https://youcam-api-skin-ai-ecommerce.devpost.com/rules`.
- **Deadline: November 2, 2026, 11:45 AM EST**.
- Mandatory per rules: repo URL (public OR private shared with `support+hackathon@devpost.com`), text description, screenshots, demo video (1-3 min, YouTube preferred, publicly visible), integrates ≥1 YouCam API, functional/installable app, testing access for judges, English materials.
- Corrected prior assumptions: screenshots are **mandatory** (not optional); repo may be private; video link goes on Devpost form.
- See `docs/submission/PITCH_CHECKLIST.md` for full verified checklist with source URLs.

## Mock-mode journey verification (2026-10-18)

- Verified live in this run via `curl` + production build: occasion selector renders, skin mock returns `#b9947c` with `mode:"mock"`, VTO mock returns mapped garment image with `mode:"mock"`, gallery harmony-sorted via URL params.
- `npx tsc --noEmit` PASS (clean). `npm run build` PASS (4 routes, 94.6KB first-load JS). All 8 contract tests PASS (`npx tsx tests/youcam-api-contract.test.ts`; Node 20 lacks `--experimental-strip-types`, used tsx).
- Screenshots reported by sf-qa are **NOT usable for submission**: `01-home.png`, `03-gallery-sorted.png`, `05-vto-result.png` are byte-identical (same MD5 `5c8917e8...`), so they are not distinct UI state captures. Only `02-skin-analysis-upload.png` differs. These must be re-captured with browser tooling before they can be used. The VTO loading state was not captured.
- Mock journey functional state verified (energy: API responses, tsc, build, contract tests all pass); visual screenshot evidence requires re-capture.

## Git state at setup (2026-10-18)

Uncommitted user changes present on `main` (source of truth is `git status --short --branch`): modified API routes `src/app/api/skin/route.ts`, `src/app/api/vto/route.ts`, `src/app/page.tsx`, `GarmentPicker.tsx`, `UploadPanel.tsx`, `tsconfig.json`, `scripts/garment_test.py`, `demo_script_vto.md`; deleted test imagery; added `src/lib/youcam.ts`, `tests/run-contract-tests.mjs`, `tests/youcam-api-contract.test.ts`, `public/garment_test/fullbody_mock.png`, `user_saree.{jpg,png}`. These are the user's work — preserve, do not restore or commit.

## Product definition (2026-10-18)

- `docs/PRODUCT_SPEC.md` is the authoritative product spec: intended journey, image-input architecture, acceptance-criteria matrix, cost guardrails, submission realism.
- `docs/testing/REAL_USER_VALIDATION.md` defines the 5-real-user live validation protocol (≥5 distinct live sessions; mock-only excluded).
- **Confirmed fact:** the web app stores ONE image (the face selfie from skin analysis) and reuses it as the VTO source. No full-body photo input exists in the active UI (`UploadPanel.tsx`/`GarmentPicker.tsx` are orphaned, not imported). `fullbody_mock.png` is unreachable from the live web flow. The `error_pose` cause remains a hypothesis (T3/T4).

## Separate photo-input implementation (2026-10-18, Task 3)

Verified in this run. The face selfie (`selfieDataUrl`) is now used for **Skin Tone Analysis only**), and a new separate full-body photo (`fullBodyDataUrl`) is the VTO source.
- `src/app/page.tsx`: full-body upload prompt + preview + replace in the VTO modal; `runVTO` sends `{ fullBodyDataUrl, garmentId, category }` (NOT the face selfie); selection preserved across outfit changes; auto-run gated on the full-body photo.
- `src/app/api/vto/route.ts`: reads `fullBodyDataUrl`; validates image type + ≤10MB before any external request; live mode rejects a missing source (no sample fallback, no face selfie reuse); mock labeled `mode:"mock"` and uses bundled `public/garment_test/fullbody_mock.png` as the sample source.
- `src/app/api/skin/route.ts`: unchanged — still uses the face selfie (`imageDataUrl`).
- Verified: `npx tsc --noEmit` clean; all 8 contract tests PASS (via `npx tsx`); `npm run build` PASS; `git diff --check` clean; mock smoke tests PASS (skin `#b9947c`, VTO `/garment_test/lehenga_ethnic_hd.png`, invalid full-body → 400 `"Full-body photo must be a valid JPG or PNG image"`).
- **Live VTO remains unresolved (no live run).** The `error_pose` hypothesis is untested live; requires an approved paid diagnostic (T4).
- TASK_BOARD reordered: product def → fix source flow (T3) → approve live VTO test (T4) → screenshots+video (T5/T6) → 5 real-user sessions (T7) → submission checks (T8).

## Live Cloth V4 diagnostic — SUCCESSFUL, single case (2026-10-18)

Exactly one approved live task, per user authorization. Sanitized record (no ids, no task URLs, no credentials):
- Source: `public/garment_test/fullbody_mock.png` (1,906,097 bytes; full-body PNG).
- Garment reference: `public/garment_test/lehenga_ethnic_hd.png` (~3.4 MB PNG).
- `garment_category: "auto"`. Transitions observed: `running → running → running → success`, ~12 s total.
- Result URL returned (host only: an S3 endpoint). **No retries, no extra tasks** — exactly one task submitted.
- **Conclusion:** the live VTO pipeline works for this specific source/reference pair. Working hypothesis supported, not conclusively proven: The earlier `error_pose` failure occurred when the VTO flow used a face-crop selfie. A subsequent single live Cloth V4 task succeeded with a full-body source image and the intended garment reference. This supports using a full-body source for VTO, but does not independently establish the cause of the earlier failure.
- **NOT claimed:** broad reliability, multi-garment behavior, five-user validation, or production readiness. V4 pricing and actual unit deduction remain unverified — check the YouCam console before scheduling further live tasks.
- Executed via a one-shot `/tmp` script reusing the app's documented upload contract (POST /file → presigned PUT → POST /task/cloth-v4 → poll), consistent with `src/lib/youcam.ts` / `vto/route.ts`. Repo untouched; `MOCK_MODE` unchanged.

## Browser QA + screenshots (2026-10-18, Task 5)

- Ran real browser QA via Playwright (Chrome) against a `MOCK_MODE=true` dev server on :3100.
- **Found + fixed a HIGH UI bug** in the new full-body flow: a stale closure in `src/app/page.tsx` made the primary upload→auto-run VTO path fail with a false "Please upload a full-body photo before trying on outfits." error and fire no `/api/vto` request. Fixed by making `runVTO` accept an explicit source argument and passing the just-read `dataUrl` from `reader.onload`; updated the contract-test body assertion to `{ fullBodyDataUrl: src, ... }`. Re-verified: the request now fires with the full-body source and the mock result renders correctly.
- **7 genuine, distinct screenshots** captured (all unique MD5) into `docs/submission/screenshots/`: 01-home, 02-skin-analysis-upload, 03-skin-result, 04-gallery, 05-fullbody-upload, 06-vto-mock-result, 07-share. Old invalid 3-identical batch deleted.
- Checks after fix: `npx tsc --noEmit` clean; all 8 contract tests PASS; `npm run build` PASS; `git diff --check` clean. Live VTO still unresolved.

## Preview deployment verification (2026-10-19)

- Preview deployment for `feat/menswear-catalog-vto-mapping` @ `9906dbb` identified via Vercel MCP (vercel-render-local): deployment `sangeet-3o8om0dg4`, alias `sangeet-fit-git-feat-menswear-catalog-vto-mapping-ryuk-codes.vercel.app`, state **READY**. GitHub "Vercel" check on `9906dbb` = success.
- **All deployments (preview AND production) are SSO-gated** by Vercel Deployment Protection — anonymous curl returns 302 to `vercel.com/sso-api`. Vercel CLI was logged out until the user completed `vercel login` (2026-10-19, account gamer69cool-6398). Local repo has **no `.vercel/` project link** — all Vercel commands must pass `--project sangeet-fit` explicitly; linkage intentionally NOT created (read-only policy).
- **Deployed Preview mode (verified via `vercel curl --deployment`, 2026-10-19): `{"mode":"unconfigured"}`.**
- **Env scope (verified via `vercel env ls`, names only, no values):** `YOUCAM_BASE_URL` and `YOUCAM_API_KEY` are scoped **Production only**; `MOCK_MODE` is scoped Production + Preview. Preview therefore has no API key → mode `unconfigured`. Since preview mode is `unconfigured` (not `mock`), MOCK_MODE's Preview value is evidently not `"true"`. Base-URL host/path shape unverifiable without fetching the secret (forbidden). Production runs the older `work/sangeetfit-mvp` commit (b3cadb6), which has no `/api/mode` route (404).
- Local browser QA on the same commit (production build, `MOCK_MODE=true` forced via shell env, port 3100): 8/8 checks PASS — homepage, badge↔`/api/mode` agreement, occasion selection, audience filtering (2 women / 3 men on sangeet), unsupported-outfit gating (no modal), full-body preview + mock VTO render, oversized-upload error + preview preserved, sanitized API errors (`Unknown outfit`/`Unknown garment reference` 400s), honest labeling ("Catalog preview image — not your photo, not an AI result"; mock results labeled "Mock placeholder", never "live render").
- Minor finding: `/api/skin` mock short-circuit (route.ts ~L75) skips `parseDataUrl` validation, unlike `/api/vto` which validates before the mock branch. Harmless in mock; candidate small fix later.
- **Live Skin Analysis test: NOT submitted and NOT ready.** Deployed Preview is `unconfigured` (no Preview-scoped `YOUCAM_API_KEY`). Unblock requires scoping `YOUCAM_API_KEY` + `YOUCAM_BASE_URL` to Preview (env edit + redeploy) — needs explicit user approval. No paid calls made in this run.

## Branch-Preview configuration + single live Skin Analysis (2026-10-19, user-authorized)

- Vercel CLI authenticated (gamer69cool-6398); repo linked to `ryuk-codes/sangeet-fit` (`vercel link`; it appended `VERCEL_OIDC_TOKEN` to `.env.local` and added `.vercel` to `.gitignore` — `.env.local` key values preserved).
- Added three **branch-scoped** Preview Secrets for `feat/menswear-catalog-vto-mapping` only (values via 600-perm stdin temp files, never in argv, temp files removed): `YOUCAM_BASE_URL` (verified locally to equal `https://yce-api-01.makeupar.com/s2s/v2.0` exactly), `YOUCAM_API_KEY` (from `.env.local`), `MOCK_MODE=false`. Global Preview and Production untouched (verified via `env ls`).
- Redeployed the exact preview via `vercel redeploy --target preview`: new deployment `sangeet-8l4yv5p30`, READY, same commit `9906dbb`. **`vercel curl /api/mode` → exactly `{"mode":"live"}`.**
- **Exactly one live Skin Analysis request executed** (POST /api/skin, source `public/garment_test/fullbody_mock.png` 1080×3264, ~2.5 MB payload, temp payload deleted). Pipeline ran fully (upload → task submit → poll), 13 s round-trip; task returned **task-level failure**: `"Task failed: The input image is smaller than the minimum size (320x320px)"` — sanitized, HTTP 200 envelope `{success:false}`. **No retries, no second task** (user rule). Hypothesis (unverified): the 320×320 minimum applies to the detected face crop, which is small in a full-body image; a ≥320px face crop is the likely fix — requires a new approved request to test.
- Credit consumption for the failed task: unknown/not checked. No VTO task run. Production, `acqr`, commits, and application code untouched; working-tree changes limited to `.gitignore` (by `vercel link`), `PROJECT_STATE.md` (these notes).

## Face-selfie test asset + routing tests (2026-10-19)

- Root-cause refinement of the Skin Analysis failure: the input was the full-body asset (1080×3264) whose detected face region is only ~180×317 native px — below YouCam's (hypothesized, unverified) 320×320 minimum. No repo asset had adequate face detail.
- New dedicated asset: `public/garment_test/face_selfie_test.png` — **340×420 native crop** (no upscaling) of `fullbody_mock.png`'s head region; visually verified front-facing, well-lit, both eyes visible. Caveat: if YouCam's 320px check is on the detected FACE box rather than the image, the ~230×290 face inside may still be rejected — one approved attempt needed to discriminate.
- Frontend routing re-verified in source: selfie → `analyzeSkin` → POST /api/skin `{imageDataUrl}`; full-body → `runVTO` → POST /api/vto `{fullBodyDataUrl}`; selfie never used as VTO source; `fullBodyDataUrl` never cleared on upload failure (preview retained).
- New offline suite `tests/image-input-routing.test.ts` (6 asserts, plain tsx, no network): routes/distinction, preview retention, asset dims, and a behavioral test proving a selfie-only VTO body is 400-rejected before any network call. All 4 test suites PASS, `tsc --noEmit` clean, `npm run build` PASS. Preview remains live (`sangeet-8l4yv5p30`); no further YouCam request submitted.
- **Second approved live Skin Analysis (2026-10-19): SUCCESS.** Same deployment, source `face_selfie_test.png` (340×420 native crop). Full pipeline ran once (~13 s), returned `{"success":true,"skin_color":"#a97f61","mode":"live"}` — sanitized, no ids/URLs/credentials logged. **Conclusion: the 320×320 error is resolved by a native face crop.** Scope: Skin Analysis only — VTO (Cloth V4) still has exactly one successful case and remains unvalidated at scale; credit deduction still unverified.

## Live VTO through the deployed Preview route (2026-10-19, single approved task)

- Request: `wedding-01` (Maroon Bridal Lehenga, `lehenga-choli`) × reference `lehenga_ethnic_hd.png`, source `fullbody_mock.png`, exact route schema (`fullBodyDataUrl`/`garmentId`/`referenceAsset`/`vtoSupported`/`displayImage`), sent via authenticated `vercel curl` to `sangeet-8l4yv5p30` (`{"mode":"live"}` confirmed pre-flight).
- **Result: SUCCESS — `{"success":true,"mode":"live"}` with a generated result URL** (~20 s end-to-end; one metadata upload + one signed PUT + one Cloth V4 task + polling; exactly one task, no retries). Result URL host is an S3-accelerate endpoint (not a catalog `/outfits/` path), confirming a genuine generated asset; URL not stored or printed (signed, time-limited).
- The UI consumes this URL directly as the result `<img>` source (verified in `page.tsx`); visual quality not assessed (would require fetching/displaying the image — left to the user's browser).
- Scope: single case, single garment. NOT claimed: multi-garment reliability, credit deduction, production readiness. Working tree preserved (asset + tests + doc notes uncommitted).

## Face-camera reliability (2026-10-20)

- Fixed the camera's MediaPipe integration: `FaceDetector.createFromOptions`, `detectForVideo(video, timestamp)`, result `.detections`, and bounding-box `originX`/`originY`. The previous `fileset.faceDetector` call always failed into the static fallback. API checked against Google's official Web guide and JS reference.
- Camera streams, detector instances, and inference timers now belong to one effect session. Capture, cancel, retake, unmount, late permission responses, and late model initialization release resources. Capture remains available while the model loads or if tracking fails.
- Tracking coordinates and saved JPEG use the same centered portrait crop as the preview. Poor-light guidance also runs without face tracking and overrides an otherwise well-framed face. Added status/error announcements, wrapping camera actions, keyboard focus styles, and reduced-motion support.
- Added `tests/face-camera.test.mjs`: Playwright browser regression using synthetic camera frames and a contract-faithful model stub. Reproduced the tracking failure before the fix; seven browser check groups pass after it (framing/light, capture/retake/confirm routing, late permission/model cleanup, denied permission recovery, failed inference/CDN fallback, mobile overflow). Run against a mock server on port 3100 with `node tests/face-camera.test.mjs`; set `PLAYWRIGHT_MODULE_PATH` to an existing Playwright installation if needed. No dependency added.
- Also verified in headless Chrome with the **actual pinned CDN module, WASM, and model**: initialization and inference on a synthetic frame succeeded. This does not establish real-person detection accuracy or phone-browser compatibility.
- Verification: all five existing offline TypeScript suites pass; `npx --no-install tsc --noEmit`, `MOCK_MODE=true npm run build`, and `git diff --check` pass. All seven browser check groups also pass against the production build (`MOCK_MODE=true npm start -- --port 3100`). Build retains the pre-existing warning about `outputFileTracingIncludes` in `next.config.mjs`. Independent `sf-reviewer` found no actionable issues in the camera changes.
- No live YouCam requests, deployment, commit, or push. Pre-existing branding and documentation changes preserved.

## Internet-sourced Indian wear library (2026-10-20)

- Added 14 locally hosted photos under `public/garment_test/library/` (4,682,875 bytes total): 8 women's and 6 men's outfits. Each audience has editorial selections across all five occasions. Sources are Wikimedia Commons file pages, individually checked for CC0, public-domain dedication, CC BY-SA 3.0 or CC BY-SA 4.0 licensing. Exact author/license/source/download URLs, date, processing, dimensions and local-file SHA-256 are recorded in `src/data/indian-wear.json`; readable credits and extension instructions are in `docs/garment-library/README.md`.
- Two read-only source scouts inspected the women's/menswear candidates. Excluded an illustration and dubious-origin sherwani images; no clean frontal sherwani was established. After a Wikimedia 429 on import, stopped further downloads and reused already-fetched, inspected caches with recorded original/thumbnail provenance. No local crop/recolor/AI alteration of imported photos.
- Added `/library`: search, collection/occasion filters, reference-only filter, resettable empty state, per-photo credits, and direct try-on links. The existing gallery now includes these entries and credits, with complete images contained in consistent portrait stages. Original 17 catalog IDs/assets remain; total catalog is **31 outfits with 12 enabled reference mappings** (4 existing + 8 new candidates).
- Eight new matching references are wired; six photos remain **browse-only** because of side poses, foreground obstruction, small subjects or museum framing. New references are explicitly labeled **AI quality untested**. They have not been submitted to live YouCam. Mock placeholders are derived from the server catalog, preventing a client-supplied image from substituting another outfit. New JPEG and PNG references retain correct MIME types and upload basenames.
- Independent review caught a duplicate-request path in URL restoration: a full-body upload changed the restore callback and scheduled a second VTO task. Removed state-driven automatic task submission from restoration; stable callback now only opens the requested outfit. Production browser regression verifies zero tasks on navigation and exactly one VTO request after confirmed full-body upload, with no skin-analysis request.
- Moved `outputFileTracingIncludes` under `experimental`, matching the installed Next.js 14 schema and official v14 docs. Production build emits no previous invalid-config warning; all 14 library assets are confirmed present in `/api/vto`'s final `.nft.json` trace.
- Verification: all **7 offline TypeScript suites** pass (including exact JPEG/PNG upload bytes through a fully stubbed live route), TypeScript check/build/diff checks pass; all 14 files decode and match recorded dimensions/hashes. Production browser checks pass for photo loading/credits/mobile overflow, combined filters/reset, and linked single-request mock try-on. The existing seven camera browser check groups also pass. Independent reviewer found no remaining issues after the URL fix.
- No paid YouCam request, deployment, commit or push. Pre-existing camera, branding and newly added agent configuration files preserved. Local production preview remains mock mode on port 3100.

## Key links

- Agent workflow skill: `.claude/skills/sangeetfit-workflow/SKILL.md`
- Backlog: `docs/agent-workflow/TASK_BOARD.md` · Playbook: `docs/agent-workflow/PLAYBOOK.md`
- Product spec: `docs/PRODUCT_SPEC.md` · Validation: `docs/testing/REAL_USER_VALIDATION.md`


## Warm festive UI revamp (2026-10-20)

- User authorized implementation on `codex/ui-revamp`, choosing warm festive styling for the personal occasion recommendation/try-on app. No marketplace, shopping cart, retailer integration or native binary was added.
- Rebuilt occasion home, optional selfie step, searchable outfit gallery, all-occasion session shortlist, navigation and fitting-room dialog using existing brand colours, local credited photos and installed Lucide icons. Mobile has reachable bottom navigation; desktop has the outfit collage. The main gallery shows credited photographic references; legacy illustrated catalog records and their direct links remain intact. Collection/library and legal credits now use the same ivory/burgundy palette. Skin analysis can be skipped; colour similarity no longer appears as a validated suitability percentage. Skin mock sample and VTO mock reference results are labelled honestly.
- Face camera component, crop geometry, stream/model lifecycle and server API contracts were preserved. Existing face and full-body input routes remain separate. VTO viewer contains the entire result image, supports source replacement after success, and separates image reload/open from generation retry. Request IDs ignore stale responses after close; modal keyboard trap, Escape, focus restoration and background scroll cleanup are implemented.
- Own-clothes upload, persistent wardrobe, saved generated-result comparison and reliable identity preservation are still future work; none are represented as working UI controls. Shortlist consists of session-only outfit IDs and survives neither refresh nor leaving the page. Shared links point to outfit choices, not personal result photos.
- Verified against current source: all 7 offline TypeScript suites; `npx --no-install tsc --noEmit --incremental false`; `MOCK_MODE=true npm run build`; `git diff --check`. Production mock browser tests pass: 7 camera groups, 3 library groups, and 4 new UI groups covering responsive widths 320/375/768/1440, skip-analysis, search, shortlist empty state, modal focus/consent transition/escape, one source-only request, image containment, late-response dismissal, image reload without another task, hidden-modal scroll/focus behaviour, and invalid replacement feedback while retaining a successful result. Desktop/mobile home, mobile selfie and gallery screenshots reviewed locally.
- Read-only scout and scoped shell builder assisted implementation. Independent React review identified two modal keyboard issues and TypeScript review identified generation retry on an image-load failure; fixes were reviewed and browser regression-tested. Standalone ESLint is not configured in this existing repo and was not verified; build and TypeScript checks pass.
- Local production preview is `http://localhost:3400`, explicitly mock mode. No paid/live YouCam tasks, deployment, commit or push. Pre-existing work preserved. Physical-camera/phone-browser accuracy and real generated face/garment quality remain unverified by this UI task.

## Five-event celebration wardrobe (2026-10-21)

- Product angle: plan outfits from clothes already owned across Sangeet, Mehendi, Haldi, Wedding and Reception; consciously rewear a piece; use AI model-led candidates for optional inspiration; try on and compare uncertain choices. This differentiator is a product hypothesis, not measured user demand.
- Home now leads with “Five moments. One wardrobe.” and opens a session-only planner without a person photo. Each event accepts one owned outfit or a clearly labelled candidate concept. Assignment/reassignment and opening the fitting room do not submit a task; only explicit Generate does. Removing an uploaded garment clears any event slots using it. No accounts, seller workflow or persisted wardrobe were introduced.
- Verified on the current source: seven offline TypeScript suites passed; `npx --no-install tsc --noEmit --incremental false` passed after build; `npm run lint` exited 0 with image/ref warnings; `MOCK_MODE=true npm run build` passed; mock browser suite passed board assign/rewear/remove/no-task assertions and no overflow at 320/375/768/1440 px. Mobile and desktop board screenshots were inspected locally. `git diff --check` passed.
- No live YouCam calls or deployment. The own-garment identity/fidelity pilot, device checks and participant usefulness evidence are still pending. These local checks do not promote any candidate reference to live-reviewed.
