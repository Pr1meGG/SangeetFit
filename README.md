# SangeetFit

**Occasion-curated outfit gallery with skin-tone harmony scoring and virtual try-on for Indian weddings.**

Built for the YouCam API Hackathon.

---

## What it does

Indian weddings involve 5+ functions (sangeet, mehendi, haldi, wedding, reception), each with distinct outfit expectations. SangeetFit is a 3-step flow:

1. **Select occasion** — pick the wedding function you're attending
2. **Skin-tone analysis** — upload a selfie; the YouCam API returns a skin-tone hex
3. **Curated gallery** — outfits filtered by occasion, sorted by colour-harmony score against your skin tone, with one-click virtual try-on

Shortlisted outfits can be shared via WhatsApp or a copy link.

---

## Tech stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **YouCam API** — skin-tone analysis (`/task/skin-tone-analysis`) and clothes VTO (`/task/cloth-v4`)
- **Lucide React** — icons

---

## How to run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Create `.env.local` (never committed):

```
YOUCAM_API_KEY=your_key_here
YOUCAM_BASE_URL=https://yce-api-01.makeupar.com/s2s/v2.0
MOCK_MODE=true
```

| Variable | Purpose |
|----------|---------|
| `YOUCAM_API_KEY` | Bearer token for all YouCam API calls |
| `YOUCAM_BASE_URL` | Base URL for the YouCam S2S API |
| `MOCK_MODE` | `true` = return mock data without live API calls (safe for demos) |

> **Note:** With `MOCK_MODE=true` or no API key set, the app returns pre-built mock results — no live API calls are made.

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
│   └── outfits.ts            # 10-item outfit catalog (5 occasions × 2)
└── lib/
    └── color.ts              # Hex → HSL conversion + hue similarity scoring
```

---

## Background: pivot from Proof

This project started as **Proof** — a skin-analysis daily-tracking concept. Noise testing showed the API's measurement variance (~3 pts) exceeded the real-world signal (~2 pts), making daily change detection impossible. See [`docs/noise-test.md`](docs/noise-test.md) for details.

We pivoted to **SangeetFit** — using the same YouCam API for occasion-aware outfit styling instead.

---

## License

MIT
