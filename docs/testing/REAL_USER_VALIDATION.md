# SangeetFit — one-person men's reference validation

Updated 21 October 2026. **No participant photo or new live result has been received or recorded.** This is an engineering sweep of the current men's catalogue, not independent usability evidence or proof of broad face retention. Own-garment quality remains a separate, untested gate. Mock navigation never counts as live image-quality evidence.

## Preconditions

- One tester is planned under reserved pseudonym `p01`. No other participant or photo is authorized. The reserved ID is not a record of consent.
- Obtain one suitable JPG/PNG full-body photo with a clear, unobstructed face, one person, front-facing pose and the intended clothing area visible. A separate selfie is not needed for Cloth V4; optional skin analysis is outside this sweep. Keep the original and generated images outside GitHub, public demos and benchmark JSON. A local path is preferable to attaching a private photo to chat.
- Confirm informed consent for sending the full-body photo to YouCam. The app retains it only in the page session; provider processing and retention are separate. The [YouCam API privacy policy](https://www.perfectcorp.com/fr/perfectbeauty/youcam/privacy-policy-api) describes photo and possible face-derived data processing. Do not imply a local-only VTO.
- Preflight the exact source photo and 16 server-owned garment IDs listed in [benchmark-records.json](benchmark-records.json). The first two are `concept-emerald-kurta` and `concept-sapphire-sherwani`. Recheck the running app says **Live AI**, the intended API project, remaining credits and current Cloth V4 cost. Preserve 25% of units. Do not read or publish API keys.
- Obtain specific approval for **two** pilot tasks. A later batch of at most **14** remaining tasks needs its own approval after reviewing the pilot. This document and the budget snapshot do not authorize any call. Stop on 429; no blind retries.

## Test and review

1. Fix the 16 case IDs and the source-photo version before the pilot. Use the same photo for every case; if it changes, start a separately identified batch rather than presenting unlike images as directly comparable.
2. For each approved case, press **Generate try-on** once. Record the actual live/mock mode, submit/render outcome, Generate-to-render time and task count. A timeout may leave a provider task running; it does not authorize another submission.
3. When a live image renders, have `p01` rate identity and garment fidelity against the source and exact reference. **5:** clearly preserved; **4:** minor differences without distracting distortion; **3 or lower:** visible changes affecting trust. No output is a failure, not an unscored success.
4. Pilot gate: both the emerald kurta and sapphire sherwani must render and receive identity and garment ratings ≥4/5. If either fails, pause the other 14 cases and diagnose photo framing, reference quality or category without hiding the original result.
5. Save/open each result privately as it arrives. The app compares only its two most recent session looks; a later result displaces older looks, and provider links can expire. Comparing, reloading an image and browsing must submit zero additional tasks. Do not publish signed URLs or a contact sheet containing the participant's face.
6. Record each attempt once in [benchmark-records.json](benchmark-records.json), including failures and any task submitted before a timeout. Retests need a separately approved, predeclared batch; keep the original outcome. Use [BENCHMARKS](BENCHMARKS.md) for schema, budget and full-sweep gates.

## Acceptance and reporting

Full-sweep engineering targets are ≥15/16 rendered live results, ≥15/16 identity ratings ≥4, ≥13/16 garment ratings ≥4 and ≥13/16 with both ratings ≥4; successful-result median ≤60 seconds; zero duplicate submissions. These are targets, not achieved results. A passing score describes this one source photo and these 16 references only.

The builder may walk through occasion → recommendation → two looks → comparison → choice, but that is a self-test. Do not report an independent-user completion rate. Actual Android Chrome and iPhone Safari checks remain separate; claim only devices actually tested. Own-clothes upload and garment fidelity also remain unverified until their own approved cases run.

Report the count of attempts, failures, ratings, latency range, source-photo version, device/browser and limits without recording names, photos, result URLs or medical data in the repo. No reference becomes `live-reviewed` solely because a provider task returned success. Final public demo images require separate publication permission or a permitted demo asset.
