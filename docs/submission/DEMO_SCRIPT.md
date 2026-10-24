# SangeetFit — wardrobe decision demo (target 2:30)

Updated 24 October 2026. **English recording plan only; final video and public live footage remain pending.** Comparison-to-board assignment, counters and actual text-only PDF have [dated local verification](../testing/WARDROBE_DECISION_CHECK_2026-10-23.md); the user's physical-phone recording, live quality and released access retain separate gates. Target submission: **30 October** within the **24–30 October** sprint; recovery buffer: **31 October–1 November**.

**Promise:** “Plan five celebrations with clothes you already own, preview uncertain looks, and choose what to wear.”

## Recording gates

- Record the exact reviewed source/build; log its SHA and mode. Use [PITCH_CHECKLIST](PITCH_CHECKLIST.md) for local verification and [JUDGING_ACCESS_PREFLIGHT](../testing/JUDGING_ACCESS_PREFLIGHT.md) for a separately approved live release.
- The [owned-garment validation](../testing/OWN_GARMENT_PILOT.md) is prepared, not run: exactly two attempts total, the user's `upper_body` and `full_body` garments on the **same licensed demo-person source**. Both must visibly render and receive the user's separate source-likeness **and** garment-fidelity scores ≥4/5 for two-case success narration. Describe this as demo-source technical validation; no participant satisfaction or independent usability claim.
- Verify evidence for source/reference transmission to YouCam, transformation, and **public use of derived outputs and footage** before requesting the bounded task approval. A source-download licence or transmission permission alone is insufficient. Existing private catalogue photos/results remain out of public footage/GitHub.
- Any live task/activation/deployment needs its specific approval for exact inputs/build and maximum units. These two attempts also supply release and public-demo evidence: no additional recording/smoke calls. Log failures, stop on 429 and never retry automatically. Optional skin is outside the pilot and headline demo.
- Capture the raw **entire journey during the two-attempt session** on the user's own phone: uploads, consent, both Generate actions/waits, renders, compare, assignment, five-event plan, genuine result save/open and actual PDF save/open. Preserve private raw footage and sanitized evidence receipts. Results and page-session state are temporary; do not depend on returning later or generating again to record. Remove credentials/provider URLs from the public edit.
- If one case fails, narrow the footage/narration to the successful case and disclose the two-case gate did not pass. If neither passes, do not narrate owned-clothes live success; any retest needs new bounded approval. Preserve failure evidence.
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

**Screen:** Licensed full-body demo-person source → explicit processing consent → **Generate try-on** for each declared garment with that same source → rendered results. If editing out waiting time, show actual measured Generate-to-visible-render time; do not imply instant generation.

**Live voiceover, only after the recording gates pass:** “For this technical demo, I use one licensed person photo with two garments I own. After processing consent and Generate, YouCam Cloth V4 creates each preview from that source and garment reference.”

**Mock fallback:** “These are mock reference previews. The app does not send my photos to YouCam or generate an image of me in this mode. Live mode uses separate person and garment photos with YouCam Cloth V4; owned-garment live quality remains unverified.”

Keep the actual mode label visible. Show real loading/errors where relevant; do not replace a failure with a reference image and narrate live success.

## 1:15–1:45 — Compare, then make the plan

**Screen:** Two existing results → original/zoom if useful → **Plan for Sangeet** → **Planned for Sangeet** → the matching board slot. Assign one owned garment to a second event; complete the five slots with actual choices.

**Voiceover:** “I compare the existing looks and plan this outfit for Sangeet. The board now records that decision. I can reuse an outfit for another event or replace a choice without generating again.”

**Mock addition:** “The comparison images remain reference placeholders; this demonstrates the planning controls.”

Show actual counters: **events planned**, **distinct owned outfits assigned**, **planned rewears**. Explain only if needed: “Planned rewears are owned event assignments minus distinct owned garments.” Two source-photo versions of one outfit still represent one garment. The count measures the plan, not confirmed wear or avoided purchases.

## 1:45–2:10 — Take the five-event plan away

**Screen:** Completed board → **Print / Save as PDF** → dedicated text-only print view → actual saved PDF, after its contents have been inspected.

**Voiceover:** “I can take away a simple plan with the event, outfit name and whether it is my clothing or a reference. The PDF contains plan text without photos, preview results, access codes or provider links. Undecided events stay marked in a partial plan.”

Use only the export/save path actually verified on the recording device. Do not call opening print preview a successful PDF export.

## 2:10–2:30 — Integration and honest limits

**Screen:** Five-event plan and a short integration/limits card.

**Voiceover:** “Built with Next.js, TypeScript and YouCam Cloth V4, SangeetFit connects wardrobe planning to a decision. The app keeps photos in the current page session; live generation also sends them to YouCam. AI can alter details, so this is visual guidance rather than a fit guarantee.”

Include the exact owned-garment evidence only after it exists; otherwise retain “owned-garment live quality remains unverified.” Optional face-selfie skin analysis is separate and outside this demo's core path. Do not show unfinished family collaboration, top/bottom generation, permanent wardrobes or checkout.

## Evidence and publication checklist

- Historical catalogue pilot: two rendered looks on one private source, participant identity/garment scores 5/5 each; observer overall AI appearance 4/5. [Recorded limits](../testing/REAL_USER_VALIDATION.md). It is not uploaded-garment proof or public footage.
- Historical mock/device checks and dated source records remain in [cloud checkpoint](../testing/CLOUD_CHECKPOINT.md), [Android checks](../testing/ANDROID_CHECK.md) and [23 October UI playtest](../testing/UI_V2_PLAYTEST_2026-10-23.md). They do not verify the new assignment/export flow or a new release. The synthetic slider segment is **SYNTHETIC UI TEST — NO YOUCAM RESULT**, not live proof.
- [Local wardrobe verification](../testing/WARDROBE_DECISION_CHECK_2026-10-23.md) contains local mock results and actual PDF inspection. Exact recording/release SHA and physical-phone save/open outcomes: **pending**. No guests are planned this week; the [historical facilitator sheet](../testing/WARDROBE_GUEST_PLAYTEST.md) is deferred research, not a release gate or source of testimonials.
- Final screenshots/video contain no secrets, task IDs, signed URLs or unapproved personal images. Refresh older mock captures if their controls differ from the final build.
- Keep video within the recorded official **1–3 minute** requirement; recheck [official rules](https://youcam-api-skin-ai-ecommerce.devpost.com/rules) and submitter access before publication. Working judge access/allowance through **20 November** is separate from video preparation.
- Target submission **30 October**; official deadline **2 November 2026, 22:15 IST**. Keep source access private using the organizer's specified route. Video upload, Devpost publication/submission and external sharing remain separately authorized actions.
