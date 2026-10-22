# Brave Preview and photo-permission check — 22 October 2026

The user's signed-in Brave session opened the protected `7858b2f` mock Preview without another login. This is authenticated developer access, not anonymous judge access. Production was not changed.

## Cloud observations

- `/api/mode` returned `{"mode":"mock"}`.
- At an emulated 392×761 touch viewport, every combination of five occasions and two audiences displayed five original concepts. None of those ten states had horizontal overflow; displayed images had no observed decode failure.
- The Emerald catalogue link preserved `occasion=sangeet` and opened the correct fitting room without a VTO request.
- **Release blocker:** the photo-permission panel had computed `display:none`, hiding “I understand — continue” and preventing the normal upload path. Project styles contain no matching rule that hides that panel. Replacing only its DOM class `sf-consent` with `sf-photo-permission` restored `display:block` and the notice/button. This isolates a class-dependent hiding rule in this browser profile; the exact extension/filter list was not identified or changed.
- An attempted synthetic file injection before permission did not establish a prepared source and made no request. This was diagnostic automation, not a native picker test. No personal image was used.

## Small source fix and verification

The JSX hook and all three existing CSS selectors now use `sf-photo-permission`. The notice wording, required permission action, upload validation and explicit Generate behavior are unchanged. No browser protections were disabled.

The existing release-privacy browser suite reproduces the observed `.sf-consent { display:none !important; }` rule and asserts that the real permission action stays visible. It failed at the expected visibility assertion against the old build. The final test waits for the dialog before checking visibility to avoid a hydration race.

`npm run verify` exited 0: 13 offline suites passed and the real-Redis suite explicitly skipped locally (14 enumerated); TypeScript, lint (0 errors/19 existing warnings), mock build and all eight browser suites passed. The final focused `release-privacy.browser.test.mjs` run also exited 0. Independent code, React and TypeScript review found no remaining blockers.

The rebuilt local mock was then opened in the same Brave profile at 392×761:

- The renamed panel was visible without DOM class edits: computed `display:block`, height about 219px. The real permission button worked.
- A synthetic 400×600 JPEG was prepared through the file-input change path with zero VTO requests.
- One explicit Generate produced one mock request and a loaded reference image, visibly labelled as a reference rather than a personal result. No skin request ran.
- Replacing with a second synthetic JPEG cleared the old modal result and showed a prepared 400×600 source without a second task. This does not establish native picker behavior or an independent source-identity check.
- The Save/open link was activated without another VTO request; a completed disk download was not independently verified.
- No horizontal overflow or console error was observed during the local flow.

## Remaining limits

The deployed `7858b2f` Preview still contains the old class; the source fix needs a separately approved deployment. Browser emulation does not verify an actual Android camera, native picker or download. Camera access, live generation, runtime Redis reservations and private participant photos were not used in this check. Broader browser/filter configurations remain untested.
