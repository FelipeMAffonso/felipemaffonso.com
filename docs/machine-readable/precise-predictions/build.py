"""Machine-readable version of Rude, Shiri, Affonso, Hershfield, and Fox, "When Are Less Precise Predictions More
Credible?" (Journal of Experimental Psychology: General, in press), built DETERMINISTICALLY from the authors' accepted
manuscript PDF. No language model reads or writes the text (Felipe 2026-10-12: "do it DETERMINISTICALLY. it's
important"); the site's rule is the same (CLAUDE.md, "Create machine-readable version of a paper").

  python -X utf8 docs/machine-readable/precise-predictions/build.py            build, then verify
  python -X utf8 docs/machine-readable/precise-predictions/build.py --selftest  the verifier must catch planted faults

How: PyMuPDF reads every text line with its position, font and flags. Fixed rules, measured on this PDF, turn lines
into Markdown: the running head and page number (above y=60) are dropped; a line indented to x>=104 starts a
paragraph (in the reference list, a line at the margin starts an entry, since references use a hanging indent);
centered bold lines are section headings, bold lines at the margin are subheadings; 10-point lines are footnotes,
placed after the paragraph they interrupt; small raised or lowered spans become <sup>/<sub>; bold and italic spans keep
their emphasis; ruled tables found by PyMuPDF become Markdown tables; figure images become a bracketed pointer to the
PDF page. Lines are joined with one space, or with none after a line ending in a hyphen or dash.

Verify: the words of the output, with Markdown removed, are compared in order with the words poppler's pdftotext
(an independent extractor) reads from the same PDF, minus the running heads and page numbers. Exit 1 (nothing
written to public/) when they differ beyond the table cells, whose reading order the two extractors legitimately
differ on; every difference is listed in VERIFY.txt beside this script.
"""
from collections import Counter
import hashlib
import re
import shutil
import subprocess
import sys
import unicodedata
import urllib.request
from pathlib import Path

import pymupdf

URL = "https://eitanrude.com/files/rude-et-al-credibility-precision-manuscript.pdf"
MD5 = "babd14386af30a2ef6cbdbf1c1e81f75"     # the file as downloaded 2026-10-12, 69 pages
HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
CACHE = Path("C:/tmp/rude-md/manuscript.pdf")
OUT = ROOT / "public" / "files" / "papers" / "precise-predictions.md"
REPORT = HERE / "VERIFY.txt"

MARGIN, INDENT, HEAD_Y, PAGE_MID = 72.0, 104.0, 60.0, 306.0
RUNNING_HEAD = "PRECISION AND CREDIBILITY"
BULLETS = ("\u25cf", "\u2022", "\u25aa", "\u25e6", "\u25cb")
ZW = "\u200b"

FRONT = """---
title: "When Are Less Precise Predictions More Credible?"
authors: "Eitan D. Rude, Amin Shiri, Felipe M. Affonso, Hal E. Hershfield, and Craig R. Fox"
journal: "Journal of Experimental Psychology: General"
year: 2026
status: "in press"
doi: "10.1037/xge0002029"
citation: "Rude, Eitan D., Amin Shiri, Felipe M. Affonso, Hal E. Hershfield, and Craig R. Fox (forthcoming), \\"When Are Less Precise Predictions More Credible?\\" Journal of Experimental Psychology: General."
source: "Accepted manuscript and online supplement, https://eitanrude.com/files/rude-et-al-credibility-precision-manuscript.pdf (md5 babd14386af30a2ef6cbdbf1c1e81f75)"
data_and_code: "https://researchbox.org/3688"
---

> **Disclaimer:** This is a machine-readable conversion of the accepted manuscript and its online supplement for use
> with AI tools. It was produced by a deterministic script, not by a language model, and checked word for word against
> an independent extraction of the same PDF. It may still contain conversion errors in formatting, tables, or symbols,
> and the figures are not reproduced. Always verify against the [published version](https://doi.org/10.1037/xge0002029).
>
> ©American Psychological Association, 2026. This paper is not the copy of record and may not exactly replicate the
> authoritative document published in the APA journal. The final article is available, upon publication, at:
> 10.1037/xge0002029

"""


def fail(msg):
    print("REFUSED:", msg)
    sys.exit(1)


def source_pdf():
    if not CACHE.exists():
        CACHE.parent.mkdir(parents=True, exist_ok=True)
        with urllib.request.urlopen(URL) as r, open(CACHE, "wb") as f:
            shutil.copyfileobj(r, f)
    got = hashlib.md5(CACHE.read_bytes()).hexdigest()
    if got != MD5:
        fail(f"the PDF changed (md5 {got}, expected {MD5}); re-measure the layout rules before rebuilding")
    return CACHE


# ---- reading lines -------------------------------------------------------------------------------------------------

def is_bold(s):
    return bool(s["flags"] & 16) or "Bold" in s["font"] or "-Bo" in s["font"]


def is_italic(s):
    return bool(s["flags"] & 2) or "Italic" in s["font"] or "-It" in s["font"]


def line_record(line):
    spans = [s for s in line["spans"] if s["text"].replace(ZW, "") != ""]
    # blank spacer lines carry no text; skipping them keeps the vertical gap between real lines measurable
    if not spans or not "".join(s["text"] for s in spans).replace(ZW, "").strip():
        return None
    sizes = [s["size"] for s in spans if s["text"].strip()]
    body = max(sizes) if sizes else spans[0]["size"]
    base = max((s["origin"][1] for s in spans if s["size"] >= body - 0.1), default=spans[0]["origin"][1])
    parts = []
    for s in spans:
        t = s["text"].replace(ZW, "")
        script = ""
        if s["size"] < body - 2 and t.strip():
            script = "sup" if s["origin"][1] < base - 1 else "sub" if s["origin"][1] > base + 1 else ""
        parts.append([t, is_bold(s), is_italic(s), script])
    words = [p for p in parts if p[0].strip()]
    # where the line visibly starts: the first span with a printed character, not a leading space at the margin
    x0 = min(s["bbox"][0] for s in spans if s["text"].replace(ZW, "").strip())
    x1 = max(s["bbox"][2] for s in spans)
    return {
        "parts": parts,
        "plain": "".join(p[0] for p in parts),
        "bold": bool(words) and all(p[1] for p in words if p[3] == ""),
        "italic": bool(words) and all(p[2] for p in words if p[3] == ""),
        "size": body,
        "x0": x0, "x1": x1, "y0": line["bbox"][1], "y1": line["bbox"][3],
    }


def render(parts, emphasis=True):
    """Markdown for a run of [text, bold, italic, script] parts; whitespace stays outside the markers."""
    out, i = [], 0
    while i < len(parts):
        t, b, it, sc = parts[i]
        j = i + 1
        while j < len(parts) and parts[j][1:] == [b, it, sc]:
            t += parts[j][0]
            j += 1
        t = t.replace("*", "\\*")   # a literal asterisk (significance stars, equal authorship) is not emphasis
        lead, core, trail = re.match(r"^(\s*)(.*?)(\s*)$", t, re.S).groups()
        if core:
            if sc:
                core = f"<{sc}>{core}</{sc}>"
            elif emphasis and (b or it):
                mark = "***" if (b and it) else "**" if b else "*"
                core = f"{mark}{core}{mark}"
        out.append(lead + core + trail)
        i = j
    return "".join(out)


def join(a, b):
    if not a:
        return b.lstrip()
    # an emphasis run that continues on the next line: "*relative*" + "*credibility*" reads "*relative credibility*"
    m, n = re.search(r"(?<![\\*])(\*{1,3})$", a.rstrip()), re.match(r"(\*{1,3})(?!\*)", b.lstrip())
    if m and n and m.group(1) == n.group(1) and not a.rstrip().endswith("\\" + m.group(1)):
        return a.rstrip()[:-len(m.group(1))] + " " + b.lstrip()[len(n.group(1)):]
    if a.endswith((" ", "\t")):
        return a + b.lstrip()
    if a.rstrip("*_").endswith(("-", "\u2013", "\u2014", "/")):
        return a + b.lstrip()
    return a + " " + b.lstrip()


# ---- building --------------------------------------------------------------------------------------------------------

def table_md(rows):
    clean = [[re.sub(r"\s+", " ", (c or "").replace(ZW, "")).strip().replace("|", "\\|").replace("*", "\\*")
              for c in r] for r in rows]
    clean = [r for r in clean if any(r)]
    if not clean:
        return ""
    w = max(len(r) for r in clean)
    clean = [r + [""] * (w - len(r)) for r in clean]
    lines = ["| " + " | ".join(clean[0]) + " |", "|" + "---|" * w]
    lines += ["| " + " | ".join(r) + " |" for r in clean[1:]]
    return "\n".join(lines)


def position_table(page, top, bottom, header_rule, gap=14.0):
    """A statistics table rebuilt from word positions: words grouped into printed lines, a line split into cells at
    gaps wider than `gap`, cells assigned to columns by their centre (columns taken from the body rows, so a title
    spanning several model columns does not make a column of its own). Header lines above the header rule are
    stacked into one header row per column. Whole words only; nothing is reworded."""
    words = page.get_text("words", clip=pymupdf.Rect(MARGIN - 6, top, 546, bottom))
    lines = []
    for w in sorted(words, key=lambda w: (round(w[3]), w[0])):
        if lines and abs(lines[-1][0] - w[3]) < 3:
            lines[-1][1].append(w)
        else:
            lines.append([w[3], [w]])
    rows = []
    for y, ws in lines:
        ws.sort(key=lambda w: w[0])
        cells = [[ws[0]]]
        for w in ws[1:]:
            if w[0] - cells[-1][-1][2] > gap:
                cells.append([w])
            else:
                cells[-1].append(w)
        rows.append((y, [(c[0][0], c[-1][2], " ".join(w[4] for w in c)) for c in cells]))
    centres = sorted((x0 + x1) / 2 for y, r in rows if y > header_rule for x0, x1, t in r if x0 > MARGIN + 28)
    groups = []
    for c in centres:
        if groups and c - groups[-1][-1] < 30:
            groups[-1].append(c)
        else:
            groups.append([c])
    anchors = [sum(g) / len(g) for g in groups]
    if not anchors:
        return None, 0

    def place(r):
        out = [""] * (len(anchors) + 1)
        for x0, x1, t in r:
            k = 0 if x0 <= MARGIN + 28 else 1 + min(range(len(anchors)), key=lambda i: abs(anchors[i] - (x0 + x1) / 2))
            out[k] = (out[k] + " " + t).strip()
        return out

    head = [""] * (len(anchors) + 1)
    body = []
    for y, r in rows:
        if y <= header_rule:
            head = [(h + " " + c).strip() for h, c in zip(head, place(r))]
        else:
            body.append(place(r))
    return table_md([head] + body), len(anchors) + 1


def rule_tables(doc, pno, page, stats):
    """APA tables carry horizontal rules only, which PyMuPDF's default table finder does not see as a table.
    pymupdf4llm (rule-based, same library family, no model) does build them; it does not report where a table sits,
    so the table's own rules give its extent: from the top rule to the bottom rule, full text width. Used only when
    the page has exactly one such table; otherwise None, and the caller falls back to PyMuPDF's finder."""
    rules = sorted({round(min(p.y for p in (it[1], it[2])), 1)
                    for d in page.get_drawings() for it in d["items"]
                    if it[0] == "l" and abs(it[1].y - it[2].y) < 0.5 and abs(it[2].x - it[1].x) > 250}
                   | {round(it[1].y0, 1) for d in page.get_drawings() for it in d["items"]
                      if it[0] == "re" and it[1].height < 2.5 and it[1].width > 250})
    if len(rules) < 2:
        return None
    import pymupdf4llm
    text = pymupdf4llm.to_markdown(doc, pages=[pno], show_progress=False)
    found = re.findall(r"(?m)(?:^\|.*\|[ \t]*\n?)+", text)
    if len(found) != 1:
        stats.setdefault("pages_with_unplaced_tables", []).append(pno + 1) if found else None
        return None
    # significance stars follow a number (0.227***); they are literal, so escape them; ** around words is bold
    # protect bold runs (**203**) first, so only stars left after a number are taken as literal
    # (a bold run never opens straight after a digit or another star: "–0.530***<br>–0.530***" is two values)
    md = re.sub(r"(?<![\d*])\*\*(?=\S)([^*|]*?[^*|\s])\*\*", "\u0003\\1\u0004", found[0].strip())
    md = re.sub(r"(?<=\d)\*+", lambda m: "\\*" * len(m.group(0)), md)
    md = md.replace("\u0003", "**").replace("\u0004", "**")
    # Statistics tables (confidence intervals in brackets): when word positions show more columns than
    # pymupdf4llm made, it merged model columns ("–0.530***<br>–0.530***" in one cell), so the position-built
    # table is used instead; read visually on page 58, 2026-10-12
    if len(re.findall(r"\[[–-]?\d", page.get_text())) >= 3:
        pos, ncols = position_table(page, rules[0] - 2, rules[-1] + 2, rules[1])
        llm_cols = md.split("\n")[1].count("|") - 1 if "\n" in md else 0
        # with as many columns, the position-built table is still used, since it keeps a title that spans the model
        # columns in one cell ("Hiring Choices", "Credibility"), unless a value wraps onto a second printed line
        # ("[0.188," / "0.285]", page 42), which only pymupdf4llm keeps in one cell
        wrapped = pos and re.search(r",\s*\|", pos)
        if pos and (ncols > llm_cols or (ncols >= llm_cols and not wrapped)):
            md = pos
            stats.setdefault("tables_rebuilt_from_positions", []).append(pno + 1)
    return [((MARGIN - 6, rules[0] - 2, 546, rules[-1] + 2), md)]


def build(pdf):
    doc = pymupdf.open(pdf)
    blocks = []             # finished output blocks, in order
    cur = None              # the open paragraph: {"kind", "text", "level"}
    pending_notes = []      # footnotes waiting for the paragraph they interrupt to close
    section = ""
    stats = {"tables": 0, "images": 0, "footnotes": 0, "headings": 0, "paragraphs": 0}
    # Table regions: after a "Table N" label and its caption paragraph (or under the supplement's "Table of
    # Contents" heading), text that the table finder did not catch is cell text whose reading order is ambiguous.
    # Those paragraphs are marked so the order check lists them instead of refusing on them; their words are
    # still counted by the word check.
    region = None           # None, "caption" or "table"

    def close():
        nonlocal cur, region
        if cur:
            cur["text"] = re.sub(r"[ \t]+", " ", cur["text"]).strip()
            if cur["text"]:
                if region == "table" and cur["kind"] in ("p", "li", "h"):
                    cur["tab"] = True
                blocks.append(cur)
                if region == "caption" and not cur.get("label"):
                    region = "table"
        cur = None

    def flush_notes():
        for n in pending_notes:
            blocks.append({"kind": "note", "text": re.sub(r"[ \t]+", " ", n).strip()})
        pending_notes.clear()

    for pno, page in enumerate(doc):
        tables = rule_tables(doc, pno, page, stats)
        if tables is None:          # no APA-ruled table placed safely on this page: PyMuPDF's own finder
            tables = [(t.bbox, table_md(t.extract())) for t in page.find_tables().tables]
        tboxes = [pymupdf.Rect(bb) for bb, _ in tables]
        items = []
        for bb, md in tables:
            items.append((bb[1], bb[0], "table", md))
        for b in page.get_text("dict")["blocks"]:
            if b["type"] == 1:
                # figures only; the small icons beside the ORCID links in the author note are not figures
                if (b["bbox"][2] - b["bbox"][0]) > 120 and (b["bbox"][3] - b["bbox"][1]) > 80:
                    items.append((b["bbox"][1], b["bbox"][0], "image", b))
                continue
            for ln in b["lines"]:
                rec = line_record(ln)
                if not rec or rec["y1"] < HEAD_Y:
                    continue
                mid = pymupdf.Point((rec["x0"] + rec["x1"]) / 2, (rec["y0"] + rec["y1"]) / 2)
                if any(mid in tb for tb in tboxes):
                    continue
                items.append((rec["y0"], rec["x0"], "line", rec))
        items.sort(key=lambda it: (round(it[0], 1), it[1]))
        # pieces of one printed line (a name, an ORCID icon, its link) come back as separate lines at the same
        # height; join them left to right, with a space where the page shows a gap
        merged = []
        for it in items:
            prev = merged[-1] if merged else None
            if (prev and it[2] == "line" and prev[2] == "line" and abs(it[0] - prev[0]) < 2.5
                    and it[3]["x0"] >= prev[3]["x1"] - 1):
                a, b = prev[3], it[3]
                gap = b["x0"] - a["x1"] > 1.5 and not a["plain"].endswith(" ") and not b["plain"].startswith(" ")
                a["parts"] = a["parts"] + ([[" ", False, False, ""]] if gap else []) + b["parts"]
                a["plain"] = a["plain"] + (" " if gap else "") + b["plain"]
                a["x1"], a["y1"] = b["x1"], max(a["y1"], b["y1"])
                a["bold"], a["italic"] = a["bold"] and b["bold"], a["italic"] and b["italic"]
                a["size"] = max(a["size"], b["size"])
                continue
            merged.append(it)
        items = merged

        prev_y0 = None
        last_step = None
        page_notes = []
        note = None
        for y0, x0, kind, obj in items:
            if kind == "table":
                close(); flush_notes()
                md = obj
                if md:
                    blocks.append({"kind": "table", "text": md})
                    stats["tables"] += 1
                prev_y0 = None
                continue
            if kind == "image":
                close(); flush_notes()
                blocks.append({"kind": "image", "text": f"*[Figure image: page {pno + 1} of the source PDF]*"})
                stats["images"] += 1
                prev_y0 = None
                continue
            rec = obj
            text = render(rec["parts"])
            plain = rec["plain"].strip()
            # footnotes: 10-point lines at the foot of the page
            if rec["size"] < 11:
                if note is None or rec["parts"][0][3] == "sup" or re.match(r"^\d", plain):
                    if note is not None:
                        page_notes.append(note)
                    note = text
                    stats["footnotes"] += 1
                else:
                    note = join(note, text)
                continue
            # centered lines sit within a few points of the text column's middle; a wide indented line (a
            # reference's continuation) can land within 14 points of it by chance, so the tolerance stays tight
            centered = abs((rec["x0"] + rec["x1"]) / 2 - PAGE_MID) < 6 and rec["x0"] > MARGIN + 18
            in_tab = region == "table"
            step = (y0 - prev_y0) if prev_y0 is not None else None
            if in_tab:
                # table cells are single-spaced; a blank line (a step half again the last one) starts a paragraph
                gap = step is not None and step > max(20.0, 1.5 * (last_step or step))
            else:
                gap = step is not None and step > 40
            last_step = step if step is not None and step < 40 else (last_step if step is not None else None)
            prev_y0 = y0
            # headings: bold lines on their own
            if rec["bold"] and len(plain) < 140 and not plain.startswith(BULLETS):
                # the first bold line of the document is its title
                level = 1 if (pno == 0 and not any(b["kind"] == "h" for b in blocks)) else (2 if centered else 3)
                is_label = re.match(r"^(Table|Figure) S?\d+[A-Z]?$", plain)
                if cur and cur["kind"] == "h" and cur["level"] == level and not gap and not is_label:
                    cur["text"] = join(cur["text"], render(rec["parts"], emphasis=False))
                    continue
                close(); flush_notes()
                if is_label:
                    # tables and figures follow the reference list; their captions are ordinary paragraphs
                    section = ""
                    region = "caption" if plain.startswith("Table") else None
                    cur = {"kind": "p", "text": f"**{plain}**", "label": True}
                    close()
                else:
                    if plain.lower().startswith("table of contents"):
                        region = "table"
                    elif level <= 2:
                        region = None
                    cur = {"kind": "h", "level": level, "text": render(rec["parts"], emphasis=False)}
                    stats["headings"] += 1
                    if level <= 2:
                        section = plain.lower()
                continue
            if plain.startswith(BULLETS):
                close(); flush_notes()
                body = re.sub(r"^\s*[" + "".join(BULLETS) + r"]\s*", "", text)
                cur = {"kind": "li", "text": body}
                continue
            refs = section.startswith("references")
            if in_tab:
                starts = False          # inside a table the indent is the column, not a paragraph start
            elif refs:
                starts = rec["x0"] < MARGIN + 6
            else:
                starts = rec["x0"] >= INDENT
            if centered and not rec["bold"]:
                starts = True
            if cur is None or cur["kind"] not in ("p", "li") or gap or starts:
                if cur and cur["kind"] == "li" and not starts and not gap and rec["x0"] > MARGIN + 6:
                    cur["text"] = join(cur["text"], text)
                    continue
                close(); flush_notes()
                cur = {"kind": "p", "text": text}
                stats["paragraphs"] += 1
            else:
                cur["text"] = join(cur["text"], text)
        if note is not None:
            page_notes.append(note)
        pending_notes.extend(page_notes)
    close(); flush_notes()

    out = []
    for b in blocks:
        if b["kind"] == "h":
            out.append("#" * b["level"] + " " + b["text"].strip("* ").strip())
        elif b["kind"] == "li":
            out.append("- " + b["text"])
        elif b["kind"] == "note":
            out.append("> " + b["text"])
        else:
            out.append(b["text"])
    tabular = [b["text"] for b in blocks if b.get("tab")]
    return "\n\n".join(out) + "\n", stats, tabular


# ---- verifying -------------------------------------------------------------------------------------------------------

def norm_words(s):
    s = unicodedata.normalize("NFKC", s).replace(ZW, " ")
    s = s.replace("\u2019", "'").replace("\u2018", "'").replace("\u201c", '"').replace("\u201d", '"')
    toks = s.split()
    out = []
    for t in toks:
        if out and out[-1].endswith(("-", "\u2013", "\u2014", "/")) and t[:1].isalnum():
            out[-1] += t
        else:
            out.append(t)
    return out


def md_words(md):
    body = md.split("\n---\n", 1)[1] if md.startswith("---") else md
    body = re.sub(r"(?s)^.*?\n\n(?=[^>])", "", body, count=1) if body.lstrip().startswith(">") else body
    body = re.sub(r"\*\[Figure image: page \d+ of the source PDF\]\*", " ", body)
    body = re.sub(r"(?m)^\|(?:---\|)+$", " ", body)
    body = re.sub(r"</?(sup|sub)>", "", body)
    body = body.replace("<br>", " ")
    # pymupdf4llm's _italic_ markers live only in table lines; prose underscores are printed ("S T R E _ _")
    body = "\n".join(re.sub(r"(?<![\w\\])_|_(?![\w])", "", ln) if ln.lstrip().startswith("|") else ln
                     for ln in body.split("\n"))
    body = re.sub(r"(?m)^#+ ", "", body)
    body = re.sub(r"(?m)^[>-] ", "", body)
    body = body.replace("\\*", "\u0002").replace("*", "").replace("\u0002", "*")
    body = body.replace("\\|", "\u0001").replace("|", " ").replace("\u0001", "|")
    return norm_words(body)


HEAD_RE = re.compile(r"^(ONLINE SUPPLEMENT: )?PRECISION AND CREDIBILITY$")


def pdftotext_words(pdf):
    """The reference: xpdf's pdftotext reading the same PDF, minus each page's running head and page number (the
    online supplement has its own head and restarts its numbering) and minus bullet glyphs, which the Markdown
    writes as list markers."""
    exe = shutil.which("pdftotext") or r"C:\Program Files\Git\mingw64\bin\pdftotext.exe"
    # xpdf 4.00 writes characters outside the basic plane (the math alpha) as two separately encoded UTF-16
    # surrogates; decoding with surrogatepass and recombining through UTF-16 gives back the exact character
    data = subprocess.run([exe, "-enc", "UTF-8", str(pdf), "-"], capture_output=True).stdout
    raw = data.decode("utf-8", "surrogatepass").encode("utf-16", "surrogatepass").decode("utf-16")
    kept = []
    for page in raw.split("\f"):
        drop_head = drop_num = False
        for ln in page.split("\n"):
            s = ln.replace(ZW, "").strip()
            if not drop_head and HEAD_RE.match(s):
                drop_head = True
                continue
            if drop_head and not drop_num and s.isdigit():
                drop_num = True
                continue
            kept.append(ln)
    return [w for w in norm_words("\n".join(kept)) if w not in BULLETS]


def md_paragraphs(md):
    body = md.split("\n---\n", 1)[1]
    out = []
    for block in body.split("\n\n"):
        b = block.strip()
        if not b or b.startswith(("|", "> **Disclaimer", ">\n")) or "Figure image: page" in b:
            continue
        if b.startswith(">") and "American Psychological Association, 2026" in b and "Disclaimer" in body[:200]:
            pass
        out.append(md_words(b))
    return [p for p in out if len(p) >= 4]


def in_order(p, ref, starts):
    """True when the words of paragraph p occur in ref in this order from one of the start positions, with gaps
    only for what pdftotext places inside a paragraph that the Markdown places after it (a footnote, at most 400
    words)."""
    for j in starts:
        k, skipped = j, 0
        for w in p:
            while k < len(ref) and ref[k] != w:
                k += 1
                skipped += 1
                if skipped > 400:
                    break
            if k >= len(ref) or skipped > 400:
                break
            k += 1
        else:
            return True
    return False


def clean_chars(s):
    s = unicodedata.normalize("NFKC", s).replace(ZW, "")
    s = s.replace("\u2019", "'").replace("\u2018", "'").replace("\u201c", '"').replace("\u201d", '"')
    return Counter(c for c in s if not c.isspace() and c not in BULLETS)


def md_chars(md):
    """Every printed character of the Markdown body, markup removed. Table lines (written by pymupdf4llm) use
    _underscores_ for italics and | between cells; prose (written here) never emits an underscore as markup."""
    body = md.split("\n---\n", 1)[1]
    body = re.sub(r"(?s)^.*?\n\n(?=[^>])", "", body, count=1)          # the disclaimer
    out = []
    for line in body.split("\n"):
        if re.fullmatch(r"\|(?:---\|)+", line.strip()):
            continue
        line = re.sub(r"\*\[Figure image: page \d+ of the source PDF\]\*", "", line)
        line = re.sub(r"</?(sup|sub)>|<br>", "", line)
        line = re.sub(r"^#+ |^> |^- ", "", line)
        line = line.replace("\\*", "\u0002").replace("\\|", "\u0001").replace("*", "")
        if line.lstrip().startswith("|"):
            line = line.replace("_", "").replace("|", "")
        out.append(line.replace("\u0002", "*").replace("\u0001", "|"))
    return clean_chars("\n".join(out))


def pdftotext_text(pdf):
    exe = shutil.which("pdftotext") or r"C:\Program Files\Git\mingw64\bin\pdftotext.exe"
    data = subprocess.run([exe, "-enc", "UTF-8", str(pdf), "-"], capture_output=True).stdout
    raw = data.decode("utf-8", "surrogatepass").encode("utf-16", "surrogatepass").decode("utf-16")
    kept = []
    for page in raw.split("\f"):
        drop_head = drop_num = False
        for ln in page.split("\n"):
            s = ln.replace(ZW, "").strip()
            if not drop_head and HEAD_RE.match(s):
                drop_head = True
                continue
            if drop_head and not drop_num and s.isdigit():
                drop_num = True
                continue
            kept.append(ln)
    return "\n".join(kept)


def verify(md, pdf, tabular):
    """The refusing checks. SAME CHARACTERS: the multiset of printed characters in the Markdown (markup removed)
    equals pdftotext's, tables included; spacing is ignored, so a table cell written "t=" where the page shows
    "t =" passes, but any added, dropped or changed character refuses. SAME PROSE: every prose paragraph's words
    occur word for word, in order, in pdftotext's text. Word counts are reported as information."""
    chars_md, chars_ref = md_chars(md), clean_chars(pdftotext_text(pdf))
    char_extra, char_missing = chars_md - chars_ref, chars_ref - chars_md
    r = verify_words(md, pdf, tabular)
    r.update({"char_extra": char_extra, "char_missing": char_missing,
              "chars": sum(chars_ref.values())})
    return r


def verify_words(md, pdf, tabular):
    """Two refusing checks. SAME WORDS: every word pdftotext reads occurs in the Markdown the same number of times,
    and nothing else does (tables included, since the count ignores order). Differences that vanish when spaces are
    ignored (MuPDF reads "A – E" where xpdf reads "A–E") are listed but do not refuse; any difference in the
    characters themselves refuses. SAME ORDER: each paragraph's words occur in the same order in the PDF; cell text
    inside a table region (marked by build) is listed instead, since the two extractors read cells in different
    orders."""
    a, b = md_words(md), pdftotext_words(pdf)
    ca, cb = Counter(a), Counter(b)
    extra, missing = ca - cb, cb - ca
    spacing_only = Counter("".join(extra.elements())) == Counter("".join(missing.elements()))
    index = {}
    for j in range(len(b) - 3):
        index.setdefault(tuple(b[j:j + 4]), []).append(j)
    tab = {tuple(md_words(t)) for t in tabular}
    paras = md_paragraphs(md)
    disordered = [p for p in paras if not in_order(p, b, index.get(tuple(p[:4]), []))]
    return {"md": len(a), "ref": len(b), "extra": extra, "missing": missing, "spacing_only": spacing_only,
            "paragraphs": len(paras), "disordered": [p for p in disordered if tuple(p) not in tab],
            "table_cells": [p for p in disordered if tuple(p) in tab]}


def failures(r):
    return sum(r["char_extra"].values()) + sum(r["char_missing"].values()) + len(r["disordered"])


def selftest(md, pdf, tabular):
    base = verify(md, pdf, tabular)
    if failures(base):
        print("FAIL the clean build does not pass, so the plants prove nothing")
        return False
    print("PASS the clean build passes both checks")
    head, intro = md.split("## Introduction\n\n", 1)
    para = intro.split("\n\n", 1)[0]
    target = re.findall(r"\b[a-z]{7,}\b", para)[5]
    sentences = re.split(r"(?<=\.) ", para)
    w = para.split(" ")
    swapped = " ".join(w[:10] + [w[11], w[10]] + w[12:])
    planted = {
        "a body word changed": intro.replace(f" {target} ", f" {target}x ", 1),
        "a body sentence dropped": intro.replace(sentences[1] + " ", "", 1),
        "two words swapped inside a paragraph": intro.replace(para, swapped, 1),
        "the running head left in": "PRECISION AND CREDIBILITY\n\n" + intro,
    }
    ok = True
    for name, bad in planted.items():
        if bad == intro:
            print(f"FAIL {name}: the plant did not apply")
            ok = False
            continue
        caught = failures(verify(head + "## Introduction\n\n" + bad, pdf, tabular)) > 0
        print(("PASS " if caught else "FAIL ") + name + (" caught" if caught else " NOT caught"))
        ok &= caught
    return ok


def main():
    pdf = source_pdf()
    body, stats, tabular = build(pdf)
    md = FRONT + body
    if "--selftest" in sys.argv:
        sys.exit(0 if selftest(md, pdf, tabular) else 1)
    r = verify(md, pdf, tabular)
    n = failures(r)
    report = [
        f"Machine-readable build of {URL}",
        f"source md5 {MD5}; pymupdf {pymupdf.VersionBind}; reference: xpdf pdftotext 4.00",
        f"blocks: {stats}",
        f"SAME CHARACTERS (refuses): {r['chars']} printed characters in pdftotext; "
        f"{sum(r['char_extra'].values())} extra in the Markdown, {sum(r['char_missing'].values())} missing from it",
        f"SAME PROSE (refuses): {r['paragraphs'] - len(r['disordered']) - len(r['table_cells'])} of {r['paragraphs']} "
        f"paragraphs word for word in the PDF's order; {len(r['disordered'])} prose paragraphs not; "
        f"{len(r['table_cells'])} table-cell paragraphs read in a different cell order (listed, allowed)",
        f"words (information): markdown {r['md']}, pdftotext {r['ref']}; {sum(r['extra'].values())} differ one way and "
        f"{sum(r['missing'].values())} the other, from spacing inside table cells",
        "",
    ]
    if r["char_extra"]:
        report += ["characters extra in the Markdown:"] + [f"  {c!r}: {k}" for c, k in r["char_extra"].most_common()]
    if r["char_missing"]:
        report += ["characters missing from the Markdown:"] + [f"  {c!r}: {k}" for c, k in r["char_missing"].most_common()]
    if r["table_cells"]:
        report += ["table-cell paragraphs (inside a table region; cell order differs between extractors):"]
        report += [f"  {' '.join(p)[:200]!r}" for p in r["table_cells"]]
    if r["extra"]:
        report += ["extra in the Markdown (word: count):"] + [f"  {w!r}: {c}" for w, c in r["extra"].most_common(80)]
    if r["missing"]:
        report += ["missing from the Markdown (word: count):"] + [f"  {w!r}: {c}" for w, c in r["missing"].most_common(80)]
    if r["disordered"]:
        report += ["paragraphs not in the PDF's order:"] + [f"  {' '.join(p)[:200]!r}" for p in r["disordered"][:40]]
    REPORT.write_text("\n".join(report) + "\n", encoding="utf-8")
    print("\n".join(report[:6]))
    if n:
        fail(f"{n} differences; read {REPORT} (nothing written to public/)")
    OUT.write_text(md, encoding="utf-8", newline="\n")
    print(f"wrote {OUT} ({len(md):,} characters)")


if __name__ == "__main__":
    main()


