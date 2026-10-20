/* When consumers prefer point versus range estimates of product
   performance (Journal of Marketing Research). Two candle listings sit
   side by side on a shopping page, as in the paper's field study: the
   teal one claims one exact burn time (a single pin on its ruler), the
   purple one a range (a bracket). Clicks pile up in a bar under each
   listing. At first the range leaves the outcome open (its marker hops
   inside the bracket) and most clicks go to the exact claim. Then
   "Sponsored" labels drop onto both listings and the cursor becomes a
   magnifying glass: it shows how long such candles really burn, a
   spread of results around the middle. The bracket covers that spread
   and the single pin does not, so the range listing reads as honest
   (it turns green) and now gets most of the clicks. Last, the range is stretched far wider than
   the real spread; its empty ends flash red and the clicks split
   evenly between the two. */

import { type Put, type StoryDef, h, rise, spr, box, fill, ease, lerp, line, path } from "./kit";

const CREAM = 0, SLATE = 1, GOLD = 2, TEAL = 3, PURPLE = 4, BLUE = 5, CORAL = 6, GREEN = 7, RED = 8;

const TAG = [".XXXXX", "XX.XXX", ".XXXXX"]; /* the "Sponsored" label */
const CURSOR = ["X...", "XX..", "XXX.", "XXXX", "XX..", "..X."];
const LENS = [".XXX.", "X...X", "X...X", "X...X", ".XXX."];
const FLAME = [
  ["...X...", "..XXX..", "..XXX.."],
  ["..X....", "..XXX..", "..XXX.."],
  ["....X..", "..XXX..", "..XXX.."],
];
/* a pillar candle: wax with a lighter melted top */
const PILLAR = [".TTTTT.", ".XXXXX.", ".XXXXX.", ".XXXXX.", ".XXXXX.", ".XXXXX.", ".XXXXX."];

const CX = [7, 22]; /* the two listings' center columns: exact claim, range */
const AX = 21; /* the row of each listing's burn-time ruler */
const BASE = 35; /* the click bars stand on this row */
/* how long such candles really burn: offsets from the middle of the
   ruler, in the order the dots appear, forming a small bell under it */
const SPREAD: [number, number][] = [[0, 1], [-2, 2], [1, 2], [2, 1], [-1, 1], [0, 3], [-2, 1], [2, 3], [-1, 3], [1, 1]];

function candle(put: Put, cx: number, wax: number, t: number, seed: number) {
  const x = cx - 3, y = 5;
  spr(put, x, y, FLAME[Math.floor(t * 5 + seed) % 3], { X: GOLD }, 0.95);
  put(cx, y + 2, CREAM, 0.95);
  put(cx, y + 3, CREAM, 0.8);
  spr(put, x, y + 4, PILLAR, { X: wax, T: CREAM }, 0.9);
  fill(put, x - 1, y + 11, 9, 1, SLATE, 0.8);
}

/* one exact number: a single pin with its value marked */
function pointClaim(put: Put, cx: number) {
  for (let y = AX - 3; y <= AX - 1; y++) put(cx, y, TEAL, 0.95);
  put(cx, AX - 2, CREAM, 1);
}

/* a range: a bracket of half width w */
function rangeClaim(put: Put, cx: number, w: number, c: number, v: number) {
  for (let y = AX - 3; y <= AX - 1; y++) { put(cx - w, y, c, v); put(cx + w, y, c, v); }
  line(put, cx - w, AX - 2, cx + w, AX - 2, c, v);
}

/* the real burn times, revealed dot by dot as k runs from 0 to 1 */
function spread(put: Put, cx: number, k: number) {
  const n = Math.round(k * SPREAD.length);
  for (let i = 0; i < n; i++) put(cx + SPREAD[i][0], AX + SPREAD[i][1], GOLD, 0.95);
}

/* the shopping page: two listing cards, their candles and rulers, the
   floor of the click chart; hover lights the card under the cursor */
function page(put: Put, t: number, hover: number) {
  CX.forEach((cx, i) => {
    box(put, cx - 6, 1, 13, 26, SLATE, hover === i ? 0.85 : 0.6);
    candle(put, cx, i === 0 ? TEAL : PURPLE, t, i * 1.3);
    line(put, cx - 4, AX, cx + 4, AX, SLATE, 0.75);
  });
  pointClaim(put, CX[0]);
  fill(put, 0, BASE + 1, 30, 1, SLATE, 0.6);
}

function tags(put: Put, k: number) {
  const y = lerp(-4, 2, ease(k));
  for (const cx of CX) spr(put, cx - 5, y, TAG, { X: BLUE }, 0.95);
}

/* a run of clicks: which listing each goes to, spread over [u0, u1] */
type Plan = { side: number; at: number }[];
function plan(seq: number[], u0: number, u1: number): Plan {
  return seq.map((side, i) => ({ side, at: u0 + ((i + 0.6) / seq.length) * (u1 - u0) }));
}
const TARGET = (side: number): [number, number] => [CX[side] - 1, 12];

/* the cursor travels to each listing, clicks it (a coral flash), and
   the listing's click bar grows; returns which card it hovers */
function clicking(put: Put, u: number, p: Plan, start: [number, number], fade: number, v: number) {
  const pts: [number, number, number][] = [[start[0], start[1], 0]];
  for (const c of p) {
    const [tx, ty] = TARGET(c.side);
    pts.push([tx, ty, c.at - 0.03], [tx, ty, c.at + 0.02]);
  }
  const [x, y] = path(u, pts);
  const counts = [0, 0];
  for (const c of p) {
    if (u >= c.at) counts[c.side]++;
    const k = (u - c.at) / 0.05;
    if (k >= 0 && k < 1) {
      const [tx, ty] = TARGET(c.side);
      for (let a = 0; a < 8; a++) {
        const r = 1.6 + 1.6 * k, ang = (a / 8) * Math.PI * 2;
        put(tx + Math.cos(ang) * r, ty + Math.sin(ang) * r, CORAL, 1 - k * 0.4);
      }
    }
  }
  bars(put, counts, fade);
  if (v > 0) spr(put, x, y, CURSOR, { X: CREAM }, v);
  const hover = Math.abs(x - CX[0]) < 6 && y < 26 ? 0 : Math.abs(x - CX[1]) < 6 && y < 26 ? 1 : -1;
  return hover;
}

function bars(put: Put, counts: number[], v: number) {
  if (v <= 0) return;
  counts.forEach((n, i) => {
    const hgt = Math.round(n * 1.6);
    for (let k = 0; k < hgt; k++) fill(put, CX[i] - 1, BASE - k, 3, 1, i === 0 ? TEAL : PURPLE, 0.9 * v);
  });
}

export const story: StoryDef = {
  cols: 30, rows: 37,
  colors: ["#f4e9d6", "#5c6b7a", "#d9a441", "#3fa7a0", "#9b6fb0", "#7fb3e6", "#DA7756", "#7dc87d", "#c25048"],
  phases: [
    /* side by side, the exact claim feels certain while the range leaves
       the outcome open (its marker hops), and most clicks go to the
       exact claim */
    { dur: 6, render(u, put, t) {
      const p = plan([0, 0, 1, 0, 0, 0], 0.32, 0.86);
      const pre: [number, number, number][] = [[27, 33, 0], [CX[1] - 1, 19, 0.18], [CX[1] - 1, 19, 0.3]];
      let hover: number;
      if (u < 0.3) {
        const [x, y] = path(u, pre);
        hover = y < 26 ? 1 : -1;
        page(put, t, hover);
        spr(put, x, y, CURSOR, { X: CREAM }, 0.95);
      } else {
        page(put, t, -1);
        hover = clicking(put, u, p, [CX[1] - 1, 19], 1, 0.95);
        if (hover >= 0) box(put, CX[hover] - 6, 1, 13, 26, SLATE, 0.85);
      }
      rangeClaim(put, CX[1], 2, PURPLE, 0.95);
      const j = Math.floor(h(Math.floor(t * 4), 1, 2) * 5) - 2;
      put(CX[1] + j, AX - 2, CREAM, 1);
    }},
    /* "Sponsored" labels make the shopper ask how the claims are made:
       the magnifying glass shows the real spread of burn times, the
       range covers it, and now most clicks go to the range */
    { dur: 7.5, render(u, put, t) {
      tags(put, rise(u, 0, 0.12));
      const covered = rise(u, 0.5, 0.58);
      rangeClaim(put, CX[1], 2, PURPLE, 0.95);
      if (covered > 0) {
        rangeClaim(put, CX[1], 2, GREEN, covered);
        box(put, CX[1] - 6, 1, 13, 26, GREEN, covered);
      }
      spread(put, CX[0], rise(u, 0.22, 0.33));
      spread(put, CX[1], rise(u, 0.4, 0.5));
      /* last phase's clicks fade as the labels arrive */
      bars(put, [5, 1], 1 - rise(u, 0, 0.12));
      if (u < 0.56) {
        /* the cursor turns into a magnifying glass and reads each claim */
        const [x, y] = path(u, [[16, 30, 0.08], [CX[0] - 2, AX - 4, 0.2], [CX[0] - 2, AX - 4, 0.34], [CX[1] - 2, AX - 4, 0.4], [CX[1] - 2, AX - 4, 0.5], [CX[1] - 1, 12, 0.56]]);
        const hover = Math.abs(x + 2 - CX[0]) < 6 && y < 26 ? 0 : Math.abs(x + 2 - CX[1]) < 6 && y < 26 ? 1 : -1;
        page(put, t, hover);
        const lens = rise(u, 0.08, 0.13) * (1 - rise(u, 0.5, 0.55));
        if (lens > 0) {
          spr(put, x, y, LENS, { X: BLUE }, lens);
          for (let d = 4; d <= 6; d++) put(x + d, y + d, BLUE, lens);
        }
        if (lens < 1) spr(put, x + 1, y + 1, CURSOR, { X: CREAM }, 0.95 * (1 - lens));
      } else {
        page(put, t, -1);
        const hover = clicking(put, u, plan([1, 1, 0, 1, 1, 1], 0.56, 0.9), [CX[1] - 1, 12], 1, 0.95);
        if (hover >= 0) box(put, CX[hover] - 6, 1, 13, 26, SLATE, 0.85);
      }
    }},
    /* a range far wider than the real spread no longer reads as honest:
       its empty ends flash red and the clicks split evenly */
    { dur: 7, render(u, put, t) {
      tags(put, 1);
      spread(put, CX[0], 1);
      spread(put, CX[1], 1);
      const w = Math.round(lerp(2, 4, ease(rise(u, 0.1, 0.3))));
      const flag = u > 0.3 && w > 2;
      if (!flag) rangeClaim(put, CX[1], w, PURPLE, 0.95);
      else line(put, CX[1] - 2, AX - 2, CX[1] + 2, AX - 2, PURPLE, 0.95);
      const ok = 1 - rise(u, 0.2, 0.3);
      if (ok > 0.5) {
        rangeClaim(put, CX[1], 2, GREEN, ok);
        box(put, CX[1] - 6, 1, 13, 26, GREEN, ok);
      }
      if (flag) {
        const v = 0.7 + 0.3 * (0.5 + 0.5 * Math.sin(t * 9));
        for (const s of [-1, 1]) {
          for (let d = 3; d <= w; d++) put(CX[1] + s * d, AX - 2, RED, v);
          for (let y = AX - 3; y <= AX - 1; y++) put(CX[1] + s * w, y, RED, v);
        }
      }
      bars(put, [1, 5], 1 - rise(u, 0, 0.12));
      page(put, t, -1);
      const hover = clicking(put, u, plan([0, 1, 1, 0, 0, 1], 0.36, 0.84), [CX[1] - 1, 12], 1, 0.95);
      if (hover >= 0) box(put, CX[hover] - 6, 1, 13, 26, SLATE, 0.85);
    }},
  ],
};
