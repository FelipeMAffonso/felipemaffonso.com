"""Read lib/publications.tsx and write the publication list as plain JSON for the layout mockups.

  python -X utf8 docs/research-page-options/extract_pubs.py

Writes docs/research-page-options/manifest.json: every entry on the live Research page (citation text with the bold author
kept as <b>, the year, the venue, the section it sits in today, the link kinds, the abstract text) plus the two book
chapters from the cv repo (data/07_other_publications.yaml). Nothing here touches the site build.
"""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "lib" / "publications.tsx"
CV = Path("C:/src/cv/data/07_other_publications.yaml")
OUT = Path(__file__).with_name("manifest.json")


def jsx_text(s):
    s = re.sub(r"\{\s*\"\s*\"\s*\}", " ", s)
    s = re.sub(r"<strong>(.*?)</strong>", r"[[b]]\1[[/b]]", s, flags=re.S)
    s = re.sub(r"<em>(.*?)</em>", r"[[i]]\1[[/i]]", s, flags=re.S)
    s = re.sub(r"<[^>]+>", "", s)
    s = html.unescape(s.replace("&apos;", "'"))
    s = re.sub(r"\s+", " ", s).strip()
    s = html.escape(s, quote=False)
    return (s.replace("[[b]]", "<b>").replace("[[/b]]", "</b>")
             .replace("[[i]]", "<i>").replace("[[/i]]", "</i>"))


def entries(block, section):
    out = []
    for m in re.finditer(r"\n  \{\n    id: \"([^\"]+)\",(.*?)\n  \},?(?=\n  \{|\n?$)", block, re.S):
        pid, body = m.group(1), m.group(2)
        cit = re.search(r"citation: \(\s*<>(.*?)</>\s*\)", body, re.S)
        ab = re.search(r"abstract: \(\s*<>(.*?)</>\s*\)", body, re.S)
        kinds = re.findall(r'kind: "([a-z]+)"', body)
        labels = re.findall(r'label: "([^"]+)"', body)
        descs = re.findall(r'desc: "([^"]*)"', body)
        text = jsx_text(cit.group(1)) if cit else ""
        plain = re.sub(r"<[^>]+>", "", text)
        year = re.search(r"\((?:[^()]*?)(20\d\d|19\d\d)[^()]*\)", plain)
        venue = re.findall(r"<i>(.*?)</i>", text)
        out.append({
            "id": pid,
            "section": section,
            "citation": text,
            "year": int(year.group(1)) if year else None,
            "forthcoming": "forthcoming" in plain.lower(),
            "venue": venue[-1] if venue else "",
            "links": [{"kind": k, "label": l, "desc": d} for k, l, d in zip(kinds, labels, descs)],
            "abstract": re.sub(r"^Abstract:\s*", "", re.sub(r"<[^>]+>", "", jsx_text(ab.group(1)))) if ab else "",
        })
    return out


def main():
    t = SRC.read_text(encoding="utf-8")
    pubs = []
    for name, section in (("preprints", "preprint"), ("journals", "journal")):
        m = re.search(r"export const " + name + r": Pub\[\] = \[(.*?)\n\];", t, re.S)
        pubs += entries(m.group(1), section)
    # the two invited book chapters, verbatim from the CV source
    import yaml
    d = yaml.safe_load(CV.read_text(encoding="utf-8"))
    chapters = []
    for b in d["blocks"]:
        if isinstance(b, dict) and b.get("shape") == "s31":
            runs = b["runs"]
            txt = "".join(str(r[1]) for r in runs).replace("“", '"').replace("”", '"')
            bold = [str(r[1]).strip() for r in runs if r[0] in ("b", "bgrey")]
            for name in bold:
                txt = txt.replace(name, f"<b>{name}</b>", 1)
            chapters.append(txt)
    ids = ["complexity-visual-design", "ai-assisted-shopping"]
    venues = ["Advertising Theory, 3rd edition", "Consumer Psychology and AI"]
    for pid, txt, venue in zip(ids, chapters, venues):
        for v in (venue.split(",")[0],):
            txt = txt.replace(v, f"<i>{v}</i>", 1)
        pubs.append({"id": pid, "section": "chapter", "citation": txt, "year": 2027, "forthcoming": True,
                     "venue": venue, "links": [], "abstract": ""})
    OUT.write_text(json.dumps({"source": "lib/publications.tsx + cv data/07_other_publications.yaml",
                               "pubs": pubs}, indent=1, ensure_ascii=False), encoding="utf-8")
    for p in pubs:
        print(f"{p['section']:9} {p['year']} {'F' if p['forthcoming'] else ' '} {p['id']:26} {p['venue'][:40]:40} "
              f"{[l['kind'] for l in p['links']]} abstract={len(p['abstract'])}")
    print(len(pubs), "entries ->", OUT)


if __name__ == "__main__":
    main()
