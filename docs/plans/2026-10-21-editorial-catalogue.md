# Model-led celebration collection — 21 October 2026

Goal: make the first catalogue screen feel like a coherent premium occasion lookbook while keeping the exact try-on reference, provenance and live-quality claims honest.

## Scope

- Add five original AI-generated, single-model full-outfit concepts (three women's, two men's) as local JPEGs under `public/garment_test/editorial/`. Each display image is its own VTO reference; no seller product or price is implied.
- Record generation provenance and file hashes in `src/data/editorial.ts`. Add the same assets to the server reference allowlist and outfit catalogue through `src/data/outfits.ts` and `src/app/api/vto/route.ts`.
- Show those five concepts first in `src/app/library/page.tsx`, with the existing 14 sourced photos available behind an archive control. Label concepts and unreviewed VTO quality. Update the home hero photos in `src/app/page.tsx` to match the new direction.
- Keep the existing consent, photo upload, explicit Generate action, candidate state and primary recommendation eligibility rules. No YouCam task, paid call or deployment is included.

## Acceptance and verification

- Every concept photo is a single unobstructed, front-facing person with the full intended garment visible; no photo is presented as a retail product or a verified live result.
- Default mobile collection shows a model-led look immediately and remains filterable. The archive can still be reached, and deep links use each concept's exact reference.
- Offline tests verify bytes, hashes, provenance, type/category, route allowlist and mock behaviour. Browser tests cover visible labels, archive access and zero implicit tasks.
- Run the ten existing offline suites plus the new concept suite, all four mock browser suites, TypeScript, lint, mock production build and `git diff --check`.

Risk: an attractive source image does not prove YouCam garment fidelity or face retention. These concepts remain candidates until bounded live results are visually reviewed. Generated faces are fictional and cannot stand in for a participant's personal VTO evaluation.
