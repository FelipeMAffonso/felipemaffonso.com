/*
  Build the pixel-portrait grid from public/images/headshot.jpg.

  Downsamples the headshot with ffmpeg, applies a soft oval mask so the face
  rises out of a dark field, quantizes each cell into the warm poster palette
  (with a light ordered-dither wobble so flat areas keep texture), and writes
  lib/pixel-portrait.json plus a nearest-neighbor preview PNG for eyeballing.

  Run manually when the headshot changes:  node scripts/build-pixel-portrait.mjs
  The JSON is committed; nothing runs at build or render time.
*/

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const COLS = Number(process.env.COLS || 26);
const ROWS = Number(process.env.ROWS || 34);
const SRC = "public/images/headshot.jpg";
const OUT_JSON = "lib/pixel-portrait.json";
const PREVIEW = `scripts/_portrait-preview-${COLS}x${ROWS}.png`;

/* Palette index 0 is "unlit" (the dim card cell); the rest is a warm ramp
   with coral as the saturated accent. */
const PALETTE = [
  null, // unlit
  "#2b211a",
  "#4a3527",
  "#6e4e36",
  "#96684a",
  "#c08a62",
  "#daa87e",
  "#ecccaa",
  "#f7e9d4",
  "#DA7756", // coral accent
];

const raw = (() => {
  const tmp = path.join("scripts", `_ds_${COLS}x${ROWS}.raw`);
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error",
    "-i", SRC,
    "-vf", `scale=${COLS}:${ROWS}:flags=area`,
    "-f", "rawvideo", "-pix_fmt", "rgb24",
    tmp,
  ]);
  return readFileSync(tmp);
})();

/* 4x4 Bayer matrix, scaled to a +-0.5 palette-step wobble. */
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

const cells = [];
for (let y = 0; y < ROWS; y++) {
  for (let x = 0; x < COLS; x++) {
    const o = (y * COLS + x) * 3;
    const r = raw[o], g = raw[o + 1], b = raw[o + 2];
    const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

    /* Soft oval mask centered on the face (a touch above middle). Outside the
       oval the weight falls off quickly so the office background goes dark,
       and a gentle vignette starts inside the oval edge. */
    const nx = (x + 0.5) / COLS - 0.5;
    const ny = (y + 0.5) / ROWS - 0.47;
    const d = Math.sqrt((nx / 0.38) ** 2 + (ny / 0.485) ** 2);
    const soft = d <= 0.78 ? 1 : Math.max(0, 1 - (d - 0.78) * 2.2);
    const mask = soft * soft;

    /* Ordered-dither wobble keeps flat areas textured after quantizing. */
    const wobble = (BAYER[y % 4][x % 4] / 15 - 0.5) * 0.09;
    const v = Math.max(0, Math.min(1, lum * mask + wobble));

    /* Saturated warm cells (beard highlights, skin warmth) go coral. */
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    const sat = mx === 0 ? 0 : (mx - mn) / mx;
    const warm = r > g && g > b;
    if (mask > 0.85 && warm && sat > 0.46 && v > 0.4 && v < 0.68) {
      cells.push(9);
      continue;
    }

    /* Quantize into the ramp: v = 0 -> unlit, 1 -> brightest. */
    const idx = v < 0.06 ? 0 : 1 + Math.min(7, Math.floor(((v - 0.06) / 0.94) * 8));
    cells.push(idx);
  }
}

writeFileSync(
  OUT_JSON,
  JSON.stringify({ cols: COLS, rows: ROWS, palette: PALETTE, cells }),
);

/* Preview: write the quantized grid back out as raw RGB, upscale 20x nearest. */
const prev = Buffer.alloc(COLS * ROWS * 3);
for (let i = 0; i < cells.length; i++) {
  const hex = PALETTE[cells[i]];
  const [r, g, b] = hex
    ? [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)]
    : [26, 20, 16]; // unlit preview tone
  prev[i * 3] = r; prev[i * 3 + 1] = g; prev[i * 3 + 2] = b;
}
const rawOut = path.join("scripts", `_prev_${COLS}x${ROWS}.raw`);
writeFileSync(rawOut, prev);
mkdirSync("scripts", { recursive: true });
execFileSync("ffmpeg", [
  "-y", "-loglevel", "error",
  "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", `${COLS}x${ROWS}`,
  "-i", rawOut,
  "-vf", "scale=iw*20:ih*20:flags=neighbor",
  PREVIEW,
]);
console.log(`wrote ${OUT_JSON} (${COLS}x${ROWS}) and ${PREVIEW}`);
