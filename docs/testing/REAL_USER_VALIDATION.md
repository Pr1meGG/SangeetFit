# SangeetFit — Five-Real-User Live Validation Protocol

**Purpose:** Validate the finished SangeetFit end-to-end journey with at least **five distinct real participants** on a running application. This protocol also defines the internal smoke test to run **before** recruiting participants.

> No user sessions are run during this documentation task. Budget must be verified (see §6) before scheduling.

---

## 1. Precondition — internal smoke test (run first, before recruiting)

Run this yourself (developer) before any participant is involved. Every item must pass.

- [ ] `git status --short --branch` reviewed; pre-existing changes preserved.
- [ ] Dev server or built app runs (`npm run dev` or `npm run build && npm start`).
- [ ] Live mode is confirmed (valid API key + budget); mock is a fallback only.
- [ ] Occasion selection renders all 5 occasions.
- [ ] Face selfie upload triggers `/api/skin`; returns a hex + `mode`.
- [ ] Gallery renders and sorts by harmony score.
- [ ] Full-body photo input (post-T2) requests a photo with consent + guidance.
- [ ] `/api/vto` submits and (live) returns a result `url`, or fails with a recorded stage/error.
- [ ] Save/Download, WhatsApp share, Copy-link + URL restore each work.
- [ ] No secrets (API keys, task IDs) are logged; no `console.log` of credentials.
- [ ] `git diff --check` clean.

If smoke items fail, fix them and retest **before** recruiting participants. Do not run user sessions on a broken build.

---

## 2. Participant protocol (5+ distinct users)

For **each** participant (≥5 total), complete all steps and record the evidence in the table below.

### 2.1 Consent (required first)
- Obtain **informed consent** for use of their photo and for testing.
- Explain: photo(s) uploaded to the YouCam API for skin-tone analysis and virtual try-on, may be stored by the API provider, will not be published in test evidence.
- Record that consent was obtained (yes/no) — do not store the raw photo in evidence.

### 2.2 Per-participant record

| Field | Value (record for each) |
|-------|-------------------------|
| Participant label | P1, P2, P3, P4, P5 (pseudonymous; no names) |
| Date | YYYY-MM-DD |
| Device / browser | e.g. "iPhone / Safari", "Windows / Chrome" |
| API mode | live OR mock (mock-only sessions do NOT count as live validation) |
| Consent obtained | yes / no |
| Occasion selected | sangeet / mehendi / haldi / wedding / reception |
| Genuine live Skin Tone Analysis | completed / failed / skipped (record stage) |
| Skin-tone result | hex value (or failure reason) |
| Outfit selected | outfit id |
| Full-body source provided | yes / no (and consent) |
| Genuine live Cloth V4 attempt | completed / failed (record stage & error, e.g. `error_pose`) |
| VTO result displayed | yes / failed / N/A |
| Save/Download | ok / failed |
| WhatsApp share | ok / failed |
| Copy-link + URL restore | ok / failed |
| Completion time | mm:ss |
| Usability observations | free text |
| Would use again | yes / no / maybe |

### 2.3 Exact steps each participant completes
1. **Occasion selection** — choose a wedding function.
2. **Genuine live Skin Tone Analysis** — upload a face selfie; a live (not mock) task must run.
3. **Review recommendations** — review the harmony-sorted gallery and select an outfit.
4. **Provide a full-body source image** (post-T2) with consent; if the feature is not yet live, record the stage as blocked.
5. **Genuine live Cloth V4 attempt** — must be live; a mock result does not count.
6. **Verify result** — confirm the returned image renders, or record the exact failure stage.
7. **Save / download / share** — exercise all three and record results.

### 2.4 Acceptance rule
- At least **five distinct participants** complete recorded sessions.
- **Mock-only sessions do NOT count as live API validation** — a session is only "live-validated" if the skin and VTO calls ran in live mode.
- A failure is recorded **as a failure**, never hidden by silently switching to mock.
- Fix critical defects and **retest the affected cases**.
- Keep evidence free of raw photos, credentials, API keys, task IDs, and unnecessary personal info. Use only the pseudonymous labels above; never store the actual image in evidence.

---

## 3. Evidence storage

Collate per-participant results into a table like this (example — replace with real data):

```
| Label | Date | Device | Mode | Skin | VTO | Result | Save | WA | Share | Time | Would use again |
|-------|------|--------|------|------|-----|--------|------|----|-------|------|-----------------|
| P1 | 2026-10-20 | iPhone/Safari | live | #b9947c | error_pose | failed-stage-6 | ... | ... |
```

- Keep **no raw photos, no API keys, no task IDs, no personal info** in stored evidence.
- Record the mode truthfully; a mock row is labeled mock and excluded from live-validation counts.

---

## 4. Definitions & exclusions

- **Live validation:** the skin and VTO API tasks ran in live mode against the YouCam API (not mock). Requires a valid API key and budget.
- **Mock-only session:** one where either call fell back to mock — does not count toward the five live-validated participants.
- **Failure stage:** identify exactly where it stopped (upload / submit / poll / render) and the error string (e.g. `error_pose`), so retests target the right layer.

---

## 5. Post-validation

- Tally: how many distinct participants, how many truly live-validated.
- Fix critical defects and **retest affected cases** before any submission claim.
- Update `docs/agent-workflow/TASK_BOARD.md` and `PROJECT_STATE.md` with evidence-backed outcomes.
- Do **not** mark the product "live-verified" unless at least five distinct live sessions completed successfully.

---

## 6. Budget & API safeguards

- Skin Tone task cost previously documented as **20 units** — an estimate; actual billing must not be assumed from it.
- **Cloth V4 task cost is unknown.** Do not assume it equals V2/V3.
- Five live sessions could require **≥5 Skin Tone executions**, plus **VTO executions and likely retries** (each failure may consume a task).
- **Verify available budget before scheduling.** Do not spend or make API calls during this protocol's documentation phase.
