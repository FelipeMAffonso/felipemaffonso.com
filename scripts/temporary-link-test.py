"""The TiCS entry's buttons (2026-11-15): Journal website opens Elsevier's free Share Link ("Free full text")
until Dec 31, 2026, Central, then the DOI ("Full text"); PDF opens the accepted manuscript in a new tab; the
Machine-readable button downloads the .md. The browser clock is set on each side of the switch.
Usage: python scripts/temporary-link-test.py <base address>, for example http://127.0.0.1:4321. Prints PASS or FAIL."""
import sys
import urllib.request
from datetime import datetime, timedelta, timezone

from playwright.sync_api import sync_playwright

BASE = sys.argv[1].rstrip("/")
CENTRAL = timezone(timedelta(hours=-6))
SHARE = "https://authors.elsevier.com/a/1o6O04sIRvapZe"
DOI = "https://doi.org/10.1016/j.tics.2026.10.007"
fails = []


def buttons(pg):
    pg.goto(f"{BASE}/publications/", wait_until="networkidle")
    pg.locator("#pub-human-ai-delegation .pub-citation").click()
    pg.wait_for_timeout(500)
    return pg.locator("#pub-human-ai-delegation .pub-link").evaluate_all(
        "els => els.map(a => ({href: a.getAttribute('href'), label: a.querySelector('.pub-link-label').textContent,"
        " desc: a.querySelector('.pub-link-desc').textContent, target: a.getAttribute('target'),"
        " download: a.hasAttribute('download')}))")


def expect(cond, what):
    print(("  ok   " if cond else "  FAIL ") + what)
    if not cond:
        fails.append(what)


with sync_playwright() as p:
    br = p.chromium.launch()
    for when, href, desc in [
        (datetime(2026, 12, 30, 23, 59, tzinfo=CENTRAL), SHARE, "Free full text"),
        (datetime(2026, 12, 31, 0, 1, tzinfo=CENTRAL), DOI, "Full text"),
        (datetime(2027, 6, 1, 12, 0, tzinfo=CENTRAL), DOI, "Full text"),
    ]:
        pg = br.new_page()
        pg.clock.set_fixed_time(when)
        b = buttons(pg)
        print(when.isoformat())
        expect([x["label"] for x in b] == ["Journal website", "PDF", "Machine-readable"], f"three buttons in order: {[x['label'] for x in b]}")
        expect(b[0]["href"] == href and b[0]["desc"] == desc, f"Journal website is {href} ({desc}): got {b[0]['href']} ({b[0]['desc']})")
        expect(b[1]["target"] == "_blank" and not b[1]["download"], "PDF opens in a new tab")
        expect(b[2]["download"], "Machine-readable downloads")
        pg.close()
    br.close()

for path, kind in [("/files/papers/human-ai-delegation-accepted-manuscript.pdf", b"%PDF"),
                   ("/files/papers/human-ai-delegation.md", b"---\ntitle:")]:
    with urllib.request.urlopen(BASE + path) as r:
        head = r.read(16)
        expect(r.status == 200 and head.startswith(kind), f"{path} is served ({r.status}, starts {head[:10]!r})")

print("PASS" if not fails else f"FAIL ({len(fails)})")
sys.exit(1 if fails else 0)
