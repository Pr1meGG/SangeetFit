# Five-event outfit board

## Decision

Make SangeetFit the occasion wardrobe for a multi-event Indian celebration: plan what to wear across Sangeet, Mehendi, Haldi, Wedding and Reception, starting with clothes already owned, then use try-on to compare uncertain choices. This is a product hypothesis, not a validated user preference or a claim that live VTO quality is proven.

The alternatives considered were a resale storefront (overlaps SecondLook and needs seller operations) and a general AI stylist (overlaps FashionU and needs a new reasoning/evaluation layer). A five-event board uses the app's existing occasion tags, uploads and fitting room. The catalogue remains optional inspiration, not inventory for purchase.

## Smallest implementation

- `src/app/page.tsx`: keep one session-only outfit ID per occasion in Home state. Add a visible planner entry from the home hero. Clear a slot when its uploaded garment is removed. Selecting a board item may open the existing fitting room, but only its explicit Generate button submits a task.
- `src/components/WeddingWeekBoard.tsx`: show the five slots, each with owned garments and suitable model-led concepts as distinct option groups. Mark concepts as unreviewed inspiration. Allow the same outfit in multiple slots and show that rewear intentionally. No persistence, seller or family workflow.
- `src/app/globals.css`: compact responsive card layout with full-size controls and no horizontal scrolling.
- `tests/ui-revamp.browser.test.mjs`: add a mock browser regression for assign/reuse/removal and zero `/api/vto` calls during planning.
- `docs/agent-workflow/{PROJECT_STATE,TASK_BOARD}.md`: record the bounded result and the remaining live-quality gate.

## Acceptance and verification

From a fresh home page, reach the board without a photo; assign an inspiration look or owned outfit to any event; reuse one look across two events; remove an owned garment and see its affected slots clear; open try-on without generating until explicitly requested. Run the focused browser test against a mock server, TypeScript, lint, mock production build and `git diff --check`. Do not submit live YouCam tasks or deploy. Commit and push only reviewed project files; verify remote SHA.

Risk: reference concepts are candidate assets. The board must not describe them as proven try-on results, and the launch claim still depends on the separately approved live quality pilot.
