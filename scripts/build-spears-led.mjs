/*
  Build the LED-grid version of the Spears building card from
  public/images/spears-dither.png: downsample to 44x11 cells with
  ffmpeg and snap every cell to the nearest color of a dusk
  palette. Bright window tones (indexes 7+) flicker at runtime via
  the glimmer engine. Writes lib/spears-led.json plus a preview.

  Run manually if the source image changes:
    node scripts/build-spears-led.mjs
*/

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const COLS = 52;
const ROWS = 13;
const SRC = "public/images/spears-dither.png";
const OUT = "lib/spears-led.json";
const PREVIEW = "scripts/_spears-preview.png";

/* index 0 is unlit; 7+ are the "lit window" tones that flicker */
const PALETTE = [
  null,
  "#241a2e", // deep sky
  "#5a3a5e", // magenta sky
  "#c96a3e", // orange glow
  "#7a2e2a", // brick dark
  "#a84438", // brick light
  "#3f5a78", // glass blue
  "#d9a441", // window amber
  "#f4e9d6", // bright window
];

const rgbOf = (hex) => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];
const PALETTE_RGB = PALETTE.map((h) => (h ? rgbOf(h) : null));

/* Downsample at double resolution, then keep, per 2x2 block, the
   subpixel with the highest glow score (luminance plus warm
   saturation). Plain averaging erases the lamps and lit windows,
   which are exactly what makes the dusk scene. */
const tmp = path.join("scripts", "_spears_ds.raw");
execFileSync("ffmpeg", [
  "-y", "-loglevel", "error",
  "-i", SRC,
  "-vf", `scale=${COLS * 2}:${ROWS * 2}:flags=area`,
  "-f", "rawvideo", "-pix_fmt", "rgb24",
  tmp,
]);
const raw = readFileSync(tmp);
const at = (x, y) => {
  const o = (y * COLS * 2 + x) * 3;
  return [raw[o], raw[o + 1], raw[o + 2]];
};

const cells = [];
for (let cy = 0; cy < ROWS; cy++) {
  for (let cx = 0; cx < COLS; cx++) {
    let best = null, bestScore = -1;
    for (let sy = 0; sy < 2; sy++) {
      for (let sx = 0; sx < 2; sx++) {
        const [r, g, b] = at(cx * 2 + sx, cy * 2 + sy);
        const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        const warm = Math.max(0, (r - b) / 255);
        const score = lum + warm * 0.7;
        if (score > bestScore) { bestScore = score; best = [r, g, b, lum]; }
      }
    }
    const [r, g, b, lum] = best;
    if (lum < 0.05) {
      cells.push(0);
      continue;
    }
    /* lamp and window glow snaps straight to the bright tones */
    if (r > 175 && g > 125 && b < 120) {
      cells.push(lum > 0.62 ? 8 : 7);
      continue;
    }
    let bestIdx = 1, bestD = Infinity;
    for (let p = 1; p < PALETTE_RGB.length; p++) {
      const [pr, pg, pb] = PALETTE_RGB[p];
      const d = (r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2;
      if (d < bestD) { bestD = d; bestIdx = p; }
    }
    cells.push(bestIdx);
  }
}

writeFileSync(OUT, JSON.stringify({ cols: COLS, rows: ROWS, palette: PALETTE, cells }));

const prev = Buffer.alloc(COLS * ROWS * 3);
for (let i = 0; i < cells.length; i++) {
  const rgb = PALETTE_RGB[cells[i]] ?? [23, 18, 14];
  prev[i * 3] = rgb[0]; prev[i * 3 + 1] = rgb[1]; prev[i * 3 + 2] = rgb[2];
}
const rawOut = path.join("scripts", "_spears_prev.raw");
writeFileSync(rawOut, prev);
execFileSync("ffmpeg", [
  "-y", "-loglevel", "error",
  "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", `${COLS}x${ROWS}`,
  "-i", rawOut,
  "-vf", "scale=iw*16:ih*16:flags=neighbor",
  PREVIEW,
]);
console.log(`wrote ${OUT} (${COLS}x${ROWS}) and ${PREVIEW}`);
