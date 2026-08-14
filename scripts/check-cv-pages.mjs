// check-cv-pages.mjs - refuse to build a site whose CV viewer lags behind the CV.
//
// The /cv/ page shows pre-rendered images of public/files/cv.pdf (see
// scripts/build-cv-pages.py). This guard runs as npm's prebuild step, locally and
// in the deploy workflow: if the PDF changed without regenerating the images, or a
// listed image is missing, the build fails loudly instead of publishing a stale
// viewer. That failure mode is the whole point - the old Drive-hosted viewer went
// nine months stale silently.

import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const pdfPath = path.join(root, "public", "files", "cv.pdf");
const manifestPath = path.join(root, "lib", "cv-pages.json");

const fail = (msg) => {
  console.error(`CV viewer check FAILED: ${msg}`);
  console.error("Run: python scripts/build-cv-pages.py, then commit the images and lib/cv-pages.json.");
  process.exit(1);
};

if (!existsSync(pdfPath)) fail("public/files/cv.pdf is missing");
if (!existsSync(manifestPath)) fail("lib/cv-pages.json is missing");

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const sha = createHash("sha256").update(readFileSync(pdfPath)).digest("hex");

if (manifest.sourceSha256 !== sha)
  fail("public/files/cv.pdf changed but the page images were not regenerated");
if (!Array.isArray(manifest.pages) || manifest.pages.length === 0)
  fail("lib/cv-pages.json lists no pages");
for (const p of manifest.pages) {
  if (!existsSync(path.join(root, "public", "images", "cv-pages", p.file)))
    fail(`listed image is missing: ${p.file}`);
}

console.log(`CV viewer check ok: ${manifest.pages.length} pages match cv.pdf (${sha.slice(0, 8)})`);
