"""The year slider's drag across the gap to Forthcoming (2026-11-14, Felipe: "it stutters and gets bugged").

Drags the right handle from Forthcoming down past 2026 and back, one pixel per move, and records
the handle's value after every move. A stutter shows as a value that reverses direction during a
one-way drag. Also presses the arrow keys at the gap. Exits 1 on any reversal or wrong key step.
Usage: python dragtest.py <base> [forth]
"""
import sys
from playwright.sync_api import sync_playwright

BASE = sys.argv[1]
FORTH = sys.argv[2] if len(sys.argv) > 2 else "stop"
ORDER = ["2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "Forthcoming"]
rank = lambda v: ORDER.index(v)
fail = []

def reversals(seq):
    """count direction changes in a sequence of ranks, ignoring repeats"""
    steps = [b - a for a, b in zip(seq, seq[1:]) if b != a]
    return sum(1 for a, b in zip(steps, steps[1:]) if (a > 0) != (b > 0))

with sync_playwright() as p:
    br = p.chromium.launch()
    pg = br.new_page(viewport={"width": 1100, "height": 900})
    pg.goto(f"{BASE}/filter-options/?frame=1&place=left&layer=journals&forth={FORTH}&list=more&icons=book&types=row", wait_until="networkidle")
    pg.get_by_role("button", name="Filter by year").first.click()
    pg.wait_for_timeout(500)
    to = pg.get_by_role("slider", name="To").first
    track = pg.locator(".fo-rs").first.bounding_box()
    box = to.bounding_box()
    x0, y = box["x"] + box["width"] / 2, box["y"] + box["height"] / 2
    left = track["x"] + track["width"] * 0.62  # around 2024 or 2025
    pg.mouse.move(x0, y)
    pg.mouse.down()
    seq = []
    x = x0
    while x > left:  # down, one pixel at a time
        x -= 1
        pg.mouse.move(x, y)
        seq.append(rank(to.get_attribute("aria-valuetext")))
    down = seq[:]
    while x < x0 + 4:  # and back up
        x += 1
        pg.mouse.move(x, y)
        seq.append(rank(to.get_attribute("aria-valuetext")))
    pg.mouse.up()
    up = seq[len(down):]
    rd, ru = reversals(down), reversals(up)
    names = lambda s: [ORDER[i] for i in dict.fromkeys(s)]
    print(f"drag down: {len(down)} moves, values {names(down)}, reversals {rd}")
    print(f"drag up:   {len(up)} moves, values {names(up)}, reversals {ru}")
    if rd or ru:
        fail.append("the handle reversed during a one-way drag")
    if ORDER[up[-1]] != ("Forthcoming" if FORTH == "stop" else ORDER[up[-1]]):
        fail.append(f"the drag back ended on {ORDER[up[-1]]}")
    # keyboard: from the last stop, left then right
    to.focus()
    last = to.get_attribute("aria-valuetext")
    pg.keyboard.press("ArrowLeft"); a = to.get_attribute("aria-valuetext")
    pg.keyboard.press("ArrowRight"); b = to.get_attribute("aria-valuetext")
    print(f"keys: {last} -> left {a} -> right {b}")
    if FORTH == "stop" and (a != "2026" or b != "Forthcoming"):
        fail.append("the arrow keys did not cross the gap in one press")
    br.close()
print("FAIL: " + "; ".join(fail) if fail else "PASS")
sys.exit(1 if fail else 0)
