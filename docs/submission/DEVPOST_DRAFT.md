# SangeetFit — Devpost description draft

Drafted 21 October 2026. This text has not been submitted. Recheck the evidence and replace the status section after the live pilot, device checks and final demo are complete.

## Inspiration

Choosing what to wear across Sangeet, Mehendi, Haldi, a wedding and a reception often means repeatedly putting on outfits just to compare them. We built SangeetFit for people deciding between celebration clothes they already own. The goal is to make that choice easier to explore before changing clothes.

## What it does

Users choose an occasion and add photos of their own upper-body garments or complete outfits. They confirm each garment's colour, style and occasion tags. SangeetFit ranks matching items using those stated details and explains each recommendation in plain language; it does not claim to infer style or physical fit from the photo.

To preview an outfit, the user supplies a separate full-body photo, sees where live photo processing will occur, and explicitly presses **Generate try-on**. They can compare two recent results from the same source photo, inspect the original and result, choose a favourite and save or open an image. Opening, comparing or revisiting a result does not start another generation task. The wardrobe, photos and choices are kept only in the current page session and may disappear on refresh. A credited reference collection offers optional inspiration; seller links appear only for verified exact products.

## How we built it

The web app uses Next.js, TypeScript and YouCam AI Clothes Virtual Try-On V4. Its server uploads the person's image and garment reference through the YouCam File API, submits one Cloth V4 task after the user presses Generate, polls for completion and returns the result. It validates catalogue IDs or uploaded JPEG/PNG images before making provider requests. An optional YouCam skin-tone flow uses a separate face selfie; it is not required for clothing recommendations or try-on.

Recommendations are deterministic and based on user-confirmed occasion, style and colour metadata. They are explanations of those inputs, not a learned suitability or sizing score. Mock mode is labelled and displays a reference placeholder rather than a generated image of the user.

## Current evidence and limits — update before submitting

The project's current verification record reports passing offline, build and mock-browser checks. Earlier authorized live Cloth V4 tests succeeded for one sample-person/reference pair. **Live quality for uploaded personal garments, face preservation across users, garment fidelity, real-phone camera and image saving have not yet been established.** The planned twelve-case quality scorecard has zero recorded outcomes and the five-person usefulness study has not run. AI previews can alter facial or clothing details and do not establish physical fit or size.

Next we will run a separately authorized six-task pilot, then extend the predeclared scorecard to twelve attempts across five consenting people if the pilot passes. We will check Android Chrome and iPhone Safari, review permitted reference outputs, and record the final demo from the verified build. Combining separate tops and bottoms and a persistent wardrobe are later product directions.

## Internal release notes — do not paste into the submission form

- Read-only account snapshot on 21 October: 916 units; Cloth V4 2 units per call; optional facial colour-tone analysis 20 units per call. Keep a 25% reserve (229 units), recheck the balance before testing, and approve each bounded live batch. No new live task was submitted for this draft.
- Add only verified benchmark results, genuine screenshots, the final public 1–3 minute video and a working judge-accessible URL after those exist. Do not present mock imagery as live try-on evidence.
- Confirm repository access, source licensing, participant permission and judging availability before publishing. No repository, demo or video URL is supplied by this draft.
