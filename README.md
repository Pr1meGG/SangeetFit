# SangeetFit

Plan what to wear across five wedding celebrations using clothes you already own. Rewear a favourite, try uncertain looks on your photo, compare two results and save your choice. Browse model-led concepts without a photo for optional inspiration. Built for the YouCam API hackathon with Next.js 16.4.1, React 19.3.1, TypeScript and Tailwind CSS.

## Current experience

1. Open the five-event board and assign an owned garment or an unreviewed inspiration concept to each occasion. Reuse a garment across events when you want. Planning needs no photo or API task; the board stays in this page session. Skin-tone analysis is optional and uses a separate face selfie.
2. Upload a garment photo and confirm its name, upper-body/full-outfit category, colour, style level and occasion tags. Clothes stay in the current page session.
3. See recommendations explained by actual occasion/style/colour metadata. Skin colour does not prohibit outfits or produce suitability percentages. You can also try an owned garment outside its suggested occasions.
4. Open a look, consent to live-provider photo processing, add a full-body person photo and press **Generate try-on**. Uploading, browsing and opening do not generate tasks.
5. Compare the two recent results, view originals, zoom, choose a look and save/open the image. Different source-photo versions are labelled. Reopening/comparing/reloading an image creates no new task.

Catalogue outfit sharing restores the selected outfit and occasion, not personal photos or results. Uploaded clothes do not get public links. Refreshing/leaving can clear clothes, photos, results and choices. Provider links may expire; opening/downloading must be checked on real phones. Top-and-bottom combinations and a permanent wardrobe are future work.

## Honest implementation status

| Area | Implemented behaviour | Evidence limit |
|---|---|---|
| Own clothes | JPEG/PNG preprocessing, confirmed metadata, validated two-image VTO request | Uploaded-garment live quality not established |
| Five-event board | Session-only occasion choices, deliberate rewear, candidate inspiration separated from owned clothes | Planning usefulness not yet user-tested; selections clear on refresh/leaving |
| Recommendations | Occasion/audience filtering; declared style, explicit colour, stable order; reasons | Metadata policy, not learned suitability or sizing |
| Catalogue | 26 original AI model/outfit concepts across five occasions, plus 14 credited archive photos (eight wired candidates) and four legacy mappings; photo-free browsing | Emerald Silk Kurta and Sapphire Embroidered Sherwani have limited one-source live reviews; other references remain unreviewed. Concepts are not seller products |
| Try-on | YouCam Cloth V4 upload → submit → poll; explicit action; one client request pending; no automatic retry | Two private live reference results on one person scored 5/5 face and garment by that participant; own-garment quality remains untested |
| Compare/save | Two session results, source version/mode, live before/after slider, originals/zoom/choice, save/open | No permanent wardrobe; actual-device save behaviour pending |
| Optional skin | Separate selfie → skin-tone-analysis API; mock sample visibly labelled | Separate evidence; not a VTO-quality substitute |
| Seller action | Exact verified HTTPS product-link metadata supported | No current products/permissions established, so no seller buttons shown |

Primary recommendations require a matching photographic reference, provenance/permission and a visual live-output review. A wired candidate is not a reviewed result. The two pilot-reviewed men's concepts are eligible; a fresh session also offers **Add my outfit**, with unreviewed candidates available separately at `/library`. Unsupported cards do not fill the recommendations.

Mock VTO returns the garment reference and explicitly says it is **not a generated image of you**. Live mode without a key or configured preview access code fails closed; it never substitutes mock output. Face retention, garment fidelity, physical fit and production reliability are not guaranteed. The 16-look engineering benchmark has **two private pilot outcomes** and remains pending.

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
# Only for a separately approved live preview:
# LIVE_ACCESS_CODE=a-private-random-value-between-24-and-256-characters
```

`MOCK_MODE=true` explicitly disables provider work. With any other value the routes use live mode; a missing key is **unconfigured**, not mock. `/api/mode` reports the running server mode. Live `/api/vto` and `/api/skin` require the server-only `LIVE_ACCESS_CODE` (24–256 characters); missing/invalid code blocks generation before photo processing. The user enters the same shared code in the page, where it stays only in that page session. It is an invitation gate, **not** per-user authentication or a global task quota. Never put it in a `NEXT_PUBLIC_` variable, URL, repository, screenshot or public submission. Live tasks consume account units and need a verified budget and bounded approval. Stop on 429. A timed-out/cancelled request may already have submitted a provider task; cancellation cannot undo it.

## Verification

```sh
npm run test
npm run typecheck
npm run lint
MOCK_MODE=true npm run build
npm run test:browser
git diff --check
```

`npm run verify` runs the offline, type, lint, mock build and browser sequence with provider credentials and live access cleared. Browser checks need Playwright Chromium (`npx --no-install playwright install chromium`); `PLAYWRIGHT_CHANNEL=chrome` selects a locally installed Chrome when needed. CI runs the same mock-only verification. Browser/API fixtures are synthetic or local test assets; checks do not authorize paid YouCam requests. The [benchmark](docs/testing/BENCHMARKS.md) `--check` intentionally fails while evidence is pending.

## Code and sources

- `src/app/page.tsx`: occasion → optional skin → recommendations/fitting room.
- `src/components/WeddingWeekBoard.tsx`, `WardrobeUpload.tsx`, `LookComparison.tsx`: event plan, session clothes and result decisions.
- `src/lib/styling.ts`: deterministic recommendations and eligibility; `vto-input.ts`: server image/mode validation.
- `src/app/api/vto/route.ts`: catalogue/uploaded references; serialized JSON must be **under 4,000,000 bytes**.
- `src/data/outfits.ts`, `editorial.ts`, `indian-wear.json`: identity, references, styling and provenance.
- [Photo credits/licences](docs/garment-library/README.md) and [source feasibility](docs/garment-library/SOURCE_FEASIBILITY.md). Photo licences are separate from code licensing; no retailer partnership or blanket image permission is implied.

## Release and submission

[Milestones](docs/plans/2026-10-20-personal-stylist-milestones.md), [project state](docs/agent-workflow/PROJECT_STATE.md), [user validation](docs/testing/REAL_USER_VALIDATION.md), [release procedure](docs/testing/RELEASE.md), [demo script](docs/submission/DEMO_SCRIPT.md) and [submission checklist](docs/submission/PITCH_CHECKLIST.md) track implementation separately from live/release evidence.

Budget snapshot verified after the 21 October pilot: 910 remaining units; Cloth V4 cost 2 units/call and optional facial colour analysis cost 20. The 25% reserve, rounded up, is 228 units. The two completed pilot tasks used 4 units; the other 14 distinct men's references require separate authorization. Recheck balance and pricing before any task; this snapshot is not approval to spend. See [budget evidence](docs/testing/BENCHMARKS.md).

The separately approved two-look live pilot rendered Emerald Silk Kurta and Sapphire Embroidered Sherwani on one private full-body source. Both images remain outside the repository; the participant rated face and garment fidelity 5/5 for each, so the two-look pilot gate passed for this one source. Another observer rated the overall AI appearance 4/5. The other 14 distinct men's references require separate authorization even if the pilot is rated usable. The 16-case scorecard is engineering evidence for one person, not independent usability or own-garment proof. Actual Android Chrome/iPhone Safari checks, judge access and the final genuine demo/submission also remain pending. Keep personal photos/results out of GitHub and the public demo. Existing screenshots are historical mock evidence until refreshed. No demo video has been recorded. Public live deployment needs controlled judging access and a credit reserve; the client one-request guard is not server-wide quota protection.

Working target: submit 1 November, keep 2 November as buffer, preserve judging availability through 20 November. Reverify exact requirements, dates/timezone and access with the [official rules](https://youcam-api-skin-ai-ecommerce.devpost.com/rules).

Working policy: commit and push verified checkpoints to `codex/ui-revamp`. Its `vercel.json` branch rule disables automatic Git deployments; a separately approved deployment can be prepared later. Machine-local settings, traces, draft branding and private photos/results are excluded from checkpoints.

## License

No application LICENSE file is included yet; settle the code licence before public distribution. Third-party photos keep their individual licences and attribution requirements.
