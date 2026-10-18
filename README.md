# SangeetFit

**Occasion-curated outfit gallery with skin-tone harmony scoring and virtual try-on for Indian weddings.**

> Built for the YouCam API Hackathon.

---

## One-sentence pitch

SangeetFit is an occasion-curated outfit gallery with skin-tone harmony scoring and virtual try-on for Indian weddings.

---

## The problem

Indian weddings span 5+ functions — sangeet, mehendi, haldi, wedding, reception — each with distinct outfit expectations. Finding what suits you across all of them is a manual, time-consuming process of browsing, matching colours to your skin tone, and imagining how a garment looks on you.

### Who it's for

- Wedding guests and bridal party members attending multi-day Indian weddings
- Anyone who wants to preview outfits styled to their skin tone before buying or renting
- Users who want to share shortlisted outfits with friends or family for a second opinion

---

## The journey

1. **Select occasion** — pick the wedding function you're attending (sangeet, mehendi, haldi, wedding, reception)
2. **Skin-tone analysis** — upload a front-facing selfie; the YouCam API returns a skin-tone hex colour
3. **Curated gallery** — outfits filtered by occasion, sorted by colour-harmony score against your skin tone
4. **Virtual try-on** — one-click VTO on any outfit with download, WhatsApp sharing, and copy-link sharing

Shortlisted outfits can be toggled via a heart icon and filtered to a shortlist view. Shared links restore the exact outfit and skin tone for the recipient.

---

## Technologies

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + glassmorphism design tokens |
| Icons | Lucide React |
| Visual flair | canvas-confetti |
| API | YouCam S2S v2.0 — skin-tone analysis (`/task/skin-tone-analysis`) and clothes VTO (`/task/cloth-v4`) |
| Colour engine | HSL hue-similarity scoring (pure math, no assertion about personal suitability) |

---

## Feature status: mock vs live

| Feature | Mock mode | Live (verified) | Notes |
|---------|-----------|----------------|-------|
| Occasion selection | Works | Works | UI-only; no API dependency |
| Skin-tone analysis | Returns `#b9947c` | Verified working | Live flow: upload file → submit task → poll until success |
| Colour-harmony sorting | Works | Works | Pure client-side HSL math; no API needed |
| Virtual try-on (VTO) | Returns source garment image as "result" | **Unresolved** | Live flow exists in code but previously returned `error_pose` |
| Gallery shortlist (favourites) | Works | Works | Client-side state |
| WhatsApp sharing | Works | Works | Opens `wa.me` URL |
| Copy-link sharing | Works | Works | Restores occasion + skin + outfit from URL params |
| Download VTO result | Works | Works | Direct anchor download |
| URL state restoration | Works | Works | `?step&occasion&skin&vto` query params |

**Current limitations (honest):**
- **Live VTO is unresolved.** The code path exists and the API contract is implemented, but previous attempts returned `error_pose`. No further debugging has been completed.
- **Mock VTO returns the source garment image** as its "result" — it is not a try-on composite. The user sees the garment reference image, not their photo wearing it.
- **Skin-tone analysis mock** returns a hardcoded `#b9947c` hex. The live API path is verified working with valid credentials.
- **No actual YouCam credentials** are committed or shipped. Users must provide their own `YOUCAM_API_KEY`.
- **10 outfits only** (2 per occasion). Expandable via the `src/data/outfits.ts` data file.

---

## How to run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

### Contract tests (YouCam API shape validation)

```bash
node --experimental-strip-types tests/youcam-api-contract.test.ts
```

---

## Environment variables

Create `.env.local` in the project root (never committed):

```
YOUCAM_API_KEY=your_key_here
YOUCAM_BASE_URL=https://yce-api-01.makeupar.com/s2s/v2.0
MOCK_MODE=true
```

| Variable | Required | Purpose |
|----------|----------|---------|
| `YOUCAM_API_KEY` | For live mode | Bearer token for all YouCam API calls |
| `YOUCAM_BASE_URL` | For live mode | Base URL for the YouCam S2S API (default shown) |
| `MOCK_MODE` | Optional | `true` = return mock data without live API calls (safe for demos). Defaults to mock if unset or if no API key is present. |

> **With `MOCK_MODE=true` or without an API key, the app runs entirely on mock data — no live API calls are made.**

---

## Project structure

```
src/
├── app/
│   ├── page.tsx              # Main 3-step flow (occasion → skin → gallery)
│   ├── layout.tsx            # Root layout + metadata
│   ├── globals.css           # Design tokens + glassmorphism
│   └── api/
│       ├── skin/route.ts     # Skin-tone analysis (upload → submit → poll)
│       └── vto/route.ts      # Clothes VTO (upload → submit → poll)
├── components/
│   └── Navbar.tsx            # App header
├── data/
│   └── outfits.ts            # 10-item outfit catalog (5 occasions x 2)
└── lib/
    ├── youcam.ts             # YouCam file upload + data URL parsing
    └── color.ts              # Hex -> HSL conversion + hue similarity scoring

tests/
└── youcam-api-contract.test.ts  # Contract validation for YouCam API shapes

public/
├── outfits/                  # 10 SVG outfit illustrations
└── garment_test/             # Garment reference images for mock VTO
```

---

## Screenshots

Captured from the mock-mode run in `docs/submission/screenshots/`:

- `01-home.png` — occasion selection grid
- `02-skin-analysis-upload.png` — skin-tone upload step
- `03-skin-result.png` — detected skin-tone swatch
- `04-gallery.png` — occasion-curated, harmony-sorted gallery
- `05-fullbody-upload.png` — full-body photo upload prompt
- `06-vto-mock-result.png` — mock virtual try-on result
- `07-share.png` — share/download actions

---

## Demo video

*(Pending — demo video link will be added after recording.)*

---

## Background: pivot from Proof

This project started as **Proof** — a skin-analysis daily-tracking concept. Noise testing showed the API's measurement variance (~3 pts) exceeded the real-world signal (~2 pts), making daily change detection impossible (see [`docs/noise-test.md`](docs/noise-test.md)).

We pivoted to **SangeetFit** — using the same YouCam skin-tone analysis API for occasion-aware outfit styling, adding clothes VTO as the secondary integration.

---

## License

MIT
