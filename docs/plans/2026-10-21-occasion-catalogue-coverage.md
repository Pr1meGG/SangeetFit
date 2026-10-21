# Occasion catalogue coverage — 21 October 2026

## Goal and scope

Show at least five women's and five men's model-led outfit concepts for each of Sangeet, Mehendi, Haldi, Wedding and Reception. A distinct outfit may serve two genuinely suitable occasions. This creates 50 browse slots from 26 distinct concepts: the five existing concepts plus 21 new ones. Concepts remain candidate try-on references until a live result is visually reviewed; this work does not authorize YouCam tasks or promote candidates into primary recommendations.

## Existing coverage and required additions

| Occasion | Women now | Men now | Target each |
|---|---:|---:|---:|
| Sangeet | 1 | 1 | 5 |
| Mehendi | 1 | 1 | 5 |
| Haldi | 1 | 0 | 5 |
| Wedding | 1 | 1 | 5 |
| Reception | 2 | 1 | 5 |

Create ten women's concepts: three Mehendi/Haldi (mint floral anarkali, saffron sharara, pistachio lehenga), two Sangeet/Wedding (gold tissue saree, royal-blue lehenga), two Sangeet/Reception (berry velvet lehenga, champagne saree), one Mehendi/Wedding (emerald silk saree), one Haldi/Wedding (marigold organza saree), one Reception (silver evening saree).

Create eleven men's concepts: four Mehendi/Haldi (mint kurta, saffron kurta, marigold jacket set, sage embroidered kurta), one Haldi/Wedding (ivory-gold kurta), two Sangeet/Wedding (sapphire sherwani, cream embroidered bandhgala), two Sangeet/Reception (navy velvet bandhgala, plum brocade sherwani), one Wedding/Reception (antique-gold sherwani), one Reception (charcoal bandhgala).

## Implementation

- Generate each new asset separately as a front-facing, head-to-toe portrait of one fictional adult model wearing one fully visible outfit, with a clean editorial backdrop. Preserve distinct garments, faces and skin tones; no brand marks or seller claims. Save selected compressed JPEGs under `public/garment_test/editorial/` without overwriting the five existing files.
- Add metadata, exact display/reference path and SHA-256 provenance in `src/data/editorial.ts`. Existing `src/data/outfits.ts` and `src/app/api/vto/route.ts` derive their reference lists from this array; inspect but change only if a validation failure shows a gap.
- In `src/app/library/page.tsx`, make occasion/audience browsing and counts legible at phone width, and replace stale five-look copy. Keep the sourced archive separate and searchable. Do not mark any concept live-reviewed or attach seller links.
- Extend `tests/editorial-looks.test.ts` for uniqueness, exact assets/hashes and a 5×2 coverage matrix. Extend `tests/garment-library.browser.test.mjs` for visible occasion/audience counts and one explicit concept try-on; maintain exact reference and one-task assertions.
- Update `docs/garment-library/README.md`, `docs/agent-workflow/TASK_BOARD.md`, and `PROJECT_STATE.md` with actual verified counts and remaining live-quality gate.

## Acceptance and verification

Every occasion/audience filter displays at least five distinct model-led cards, without counting archived sourced photos. Each concept image is a decodable full-body portrait, corresponds to its server-owned reference, and has recorded hash/provenance. No browse action submits a VTO task. Run all offline suites, four mock browser suites, TypeScript, lint, `MOCK_MODE=true npm run build`, and `git diff --check`; visually inspect phone and desktop layouts. Commit the verified checkpoint and push `codex/ui-revamp`, excluding unrelated local settings and branding. Live YouCam fidelity, person identity and phone hardware remain separate gates.

## Risk and fallback

Generated outfit references may look attractive yet transfer poorly. Keep candidate/unreviewed labels and avoid face-preservation claims. If a generated image has cropped clothing, more than one person, garbled anatomy or indistinct garment boundaries, regenerate that asset before registering it. Do not pad counts with a low-quality or implausibly tagged look.
