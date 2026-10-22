# Android Chrome manual verification

Status: **partial physical-device pass, 22 October 2026**. After initially selecting manual testing, the user connected the phone by USB, enabled debugging and authorized this Mac. ADB and Chrome remote debugging inspected only the local SangeetFit tab. Phone: model I2126, Android 14, Chrome 155.0.8059.84; portrait viewport 392×761, five touch points. USB reverse forwarding served the latest verified local mock build at `http://localhost:3500`; Chrome reported a secure context. Device serial and personal content were not recorded.

Observed on actual hardware: no horizontal overflow; native Chrome touch events opened the outfit dialog, confirmed consent, generated exactly one honest mock preview, selected a look and showed the original without another request. A synthetic `File` was injected into the file input to exercise on-device preprocessing; Android's native picker was **not** exercised. The mock image returned HTTP 200, JPEG, 381217 bytes; this is fetch evidence, **not** proof that Android saved it. No page JavaScript errors occurred. Real selfie camera returned a live 1280×1280 stream, and Cancel stopped every video track. No camera image was captured or sent. Raw synthetic test metadata remains under `/tmp`, outside Git.

## Which build to use

The existing public app is [sangeet-fit.vercel.app](https://sangeet-fit.vercel.app/). A read-only check on 22 October found production deployment `dpl_4inrWPNEV24ExC7CR8TPcMwQP6dc`, commit `b3cadb62def2687db6129e95c363e11546e660fe` on `work/sangeetfit-mvp`. The home responds 200; `/library` and `/api/mode` respond 404. This is an older build, 20 commits behind release checkpoint `283d27a` before the budget work. Testing it does not validate current changes.

Use an approved HTTPS mock preview or the current USB-reversed `http://localhost:3500` for the checklist below. Confirm `/api/mode` reports `{"mode":"mock"}` before uploading. Ordinarily the local loopback server belongs to its own device; USB reverse forwarding connects the phone's port 3500 to the Mac's port 3500. An ordinary LAN HTTP URL cannot verify camera access because browsers require a secure context. The USB localhost setup was verified as secure on this phone.

## Checklist — no live YouCam calls

Record phone model, Android version, Chrome version, build SHA and date. Do not record names, private photo copies, access codes or signed result URLs in GitHub.

| Step | Expected | Observed |
|---|---|---|
| Open home in portrait, then landscape | Readable text, usable navigation, no horizontal overflow | Portrait passed on hardware; landscape pending |
| Pick Sangeet; browse men's/women's references and search | Correct occasion, images load, filters work, no generation | Pending |
| Open an outfit; choose a test full-body photo from Android's picker | Preview has correct orientation; upload alone starts no task | Pending |
| Replace source photo | Preview changes; previous source is not silently reused | Pending |
| Generate one mock preview | Clearly labelled reference/mock, not a genuine personal result | Passed: one explicit mock request on hardware |
| Move before/after slider with one finger; open original/zoom | Touch works; full image remains inspectable | Pending |
| Save/open the mock result | Image opens or saves; browser behavior recorded accurately | Pending |
| Optional selfie camera: allow, cancel, reopen and deny | Helpful permission state; camera indicator stops on close; no automatic analysis | Allow/stream/Cancel cleanup passed; reopen/deny pending |
| Clear private session and accept confirmation | Photos, outfit uploads, results and invite field clear | Pending |
| Close/reload | Session-only data does not imply permanent wardrobe storage | Pending |

Camera preview/capture should use a non-sensitive test subject or framing; do not publish a private image. Uploads/captures are prepared locally in mock mode. No real API generation or credit use is part of this checklist. Saving a mock image proves download behavior only; live signed-result saving still needs its own authorized result check.

## Automated coverage

`tests/android-touch.browser.test.mjs` uses Playwright Chromium's Pixel 7 touch emulation, synthetic photos and stubbed task responses. It covers mobile layout, preparation without generation, a budget rejection, touch slider and choice. Existing camera tests use synthetic video. These are separate from the actual-device observations above; touch slider, native picker, Android saving and live output quality are not established by that hardware run.

## Report back

For remaining manual steps, send either the successful step names or the failed step and what happened. No photo or recording is required. Do not convert partial hardware evidence into an all-device or full-checklist pass.
