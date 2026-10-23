# SangeetFit — Devpost description draft

Updated 23 October 2026. **Not published or submitted.** The release narrative below reflects locally implemented comparison-to-plan assignment, counters and text-only PDF. See [local wardrobe verification](../testing/WARDROBE_DECISION_CHECK_2026-10-23.md) for mock/browser/PDF evidence and its limits; review the actual released build before using this publicly. Owned-garment live success, independent guest outcomes, final video and judge access remain pending.

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

The [owned-garment pilot](../testing/OWN_GARMENT_PILOT.md) is prepared and **not run**. Its success gate requires both declared uploaded garments to visibly render on the same source and receive participant identity and garment scores of at least 4/5. Every attempt, failure and visible processing time must be recorded; later success cannot erase an earlier failure. There is no completed owned-garment success claim to add today.

The [3–5-guest playtest](../testing/WARDROBE_GUEST_PLAYTEST.md) is prepared and **not run**. It will record actual independent/assisted completion, task times, confusion and whether the plan helps a real wardrobe decision, with mock previews disclosed. No user completion rate, demand result or savings outcome is claimed.

Historical software checks are recorded in the [cloud checkpoint](../testing/CLOUD_CHECKPOINT.md) and [23 October UI playtest](../testing/UI_V2_PLAYTEST_2026-10-23.md). [Android evidence](../testing/ANDROID_CHECK.md) covers partial USB-local mock behavior, including a real mock-image download; the synthetic slider test remains labelled **SYNTHETIC UI TEST — NO YOUCAM RESULT**. These records do not verify the new assignment/PDF flow, current live-output saving or iPhone Safari.

AI previews may alter a person's face or clothing details; they do not establish fit or sizing. Existing private participant photos/results remain out of public footage and GitHub. Any public demo needs separately permitted imagery and its own authorized live proof, or clearly labelled mock narration. Family collaboration, generating separate tops and bottoms, permanent wardrobe storage and checkout remain outside this release story.

## Internal release notes — do not paste into Devpost

- [local wardrobe verification](../testing/WARDROBE_DECISION_CHECK_2026-10-23.md) records full mock verification, review, responsive/keyboard checks and actual PDF inspection. Record the final recording/release SHA separately; physical-device printing, live-output quality and deployed access remain pending.
- [Historical budget initialization](../testing/BUDGET_INITIALIZATION_CHECK.json) authorized a 10-unit/five-VTO starter allowance. It is neither a current balance nor sufficient evidence of a judging allowance. Specific fresh balance/pricing inspection, a separately approved judging budget and deployed runtime enforcement are still needed.
- [Judge preflight](../testing/JUDGING_ACCESS_PREFLIGHT.md) requires a clean browser without developer login, private code handling, two specifically approved fresh previews, actual-device live saving, function-duration/Fluid Compute verification and access through **20 November**. A protected mock Preview and a live-mode badge cannot pass those gates.
- Public screenshots, final 1–3 minute video, judge URL/instructions, repository access and application-code licence need final verification. There is no final video or newly verified judge URL supplied by this draft.
- Recheck [official rules](https://youcam-api-skin-ai-ecommerce.devpost.com/rules) and the final form. The [recorded schedule](../research/competition-facts.md) is **2 November 2026, 11:45 AM Eastern** for submission and **3–20 November** for judging. Target submission **1 November**.
- Live tasks, deployments, video publication, credential sharing and Devpost submission retain their specific approval boundaries. This documentation update performs none of them.
