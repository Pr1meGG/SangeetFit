# SangeetFit — Devpost description draft

Updated 22 October 2026. This text has not been submitted. Refresh the evidence section after any further authorized testing and before publication; final screenshots, video and judge access remain pending.

## Inspiration

Choosing what to wear across Sangeet, Mehendi, Haldi, a wedding and a reception often means repeatedly putting on outfits just to compare them. We built SangeetFit for people deciding between celebration clothes they already own. The goal is to make that choice easier to explore before changing clothes.

## What it does

Users can browse a model-led celebration collection without uploading a photo, then choose an occasion and add photos of their own upper-body garments or complete outfits. They confirm each garment's colour, style and occasion tags. SangeetFit ranks matching items using those stated details and explains each recommendation in plain language; it does not claim to infer style or physical fit from the photo. The collection contains 26 AI-generated concepts for inspiration, not seller products or personal results. Two references have limited live review on one source photo; the others remain unreviewed candidates.

To preview an outfit on themselves, the user supplies a separate full-body photo, sees where live photo processing will occur, and explicitly presses **Generate try-on**. They can compare two recent results from the same source photo, inspect the original and result, choose a favourite and save or open an image. Opening, comparing or revisiting a result does not start another generation task. The wardrobe, photos and choices are kept only in the current page session and may disappear on refresh. Fourteen credited sourced photos remain available in the archive, including browse-only images; seller links appear only for verified exact products.

## How we built it

The web app uses Next.js, TypeScript and YouCam AI Clothes Virtual Try-On V4. Its server uploads the person's image and garment reference through the YouCam File API, submits one Cloth V4 task after the user presses Generate, polls for completion and returns the result. It validates catalogue IDs or uploaded JPEG/PNG images before making provider requests. An optional YouCam skin-tone flow uses a separate face selfie; it is not required for clothing recommendations or try-on.

Recommendations are deterministic and based on user-confirmed occasion, style and colour metadata. They are explanations of those inputs, not a learned suitability or sizing score. Mock mode is labelled and displays a reference placeholder rather than a generated image of the user.

## Current evidence and limits — update before submitting

The [22 October checkpoint](../testing/CLOUD_CHECKPOINT.md) records passing CI for source `81dd342`: all 14 offline suites, eight mock-browser suites, TypeScript, production build and lint with zero errors. The shared-budget code also passed actual Redis concurrency checks. These checks establish software behaviour, not live image quality or an active spending cap.

Earlier authorized Cloth V4 tests succeeded for one sample-person/reference pair. A later two-task catalogue pilot rendered Emerald Silk Kurta and Sapphire Embroidered Sherwani on one consenting person's full-body photo. That participant rated both face and garment fidelity 5/5 for each result; another observer rated overall AI appearance 4/5. These are limited subjective results from one source, not proof of uploaded-own-garment quality, broad face preservation or independent usability. The internal 16-reference scorecard has two outcomes and 14 pending cases; further tasks need separate approval. That scorecard and the historical five-tester goal are internal validation targets, not official submission requirements. AI previews can alter facial or clothing details and do not establish physical fit or size.

Actual Android 14/Chrome 155 checks partially passed in local mock mode: portrait layout, explicit one-request preview, choosing/original inspection and a real camera stream whose tracks stopped on Cancel. Native picker, saving, landscape, the touch slider on hardware and iPhone Safari remain unverified. No camera photo was captured or sent. The current protected mock Preview requires Vercel login and is not ready for judge access; production still serves an older build. Full device evidence is in the [Android record](../testing/ANDROID_CHECK.md).

The participant's identity, photos and results will not appear in GitHub or the public demo. Record the final demo with a separately permitted source image. Any narration of successful personal-garment try-on must wait for its own authorized, reviewed live output; the catalogue pilot cannot support that claim. Combining separate tops and bottoms and a persistent wardrobe are later product directions.

## Internal release notes — do not paste into the submission form

- Post-pilot account snapshot on 21 October: 910 units; Cloth V4 2 units per call; optional facial colour-tone analysis earlier quoted at 20 units per call and not used. Keep a 25% reserve (228 units), refresh balance/prices before further spending, and separately approve each bounded batch. No new live task was submitted for this draft.
- The approved [mock Preview](https://sangeet-f9wblyyha-ryuk-codes.vercel.app) serves `mode:mock` and `/library` 200 behind Vercel SSO. Production remains `b3cadb6`. Shared-budget code is tested, but no store exists or allowance is seeded: marketplace acceptance and denied browser-origin permission block setup. Do not describe the cap as active or this Preview as public judge access. Live activation remains separately gated.
- Add only verified benchmark results, genuine screenshots, the final public 1–3 minute video and a working judge-accessible URL after those exist. Do not present mock imagery as live try-on evidence.
- Confirm repository access, source licensing, permitted demo-image use and judging availability before publishing. No final judge-access or video URL is supplied by this draft.
