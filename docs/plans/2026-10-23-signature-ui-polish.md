# SangeetFit signature UI polish — 23 October 2026

Goal: make the existing editorial design consistent across the main journey and collection, and keep phone navigation available while scrolling. Preserve the current product flow and mock/live boundaries.

Scope: `src/app/globals.css` for shared typography, panel styling, phone navigation and bottom spacing; `src/app/page.tsx` to retain navigation during selfie capture; `src/app/library/page.tsx` for working phone navigation on the collection route. Extend existing browser tests in `tests/ui-revamp.browser.test.mjs` and `tests/garment-library.browser.test.mjs`.

1. Add browser assertions for phone navigation on the collection route, scroll anchoring and camera visibility. Confirm the new assertions fail against the current build.
2. Keep Bodoni Moda for editorial and panel headings, one inherited sans stack for controls and garment names, and consistent labels and panel chrome. Use existing font and CSS only.
3. Keep the main page's four working actions visible during capture. Add two working destinations to the collection's phone bar: For you and Explore. Do not introduce links to session-only wardrobe or shortlist state across route changes.
4. Inspect 320, 390 and desktop layouts, keyboard focus, safe-area spacing, overflow and console errors. Run targeted browser tests, `TEST_PORT=3521 npm run verify`, and `git diff --check`; obtain independent review. Stage only this checkpoint, then commit and push `UI-v2` under the existing GitHub sync authorization.

Risks: phone browser viewport and safe-area behavior vary by device; emulator checks do not establish physical-device quality. Navigation from `/library` to `/` starts a fresh page session, as the current product already does.
