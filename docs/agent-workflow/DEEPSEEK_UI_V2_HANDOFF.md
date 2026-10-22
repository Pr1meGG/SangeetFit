# SangeetFit UI-v2 — DeepSeek Flash / Freebuff handoff

## Mission field

Finish and verify SangeetFit's premium occasion-styling experience on the existing UI-v2 branch. Help someone choose an occasion, explore owned clothes or reference outfits, explicitly generate a personal try-on, compare two results, and choose/save a look. Continue the existing product; do not replace it with a template. Prioritize a working decision loop, clear visual hierarchy, mobile usability, privacy and honest live/mock labels. Deliver small, reviewed, tested checkpoints with before/after evidence and an accurate handoff.

## Build prompt

You are the senior product designer and frontend engineer continuing SangeetFit. Work in `/Users/nitz/Code_Stuff/SAeCo`, on the existing `UI-v2` branch. Read `AGENTS.md` and applicable skills completely before editing. Inspect the actual installed package versions; older descriptions calling this Next.js 14 are stale. This checkout uses Next.js 16, React 19 and TypeScript.

### Product and boundaries

SangeetFit helps people decide what to wear for Sangeet, Mehendi, Haldi, Wedding and Reception. Its core loop is: choose occasion, explore owned clothes or reference outfits, add a head-to-toe person photo, explicitly generate, compare two looks, choose and save. The wardrobe and personal results are session-only. The catalogue supports inspiration and try-on; it is not a checkout product.

The current catalogue contains 26 original AI outfit concepts with multi-occasion tags. Preserve the existing five-looks-per-occasion/audience coverage. Only two references have a scored live pilot on one person's source photo; that does not establish broad identity reliability, own-clothes quality or physical fit. Candidate references must remain labelled unreviewed. Preserve sourced-photo credits and reference limitations. Never invent sellers, prices, ratings, testimonials or test results.

### Inspect before changing

1. Confirm repository root, branch, `git status --short`, current diff and running servers. Preserve every pre-existing change. Do not reset, clean, switch branches, kill unrelated processes or overwrite another agent's work.
2. Read `UI-v2-plan.md`, `docs/agent-workflow/PROJECT_STATE.md`, `TASK_BOARD.md`, and relevant existing components/tests. If another agent is editing your files, give a read-only review until ownership is explicitly handed over. Use a single writer per file.
3. Inspect the running app and `http://localhost:5174/` if available. The latter is a designer portfolio. Borrow its consistent spacing, restrained controls, type hierarchy and aligned photography. Keep SangeetFit's product journey compact; do not transplant the portfolio's long empty hero, marquee, contact form or project sections.
4. State a short plan with exact files, existing defects, proposed changes and acceptance checks. Then implement within these boundaries without redundant clarification loops.

### Existing implementation to refine

- `src/app/page.tsx`: occasion home, optional skin analysis, recommendations, own clothes and fitting-room state.
- `src/app/library/page.tsx`: reference catalogue and accessible filters.
- `src/app/globals.css`: shared design tokens, layout and isolated `.cap-*` camera rules.
- `src/components/Navbar.tsx`, `BeforeAfterSlider.tsx`, `LookComparison.tsx`, `WardrobeUpload.tsx`, `WeddingWeekBoard.tsx`.
- `src/app/layout.tsx` and licensed local Bodoni Moda font under `public/fonts/bodoni-moda/`.

UI-v2 already has a centered desktop wordmark, blush/oxblood model hero, photo occasion cards, a responsive reference grid, single library filters, restored source notes and a larger fitting room. Inspect what exists before proposing replacements. Keep the existing gold carved-S logo and model assets. Use Bodoni Moda for display headings and the existing sans serif for controls/body. Favor ivory, blush, burgundy, thin separators, aligned imagery and restrained motion.

Prioritize observed defects in narrow-phone layout, visual consistency, loading/error recovery and the path from browse to compare. Keep primary actions easy to find. Garment references, user photos and results must remain fully visible with `object-fit: contain`. Respect reduced motion, focus visibility, labelled controls, dialog focus restoration, safe-area padding and touch controls of at least 44px. Add no dependency or abstraction unless existing code and platform features cannot solve the problem.

### Non-negotiable behavior

- Browsing, uploading, opening results, comparison and image reload must create zero tasks. Only an explicit Generate action submits one request. Preserve one request in flight, stale-response protection, cancellation/session clearing and photo-version comparison warnings.
- Preserve separate selfie/skin and full-body/VTO inputs, existing upload validation/compression and catalogue/upload mode isolation. Do not promise selfie-only personal VTO or guaranteed face/size preservation.
- Do not touch provider contracts, API routes, budget/Redis guards, live configuration, credentials or infrastructure for a presentation change. Do not weaken consent, access controls or error handling.
- Use mock mode for local verification. No live YouCam tasks, purchases, deployment, merge or external messages. These require separate specific authorization.
- Never read `.env.local` values or put credentials, private photos, signed result URLs or sensitive identifiers into model context, logs, screenshots, commits or documentation. Use synthetic fixtures for testing.
- Avoid accounts, permanent storage, checkout, new AI providers, top-plus-bottom composition and a new stylist chatbot.

### Verification and delivery

Use the project's workflow and available Superpowers, Ponytail and Caveman skills. Keep code/tests/docs complete and progress reports concise. Use bounded subagents only where AGENTS.md calls for them, with disjoint ownership and independent review. If a tool or skill is unavailable, say so; never claim execution that did not happen.

After integration, run `TEST_PORT=<a verified free port> npm run verify` and `git diff --check`. The verify script forces mock mode. Also inspect the actual rendered UI at 320, 375, 768 and 1440px, keyboard navigation, the fitting dialog, permission panel, full-length images and zero tasks during browsing/comparison. Do not describe browser emulation as a physical-phone test.

For a real behavior bug, reproduce it before fixing and add a focused regression. Keep existing suites and honest expectations; do not weaken tests to make a change pass. Obtain independent review before completion. Distinguish a passed command, a skipped check and an untested assumption.

The user has standing authorization for meaningful scoped verified commits and pushes to the working branch. Stage only reviewed product/test/documentation files. Exclude local settings, environment files, generated configuration changes, draft assets, traces and private media. Verify the remote SHA after pushing. This authorization does not include deployment or merge.

Finish with: changes and why; tested commands and exact results; screenshots; local/remote commit SHAs; remaining pre-existing changes; limitations and the single next useful task. Do not claim production readiness from mock tests alone.

## Verified checkpoint — 22 October 2026

- UI/library changes passed `TEST_PORT=3514 npm run verify`: 13 executed offline suites plus one real-Redis skip, 8 mock browser suites, canonical TypeScript, lint and production build. Lint: 0 errors, 20 warnings. `git diff --check` passed.
- Regression first reproduced duplicate library filters (`2 !== 1`); fixed implementation passed the full library browser suite. Added actual geometry checks for side-by-side desktop hero and two aligned phone catalogue cards.
- Inspected desktop and phone browser screenshots. A fresh 320px home check had no horizontal overflow. Three independent code/CSS, React and TypeScript reviews found no actionable defects in their assigned scopes.
- No live generation or deployment occurred during this UI pass. Physical-device verification of this design remains pending. The local false-mode server reported `unconfigured`; its running state is not proof of live availability.
- Machine-local settings, generated AGENTS/config changes, pre-existing API-mode edits, helper scripts and draft branding remain outside the UI checkpoint. Inspect current Git state rather than assuming a clean tree.
