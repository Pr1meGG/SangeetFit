# Video v3 — shot list

> Planning and PDF export were archived on 2 November 2026. Any planning storyboard below is historical. Use [the current demo direction](DEMO_SCRIPT.md).

Written 31 October 2026. Plan only; nothing recorded or published. Story and rules come from [DEMO_SCRIPT.md](DEMO_SCRIPT.md) and the [lock-in](../research/hackathon-videos/07-lock-in.md). This file turns them into a recordable cut for the **current production build `a697fdf`**.

**Target: 2:00** (rules allow 1–3 min). Phone portrait (390×844) framed in a 1920×1080 canvas, captions burned in.

**Built draft (31 Oct, on hold):** `work/video/sangeetfit-demo-v3.mp4`, 86 s, 1920×1080, 30 fps, burned-in captions, synthetic placeholder voice (macOS "Rishi") over the v2 original music bed. Shots 3–4 are the real production take (one live Cloth V4 render, 26.0 s wait shown 4× faster); the planner shots are mock-build footage with zero try-on requests. Differences from the table below: the planner picks are collection looks, so the app reports 0 owned outfits and 0 rewears, and the rewear narration was dropped; shot 6 reads "0 of 5 decided → 5 of 5 planned, 1 preview generated". Still to do: the user's own voiceover, a production-mode re-record of the planner shots (removes the dev "N" badge), and approved upload to YouTube.

**Why v3:** the v2 cut (88 s) shows the removed bottom bar and the old plan cards. Judges who open the live app would see a different UI from the video.

## Shots

| # | Time | Screen (current UI) | Voiceover | Source |
|---|---|---|---|---|
| 1 | 0:00–0:10 | Plan board, all five slots empty, "0 of 5 planned" | "Sangeet is Friday. Then Mehendi, Haldi, the wedding, the reception. A full wardrobe, and not one outfit decided." | New capture |
| 2 | 0:10–0:30 | Home hero → menu → My wardrobe → add-outfit form filled (name, type, colour, occasions) | "SangeetFit plans all five with clothes I already own, and lets me preview only the looks I'm unsure about. Adding clothes never starts an AI task." | New capture |
| 3 | 0:30–0:40 | Plan board: pick **Midnight & Gold Lehenga** for Sangeet → "Try on this look" | "This one I'm unsure about, so I preview it." | New capture |
| 4 | 0:40–1:10 | Photo notice (24-hour wording readable) → photo → **Generate try-on** → wait → render → original/result slider | "I give permission, add a full-body photo and press Generate. YouCam's Cloth V4 builds the look from my photo and the garment. Nothing generates until I ask." Caption: *YouCam Cloth V4: photo + garment → task → result · real wait N s (shortened)* | **Decision below** |
| 5 | 1:10–1:35 | Close dialog → board shows Sangeet filled → assign a second event (rewear) → fill the rest | "I choose it for Sangeet. My favourite works again for Haldi, so that's a rewear. I fill the rest without generating anything new." | New capture |
| 6 | 1:35–1:45 | Split: empty board (shot 1) vs completed board with its **real** counters | "Before: five events, no decisions. After: a complete plan, rewears marked, and only one look previewed." | Edit |
| 7 | 1:45–1:55 | **Print / Save as PDF** → text-only plan | "I save the plan as a simple PDF: each event and outfit. No photos, no links." | New capture |
| 8 | 1:55–2:00 | End card: *SangeetFit · Built with YouCam Cloth V4 · sangeet-fit.vercel.app · Photos kept privately for 24 h · Visual guidance, not a fit guarantee* | "SangeetFit: five celebrations, clothes I already own, and a preview only when I'm unsure." | Edit |

Counter values in shot 6 and the wait in shot 4 are read from the actual recording, never typed in from this plan.

## Decision: the live try-on shot (4)

| Option | What it shows | Cost | Honesty note |
|---|---|---|---|
| **A. One fresh live render on production** (recommended) | Current UI end to end, real wait, same Midnight & Gold Lehenga, AI demo-person photo | 1 try-on (2 units of the shared allowance; last recorded balance 10, on 27 Oct) | Fully current. Uses allowance judges could otherwise use |
| B. Reuse the 26 October live recording | Real Cloth V4 render of the same lehenga, measured 15.96 s | Free | Older UI inside the dialog; caption *"Real render recorded 26 October"* |

Mock mode is never used for shot 4: a mock result shows a reference image, not a try-on.

## How it gets made

1. **Shots 1–3, 5, 7:** a scripted Playwright capture of the local **mock** build at 390×844 (zero generation requests, logged), so retakes are free and identical. No result image appears in these shots, so no mock label is needed.
2. **Shot 4:** option A (screen-recorded at the same viewport) or option B (existing clip).
3. **Voiceover:** the user's own voice reads the lines above (winners' advice: a human voice beats synthetic). Fallback: the v2 synthetic voice, disclosed in the AI note.
4. **Edit with ffmpeg:** phone frame on a dark canvas, burned-in captions, YouCam named on screen in shot 4, the v2 music bed at low level.
5. **Check before upload:** 1–3 min, no secrets/task IDs/signed URLs, no private photos, every number from the recording.

Upload destination, title and description need the user's approval of the exact text.
