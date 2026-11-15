"""The year slider's clicks (2026-11-14, Felipe: "I need to be able to hover over the year ... it moves
the left handler. or the right one ... and i need to be able to click the slider itself, too. I think
it has to move the closer handler").

With the review page served (python -m http.server --directory out, after npm run build), clicks
year labels and points on the track, and checks which handle moved where; hovers the track and
checks the preview dot and the label light up. Exits 1 on any wrong result.
Usage: python scripts/filter-options-clicktest.py <base>
"""
import sys
from playwright.sync_api import sync_playwright

BASE = sys.argv[1]
fail = []

with sync_playwright() as p:
    br = p.chromium.launch()
    pg = br.new_page(viewport={"width": 1100, "height": 900})
    pg.goto(f"{BASE}/filter-options/?frame=1&forth=stop&types=row", wait_until="networkidle")
    pg.get_by_role("button", name="Filter by year").first.click()
    pg.wait_for_timeout(500)
    frm = pg.get_by_role("slider", name="From").first
    to = pg.get_by_role("slider", name="To").first
    state = lambda: (frm.get_attribute("aria-valuetext"), to.get_attribute("aria-valuetext"))
    label = lambda y: pg.get_by_role("button", name=f"Move the closer handle to {y}").first

    def check(what, want):
        got = state()
        print(f"{what}: {got[0]} to {got[1]}" + ("" if got == want else f"   WRONG, wanted {want[0]} to {want[1]}"))
        if got != want:
            fail.append(what)

    check("start", ("2019", "Forthcoming"))
    label("2022").click(); pg.wait_for_timeout(200)
    check("click the label 2022 (nearer the left handle)", ("2022", "Forthcoming"))
    label("2026").click(); pg.wait_for_timeout(200)
    check("click the label 2026 (nearer the right handle)", ("2022", "2026"))
    label("2020").click(); pg.wait_for_timeout(200)
    check("click the label 2020 (left of the range)", ("2020", "2026"))
    label("Forthcoming").click(); pg.wait_for_timeout(200)
    check("click the label Forthcoming (right of the range)", ("2020", "Forthcoming"))

    # the track: x of a stop is the centre of a 24px handle at that fraction of the rest
    r = pg.locator(".fo-rs").first.bounding_box()
    order = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2029]  # Forthcoming sits at 2029
    x_of = lambda v: r["x"] + 12 + (r["width"] - 24) * (v - 2019) / (2029 - 2019)
    y = r["y"] + r["height"] / 2
    pg.mouse.click(x_of(2023), y); pg.wait_for_timeout(200)
    check("click the track at 2023 (nearer the left handle)", ("2023", "Forthcoming"))
    pg.mouse.click(x_of(2027.2), y); pg.wait_for_timeout(200)
    check("click the track inside the gap, nearer 2026", ("2023", "2026"))
    pg.mouse.click(x_of(2028.4), y); pg.wait_for_timeout(200)
    check("click the track inside the gap, nearer Forthcoming", ("2023", "Forthcoming"))

    # hover: the preview dot shows and the year under the pointer lights up
    pg.mouse.move(x_of(2025), y); pg.wait_for_timeout(250)
    ghost = pg.locator(".fo-ghost.on").count()
    lit = pg.locator(".fo-label.hover").all_inner_texts()
    print(f"hover at 2025: preview dot shown {ghost == 1}, label lit {lit}")
    if ghost != 1 or lit != ["2025"]:
        fail.append("hover preview")
    cursor = pg.evaluate("getComputedStyle(document.querySelector('.fo-rs')).cursor")
    print(f"cursor over the slider: {cursor}")
    if cursor != "pointer":
        fail.append("cursor")
    br.close()
print("FAIL: " + "; ".join(fail) if fail else "PASS")
sys.exit(1 if fail else 0)
