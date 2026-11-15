"""The thirty-year example on the review page (2026-11-14, Felipe: "what will happen when we have,
say, 30 years of research papers ... once we move the handles or click around it zooms in and out?").

With the review page served (python -m http.server --directory out, after npm run build): in the
"Fewer labels" slider, checks the labels every fifth year and the handle tags; in the "Zooms to your
range" slider, clicks 2010 and checks that the left handle moved, the axis zoomed (more years
labelled, Show all years offered), and that Show all years zooms back out. Saves pictures of each
state. Exits 1 on any wrong result.
Usage: python scripts/filter-options-longtest.py <base> [picture dir]
"""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = sys.argv[1]
OUT = Path(sys.argv[2]) if len(sys.argv) > 2 else None
fail = []

def ok(what, cond, detail=""):
    print(("ok    " if cond else "WRONG ") + what + (f"  ({detail})" if detail else ""))
    if not cond:
        fail.append(what)

with sync_playwright() as p:
    br = p.chromium.launch()
    pg = br.new_page(viewport={"width": 1440, "height": 1000})
    pg.goto(f"{BASE}/filter-options/", wait_until="networkidle")
    pg.wait_for_timeout(800)
    cards = pg.locator(".fo-long-card")
    ok("two example sliders", cards.count() == 2, str(cards.count()))
    thin, zoom = cards.nth(0), cards.nth(1)
    thin.scroll_into_view_if_needed()
    labels = lambda c: [t.strip() for t in c.locator(".fo-label").all_inner_texts()]
    tags = lambda c: [t.strip() for t in c.locator(".fo-rs-thumb .fo-tag").all_inner_texts()]
    shot = lambda name, el: OUT and el.screenshot(path=str(OUT / f"long-{name}.png"))
    if OUT:
        OUT.mkdir(parents=True, exist_ok=True)

    lt = labels(thin)
    ok("fewer labels: every fifth year and Forthcoming", lt == ["2000", "2005", "2010", "2015", "2020", "Forthcoming"], ", ".join(lt))
    ok("fewer labels: each handle shows its year", tags(thin) == ["1996", "Forthcoming"], ", ".join(tags(thin)))
    shot("thin", thin)

    lz0 = labels(zoom)
    zoom.get_by_role("button", name="Move the closer handle to 2010").click()
    pg.wait_for_timeout(600)
    frm = zoom.get_by_role("slider", name="From")
    ok("zoom: clicking 2010 moves the left handle", frm.get_attribute("aria-valuetext") == "2010", frm.get_attribute("aria-valuetext"))
    lz1 = labels(zoom)
    ok("zoom: the axis zoomed in (more years labelled)", len([x for x in lz1 if x != "Forthcoming"]) > len([x for x in lz0 if x != "Forthcoming"]), ", ".join(lz1))
    ok("zoom: 1996 has left the view", "1996" not in lz1 and "2000" not in lz1, ", ".join(lz1))
    reset = zoom.get_by_role("button", name="Show all years")
    ok("zoom: Show all years is offered", reset.count() == 1)
    shot("zoomed", zoom)
    reset.click()
    pg.wait_for_timeout(600)
    lz2 = labels(zoom)
    ok("zoom: Show all years zooms back out", lz2 == lz0, ", ".join(lz2))
    ok("zoom: the handle stays on 2010 after zooming out", frm.get_attribute("aria-valuetext") == "2010")
    shot("zoomed-out", zoom)
    br.close()
print("FAIL: " + "; ".join(fail) if fail else "PASS")
sys.exit(1 if fail else 0)
