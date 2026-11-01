# Current UI captures — mock mode, 1 November 2026

Captured from the local app (`MOCK_MODE=true`, port 3301) by `work/sangeetfit-motion/capture-stills.mjs` on source `8bfd5e6` (= production app code `a697fdf`; later commits are docs only). Every `/api/vto` and `/api/skin` request was blocked; **0 were attempted** ([receipt](capture-receipt.json)). Each shot exists at desktop 1440×960 (@2x) and phone 390×844 (@3x, Chromium emulation, not a physical phone).

| File | Shows |
|---|---|
| 01-home | Home hero: five celebrations, one wardrobe |
| 02-board-empty | Five-event board before any choice (0 of 5) |
| 05-add-own-outfit | Add-an-outfit form filled in; no AI task runs on add |
| 03-board-planned | 5 of 5 planned, 1 owned outfit used, 1 planned rewear (Sangeet and Reception) — counters read from the app and asserted |
| 04-pdf-plan | Print / Save as PDF view: text only, no photos or links |
| 06-fitting-room | Fitting room after the photo notice, photo ready, stopped **before** Generate |
| 07-collection | Collection of 26 labelled AI outfit concepts |

**Limits — keep these out of any claim:**

- The "owned" garment (*My midnight lehenga*) uses the AI concept image of the Midnight & Gold Lehenga as a stand-in. It is not a photo of a real owned garment.
- The person in 06 is the user-cleared AI-created demo source (`female-source.jpg`), the same image used in the 26 Oct live pilot.
- The navbar shows **Mock Mode**. No shot contains a try-on result; for a genuine render, use the video's live production take.
- Not published. Uploading to Devpost needs the user's approval.

Supersedes the older captures in this folder's parent (`01-home.png` … `07-share.png`, which show the retired skin-analysis UI) and `2026-10-22-mock-ui/`.
