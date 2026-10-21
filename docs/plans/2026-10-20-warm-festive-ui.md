# SangeetFit warm festive UI revamp

User authorized implementation on `codex/ui-revamp`. Preserve the existing dirty checkout. No commit/push, deployment, live YouCam tasks or new dependencies.

## Outcome and direction

A mobile-first personal occasion styling app, with a reference collection rather than shopping chrome. Ivory #FBF7EF surfaces, burgundy #6B1E3A actions, charcoal #33231F text, muted #78665E, marigold #E4A33C and warm #E8DED1 borders. Georgia display headings paired with existing system UI text; no font network dependency. One memorable outfit collage on the occasion screen; quiet functional screens thereafter. Reuse existing local credited photos and brand assets. Desktop content left-aligned; mobile has reachable bottom navigation.

## Scope and ownership

- Primary: `src/app/page.tsx`, `src/app/globals.css`, `src/app/layout.tsx`, new UI browser checks, integration and progress docs.
- Builder: `src/components/Navbar.tsx`, `src/components/GarmentCredit.tsx`, `src/app/library/page.tsx`.
- Scout: read-only regression contracts. Independent review after integration.
- Keep `FaceCameraCapture`, its crop geometry and lifecycle, API request schemas, garment assets and backend unchanged.

## Sequence

1. Preserve baseline and inspect existing tests. Implement home occasion selection with photo collage and clear reference outfit entry. Keep occasion -> selfie entry for camera regression; add an explicit skip to collection.
2. Redesign optional selfie screen, result and status states. Truthful skin mock label; describe colour similarity without personal suitability percentages.
3. Redesign gallery and session shortlist with honest empty state and responsive cards. Use credited photographic references in the primary gallery without deleting legacy catalog data or deep links. No own-clothes upload, persistent wardrobe, result-comparison or saved-result features implied.
4. Redesign VTO viewer: full-image containment, accessible dialog focus/escape handling, source review, honest mock/live label and useful error recovery. Protect against stale responses after closing; keep one task per existing upload action.
5. Integrate shell/library styling. Keep library filter labels, credits and deep-link behaviour. Change layout body to warm palette.
6. Verify all seven offline suites, TypeScript, mock production build, existing camera/library browser regressions and a focused UI check (skip analysis, navigation, shortlist, modal keyboard/recovery, mobile overflow). Review screenshots at desktop/mobile and inspect integrated changes independently.

## Acceptance and risks

- Existing face-only skin and full-body-only VTO routing preserved; no paid API operations.
- No mocked image presented as a generated personal result; no unsupported shopping or wardrobe actions.
- No modal background scrolling; keyboard focus contained/restored; visible focus and reduced motion.
- All images fully visible; source/license credits retained; readable contrast, 44px touch controls and no horizontal overflow at 375px.
- Existing HTTP, exact ID/label contracts and linked one-request flow retained or tests explicitly updated for intentional product copy changes.
- Camera physical-device accuracy, face retention, new garment live quality, deployment access and live image download remain outside local/mock verification.

## Verification commands

Use available local `tsx` runner (Node 20 has no strip-types): run each `tests/*.test.ts` offline suite individually. `npx --no-install tsc --noEmit`; `MOCK_MODE=true npm run build`; `git diff --check`. Start mock production server on a free port and run `tests/face-camera.test.mjs`, `tests/garment-library.browser.test.mjs`, and UI regression with `TEST_BASE_URL` and an existing `PLAYWRIGHT_MODULE_PATH`.
