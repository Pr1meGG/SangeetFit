# Personal occasion stylist — milestones and quality gates

Approved product direction, revised 21 October 2026. Dates below are targets, not achievements. Assume 4–6 focused hours/day and timely photo/testing feedback. Preserve the existing warm festive UI.

**Goal for this release:** choose between celebration outfits already owned → occasion-based explanation → personal try-on of two looks → compare → choose/save. The wardrobe stays in the page session. Top-and-bottom combinations and everyday occasions are future work; seller links are optional only for verified exact items.

## Ordered delivery

| Milestone | Target date | Deliverable and acceptance gate | Current evidence |
|---|---|---|---|
| M0: preserve work + feasibility | 21 Oct | Audit the dirty branch, commit meaningful scoped checkpoints and push `codex/ui-revamp`; record actual credits/current applicable V4 pricing, select consenting people and exact inputs. Reserve 25% of units. | Budget verified: 916 units, V4 2/call, optional colour analysis 20/call; reserve 229. Participant/input preparation deferred by user; branch sync tracked in PROJECT_STATE. |
| M1: own clothes + quality proof | 21–23 Oct | Run a separately authorized six-task pilot: two people × one owned upper-body garment, one owned full outfit and one permitted reference each. ≥5/6 must render with both identity and garment rated ≥4/5. | Software implemented and locally verified; live pilot pending participant inputs, consent and batch approval. |
| M2: useful reasons | 24–25 Oct | Filter occasion/audience; rank declared style, explicit colour, stable order; explain actual metadata. Own clothes participate with confirmed tags. | Pure ranking policy and offline regression implemented; integrated QA recorded separately. |
| M3: useful references + decisions | 25–29 Oct | Review permitted references used in testing; promote only accurate outputs with provenance. Two good reference alternatives suffice for the demo; 12 active references are a stretch target. Existing two-look comparison/choice stays central. | No visually reviewed catalogue references or verified seller products yet. Upload-first empty state is required. |
| M4: five users + quality benchmark | 24–29 Oct | Predeclare 12 cases: 8 owned garments and 4 permitted references across five people, at least two looks per person. Count the six pilot cases in this set. Record every outcome; retests use a new approved batch. | No outcomes entered; device/user evidence pending. |
| M5: release freeze | 30–31 Oct | Fresh offline/API/browser suites, TypeScript/lint/build/diff, real-phone checks, accessible judging URL, budget reserve and privacy copy. Freeze new features. | Ten offline and four browser suites, TypeScript/lint/build/diff pass locally; physical-device/live/judge-access checks pending. |
| M6: submission | 1 Nov; 2 Nov buffer | English description, final screenshots, source/setup access and genuine 1–3 minute demo; submit through Devpost. | Recording and external submission require separate authorization. |

The official deadline is 2 November 2026 at 11:45 am EST; working submission target is 1 November. Keep judging access through 20 November and recheck the [official rules](https://youcam-api-skin-ai-ecommerce.devpost.com/rules) before release.

## Software contracts

- `/api/vto` preserves server-resolved catalogue requests and adds uploaded garment JPEG/PNG data URLs plus `garmentCategory: upper_body|full_body`. Mixed modes, invalid images, arbitrary URLs/paths and total JSON ≥4,000,000 bytes are rejected before provider work.
- Selfie is optional skin input; full-body person photo is VTO source. Upload/selection/navigation never generates a task. Explicit Generate only; one request in flight, stale responses ignored, no automatic regeneration.
- Catalogue metadata includes multiple occasion tags, style and candidate/live-reviewed/blocked state. Primary eligibility needs permission/provenance, matching photographic reference and visual review evidence. Candidate collection remains separately labelled.
- Own uploads retain user-confirmed metadata in page memory. Two recent results carry garment, source version and mock/live labels; refresh/leave can discard them. Comparison/reopening/image reload costs zero additional tasks. Share links restore catalogue choices, not person/result images.
- Seller metadata is separate from photo credits. Only verified exact-item HTTPS links with product/image-permission dates yield **View at seller**. No checkout, inventory, scraping, permanent wardrobe or new provider.

## Measurement and spend

Use [BENCHMARKS](../testing/BENCHMARKS.md) and [REAL_USER_VALIDATION](../testing/REAL_USER_VALIDATION.md). The evidence template has twelve proposed cases, zero outcomes and the dated 916-unit/2-unit V4 snapshot; proposed pseudonyms are not recruited participants. The pilot costs 12 units; the full scorecard costs 24, within the 687-unit development allowance. No spend is approved.

| Quality target | Required evidence |
|---|---|
| Rendered live task and identity ≥4/5 | At least 11/12 each across five consenting people; missing/failed attempts remain in denominator. |
| Garment ≥4/5 and both ratings ≥4/5 | At least 10/12 each; compare the exact reference and have the participant judge identity. No output is a failure. |
| Median displayed-result latency ≤60s | Record Generate-to-render timing; report failures and actual range separately. |
| Zero duplicate tasks | Count submissions; do not hide repeats by replacing records. |
| ≥4/5 independent completion and reason understanding/choice | Five distinct participants; median first Generate ≤60s with photos ready. |
| Device/accessibility | Real Android Chrome/iPhone Safari where available; 44px key controls, keyboard dialogs and no horizontal overflow. |

Existing credits only. Reserve 25%; development ceiling is **at most 40 VTO +5 optional skin tasks**, reduced to fit actual costs/units. The first six calls and later extension each need separate bounded authorization. Stop on 429.

## Fallback and source cutoff

By **24 Oct**, accept only source candidates with established reuse permission, matching reference and product identity. See [SOURCE_FEASIBILITY](../garment-library/SOURCE_FEASIBILITY.md). Without a credible seller collection, proceed with own clothes and honestly labelled references; seller links remain absent.

If pilot quality misses 5/6, pause collection expansion and inspect framing/compression/reference/category before further approved diagnostics. Do not mask drift with face swaps or introduce a new provider by default. If schedule slips, cut catalogue breadth and seller links before cutting own-clothes try-on, identity evaluation, recovery or usability checks.

The user has authorized scoped commits and pushes at meaningful verified checkpoints. Exclude secrets, machine-local settings, traces and private photos/results; verify the remote SHA after each push. Live calls, deployment and final external submission still require separate approval. This document does not mark future milestones complete.
