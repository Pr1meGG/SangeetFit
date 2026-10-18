# SangeetFit — Product Specification

**Status:** Authoritative product definition (v1). This is the **intended** product. Steps marked *implemented* / *verified* are confirmed in the current working tree; everything else is the target to build. A feature is marked verified only where direct code/test evidence exists.

> See `docs/agent-workflow/PROJECT_STATE.md` for verified project facts and prior results that are not re-checked.

---

## 1. One-sentence pitch

SangeetFit is an occasion-curated outfit gallery with skin-tone harmony scoring and virtual try-on for Indian weddings.

---

## 2. Problem & target users

Indian weddings span 5+ functions — sangeet, mehendi, haldi, wedding, reception — each with distinct outfit expectations. Guests must browse, match colours to their skin tone, and imagine a garment on their own body — tedious and error-prone.

Target users:
- Guests and bridal-party members attending multi-day Indian weddings.
- Anyone who wants to preview outfits styled to their skin tone before buying/renting.
- Users who want to share a shortlisted look with friends or family.

---

## 3. Intended user journey

The finished product follows one linear journey. Screens are described with their primary action, transitions, and loading/error/empty states.

### Step 0 — Home / Occasion selection
- **Screen:** grid of 5 occasion buttons (Sangeet, Mehendi, Haldi, Wedding, Reception), each with an icon.
- **Primary action:** pick an occasion.
- **Transition:** selecting an occasion advances to Step 1.
- **States:** static; no data loading.
- **Status:** ✅ *Implemented & verified* (`src/app/page.tsx:220-240`).

### Step 1 — Skin Tone Analysis (face selfie)
- **Screen:** dashed upload dropzone + "Upload a front-facing selfie" guidance.
- **Primary action:** upload a close-up face selfie (JPG/PNG, ≤10 MB) → POST `/api/skin`.
- **Loading:** "Analyzing with YouCam API…".
- **Success:** shows a detected skin-tone swatch + hex + **personalized color palette** (intended; palette band not yet built) + Continue to gallery.
- **Error:** inline red message; user can retry by re-uploading.
- **Back:** arrow returns to occasion.
- **Purpose of this image: skin-tone analysis only. It must NOT be reused as the VTO full-body source.**
- **Status:** skin-analysis flow ✅ *implemented & verified* (mock returns `#b9947c`; live path exists). Personalized color palette ❌ *not implemented*.

### Step 2 — Curated outfit gallery
- **Screen:** grid of outfits filtered by occasion, sorted by colour-harmony score against the detected skin tone (0–100% badge). Heart toggle per card + a Shortlist filter.
- **Primary action:** click an outfit card to open virtual try-on.
- **States:** sorted list; no explicit empty-state needed since each occasion seeds 2 outfits.
- **Back:** arrow returns to Step 1.
- **Status:** ✅ *Implemented & verified* (sorting, harmony scoring, shortlist all work).

### Step 3 — Virtual Try-On (garment + full-body source)
- **Screen:** VTO modal showing the selected garment + result panel.
- **Primary action (intended):** if a suitable **full-body photo is not already available, ask the user for one here**, with clear photo guidance and consent. Then submit full-body source + garment reference to Cloth V4.
- **Loading:** spinner + "This may take 30–90 seconds".
- **Success:** display the actual generated result.
- **Failure:** meaningful recovery options (retry with a better full-body photo, or use a sample image).
- **Full-body input: ❌ NOT YET IMPLEMENTED.** Today the app reuses the face selfie as the VTO source — see Image-Input Architecture below.
- **Live Cloth V4 rendering: ❌ unresolved** (previous live attempt returned `error_pose`; not re-verified). Mock mode returns the source garment image, not a composite.

### Step 4 — Save / download / share
- **Screen:** action bar in the VTO modal.
- **Save/Download:** download anchor for the result image.
- **WhatsApp:** opens a `wa.me` share link.
- **Share/Copy link:** copies a `?step&occasion&skin&vto` URL that restores the look for another visitor.
- **Status:** ✅ *implemented & verified* (all three controls functional in mock mode).

---

## 4. Image-input architecture

### 4.1 The current problem (confirmed)
The web app stores exactly **one image** — the face selfie set during skin analysis (`page.tsx:129`). That same `selfieDataUrl` is reused as the VTO `src_file_id` (`page.tsx:84`, `vto/route.ts:130-136`). **There is no end-user full-body photo input anywhere in the active flow.** `src/components/UploadPanel.tsx` and `GarmentPicker.tsx` are orphaned (not imported). `public/garment_test/fullbody_mock.png` is referenced only by the legacy `scripts/garment_test.py` and the orphaned components — never by the running app.

### 4.2 Intended architecture
Two distinct images, two distinct purposes:

| Image | Purpose | When requested | When sent |
|-------|---------|----------------|-----------|
| **Face selfie** | Skin Tone Analysis | Step 1 | `POST /api/skin` → `/task/skin-tone-analysis` (`src_file_id`) |
| **Full-body photo** | VTO source | Step 3 | `POST /api/vto` → `/task/cloth-v4` (`src_file_id`) |

- The face selfie must **never** be used as the Cloth V4 source.
- The full-body photo is requested **only at Step 3**, and only when VTO is initiated, with clear photo guidance (full-body, frontal, natural pose) and consent.

### 4.3 Mock-mode sample-image behavior (separate from real-user behavior)
- **Mock mode:** a bundled sample photo (`/garment_test/fullbody_mock.png` or similar) is used as the full-body source. This is for local/demo/CI only and is clearly labeled mock.
- **Real-user live mode:** the app requests and sends the user's own full-body photo with consent; no sample image is substituted silently.

### 4.4 Consent, image handling, validation, failure states
- **Consent:** explicit consent required before uploading a user's photo (face selfie at Step 1, full-body at Step 3).
- **Validation:** client-side — file must be `image/*`, ≤10 MB (existing check at `page.tsx:259-260`); server-side via `parseDataUrl` (accepts JPEG/PNG).
- **Failure states:** upload error → inline message + retry; engine failure (e.g. `error_pose`) → recovery options: retry with a different/better full-body photo, or use a sample image (mock). Never silently fall back to mock in a live session.

### 4.5 Status of the `error_pose` diagnosis
Treated as a **strong hypothesis, not a proven root cause.** The face selfie being sent as a full-body VTO source is the leading candidate, but no live run has yet compared a real full-body image against the face selfie. The `format:"json"` field the legacy Python script sends is an open contract question, not a confirmed cause. A separate, approved live diagnostic is required to confirm (see Task 3).

---

## 5. Acceptance-criteria matrix

Each row lists the acceptance criterion, the implementation path, current status (*verified / mock-only / failed / unknown*), evidence, and the next bounded task.

| # | Step | Acceptance criterion | Implementation path | Status | Evidence | Next task / deps |
|---|------|----------------------|---------------------|--------|----------|-------------------|
| 1 | Occasion selection | 5 occasions render; clicking advances | `src/app/page.tsx:220-240` | **verified** | tsc/build pass; sf-scout map | none |
| 2 | Skin Tone Analysis | Face selfie triggers `/api/skin`; mock returns `#b9947c`; live path upload→submit→poll | `src/app/api/skin/route.ts` | **verified (mock) / live=reported** | curl mock response; contract tests | live re-verify with key |
| 3 | Recommendation logic | Outfits filtered by occasion + sorted by hue harmony (0–100%) | `src/app/page.tsx:182-193`, `src/lib/color.ts` | **verified** | code + build | none |
| 4 | Garment reference mapping | Each category maps to correct `/garment_test/` asset | `src/app/api/vto/route.ts:16-25` | **verified** (mapping), **mock-only** (results) | contract test asserts filenames | none |
| 5 | Full-body VTO input | Full-body photo captured (or sample) and sent as Cloth V4 source | **not implemented** (no input in active UI) | **failed/unknown** | `UploadPanel.tsx` orphaned; only face selfie reused | **T2** (this spec → fix source flow) |
| 6 | Live Cloth V4 result rendering | Submit full-body + garment → poll → display `results.url` | `src/app/api/vto/route.ts:115-148` | **mock-only / live failed** (`error_pose`) | code path exists; no live success | **T3** (approved live diagnostic) |
| 7 | Loading / error / retry | Spinner, error + retry for VTO; progress while processing | `src/app/page.tsx:379-453` | **verified (mock)** | code walkthrough | add full-body retry guidance |
| 8 | Save / download / share | Download anchor, WhatsApp link, copy-link + URL restore work | `src/app/page.tsx:456-503`, `:38-115` | **verified (mock)** | code + hand-check | none |
| 9 | Responsive layout | Grids collapse to 2-up on mobile; modal scrolls | `src/app/page.tsx:223,321,365` | **verified** (static) | Tailwind `md:` breakpoints | device/browser test |
| 10 | Privacy & photo handling | Consent; images not logged; keys server-side | `src/app/api/*`, `src/lib/youcam.ts` | **verified** (no logs, server-side keys) | contract test asserts no `console.log`, no API key in client | add explicit consent UI |

**Bold status = not yet meeting the criterion.** A feature is not marked verified merely because a mock exists.

---

## 6. Cost & budget guardrails

- Skin Tone task cost was previously documented as **20 units** — an estimate; actual billing must not be assumed from it.
- **Cloth V4 task cost is currently unknown.** Do not assume V4 costs the same as V2/V3.
- Five real-user live sessions could require **at least five Skin Tone executions**, plus **VTO executions and likely retries**.
- **Verify available budget before scheduling the five live validation sessions.**
- No API calls, retries, polling of old tasks, credit checks, or spending occur in this documentation task.

---

## 7. Submission realism

Previously reported screenshot findings (recorded; not a deliverable):
- Four screenshots were reported into `docs/submission/screenshots/`.
- Three of four were **byte-identical** (same MD5 `5c8917e8...`), so they do not constitute distinct UI-state evidence. Only `02-skin-analysis-upload.png` differed.
- **Genuine screenshot capture remains outstanding** — re-capture with browser tooling is required (Task T7, blocked on browser automation).

Official hackathon requirements (source: `https://youcam-api-skin-ai-ecommerce.devpost.com/rules`):
- Working application, repository access, descriptive project submission, and a **publicly available 1–3 minute demonstration video** showing the app functioning and explaining the YouCam API.
- **Deadline: November 2, 2026, 11:45 AM ET (10:15 PM IST).**
- Do not invent completed deliverables; invalid screenshots are not treated as complete.
