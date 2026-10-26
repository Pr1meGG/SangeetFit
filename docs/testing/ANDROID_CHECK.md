# Android Chrome manual verification

## Current release check — 24 October 2026

**Core portrait mock journey passed on physical Android; remaining coverage is listed below.** Tested release checkout: `e2eb6cdf690f6870385b774fced3d47a37a1a11c`. Device I2126, Android 14, Chrome 155.0.8059.84, viewport 392×761. The authorized USB connection served `http://localhost:3560/` from an explicitly mock local server; `/api/mode` confirmed mock and Chrome reported a secure context. No live YouCam tasks were submitted.

| Check | Observed result and method |
|---|---|
| Browse and add two owned outfits | Home/gallery had no horizontal overflow. Two labelled synthetic garments were added with File payloads on physical Chrome; preparation created zero generation requests. This is not native-picker coverage. |
| Explicit generation and comparison | Exactly two local mock VTO requests, zero skin requests. Both labelled reference results rendered; comparison, original, zoom and planning added zero requests. |
| Five-event plan | Five of five events assigned, two distinct owned outfits, two planned rewears; the Haldi reference remained labelled AI inspiration/unreviewed. |
| Native result saving | Android saved a 4,564-byte JPEG whose SHA-256 matched the mock result. This does not prove live signed-result saving. |
| Native PDF saving and reopening | Android's Save as PDF produced the retained [one-page PDF](final-week-2026-10-24/android-phone-plan.pdf). The tester independently opened it in the normal phone file app and confirmed all five events readable. Read-back and visual inspection found correct outfits/counts, zero images/annotations and no URLs or checked private markers. [Extracted text](final-week-2026-10-24/android-phone-plan.txt). |
| Invalid input and source replacement | Invalid JPEG bytes produced a usable JPG/PNG error; valid synthetic replacement recovered. A distinct synthetic source prepared at 400×600 and cleared the old modal result. These used File payloads; neither created generation requests. |
| Clear private session and reload | Owned uploads, comparison, plan and consent reset; reload retained no source/results/owned fixtures. |
| Camera-denied recovery | A browser permission override on physical Chrome produced the permission-denied guidance, Cancel and upload fallback, without capture or analysis. The original permission was restored. Native OS prompt denial/reopen was not tested. |

The native garment picker delivered a 900×1600 prepared image, but the intended synthetic fixture was not confirmed. The image was discarded without viewing, retention or generation. Do not count this as a verified synthetic native-picker journey. No page errors were observed.

Two harness issues were isolated without app changes: smooth-scroll touch targets needed stable coordinates, and the initial CDP connection overrode downloads. Restoring the browser's default download behavior allowed the existing result to save without another generation. A direct ADB PDF-open attempt lacked Android document permission; the tester used the normal file app instead.

Sanitized observations and hashes: [24 October device evidence](ANDROID_DEVICE_EVIDENCE_2026-10-24.json). Landscape, iPhone, cloud-on-phone, verified native full-body picker, native camera prompt/reopen and live quality/saving remain unverified. This is single-device mock evidence, not independent usability or fit validation. Historical checks below retain their original scope and dates.

## Historical check — 22 October 2026

Status: **partial physical-device pass, 22 October 2026**. After initially selecting manual testing, the user connected the phone by USB, enabled debugging and authorized this Mac. ADB and Chrome remote debugging inspected only the local SangeetFit tab. Phone: model I2126, Android 14, Chrome 155.0.8059.84; portrait viewport 392×761, five touch points. USB reverse forwarding served the latest verified local mock build at `http://localhost:3500`; Chrome reported a secure context. Device serial and personal content were not recorded.

The initial hardware check covered portrait layout without overflow, a synthetic `File` injected into the page, one explicit mock request, choice/original inspection and a real 1280×1280 camera stream whose tracks stopped on Cancel. That initial run did not establish native picker or download behavior. No camera image was captured or sent.

The later connected-phone check exercised Android's actual photo picker: the user confirmed a synthetic image, and the app prepared a 400×600 preview without a task. Generate then made exactly one mock request. Save downloaded a 381217-byte JPEG to the phone; its SHA-256 matched the packaged Emerald reference (`a3464154fbe72bb25caf351d22c402ba252e5058cc9576e7733dc603a0641d64`). Android named it `vto-concept-emerald-kurta.png.jpg`. This proves an actual local mock-image download, not saving an expiring live-provider URL.

The native Replace control accepted the synthetic B fixture (stored 600×400, EXIF orientation 6), prepared it as 400×600 and cleared the previous modal result. Distinct-source switching was not established: the observation waiting for a different prepared image did not complete. Keep that case pending rather than inferring a pass from picker confirmation alone.

A separately intercepted, live-shaped response unlocked the existing before/after component while the actual server remained mock. The phone displayed **SYNTHETIC UI TEST — NO YOUCAM RESULT**. Chrome touch input moved the 44px-high range from 50 to 92, with `92% of generated result visible` reported by accessibility metadata. Choice and original view added no requests. Clear private session removed comparison and reset consent; reload retained no source/results. No page errors were observed. This run used one real mock route request and one locally intercepted fixture request, with **zero YouCam tasks**. It establishes hardware control behavior, not live output quality.

Sanitized metadata is in [ANDROID_DEVICE_EVIDENCE.json](ANDROID_DEVICE_EVIDENCE.json); temporary test harnesses and image bytes stay outside Git. Tested application source is `81dd342`; checkpoint `3353793` only changed documentation. Landscape was explicitly skipped by the user. iPhone, cloud Preview-on-phone, camera reopen/deny, distinct-source recovery and live signed-result download remain unverified.

## Which build to use

A subsequently approved [mock Preview](https://sangeet-f9wblyyha-ryuk-codes.vercel.app) deployed from `81dd342`. Authenticated mode/library checks passed; Vercel login is required. This cloud Preview has not been tested on the phone; hardware observations above used USB-local mock. See [cloud checkpoint](CLOUD_CHECKPOINT.md).

The existing public app is [sangeet-fit.vercel.app](https://sangeet-fit.vercel.app/). A read-only check on 22 October found production deployment `dpl_4inrWPNEV24ExC7CR8TPcMwQP6dc`, commit `b3cadb62def2687db6129e95c363e11546e660fe` on `work/sangeetfit-mvp`. The home responds 200; `/library` and `/api/mode` respond 404. This is an older build, 20 commits behind release checkpoint `283d27a` before the budget work. Testing it does not validate current changes.

The 22 October checklist below used USB-reversed `http://localhost:3500`; the 24 October run used port3560. Confirm `/api/mode` reports `{"mode":"mock"}` before uploading to either an approved HTTPS preview or USB-reversed localhost. Ordinarily loopback belongs to its own device; USB reverse forwarding connects the phone's chosen port to the same port on the Mac. An ordinary LAN HTTP URL cannot verify camera access because browsers require a secure context. USB localhost was verified as secure on this phone.

## Historical checklist — 22 October, no live YouCam calls

Record phone model, Android version, Chrome version, build SHA and date. Do not record names, private photo copies, access codes or signed result URLs in GitHub.

| Step | Expected | Observed |
|---|---|---|
| Open home in portrait, then landscape | Readable text, usable navigation, no horizontal overflow | Portrait passed on hardware; user skipped landscape |
| Pick Sangeet; browse men's/women's references and search | Correct occasion, images load, filters work, no generation | Pending |
| Open an outfit; choose a test full-body photo from Android's picker | Preview has correct orientation; upload alone starts no task | Passed with synthetic image and native picker; upload started zero tasks |
| Replace source photo | Preview changes; previous source is not silently reused | Partial: native replacement accepted EXIF-6 fixture, prepared 400×600 and cleared result; distinct-source switch pending |
| Generate one mock preview | Clearly labelled reference/mock, not a genuine personal result | Passed: one explicit mock request on hardware |
| Move before/after slider with one finger; open original/zoom | Touch works; full image remains inspectable | Slider 50→92 and original passed using visibly labelled synthetic response on hardware; zoom pending |
| Save/open the mock result | Image opens or saves; browser behavior recorded accurately | Passed: actual 381217-byte JPEG download, matching packaged-reference SHA-256 |
| Optional selfie camera: allow, cancel, reopen and deny | Helpful permission state; camera indicator stops on close; no automatic analysis | Allow/stream/Cancel cleanup passed; reopen/deny pending |
| Clear private session and accept confirmation | Photos, outfit uploads, results and invite field clear | Comparison/source removed and consent reset; own-upload and invite-field variants not exercised in this run |
| Close/reload | Session-only data does not imply permanent wardrobe storage | Reload retained no source/results; closing Chrome not tested |

Camera preview/capture should use a non-sensitive test subject or framing; do not publish a private image. Uploads/captures are prepared locally in mock mode. No real API generation or credit use is part of this checklist. Saving a mock image proves download behavior only; live signed-result saving still needs its own authorized result check.

## Automated coverage

`tests/android-touch.browser.test.mjs` uses Playwright Chromium's Pixel 7 touch emulation, synthetic photos and stubbed task responses. It covers mobile layout, preparation without generation, a budget rejection, touch slider and choice. Existing camera tests use synthetic video. Emulated checks remain separate from the physical-device observations above; neither establishes live output quality or coverage of every phone.

## Report back

For remaining manual steps, send either the successful step names or the failed step and what happened. No photo or recording is required. Do not convert partial hardware evidence into an all-device or full-checklist pass.
