# SangeetFit — pitch and submission checklist

Updated 23 October 2026. **Unchecked gates are pending.** New comparison assignment, counters and PDF export have [local wardrobe verification](../testing/WARDROBE_DECISION_CHECK_2026-10-23.md); those local results do not establish live quality or a release. This checklist prepares the accepted wardrobe decision story; it does not authorize live calls, release, publication or submission.

**Pitch:** “Plan five celebrations with clothes you already own, preview uncertain looks, and choose what to wear.”

Users confirm their own occasion/style/colour metadata, preview uncertain outfits through explicit YouCam Cloth V4 generation, compare existing results and assign the chosen outfit to an event. A text-only five-event plan makes that decision useful outside the app. Optional concept references are labelled inspiration; colour suggestions do not establish undertone, suitability, sizing or fit.

## What each judging dimension can see

The [recorded competition facts](../research/competition-facts.md) identify four equally weighted dimensions. These are evidence to prepare, not predicted scores.

| Dimension | Concrete demonstration / evidence |
|---|---|
| Technological Implementation | Two declared uploaded-garment inputs, explicit consent/Generate, real task → polling → visible render, honest errors and budget enforcement |
| Design | Add clothes → compare → **Plan for {occasion}** → matching board assignment → readable text-only PDF; mobile and keyboard checks |
| Potential Impact | 3–5 guest sessions with actual decisions, assistance, times and confusion; no invented savings or independent-user outcomes |
| Quality of Idea | Five celebrations planned from an existing wardrobe, visible planned rewears and selective preview of uncertain choices |

## Preserve the limits of existing evidence

- [Catalogue pilot](../testing/REAL_USER_VALIDATION.md): two looks rendered on one private person source. Participant identity and garment ratings were 5/5 each; another observer rated overall AI appearance 4/5. The 16-reference engineering sweep has two outcomes and 14 pending cases. These are limited catalogue results, not uploaded-clothes proof or independent usability.
- [Owned-garment pilot](../testing/OWN_GARMENT_PILOT.md): exact upper-body/full-outfit preparation and two-attempt log; **not run**. Both must render and receive participant identity/garment ratings ≥4/5 before success narration.
- [Cloud checkpoint](../testing/CLOUD_CHECKPOINT.md), [budget initialization](../testing/BUDGET_INITIALIZATION_CHECK.json) and [latest recorded mock Preview](../testing/MOCK_PREVIEW_CHECK.json): preserve historical verification/source records. The protected mock Preview is not public judge access, runtime cap proof or live-quality evidence.
- [Android checks](../testing/ANDROID_CHECK.md): partial USB-local mock checks, including a real mock-image download. The synthetic slider check remains labelled **SYNTHETIC UI TEST — NO YOUCAM RESULT**. These do not prove live-result saving, iPhone support or the new wardrobe/PDF flow.
- Five [22 October mock UI captures](screenshots/2026-10-22-mock-ui/README.md) contain no private participant image/live output. They are preparation assets and need replacement where the final UI differs.

The earlier 16-reference sweep and historical five-tester goal are internal aspirations, not official submission requirements. The new 3–5 guest protocol is likewise an internal formative study.

## Final software and decision gate

- [x] Fix the actual current TypeScript/build failures and keep unfinished family/top-bottom flows out of the main experience; preserve existing work.
- [x] Verify **Plan for {occasion}** assigns the outfit to that event, then shows **Planned for {occasion}** and the same board choice.
- [x] Verify changing the current occasion changes the destination; replacing an assignment works; two photo versions of one outfit are the same planned garment.
- [x] Verify deleting a result preserves the outfit assignment; removing the uploaded garment clears every event that used it; reset clears session decisions/photos.
- [x] Confirm adding, comparing, planning, replacing and exporting create zero additional generation requests. Only explicit Generate starts one.
- [x] Confirm counters: events with assignments; distinct assigned owned garments; planned rewears = owned event assignments minus distinct assigned owned garments. Reference assignments affect only the event count.
- [x] Verify a dedicated **Print / Save as PDF** view with all five events, garment names, owned/reference labels and empty slots. Inspect an actual saved PDF from a populated session: no photos/results, access codes or provider links.
- [x] Check emulated 320/390/1440 layouts and keyboard access, including comparison, board reassignment and print controls. Actual phone printing and the new released device flow remain pending.
- [x] Run `npm run verify` and `git diff --check` against the integrated local working tree; record exact results, skips and review outcome. Match a separately released SHA before claiming deployed verification.

## Live quality, guests and judge access

- [ ] Declare exact owned garments and same-source version, transmission consent, two-task authorization and fresh approved budget inspection before the [pilot](../testing/OWN_GARMENT_PILOT.md). No assumed current balance, retries or optional skin call; stop on 429 and retain failures.
- [ ] Log both visible renders, Generate-to-render seconds, displayed time and participant identity/garment ratings. Narrow claims if either fails. Public footage needs **separate publication permission**; existing private catalogue photos/results stay private.
- [ ] Run [3–5 guest sessions](../testing/WARDROBE_GUEST_PLAYTEST.md) with explicit mock disclosure. Record independent/assisted completion, minutes, confusion and actual usefulness. Do not contact participants or fabricate results from this checklist.
- [ ] Complete [judge access preflight](../testing/JUDGING_ACCESS_PREFLIGHT.md) after specific release/live approvals: clean browser without developer login, correct private code, two approved fresh previews, device saving and runtime budget checks.
- [ ] Approve a judging allowance separately from the historical five-preview starter cap and the release smoke batch. Record a bounded contingency, actual remaining allowance and operator response. Do not silently reset or raise the ledger.
- [ ] Verify deployed Fluid Compute/function duration supports the internal 180-second deadline; record reviewed source SHA, URL, mode and rollback target.
- [ ] Keep the host, permitted assets, private judge access and approved allowance usable through **20 November**; record an owner and agreed check cadence. No monitoring automation is created here.

## Submission assets and access

Recheck [official rules](https://youcam-api-skin-ai-ecommerce.devpost.com/rules) and the form before publication. The recorded deadline is **2 November 2026, 11:45 AM Eastern**; target submission **1 November**, following a 30–31 October freeze. Judge access is planned through **20 November**.

- [ ] Source repository, assets and setup instructions are accessible as the rules require; verify the exact recipient if privately shared.
- [ ] Settle the application-code licence before public distribution; do not claim MIT without a corresponding licence.
- [ ] Provide a working judging URL and required credentials through an appropriate private route; no secrets in public documents/links/video.
- [ ] Review [DEVPOST_DRAFT](DEVPOST_DRAFT.md) against actual final source and evidence. Clearly identify mock mode, concepts, current usability sample and owned-garment evidence limits.
- [ ] Capture final screenshots: owned upload/metadata; two mode-labelled previews; **Planned for Sangeet** and the board; five-event counters; actual text-only PDF. Show empty slots in a partial-plan capture if useful.
- [ ] Record a genuine **1–3 minute** video using [DEMO_SCRIPT](DEMO_SCRIPT.md). The owned clothes → two previews → comparison → assignment → five-event PDF story must match actual tested behavior.
- [ ] Use only separately permitted public imagery. No existing private catalogue participant photos/results, access code, provider URL or task identifier in the package.
- [ ] Obtain the user's specific publication/submission authorization before uploading video or submitting to Devpost; add real final links only after those actions succeed.
- [ ] Document significant improvements made during the hackathon if required; omit deferred family collaboration, top/bottom generation, permanent wardrobes and checkout from completed-feature claims.

Final source / verification record: **pending**. Owned-garment live evidence: **not run**. Guest sessions: **not run**. Final PDF inspection: **pending**. Public video, judge-access verification and submission: **pending**.
