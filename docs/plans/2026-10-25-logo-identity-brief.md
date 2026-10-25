# SangeetFit logo identity brief

## Outcome

Create a recognisable mark for an Indian-wedding wardrobe planner that helps people choose, rewear, and try outfits across five celebrations. The logo should feel like a fashion product with useful technology behind it, without suggesting that a person's body or skin tone needs judging.

## Ambition pass

- **Altitude:** Make SangeetFit recognisable at the moments people actually encounter it: the app header, a 16 px favicon, a phone icon, and a shared image. The identity should cover the whole wedding wardrobe, not only the sangeet event.
- **Depth:** Use identity-design checks: a clear silhouette, one-colour and reversed variants, 16/32/40 px renders, optical balance, and an outlined wordmark. Inspect actual pixels before calling the mark finished.
- **Range:** Balance Indian-celebration colour, editorial fashion typography, inclusive product language, accessibility, and similarity risk. Avoid couples, body silhouettes, hangers, mandalas, diyas, glitter, gradients, and generic AI symbols.
- **Speed:** Refine the existing marigold-disc and fabric-sweep direction, reuse the app's Bodoni Moda font and burgundy/ivory palette, and keep all work local. **Depth changes the result most:** the previous initial-only concepts read clearly but did not express the product strongly enough.

## Design decision

The mark is a single celebration disc opened by a broad S-shaped fabric fold. The disc carries the marigold association; the cut carries personal styling and reuse across occasions. The cut should be a real transparent opening with consistent weight, not a painted white line or a shaded effect. Pair it with a calm, outlined **SangeetFit** wordmark in the app's existing display face. Use burgundy on light backgrounds for visibility, and a marigold symbol with an ivory wordmark on burgundy.

The earlier three-concept comparison (`sangeetfit-concepts.png`, since retired to the local `archive/2026-10-branding/logo-exploration-2026-10-25/` folder) tested an S, an SF monogram, and an abstract fold. The standalone S felt too generic, the SF had a crowded centre, and the abstract fold needed explanation. The established disc is a stronger base, but its current variants use shading or leave a narrow sliver at the edge; redraw that geometry.

## First deliverable and proof

- Editable, self-contained SVG symbol and horizontal lockups for light and dark surfaces; a square app tile and practical PNG sizes.
- The symbol holds its opening at 16 px and has a stable silhouette at the app's 40 px header size.
- All SVGs parse, have accessible names, use flat fills and outlined lettering, and contain no external images, filters, masks, or live text.
- Render and inspect light, dark, monochrome, favicon, and app-icon contexts. Run the local SVG audit. Record any visual limitations honestly.

## Change impact

This pass writes a new source folder under `branding/`. The current app reads `/brand/logo-symbol.svg` in `src/components/Navbar.tsx` and `/brand/app-icon.svg` in `src/app/layout.tsx`; those files and their callers stay untouched. Replacing them later would change the visible header and browser/app icons, so it needs a separate visual check at 16, 40, and phone sizes. No API, data, deployment, or paid-provider contract is involved.

## Open checks

- Legal trademark clearance and a broad visual-similarity search require separate review before formal adoption.
- Real device rendering and user preference are not established by local previews.

## Verification performed

- Rendered and inspected the [identity board](../../branding/identity/proof/identity-board.png), a 512 px app tile, a 16 px app icon, and the 16 px standalone symbol.
- The local SVG audit found no issues in the symbol or app icon. It flagged the outlined Bodoni wordmark as complex and the horizontal lockups as extra wide; the deliverable therefore includes a stacked lockup and symbol-only variants.
- Measured local contrast ratios of 10.63:1 for burgundy on the app's paper background and 5.13:1 for marigold on burgundy. Marigold on paper measured 2.07:1, which is why the light-surface mark uses burgundy.
- Parsed the final SVGs and verified their embedded paths, accessible names, and self-contained vector content. No paid image call, app replacement, or deployment was involved.
