# PROJECT_STATE.md

Durable, verified facts about SangeetFit. Prior-generation results not rechecked in the current working tree are explicitly labeled **[prior report]**. Update this file when durable facts, verified outcomes, major decisions, or blockers change — not as a running log.

## Stack

- Next.js, TypeScript, Tailwind CSS. Indian-wedding outfit styling app ("SangeetFit").
- YouCam API integration (skin analysis + clothing virtual try-on), server-side keys; mock mode for local development.

## Core journey

Occasion selection → Skin Tone Analysis → Personalized outfit recommendations → Virtual try-on (VTO) → Save/share the resulting look.

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

## Browser QA + screenshots (2026-10-18, Task 5)

- Ran real browser QA via Playwright (Chrome) against a `MOCK_MODE=true` dev server on :3100.
- **Found + fixed a HIGH UI bug** in the new full-body flow: a stale closure in `src/app/page.tsx` made the primary upload→auto-run VTO path fail with a false "Please upload a full-body photo before trying on outfits." error and fire no `/api/vto` request. Fixed by making `runVTO` accept an explicit source argument and passing the just-read `dataUrl` from `reader.onload`; updated the contract-test body assertion to `{ fullBodyDataUrl: src, ... }`. Re-verified: the request now fires with the full-body source and the mock result renders correctly.
- **7 genuine, distinct screenshots** captured (all unique MD5) into `docs/submission/screenshots/`: 01-home, 02-skin-analysis-upload, 03-skin-result, 04-gallery, 05-fullbody-upload, 06-vto-mock-result, 07-share. Old invalid 3-identical batch deleted.
- Checks after fix: `npx tsc --noEmit` clean; all 8 contract tests PASS; `npm run build` PASS; `git diff --check` clean. Live VTO still unresolved.

## Key links

- Agent workflow skill: `.claude/skills/sangeetfit-workflow/SKILL.md`
- Backlog: `docs/agent-workflow/TASK_BOARD.md` · Playbook: `docs/agent-workflow/PLAYBOOK.md`
- Product spec: `docs/PRODUCT_SPEC.md` · Validation: `docs/testing/REAL_USER_VALIDATION.md`
