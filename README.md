# SangeetFit

**Explore Indian wedding looks, preview an outfit on your photo, and choose what to wear.**

For a guest choosing what to wear to an Indian wedding celebration. Built with the YouCam AI Clothes Virtual Try-On API (Cloth V4) for the YouCam API hackathon.

- **Try it:** [sangeet-fit.vercel.app](https://sangeet-fit.vercel.app) — no account needed.
- **How it works:** [one-page architecture note](docs/submission/ARCHITECTURE.md).
- **Run it without any keys (Node 22):** `npm ci && MOCK_MODE=true npm run dev`, then open [localhost:3000](http://localhost:3000).

Stack: Next.js 16.4.1, React 19.3.1, TypeScript and Tailwind CSS.

## Current experience

1. Choose **Try on a look**, pick an occasion and browse outfit recommendations or the collection. Occasion choices open the outfits directly; browsing needs no photo or API task.
2. Upload a garment photo and confirm its name, upper-body/full-outfit category, colour, style level and occasion tags. Clothes stay in the current page session.
3. See recommendations explained by actual occasion/style/colour metadata. Choose a preferred colour yourself; no suitability percentages are claimed. You can also try an owned garment outside its suggested occasions.
4. Open a look, consent to live-provider photo processing, add a full-body person photo and press **Generate try-on**. Uploading, browsing and opening do not generate tasks.
5. Compare the two recent results, view originals, zoom and save/open an image. Different source-photo versions are labelled. Comparing and shortlisting do not submit another generation task.

Catalogue outfit sharing restores the selected outfit and occasion, not personal photos or results. Uploaded clothes do not get public links. Refreshing/leaving can clear clothes, photos, results and choices. Provider links may expire; opening/downloading must be checked on real phones. Top-and-bottom combinations and a permanent wardrobe are future work.

## Honest implementation status

| Area | Implemented behaviour | Evidence limit |
|---|---|---|
| Own clothes | JPEG/PNG preprocessing, confirmed metadata, validated two-image VTO request | Uploaded-garment live quality not established |
| Recommendations | Occasion/audience filtering; declared style, explicit colour, stable order; reasons | Metadata policy, not learned suitability or sizing |
| Catalogue | 26 original AI model/outfit concepts across five occasions; photo-free browsing | Emerald Silk Kurta and Sapphire Embroidered Sherwani have limited one-source live reviews; other references remain unreviewed. Concepts are not seller products. Sourced-photo and legacy catalogue entries are no longer included |
| Try-on | YouCam Cloth V4 upload → submit → poll; explicit action; one client request pending; no automatic retry | Two private live reference results on one person scored 5/5 face and garment by that participant; own-garment quality remains untested |
| Compare/save | Two session results, source version/mode, live before/after slider, originals/zoom/choice, save/open | No permanent wardrobe; actual-device save behaviour pending |
| Seller action | Exact verified HTTPS product-link metadata supported | No current products/permissions established, so no seller buttons shown |

Primary recommendations require a matching photographic reference, provenance/permission and a visual live-output review. A wired candidate is not a reviewed result. The two pilot-reviewed men's concepts are eligible; a fresh session also offers **Add my outfit**, with unreviewed candidates available separately at `/library`. Unsupported cards do not fill the recommendations.

Mock VTO returns the garment reference and explicitly says it is **not a generated image of you**. Live mode without a key or configured shared budget fails closed; it never substitutes mock output. Face retention, garment fidelity, physical fit and production reliability are not guaranteed. The 16-look engineering benchmark has **two private pilot outcomes** and remains pending.

## Run locally

Use Node 22.13+ (below 23). Install dependencies, then force mock mode for ordinary development:

```sh
npm ci
MOCK_MODE=true npm run dev
```

Open [localhost:3000](http://localhost:3000). Development uses `.next-dev`; production uses `.next`, allowing a separate local mock production server without cache collisions.

```sh
MOCK_MODE=true npm run build
MOCK_MODE=true npm start -- --port 3500
```

Create `.env.local` yourself if live testing is separately approved. Never commit credentials:

```text
YOUCAM_API_KEY=your_key_here
YOUCAM_BASE_URL=https://yce-api-01.makeupar.com/s2s/v2.0
MOCK_MODE=true
```

`MOCK_MODE=true` explicitly disables provider work. With any other value the try-on route uses live mode; missing configuration is **unconfigured**, not mock. `/api/mode` reports configuration, without querying or exposing budget values. No preview access code is required. After the photo disclosure and successful local photo preparation, the user explicitly clicks Generate. Selecting a photo alone sends no provider request. Never put secrets in a `NEXT_PUBLIC_` variable, URL, repository, screenshot or public submission.

The live try-on route reserves units from one persistent Redis budget **before uploading photos**. Every app instance sharing that store uses the same allowance. Missing/exhausted/corrupt state or a storage error blocks generation. Reservations do not expire or refund automatically, including failed attempts. Anyone who can reach a live instance can use its finite shared allowance, up to **3 live tasks per visitor per rolling day** (keyed by a SHA-256 hash of the client address, never the raw IP); the over-limit response is 429 and spends nothing. The ledger does not control other applications or old deployments using the same YouCam key. Setup, operator commands and deployment boundaries are in the [release procedure](docs/testing/RELEASE.md). Live tasks still need verified prices, a 25% reserve and separate bounded approval. Stop on 429. A timed-out/cancelled request may already have submitted a provider task; cancellation cannot undo it.

## Verification

```sh
npm run test
npm run typecheck
npm run lint
MOCK_MODE=true npm run build
npm run test:browser
git diff --check
```

`npm run verify` runs the offline, type, lint, mock build and browser sequence with provider credentials cleared and mock mode forced. Browser checks need Playwright Chromium (`npx --no-install playwright install chromium`); `PLAYWRIGHT_CHANNEL=chrome` selects a locally installed Chrome when needed. CI runs the same mock-only verification. Browser/API fixtures are synthetic or local test assets; checks do not authorize paid YouCam requests. The [benchmark](docs/testing/BENCHMARKS.md) `--check` intentionally fails while evidence is pending.

## Code and sources

- `src/app/page.tsx`: occasion → recommendations/fitting room.
- `src/components/WardrobeUpload.tsx`, `LookComparison.tsx`: session clothes and result comparison.
- Wedding planning and text-only PDF export are [archived](docs/archive/planning/README.md); their source is preserved but unmounted.
- Skin-tone analysis and its selfie/camera flow are [archived](docs/archive/skin-tone/README.md). `POST /api/skin` returns HTTP410 without reading photos, reserving allowance or contacting YouCam.
- `src/lib/styling.ts`: deterministic recommendations and eligibility; `vto-input.ts`: server image/mode validation.
- `src/app/api/vto/route.ts`: catalogue/uploaded references; serialized JSON must be **under 4,000,000 bytes**.
- `src/data/outfits.ts`, `editorial.ts`: current catalogue identity, references, styling and provenance. Display and try-on assets are under `public/garment_test/editorial/`.
- [Historical sourced-photo credits/licences](docs/garment-library/README.md) and [source feasibility](docs/garment-library/SOURCE_FEASIBILITY.md) document the retired sourced-photo collection. They do not describe additional entries in the current 26-concept catalogue. Asset licences are separate from code licensing; no retailer partnership or blanket image permission is implied.

## Release and submission

Submission materials: [Devpost draft](docs/submission/DEVPOST_DRAFT.md), [demo script](docs/submission/DEMO_SCRIPT.md) and [checklist](docs/submission/PITCH_CHECKLIST.md). Dated release, deployment and live-test evidence is tracked in [project state](docs/agent-workflow/PROJECT_STATE.md) and `docs/testing/`.

## License

No application LICENSE file is included yet; settle the code licence before public distribution. Third-party photos keep their individual licences and attribution requirements.
