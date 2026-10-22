# SangeetFit — Pitch and release checklist

Updated 22 October 2026. Unchecked gates are pending, not achieved. The [release procedure](../testing/RELEASE.md) reflects the current one-person pilot and controlled judge-access path; the older [milestones](../plans/2026-10-20-personal-stylist-milestones.md) retain historical five-person targets.

**Release evidence:** historical source `81dd342` passed CI with all 14 offline suites, eight mock-browser suites, TypeScript, production build and lint with zero errors/19 warnings. Actual Redis concurrency passed. The newer KV-variable compatibility change separately passed local verification: 13 offline suites (real Redis explicitly skipped), eight mock-browser suites, TypeScript, build and lint with zero errors/19 warnings, plus independent code/TypeScript review. The approved [mock Preview](https://sangeet-f9wblyyha-ryuk-codes.vercel.app) returns mock mode and `/library` 200 when authenticated; Vercel SSO still blocks anonymous access. Production remains `b3cadb6`. Authenticated CLI checks on 22 October verified the manually created `sangeetfit-live-budget` store as available on the Free plan and connected to `sangeet-fit` in Preview and Production, with sensitive `KV_REST_API_URL` and `KV_REST_API_TOKEN` variables in both scopes and no supplied `UPSTASH_*` pair. The store connection resolved the resource blocker; browser-origin access was not retested. Ledger initialization, a verified deployment of the newer source and judge access remain pending, so an active cap is not established. The user reported PONG and ledger-key existence 0 in the database CLI; no agent data-plane request occurred. Current balance/task prices, auto-upgrade and eviction settings were not checked. See the [cloud/device checkpoint](../testing/CLOUD_CHECKPOINT.md).

## Consumer value and integration

**Pitch:** Choose what to wear for a celebration from clothes you already own, see two personal try-ons, compare them and save your choice. Permitted references are optional inspiration.

The core combines user-confirmed occasion/style/colour metadata with a personal YouCam Cloth V4 preview. It uses a separate full-body source and garment reference, with upload → task → polling. Optional skin-tone analysis uses a separate face selfie. Neither metadata ranking nor skin analysis proves fit, facial preservation or colour suitability.

The collection defaults to 26 original AI-generated model/outfit concepts, with five women's and five men's choices under each of five occasion filters; suitable looks can appear in more than one occasion. Fourteen credited sourced photos remain in the archive, eight wired as candidate references, alongside four legacy mappings. Browsing needs no person photo, but personal VTO does. Emerald Silk Kurta and Sapphire Embroidered Sherwani are pilot-reviewed on one private source; the other men's looks remain unreviewed. No exact seller products or retailer image permissions have been established. **View at seller** appears only for verified exact products; there is no checkout.

Historical approved Cloth V4 successes cover one sample-person/maroon-lehenga pair. The current two-look men's pilot rendered on one consenting person's full-body photo. That participant rated face and garment fidelity 5/5 for both; another observer rated overall AI appearance 4/5. These are limited results, not own-garment reliability or broadly retained identity. The one-person, 16-reference engineering sweep has **two outcomes and 14 pending cases**. Mock references must be explicitly identified in screenshots and video. The wardrobe stays in the page session; top-and-bottom combinations are future work.

## Recorded evidence and internal validation targets

The 16-reference engineering sweep and historical five-tester study are project aspirations, not official mandatory submission tests. A partial scorecard must retain its planned denominator and honest limits; it must not be presented as completed validation. Completing the remaining 14 cases is optional further evidence requiring separate authorization.

- [x] Record the 21 October post-pilot balance/pricing snapshot: 910 units; V4 2/call; optional colour analysis 20/call (not used); reserve 228. Recheck before further spending.
- [x] With one consenting person's full-body photo, run the separately approved two-task pilot: Emerald Silk Kurta and Sapphire Embroidered Sherwani. Both rendered and received participant identity/garment ratings of 5/5. No separate selfie/skin task was used.
- [ ] If the broader sweep is resumed, separately approve the remaining 14 distinct men's references. Keep all 16 predeclared outcomes, including failures. Internal engineering targets: ≥15/16 rendered and identity ≥4/5; ≥13/16 garment and both ≥4/5; median successful render ≤60s; zero duplicate tasks. Recheck price and preserve the 25% credit reserve.
- [x] Label the sweep as one person's engineering evidence. Independent usability and uploaded-own-garment quality remain unverified; make no five-user or broad reliability claim.
- [x] Restrict primary catalogue recommendations to references with matching provenance and recorded live review: Emerald Silk Kurta and Sapphire Embroidered Sherwani. Both are reviewed on one private source only; twelve active references remain a stretch target.
- [x] Record partial actual-device evidence on code `81dd342`: Android 14/Chrome 155 USB-local mock portrait layout, native synthetic-image picker/EXIF preparation, exactly one explicit mock preview request, native JPEG save verified against the packaged reference, choose/original without extra requests, and session clearing/reload. Replacement cleared the prior modal result; distinct-source switching remains pending. Earlier real camera Allow/Cancel passed without capturing or sending a photo. See the [Android record](../testing/ANDROID_CHECK.md).
- [x] Record hardware slider touch 50% → 92%, its 44px-high range control and updated accessibility text using an intercepted live-shaped response visibly labelled **SYNTHETIC UI TEST — NO YOUCAM RESULT**. The server stayed mock with zero provider tasks; this verifies the control, not live output.

## Core release gate

- [x] Verify source `81dd342` in CI: 14 offline suites, eight mock-browser suites, TypeScript, lint and production build, plus actual Redis concurrency. Browser/provider flows were mock-only; this does not establish live quality.
- [ ] Re-run `npm run verify` and `git diff --check` if application source changes before release; record the final source/build used for screenshots and video.
- [ ] Confirm no horizontal overflow, ≥44px key controls and keyboard dialog flow.
- [ ] Finish Android camera reopen/deny, distinct-source switching/recovery and cloud Preview-on-phone checks. Test iPhone Safari or explicitly report missing coverage. Landscape was skipped by user choice; the partial Android record is not a full device pass.
- [ ] Verify live signed-result save/open, expired links and zero-task comparison/reopening on the released build. The Android mock reference download does not establish live signed-result saving.
- [ ] If seller actions exist, recheck every exact item and image permission; otherwise leave absent.
- [x] Verify the manually created Free store is available and connected to Preview and Production, with sensitive KV REST URL/token variables in both scopes. Authenticated CLI evidence confirms the connection; The user subsequently reported PONG and an absent ledger key (EXISTS 0); no agent data-plane request occurred.
- [ ] Refresh balance/task prices and check auto-upgrade/eviction settings; approve an allowance and initialize the persistent shared ledger. The existing connection does not establish an active spending cap.
- [x] Verify KV-name compatibility locally with the complete mock release checks and independent code/TypeScript review.
- [ ] Separately approve deployment and check the deployed shared-budget guard/operator against the connected store; older deployments sharing the provider key bypass the cap.
- [ ] Separately approve live activation and any bounded provider-task batch after ledger/deployment checks. Connecting the store authorized no new deployment, live provider task or ledger write.
- [ ] Verify judge access without relying on a developer's authenticated browser. For a separately approved live release, configure `LIVE_ACCESS_CODE` (24–256 characters) as a server-only deployment secret, privately provide the shared code to judges, and test missing/invalid codes fail closed before paid requests. The invitation code and shared-budget allowance are separate controls; the code does not enforce per-user authentication. Decide a bounded exposure window and monitor credits. Current SSO-protected mock Preview does not satisfy this gate.
- [ ] Verify the deployed Vercel project uses Fluid Compute so the 180-second route deadline can finish; record production URL, actual mode, function setting and a rollback target. Deployment needs separate approval.
- [ ] Freeze features before recording final assets.

## Submission package

Recheck the [official rules](https://youcam-api-skin-ai-ecommerce.devpost.com/rules) and submission form for the current requirements, exact recipient for private repository sharing, deadline/timezone, video visibility and judging access. Earlier rule notes are historical; do not infer access from a working localhost URL.

Five [current mock UI screenshots](screenshots/2026-10-22-mock-ui/README.md) are captured: home, collection, recommendations/rewear plan, empty own-garment form and explicit try-on consent. They contain no private participant image or live output. Package still missing: final video, permitted uploaded-garment/live-comparison screenshots, working judge access and an application-code licence choice. The draft text and recording plan are preparation artifacts; these updated materials have not been published or submitted. A public own-garment success narrative additionally needs separately permitted, authorized and reviewed live demo outputs; the private catalogue pilot cannot supply those images.

- [ ] Repository URL with all source/assets/setup instructions; public with appropriate licensing or explicitly shared as the official rules specify.
- [ ] Settle the application code licence before public distribution; README no longer claims MIT without a LICENSE file.
- [ ] Working testable app URL/build and any necessary judge instructions/credentials through an appropriate private channel.
- [x] Refresh the [English description draft](DEVPOST_DRAFT.md) with recorded evidence, consumer value, YouCam integrations and honest limitations; review it against final assets/access before submission.
- [x] Capture five current UI preparation screenshots in explicit mock mode; record source, viewport and privacy/evidence limits.
- [ ] Final screenshots: occasion home and photo-free model-led collection; own-garment photo/metadata; explained recommendation; explicit Generate/photo consent; actual live result if approved; two-look comparison; chosen/saved look. Label concepts and any mock segment.
- [ ] Keep the participant's name, photo and generated result out of GitHub and the public demo; use a separately permitted demo image.
- [ ] Genuine 1–3 minute end-to-end video following [DEMO_SCRIPT](DEMO_SCRIPT.md), showing the intended device and APIs used.
- [ ] Publish video and submit only with the user's separate approval; add final video URL to README/Devpost.
- [ ] Document significant improvements during the hackathon if applicable.
- [ ] Keep working access and credit contingency through the judging period; verify official end date.

Working schedule: 30–31 October freeze, 1 November submission, 2 November buffer; current roadmap assumes judging availability through 20 November. No external submission, video publication, live task or deployment is authorized by this checklist.
