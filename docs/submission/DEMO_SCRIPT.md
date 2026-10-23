# SangeetFit — wardrobe decision demo (target 2:30)

Updated 23 October 2026. **Recording plan only; final video and public live footage remain pending.** Comparison-to-board assignment, counters and text-only PDF have [local wardrobe verification](../testing/WARDROBE_DECISION_CHECK_2026-10-23.md); actual-device recording, live quality and released access retain separate gates.

**Promise:** “Plan five celebrations with clothes you already own, preview uncertain looks, and choose what to wear.”

## Recording gates

- Record the exact reviewed source/build; log its SHA and mode. Use [PITCH_CHECKLIST](PITCH_CHECKLIST.md) for local verification and [JUDGING_ACCESS_PREFLIGHT](../testing/JUDGING_ACCESS_PREFLIGHT.md) for a separately approved live release.
- The [owned-garment pilot](../testing/OWN_GARMENT_PILOT.md) is prepared, not run. Live success narration needs both declared uploaded garments on the same consented source to visibly render and receive participant identity **and** garment ratings ≥4/5. Existing private catalogue evidence does not pass this gate.
- Obtain publication permission separately for every demo source, garment reference and output. The existing private catalogue participant's name, photo and results remain out of public footage/GitHub. A private successful pilot does not grant public-use permission.
- Any new live task/activation/deployment needs its specific approval. Declare the two-task budget first, log failures, stop on 429 and do not retry automatically. No optional skin task is needed.
- If these gates have not passed, show the software in visibly labelled **mock mode** and use the fallback narration. A mock image is a reference placeholder, never a personal live result.

## 0:00–0:15 — Five celebrations, one decision

**Screen:** Home → five-event board: Sangeet, Mehendi, Haldi, Wedding, Reception.

**Voiceover:** “Five wedding celebrations do not have to mean five new outfits. SangeetFit helps me plan clothes I already own, rewear a favourite, and preview the choices I am unsure about.”

This is the product goal. Do not claim measured purchase reduction, savings or user demand.

## 0:15–0:40 — Start with owned clothes

**Screen:** Add the permitted upper-body garment and complete outfit → manually confirm their names, categories, colours, styles and occasions. Show a recommendation reason that matches the actual tags.

**Voiceover:** “I add two outfits I own and confirm their details myself. The app explains which occasion and style tags match. Adding clothes or planning an event does not start an AI task.”

Keep optional model-led inspiration labelled as concepts/references. Colour suggestions are optional inspiration; do not narrate undertone detection, personal suitability, sizing or a skin-harmony percentage.

## 0:40–1:15 — Preview only the uncertain choices

**Screen:** Suitable, permitted full-body source → explicit processing consent → **Generate try-on** for each of the two declared garments with that same source → rendered results. If editing out waiting time, show the actual measured Generate-to-visible-render time; do not imply instant generation.

**Live voiceover, only after the recording gates pass:** “After I consent and press Generate, the app sends this person photo and garment reference to YouCam Cloth V4 and polls for the result. I generate these two owned looks using the same source photo.”

**Mock fallback:** “These are mock reference previews. The app does not send my photos to YouCam or generate an image of me in this mode. Live mode uses separate person and garment photos with YouCam Cloth V4; owned-garment live quality remains unverified.”

Keep the actual mode label visible. Show real loading/errors where relevant; do not replace a failure with a reference image and narrate live success.

## 1:15–1:45 — Compare, then make the plan

**Screen:** Two existing results → original/zoom if useful → **Plan for Sangeet** → **Planned for Sangeet** → the matching board slot. Assign one owned garment to a second event; complete the five slots with actual choices.

**Voiceover:** “I compare the existing looks and plan this outfit for Sangeet. The board now records that decision. I can reuse an outfit for another event or replace a choice without generating again.”

**Mock addition:** “The comparison images remain reference placeholders; this demonstrates the planning controls.”

Show actual counters: **events planned**, **distinct owned outfits assigned**, **planned rewears**. Explain only if needed: “Planned rewears are owned event assignments minus distinct owned garments.” Two source-photo versions of one outfit still represent one garment. The count measures the plan, not confirmed wear or avoided purchases.

## 1:45–2:10 — Take the five-event plan away

**Screen:** Completed board → **Print / Save as PDF** → dedicated text-only print view → actual saved PDF, after its contents have been inspected.

**Voiceover:** “I can take away a simple plan with the event, outfit name and whether it is my clothing or a reference. The PDF contains the plan text, without my photos, preview results, access code or provider links. Undecided events remain marked when I export a partial plan.”

Use only the export/save path actually verified on the recording device. Do not call opening print preview a successful PDF export.

## 2:10–2:30 — Integration and honest limits

**Screen:** Five-event plan and a short integration/limits card.

**Voiceover:** “Built with Next.js, TypeScript and YouCam Cloth V4, SangeetFit connects wardrobe planning to explicit try-on and a decision. Photos stay in the app's current page session; live generation also sends them to YouCam. AI can alter details, so this is visual guidance rather than a fit guarantee.”

Include the exact owned-garment evidence only after it exists; otherwise retain “owned-garment live quality remains unverified.” Optional face-selfie skin analysis is separate and outside this demo's core path. Do not show unfinished family collaboration, top/bottom generation, permanent wardrobes or checkout.

## Evidence and publication checklist

- Historical catalogue pilot: two rendered looks on one private source, participant identity/garment scores 5/5 each; observer overall AI appearance 4/5. [Recorded limits](../testing/REAL_USER_VALIDATION.md). It is not uploaded-garment proof or public footage.
- Historical mock/device checks and dated source records remain in [cloud checkpoint](../testing/CLOUD_CHECKPOINT.md), [Android checks](../testing/ANDROID_CHECK.md) and [23 October UI playtest](../testing/UI_V2_PLAYTEST_2026-10-23.md). They do not verify the new assignment/export flow or a new release. The synthetic slider segment is **SYNTHETIC UI TEST — NO YOUCAM RESULT**, not live proof.
- [local wardrobe verification](../testing/WARDROBE_DECISION_CHECK_2026-10-23.md) contains local results and actual PDF inspection. Before recording, add the exact recording/release SHA and physical-device outcomes: **pending**. Three-to-five guest sessions are separately **not run**; use [the facilitator sheet](../testing/WARDROBE_GUEST_PLAYTEST.md), not invented testimonial narration.
- Final screenshots/video contain no secrets, task IDs, signed URLs or unapproved personal images. Refresh older mock captures if their controls differ from the final build.
- Keep video within the recorded official **1–3 minute** requirement; recheck [official rules](https://youcam-api-skin-ai-ecommerce.devpost.com/rules) and submitter access before publication. Working judge access/allowance through **20 November** is separate from video preparation.
- Target submission **1 November**, before **2 November 2026, 11:45 AM Eastern**. Video upload, Devpost publication/submission and any external sharing remain separately authorized actions.
