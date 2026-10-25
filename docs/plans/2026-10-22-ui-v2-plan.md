# UI-v2 plan and guardrails

## Goal
A premium, warm, curated festive-fashion feel for SangeetFit, built as a
presentation-first pass on top of the existing home and library surfaces.

This branch is intentionally scoped to change **how the app feels**, not its
live/mock API contract. Mock should still read as a reference, and live should
still read as a live preview.

## Guardrails
- No changes to live/mock plumbing unless a UI behavior demonstrably requires it.
- No invented live credentials, no new endpoints that would need them.
- No claim that mock previews are personal renders.
- Keep the app buildable; verify with typecheck/build, not just a dev server.
- Keep work in reversible slices: one visible pass at a time, then re-check.

## Current baseline
Branch: UI-v2
Working tree review items before UI edits:
- Uncommitted local-only: .claude/settings.local.json, next-env.d.ts, tsconfig.json
- New untracked tree: branding/
- I will not commit these local config artifacts as part of the UI pass.

## First surface: home page feel
Primary files:
- src/app/globals.css
- src/app/page.tsx
- src/app/layout.tsx (only if a layout-level wrapper or transition anchor is needed)

Secondary files only if a component actually needs it:
- src/components/Navbar.tsx
- src/components/BeforeAfterSlider.tsx
- src/components/LookComparison.tsx
- src/components/WeddingWeekBoard.tsx
- src/components/GarmentCredit.tsx

## First layer: system hardening
Start with tokens, transitions, focus-visible, and a consistent
hover/active/enter rhythm in `globals.css`, then apply that rhythm to the home
page module. Do not turn the app into a metallic/sparkle theme. Premium here
means controlled warmth, restraint, stronger hero moment, and better
interactive feedback.

## What I will not do in this pass
- Rewrite the VTO flow into a new architecture.
- Introduce new client-side frameworks or heavy animation libraries unless the
  existing stack already supports the change cheaply.
- Change marketing claims about live reviewed items beyond what the source data
  already says.

## Success criteria
- App still builds/runs.
- Mock badge still says it is a mock reference.
- Live badge still says it is a live preview.
- Hero, library browse, and try-on modal feel more continuous and intentional.
- No new console errors from the UI layer.

## Campaign editorial implementation — 22 October 2026

The user requested the design and engineering quality of a premium fashion brand. The selected direction is a campaign-led home with calm, useful browsing; a quieter boutique treatment was considered but gives the first screen less presence. Inspiration reference: https://www.victoriassecret.com/us/ . SangeetFit remains a personal occasion-styling and own-clothes try-on product.

### Design system

- Palette: oxblood `#511C34`, burgundy `#6B1E3A`, blush `#F1E3E8`, ivory `#FCF8F6`, warm ink `#271A22`, muted ink `#76616C`. Existing gold stays a small brand accent.
- Typography: locally hosted, licensed Bodoni Moda for large headings; the existing system sans for controls and body text. Clear size hierarchy, sentence case and legible body contrast.
- Layout: centered wordmark; photographic two-model campaign hero; five visual occasion choices; quieter full-length outfit cards; a clear owned-clothes entry; a spacious desktop fitting room that becomes a scrollable phone sheet.
- Interaction: native links/buttons, restrained hover feedback and one short entry reveal. Respect reduced motion, keyboard focus, 44px touch targets and full result-image visibility.

### Scope and ownership

1. Primary session: `src/app/page.tsx`, `src/app/globals.css`, `src/components/Navbar.tsx`, `src/app/layout.tsx`, approved local font assets and this plan. Preserve existing state, handlers, privacy guards, requests, source versions and review metadata. Replace conflicting editorial CSS rather than stacking another theme on it. Preserve camera calibration styles and existing logo assets.
2. Library builder: `src/app/library/page.tsx` and `tests/garment-library.browser.test.mjs` only. Remove duplicate controls/guidance, correct provenance labels, restore source notes, and apply the shared visual hooks. Test one visible instance of each filter and preserve search, archive, occasion links and explicit generation contracts.
3. Primary session integrates comparison/slider presentation through existing hooks. No provider, budget, data, API route or live-mode changes. Preserve pre-existing machine settings, generated files, API-mode edits, scripts and draft branding outside the UI checkpoint.

### Verification and release gate

- Capture baseline and final desktop/phone screenshots using an isolated browser; inspect the actual images. Never use private participant photos.
- Reproduce duplicate-filter regression before the library fix, then verify the fixed flow. Reuse existing UI, camera, comparison, upload and privacy suites for functional coverage.
- Run `npm run verify` with `TEST_PORT` set to a free dedicated port, plus `git diff --check`. Record local Redis skips and existing lint warnings honestly.
- Inspect 320/375/768/1440px layouts, image loading, readable controls, focus containment and reduced motion. Browser emulation is not a physical-phone test.
- Independent code/React/TypeScript review, then a scoped commit and push of verified UI/product files to `UI-v2`; verify remote SHA. No merge, deployment, live generation or credit spending is part of this request.

### Local design reference comparison

Inspected `http://localhost:5174/` on desktop and a 390px browser viewport. It is a designer portfolio, with oversized type, a restrained navigation bar, aligned large project images and consistent section spacing. The useful direction for SangeetFit is the same visual discipline: one clear headline and action, a real two-column model hero, aligned full-length outfit cards and a single filter toolbar. Preserve the existing gold logo and occasion-planning flow. The portfolio's long opening space and moving marquee would delay outfit choice in this app, so keep the product path compact and motion limited. Browser viewport checks do not establish physical-device behavior.
