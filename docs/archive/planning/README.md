# Archived wedding planning and PDF export

Archived at the user's request on 2 November 2026. The active candidate focuses
on outfit browsing, own-garment upload, explicit YouCam try-on, shortlist,
comparison and result saving.

## Preserved source

- `src/components/WeddingWeekBoard.tsx`: event assignment board and counters.
- `src/components/WardrobePlanPrint.tsx`: text-only print view.
- `src/lib/session.ts`: `summarizeWardrobePlan()` and its types.
- `src/app/globals.css`: dedicated board/print styles.
- `tests/wardrobe-plan.test.ts`: retained summary-helper coverage.

These components remain in their original locations but are not imported or
mounted by the active app. Plan state and result-assignment callbacks were
removed from the active page. Assignments were session-only; no persisted user
plan data was deleted or migrated. Legacy planning links open the try-on gallery.

## Historical material

The scripts/checklist beside this file preserve the earlier planning pitch.
Their relative links reflect their original `docs/submission/` location. They
are historical records, not current demo instructions or approval to generate.

Existing local videos showing the board/PDF—including
`work/video-codex/out/SangeetFit-walkthrough.mp4` and the earlier Claude cuts—are
superseded. Preserve their source footage; do not submit those edits unchanged.
Current narration and shot direction live in `docs/submission/DEMO_SCRIPT.md`.

Restoring the feature requires deliberately reconnecting the page state,
components, navigation and comparison controls and restoring its browser
coverage. The active archive regression must change as part of that work.
