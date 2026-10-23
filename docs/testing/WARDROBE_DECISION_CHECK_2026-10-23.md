# Wardrobe decision tool — local verification

23 October 2026. Tested on `CC-P`, based on `dd8888f`, with the implementation in the working tree. These results describe local mock/synthetic behavior, not a deployment, real participant study or live YouCam quality.

## Implemented and exercised

- Comparison assigns the outfit to the explicitly named current occasion. Two renders of one outfit share its assignment; a later photo version does not create another wardrobe item.
- Removing a result preserves event assignments. Removing a garment clears only its slots. Clearing the private session resets the plan and consent.
- The board counts valid events, distinct owned outfits and planned rewears (owned assignments minus distinct owned IDs). References do not contribute to owned counts. An out-of-tag reference deliberately chosen from comparison remains visible in its selector with an outside-tag note.
- Native printing includes only a dedicated scalar-text plan sibling; the rest of the application, including open private dialogs, is hidden. No photo/result persistence was connected.
- All 11 initial TypeScript errors were repaired. Family sharing, combinations and persistence remain unmounted drafts. Colour ideas are labelled exploratory, not measured undertone or suitability.

## Commands and actual results

| Check | Result |
|---|---|
| `TEST_PORT=3533 npm run verify` — final run | Exit 0 |
| Offline contracts | 16 suites enumerated; 15 executed, real Redis suite explicitly skipped locally |
| Canonical `next typegen` and TypeScript | Pass |
| ESLint | Exit 0; 0 errors, 22 warnings (predominantly existing image warnings) |
| Mock production webpack build | Pass |
| Mock browser suites | All 10 pass; no provider work |
| `git diff --check` | Pass |
| Independent reviews | Code/delivery and TypeScript: no actionable findings. React selector finding reproduced, fixed and covered by passing full verification |

Regression evidence: the scalar-summary test failed before implementation; the assignment browser test failed on the missing plan action before integration; the cross-occasion reference test showed an empty select before its fix. Two persistence regressions failed before the baseline repair, then 3/3 passed.

Visual inspection also exposed portrait images painting outside desktop board preview slots and covering event text. A new bounds assertion reproduced the failure at 1440px. Zero minimum grid-item dimensions and clipping at the preview frame repaired it; final bounds checks pass at all three widths and fresh screenshots replace the earlier evidence.

The final browser flow used synthetic solid-colour JPEGs and exactly three intercepted mock VTO responses. Adding clothes, assigning/replacing events, comparing, printing, removing and clearing added zero generation requests. Separate catalogue regression used exactly two intercepted responses. These are app request counts, not live provider-task results.

## Actual PDF and visual evidence

- [Exported plan](wardrobe-decision-2026-10-23/wardrobe-plan.pdf), [PDF page render](wardrobe-decision-2026-10-23/plan-page-1.png) and [extracted text](wardrobe-decision-2026-10-23/plan-text.txt).
- Actual final PDF read-back with `pypdf`: one page; all five events, owned/reference labels, two owned outfit names and an undecided slot. Zero images and annotations; no synthetic access code, result marker, provider URL or data URL. Poppler rendered the PDF for visual inspection.
- [320px board](wardrobe-decision-2026-10-23/board-320.png), [390px board](wardrobe-decision-2026-10-23/board-390.png), [1440px board](wardrobe-decision-2026-10-23/board-1440.png). All three widths passed horizontal-overflow and 44px print-control checks. Keyboard Enter invoked native print. Board/PDF images are synthetic test evidence, not personal try-on quality.
- The PDF was produced with a populated session and an open result dialog; a synthetic access code had been entered. The entire interactive app and its images/controls were absent from print media.

## Evidence still required

- [Two owned-garment live cases](OWN_GARMENT_PILOT.md): exact inputs, transmission/publication permissions, bounded approval, visible rendering and participant identity/garment ratings. No new live task ran.
- [3–5 guest sessions](WARDROBE_GUEST_PLAYTEST.md): no participants contacted or outcomes invented.
- [Judge release](JUDGING_ACCESS_PREFLIGHT.md): no deployment, live activation, budget increase or judge-access verification. Actual Android/iPhone printing and live signed-result saving remain untested for this change.
- Final permitted demo recording, video publication, private repository judge access and submission remain separate work.

Pre-existing API polling edits, local settings, AGENTS/config changes, draft branding, unrelated scripts and traces were preserved. Local results must not be described as a test of a different remote SHA or deployment.

Checkpoint is local only: `vercel.json` disables automatic deployment for `codex/ui-revamp`, while the active `CC-P` branch is unspecified. A push could trigger Vercel under its default rule, so no push was performed without resolving the separate deployment boundary. No deployment configuration was changed.
