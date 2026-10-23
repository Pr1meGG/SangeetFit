# Wedding wardrobe decision tool

Source: user-approved plan, 23 October 2026.

## Outcome and boundaries

Connect comparison to the five-event wardrobe plan, show factual planned-rewear counts, and export a text-only plan. Preserve session-only photos and the existing YouCam contracts. Live tasks, deployment, participant contact and publication are separate gates, not authorized by implementation.

## Work and acceptance

1. Repair the current draft TypeScript errors without mounting unfinished family/combo/persistence features. Colour suggestions remain exploratory.
2. Assign comparison outfits to the explicitly named current occasion using parent state. Different photo versions share the outfit assignment. Removing a result preserves assignments; removing a garment clears them.
3. Derive valid event assignments, distinct owned outfits and planned rewears (owned assignments minus distinct owned IDs). Ignore stale IDs; references never contribute to owned counts.
4. Render a dedicated text-only print target outside the app surface. Print only event/garment/source text and counters. Inspect a real PDF from a populated session with an open result and synthetic access code.
5. Prepare the two-owned-garment pilot, 3–5 guest facilitator sheet, judge-access preflight and accurate demo/submission materials. Record pending evidence as pending.
6. Run mock offline/browser suites, canonical TypeScript, lint, production build, diff checks, responsive/keyboard/PDF checks and independent review. Update durable state with actual outcomes.

## Ownership and rulings

- Primary: shared page/CSS, comparison, event board, session derivation, print target, browser/unit regressions, README, integration and project state.
- Baseline builder: four existing untracked draft modules and narrowly justified persistence test.
- Submission writer: declared validation/submission docs only.
- Ruling: reuse the current `CC-P` feature checkout because the approved work depends on its existing uncommitted UI. Preserve unrelated changes; no resets or fresh checkout that drops them.
- No new backend API, database or dependency. Use native browser printing.

## Verification record

- Before implementation: prior turn's fresh TypeScript check reported 11 errors. The baseline builder reproduced all 11 during this implementation turn.
- Task 1 complete: baseline repairs reproduced and removed all 11 TypeScript errors; standalone persistence tests went from two failures to 3/3 passing. Drafts remain unmounted.
- Tasks 2–4 implemented: scalar plan summary, comparison-to-event assignment, owned-only counters and dedicated text-only print surface. Summary regression failed first, then passed; browser regression failed on the absent assignment action, then passed.
- Final review: code/delivery and TypeScript reviews found no actionable findings. React review found a cross-occasion reference missing from its event selector. The pilot browser regression reproduced the empty selector; selected-reference fallback and explicit outside-tag note repaired it, and the full mock run passed.
- Verification complete: final `TEST_PORT=3533 npm run verify` exited 0 with 16 enumerated offline suites (15 executed, real Redis skipped), canonical TypeScript, lint with 0 errors/22 warnings, mock build and 10 browser suites. `git diff --check` passed.
- Actual final PDF read-back: one page, five events, owned/reference and empty-slot text, zero images or annotations, no synthetic access/result markers. Poppler render inspected.
- Task 5 preparation complete: pilot, guest facilitator, judging preflight and submission docs prepared; live/guest/release/publication outcomes remain pending.
- Ruling: native print uses a direct body sibling containing scalar data only; the entire interactive app is hidden during print. This covers open private dialogs without copying any app markup.
- Visual regression: desktop garment images overflowed fixed-height grid slots. Added a bounds assertion and observed failure at 1440px; fixed grid-item minimum dimensions and frame overflow. Final browser geometry passes at 320/390/1440.
- Checkpoint boundary: local commit only. `vercel.json` disables auto-deployment only for `codex/ui-revamp`; the current `CC-P` branch is unspecified and defaults to enabled. Push is held to preserve the user’s separate deployment approval boundary.
