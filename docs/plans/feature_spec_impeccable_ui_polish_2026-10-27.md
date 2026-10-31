# SangeetFit UI polish — review plan

**Date:** 27 October 2026 (IST)
**Status:** Proposed; awaiting user review. No application changes authorized by this plan.
**Source:** Current request to use Planning System, then Impeccable, and stop before implementation. User confirmed **home plus the core try-on journey**.
**Baseline:** `codex/redesign-v2`, HEAD `4c4ed65`, plus the current uncommitted work. HEAD alone does not describe this interface.

## 1. Outcome and ambition

Help a wedding guest move from outfit inspiration to a considered preview with a coherent, readable interface. Preserve SangeetFit’s current identity: Bodoni Moda, burgundy, ivory, dark editorial home, gold accents, existing logo, photographs and factual copy.

| Planning System lens | Contribution to this plan |
| --- | --- |
| Altitude | Make choosing and trying an outfit feel clear and composed across the journey, beyond making the landing page attractive. |
| Depth | Start from current rendered screens, computed styles, actual component callers and existing regression assertions. Judge improvement using matched before/after captures and real task completion. |
| Range | Balance fashion art direction with mobile usability, accessibility, honest AI status and privacy. Treat task controls more quietly than the home’s editorial display. |
| Speed | Reuse existing tokens, assets, components and tests. Change the narrowest relevant CSS rules; add markup only when grouping or semantics require it. |

**Depth changes the result most:** current evidence shows precisely where readability and task hierarchy weaken. Another palette or typeface would not address that.

## 2. Evidence and design authority

Impeccable v4.7.1 context ran once for `src/app/page.tsx`. There is no `PRODUCT.md`, `DESIGN.md` or matching surface brief. Its `SCOPED_EXISTING_ALLOWED` directive permits incumbent refinement without initializing a replacement visual world. This is a polish proposal, not a rebrand. Project-context initialization can be a separate follow-up.

Relevant existing plans: [home composition and motion](2026-10-26-home-motion-refinement.md), [earlier premium exploration](2026-10-26-premium-polish-brainstorm.md), and [latest light-polish boundaries](2026-10-27-polish-deploy.md). The older [style audit](../style-system.md) is historical input: several proposed tokens and tabular numerals already exist. Do not repeat its old counts or apply its radius/type recommendations mechanically.

### Observed now

- Home inspected at 1440px desktop and 390px phone. The two-line serif headline, dark field, arched outfit images and three-section composition already form a coherent identity. Keep them.
- At 390×844, the gallery header, actions, occasion filters and collection/search controls occupy the initial viewport; outfit imagery begins below it. This is the strongest visible task-flow opportunity.
- Consent-stage fitting room inspected at 390×844 and 1440×1000. Desktop title computes to 40px while garment provenance is 10px; disclosure text is 13px. The large display title and small supporting text weaken the task hierarchy.
- Phone home showed no horizontal overflow at 390px. This is one baseline observation, not a responsive certification.
- A separate temporary copy of current source ran with mock mode and no provider key on port 3572. The normal port-3500 server reported live mode and had HMR WebSocket errors and unresponsive client controls during inspection; it was left untouched. No root cause or production defect is claimed.
- Mock walkthrough used only public catalogue imagery: home → Sangeet → skip optional selfie → browse → open fitting room → close → home. No photo upload, generation, save or share action was exercised. Resource inspection found no VTO, skin or shared-results requests on that walkthrough.
- The mock development preview reported warnings; it is inspection evidence, not a clean production-build result. Result/loading/error states remain code-based planning evidence, not rendered checks in this pass.

Local baseline captures are ignored inspection artifacts, not publication assets:

- [Desktop home, mock](../../.playwright-mcp/polish-plan-home-desktop-mock-2026-10-27.png)
- [Phone home, mock](../../.playwright-mcp/polish-plan-home-phone-2026-10-27.png)
- [Phone gallery](../../.playwright-mcp/polish-plan-gallery-phone-2026-10-27.png)
- [Phone fitting room](../../.playwright-mcp/polish-plan-dialog-phone-2026-10-27.png)
- [Desktop fitting room](../../.playwright-mcp/polish-plan-dialog-desktop-2026-10-27.png)

## 3. Proposed design

**Direction: a considered celebration wardrobe.** The home invites exploration; the outfit and fitting-room surfaces make the next action clear. Preserve all wording and behavior; improve hierarchy through composition, type, spacing and control treatment.

| Surface | Proposed polish | Visible review criterion |
| --- | --- | --- |
| Home | Preserve the hero, five occasions, closing invitation and footer. Align text/image edges, refine spacing between headline, body and actions, and improve small captions. Keep the existing arch silhouettes and image crop intent. | The same recognizable home, with easier reading and more deliberate alignment at matched sizes. Keep the primary planning action prominent and browsing/owned-clothes actions accessible. |
| Home typography | Keep Bodoni for display and the existing system sans for controls. Preserve the two-line headline and current italic emphasis. Use consistent reading roles rather than shrinking copy to protect layout. | No headline clipping or third-line accident at normal supported sizes; at enlarged text, allow reflow rather than enforcing two lines. |
| Optional selfie step | Tighten title/support spacing and make the existing skip action easy to find. Preserve camera/upload controls, permission language and optional analysis. | Browsing without a selfie stays obvious; no new decision or automatic analysis. |
| Outfit gallery | Reduce excessive header/action spacing on phones; group existing actions and filter rows more tightly. Keep every filter visible and retain distinct recommended/reference sections. Refine card name, explanation and action hierarchy. | The first outfit starts earlier than the baseline at 390×844, without hiding controls, truncating labels or reducing touch targets. |
| Fitting room | Keep the light surface and pink header. Target a quieter 32px desktop / 24px phone title, a clear garment-reference row, readable disclosure, and deliberate spacing between consent, photo preparation and action areas. | Consent is the immediate primary action before permission; disabled Generate remains present but clearly secondary until ready. Once ready, Generate is the primary action. |
| Result and recovery | Refine spacing around existing mode label, disclaimer, image and actions. Keep the preview visually dominant; group save/open and secondary actions clearly. | Mock/live status and limitations remain visible; full garment is inspectable; image-load recovery remains discoverable without generating again. |
| Shared visual details | Use existing spacing, motion and color tokens where their roles match. Consolidate only conflicting rules in the touched selectors. Preserve pills for actions, arches for editorial imagery and simple result frames. | Similar controls agree across the selected journey without a global radius or type-size sweep. |

### Proposed reading and interaction rules

- Supporting reading copy: generally 14–15px, with a comfortable line height around 1.6. Primary form labels and action labels: at least 14px where layout allows. Metadata: 12px; critical permission/result explanations: at least 14px. These are scoped targets for review, not a change to every root token.
- Keep input/select text at least 16px on phones to avoid focus zoom. Keep icon-only and primary touch controls at least 44×44px.
- Burgundy remains the primary action color on light task surfaces; gold remains the home’s accent. Preserve distinct success, warning, error and mode meanings. Measure contrast rather than approving it by appearance.
- Keep current hover lift, pause controls and reduced-motion handling. No new looping animation, scroll effect, texture, font or asset download is needed.
- Preserve source notes, AI status and privacy disclosures in full. No new claims, testimonials, promises or replacement logo.

## 4. Impact and implementation sequence after approval

**Blast radius: Medium.** Several journey surfaces share one stylesheet, which also styles out-of-scope library, comparison, planning and camera UI. There are no proposed data, API, dependency, route or provider changes.

| Area | Evidence and status | Planned boundary |
| --- | --- | --- |
| Home, optional selfie, gallery | Confirmed: `src/app/page.tsx`, home at line 503, personalisation at 539, gallery at 607. | Scoped presentation/grouping changes only. Preserve handlers, route restoration, session state, filters and labels. |
| Fitting room | Confirmed: `src/app/page.tsx:635–659`; active result UI is inline here. | Change presentation only; preserve consent, validation, pending locks, 429 lock, explicit Generate and recovery. |
| CSS cascade | Confirmed: `src/app/globals.css`; base dialog rules at 346–401, later overrides at 617–624, phone overrides at 762–765. | Edit the effective existing rule, remove superseded declarations only within touched selectors, avoid another override block. Do not raise shared root type tokens indiscriminately. |
| Header and footer | Confirmed: `src/components/Navbar.tsx` is shared with library; home/footer composition in `HomeGuide.tsx`. | Prefer scoped CSS. No navigation or help architecture changes; markup edits only if evidence requires them. |
| Before/after comparison | Confirmed: `BeforeAfterSlider.tsx` is used by `page.tsx:644` and `LookComparison.tsx:49`. | Preserve native range behavior, image containment and accessible value text. Check both callers if shared styling changes. |
| Camera | Confirmed: separate `.cap-*` styles at `globals.css:769` onward. | Preserve camera behavior; check as a regression neighbour if parent or shared-control rules change. |
| Legacy result component | Confirmed by scout: `ResultPanel.tsx` has no current caller. | Exclude cleanup or restyling of unused components. |
| Autosave/shared results | Recorded user boundary in the latest plan and project state; visible placement exists within the dialog. | Preserve implementation, text, defaults, handlers, routes, tests and limits. No further inspection or exercise. Avoid broad selectors that could restyle it. This plan does not certify it. |

1. **Freeze the starting point.** Recheck branch/status, record hashes for touched files and save same-size baseline captures in a fresh mock copy. Preserve all pre-existing changes. Read the relevant installed Next.js guides, the Impeccable polish reference and `craft-floor.md` immediately before UI edits.
2. **Polish home and entry rhythm.** Start with the existing CSS; preserve the three-section home and all support-view behavior. Compare desktop and phone together before proceeding.
3. **Polish gallery and fitting room as one path.** Use existing components; adjust scoped rules and minimal markup in `page.tsx` only where necessary. Make result and failure-state styling consistent without changing state logic.
4. **Verify the complete path.** Reuse existing regression suites and add only assertions for actual changed risks. Run the Impeccable mechanical detector once after the final UI changes, then independently review the resulting code/CSS diff. The primary session verifies any agent claims.
5. **Return for visual assessment.** Show matched before/after images, actual check results and remaining limitations. Update project workflow records with verified facts only. Commit/push or deployment requires its applicable separate authorization and exact-text review.

Likely application files: `src/app/globals.css` and narrowly `src/app/page.tsx`. `Navbar.tsx`, `HomeGuide.tsx`, slider/comparison and camera code remain conditional on a demonstrated defect. Likely regression edits: `tests/redesign-v2.browser.test.mjs` and `tests/ui-revamp.browser.test.mjs`; use the existing mobile/slider suites if their assertions need extending. No new abstraction or dependency.

## 5. Verification: success and proof

All checks below are **planned after implementation**, not results from this planning pass.

| Criterion | Method | Passing result |
| --- | --- | --- |
| Visible, coherent polish | Matched home/gallery/dialog/result captures at 390px and 1440px, reviewed by the user | Clear agreement on improved readability, grouping and hierarchy; identity retained. |
| Responsive layouts | Check 320, 390, 768, 1024, 1440 and 1920px; include a short phone viewport and safe-area layout | No horizontal overflow, clipped controls or footer overlap. Dialog content scrolls; header/close and actions remain reachable. |
| Zoom and keyboard | 200% text/zoom, 320px reflow, keyboard-only walkthrough, dialog focus trap/Escape/restoration | Content and controls remain available in a logical order; visible focus and correct accessible names. |
| Contrast and touch | Measure actual normal/hover/selected/focus/error/status colors; inspect control boxes | Normal text at least 4.5:1, large text 3:1, relevant control/focus graphics 3:1; 44px primary/icon touch targets. |
| Home/navigation preserved | `redesign-v2.browser.test.mjs`, `mobile-consistency.browser.test.mjs` | Three home sections, support views/deep links, mobile menu, bottom navigation and private session retention still behave correctly; zero incidental AI submissions. |
| Core task preserved | `ui-revamp.browser.test.mjs`, `release-privacy.browser.test.mjs`, `image-preprocessing.browser.test.mjs` | Valid local preparation enables explicit Generate; selection/permission alone generates nothing; invalid files are rejected; pending and rate-limit locks remain. |
| Result/recovery and shared slider | `before-after.browser.test.mjs`, `android-touch.browser.test.mjs`, relevant UI-revamp cases | Result labels, full-image inspection, keyboard/touch comparison, image recovery and no automatic retry remain correct. Synthetic/intercepted responses are labeled as test evidence. |
| CSS neighbours | `garment-library.browser.test.mjs`, `wardrobe-plan.browser.test.mjs`, `pilot-session.browser.test.mjs`, `face-camera.test.mjs` | Filters, library cards, planning, comparison, camera fallback/cleanup and private text-only PDF behavior remain correct within mock coverage. |
| Code and build | `npm run typecheck`, `npm run lint`, `MOCK_MODE=true YOUCAM_API_KEY='' npm run build`, scoped `git diff --check` in the isolated copy | Exit codes/output recorded; no new errors. Report existing failures/warnings separately. |
| Mechanical design review | `/Users/nitz/.codex/skills/impeccable/scripts/impeccable detect --json src/app/globals.css src/app/page.tsx` (adjust to actual edited UI files) | Findings resolved or specific intentional exceptions documented; one final scan, alongside visual review. |

### End-to-end proof

Use a fresh isolated mock build with no secret environment files copied and provider credentials empty. Assert `/api/mode` is `mock` before the walkthrough. Intercept generation endpoints in the browser; use synthetic photos and explicit fixtures for success/loading/error responses so no provider task can escape.

Follow the actual UI: home → occasion → skip optional selfie → select an outfit → read permission → upload a synthetic valid photo → explicitly Generate against the fixture → inspect the clearly labeled test preview → save/open the test image → close and confirm session retention. Also exercise invalid input, held request, 429, missing result image and keyboard close. For existing comparison/plan regressions, retain the suite’s established synthetic path. Do not invoke social sharing, private saved-result routes or the excluded saving implementation.

`tests/run-browser-tests.mjs:28` and `tests/run-contract-tests.mjs:4` auto-discover suites. Therefore **do not run `npm run verify`, `npm test` or `npm run test:browser` unqualified** while sharing remains excluded. Run an explicit allowlist of the 11 browser suites named above against the confirmed mock server, setting `TEST_ORIGIN`/`TEST_BASE_URL`. If offline API contracts are needed after a real non-UI change, agree their exact scope separately; this plan needs no API changes.

The latest project state reports two pre-existing exact-response contract failures involving `autoSave: null`; they were not rerun here and are not polish tasks. Do not remove fields or alter tests to make a broad command green.

### Verification limits

Mock browser evidence does not prove live YouCam quality, real Redis behavior, physical-device behavior or deployed behavior. Save/open testing verifies the browser-visible path with synthetic assets; native gallery/cloud persistence needs a separate device check. User visual approval remains required. Existing sharing and live-generation limits remain unchanged and unverified by this work.

## 6. Decisions, exclusions and handoff

- **Confirmed:** home plus the core try-on journey; plan first, wait for review.
- **Proposed for approval:** incumbent refinement, scoped typography/readability targets, tighter gallery preamble, and quieter fitting-room hierarchy. No change to factual copy or product behavior.
- **Assumption:** current logo, arched imagery and dark/light surface split remain the visual authority. A different identity or structural redesign requires a revised brief.
- **Excluded:** whole-app redesign, new features/assets/fonts, backend work, allowance changes, autosave/shared-results work, live tasks, deployment, publishing and Git commits/pushes.
- **Skill maintenance:** user requested Impeccable’s available v4.8.0 update. Its context directive forbids updating files during this active turn; carry out the requested update in a later turn, then reload that version’s instructions before implementation.
- **Next step:** user reviews this plan and requests changes or approves implementation. Stop here; no UI code is to be written before that review.
