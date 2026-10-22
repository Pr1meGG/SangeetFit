# Next proof: two owned garments, one private source photo

Prepared 22 October 2026. This is a preflight and observation sheet, **not authorization to submit tasks**. The existing 16-reference scorecard and its two completed catalogue cases remain unchanged; this separate pilot tests the uploaded-garment path.

## Inputs to prepare

- One consenting participant, recorded only as `p01`. Use a clear front-facing person photo with the body in frame. The existing private source is not approved for any additional transmission by its earlier two-task approval.
- `OWN-01`: one upper-body garment the participant owns, with a clear front-facing garment or worn reference; confirm `upper_body` in the app.
- `OWN-02`: a different owned full outfit shown as a complete, front-facing worn look; confirm `full_body` in the app.
- Avoid folded, obstructed or collage references. Enter accurate name, colour, style and occasion tags manually. The app does not infer these facts from the photo.
- Keep source images, references and results outside the repository/public folders. Do not use the participant's private photos/results in screenshots, the video or Devpost. A public demonstration needs separate permitted imagery.

If the available clothes do not support these two categories, declare the actual two supported references before approval. Do not substitute catalogue images and call them owned garments.

## Gates before requesting a bounded run

1. Resolve the shared-store marketplace/browser gate. Configure and initialize the aggregate budget using a refreshed actual balance and task prices, preserving the 25% reserve. The current mock Preview cannot establish live own-clothes quality.
2. Confirm the exact private source and both garment references/categories with the participant. Check orientation, detail and combined prepared request size; the server requires serialized JSON below 4,000,000 bytes.
3. Obtain explicit approval for exactly two live YouCam Cloth V4 tasks with those inputs. Explain that the specified photos leave the device for YouCam processing. No optional skin-analysis task is needed.
4. Verify the intended running app reports live and uses the guarded release. Use the app's upload path and explicit Generate action; no direct provider shortcut or silent mock substitution.

## Run and record

Use the same person-photo version for both cases. Start timing when Generate is pressed; stop when the image is visibly rendered, not merely when a result URL returns. Count failures in the two attempts. Stop on any 429 and do not submit a replacement task automatically.

| Case | Source | Garment input | Category | Rendered | Displayed latency | Face /5 | Garment /5 | Participant choice |
|---|---|---|---|---|---|---|---|---|
| OWN-01 | p01, same photo version | Owned upper-body garment, exact file pending | upper_body | Not run | — | — | — | — |
| OWN-02 | p01, same photo version | Different owned full outfit, exact file pending | full_body | Not run | — | — | — | — |

Scores: 5 means clearly preserved; 4 means minor differences without distracting distortion; 3 or below means changes affecting trust. A missing output is a failure. Ask the actual participant to score identity and garment separately; another person's general impression is separate feedback.

## Minimal demonstration gate

Both outputs must render and receive at least 4/5 from the participant for identity and garment fidelity. The participant then compares, chooses and saves/opens a result without another generation request. This is a narrow two-case engineering gate, not production reliability, sizing validation or an independent user study.

If either result fails, preserve the failure, inspect reference/category/preprocessing and narrow the claim. Any retest needs its own approval. Five testers and completion of the historical 16-reference sweep are not requirements for this two-case pilot or official submission eligibility.

## Still separate

Phone native picker/download and slider checks can use mock/synthetic inputs without consuming YouCam units. Public video, publishing, submission and live activation retain their own gates. No live task was submitted when this document was prepared.
