/*
  Build the static pixel-art assets for the adjudication:
  1. public/images/spears-pixel.png — the Spears photo as chunky
     pixel art (168x42 cells, dusk palette, nearest-neighbor x8).
  2. lib/cover-pixel-demo.json — one journal cover (JCR,
     cognitive-traps) quantized to a 22x29 cell map for the
     "pixelized journal cover" layout candidate (glimmer engine).

  Run manually: node scripts/build-pixelart.mjs
*/

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const rgbOf = (hex) => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

function quantize(raw, count, palette, keepGlow) {
  const rgb = palette.map((h) => (h ? rgbOf(h) : null));
  const cells = [];
  for (let i = 0; i < count; i++) {
    const r = raw[i * 3], g = raw[i * 3 + 1], b = raw[i * 3 + 2];
    const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    if (lum < 0.05) {
      cells.push(0);
      continue;
    }
    if (keepGlow && r > 175 && g > 125 && b < 120) {
      cells.push(lum > 0.62 ? palette.length - 1 : palette.length - 2);
      continue;
    }
    let bestIdx = 1, bestD = Infinity;
    for (let p = 1; p < rgb.length; p++) {
      const [pr, pg, pb] = rgb[p];
      const d = (r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2;
      if (d < bestD) { bestD = d; bestIdx = p; }
    }
    cells.push(bestIdx);
  }
  return cells;
}

function downsample(src, cols, rows) {
  const tmp = path.join("scripts", "_pa_ds.raw");
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error",
    "-i", src,
    "-vf", `scale=${cols}:${rows}:flags=area`,
    "-f", "rawvideo", "-pix_fmt", "rgb24",
    tmp,
  ]);
  return readFileSync(tmp);
}

/* ---- 1. Spears pixel art PNG ---- */
{
  const COLS = 168, ROWS = 42;
  const PALETTE = [
    null,
    "#241a2e", "#5a3a5e", "#c96a3e", "#7a2e2a",
    "#a84438", "#3f5a78", "#d9a441", "#f4e9d6",
  ];
  const raw = downsample("public/images/spears-dither.png", COLS, ROWS);
  const cells = quantize(raw, COLS * ROWS, PALETTE, true);
  const buf = Buffer.alloc(COLS * ROWS * 3);
  const rgb = PALETTE.map((h) => (h ? rgbOf(h) : [14, 12, 18]));
  for (let i = 0; i < cells.length; i++) {
    const [r, g, b] = rgb[cells[i]] ?? [14, 12, 18];
    buf[i * 3] = r; buf[i * 3 + 1] = g; buf[i * 3 + 2] = b;
  }
  const rawOut = path.join("scripts", "_pa_spears.raw");
  writeFileSync(rawOut, buf);
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error",
    "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", `${COLS}x${ROWS}`,
    "-i", rawOut,
    "-vf", "scale=iw*8:ih*8:flags=neighbor",
    "public/images/spears-pixel.png",
  ]);
  console.log("wrote public/images/spears-pixel.png");
}

/* ---- 2. Pixel journal cover map (JCR cognitive-traps) ---- */
{
  const COLS = 22, ROWS = 29;
  const PALETTE = [
    null,
    "#1f2732", "#54331f", "#8a5a2a", "#b58989",
    "#cfae66", "#DA7756", "#f4e9d6",
  ];
  const raw = downsample("public/images/covers/cognitive-traps.jpg", COLS, ROWS);
  const cells = quantize(raw, COLS * ROWS, PALETTE, false);
  writeFileSync(
    "lib/cover-pixel-demo.json",
    JSON.stringify({ cols: COLS, rows: ROWS, palette: PALETTE, cells }),
  );
  console.log("wrote lib/cover-pixel-demo.json");
}
