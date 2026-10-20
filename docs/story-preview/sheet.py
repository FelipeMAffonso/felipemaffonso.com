"""Render a contact sheet of one pixel story to PNG, to look at the frames.

  python docs/story-preview/sheet.py <story id> [--n 16] [--w 230] [--theme dark|light] [--aspect 1.32]

Builds docs/story-preview/_work/<id>.html (that story only, the real site code)
and writes docs/story-preview/_work/<id>-sheet[-light].png: n frames spread
evenly over one loop, each labelled with its time, drawn exactly as the cover
slot on the site draws them. Prints the PNG path and any page errors; exits 1
on a build or page error. --aspect is the cover's height over width (the story
letterboxes into it); 1.32 is a typical journal cover.
"""

import argparse
import os
import subprocess
import sys

from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(os.path.dirname(HERE))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("story")
    ap.add_argument("--n", type=int, default=16)
    ap.add_argument("--w", type=int, default=230)
    ap.add_argument("--theme", choices=["dark", "light"], default="dark")
    ap.add_argument("--aspect", type=float, default=None)
    a = ap.parse_args()

    r = subprocess.run(["node", os.path.join(HERE, "build.mjs"), "--story", a.story], cwd=SITE,
                       capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stdout + r.stderr)
        sys.exit(1)
    page = os.path.join(HERE, "_work", a.story + ".html").replace("\\", "/")
    url = "file:///%s?sheet=%s&n=%d&w=%d&theme=%s" % (page, a.story, a.n, a.w, a.theme)
    if a.aspect:
        url += "&aspect=%s" % a.aspect
    out = os.path.join(HERE, "_work", "%s-sheet%s.png" % (a.story, "-light" if a.theme == "light" else ""))
    errors = []
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": 4 * (a.w + 24) + 20, "height": 600})
        pg.on("pageerror", lambda e: errors.append(str(e)))
        pg.goto(url)
        pg.wait_for_timeout(300)
        pg.screenshot(path=out, full_page=True)
        b.close()
    print(out)
    if errors:
        print("PAGE ERRORS:\n" + "\n".join(errors))
        sys.exit(1)


if __name__ == "__main__":
    main()
