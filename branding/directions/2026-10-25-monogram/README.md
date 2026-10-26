# SangeetFit logo — bespoke S monogram

The mark is an **S in Bodoni Moda**, the face the app already uses for headings, leaned −6° and set beside one gold note. The wordmark is the same face, outlined into real vector paths, with *Fit* leaned to read as italic and a gold full stop closing it.

Everything here is self-contained vector artwork: no live text, no filters, no external references, no raster.

| File | What it is |
|---|---|
| `symbol.svg` | The mark, burgundy with a gold note — display weight |
| `symbol-ivory.svg` | The mark for burgundy surfaces, ivory with marigold note |
| `symbol-small.svg` | Optical cut for 16–32 px: same outline, thickened by a 2.6 stroke |
| `app-icon.svg` | Burgundy tile, ivory S, marigold note |
| `wordmark.svg` | Outlined "SangeetFit" with the gold full stop |
| `lockup.svg` | Mark plus wordmark, shared baseline |
| `lockup-ivory.svg` | The same lockup reversed for burgundy |
| `preview.png` | The sheet: mark, icon, wordmark, lockup, size proof, header |
| `preview.html` | Source for that sheet |
| `build-monogram.py` | Rebuilds the symbol and icon from the font |
| `build-lockup.py` | Rebuilds the wordmark and lockups from the font |

## Rebuilding

The scripts read the font from `public/fonts/bodoni-moda/BodoniModa-Regular.ttf` and need fonttools, installed outside the repository so it does not become a project dependency:

```sh
python3 -m pip install --target /tmp/sf-fonttools fonttools
cd branding/directions/2026-10-25-monogram
PYTHONPATH=/tmp/sf-fonttools python3 build-monogram.py
PYTHONPATH=/tmp/sf-fonttools python3 build-lockup.py
```

Then re-render the sheet with any headless browser, or open `preview.html` directly.

## Why this construction

- **One face, two roles.** The mark and the wordmark share Bodoni Moda, so the logo looks drawn rather than assembled. The mark's −6° lean echoes the italic in *Fit*.
- **Geometric sizing.** The mark is set 6% larger than the wordmark's cap height and sits on the same baseline; the gap is 0.52 × cap height. Those numbers are computed in `build-lockup.py`, not eyeballed.
- **Optical sizes.** A Didone hairline vanishes below about 24 px, so `symbol-small.svg` and the icon use the same outline thickened by a stroke rather than a squashed copy of the display cut.
- **One ornament.** The gold note appears once: beside the mark, as the full stop in the wordmark, and at the corner of the icon.

## Verified

- Rendered and inspected the sheet at working size: mark, reversed mark, icon, wordmark, lockup, header mock, and 88/56/40/32/24/16 px.
- All seven SVGs parse as XML, contain only paths, rectangles and circles, and include `role="img"`, `<title>` and an accessible name.

## Limits

- **Provenance:** the letterforms are outlines of Bodoni Moda (OFL). Using a glyph outline as a logo is permitted, but this is a customised typeface letter, not a bespoke drawing — which is exactly why it holds up. If the mark is formally adopted, confirm the OFL position for trademark registration with a lawyer.
- **The italic is synthesised** (a 10° skew), because the family ships a single 400 weight. A true italic cut would be softer in the *F* and *t*.
- **Not applied yet.** `public/brand/` and the navbar still serve the earlier disc mark; adopting this needs the header, favicon and app metadata changed and re-checked at 16/40 px and on a phone.
- No trademark clearance or similarity search has been done, and no one apart from the operator has looked at it.
