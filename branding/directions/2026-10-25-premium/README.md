# Premium direction round — 25 October 2026

Four directions for a quieter, more couture identity than the celebration disc. Design intent: high-contrast Didone lettering, hairline drawing, and a single gold note as the only ornament. No enclosing disc, no paisley cliché, no gradient, no body silhouette.

| File | What it is |
|---|---|
| `board.png` | The four directions with rationale, palette and a 44/32/22/14 px size proof |
| `board.html` | Editable source for the board (local Bodoni Moda, absolute font path) |
| `in-context.png` | Header and share-card mock at real reading size, plus 16 px favicons |
| `in-context.html` | Editable source for that mock |
| `mark-dupatta.svg` | Standalone self-contained drape mark |
| `mark-kundan.svg` | Standalone self-contained marquise mark |

## The directions

**I · Atelier** — the letter S in Bodoni at full Didone contrast, with a gold full stop beside it. Nothing encloses it. Behaves like a fashion-house monogram: strong alone, quiet next to the wordmark. Weakness: it is a typeface letter, not a bespoke drawing, so it carries little ownable character.

**II · Dupatta** — one hairline at a slight italic that falls like fabric from a shoulder and resolves into an S. Closest to the product story and the most feminine of the four. Weakness: a monoline sits lighter than the high-contrast wordmark beside it, and at 16 px it becomes a squiggle.

**III · Kundan** — the silhouette of a kundan stone: a marquise with a concentric hairline bezel and one gold seed. Reads as jewellery rather than signage, and holds its shape at small sizes. Weakness: it says "gem", not "wardrobe", and needs the wordmark to explain the product.

**IV · Maison** — no symbol at all. The name in the display face, a gold full stop, hairline rules and letterspaced small caps, the way a couture label is printed. The most premium of the four in place, and the least distinctive if someone only sees the icon.

Shared signature: **one gold full stop**. It appears in I and IV as the mark itself, and in II as the note where the fold begins.

## Palette

Burgundy `#5B1730` · gold `#B08D4F` · blush `#E3CFC7` · paper `#FBF7F1`. Burgundy on paper measures well above 7:1; gold is used only for dots and one full stop, never for text.

## Verified

- Rendered and visually inspected all four directions, the size proof at 44/32/22/14 px, real-size headers, the share card, and 16 px favicons. Six iterations on the drawn geometry; the first drape read as a C and the first paisley as a spiral, and both were redrawn.
- Both standalone SVGs parse as XML and contain only flat fills, strokes and embedded geometry — no filters, masks, external references or live text.

## Limits

- **The wordmarks are live text in Bodoni Moda, not outlined paths.** They look correct here because the font is loaded, but they are not production assets. Outlining (and licensing confirmation for a public mark) is still required.
- The italic **Fit** is synthesised oblique from the single-weight 400 file the app ships; a real italic cut would be softer.
- No trademark clearance or similarity search has been done, and these marks have not been tested with anyone but the operator.
- Nothing in the app has changed. `public/brand/` and the header still show the older disc mark.
- The 16 px row is honest about the trade-off: the type-based monograms stay legible, the hairline marks do not.
