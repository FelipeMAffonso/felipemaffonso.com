# build-cv-pages.py - render the published CV into the page images the /cv/ viewer shows.
#
# The viewer on /cv/ displays pre-rendered images of public/files/cv.pdf, so the page
# always shows exactly the CV this repo publishes. Run this after replacing cv.pdf
# (check_site_drift.py --stage-pdf in the cv repo stages it), then commit the images
# and lib/cv-pages.json together with the PDF. scripts/check-cv-pages.mjs fails the
# build if the images lag behind the PDF, so forgetting this step cannot deploy.
#
# Filenames carry a content hash so a returning visitor's cache can never show a
# stale page after an update.
#
# Usage: python scripts/build-cv-pages.py

import hashlib
import io
import json
import sys
from datetime import date
from pathlib import Path

import fitz  # pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PDF = ROOT / "public" / "files" / "cv.pdf"
OUT_DIR = ROOT / "public" / "images" / "cv-pages"
MANIFEST = ROOT / "lib" / "cv-pages.json"

TARGET_WIDTH = 1720  # ~200 dpi for a letter page; 2x the 860px display width
WEBP_QUALITY = 82


def main():
    if not PDF.exists():
        sys.exit(f"missing {PDF}")

    pdf_bytes = PDF.read_bytes()
    sha = hashlib.sha256(pdf_bytes).hexdigest()

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for old in OUT_DIR.glob("cv-page-*.webp"):
        old.unlink()

    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    pages = []
    for i, page in enumerate(doc):
        zoom = TARGET_WIDTH / page.rect.width
        pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom))
        img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)

        buf = io.BytesIO()
        img.save(buf, "WEBP", quality=WEBP_QUALITY, method=6)
        data = buf.getvalue()

        tag = hashlib.sha256(data).hexdigest()[:8]
        name = f"cv-page-{i + 1:02d}-{tag}.webp"
        (OUT_DIR / name).write_bytes(data)
        pages.append({"file": name, "width": pix.width, "height": pix.height})
        print(f"  {name}  {pix.width}x{pix.height}  {len(data) // 1024} KB")

    MANIFEST.write_text(
        json.dumps(
            {
                "sourceSha256": sha,
                "generated": date.today().isoformat(),
                "pages": pages,
            },
            indent=2,
        )
        + "\n"
    )
    print(f"{len(pages)} pages -> {OUT_DIR.relative_to(ROOT)}, manifest -> {MANIFEST.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
