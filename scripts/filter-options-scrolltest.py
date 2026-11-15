"""The Journal list scrolls (2026-11-14, Felipe: "the scrollbar is not working AT ALL", then "just bring
back the old scroll"). With the review page served: opens the Journal list, turns the mouse wheel over it,
and checks that the list moved and that its last journal can be reached and checked. Exits 1 otherwise.
Usage: python scripts/filter-options-scrolltest.py <base>
"""
import sys
from playwright.sync_api import sync_playwright

BASE = sys.argv[1]
fail = []
with sync_playwright() as p:
    br = p.chromium.launch()
    pg = br.new_page(viewport={"width": 1100, "height": 900})
    pg.goto(f"{BASE}/publications/", wait_until="networkidle")
    pg.get_by_role("button", name="Filter by journal").first.click(); pg.wait_for_timeout(400)
    box = pg.locator(".fo-scroll").first
    native = box.evaluate("el => getComputedStyle(el).overflowY")
    b = box.bounding_box()
    pg.mouse.move(b["x"] + b["width"] / 2, b["y"] + b["height"] / 2)
    before = box.evaluate("el => el.scrollTop")
    pg.mouse.wheel(0, 300); pg.wait_for_timeout(500)
    after = box.evaluate("el => el.scrollTop")
    print(f"the list scrolls by itself (overflow-y {native}); wheel moved it from {before} to {after}")
    if native != "auto" or after <= before:
        fail.append("the wheel did not scroll the list")
    last = pg.get_by_role("checkbox", name="Psychology & Marketing").first
    last.click(); pg.wait_for_timeout(250)
    print(f"the last journal is reachable and checks: {last.get_attribute('aria-checked')}")
    if last.get_attribute("aria-checked") != "true":
        fail.append("the last journal could not be checked")
    br.close()
print("FAIL: " + "; ".join(fail) if fail else "PASS")
sys.exit(1 if fail else 0)
