# SangeetFit — Demo Script (2:30)

| Field | Value |
|-------|-------|
| **Project** | SangeetFit — Indian wedding outfit styling |
| **Format** | Screen-record + voiceover |
| **Target** | Hackathon judge / investor |
| **Mode** | `MOCK_MODE=true` (set before recording) |

---

## 0:00 — 0:30 | Problem intro (30s)

**Screen:** Title card "SangeetFit" with 5 Indian wedding occasion icons (sangeet, mehendi, haldi, wedding, reception).

**Voiceover:**
> "Indian weddings aren't one event — they're five. Sangeet, mehendi, haldi, wedding, reception — each function has its own outfit expectations. Finding looks that work across all of them, that actually suit your skin tone, and that you can preview before committing? That takes hours of browsing and guesswork. SangeetFit solves this in one unified flow."

**On-screen text (lower third):** "5 occasions. 1 app. Zero guesswork."

---

## 0:30 — 1:00 | Step 1: Occasion selection + Step 2: Skin-tone analysis (30s)

**Screen:** App opens at occasion grid. Click "Wedding" -> transitions to skin-tone upload.

**Action:** Click the file upload area, select a selfie JPG, show the loading spinner ("Analyzing with YouCam API..."), then the result card appears with a skin-tone swatch.

**Voiceover:**
> "Start by picking the function — I'll choose Wedding. Then upload a front-facing selfie. The app sends it to the YouCam skin-tone analysis API, which returns a precise hex colour of your skin tone. In mock mode for this demo, it returns a representative value — with a valid API key, it uses the real endpoint."

**On-screen labels:** "YouCam skin-tone analysis (mock)" / "Detected skin tone: #b9947c"

---

## 1:00 — 1:40 | Step 3: Curated gallery + harmony scoring (40s)

**Screen:** Click "Continue to gallery". Gallery loads with wedding outfits sorted by harmony score.

**Action:** Hover over a few cards to show the harmony percentage badge (e.g., "87% harmony"), toggle a heart icon to shortlist an outfit, click the shortlist filter button to show only favourited items.

**Voiceover:**
> "The gallery filters to Wedding outfits and sorts them by colour harmony against your detected skin tone. Each card shows a percentage score — the higher, the better the hue match. You can shortlist favourites with the heart icon, or filter to show only your shortlist. The scoring is pure HSL angular distance math running client-side — no additional API calls needed."

**On-screen label:** "Colour harmony: 0-100% score based on hue distance"

---

## 1:40 — 2:10 | VTO modal + sharing (30s)

**Screen:** Click an outfit card -> VTO modal opens with loading spinner -> "Re-render" button.

**Action:** Show the loading state, then the mock result image appears. Click "Download", then "WhatsApp" (opens wa.me in new tab), then "Share" (copies link).

**Voiceover:**
> "Click any outfit for virtual try-on. The app sends your selfie and the garment reference to the YouCam cloth-v4 API — upload, submit, poll until done. In mock mode, we show the garment reference image as a placeholder. With a live API key, this would return a real composite of you wearing the garment."

> **Honest disclosure (mandatory):**
> ![IMPORTANT] "I need to be upfront — live VTO is not yet successfully verified. The code path implements the full contract — file upload, task submission, polling — but earlier attempts returned an `error_pose` response. This is a known limitation and the highest-priority item post-submission."

**Voiceover (continued):**
> "You can download the result, share it via WhatsApp, or copy a share link that restores the exact outfit and skin tone for anyone who opens it."

**On-screen label (VTO result):** "Mock result — source garment image, not a composite."

---

## 2:10 — 2:30 | Tech summary + wrap (20s)

**Screen:** Code snippets of key API integration points — skin route, VTO route — and a summary card.

**Voiceover:**
> "Under the hood: Next.js 14 with TypeScript and Tailwind CSS. Three API routes — skin analysis and VTO — each following the YouCam S2S pattern: file upload, task submission, status polling. Colour harmony is computed client-side from HSL hue similarity. The app supports URL-based state sharing via query parameters, WhatsApp sharing, and one-click download."

> "Current stack: Next.js, YouCam API, HSL colour engine, 10 outfit SVGs across 5 occasions. The app builds and runs with a single `npm run dev`."

**Final slide:** "SangeetFit — github link | live demo | next: resolve live VTO, expand outfit catalog, add size recommendations."

---

## Fallback plan

| If this happens... | Do this |
|--------------------|---------|
| App won't start | Verify `npm install` ran, check Node version (18+), check for port conflicts on 3000 |
| Skin-tone analysis fails | Confirm `MOCK_MODE=true` in `.env.local` — mock should always work without credentials |
| VTO modal shows error | Click "Re-render"; if still failing, explain: "This is the known live VTO limitation. In mock mode it returns the garment reference." |
| Canvas-confetti doesn't fire | Non-critical; skip it. Not a build-blocking issue |
| Build fails | Run `npm run build` beforehand to verify. If it fails, note it and demo from `npm run dev` |
| URL share link won't restore state | Paste the full URL manually; verify `?step=3&occasion=wedding&skin=...&vto=...` params are present |

---

## Pre-recording checklist

- [ ] `.env.local` has `MOCK_MODE=true` set
- [ ] `npm install` ran successfully
- [ ] `npm run dev` starts without errors
- [ ] Selfie test image available (under 10MB, JPG/PNG)
- [ ] Canvas-confetti import verified (non-blocking)
- [ ] All 5 occasions render 2 outfits each
- [ ] Heart toggle works (add/remove from shortlist)
- [ ] Shortlist filter toggle works
- [ ] VTO modal opens/closes correctly
- [ ] Download button triggers save dialog
- [ ] WhatsApp share opens new tab with correct text
- [ ] Copy link copies valid URL with query params
- [ ] Restored URL loads the correct step + occasion + skin + outfit
- [ ] Screen recording software ready (OBS, QuickTime, or built-in)
- [ ] Microphone audio level checked
- [ ] No browser extensions interfering (ad blockers, dark mode forced)
