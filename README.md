# YouCam Hackathon — Proof / Pivot

**Honest documentation of a research-first prototype that measured the API, found the noise floor, and moved on.**

---

## What we tried

**Concept:** "Proof" — skin AI analysis for daily progress tracking via the YouCam API. We wanted to detect small daily changes in a `raw_score` metric and show users an improvement trajectory over a hackathon week.

**Method:** Repeated scans under controlled conditions (same light, 20-minute spacing, post-exercise) to establish a baseline band and check whether real-life shifts exceeded measurement noise.

---

## What we learned (noise test)

Results are in [`docs/noise-test.md`](docs/noise-test.md).

- **Spread (API variance):** ~3 pts on `raw_score`
- **Shift (real stimulus, e.g., post-exercise):** ~2 pts
- **Verdict:** spread > shift. The API's noise floor is larger than the small changes we wanted to detect.

Implications:
- Daily irritation early-warning requires detecting <3 pt changes — impossible.
- 4-week change detection needs ~28 days; only ~17 days remained to deadline.
- Any "improving" verdict would need shift > spread + temporal evidence — neither exists.

**We measured the API's noise floor; single-point deltas are not shown.**

---

## Pivot

Stopped Proof. Moved to **Clothes VTO** (garment try-on) using the same YouCam API. Scripts and outputs in `scripts/garment_test.py` and `out/garment_test/`.

---

## Tech stack

- Next.js 14
- TypeScript
- Tailwind CSS
- YouCam API

---

## How to run

```bash
npm install
npm run dev
```

---

## API key setup

Create `.env`:

```
YOUCAM_API_KEY=your_key_here
```

---

## License

MIT

---

*Built for the YouCam hackathon. Not a product. A measured decision to stop on data rather than demo fiction.*
