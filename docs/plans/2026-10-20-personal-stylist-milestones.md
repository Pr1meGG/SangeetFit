# Personal occasion stylist — milestones and quality gates

Approved product direction, revised 21 October 2026 for one-person reference testing. Dates below are targets, not achievements. Assume 4–6 focused hours/day and timely photo/testing feedback. Preserve the existing warm festive UI.

**Goal for this release:** choose between celebration outfits already owned → occasion-based explanation → personal try-on of two looks → compare → choose/save. The wardrobe stays in the page session. Top-and-bottom combinations and everyday occasions are future work; seller links are optional only for verified exact items.

## Ordered delivery

| Milestone | Target date | Deliverable and acceptance gate | Current evidence |
|---|---|---|---|
| M0: preserve work + feasibility | 21 Oct | Audit the dirty branch, commit meaningful scoped checkpoints and push `codex/ui-revamp`; record actual credits/current applicable V4 pricing and select one consenting person and a suitable full-body photo. Reserve 25% of units. | Dated snapshot: 916 units, V4 2/call, optional colour analysis 20/call; reserve 229. A suitable source candidate is ready locally, but provider-processing consent and live-batch approval are pending; branch sync tracked in PROJECT_STATE. |
| M1: own-clothes software + reference pilot | 21–23 Oct | Own-clothes upload remains implemented but needs separate live proof. First run exactly two separately authorized men's catalogue tasks on one consenting full-body source: Emerald Silk Kurta and Sapphire Embroidered Sherwani. Review both for rendered output and identity/garment fidelity ≥4/5 before expanding. | Software implemented and locally verified; no new participant output, consent or batch approval recorded. |
| M2: useful reasons | 24–25 Oct | Filter occasion/audience; rank declared style, explicit colour, stable order; explain actual metadata. Own clothes participate with confirmed tags. | Pure ranking policy and offline regression implemented; integrated QA recorded separately. |
| M3: useful references + decisions | 25–29 Oct | Review permitted references used in testing; promote only accurate outputs with provenance. Two good reference alternatives suffice for the demo; 12 active references are a stretch target. Existing two-look comparison/choice stays central. | No visually reviewed catalogue references or verified seller products yet. Upload-first empty state is required. |
| M4: one-person reference sweep | 24–29 Oct | If the two-task pilot is usable, separately authorize the other 14 of 16 distinct men's catalogue references on the same full-body photo. Keep failed attempts and score the exact reference, face retention and latency. This is engineering evidence, not independent usability or own-clothes proof. | No outcomes entered; device and live-quality evidence pending. |
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

Use [BENCHMARKS](../testing/BENCHMARKS.md) and [REAL_USER_VALIDATION](../testing/REAL_USER_VALIDATION.md). The evidence template has 16 distinct men's reference cases for one reserved pseudonym and zero outcomes; a reserved ID is not consent. At the dated 916-unit/2-unit V4 snapshot, the two-task pilot would cost 4 units and all 16 tasks 32 units, within the then-calculated 687-unit development allowance. Recheck balance and price before testing. No spend is approved.

| Quality target | Required evidence |
|---|---|
| Rendered live task and identity ≥4/5 | At least 15/16 each for one person's fixed reference set; missing/failed attempts remain in denominator. |
| Garment ≥4/5 and both ratings ≥4/5 | At least 13/16 each; compare the exact reference and have the participant judge identity. No output is a failure. |
| Median displayed-result latency ≤60s | Record Generate-to-render timing; report failures and actual range separately. |
| Zero duplicate tasks | Count submissions; do not hide repeats by replacing records. |
| Independent usability | Not measured by a one-person builder test; do not claim it. Own-garment live quality also remains separate. |
| Device/accessibility | Real Android Chrome/iPhone Safari where available; 44px key controls, keyboard dialogs and no horizontal overflow. |

Existing credits only. Reserve 25%; development ceiling is **at most 40 VTO +5 optional skin tasks**, reduced to fit actual costs/units. The two pilot calls and the later 14-call extension each need separate bounded authorization. No selfie or skin task is planned for this sweep. Stop on 429.

## Fallback and source cutoff

By **24 Oct**, accept only source candidates with established reuse permission, matching reference and product identity. See [SOURCE_FEASIBILITY](../garment-library/SOURCE_FEASIBILITY.md). Without a credible seller collection, proceed with own clothes and honestly labelled references; seller links remain absent.

If either pilot look fails to render or scores below 4/5 on identity or garment fidelity, pause the sweep and inspect framing/compression/reference/category before further approved diagnostics. Do not mask drift with face swaps or introduce a new provider by default. If schedule slips, cut catalogue breadth and seller links before cutting own-clothes try-on, identity evaluation or recovery. Keep the participant's photo and generated results out of GitHub and the public demo.

The user has authorized scoped commits and pushes at meaningful verified checkpoints. Exclude secrets, machine-local settings, traces and private photos/results; verify the remote SHA after each push. Live calls, deployment and final external submission still require separate approval. This document does not mark future milestones complete.
