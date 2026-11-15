"""The Publications filter row fits one line on a phone (2026-11-15, Felipe: "how do we deal with this such
that Journal, Year, and the other thing gets all in a single row?"). With the site served: at 390 and at
360 wide, with each type chosen and with a journal and a year limit set, checks that Journal, Year and the
type tabs share one line (the same top) and stay inside the row. Saves a picture of each state. Exits 1
on any line break. Usage: python scripts/filter-options-phonerow.py <base> [picture dir]
"""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = sys.argv[1]
OUT = Path(sys.argv[2]) if len(sys.argv) > 2 else None
if OUT:
    OUT.mkdir(parents=True, exist_ok=True)
fail = []

with sync_playwright() as p:
    br = p.chromium.launch()
    for width in (390, 360):
        pg = br.new_page(viewport={"width": width, "height": 800}, device_scale_factor=2, is_mobile=True, has_touch=True)
        pg.goto(f"{BASE}/publications/", wait_until="networkidle"); pg.wait_for_timeout(800)

        def check(state):
            pg.wait_for_timeout(500)
            row = pg.locator(".fo-line").first.bounding_box()
            j = pg.get_by_role("button", name="Filter by journal").first.bounding_box()
            y = pg.get_by_role("button", name="Filter by year").first.bounding_box()
            t = pg.locator(".section-tabs").first.bounding_box()
            same = abs(j["y"] - t["y"]) < 12 and abs(y["y"] - t["y"]) < 12
            inside = t["x"] + t["width"] <= row["x"] + row["width"] + 1
            print(f"{width}px, {state}: one line {same}, inside the row {inside}")
            if not (same and inside):
                fail.append(f"{width}px {state}")
            if OUT:
                pg.screenshot(path=str(OUT / f"phonerow-{width}-{state.replace(' ', '-')}.png"),
                              clip={"x": 0, "y": row["y"] - 14, "width": width, "height": row["height"] + 28})

        check("All")
        for name in ["Journal publications", "Preprints", "Book chapters"]:
            pg.get_by_role("tab", name=name).first.click()
            check(name)
        # a journal and a year limit: the badges must not push the tabs to a second line
        pg.get_by_role("tab", name="All").first.click(); pg.wait_for_timeout(300)
        pg.get_by_role("button", name="Filter by journal").first.click(); pg.wait_for_timeout(500)
        pg.get_by_role("checkbox", name="Journal of Marketing").first.click(); pg.wait_for_timeout(200)
        pg.get_by_role("checkbox", name="Journal of Consumer Research").first.click(); pg.wait_for_timeout(200)
        pg.keyboard.press("Escape"); pg.wait_for_timeout(400)
        pg.get_by_role("button", name="Filter by year").first.click(); pg.wait_for_timeout(500)
        pg.get_by_role("button", name="Move the closer handle to 2023").first.click(); pg.wait_for_timeout(200)  # 2023 is shown on a phone (every other label)
        pg.keyboard.press("Escape"); pg.wait_for_timeout(400)
        check("two journals and a year limit")
        pg.close()
    br.close()
print("FAIL: " + "; ".join(fail) if fail else "PASS")
sys.exit(1 if fail else 0)
