# SangeetFit brand sources

The canonical identity lives in [`identity/`](identity). It is the celebration disc opened by one broad S-shaped fabric fold, paired with an outlined **SangeetFit** wordmark in the app's display face.

Current generation: **25 October 2026 redraw** ([brief](../docs/plans/2026-10-25-logo-identity-brief.md), [identity board](identity/proof/identity-board.png)).

## What is here

| File | Use |
|---|---|
| `identity/symbol.svg` | Standalone symbol on light surfaces |
| `identity/symbol-on-dark.svg` | Standalone symbol on burgundy surfaces |
| `identity/symbol-mono.svg` | Single-ink version for print and stamps |
| `identity/wordmark.svg` | Outlined "SangeetFit" lettering, no live text |
| `identity/lockup-light.svg` | Symbol plus wordmark, horizontal, light surfaces |
| `identity/lockup-dark.svg` | Symbol plus wordmark, horizontal, burgundy surfaces |
| `identity/stacked-light.svg` | Stacked lockup where width is constrained |
| `identity/app-icon.svg` | Square app tile: burgundy field, marigold disc |
| `identity/favicon.ico` | Multi-size browser icon |
| `identity/exports/` | PNG renders: app icons 16/192/512, symbol 16/512, lockups at 1400 px wide |
| `identity/proof/` | Rendered identity board used for visual review |

All SVGs are self-contained: flat fills, embedded paths, no filters, masks, external references or live text, each with `role="img"`, `<title>` and an accessible name.

## Palette

| Token | Hex | Role |
|---|---|---|
| Burgundy | `#6B1E3A` | Symbol on light surfaces, app tile, dark backgrounds |
| Marigold | `#E4A33C` | Disc fill on dark surfaces, celebration accent |
| Ivory | `#F7F1E5` | Wordmark on burgundy |
| Charcoal | `#1A1216` | Wordmark and cut on light surfaces |

Measured contrast, from the 25 October review: burgundy on the app's paper background 10.63:1, marigold on burgundy 5.13:1, marigold on paper 2.07:1. The light-surface mark therefore uses burgundy, never marigold.

## Integration status

The running app does **not** read this folder yet. It serves the previous disc mark from [`public/brand/`](../public/brand) (`logo-symbol.svg` used by the navbar, `app-icon.svg` by the app metadata). The two sets have drifted.

Adopting the 25 October identity means copying the chosen files into `public/brand/` and re-checking the header at 40 px, the tab icon at 16 px and a phone viewport. That is a visible change to every page and needs its own review; it is deliberately not part of this organisation pass.

Do not hand-edit `public/brand/`; treat `branding/identity/` as the source and copy from it.

## History

Superseded directions — three higgsfield generations, premium-couture, the three-concept exploration, the earlier disc variants (`logo-symbol-v1`/`v2`/`v3`/`v4`, `logo-clean-*`, `logo-stacked*`, `logo-monochrome*`, `logo-on-light*`), the old `brand-guidelines.md` and `design-directions.md`, and `build.py` — are kept out of Git under `archive/2026-10-branding/`. See [the archive index](../archive/README.md).

## Limits

- Legal trademark clearance and a broad similarity search have not been done.
- Real-device rendering and user preference are not established; review so far is local raster inspection.
- The wordmark is outlined Bodoni, which a local SVG audit flags as visually complex at small sizes. Below roughly 20 px, use the symbol alone.
