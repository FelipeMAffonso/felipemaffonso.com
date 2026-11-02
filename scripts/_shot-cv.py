# one-off verification shots of the built /cv/ page; not part of the site build
from playwright.sync_api import sync_playwright

BASE = "http://localhost:4321/cv/"
OUT = r"C:\Users\fmarine\AppData\Local\Temp\cvshots"

import os
os.makedirs(OUT, exist_ok=True)

with sync_playwright() as p:
    b = p.chromium.launch()

    # desktop, light
    pg = b.new_page(viewport={"width": 1440, "height": 1000})
    pg.goto(BASE, wait_until="networkidle")
    pg.screenshot(path=f"{OUT}\\desktop-top.png")
    pg.evaluate("window.scrollTo(0, document.body.scrollHeight * 0.45)")
    pg.wait_for_timeout(700)
    pg.screenshot(path=f"{OUT}\\desktop-mid.png")
    pg.close()

    # phone, light (iPhone 14-ish)
    pg = b.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=3, is_mobile=True)
    pg.goto(BASE, wait_until="networkidle")
    pg.screenshot(path=f"{OUT}\\phone-top.png")
    pg.evaluate("window.scrollTo(0, document.body.scrollHeight * 0.4)")
    pg.wait_for_timeout(700)
    pg.screenshot(path=f"{OUT}\\phone-mid.png")
    pg.close()

    # phone, dark
    pg = b.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=3, is_mobile=True, color_scheme="dark")
    pg.goto(BASE, wait_until="networkidle")
    pg.screenshot(path=f"{OUT}\\phone-dark.png")
    pg.close()

    b.close()
print("shots written to", OUT)
