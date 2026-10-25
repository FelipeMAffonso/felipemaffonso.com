"""Blurs only the student's handwritten signature on the May 2026 thank-you card photo.

The signature sits on the card, lower right, and runs under the envelope flap. The blur
is applied inside a polygon that follows the card's edge, so the line above it ("Thank
you,") and the envelope keep their original pixels. Writes the blurred copy for the
site and prints how many pixels changed outside the polygon (must be 0).

    python scripts/blur-card-name.py <source.jpg> <out.jpg>
"""
import sys
from PIL import Image, ImageDraw, ImageFilter, ImageChops

src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGB")
# polygon in the original 690x1228 photo: the signature line, bounded on the right by
# the envelope flap edge, which runs from (560, 667) up to (590, 647) and on to (645, 632),
# moved 4 px toward the flap so the last letters just above the edge are inside
poly = [(466, 630), (649, 630), (649, 633), (594, 648), (564, 667), (466, 667)]
mask = Image.new("L", im.size, 0)
ImageDraw.Draw(mask).polygon(poly, fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(1.5))
# strong blur, then a coarse pixelation, so the letter shapes cannot be read back
blurred = im.filter(ImageFilter.GaussianBlur(9))
x0, y0, x1, y1 = 460, 624, 634, 672
patch = blurred.crop((x0, y0, x1, y1))
patch = patch.resize(((x1 - x0) // 10, (y1 - y0) // 10), Image.BILINEAR).resize((x1 - x0, y1 - y0), Image.BILINEAR)
blurred.paste(patch, (x0, y0))
result = Image.composite(blurred, im, mask)
result.save(out, quality=92)

# proof: no pixel outside the (feathered) polygon changed
outside = Image.eval(mask, lambda v: 255 if v == 0 else 0)
diff = ImageChops.difference(result, im).convert("L")
changed_outside = sum(1 for d, o in zip(diff.getdata(), outside.getdata()) if o and d > 0)
print("wrote", out, "| pixels changed outside the signature area:", changed_outside)
