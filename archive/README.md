# Local archive

Working material retired from the repository root on 25 October 2026. **The contents of this folder are gitignored**; only this index is tracked. Files remain on this machine and are not part of any clone, so they will not reach a judge or a new contributor.

Nothing here was deleted. If something turns out to matter, move it back and track it.

## `2026-10-branding/`

Every superseded brand generation and variant: three higgsfield rounds (`higgsfield-logo-2026-10-24`, `higgsfield-refined-2026-10-24`, `higgsfield-v4-tile-2026-10-24`), `premium-couture-2026-10-24`, the three-concept `logo-exploration-2026-10-25`, the earlier disc set (`logo-symbol-v1`…`v4`, `logo-clean-*`, `logo-stacked*`, `logo-horizontal*`, `logo-monochrome*`, `logo-on-light*`, `app-icon-v3`), the intermediate `symbol-v1`/`symbol-v2` renders from the current generation, `png/` exports, `build.py`, `preview.html` and the old `brand-guidelines.md` / `design-directions.md`.

The current identity is [`branding/identity/`](../branding/identity); see [the brand README](../branding/README.md).

## `2026-10-scratch/`

One-off or unreferenced scripts and files that no test, doc or build step points at:

- `get-logo.sh`, `logo.png`, `logo.svg` — logo fetching and its output.
- `ui-v2-smoke.mjs` — early UI-v2 smoke loop, superseded by `tests/ui-revamp.browser.test.mjs` and the rest of `tests/`.
- `sae-co-port.sh` — port helper, unreferenced.
- `git-status-check.diff` — a captured working-tree diff.

## `2026-10-screenshots/`

`vs-home.png`, `vs-home-small.png`, `vs-desktop.png`, `vs-desktop-small.png` — 23 October comparison captures produced while auditing the UI-v2 layout, plus `face-capture-ui.png` from 20 October. The verified evidence for that work lives with its records in [`docs/testing/`](../docs/testing); these are unlabelled working copies.

## Recovering something

```sh
mv archive/<folder>/<file> <destination>
git add <destination>
```

Confirm nothing still references the old path first: `grep -rn "<basename>" --include=*.md --include=*.ts --include=*.tsx .`
