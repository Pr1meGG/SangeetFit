# Before/after inspection for live try-ons

Goal: let a user drag or keyboard-adjust a reveal line between their source photo and a generated outfit. Use the same control in the result dialog and two-look comparison. Keep mock results labelled as references, with no personal before/after claim.

Architecture: a small client component owns the 0–100 reveal value. Two aligned images share one stage; CSS clips the result layer and positions the divider. A native range input supplies pointer, touch and keyboard control. The current error/reload and comparison state stay in their callers. No dependency, persistence, new endpoint or automatic generation.

Files: create `src/components/BeforeAfterSlider.tsx`; edit `src/app/page.tsx`, `src/components/LookComparison.tsx`, `src/app/globals.css`; add one synthetic browser regression under `tests/`. Private pilot photos/results remain outside this repository. A separate local HTML viewer may display the two existing private results without calling YouCam.

1. Add a browser check that stubs one live result, uploads a synthetic source, and asserts a labelled range at 50%, keyboard adjustment, and zero extra `/api/vto` requests while inspecting the result and comparison card. It should fail before the component exists.
2. Build the slider with original/result images, visible Before/After labels, an aligned reveal line and an accessible range. Show it only when `mode === "live"` and the source photo exists; retain the present mock/reference and expired-image recovery paths.
3. Run the synthetic browser check, existing UI/pilot browser suites, TypeScript, lint, mock production build and `git diff --check`. Inspect phone width and keyboard use. Do not submit a YouCam task for UI QA.
4. Review the integrated change, record the participant's four 5/5 pilot ratings separately from the observer's overall 4/5 impression, and update project state. Commit only reviewed product/tests/docs, push `codex/ui-revamp`, and verify the remote SHA. Never stage private images, signed URLs, local settings or draft branding.

Risk: source and generated images with different crops can make the line imperfect; both pilot images have the source's 899×1599 dimensions. An expired result must still show the existing recovery message rather than a blank slider. Browser QA uses synthetic images; real-phone touch and real-user slider usability remain unverified.
