# Impeccable polish — 25 October 2026

## Goal and scope

Refine the existing SangeetFit interface on `experiments`: improve desktop headline wrapping, readable form and status text, consistent control/card details, and keyboard navigation. Preserve the burgundy/ivory palette, Bodoni Moda display face, photographs, review labels, session behavior and explicit generation gates. Build on the existing uncommitted scale tokens in `src/app/globals.css`; leave branding exploration and provider configuration outside this pass.

## Implementation

1. Extend `tests/ui-revamp.browser.test.mjs` and `tests/mobile-consistency.browser.test.mjs` for skip-link focus and next-Tab behavior, named gallery filter groups, accessible colour samples, readable mobile form fields, and a two-line desktop hero. Run against the unchanged mock preview to establish the failure.
2. Refine the existing rules in `src/app/globals.css` using the installed spacing, type, radius and motion tokens. Give the desktop hero copy enough room; improve the wardrobe board, form fields and small provenance text without changing layout or image contracts on phones.
3. Move the skip targets below navigation in `src/app/page.tsx` and `src/app/library/page.tsx`, add gallery group roles and colour sample names, and simplify the navbar to the connected SangeetFit name without a tagline in `src/components/Navbar.tsx`.
4. Read the integrated source diff independently, run the Impeccable detector once on the changed UI, and run `TEST_PORT=3541 npm run verify` plus `git diff --check`. Use only mock mode with empty provider credentials.
5. Inspect the rendered home, personalisation, gallery, library and try-on path at 320/390/768/1440px, including keyboard focus, empty state, reduced motion and long content. Save synthetic/public-asset screenshots outside Git. Update the workflow state with verified results.

## Constraints and acceptance

- No new dependencies, logo replacement, API changes, paid tasks, deployment, public prose, commit or push.
- Preserve the pre-existing `AGENTS.md`, style-system work and branding folders. Baseline copies of task files are saved outside the repository for comparison.
- The existing development server owns `.next-dev`; use a separate mock production preview on port 3540 and the verification runner's isolated port 3541.
- No horizontal overflow or hidden controls at the checked widths. Existing library columns, sticky phone navigation, modal focus and task-count regressions must still pass.
- Desktop hero reads in two lines; mobile text inputs and selects avoid iOS focus zoom; skip links bypass navigation and move focus; colour samples expose their names.
- Verification is local/mock evidence only. Real-phone behavior, live YouCam quality and deployment are separate gates.
