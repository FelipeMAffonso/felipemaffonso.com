"""Build the placeholder cover for the TiCS paper until its issue cover exists.

Felipe, 2026-10-20: the TiCS paper shows a Trends in Cognitive Sciences card
in the style of the journal's own square logo tile, with the Cell Press logo
at the top in the same blue. GitHub issue #3 replaces it with the real cover.
The book chapters get no placeholder ("for them it's just the pixel art"):
their slot shows the story alone (cover.storyOnly in lib/publications.tsx).

  python scripts/build-placeholder-covers.py

Sources in scripts/cover-sources/:
  cellpress-logo-2022.png   the 2022 Cell Press logo (findvectorlogo.com),
                            blue on white; recolored to white here
  tics-wordmark-cell.svg    Cell's own TiCS wordmark (cell.com paywall SVG);
                            its text groups are reused as vector shapes

Writes public/images/covers/tics-placeholder.svg.
"""

import base64
import io
import os
import re
import sys

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(HERE)
SRC = os.path.join(HERE, "cover-sources")
OUT = os.path.join(SITE, "public", "images", "covers")

TICS_BLUE = "#047dbc"  # the fill in Cell's own TiCS wordmark file
MARGIN = 64


def white_logo_png():
    """The Cell Press logo as white on transparent, cropped to its marks."""
    im = Image.open(os.path.join(SRC, "cellpress-logo-2022.png")).convert("RGB")
    red = im.getchannel("R")
    rmin = red.getextrema()[0]
    alpha = red.point(lambda r: max(0, min(255, round((255 - r) * 255 / (255 - rmin)))))
    out = Image.new("RGBA", im.size, (255, 255, 255, 0))
    out.putalpha(alpha)
    out = out.crop(alpha.point(lambda a: 255 if a > 8 else 0).getbbox())
    buf = io.BytesIO()
    out.save(buf, "PNG", optimize=True)
    return buf.getvalue(), out.size


def wordmark_groups():
    """The three text groups of Cell's TiCS wordmark, without the logo mark."""
    svg = open(os.path.join(SRC, "tics-wordmark-cell.svg"), encoding="utf-8").read()
    groups = []
    for gid in ("Trends_in", "Cognitive_sciences", "A_cell_press_journal"):
        start = svg.find('<g id="%s"' % gid)
        if start < 0:
            sys.exit("group %s not found in tics-wordmark-cell.svg" % gid)
        # walk to the matching </g>; one group nests another <g>
        depth, i = 0, start
        for m in re.finditer(r"<g[\s>]|</g>", svg[start:]):
            depth += -1 if m.group(0) == "</g>" else 1
            if depth == 0:
                i = start + m.end()
                break
        groups.append(svg[start:i].replace(' class="cls-1"', ""))
    return "\n".join(groups)


def measure(groups):
    """Bounding box of the wordmark text, measured by a real browser."""
    from playwright.sync_api import sync_playwright
    page_svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 97.83074 42">'
                '<g id="m">%s</g></svg>' % groups)
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page()
        pg.set_content(page_svg)
        box = pg.evaluate("() => { const r = document.getElementById('m').getBBox();"
                          " return [r.x, r.y, r.width, r.height]; }")
        b.close()
    return box


def tics_card():
    w, h = 760, 1000
    png, (lw, lh) = white_logo_png()
    logo_w = 300
    logo_h = round(logo_w * lh / lw)
    groups = wordmark_groups()
    bx, by, bw, bh = measure(groups)
    s = (w - 2 * MARGIN) / bw
    top = MARGIN + logo_h
    ty = top + ((h - top) - bh * s) / 2 - by * s
    tx = MARGIN - bx * s
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" width="%d" height="%d" viewBox="0 0 %d %d">\n'
        '<rect width="%d" height="%d" fill="%s"/>\n'
        '<image x="%d" y="%d" width="%d" height="%d" href="data:image/png;base64,%s"/>\n'
        '<g fill="#ffffff" transform="translate(%.2f %.2f) scale(%.4f)">\n%s\n</g>\n'
        '</svg>\n'
        % (w, h, w, h, w, h, TICS_BLUE, MARGIN, MARGIN, logo_w, logo_h,
           base64.b64encode(png).decode("ascii"), tx, ty, s, groups))


def main():
    os.makedirs(OUT, exist_ok=True)
    files = {
        "tics-placeholder.svg": tics_card(),
    }
    for name, svg in files.items():
        path = os.path.join(OUT, name)
        with open(path, "w", encoding="utf-8", newline="\n") as f:
            f.write(svg)
        print("wrote %s (%d KB)" % (os.path.relpath(path, SITE), len(svg) // 1024))


if __name__ == "__main__":
    main()
