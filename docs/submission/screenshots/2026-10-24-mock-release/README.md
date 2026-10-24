# SangeetFit UI captures — Mock Mode (24 October 2026)

MOCK UI EVIDENCE — NOT LIVE YOUCAM OR PHYSICAL-PHONE VALIDATION.

These five screenshots were captured from the running Next.js application in verified mock mode (`/api/mode` returned `{"mode":"mock"}`). Source implementation is git commit `ff924457578b32fa4f89ee765fa87f9cac7b1047` on branch `codex/final-week-release`.

## Captured Views and Specifications

| File | Actual View & Content | Browser Viewport | Output Dimensions | Mode Verified |
|---|---|---|---|---|
| `01-home.png` | Occasion-selection home screen, hero heading, editorial cards, Mock Mode badge | 1440×900 | 1440×900 px | Mock (`/api/mode`) |
| `02-owned-clothes.png` | Two synthetic owned garments ("My kurta", "My full outfit") visible in session wardrobe | 390×844 | 390×844 px | Mock (`/api/mode`) |
| `03-mock-preview.png` | Fitting room modal with explicit "Mock preview — reference outfit, not a personal try-on" label | 390×844 | 390×844 px | Mock (`/api/mode`) |
| `04-comparison.png` | Two result images, headings, mock labels and planning actions; fixed bottom navigation partly covers the final caption | 390×1635 | 390×1635 px | Mock (`/api/mode`) |
| `05-five-event-plan.png` | Five-event board, 4 of 5 planned, 2 owned outfits used, 1 planned rewear, Print / Save as PDF button | 1440×900 | 1440×900 px | Mock (`/api/mode`) |

## Synthetic Inputs and Measured Request Counts

- **Synthetic Inputs**:
  - Garment 1: "My kurta" (upper-body garment, synthetic maroon canvas `#6b1e3a`, confirmed tags: Sangeet).
  - Garment 2: "My full outfit" (full-body garment, synthetic amber canvas `#b45309`, confirmed tags: Sangeet).
  - Source Person Photos: Synthetic client-rendered canvas JPEG test inputs (`#334155`, `#1e293b`). No real personal or downloaded photos were used.
- **Reported network observations by capture run**:
  - Initial five-view capture: Antigravity reported **2 POST `/api/vto` requests**, one explicit Generate for each garment.
  - Comparison correction: a separate session reported **2 additional mock POST requests**, one explicit Generate for each garment. The two completed runs therefore report four mock requests in total, not two across production of this asset batch.
  - Antigravity reported no additional generation requests from uploads, comparison or planning. Codex inspected the request-monitoring scripts but did not rerun these capture sessions or retain their raw network logs with the assets.
  - These are local mock app requests, not live YouCam tasks or provider-spending evidence.

## Visual Observations and Evidence Boundaries

- **Visual Observations**:
  - Mock labels ("Mock preview — reference outfit, not a personal try-on", "This shows the garment reference only, not a generated image of you", "Reference image only") are visibly rendered.
  - In `04-comparison.png`, the 390×1635 viewport shows both result images, headings, mock labels and planning actions. The fixed bottom navigation partly obscures the final reference-only caption; this is a framing limit, not a complete-card capture. Keep this batch as mock preparation evidence and refresh final public screenshots against the approved released journey.
  - No horizontal layout overflow observed at 390px or 1440px viewports.
- **Evidence Boundaries**:
  - Captured in headless Chromium under local browser emulation; does not establish physical phone touch behaviour, mobile camera integration, or native file saving.
  - Visual layout checks under emulation do not constitute formal accessibility compliance certification.
  - Represents synthetic mock output only; does not establish live YouCam API Cloth V4 rendering quality, likeness preservation, garment drape, or sizing accuracy.
