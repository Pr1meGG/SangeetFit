# SangeetFit — Product specification

Updated 20 October 2026. This document describes the approved product and current software contracts. Implementation presence is not evidence of live image quality; verification results belong in [PROJECT_STATE](agent-workflow/PROJECT_STATE.md).

## Product promise

Choose an outfit for an occasion from your own clothes or a curated collection, preview it on yourself, compare two looks and save your choice. When an exact seller product has been verified, optionally open its original listing.

The audience is ordinary wedding guests and bridal-party members. This is a personal dressing companion. Checkout, accounts, inventory, retailer scraping, face swapping and additional AI providers are outside this release.

## Experience

1. Choose Sangeet, Mehendi, Haldi, Wedding or Reception. Skin-tone analysis is optional and uses a separate face selfie.
2. Add a garment photograph and confirm its name, category, main colour, style level and occasion tags; or browse the reference collection.
3. Recommendations filter by occasion/audience and rank declared style preference, explicit colour match, then stable curated order. Reasons describe actual metadata. User uploads can always be tried manually outside their tags.
4. Open an outfit, review a separate front-facing full-body photo with a clearly visible face, understand live-provider processing, then explicitly press **Generate try-on**. Browsing, uploading, opening, comparing and image reload must never start generation.
5. View the whole result, toggle the original, retain two recent session looks, compare/zoom, choose a favourite and save/open its image. Results identify garment, live/mock mode and source-photo version; different source photos receive a comparison warning.
6. Catalogue outfit links share the selection and occasion, not a personal result. Own uploads have no public restore link. Refresh/leaving clears page-session clothes/results/choice. Provider-generated links can expire.

## Contracts and quality gates

### Images and VTO

Face selfie goes only to `/api/skin`. Person full-body image is the source for `/api/vto`; garment image is its reference. No person fixture or face selfie silently replaces the user's source.

`POST /api/vto` accepts one of two mutually exclusive JSON modes:

```ts
// Catalogue: server resolves identity and exact local reference.
{ fullBodyDataUrl, garmentId, referenceAsset, vtoSupported, displayImage? }
// Own garment: image bytes inside JPEG/PNG data URLs, never paths or remote URLs.
{ fullBodyDataUrl, garmentImageDataUrl, garmentCategory: "upper_body" | "full_body" }
```

Catalogue `displayImage` is not trusted as a reference. Unknown identity, mismatched reference, unsupported mapping, malformed image and mixed modes are rejected before provider work. Uploaded mode requires both images even in mock mode. Successful responses retain `{success:true,resultUrl,mode}`; catalogue mock responses also identify the server-owned display image.

The serialized JSON body must be **under 4,000,000 bytes**, with both images counted. Client preprocessing decodes actual JPEG/PNG, applies browser orientation through re-encoding, strips source metadata, preserves aspect ratio, flattens alpha onto white and never upscales. Separate person/garment budgets leave room for JSON. Server independently checks byte format, bounded dimensions and payload size. These checks do not establish sufficient face detail or garment suitability.

Full-outfit references should show a complete front-facing worn look; upper-body references should clearly show a single garment. Folded clothes, collages, cropped/obstructed details and side poses are not established as reliable. One request may be in flight, stale responses must not overwrite newer selection state, and there is no automatic regeneration. Stop after 429; further attempts need an approved diagnostic batch.

### Recommendation and catalogue metadata

`Outfit` adds `occasionTags[]`, `styleLevel: minimal|festive|statement`, `tryOnStatus: candidate|live-reviewed|blocked`, optional `origin: catalogue|upload` and separately verified seller metadata. `occasion` remains for existing IDs/links; original references are preserved.

- **Candidate:** a matching reference is wired; visual output quality is untested.
- **Live-reviewed:** exact reference, provenance/permission and at least one visual garment-output review are required for primary catalogue recommendations.
- **Blocked:** no acceptable mapping; not a primary recommendation.

All current wired references remain candidates; no catalogue item is promoted merely because a task returned success. Candidate testing is separated from the primary recommendations. A new session can therefore show no primary catalogue choices and should clearly offer **Add my outfit**, rather than recommend disabled cards.

Own garments use user-confirmed tags and can participate without pretending to be reviewed catalogue references. Explicit colour preference is an exact metadata colour match, not skin suitability. No fit/suitability percentages or generated-image-analysis claims.

Seller actions require an exact-item HTTPS URL, named seller and recorded product/image-permission verification dates. Image attribution URLs are not seller links. No verified seller products or seller partnerships currently exist.

## Evidence and release acceptance

[Milestones](plans/2026-10-20-personal-stylist-milestones.md), [benchmark protocol](testing/BENCHMARKS.md) and [five-person validation](testing/REAL_USER_VALIDATION.md) define the gates. The checked-in benchmark contains proposed cases and no outcomes.

Prior approved Cloth V4 tasks succeeded for one sample-person/maroon-lehenga pair, including one through a deployed preview. The output was not independently visually scored, so this proves a pipeline case, not identity preservation or broad reliability. Prior skin success is separate optional integration evidence.

Release needs fresh offline/API/browser checks, TypeScript, lint, production build, mobile overflow/keyboard checks, real Android Chrome/iPhone Safari evidence, budget reserve and accessible judging access. Physical-device/participant/live-quality checks remain pending; no current claim of guaranteed face retention, physical fit or production readiness.

Rules/deadline/access requirements must be rechecked against the [official hackathon rules](https://youcam-api-skin-ai-ecommerce.devpost.com/rules) before submission. Working targets are 1 November submission, 2 November buffer, and availability through 20 November; these are not fresh organizer verification.
