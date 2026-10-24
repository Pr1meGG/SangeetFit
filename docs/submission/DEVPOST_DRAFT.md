# SangeetFit — Devpost description draft

Updated 24 October 2026. **Not published or submitted.** The release narrative below reflects locally implemented comparison-to-plan assignment, counters and text-only PDF. See [local wardrobe verification](../testing/WARDROBE_DECISION_CHECK_2026-10-23.md) for dated mock/browser/PDF evidence and its limits; review the actual released build before using this publicly. Demo-source live validation, physical-phone release checks, final video and judge access remain pending. No independent guest study is planned for this release.

## Inspiration

A wedding can mean Sangeet, Mehendi, Haldi, Wedding and Reception — five occasions, with choices that are easy to lose across photos and conversations. SangeetFit starts with a different question: what can I wear from the clothes I already own? Our goal is to help wedding guests plan, rewear a favourite, preview an uncertain choice and leave with a usable wardrobe plan.

## What it does — locally verified software, live gates pending

Users add photos of their own upper-body garments or complete outfits and confirm each item's name, colour, style and occasion tags. The five-event board records an outfit for each celebration. Recommendations explain the metadata they match rather than pretending to infer a person's style, size or physical fit from an image. Optional colour suggestions are inspiration, not an undertone analysis or a personal suitability guarantee.

When someone wants a personal preview, they provide a separate suitable full-body source photo, consent to live photo processing and explicitly press **Generate try-on**. They can compare two existing results, inspect the original and choose **Plan for Sangeet**, or the currently selected occasion. The board records the outfit decision and the comparison shows **Planned for Sangeet**. Two photo versions of the same outfit still represent one garment; planning, comparing and reopening an existing result do not request another generation.

The board counts events planned, distinct owned outfits assigned and planned rewears. Planned rewears are owned event assignments minus distinct assigned owned garments: a plan-level count, not a claim that purchases or waste were reduced. **Print / Save as PDF** creates a text-only five-event plan with event names, garment names, owned/reference labels and undecided slots. Photos, generated images, access codes and provider links stay out of that export.

Users can also browse a photo-free collection of labelled outfit concepts and sourced references for inspiration. These are not personal try-on results or verified seller products. The current wardrobe, person photos, generated results and decisions belong to the page session; they are not a permanent saved wardrobe. Live generation additionally sends the declared person and garment photos to YouCam for processing.

## How we built it

SangeetFit uses Next.js, TypeScript and YouCam AI Clothes Virtual Try-On V4. After explicit Generate, its server validates the person/reference inputs, uploads them through the YouCam File API, submits the clothing task and polls for the result. Uploaded references declare `upper_body` or `full_body`; catalogue references use server-owned mappings. Live access and the shared generation allowance are separate server controls.

The event-to-outfit plan connects comparison to a concrete choice without a new generation endpoint. The export uses the browser's print/save workflow with a dedicated text view. An optional YouCam skin-tone flow uses a separate face selfie; it is not required for the core clothing journey or evidence of clothing suitability. Mock mode displays labelled reference placeholders rather than generated images of the user.

## Evidence and limits — refresh before publication

The [recorded catalogue pilot](../testing/REAL_USER_VALIDATION.md) produced two live looks on one consenting person's private full-body source. That participant rated identity and garment fidelity 5/5 for each; another observer rated overall AI appearance 4/5. These are limited subjective results for two catalogue references on one source, **not proof of uploaded-own-garment quality, broad identity retention or independent usability**. The 16-reference engineering sweep has two outcomes and 14 pending cases; it is an internal target, not an official submission requirement.

The [owned-garment validation](../testing/OWN_GARMENT_PILOT.md) is prepared and **not run**. It declares exactly two Cloth V4 attempts total: the user's upper-body garment and complete outfit on the same licensed demo-person source. Its two-case gate requires both outputs to visibly render and the user to score source likeness and garment fidelity separately at least 4/5. This is single-evaluator **demo-source technical validation**, not a participant satisfaction result. Every attempt, failure and visible processing time must be retained; a failed case narrows the claim, and two failed cases prevent owned-clothes live signoff without a separately approved retest. There is no completed owned-garment success claim to add today.

The user will test the released flow on their own physical phone. No independent guest study is planned this week; the [historical guest protocol](../testing/WARDROBE_GUEST_PLAYTEST.md) is deferred research. No independent usability, user completion rate, participant satisfaction, demand result or savings outcome is claimed.

Historical software checks are recorded in the [cloud checkpoint](../testing/CLOUD_CHECKPOINT.md) and [23 October UI playtest](../testing/UI_V2_PLAYTEST_2026-10-23.md). [Android evidence](../testing/ANDROID_CHECK.md) covers partial USB-local mock behavior, including a real mock-image download; the synthetic slider test remains labelled **SYNTHETIC UI TEST — NO YOUCAM RESULT**. These records do not verify the new assignment/PDF flow, current live-output saving or iPhone Safari.

AI previews may alter a person's face or clothing details; they do not establish fit or sizing. Existing private catalogue participant photos/results remain out of public footage and GitHub. The intended demo uses the same two declared attempts only after evidence permits source/reference transmission, transformation and public use of derived outputs/footage. Otherwise use clearly labelled mock narration. Family collaboration, generating separate tops and bottoms, permanent wardrobe storage, accounts, checkout, a chatbot and another redesign remain outside this release story. Optional skin analysis stays outside the pilot and headline demo.

## Internal release notes — do not paste into Devpost

- [local wardrobe verification](../testing/WARDROBE_DECISION_CHECK_2026-10-23.md) records full mock verification, review, responsive/keyboard checks and actual PDF inspection. Record the final recording/release SHA separately; physical-device printing, live-output quality and deployed access remain pending.
- The 24–30 October sprint targets submission on **30 October**, with **31 October–1 November** reserved for recovery. The official deadline is **2 November 2026, 22:15 IST**, with judging through **20 November**. Recheck [official rules](https://youcam-api-skin-ai-ecommerce.devpost.com/rules) and the final form before publication.
- [Historical budget initialization](../testing/BUDGET_INITIALIZATION_CHECK.json) records a 10-unit/five-VTO starter allowance, not a current balance. **20 judging VTO attempts** is proposed planning capacity, separate from the two validation attempts; fresh authorized pricing/balance inspection and approval of the exact unit cap/reserve remain pending. No automatic refill or top-up.
- [Judge preflight](../testing/JUDGING_ACCESS_PREFLIGHT.md) requires a clean browser without developer login, private code handling, the same two approved validation previews, actual-phone live saving/PDF opening, function-duration/Fluid Compute verification and access through **20 November**. A protected mock Preview or live-mode badge cannot pass those gates. No extra release-smoke batch is planned.
- Capture raw full-journey footage, actual result save/open and PDF save/open during the two-attempt session; temporary results and page-session state cannot be assumed available for later recording. Edit that footage into a **2:30 English video** and refresh five final screenshots.
- Keep the repository **private** and verify the organizer's specified private-sharing route, recipient and access. Public screenshots, video, judge instructions, source/setup access and application-code licence need final verification; this draft supplies no final video or newly verified judge URL.
- The user has **4–6 hours daily**, owns phone checks and single-evaluator ratings, and owns manual judging-period access/allowance checks through **20 November**. No monitoring automation or guest recruitment is planned.
- Live tasks, deployments, video publication, credential sharing and Devpost submission retain their specific approval boundaries. This documentation update performs none of them.
