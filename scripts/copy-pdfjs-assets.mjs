// copy-pdfjs-assets.mjs - stage the PDF.js worker and standard fonts into public/.
//
// The /cv/ viewer (components/CvPdf.tsx) renders public/files/cv.pdf with
// PDF.js. The library's worker and its fallback fonts must be served as static
// files; this runs as npm's prebuild step so they are always version-matched
// to the installed pdfjs-dist. public/pdfjs/ is gitignored build residue.

import { cpSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const require = createRequire(import.meta.url);
const dist = path.dirname(require.resolve("pdfjs-dist/package.json"));
const out = path.join(root, "public", "pdfjs");

mkdirSync(out, { recursive: true });
cpSync(path.join(dist, "build", "pdf.worker.min.mjs"), path.join(out, "pdf.worker.min.mjs"));
cpSync(path.join(dist, "standard_fonts"), path.join(out, "standard_fonts"), { recursive: true });
console.log("pdfjs assets staged into public/pdfjs/");
