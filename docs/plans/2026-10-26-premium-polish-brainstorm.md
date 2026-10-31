# Brainstorm — Premium typography & UI/UX polish for SangeetFit

**Date:** 2026-10-26 · **Status:** draft for user review
**Inputs:** agent-reach web research (editorial/luxury design systems), `docs/style-system.md` audit, `branding/premium-sangeetfit/`, current `globals.css`.

## What we are really building

SangeetFit already has the right bones: Bodoni Moda display serif, burgundy/ivory/night palette, pill navbar, dark editorial home. The gap to "premium" is not new features — it is **execution discipline + a small set of signature details** that read as luxury at first glance.

## MVP scope (v1 — one pass, CSS-first)

1. **Type discipline.** Kill the 20-size ladder to the defined 8-step scale (audit shows 25–30px all doing one job). Display serif stays ≥300-weight-feeling: light Bodoni, large, tight tracking; labels in tracked small caps (like The Cut's Chap and every reference found: `.1–.15em`, uppercase, 11px).
2. **Hairline rule system.** One recurring motif: fine 1px warm rules + `rule · small-caps · rule` section labels. Replace boxy card borders on feature/summary strips with hairlines and generous section rhythm (80–128px blocks).
3. **Shadow-over-border doctrine.** Surfaces separate with soft translucent shadows (`0 10px 34px rgba(107,30,58,.04)`), not opaque borders; borders reserved for gold active/focus states. (Already partly applied to diary/panels; extend everywhere.)
4. **Numbers as luxury signal.** Tabular numerals everywhere stats appear (audit found zero); large serif numerals for the week-board counts and step numbers.
5. **Micro-interactions, restrained.** 200ms ease-out only: button lift-and-return, growing underline on links, 2px arrow nudges, FAQ +/× rotation. Nothing springy.
6. **"(No) texture" finishing.** Optional single detail: ultra-faint SVG grain at ~3–5% multiply on the dark night sections only (Glowstack-style radial glow already exists). Skip if it dims text contrast.
7. **Signature assets already in repo** (use them, don't rebuild): `branding/premium-sangeetfit` lockups, kundan symbol; kundan-gold `#ebc879` as the single metallic accent — sparingly (focus rings, active states, one italic em per page).

## Non-goals (v1)

- No new fonts (Bodoni is the brand; "Luxury Magazine: Bodoni Moda + sans body" was the #1 pairing in research — keep it).
- No pricing/testimonials/lead-gen copy from Glowstack.
- No raster texture downloads; inline SVG only.
- No dark-mode inversion of tool surfaces.

## Verification

- `npm run verify` exit 0 (99 checks), `git diff --check` clean.
- Type-size census script over `src/` reports ≤ 10 distinct px sizes.
- Visual pass at 320/390/768/1440; keyboard focus visible everywhere with gold outline.

## Open questions

1. Texture grain on night sections: include or skip? *(recommended: include at 3%, one line of CSS to delete if it disappoints)*
2. Week-board stays dark-editorial (built earlier this session) or revert to light? *(recommended: keep dark — it's the signature section)*
3. Should the try-on dialog get the full treatment (serif header, hairlines) this pass or later? *(recommended: this pass — three CSS rules)*

## Highest-leverage ambition type

**Depth** — the audit already names the exact numeric deltas; executing the type-scale and hairline systems fully beats adding any new visual idea.
