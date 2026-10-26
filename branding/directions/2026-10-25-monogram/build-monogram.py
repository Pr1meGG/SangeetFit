#!/usr/bin/env python3
"""Build the SangeetFit S monogram from the outline of the app's own display face.

The mark is the "S" of Bodoni Moda (the face already used for headings), scaled
into a square field, given a slight italic lean, and paired with one gold jewel.
A bolder optical cut is produced for 16-32 px by stroking the same outline.

Requires fonttools (installed outside the repo):
    python3 -m pip install --target /tmp/sf-fonttools fonttools

Run:
    PYTHONPATH=/tmp/sf-fonttools python3 build-monogram.py
"""

from __future__ import annotations

import math
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[3]
FONT = ROOT / "public" / "fonts" / "bodoni-moda" / "BodoniModa-Regular.ttf"

BOX = 120.0
MARGIN = 9.0
LEAN_DEG = -6.0
BURGUNDY = "#5B1730"
GOLD = "#B08D4F"
IVORY = "#F7F1E5"
MARIGOLD = "#E4A33C"


def glyph_path(font: TTFont, char: str, scale: float, lean: float, offset: tuple[float, float]) -> tuple[str, dict]:
    cmap = font.getBestCmap()
    name = cmap[ord(char)]
    glyph_set = font.getGlyphSet()
    glyph = glyph_set[name]

    bounds = BoundsPen(glyph_set)
    glyph.draw(bounds)
    x_min, y_min, x_max, y_max = bounds.bounds

    # Fit the outline inside the box, then lean it about the optical centre.
    w, h = x_max - x_min, y_max - y_min
    s = min((BOX - 2 * MARGIN) / w, (BOX - 2 * MARGIN) / h) * scale
    ox = (BOX - w * s) / 2 - x_min * s + offset[0]
    oy = (BOX - h * s) / 2 + offset[1]
    k = y_max * s + oy  # unused except through the matrix below

    tan = math.tan(math.radians(lean))
    cy = BOX / 2
    # y' = -s*y + k ; x' = s*x + tan*(y' - cy) + ox
    a, b, c, d = s, 0.0, tan * s, -s
    e = ox - tan * (k - cy)
    f = k

    pen = SVGPathPen(glyph_set)
    glyph.draw(TransformPen(pen, (a, b, c, d, e, f)))
    return pen.getCommands(), {"s": s, "bounds": (x_min, y_min, x_max, y_max)}


def svg(path: str, fill: str, label: str, jewel: str | None, extra: str = "", note: str = "") -> str:
    jewel_svg = f'\n  <circle cx="96" cy="30.5" r="3.3" fill="{jewel}"/>' if jewel else ""
    stroke = f' stroke="{fill}" {extra}' if extra else ""
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" '
        f'aria-label="{label}">\n  <title>{label}</title>\n'
        f'  <path d="{path}" fill="{fill}"{stroke}/>{jewel_svg}\n'
        + (f"  <!-- {note} -->\n" if note else "")
        + "</svg>\n"
    )


def main() -> None:
    here = Path(__file__).parent
    font = TTFont(FONT)

    display, info = glyph_path(font, "S", 1.0, LEAN_DEG, (0, 0))
    # Optical cut: same outline, thickened with a same-colour stroke so the
    # hairline joins survive 16 px.
    small, _ = glyph_path(font, "S", 1.0, LEAN_DEG, (0, 0))

    print("scale", round(info["s"], 3), "bounds", [round(v, 1) for v in info["bounds"]])

    (here / "symbol.svg").write_text(
        svg(display, BURGUNDY, "SangeetFit symbol", GOLD, note="S outline from Bodoni Moda, leaned -6 degrees")
    )
    (here / "symbol-ivory.svg").write_text(
        svg(display, IVORY, "SangeetFit symbol on burgundy", MARIGOLD, note="ivory cut for burgundy surfaces")
    )
    (here / "symbol-small.svg").write_text(
        svg(small, BURGUNDY, "SangeetFit symbol, small size", GOLD,
            extra='stroke-width="2.6" stroke-linejoin="round"', note="optical cut for 16-32 px")
    )
    (here / "app-icon.svg").write_text(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="SangeetFit app icon">\n'
        "  <title>SangeetFit app icon</title>\n"
        '  <rect width="120" height="120" rx="26" fill="#5B1730"/>\n'
        f'  <path d="{small}" fill="{IVORY}" stroke="{IVORY}" stroke-width="2.6" stroke-linejoin="round"/>\n'
        f'  <circle cx="96" cy="30.5" r="3.3" fill="{MARIGOLD}"/>\n</svg>\n'
    )
    print("wrote symbol.svg, symbol-ivory.svg, symbol-small.svg, app-icon.svg")


if __name__ == "__main__":
    main()
