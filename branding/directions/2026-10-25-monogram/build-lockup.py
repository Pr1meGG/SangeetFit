#!/usr/bin/env python3
"""Compose the SangeetFit wordmark and lockups as outlined vectors.

Every letter is extracted from the app's Bodoni Moda face, so the wordmark is
real vector artwork rather than live text. "Fit" is leaned to read as italic
(the family ships a single 400 weight, so the oblique is synthesised, exactly
as the browser does it). The mark is the same face's S, leaned the other way so
it echoes the wordmark rather than competing with it.

Run after build-monogram.py:
    PYTHONPATH=/tmp/sf-fonttools python3 build-lockup.py
"""

from __future__ import annotations

import math
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

ROOT = Path(__file__).resolve().parents[3]
FONT = ROOT / "public" / "fonts" / "bodoni-moda" / "BodoniModa-Regular.ttf"

BURGUNDY = "#5B1730"
GOLD = "#B08D4F"
IVORY = "#F7F1E5"
MARIGOLD = "#E4A33C"

WORD = "SangeetFit"
ITALIC_FROM = 6  # index where "Fit" begins
TRACKING = -8  # font units, tightened for display
ITALIC_LEAN = 10.0  # synthesised oblique for "Fit"
WORD_SIZE = 100.0

DOT_R = 4.4
DOT_GAP = 11.0


def compose(font: TTFont, text: str, size: float, italic_from: int | None, lean: float) -> dict:
    """Outline `text` with the baseline at y=0, starting at x=0."""
    cmap = font.getBestCmap()
    glyphs = font.getGlyphSet()
    hmtx = font["hmtx"]
    s = size / font["head"].unitsPerEm

    commands: list[str] = []
    x = 0.0
    min_x = min_y = 1e9
    max_x = max_y = -1e9

    for i, ch in enumerate(text):
        name = cmap[ord(ch)]
        glyph = glyphs[name]
        tilt = lean if (italic_from is not None and i >= italic_from) else 0.0
        c = math.tan(math.radians(tilt)) * s

        pen = SVGPathPen(glyphs)
        glyph.draw(TransformPen(pen, (s, 0, c, -s, x, 0)))
        commands.append(pen.getCommands())

        bounds = BoundsPen(glyphs)
        glyph.draw(TransformPen(bounds, (s, 0, c, -s, x, 0)))
        if bounds.bounds:
            bx0, by0, bx1, by1 = bounds.bounds
            min_x, max_x = min(min_x, bx0), max(max_x, bx1)
            min_y, max_y = min(min_y, by0), max(max_y, by1)

        x += (hmtx[name][0] + TRACKING) * s

    return {
        "d": " ".join(commands),
        "min_x": min_x, "max_x": max_x, "min_y": min_y, "max_y": max_y,
        "advance": x,
    }


def main() -> None:
    here = Path(__file__).parent
    font = TTFont(FONT)

    word = compose(font, WORD, WORD_SIZE, ITALIC_FROM, ITALIC_LEAN)
    cap_height = -word["min_y"]  # baseline to cap top, output units

    pad = 6.0
    word_w = word["max_x"] - word["min_x"]
    word_h = word["max_y"] - word["min_y"]
    ox = -word["min_x"] + pad
    oy = pad + cap_height

    def svg(view_w: float, view_h: float, label: str, body: str) -> str:
        return (
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {view_w:.2f} {view_h:.2f}" '
            f'role="img" aria-label="{label}">\n  <title>{label}</title>\n{body}</svg>\n'
        )

    def word_group(dx: float, dy: float, fill: str) -> str:
        return f'<g transform="translate({dx:.2f} {dy:.2f})"><path d="{word["d"]}" fill="{fill}"/></g>'

    # --- wordmark, with the gold full stop inside the box ---
    dot_cx = ox + word["max_x"] + DOT_GAP
    wm_w = dot_cx + DOT_R + pad
    wm_h = word_h + pad * 2 + 6
    (here / "wordmark.svg").write_text(
        svg(wm_w, wm_h, "SangeetFit wordmark",
            f"  {word_group(ox, oy, BURGUNDY)}\n"
            f'  <circle cx="{dot_cx:.2f}" cy="{oy - 3:.2f}" r="{DOT_R}" fill="{GOLD}"/>\n')
    )

    # --- lockups: mark sits on the same baseline as the wordmark ---
    mark = compose(font, "S", 106.0, None, -6.0)
    mark_h = -mark["min_y"]
    mark_w = mark["max_x"] - mark["min_x"]
    gap = cap_height * 0.52
    word_dx = mark_w + gap

    for name, ink, jewel, label in (
        ("lockup.svg", BURGUNDY, GOLD, "SangeetFit logo"),
        ("lockup-ivory.svg", IVORY, MARIGOLD, "SangeetFit logo on burgundy"),
    ):
        lk_w = pad + mark_w + gap + word["max_x"] + DOT_GAP + DOT_R + pad
        top = max(mark_h, cap_height)
        lk_h = top + word["max_y"] + pad * 2

        body = (
            f'  <g transform="translate({pad - mark["min_x"]:.2f} {pad + top:.2f})">'
            f'<path d="{mark["d"]}" fill="{ink}"/></g>\n'
            f'  {word_group(pad + word_dx - word["min_x"], pad + top, ink)}\n'
            f'  <circle cx="{pad + word_dx - word["min_x"] + word["max_x"] + DOT_GAP:.2f}" '
            f'cy="{pad + top - 3:.2f}" r="{DOT_R}" fill="{jewel}"/>\n'
        )
        (here / name).write_text(svg(lk_w, lk_h, label, body))

    print(f"wordmark {wm_w:.1f} x {wm_h:.1f} · cap {cap_height:.1f} · lockup {lk_w:.1f} x {lk_h:.1f}")


if __name__ == "__main__":
    main()
