# Wedding wardrobe guest playtest — facilitator sheet

Prepared 23 October 2026. **Protocol only: no participants contacted and no sessions run.** Recruit 3–5 people who are choosing clothes for a wedding they expect to attend. This is a small formative usability study, separate from [live image-quality testing](OWN_GARMENT_PILOT.md); report the actual sample and limits rather than population claims.

## Prepare one session

- Use the final locally verified mock build; record full source SHA, date, device/browser and viewport. Confirm `/api/mode` is mock before starting. The [local assignment/export checks](WARDROBE_DECISION_CHECK_2026-10-23.md) passed; a guest session still needs its own build/device record.
- Participant agrees to a private usability session and may stop at any time. Use only a pseudonym (`g01`–`g05`) in this sheet. No recording, participant contact details, private photos or image exports in the repository.
- Have two participant-owned garments ready, one upper-body garment and one complete outfit, with names they recognize. They enter colour/style/occasion tags themselves. Use a permitted synthetic person image for mock comparison if desired; a personal source is unnecessary for evaluating the controls. Uploading a photo in mock mode is not permission to send it to a provider later.
- Start a fresh page session and prepare a stopwatch. Observe without teaching the controls. Give help only after the participant asks or is stuck; record the exact help and count that task as assisted. Record abandonment explicitly.

Read aloud: **“This version uses mock previews: the images are reference placeholders, not generated pictures of you, and no photo goes to YouCam. We are testing whether planning controls help you decide what to wear. This is the app being tested, not you. Please say what you expect and where you are unsure.”** Do not suggest that mock images establish garment fit or appearance.

## Task cards — read the goal, not the click path

Label the two uploaded garments A and B in facilitator notes only; let the participant use their own names. Start/stop timing each task and mark independent, assisted, abandoned or blocked.

| Task | Read to participant | Observable completion |
|---|---|---|
| 1. Add clothes | “Add these two clothes you already own and describe where you would wear them.” | Both uploads and confirmed metadata visible; zero generation requests just from adding them |
| 2. Compare and choose | “For this practice plan, compare the two mock previews and tentatively plan garment A for Sangeet.” | Two explicit mock generations at most; comparison choice assigns an outfit to Sangeet; **Planned for Sangeet** and matching board slot visible |
| 3. Rewear | “Wear garment A to both Mehendi and Haldi.” | Both events assigned to the same owned garment; one garment is counted once as distinct |
| 4. Change a decision | “Change your Sangeet plan to garment B.” | Sangeet now holds B; Mehendi/Haldi retain A; replacement adds no generation request |
| 5. Take the plan away | “Save or print a plan you can use later, including the events you have not decided yet.” | **Print / Save as PDF** opens the dedicated text view; participant saves/prints using device-supported controls; both empty events are identifiable |
| 6. Finish five events | “Plan Wedding and Reception too, then save the complete plan.” | All five slots assigned; updated text export reflects the final choices; record if the participant prefers to leave an event undecided |

After task 4, the expected plan has three events, two distinct owned garments and **one planned rewear**: three owned assignments minus two distinct owned garments. Confirm the counters without reading their expected values to the participant. The statistic measures plan reuse, not actual wear, money saved or avoided purchases. The A/B assignments are a practice scenario; do not count them as an actual wardrobe decision. Let task 6 use the participant’s own choices.

During export, inspect the saved PDF/print output with permission. It should contain event names, garment names, ownership/reference labels and empty slots, with no person/garment photos, generated images, access codes or provider links. Do not retain the participant's output in the repository; record pass/fail and any text-only defect.

## Per-session record — copy once per participant

Participant ID: **pending** · date: **pending** · source SHA: **pending** · build/mode: **pending** · device/browser: **pending** · mock disclosure acknowledged: **pending**.

| Task | Independent / assisted / abandoned / blocked | Minutes | Help given | Confusion or observed defect |
|---|---|---|---|---|
| 1. Add | Not run | — | — | — |
| 2. Compare/plan | Not run | — | — | — |
| 3. Rewear | Not run | — | — | — |
| 4. Replace | Not run | — | — | — |
| 5. Partial export | Not run | — | — | — |
| 6. Full plan/export | Not run | — | — | — |

Ask without leading: “Which real wardrobe decision, if any, did this help?” “What would you still need before trusting a generated preview?” “Would you use the exported plan for your upcoming wedding events? Why?” Record sanitized answers or clearly identified paraphrases; record “no useful decision” where that is the answer. Do not turn stated intent into measured behavior.

Independent tasks: **— /6** · total minutes: **—** · export checks: **not run** · actual decision helped: **not recorded** · largest obstacle: **not recorded**.

## Aggregate only after sessions

| Participant | Sessions completed | Independent tasks /6 | Total minutes | Partial/full export | Actual usefulness / main confusion |
|---|---|---|---|---|---|
| g01 | Not run | — | — | — | — |
| g02 | Not run | — | — | — | — |
| g03 | Not run | — | — | — | — |
| g04 (optional) | Not run | — | — | — | — |
| g05 (optional) | Not run | — | — | — | — |

Report actual completed sessions `n`, task-specific independent/assisted/abandoned counts with denominator `n`, time ranges and concrete confusion. List blocked/unfinished sessions separately. At 3–5 people, describe findings as formative feedback. Never combine mock usability success with live identity/garment scores, or describe this internal sample as an official hackathon requirement.
