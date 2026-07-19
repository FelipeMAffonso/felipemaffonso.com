/*
  Build pixel-cell versions of EVERY journal cover.
  For each cover in public/images/covers: probe its aspect, downsample
  to a ~20-column cell grid, pick a 7-color palette from the cover
  itself (farthest-point sampling, so each journal keeps its identity:
  JM teal, JCP purple, JCR cream), and quantize. Output one JSON at
  lib/pixel-covers.json keyed by cover basename; rendered at runtime
  by the glimmer engine as the covers=pixel variant.

  Run manually when covers change: node scripts/build-pixel-covers.mjs
*/

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const COVERS = [
  "point-vs-range.png",
  "precise-predictions.gif",
  "cognitive-traps.jpg",
  "concealing-prices.jpg",
  "space-commons.jpg",
  "simple-eco-friendly.jpg",
  "disease-cues.jpg",
  "marketing-by-design.png",
  "serendipity.png",
  "constructive-choice.jpg",
  "ad-skepticism.jpg",
  "arxiv.jpg",
  "psyarxiv.png",
];

const COLS = 20;

function probe(file) {
  const out = execFileSync("ffprobe", [
    "-v", "error", "-select_streams", "v:0",
    "-show_entries", "stream=width,height",
    "-of", "csv=p=0", file,
  ]).toString().trim();
  const [w, h] = out.split(",").map(Number);
  return { w, h };
}

const toHex = ([r, g, b]) =>
  "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
const dist2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;

const result = {};
for (const name of COVERS) {
  const file = `public/images/covers/${name}`;
  const { w, h } = probe(file);
  const rows = Math.max(22, Math.min(32, Math.round((COLS * h) / w)));

  const tmp = path.join("scripts", "_pc_ds.raw");
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error",
    "-i", file,
    "-frames:v", "1",
    "-vf", `scale=${COLS}:${rows}:flags=area`,
    "-f", "rawvideo", "-pix_fmt", "rgb24",
    tmp,
  ]);
  const raw = readFileSync(tmp);
  const px = [];
  for (let i = 0; i < COLS * rows; i++) {
    px.push([raw[i * 3], raw[i * 3 + 1], raw[i * 3 + 2]]);
  }

  /* Journal covers are mostly white paper with colored elements.
     Mapping white to bright cells washes the grid out, so paper
     (bright, unsaturated) gets a dedicated DIM slot (index 1,
     rendered at 0.4 via glimmer dimUpTo) and the palette is
     sampled only from the colored/dark pixels, seeded with the
     most saturated tone, so the cover's identity carries. */
  const lumOf = (p) => (0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2]) / 255;
  const satOf = (p) => {
    const mx = Math.max(...p), mn = Math.min(...p);
    return mx === 0 ? 0 : (mx - mn) / mx;
  };
  const isPaper = (p) => lumOf(p) > 0.72 && satOf(p) < 0.18;
  let pool = px.filter((p) => !isPaper(p) && lumOf(p) >= 0.04);
  if (pool.length < 30) pool = px;

  const chosen = [pool.reduce((a, b) => (satOf(a) * lumOf(a) >= satOf(b) * lumOf(b) ? a : b))];
  while (chosen.length < 6) {
    let best = null, bestD = -1;
    for (const p of pool) {
      const d = Math.min(...chosen.map((c) => dist2(p, c)));
      if (d > bestD) { bestD = d; best = p; }
    }
    chosen.push(best);
  }

  const PAPER = "#8b9099";
  const palette = [null, PAPER, ...chosen.map(toHex)];
  const cells = px.map((p) => {
    if (lumOf(p) < 0.04) return 0;
    if (isPaper(p)) return 1;
    let bi = 0, bd = Infinity;
    chosen.forEach((c, i) => {
      const d = dist2(p, c);
      if (d < bd) { bd = d; bi = i; }
    });
    return bi + 2;
  });

  result[name] = { cols: COLS, rows, palette, cells };
  console.log(`${name}: ${COLS}x${rows}, palette ${palette.slice(1).join(" ")}`);
}

writeFileSync("lib/pixel-covers.json", JSON.stringify(result));
console.log("wrote lib/pixel-covers.json");
