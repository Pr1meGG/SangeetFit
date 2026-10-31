# Redesign v2 verification — 26 October 2026

Branch: `codex/redesign-v2`. Existing checkpoint: `4c4ed65`. Follow-up fixes in this check remain local and uncommitted. Other-session premium CSS work and existing project changes were preserved.

## Changes checked and corrected

- Original REA-inspired navigation/home implementation: pill navbar, existing tool shortcuts, session-preserving home callbacks, library links, plan deep link, walkthrough, native FAQ and footer. Reference evidence: [Glowstack teardown](../research/2026-10-26-glowstack-design-teardown.md).
- Removed `backdrop-filter` from the header: it established the fixed scrim's containing block and confined the backdrop to the 80px header. The scrim now covers the viewport. Replaced synthetic event dispatch with a real hit test and mouse click, including the bottom-bar clothes action; dismissal must not activate that background action.
- Corrected the privacy FAQ to distinguish person/garment submission through permission plus Generate try-on from optional selfie submission through Analyze selfie.
- Corrected the latest desktop hero font clamp from a maximum of96px to70px; the original two-line heading now fits at all six checked widths. Other premium styling remains.

## Reproducible verification

Concurrent edits/builds were detected in the shared checkout. Verification used a local source copy at `/var/folders/rz/fmskt4393gg_sm__cbxgstj00000gn/T/sangeetfit-redesign-check-36num3jn`, with the installed dependencies linked, public assets and required benchmark fixture copied, and **no `.env.local` copied or read**. All73 source/test/script files were hashed; the final manifest matches the current checkout with zero differences.

- `TEST_PORT=3552 npm run verify`: contract suites, canonical TypeScript, lint and mock production build passed. Real Redis assertions skipped because Redis was not configured. Lint:0 errors/22 existing image warnings. This run then caught the desktop headline regression in the browser phase; it is not recorded as an all-green command.
- After the font-only correction: `MOCK_MODE=true YOUCAM_API_KEY='' NEXT_TELEMETRY_DISABLED=1 npm run build` exited0, followed by `TEST_PORT=3552 npm run test:browser` exited0: **all11 mock-only browser suites passed**. This includes the new real-pointer regression, session/owned-outfit/shortlist/plan retention, library navigation, keyboard FAQ/anchors, explicit task contracts, camera behavior, comparison and PDF privacy.
- `git diff --check` exited0 in the working checkout.
- Code, React, TypeScript and project integration reviews completed. The scrim and FAQ findings were fixed; no outstanding findings were reported after their rechecks.

The initial isolated-copy attempt stopped on a missing benchmark JSON fixture; that test dependency was then copied. A subsequent browser run exposed a test lookup for the intentionally hidden tablet bottom navigation; the test now checks that action only at phone widths. These harness failures did not trigger provider requests or require product behavior changes.

## Browser and visual evidence

Mock preview: http://127.0.0.1:3553, served from the checked isolated copy. Home and library passed at320,390,768,1024,1440 and1920px; no horizontal overflow or page errors. Headline stayed on two lines. Phone/tablet scrims matched viewport dimensions. Mock/live/unconfigured badge layouts were also checked with **stubbed mode responses**, not live provider access. Reduced-motion entry behavior passed. The visual/navigation audit submitted zero generation requests.

Local artifacts: `/Users/nitz/.codex/visualizations/2026/10/26/01a176b9-64b3-7903-8910-4976cdc51e84/redesign-v2/`:

- `home-1440.png`, `home-390.png`, `features-desktop.png`, `menu-phone.png`, `library-desktop.png` and machine-readable `checks.json`.
- Desktop home, feature section and phone menu were visually inspected. Earlier failing screenshot `home-1440-before-fix.png` is retained as diagnostic evidence.
- Runnable local visual check: `/tmp/sangeetfit-redesign-v2-visual-check.cjs`.

## Limits

No new live YouCam task, deployment, publication or push occurred in this check. Physical-device behavior, real Redis concurrency and deployed judge access were not verified. Existing AI concept imagery and mock results are not new live-quality evidence. The isolated preview does not automatically incorporate later source edits.
