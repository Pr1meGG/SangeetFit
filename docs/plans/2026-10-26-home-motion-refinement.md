# Home composition and motion refinement

## Outcome

Respond to the four supplied screenshots: subtle hover lift on interactive elements; a more refined feature area; small animated illustrations that explain the three walkthrough steps; and exactly three primary home sections: hero, five occasion outfits, closing invitation. Keep the footer. Preserve all existing styling tools and private session state.

## Design and scope

The home will show no feature rail, walkthrough or FAQ in its scrolling body. Navbar How it works opens a separate in-page guide surface containing the refined feature rail and animated steps; FAQ opens its own in-page surface. These are callback-driven views in the existing home component, so visiting help does not discard clothes, shortlist, plan or photos. Existing `/#how-it-works` and `/#faq` links remain supported.

Use three original inline SVG illustrations: a wardrobe, a try-on mirror and a celebration plan. CSS animates only small groups through transforms and opacity. The illustration canvases reserve their space, prose stays readable, a pause control stops loops, and reduced-motion preferences disable them. These supply the requested GIF-like feel without a downloaded GIF or new dependency.

Hover/focus lift is subtle and confined to controls/cards: no layout reflow, no giant zoom, no cropped outfit references. Preserve current brand, typography, mock/live labels, photo permissions and explicit task actions. No API, dependency, live generation or deployment changes.

## Files and acceptance

- `src/app/page.tsx`: add help-view state and hash restoration; home composition becomes three sections; active navbar view reflects help; retain all session-owning state.
- `src/components/HomeGuide.tsx`: separate home/help/FAQ render paths, refined feature rail and motion pause control. Builder owns this file.
- `src/components/StepIllustration.tsx`: three decorative SVG variants with CSS hooks; same builder owns it.
- `src/app/globals.css`: hover/focus states, editorial rail, guide spacing, illustration loops, pause/reduced-motion and phone layout. Primary owns all CSS.
- `tests/redesign-v2.browser.test.mjs`: assert three home sections, help separation/deep links, active state, real hover behavior, loop pause/reduced-motion and retained session. Existing navigation and explicit generation checks continue.

Verification: canonical contracts/typecheck/lint, mock production build and all browser suites; six viewport checks; real pointer and keyboard interaction; inspect desktop/phone and animated states. Use an isolated local source copy if shared builds may interfere, with no `.env.local` copied. Keep all work local and preserve pre-existing changes. Record actual outcomes in project workflow files.
