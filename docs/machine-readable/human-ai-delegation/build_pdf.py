"""PDF of the accepted manuscript of Affonso and Steyvers (2026), Trends in Cognitive Sciences,
https://doi.org/10.1016/j.tics.2026.10.007, for the PDF button on the Publications page.

Elsevier lets authors post the accepted manuscript on a personal homepage at once, with the line
"(c) YEAR. This manuscript version is made available under the CC-BY-NC-ND 4.0 license" and a link to
the published version by its DOI, and without making it look like the published version
(elsevier.com/about/policies-and-standards/sharing, read 2026-11-15). So the first page opens with a
notice that gives both, and the pages are plain: no journal logo, no journal layout.

Same sources as build.py (SUBMISSION_PACKAGE_R2). pandoc turns the three Word files into HTML, placed in
the order of the .md (Highlights after the title block, Outstanding Questions after Box 2); Chromium
prints it; PyMuPDF adds the two figures from their own PDFs (vector, at their own size) and a footer on
every page. Word was tried first and hung on the file (2026-11-15).

It refuses to write unless every paragraph of the three Word files appears word for word in the
printed text (the cells of the four-column Table 1 are checked word by word, because a PDF's text order
runs across the columns), and the license line and the DOI are on the first page.

Usage: python build_pdf.py <SUBMISSION_PACKAGE_R2 folder>
Writes public/files/papers/human-ai-delegation-accepted-manuscript.pdf.
"""
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import pymupdf
from playwright.sync_api import sync_playwright

sys.path.insert(0, str(Path(__file__).resolve().parent))
import build  # noqa: E402  the same pandoc, Word reader and comparison rule

OUT = build.REPO / "public" / "files" / "papers" / "human-ai-delegation-accepted-manuscript.pdf"
DOI_URL = "https://doi.org/" + build.DOI
LICENSE_URL = "https://creativecommons.org/licenses/by-nc-nd/4.0/"
LICENSE_LINE = f"© 2026. This manuscript version is made available under the CC-BY-NC-ND 4.0 license {LICENSE_URL}"

NOTICE = f"""<div class="notice">
<p><strong>Accepted manuscript.</strong> This is the authors' version of the article after peer review and
before copyediting and typesetting (TICS-D-26-00180R2, accepted October 20, 2026). The published version
of record is in <em>Trends in Cognitive Sciences</em>: <a href="{DOI_URL}">{DOI_URL}</a></p>
<p>{LICENSE_LINE.replace(LICENSE_URL, f'<a href="{LICENSE_URL}">{LICENSE_URL}</a>')}</p>
</div>"""

CSS = """
@page { size: Letter; margin: 1in 1in 1in 1in; }
html { font-family: "Times New Roman", Times, serif; font-size: 11.5pt; line-height: 1.5; color: #111; }
body { margin: 0; }
p { margin: 0 0 0.7em 0; text-align: left; }
h1 { font-size: 13pt; margin: 1.3em 0 0.5em; break-after: avoid; }
h2 { font-size: 12pt; font-style: italic; font-weight: bold; margin: 1.1em 0 0.4em; break-after: avoid; }
a { color: #1a4f8b; text-decoration: none; overflow-wrap: anywhere; }
ul { margin: 0 0 0.8em 1.2em; padding: 0; } li { margin: 0 0 0.4em 0; }
blockquote { margin: 0.4em 0 0.6em 1.2em; }
table { border-collapse: collapse; width: 100%; margin: 0.8em 0 1em; break-inside: auto; }
td, th { border: 1px solid #999; padding: 6px 8px; vertical-align: top; text-align: left; font-size: 10.5pt; line-height: 1.4; }
tr { break-inside: avoid; }
.notice { border: 1px solid #999; padding: 10px 14px; margin: 0 0 1.6em; font-size: 10pt; line-height: 1.45; background: #f6f6f6; }
.notice p { margin: 0 0 0.45em; } .notice p:last-child { margin: 0; }
td p { margin: 0 0 0.5em; } td p:last-child { margin-bottom: 0; }
.keep-together { break-inside: avoid; }
"""


def fix_boxes(html):
    """pandoc writes each paragraph of a box (a one-cell table in the Word file) as a bare line inside the
    cell, so they print run together; each line becomes its own paragraph."""
    def para(m):
        out = []
        for line in m.group(1).split("\n"):
            s = line.strip()
            if not s:
                continue
            out.append(s if s in ("<blockquote>", "</blockquote>") else f"<p>{s}</p>")
        return "<td>" + "\n".join(out) + "</td>"
    return re.sub(r"<td>(<strong>BOX .*?)</td>", para, html, flags=re.S)


def keep_table_with_caption(html):
    """Table 1's caption, the table and its note are kept on one page."""
    return re.sub(r"(<p><strong>Table 1\.</strong>.*?</p>\s*<table.*?</table>\s*<p><sup>a</sup>.*?</p>)",
                  r'<div class="keep-together">\1</div>', html, count=1, flags=re.S)


def html_of(path):
    return subprocess.run([build.PANDOC, str(path), "-t", "html5", "--wrap=none"], capture_output=True,
                          text=True, encoding="utf-8", check=True).stdout


def page_html(src):
    ms = build.correct(html_of(src / "Manuscript.docx"), "the HTML of Manuscript.docx")
    hl = html_of(src / "Highlights.docx")
    oq = html_of(src / "Outstanding_Questions.docx")
    a = ms.index("<p><strong>Abstract</strong></p>")
    g = ms.index('<h1 id="glossary">')
    body = keep_table_with_caption(fix_boxes(NOTICE + ms[:a] + hl + ms[a:g] + oq + ms[g:]))
    if body.count("<td><p><strong>BOX ") != 2 or 'class="keep-together"' not in body:
        raise SystemExit("the box or Table 1 layout fix did not apply; pandoc's HTML has changed")
    return f"<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><style>{CSS}</style></head><body>{body}</body></html>"


LIGS = {"ﬁ": "fi", "ﬂ": "fl", "ﬀ": "ff", "ﬃ": "ffi", "ﬄ": "ffl", "­": ""}


def pdf_text(path):
    doc = pymupdf.open(path)
    t = "\n".join(p.get_text() for p in doc)
    for k, v in LIGS.items():
        t = t.replace(k, v)
    return t, doc


def squeeze(s):
    """The comparison rule of build.py, with all spacing removed: the printer breaks long web addresses
    across lines, so a line break can fall inside a word. Every other character must match in order."""
    return re.sub(r"\s+", "", build.norm(s))


def check(text, first_page, units):
    plain = squeeze(text)
    words = set(build.norm(text).split())
    problems, word_checked = [], 0
    for name, t in units:
        if squeeze(t) in plain:
            continue
        if name == "Manuscript.docx table" and all(w in words for w in build.norm(t).split()):
            word_checked += 1  # a Table 1 cell: its words are all there; the column order differs in a PDF
            continue
        problems.append(f"not in the PDF ({name}): {t[:110]!r}")
    fp = squeeze(first_page)
    for need in (LICENSE_LINE, DOI_URL):
        if squeeze(need) not in fp:
            problems.append(f"first page lacks: {need}")
    return problems, word_checked


def main():
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    src = Path(sys.argv[1])
    units = build.docx_units(src)
    printed = Path(tempfile.mkdtemp(prefix="tics-pdf-")) / "printed.pdf"
    with sync_playwright() as p:
        br = p.chromium.launch()
        pg = br.new_page()
        pg.set_content(page_html(src), wait_until="load")
        pg.pdf(path=str(printed), format="Letter", print_background=True, prefer_css_page_size=True)
        br.close()
    text, doc = pdf_text(printed)
    problems, word_checked = check(text, doc[0].get_text(), units)
    if problems:
        doc.close()
        print(f"REFUSED: not written (the printed pages are in {printed})")
        for pr in problems:
            print("  " + pr)
        sys.exit(1)
    # the two figures, each on its own Letter page at its own size (6.5 inches wide), as vectors
    for n in (1, 2):
        fig = pymupdf.open(src / f"Figure_{n}.pdf")
        r = fig[0].rect
        page = doc.new_page(width=612, height=792)
        page.insert_text((72, 90), f"Figure {n}", fontname="tibo", fontsize=12)
        scale = min(1.0, 468 / r.width)
        page.show_pdf_page(pymupdf.Rect(72, 108, 72 + r.width * scale, 108 + r.height * scale), fig, 0)
    # a footer on every page, in the bottom margin
    total = len(doc)
    foot = f"Accepted manuscript. © 2026, CC-BY-NC-ND 4.0. Version of record: {DOI_URL}"
    for i, page in enumerate(doc):
        page.insert_text((72, 762), foot, fontname="helv", fontsize=7.5, color=(0.35, 0.35, 0.35))
        x0 = 72 + pymupdf.get_text_length(foot[:foot.index("https")], fontname="helv", fontsize=7.5)
        x1 = 72 + pymupdf.get_text_length(foot, fontname="helv", fontsize=7.5)
        page.insert_link({"kind": pymupdf.LINK_URI, "from": pymupdf.Rect(x0, 754, x1, 765), "uri": DOI_URL})
        num = f"{i + 1} of {total}"
        page.insert_text((540 - pymupdf.get_text_length(num, fontname="helv", fontsize=7.5), 762), num,
                         fontname="helv", fontsize=7.5, color=(0.35, 0.35, 0.35))
    doc.set_metadata({
        "title": "Interdependent conditions for successful human-AI delegation (accepted manuscript)",
        "author": "Felipe M. Affonso; Mark Steyvers",
        "subject": f"Accepted manuscript of Trends in Cognitive Sciences (2026), {DOI_URL}. {LICENSE_LINE}",
        "keywords": "human-AI collaboration, delegation, AI metacognition, calibrated uncertainty, complementarity, deskilling",
        "creator": "pandoc, Chromium, PyMuPDF (docs/machine-readable/human-ai-delegation/build_pdf.py)",
        "producer": "PyMuPDF",
    })
    doc.save(OUT, garbage=3, deflate=True)
    doc.close()
    print(f"wrote {OUT} ({total} pages, {OUT.stat().st_size // 1024} KB)")
    print(f"WORD IN PDF (refuses): {len(units)} of {len(units)} Word paragraphs and table cells "
          f"({word_checked} Table 1 cells word by word); license line and DOI on page 1")


if __name__ == "__main__":
    main()
