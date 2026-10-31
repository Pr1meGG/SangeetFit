# Home composition and motion check — 26 October 2026

Branch: `codex/redesign-v2`. All changes in this follow-up remain local and uncommitted; existing premium CSS and release work were preserved.

## Delivered

- Home contains exactly three primary sections, in order: hero, five occasion outfits, closing invitation. The footer remains. The capability strip, feature rail, walkthrough and FAQ no longer extend the home scroll.
- Navbar How it works opens an independent in-page guide with a refined two-column editorial feature index and three original inline SVG illustrations: wardrobe, fitting-room mirror and celebration plan. FAQ has its own surface. These callbacks preserve the existing page-owned clothes, photos, shortlist, results and wedding plan.
- Occasion cards lift6px, collection cards4px and primary actions3px on hover. Hover motion is limited to fine-pointer devices without a reduced-motion preference. Keyboard focus remains visible; the feature index highlights focused actions.
- Small illustration groups sway, float and sparkle on3.6-second loops. Pause/Play animations controls stop/resume the actual CSS animations. Reduced motion disables the loops. The app adds no GIF downloads, animation dependency, new photo source or provider call.
- Existing support hash links still work. Help hashes take priority over entry-only outfit/plan query parameters during restoration. Switching help surfaces updates the hash; core navigation consumes stale `step`, `view` and `vto` parameters so they cannot reopen the previous view or fitting room.

## Verification

Verification used a dedicated local source copy at `/var/folders/rz/fmskt4393gg_sm__cbxgstj00000gn/T/sangeetfit-home-motion-check-zgnrw0ym` to avoid shared-build interference. No `.env.local` was copied or read; the server uses `MOCK_MODE=true` and an empty provider key. The manifest covers74 source/test/script files and was compared to the working checkout.

- Initial `TEST_PORT=3555 npm run verify` exited0:16 enumerated offline suites (real Redis skipped), canonical TypeScript, lint0 errors/22 existing warnings, mock build and all11 browser suites.
- After review/runtime corrections to heading hierarchy and support-link restoration, canonical TypeScript and lint passed again. Final mock production build and `TEST_PORT=3555 npm run test:browser` exited0: **all11 mock-only browser suites pass**. Final lint:0 errors/22 existing warnings. Build also ran TypeScript successfully against the final source.
- The updated redesign suite asserts the exact three home sections; guide/FAQ separation; actual hover translation; three active illustrations; pause and reduced motion; active navigation and focus; session retention; help hash reloads; query-plus-help reload priority; and direct core navigation without a stale fitting-room dialog. Browsing/navigation submits zero skin/VTO requests.
- Separate browser audit passed home, guide and FAQ at320,390,768,1024,1440 and1920px, with no horizontal overflow, no page errors, live/paused animation states and reduced-motion checks. Audit generation requests:0.
- `git diff --check` passed. Code, React, TypeScript and project integration reviews completed. Heading/hash findings were addressed; the flagged query/hash race was reproduced and fixed, with regression coverage.

The visual harness initially checked paused animation objects after Playwright's animation-disabling screenshots. The harness now pauses the UI first and captures normally. This avoids screenshot instrumentation affecting the observation; no product workaround was added.

## Preview and artifacts

The refreshed mock preview is http://127.0.0.1:3553. It serves the checked local copy; later source changes require refreshing that copy/build. Help guide: http://127.0.0.1:3553/#how-it-works.

Artifacts: `/Users/nitz/.codex/visualizations/2026/10/26/01a176b9-64b3-7903-8910-4976cdc51e84/home-motion/`:

- `home-desktop.png`, `home-phone.png`, `guide-1440.png`, `guide-390.png`, `walkthrough-1440.png`, `walkthrough-390.png`, `checks.json`.
- `guide-motion.webm`:8-second,1280×800 browser recording showing actual loops and pause/resume. Screenshots of the isolated walkthrough hide fixed navigation during capture to avoid overlay artifacts; normal full-page captures retain navigation.
- Home composition, desktop feature index and desktop/phone walkthrough drawings were visually inspected. Runnable local audit: `/tmp/sangeetfit-home-motion-visual-check.cjs`.

## Limits

Navbar/hero follow-up: the header wrapper is transparent, and the normal landing hero now begins at viewport y=0 behind its floating pill. Responsive overlap is88px on desktop and80px on phone; existing session/availability banners retain normal flow. Fresh mock build, existing UI regression and redesign navigation suites passed. Geometry checks at all six widths confirmed hero top0, text below the navbar and no overflow; the unavailable-mode banner remained unobstructed. Screenshot: `home-motion/hero-to-top.png` in the artifact directory above. The root checkout and isolated preview were both updated; no live task or deployment occurred.

No live YouCam generation, deployment, push or publication occurred. Existing AI outfit concepts are labelled as concepts. Physical-device behavior, real Redis, live provider quality and deployed judge access were not verified in this pass.
