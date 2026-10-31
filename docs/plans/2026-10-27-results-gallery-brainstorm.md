# Brainstorm: Persistent Results Gallery & AI-Only Catalogue

**Date:** 2026-10-27

## Core

### What are you building?
A day-organized, public results gallery where every auto-saved VTO generation (personal photos) is browsable for its 24-hour TTL, a trimmed catalogue containing only the 26 AI-generated editorial concepts, and a redesigned `/results` page with clean editorial UI. Built for hackathon judges to see live activity at a glance.

**Project type:** customer-facing product (hackathon demo)

### MVP Features

- Persist auto-saves day-wise: every generation already lands in Redis with 24h TTL; extend `/api/auto-saved` to return compact metadata and serve per-result images from a dedicated image endpoint (pattern exists in `/api/shared-results/[id]`).
- `/results` redesign: public (no password gate), day-grouped sections (Today, Yesterday, …), clean result cards (image, outfit label, live/mock chip, time until expiry), graceful empty state, existing `sf-*` design system.
- Catalogue cut: remove the 17 SVG placeholder outfits and the 14 Wikimedia library entries; keep all 26 AI editorial concepts. Trim dependent tests.
- Push to GitHub (auto-save consent-marked code excluded per user instruction).

### Verification: Success and Proof

- **Success looks like:** judge opens `/results`, sees every generated look grouped by calendar day with clean cards, newest first; catalogue shows only AI outfit concepts.
- **How to verify:** `npm test` green; prod smoke: POST a generation → `/results` shows it under Today; grep confirms no SVG/Wikimedia outfit entries remain in catalog data.

## Optional

### Out of Scope
- Existing per-result sharing / WhatsApp flow (untouched)
- Visitor scoping or auth on the gallery (explicitly public for demo)

### Design & Style
- Reuse the app's existing design tokens (`--sf-*` vars), editorial heading style, `sf-button`/`sf-text-link` components; match the SangeetFit editorial cards already used on the home grid.

### Tech Stack
- Existing: Next.js 14, Upstash Redis, Tailwind + `sf-*` CSS. No new dependencies.

### Other Engineering Requirements
- 24h TTL unchanged; each card shows local-time generated time and hours remaining.
- Result images served same-origin, never raw public URLs (per-result image endpoint with correct MIME).

### Existing Context
- `src/app/api/auto-saved/route.ts` — current list endpoint returns full inline images; needs metadata-only listing + per-image route.
- `src/app/results/page.tsx` — today's password-gated shared-look page, to be redesigned.
- `src/lib/shared-results.ts` — autosave Redis store (index scoring fixed this session).
- `src/data/outfits.ts` / `indian-wear.ts` / `editorial.ts` — catalogue sources; `indian-wear.ts` and SVG entries go away.
- `tests/catalog-mapping.test.ts`, `tests/garment-library.test.ts` — reference removed entries; trim alongside.

### What Agents Should Ask You
- Check before pushing: `.env*` files and any consent-marked shared-results code (per user instruction, excluded).

### Open Questions and Next Step
- **Open questions:** None blocking.
- **Next step:** Write feature spec, assess blast radius, implement.
