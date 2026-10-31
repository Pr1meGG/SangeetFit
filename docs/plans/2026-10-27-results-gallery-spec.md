# Spec: Persistent Day-Wise Results Gallery + AI-Only Catalogue

**Date:** 2026-10-27 **Status:** approved for build (brainstorm doc: 2026-10-27-results-gallery-brainstorm.md)

## Goal
Every generated look is auto-saved with 24h TTL (already true server-side) and is publicly browsable on `/results` grouped by calendar day, so judges see live activity. Catalogue shows only the 26 AI editorial concepts.

## Scope

### 1. Auto-saved API surface
- `GET /api/auto-saved` returns `{ results: [{ id, outfitLabel, mode, createdAt, expiresAt }] }` — metadata only, no inline image bytes (payload stays small).
- New: `GET /api/auto-saved?id=<uuid>&image=person|garment|result` returns that single image with its real MIME and `Cache-Control: private, max-age=300` (pattern: `/api/shared-results/[id]`). Invalid id/image → 404.

### 2. `/results` page redesign (public)
- Fetch `/api/auto-saved` on load; render grouped by local calendar day (Today / Yesterday / `<Mon D>`), newest first, `sf-*` token design:
  - Editorial heading block ("Generated looks" + explainer: each look lives 24h; outfit refs only, source photos stay private).
  - Cards: aspect-[3/4] result image (lazy), outfit label, `Live AI` / `Mock` chip, generated time + hours-remaining line.
  - Empty state consistent with home empty-state style.
- The password-gated shared-look UI moves out of `/results` (admin already has `/admin`); shared-results API and `/view/[id]` remain untouched.
- Accessibility: semantic day sections, alt text from outfit label, existing focus-visible tokens.

### 3. Catalogue cut (AI-only)
- Delete the inline 17-entry `CATALOG` array from `src/data/outfits.ts`; keep TRY_ON_REFERENCES, types, and editorial wiring.
- Remove `src/data/indian-wear.ts` + `indian-wear.json` and all imports; remove `public/garment_test/library/` assets (14 files) and `public/outfits/*.svg` (17 files).
- `TRY_ON_REFERENCES` becomes the editorial look references only (already under `garment_test/editorial/`).
- Update `tests/catalog-mapping.test.ts` (drop SVG/`haldi-01`/whitelist rows tied to removed ids), delete `tests/garment-library.test.ts`, reconcile `run-contract-tests.mjs` manifest.

### 4. Persistence (already satisfied server-side; no change)
- Redis `autosave:{id}:meta` EX 86400 + index ZADD (score=createdAt). List reads `-inf..now` (fixed earlier). Day grouping is display-time, not stored.

## Non-goals
- No new store, no favoriting, no consent toggle (auto-save is implicit per earlier decision), no per-visitor scoping.

## Acceptance criteria
1. Generate a look → appears on `/results` under Today within seconds, with correct image + label + mode chip.
2. `/api/auto-saved` metadata body stays small (<20 KB for ≤50 results).
3. Image endpoint returns 200 with image MIME for person/garment/result; 404 for unknown ids.
4. Catalogue grep: no `"/outfits/` and no `garment_test/library` references in `src/`.
5. `npm test` and `next build` green; prod deploy smoke passes.
6. Commit excludes `.env*` and consent-marked shared-results code; push to `origin codex/redesign-v2`.
