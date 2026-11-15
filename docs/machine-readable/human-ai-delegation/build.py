"""Machine-readable build of Affonso and Steyvers (2026), "Interdependent conditions for successful
human-AI delegation", Trends in Cognitive Sciences, https://doi.org/10.1016/j.tics.2026.10.007.

Source: the accepted manuscript as submitted on 2026-10-17 (TICS-D-26-00180R2, accepted 2026-10-20),
from the repository research-intelligent-machine-delegation, folder tics/output/SUBMISSION_PACKAGE_R2
(Manuscript.docx, Highlights.docx, Outstanding_Questions.docx, Figure_1.pdf, Figure_2.pdf).

No language model touches the paper's text. pandoc converts the three Word files; this script only
moves blocks (Highlights after the title block, Outstanding Questions after Box 2), turns the two boxes
and Table 1 from pandoc's table syntax into plain paragraphs and a pipe table, removes pandoc's
underline and anchor marks, and inserts the figure descriptions from figures.md (written by Claude
Opus 5.5 from the figure files) after each figure legend.

It refuses to write unless (1) every paragraph and table cell of the three Word files, read
independently with python-docx, appears word for word in the Markdown, (2) every paragraph of the
Markdown outside the front matter and the figure descriptions appears word for word in the Word
files, (3) the reference list has the same 116 numbered entries, and (4) no pandoc residue is left.
--selftest proves that each check catches a planted fault.

Usage: python build.py <SUBMISSION_PACKAGE_R2 folder> [--selftest]
Writes public/files/papers/human-ai-delegation.md and VERIFY.txt beside this script.
"""
import hashlib
import re
import shutil
import subprocess
import sys
from pathlib import Path

import docx

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[2]
OUT = REPO / "public" / "files" / "papers" / "human-ai-delegation.md"
PANDOC = shutil.which("pandoc") or r"C:\Program Files\Pandoc\pandoc.exe"
DOI = "10.1016/j.tics.2026.10.007"
PDF_URL = "https://felipemaffonso.com/files/papers/human-ai-delegation-accepted-manuscript.pdf"
N_REFS = 116

# Corrections Felipe asked for, applied to the pandoc output and to the Word text that the checks read,
# so the checks still compare word for word. Each must apply exactly once. (old, new, who and why)
CORRECTIONS = [
    ("2316 Social", "2566 Social",
     "Felipe 2026-11-15: Mark Steyvers's office is 2566 Social & Behavioral Sciences Gateway (the Word file says 2316)"),
]


def correct(s, where):
    for old, new, _ in CORRECTIONS:
        if s.count(old) != 1:
            raise SystemExit(f"correction {old!r} found {s.count(old)} times in {where}, expected once")
        s = s.replace(old, new)
    return s

FRONT = f"""---
title: "Interdependent conditions for successful human-AI delegation"
authors: "Felipe M. Affonso, Mark Steyvers"
journal: "Trends in Cognitive Sciences"
year: 2026
doi: "{DOI}"
citation: "Affonso, Felipe M. and Mark Steyvers (2026), \\"Interdependent Conditions for Successful Human-AI Delegation,\\" Trends in Cognitive Sciences. https://doi.org/{DOI}"
version: "Accepted manuscript (TICS-D-26-00180R2, accepted 2026-10-20), before copyediting"
license: "CC BY-NC-ND 4.0, https://creativecommons.org/licenses/by-nc-nd/4.0/"
---

> **Disclaimer:** This is a machine-readable conversion of the accepted manuscript (after peer review, before copyediting) of the published paper, for use with AI tools. It may contain conversion errors in formatting or tables, and the published version may differ in wording after copyediting. Always verify against the [published version](https://doi.org/{DOI}). Figures are replaced by written descriptions (alt text plus a long description); the images themselves are in the [PDF of the accepted manuscript]({PDF_URL}).
>
> © 2026. This manuscript version is made available under the CC-BY-NC-ND 4.0 license https://creativecommons.org/licenses/by-nc-nd/4.0/

```bibtex
@article{{affonso2026delegation,
  author  = {{Affonso, Felipe M. and Steyvers, Mark}},
  title   = {{Interdependent Conditions for Successful Human-{{AI}} Delegation}},
  journal = {{Trends in Cognitive Sciences}},
  year    = {{2026}},
  doi     = {{{DOI}}}
}}
```

"""


def md5(p):
    return hashlib.md5(Path(p).read_bytes()).hexdigest()


def pandoc(p):
    return subprocess.run([PANDOC, str(p), "-t", "markdown", "--wrap=none"], capture_output=True,
                          text=True, encoding="utf-8", check=True).stdout


def clean(s):
    s = re.sub(r"\[([^\]]+)\]\{\.underline\}", r"\1", s)  # pandoc underline marks
    s = re.sub(r"\[\]\{#[^}]*\}", "", s)  # empty anchor spans (the table's bookmark)
    s = re.sub(r"\[(\d+)\]\(#[^)]*\)", r"\1", s)  # internal links such as Table [1](#tab:conditions)
    return s


DASHES_ONE = re.compile(r"^\s{2}-{20,}\s*$")
DASHES_COLS = re.compile(r"^\s{2}-+( +-+)+\s*$")


def convert_tables(text):
    """Box 1 (a one-column pandoc table), Table 1 (a simple table) and Box 2 (a grid table) become
    plain paragraphs between rules, and a pipe table."""
    lines = text.split("\n")
    out, i = [], 0
    while i < len(lines):
        ln = lines[i]
        if DASHES_ONE.match(ln) and i + 1 < len(lines) and lines[i + 1].strip().startswith("**BOX"):
            j = i + 1
            body = []
            while not DASHES_ONE.match(lines[j]):
                if lines[j].strip():
                    body.append(lines[j].strip())
                j += 1
            out += ["---", ""] + [b for p in body for b in (p, "")] + ["---"]
            i = j + 1
            continue
        if DASHES_ONE.match(ln) and i + 2 < len(lines) and DASHES_COLS.match(lines[i + 2]):
            # a pandoc multiline table: a full rule, the header, the column rule, rows, a full rule
            j = i + 1
            header = re.split(r"\s{2,}", lines[j].strip())
            j += 2  # skip the column rule under the header
            rows = []
            while not DASHES_ONE.match(lines[j]):
                if lines[j].strip():
                    rows.append(re.split(r"\s{2,}", lines[j].strip()))
                j += 1
            for r in [header] + rows:
                if len(r) != len(header):
                    raise SystemExit(f"table row with {len(r)} cells, header has {len(header)}: {r}")
            strip_bold = lambda c: re.sub(r"^\*\*(.*)\*\*$", r"\1", c)
            out.append("| " + " | ".join(strip_bold(c) for c in header) + " |")
            out.append("|" + "---|" * len(header))
            out += ["| " + " | ".join(r) + " |" for r in rows]
            i = j + 1
            continue
        if ln.startswith("+-") and i + 1 < len(lines) and lines[i + 1].startswith("| "):
            j = i + 1
            body = []
            while not lines[j].startswith("+-"):
                inner = re.sub(r"\s*\|$", "", lines[j][2:]).rstrip()
                body.append("" if inner.strip() in ("", ">") else inner)
                j += 1
            out += ["---", ""] + body + ["", "---"]
            i = j + 1
            continue
        out.append(ln)
        i += 1
    return re.sub(r"\n{3,}", "\n\n", "\n".join(out))


def figure_blocks():
    parts = re.split(r"<!-- figure (\d) -->\n", (HERE / "figures.md").read_text(encoding="utf-8"))
    return {int(parts[k]): parts[k + 1].strip() for k in range(1, len(parts), 2)}


def assemble(src):
    ms = convert_tables(clean(correct(pandoc(src / "Manuscript.docx"), "the Markdown of Manuscript.docx")))
    hl = clean(pandoc(src / "Highlights.docx")).strip()
    oq = clean(pandoc(src / "Outstanding_Questions.docx")).strip()
    figs = figure_blocks()
    a = ms.index("**Abstract**")
    g = ms.index("# Glossary")
    title_block, middle, rest = ms[:a].strip(), ms[a:g].strip(), ms[g:].strip()
    for n in (1, 2):
        m = re.search(rf"^\*\*Figure {n}\..*$", rest, re.M)
        if not m:
            raise SystemExit(f"no legend for Figure {n}")
        rest = rest[:m.end()] + "\n\n" + figs[n] + rest[m.end():]
    return FRONT + "\n\n".join([title_block, hl, middle, oq, rest]) + "\n"


# ---------------------------------------------------------------- verification
SUBS = {"\u2018": "'", "\u2019": "'", "\u201c": '"', "\u201d": '"', "\u2013": "-", "\u2014": "-",
        "\u2212": "-", "\u00a0": " ", "\u2009": " ", "\u202f": " ", "\u2026": "..."}


def norm(s):
    for k, v in SUBS.items():
        s = s.replace(k, v)
    s = s.replace("*", "")
    s = re.sub(r"-{2,}", "-", s)
    return re.sub(r"\s+", " ", s).strip()


def md_plain(s):
    s = re.sub(r"\[([^\]]*)\]\((?:[^()\s]|\([^()\s]*\))*\)", r"\1", s)  # links keep their text
    s = re.sub(r"<((?:https?://|mailto:)?[^<>\s]+)>", r"\1", s)  # autolinks
    s = re.sub(r"\\(.)", r"\1", s)  # pandoc escapes
    s = s.replace("^", "").replace("~", "")
    s = re.sub(r"(?m)^\s*>\s?", "", s)
    s = re.sub(r"(?m)^- ", "", s)
    s = re.sub(r"(?m)^#+ ", "", s)
    return norm(s)


def docx_units(src):
    """Every paragraph and every table-cell paragraph of the three Word files, read with python-docx."""
    units = []
    for name in ("Manuscript.docx", "Highlights.docx", "Outstanding_Questions.docx"):
        d = docx.Document(str(src / name))
        units += [(name, p.text) for p in d.paragraphs]
        for t in d.tables:
            for row in t.rows:
                seen = set()
                for cell in row.cells:
                    if id(cell._tc) in seen:
                        continue  # merged cells repeat
                    seen.add(id(cell._tc))
                    units += [(name + " table", p.text) for p in cell.paragraphs]
    units = [(n, t) for n, t in units if norm(t)]
    for old, new, _ in CORRECTIONS:
        hits = [k for k, (n, t) in enumerate(units) if old in t]
        if len(hits) != 1:
            raise SystemExit(f"correction {old!r} found in {len(hits)} Word paragraphs, expected one")
        n, t = units[hits[0]]
        units[hits[0]] = (n, t.replace(old, new))
    return units


def paper_part(md):
    """The Markdown after the front matter, the disclaimer and the BibTeX block."""
    return md[md.index("```\n", md.index("```bibtex")) + 4:]


def verify(md, units, figs):
    problems, info = [], {}
    body = paper_part(md)
    for f in figs.values():
        if f not in body:
            problems.append("a figure description from figures.md is missing")
        body = body.replace(f, "")
    plain_md = md_plain(body)
    docx_all = norm(" ".join(t for _, t in units))
    # (1) every Word paragraph is in the Markdown
    missing = [(n, t) for n, t in units if norm(t) not in plain_md]
    info["word_units"] = len(units)
    info["word_units_missing"] = len(missing)
    for n, t in missing:
        problems.append(f"Word paragraph not in the Markdown ({n}): {t[:120]!r}")
    # (2) every Markdown paragraph is in the Word files
    blocks = [b.strip() for b in re.split(r"\n\s*\n", body) if b.strip()]
    checked = 0
    for b in blocks:
        if b == "---" or re.fullmatch(r"\|(-+\|)+", b):
            continue
        if b.startswith("|"):
            cells = [c for ln in b.split("\n") if not re.fullmatch(r"\|(-+\|)+", ln)
                     for c in ln.strip("|").split(" | ")]
            pieces = [c.strip() for c in cells]
        else:
            pieces = [b]
        for piece in pieces:
            checked += 1
            if md_plain(piece) not in docx_all:
                problems.append(f"Markdown paragraph not in the Word files: {piece[:120]!r}")
    info["markdown_paragraphs_checked"] = checked
    # (3) the reference list
    refs_md = re.findall(r"(?m)^(\d+)\\\. ", body[body.index("# References"):])
    start = next(k for k, (n, t) in enumerate(units) if n == "Manuscript.docx" and t.strip() == "References")
    refs_docx = [t for n, t in units[start + 1:] if n == "Manuscript.docx" and re.match(r"\d+\. ", t)]
    info["references_markdown"], info["references_word"] = len(refs_md), len(refs_docx)
    if [int(r) for r in refs_md] != list(range(1, N_REFS + 1)) or len(refs_docx) != N_REFS:
        problems.append(f"references: {len(refs_md)} numbered in the Markdown, {len(refs_docx)} in Word, expected {N_REFS} in order")
    # (4) pandoc residue
    for pat in (r"\{\.", r"\{#", r"\]\(#", r"\[\]\{", r"(?m)^\+-", r"(?m)^\| >", r"(?m)^  -{5,}"):
        if re.search(pat, md):
            problems.append(f"pandoc residue left: {pat}")
    return problems, info


def selftest(md, units, figs):
    ok = True

    def expect_fail(label, bad, needle):
        nonlocal ok
        probs, _ = verify(bad, units, figs)
        hit = any(needle in p for p in probs)
        print(f"  {'caught' if hit else 'MISSED'}: {label}")
        ok &= hit

    probs, _ = verify(md, units, figs)
    print(f"  {'clean' if not probs else 'NOT CLEAN'}: the real build ({len(probs)} problems)")
    ok &= not probs
    body_at = md.index("# The rise of delegation")
    word = md.index("consequential", body_at)
    expect_fail("one word changed in the body (Word side)", md[:word] + "important" + md[word + len("consequential"):],
                "Word paragraph not in the Markdown")
    expect_fail("one word changed in the body (Markdown side)", md[:word] + "important" + md[word + len("consequential"):],
                "Markdown paragraph not in the Word files")
    ref = re.search(r"(?m)^57\\\. .*\n\n", md)
    expect_fail("one reference dropped", md[:ref.start()] + md[ref.end():], "references:")
    para = md.index("\n\n", md.index("# What delegation means")) + 2
    expect_fail("an invented sentence added", md[:para] + "This sentence is not in the paper.\n\n" + md[para:],
                "Markdown paragraph not in the Word files")
    cell = md.index("| Accurate delegation assessment |")
    expect_fail("a table cell changed", md[:cell] + "| Accurate delegation judgment |" + md[cell + len("| Accurate delegation assessment |"):],
                "Markdown paragraph not in the Word files")
    expect_fail("pandoc residue left", md.replace("(Table 1)", "(Table [1](#tab:conditions))", 1), "pandoc residue")
    expect_fail("a figure description dropped", md.replace(figs[2], ""), "figure description")
    return ok


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        raise SystemExit(__doc__)
    src = Path(args[0])
    md = assemble(src)
    units = docx_units(src)
    figs = figure_blocks()
    if "--selftest" in sys.argv:
        ok = selftest(md, units, figs)
        print("SELFTEST PASS" if ok else "SELFTEST FAIL")
        sys.exit(0 if ok else 1)
    problems, info = verify(md, units, figs)
    if problems:
        print("REFUSED: not written")
        for p in problems:
            print("  " + p)
        sys.exit(1)
    OUT.write_text(md, encoding="utf-8", newline="\n")
    pv = subprocess.run([PANDOC, "--version"], capture_output=True, text=True).stdout.split("\n")[0]
    report = [
        "Machine-readable build of Affonso and Steyvers (2026), Trends in Cognitive Sciences, https://doi.org/" + DOI,
        "source: research-intelligent-machine-delegation tics/output/SUBMISSION_PACKAGE_R2",
        *[f"  {n} md5 {md5(src / n)}" for n in ("Manuscript.docx", "Highlights.docx", "Outstanding_Questions.docx")],
        f"converter: {pv}; reader for the checks: python-docx {docx.__version__}",
        f"output: public/files/papers/{OUT.name}, {len(md.splitlines())} lines, md5 {hashlib.md5(md.encode('utf-8')).hexdigest()}",
        f"WORD IN MARKDOWN (refuses): {info['word_units'] - info['word_units_missing']} of {info['word_units']} Word paragraphs and table cells word for word in the Markdown",
        f"MARKDOWN IN WORD (refuses): {info['markdown_paragraphs_checked']} Markdown paragraphs and table cells, all word for word in the Word files (front matter and figure descriptions excluded)",
        f"REFERENCES (refuses): {info['references_markdown']} in the Markdown, {info['references_word']} in Word, numbered 1 to {N_REFS}",
        "PANDOC RESIDUE (refuses): none",
        *[f"CORRECTION applied to the Markdown and to the Word text the checks read: {o!r} -> {n!r} ({why})" for o, n, why in CORRECTIONS],
        "Comparison rule: curly and straight quotes, dash kinds, asterisks, spacing and Markdown markup are ignored; every word and number must match.",
        "Figures 1 and 2: descriptions in figures.md, written by Claude Opus 5.5 from Figure_1.pdf and Figure_2.pdf (their text layers supplied every quoted word) and read against the rendered figures.",
    ]
    (HERE / "VERIFY.txt").write_text("\n".join(report) + "\n", encoding="utf-8", newline="\n")
    print("\n".join(report))


if __name__ == "__main__":
    main()
