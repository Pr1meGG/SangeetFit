# Skin-tone archive verification — 2 November 2026

Skin-tone analysis was archived with user approval. The preceding planning/PDF
archive remains intact. Own garment upload, shortlist, full-body VTO, result
comparison and saving remain the active journey.

## Changes

- Active page has no skin/selfie/camera state, analysis handler or palette UI.
  Occasion cards go directly to outfits. Legacy `step=2` resolves to the gallery;
  `skin` query data no longer changes the preferred colour.
- Manual preferred-colour/style filters and outfit ranking remain unchanged.
- Active `POST /api/skin` returns private/no-store HTTP410 without reading the
  request body, checking credentials, reserving budget or contacting a provider.
- Original skin handler matches the tracked source byte for byte and is retained
  only under `docs/archive/skin-tone/route.ts`. Archived provider contracts remain
  explicitly labelled in offline tests. Camera/palette code and old browser test
  source are preserved for later restoration.

## Verification

- `TEST_PORT=3597 npm run verify` passed 19 enumerated offline suites, typecheck,
  lint (0 errors/21 warnings) and production build. Two real-Redis suites skipped
  locally. The first browser run stopped on an incorrect test selector.
- Root cause: an implicit label included its option text; exact `getByLabel`
  failed although the Preferred colour combobox was present. The test now uses
  the accessible combobox role/name, with all assertions preserved.
- Primary reran the focused camera-archive regression successfully against the
  final local mock build. Final `TEST_PORT=3597 npm run test:browser` rerun exited 0: all 13 mock browser suites passed.
- Independent React, TS/test and feature/API reviews found no actionable issues.
- Brave local mock inspection: legacy step2 opens outfits, no selfie input or
  analysis button, manual colour preference remains. Local HTTP check confirms
  malformed JSON still returns private410 without parsing the photo body.
- No VTO route, shared budget, styling or persistence implementation changed.
  No provider request, credit mutation, commit, push or deployment performed.

Production and physical-device/live-generation behavior are not newly verified.
