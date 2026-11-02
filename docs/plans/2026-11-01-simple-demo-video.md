# Simple SangeetFit demo video

Goal: a local 1080p silent cut, ready for the user's later voiceover, combining
the current UI screenshots with the existing successful YouCam recording.

## Revised scope after user direction

User requested an original edit without Claude's demo video, internet research,
and a separate voiceover script. Final scope is `work/video-codex/capture.mjs`
(fresh local mock screen recording), `work/video-codex/build.py` (original
90-second composition), and `docs/submission/DEMO_VOICEOVER_CODEX.md`. This
supersedes the initial reuse plan below. No Claude-assembled movie or previous
slideshow layout is used in the final artifact. Original live production source
is reused as evidence, with no new provider call.

Scope: `work/sangeetfit-motion/build_simple.py`, its rendered output and receipt,
a timed narration guide, and a short entry in the existing state/task records.
Preserve the existing static cut and all unrelated working changes.

Use the existing FFmpeg slideshow builder and installed system fonts. Add a
required path to the original live recording; crop the recorded 780×1688 canvas
to the actual 390×844 browser viewport. Reuse its proven 12–18 s notice/photo,
18–42 s wait (4×), and 42–54 s result sections. Label the recording date, actual
26-second generation time, synthetic demo person, and mock/sample planner data.
No music, generated narration, new provider calls, or publication.

Verify: assert source dimensions/duration and expected output duration, render
with FFmpeg, decode the full export, inspect a timeline contact sheet and the
live result frame, and run `git diff --check`. Independent read-only review
checks the script, labels, evidence and narration. No app build needed because
application files are unchanged. No commit/push in this task.

## Final direction after visual feedback

User rejected the slide-like cut. Final artifact uses `walkthrough.mjs` for real
full-screen mouse/typing/scroll/select footage and `edit_walkthrough.py` for a
continuous recorded-video edit. No still inputs or frozen-frame padding. Final
86.77-second 1080p silent export is `work/video-codex/out/SangeetFit-walkthrough.mp4`.
Separate narration follows the actual timeline. Mock/AI fixtures and the reused
live recording are labelled. Full decode, chapter order, duration, and zero new
generation checks pass. The capture keeps the in-memory wardrobe until planning
is finished; library is captured last and reordered into the edit.
