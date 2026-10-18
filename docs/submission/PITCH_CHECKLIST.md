# SangeetFit — Pitch & Submission Checklist

> **Project:** SangeetFit — occasion-curated outfit gallery with skin-tone harmony scoring and virtual try-on
> **Event:** YouCam API Hackathon
> **Stack:** Next.js 14, TypeScript, Tailwind CSS, YouCam S2S v2.0 API

---

## 1. Pitch summary

### Problem
Indian weddings have 5+ distinct functions (sangeet, mehendi, haldi, wedding, reception). Finding occasion-appropriate outfits that harmonise with your skin tone requires browsing across multiple sources and imagining how garments look on you — tedious and error-prone.

### Solution
A single 3-step flow: pick the occasion, upload a selfie for skin-tone analysis, and browse styled outfits sorted by colour-harmony score. One-click virtual try-on, download, and sharing via WhatsApp or share link.

### Differentiation
- **Occasion-aware**: Filters and sorts by wedding function, not a flat catalogue
- **Colour-harmony scoring**: HSL hue-similarity engine ranks outfits by how well they complement the user's detected skin tone
- **URL state sharing**: Recipient sees the exact outfit + skin tone on open, no account needed
- **Purpose-built for Indian weddings**: 10 SVGs across 5 occasions, designed for Indian silhouettes (lehenga, anarkali, saree, sharara, kurta, gown)

---

## 2. Technology summary

| Area | Detail |
|------|--------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| YouCam skin | `POST /api/skin` -> upload file -> submit skin-tone-analysis task -> poll -> return hex |
| YouCam VTO | `POST /api/vto` -> upload selfie + garment file -> submit cloth-v4 task -> poll -> return result URL |
| Colour engine | HSL hue-similarity angular distance (0-1 score, client-side) |
| Sharing | WhatsApp via `wa.me` URL, copy-link with `?step&occasion&skin&vto` params |
| Icons / UI | Lucide React, glassmorphism design tokens, canvas-confetti |
| Build | `npm run dev`, `npm run build`, `npm start` |

---

## 3. Current limitations (honest)

| Limitation | Impact |
|------------|--------|
| **Live VTO is unresolved** | The code path implements the full YouCam cloth-v4 contract, but earlier runs returned `error_pose`. The mock VTO returns the source garment image, not a composite. Highest priority post-submission. |
| **Skin-tone mock is hardcoded** | Returns `#b9947c`. Live API works with valid credentials. |
| **Small outfit catalog** | 10 outfits (2 per occasion). Expandable via data file. |
| **No auth/user accounts** | No persistence across sessions beyond URL sharing. |
| **No sizing/recommendation engine** | Colour harmony only — no body type, size, or style preference matching. |

---

## 4. README readiness checklist

- [ ] One-sentence pitch present and clear
- [ ] Problem/target users section written
- [ ] Journey explanation (3-step flow + VTO + sharing)
- [ ] Technologies table present
- [ ] Mock vs live feature table present with honest status
- [ ] Setup commands documented (`npm install`, `npm run dev`, `npm run build`)
- [ ] Environment variable names documented (no secrets)
- [ ] Current limitations section present
- [ ] Screenshots placeholder ("Coming soon")
- [ ] Demo video placeholder ("Coming soon")
- [ ] Project structure tree present
- [ ] License file referenced

---

## 5. Setup reproducibility checklist

- [ ] `git clone <repo>` succeeds
- [ ] `npm install` completes without errors
- [ ] `npm run dev` starts on localhost:3000
- [ ] App renders occasion grid on first load
- [ ] Selfie upload triggers skin analysis (mock returns in <1s)
- [ ] Gallery renders 2 outfits for each of 5 occasions
- [ ] Harmony score shown on each gallery card
- [ ] Heart toggle adds/removes from shortlist
- [ ] Shortlist filter works
- [ ] VTO modal opens on outfit card click
- [ ] "Re-render" button works
- [ ] Download button triggers save dialog
- [ ] WhatsApp share opens correct `wa.me` URL
- [ ] Copy link copies valid URL with query params
- [ ] Restored URL loads correct state (step + occasion + skin + vto)
- [ ] `npm run build` completes without errors (or note any failures for prerelease)
- [ ] `npm run lint` completes without errors

---

## 6. Demo video / screenshot checklist

### Required screenshots (placeholders)

| Screenshot | Status | Notes |
|------------|--------|-------|
| Occasion selection grid | Coming soon | 5 occasion buttons |
| Skin-tone upload + result | Coming soon | Upload area + detected swatch |
| Curated gallery with harmony scores | Coming soon | Sorted grid with percentage badges |
| VTO modal with result | Coming soon | Modal with garment + mock result |
| Share link / WhatsApp | Coming soon | wa.me URL or copied link |
| Shortlist view | Coming soon | Filtered favourites |
| Mobile responsive view | Coming soon | Narrow screen layout |

### Required video

| Item | Status | Notes |
|------|--------|-------|
| Demo recording (2-3 min) | Coming soon | Follow `docs/submission/DEMO_SCRIPT.md` |
| Upload to video platform | Coming soon | YouTube unlisted or Vimeo |
| Link added to README | Coming soon | At demo video section |
| Subtitles or captions | Optional | Recommended for accessibility |

---

## 7. Build check items

- [ ] `npm run build` completes (production build)
- [ ] `npm start` serves the built app on localhost:3000
- [ ] All 3 steps render correctly in production mode
- [ ] VTO modal opens/closes without console errors
- [ ] No 404s for outfit SVGs or garment images
- [ ] No unhandled promise rejections in console
- [ ] File upload validation works (type + size check)
- [ ] URL share restore works in production build
- [ ] Lighthouse / performance is reasonable for a hackathon project

---

## 8. Submission requirements (verified from official source)

> **Source:** Official Devpost rules page at https://youcam-api-skin-ai-ecommerce.devpost.com/rules
>
> **Hackathon Platform:** Devpost (not Hackster, not Lablab)
>
> All items below marked "Verified from source" were extracted directly from the official rules page (fetched 2026-10-18).

### Mandatory submission requirements

- [ ] **Code repository URL provided** (Verified from source) — Must provide a URL to the code repository for judging and testing. The repository must contain all necessary source code, assets, and instructions for the project to be functional. The repository can be **public (with relevant licensing) OR private and shared with `support+hackathon@devpost.com`**.
- [ ] **Text description of features and consumer value** (Verified from source) — Must explain features, functionality and demonstrate clear consumer or eCommerce value.
- [ ] **Screenshots included** (Verified from source) — "Must include screenshots of the project."
- [ ] **Demo video (1-3 minutes)** (Verified from source) — Must show the experience end-to-end. Must explain which YouCam API(s) are used. Must include footage showing the project functioning on the device for which it was built. Must be uploaded to **YouTube (highly preferred)**, Vimeo, or Youku and be publicly visible. Judges are not required to watch beyond three minutes.
- [ ] **Integrates at least one YouCam API** (Verified from source) — "Entrants must create a working application that integrates at least one Perfect Corp. YouCam API and demonstrate clear consumer or eCommerce value."
- [ ] **Exit interview if chosen as winner** (Verified from source) — "Must participate in an exit interview if chosen as winner."
- [ ] **Blog article consent** (Verified from source) — "Must agree to be included in a blog article."
- [ ] **Original work / no IP infringement** (Verified from source) — Submission must be original work, solely owned by Entrant, and must not violate third-party intellectual property rights.
- [ ] **Project is functional and installable** (Verified from source) — Must be capable of being successfully installed and running consistently on the platform for which it is intended, and must function as depicted in the video and/or text description.
- [ ] **Testing access provided** (Verified from source) — Must provide access to working Project (a link to a website, functioning demo, or test build). If private, include login credentials. Must be available free of charge without restriction for testing/evaluation until Judging Period ends.
- [ ] **All materials in English** (Verified from source) — All submission materials must be in English, or provide an English translation.
- [ ] **Significant update for existing projects** (Verified from source) — If the project existed before the Submission Period (Sep 29, 2026), it must have been significantly updated after that date, and the Entrant must explain what was updated.

### Recommended / optional items

- [ ] **Repository is public** (Could not verify as mandatory — assumption corrected) — The official rules say "public (with relevant licensing) OR private and shared with support+hackathon@devpost.com." Public is NOT strictly mandatory.
- [ ] **YouTube upload for video** (Verified from source — "highly preferred") — YouTube is strongly recommended but Vimeo or Youku are also accepted.
- [ ] **YouCam API key is NOT committed** (Could not verify as explicit requirement — standard security practice) — No explicit rule prohibits committing API keys, but it is standard security best practice, and `.env.local` is already gitignored.

### Previously listed items now mapped to verified requirements

- [x] **README includes setup instructions** — Covered by the "repository must contain instructions required for the project to be functional" requirement.
- [x] **README includes demo video link** — The video link must be provided on the Devpost submission form. Having it in README is best practice but not explicitly required by rules.
- [x] **Project demonstrates YouCam API integration** — Covered by the "integrate at least one YouCam API" requirement.
- [x] **Submission includes explanation of how the API is used** — Covered by text description and demo video requirements.
- [x] **No proprietary assets leaked** — Covered by the "must not include third-party trademarks or copyrighted music or other material unless the Entrant has permission" rule and IP requirements.

### Key gaps identified

1. **Demo video not yet recorded** — This is a hard mandatory requirement. The existing placeholder will disqualify the submission.
2. **Screenshots not captured** — "Must include screenshots of the project" is mandatory, not optional. The checklist currently has "Coming soon" for all screenshots.
3. **Testing access URL not confirmed** — The submission form requires a working demo URL or test build. The app runs on localhost — a deployed instance or clear testing instructions for a local setup must be provided.
4. **"Significantly updated" explanation needed** — If the project started before Sep 29, 2026 (the PRD dates suggest it did), a statement explaining what was significantly updated during the submission period will be required.
5. **VTO integration is only partially functional** — The skin-tone API is verified, but VTO returns `error_pose` in live mode. The mock fallback works but the submission must accurately describe the current state.

---

## 9. Post-submission todo (highest-priority items)

1. **Debug live VTO `error_pose`** — root-cause the failed cloth-v4 task
2. **Record demo video** following `docs/submission/DEMO_SCRIPT.md`
3. **Take screenshots** across all app states
4. **Add screenshots and video link** to README
5. **Expand outfit catalog** with more occasions and categories
6. **Add outfit rental/purchase links** if applicable
7. **Consider user accounts** for session persistence across devices
