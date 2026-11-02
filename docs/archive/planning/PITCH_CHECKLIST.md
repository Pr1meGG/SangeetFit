# SangeetFit — pitch and submission checklist

Updated 26 October 2026. **Unchecked gates are pending.** Comparison assignment, counters and actual PDF export have [dated local mock verification](../testing/WARDROBE_DECISION_CHECK_2026-10-23.md); those results do not establish live quality or a released phone flow. This checklist does not authorize account inspection, live tasks, deployment, publication or submission.

**Current direction, 26 October:** the user reports creating the demo-person image with AI and has cleared its use. Record the exact source/version and available creation-provenance receipt; no independent licence verification or real-participant consent is claimed. **Garment selection and the two-case live pilot are on hold at the user's request.** Do not start calls or recording until garment work resumes and the scoped release/task approvals exist. Source-use clearance is already given and need not be requested again.

**24–30 October sprint:** target submission **30 October**; recovery **31 October–1 November**. The user has **4–6 hours daily**, tests on their own phone and supplies the single-evaluator visual ratings. No guest study is planned. Keep feature work frozen and follow the [current execution plan](../plans/feature_spec_release_readiness_2026-10-26.md): reviewed candidate and input rights, approved two-attempt capture, go/no-go, final assets, fresh-browser rehearsal, then approved submission. The [26 October audit](../testing/READINESS_AUDIT_2026_10_26.md) separates completed evidence from pending gates; scheduled work is not proof of completion.

**Pitch:** “Plan five celebrations with clothes you already own, preview uncertain looks, and choose what to wear.”

Users confirm their own occasion/style/colour metadata, preview uncertain outfits through explicit YouCam Cloth V4 generation, compare existing results and assign the chosen outfit to an event. A text-only five-event plan makes that decision useful outside the app. Optional concept references are labelled inspiration; colour suggestions do not establish undertone, suitability, sizing or fit.

## Completed catalogue evidence and available local edit

- [x] Two declared AI-source catalogue cases visibly rendered and were saved through the local UI, one request each; four units total. [Receipt and limits](../testing/CATALOGUE_AI_PILOT_2026_10_26.md).
- [x] Preserve separate-source labels and retain pending visual scores; no owned-garment/live-phone/judge-access promotion.
- [ ] Review the captioned two-minute local edit and five refreshed screenshots; no public upload is implied.
- [ ] Obtain quality ratings, exact source checkpoint/CI and final deployed-access proof; the six-unit remainder is only three configured VTO reservations, not an adequate assumed judging plan.

## What each judging dimension can see

The [recorded competition facts](../research/competition-facts.md) identify four equally weighted dimensions. These are evidence to prepare, not predicted scores.

| Dimension | Concrete demonstration / evidence |
|---|---|
| Technological Implementation | Two declared uploaded-garment inputs, explicit consent/Generate, real task → polling → visible render, honest errors and budget enforcement |
| Design | Add clothes → compare → **Plan for {occasion}** → matching board assignment → readable text-only PDF; mobile and keyboard checks |
| Potential Impact | Concrete five-event wardrobe decision and planned rewears; explicitly limited single-evaluator evidence, with no measured savings, participant satisfaction or independent usability claim |
| Quality of Idea | Five celebrations planned from an existing wardrobe, visible planned rewears and selective preview of uncertain choices |

## Preserve the limits of existing evidence

- [Catalogue pilot](../testing/REAL_USER_VALIDATION.md): two looks rendered on one private person source. Participant identity and garment ratings were 5/5 each; another observer rated overall AI appearance 4/5. The 16-reference engineering sweep has two outcomes and 14 pending cases. These are limited catalogue results, not uploaded-clothes proof or independent usability.
- [Owned-garment validation](../testing/OWN_GARMENT_PILOT.md): **on hold, not run**. After garment work resumes, exactly two Cloth V4 attempts total remain planned: the user's `upper_body` and `full_body` garments on the same user-created AI demo-person image. Both must render and receive the user's separate source-likeness/garment-fidelity ratings ≥4/5 for two-case signoff. This is demo-source technical validation, not a consenting-participant study; the hold is not a failure or approval to spend.
- [Cloud checkpoint](../testing/CLOUD_CHECKPOINT.md), [budget initialization](../testing/BUDGET_INITIALIZATION_CHECK.json) and [latest recorded mock Preview](../testing/MOCK_PREVIEW_CHECK.json): preserve historical verification/source records. The protected mock Preview is not public judge access, runtime cap proof or live-quality evidence.
- [24 October Android checks](../testing/ANDROID_CHECK.md): core portrait mock comparison, five-event planning, native mock-image saving and actual PDF save/reopen on source `e2eb6cd`. These do not prove the latest experimental UI, cloud access, live quality/saving or iPhone support. Earlier synthetic slider evidence stays labelled **SYNTHETIC UI TEST — NO YOUCAM RESULT**.
- Five [22 October mock UI captures](screenshots/2026-10-22-mock-ui/README.md) contain no private participant image/live output. They are preparation assets and need replacement where the final UI differs.

The earlier 16-reference sweep and historical tester goals are internal aspirations, not official submission requirements. The [guest protocol](../testing/WARDROBE_GUEST_PLAYTEST.md) remains deferred research and is not a current release dependency.

## Historical local software evidence — 23 October

The checked rows below summarize the dated local record, not newly executed release checks. Match the final reviewed source and repeat the release gate below before claiming deployed verification.

- [x] Fix the actual current TypeScript/build failures and keep unfinished family/top-bottom flows out of the main experience; preserve existing work.
- [x] Verify **Plan for {occasion}** assigns the outfit to that event, then shows **Planned for {occasion}** and the same board choice.
- [x] Verify changing the current occasion changes the destination; replacing an assignment works; two photo versions of one outfit are the same planned garment.
- [x] Verify deleting a result preserves the outfit assignment; removing the uploaded garment clears every event that used it; reset clears session decisions/photos.
- [x] Confirm adding, comparing, planning, replacing and exporting create zero additional generation requests. Only explicit Generate starts one.
- [x] Confirm counters: events with assignments; distinct assigned owned garments; planned rewears = owned event assignments minus distinct assigned owned garments. Reference assignments affect only the event count.
- [x] Verify a dedicated **Print / Save as PDF** view with all five events, garment names, owned/reference labels and empty slots. Inspect an actual saved PDF from a populated session: no photos/results, access codes or provider links.
- [x] Check emulated 320/390/1440 layouts and keyboard access, including comparison, board reassignment and print controls. These are 23 October checks; later phone mock PDF save/open is recorded on 24 October. The current deployed/live phone flow remains pending.
- [x] Run `npm run verify` and `git diff --check` against the integrated local working tree; record exact results, skips and review outcome. Match a separately released SHA before claiming deployed verification.

## Final software, live quality and judge access

- [ ] Run `TEST_PORT=<verified-free-port> npm run verify` and `git diff --check` on the final integrated source; record exit codes, skips and independent review. Require real-Redis CI evidence for the release SHA; a local skipped Redis suite is not that proof.
- [ ] Check 320/390/1440 layouts and keyboard access; on the user's physical phone exercise consent, denied camera permission, invalid uploads and comparison/assignment. Test timeout/expired-result and allowance recovery with mock/stubbed failures, without extra live tasks. Explicit Generate creates one request; repeated taps cannot duplicate it. Browsing, uploading, comparing, planning and exporting create zero generation requests.
- [x] Record the user's 26 October report that the demo-person image was created with AI and their clearance to use it. This records user-reported provenance/clearance; it does not independently verify a licence, identify the exact source/version, or authorize provider tasks or publication actions.
- [ ] Record the exact AI source/version receipt without re-requesting source-use clearance. **On hold:** garment selection, garment input/use receipts and the [two-attempt session](../testing/OWN_GARMENT_PILOT.md). After the user resumes garment work, declare the build and unit bound and obtain the specific release/task approvals and authorized fresh budget inspection before any live call.
- [ ] Log both visible renders, timings, request/task counts and the user's separate likeness/fidelity ratings. Stop on 429, preserve all failures and never retry automatically. If one case fails, narrow to successful inputs; if neither passes, withhold owned-clothes live signoff and propose any retest for separate bounded approval. No optional skin task.
- [ ] **On hold until garment work resumes and release/task approvals exist:** capture raw full-journey footage during these **same two attempts**; verify actual live-result save/open and five-event PDF save/open on the phone. Temporary results/page-session state mean later capture is not assured. Inspect correct counts, garment names and all five events; exclude photos, credentials and private provider links. No additional recording or release-smoke tasks.
- [ ] Complete [judge access preflight](../testing/JUDGING_ACCESS_PREFLIGHT.md) after specific release/live approvals: fresh browser without developer login, code-free explicit generation and deployed runtime budget enforcement, reusing these two attempts as live evidence.
- [ ] Plan capacity for **20 judging VTO attempts**, separately from the two validation attempts and historical starter cap. Obtain authorized current tariff/balance inspection and separate approval for the exact unit cap/reserve and depletion response. No automatic refill/top-up, ledger reset or silent increase.
- [ ] Verify deployed Fluid Compute/function duration supports the internal 180-second deadline; record reviewed source SHA, URL, mode and rollback target.
- [ ] Keep the host, permitted assets, private judge access and approved allowance usable through **20 November**. The user owns a manual access/allowance checklist and response plan; record the agreed check cadence. No monitoring automation.

## Submission assets and access

Recheck [official rules](https://youcam-api-skin-ai-ecommerce.devpost.com/rules) and the form before publication. Official deadline: **2 November 2026, 22:15 IST**; target submission **30 October**. Recovery buffer: **31 October–1 November**. Judge access must remain available through **20 November**.

- [ ] Keep the repository **private**; use the organizer's specified private-sharing route and verify the exact recipient plus source/assets/setup access from the judge's perspective.
- [ ] Verify the application-code licence and third-party rights for the intended sharing; do not claim MIT without a corresponding licence.
- [ ] Provide a working judging URL and required credentials through an appropriate private route; no secrets in public documents/links/video.
- [ ] Review [DEVPOST_DRAFT](DEVPOST_DRAFT.md) against actual final source/evidence. Identify mock mode, concepts and single-evaluator demo-source limits; no independent-user or participant-satisfaction claim.
- [ ] Capture final screenshots: owned upload/metadata; two mode-labelled previews; **Planned for Sangeet** and the board; five-event counters; actual text-only PDF. Show empty slots in a partial-plan capture if useful.
- [ ] Edit the captured footage into a **2:30 English video**, within the official **1–3 minute** range, using [DEMO_SCRIPT](DEMO_SCRIPT.md). The owned clothes → two previews → comparison → assignment → five-event PDF story must match the actual outcomes; narrow the story if either case failed.
- [ ] Use only separately permitted public imagery. No existing private catalogue participant photos/results, access code, provider URL or task identifier in the package.
- [ ] Obtain the user's specific publication/submission authorization before uploading video or submitting to Devpost; add real final links only after those actions succeed.
- [ ] Document significant improvements made during the hackathon if required; omit deferred family collaboration, top/bottom generation, permanent wardrobes and checkout from completed-feature claims.

Final approved release SHA / release verification: **pending**; current local candidate checks are tracked in the [26 October audit](../testing/READINESS_AUDIT_2026_10_26.md). AI demo-person source use: **cleared by the user; exact source/version receipt pending**. Garment selection and demo-source owned-garment live evidence: **on hold at the user's request, not run**. Guest study: **not planned this sprint**. Actual local PDF inspection: **passed in the 23 October record**; physical-phone mock PDF save/open: **passed in the 24 October record on `e2eb6cd`**. Current released/live phone PDF save/open, public video, judge-access verification and submission: **pending**.
