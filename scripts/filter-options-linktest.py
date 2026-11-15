"""The three filters shape each other (2026-11-14, Felipe: "if I selected TICS, shouldn't it be filtered
already to forthcoming? shouldnt all choices influence themselves? ... the slider always goes along with
the oldest + most recent or forthcoming paper", "if I select journal of marketing ... it will say 'Until
2023' which reads very weird", "if I click CLEAR it clears/defaults all factors").

With the review page served (python -m http.server --directory out, after npm run build): checks the
year axis under TiCS, JCR and Journal of Marketing, the Year button's wording, and that Clear in one
panel resets the type, the journals and the years. Exits 1 on any wrong result.
Usage: python scripts/filter-options-linktest.py <base>
"""
import sys
from playwright.sync_api import sync_playwright

BASE = sys.argv[1]
fail = []

def ok(what, cond, detail=""):
    print(("ok    " if cond else "WRONG ") + what + (f"  ({detail})" if detail else ""))
    if not cond:
        fail.append(what)

with sync_playwright() as p:
    br = p.chromium.launch()
    pg = br.new_page(viewport={"width": 1100, "height": 900})
    pg.goto(f"{BASE}/filter-options/?frame=1&types=row", wait_until="networkidle")
    jbtn = pg.get_by_role("button", name="Filter by journal").first
    ybtn = pg.get_by_role("button", name="Filter by year").first
    def journals(*names):
        """open the Journal list, check exactly these journals, close it"""
        jbtn.click(); pg.wait_for_timeout(300)
        for box in pg.get_by_role("checkbox").all():
            name = box.get_attribute("aria-label")
            want = name in names
            if (box.get_attribute("aria-checked") == "true") != want:
                box.click(); pg.wait_for_timeout(120)
        pg.keyboard.press("Escape"); pg.wait_for_timeout(250)
    def year_panel():
        ybtn.click(); pg.wait_for_timeout(350)
        labels = [t.strip() for t in pg.locator(".fo-labels .fo-label").all_inner_texts()]
        one = pg.locator(".fo-year-one").all_inner_texts()
        return labels, one

    journals("Trends in Cognitive Sciences")
    labels, one = year_panel()
    ok("TiCS: one year only, said in words", one == ["Forthcoming is the only year with a matching entry."] and labels == [], f"{one} {labels}")
    pg.keyboard.press("Escape"); pg.wait_for_timeout(200)
    ok("TiCS: the Year button still says Year", ybtn.inner_text().strip() == "Year", ybtn.inner_text().strip())

    journals("Journal of Consumer Research")
    labels, _ = year_panel()
    ok("JCR: the axis runs 2026 to Forthcoming", labels == ["2026", "Forthcoming"], ", ".join(labels))
    pg.keyboard.press("Escape"); pg.wait_for_timeout(200)

    journals("Journal of Marketing")
    labels, _ = year_panel()
    ok("JM: the axis runs 2021 to 2023", labels == ["2021", "2022", "2023"], ", ".join(labels))
    pg.keyboard.press("Escape"); pg.wait_for_timeout(200)
    ok("JM: the Year button says Year (no 'Until 2023')", ybtn.inner_text().strip() == "Year", ybtn.inner_text().strip())

    year_panel()
    pg.get_by_role("button", name="Move the closer handle to 2022").first.click(); pg.wait_for_timeout(250)
    pg.keyboard.press("Escape"); pg.wait_for_timeout(250)
    ok("JM, 2022 chosen: the button reads 2022 to 2023", ybtn.inner_text().strip() == "2022 to 2023", ybtn.inner_text().strip())

    # Clear inside the Year panel resets every filter
    year_panel()
    pg.locator(".fo-pop").get_by_role("button", name="Clear", exact=True).first.click(); pg.wait_for_timeout(300)
    pg.keyboard.press("Escape"); pg.wait_for_timeout(250)
    pressed = pg.locator('.pub-filter-btn[aria-pressed="true"] .pub-filter-long').first.inner_text().strip()
    ok("Clear: the type is back on All", pressed == "All", pressed)
    ok("Clear: the Journal button says Journal", jbtn.inner_text().strip() == "Journal", jbtn.inner_text().strip())
    ok("Clear: the Year button says Year", ybtn.inner_text().strip() == "Year", ybtn.inner_text().strip())
    n = pg.locator(".pub-entry").count()
    ok("Clear: all 18 entries are listed", n == 18, str(n))
    br.close()
print("FAIL: " + "; ".join(fail) if fail else "PASS")
sys.exit(1 if fail else 0)
