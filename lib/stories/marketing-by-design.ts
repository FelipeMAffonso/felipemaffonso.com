/* Marketing by Design (Journal of Marketing). Two online ads for the
   same perfume, as in the paper's Facebook field experiment: the one on
   the left has a structured design (straight, evenly spaced blue lines),
   the one on the right an unstructured design (tangled, uneven blue
   lines). When the ads claim a practical benefit (the gear: long-lasting,
   for work), people click the structured ad more; the coral frame marks
   the design that supports the claim. When the ads claim a fun benefit
   (the sparkle: delightful, for special occasions), the unstructured ad
   gets more clicks. When the ads also give exact facts (the spec label),
   people no longer infer the benefit from the design and the clicks come
   out even. Last, the paper's data on the most valuable brands: practical
   brands with structured logos and fun brands with unstructured logos are
   worth more, so the matching columns stand tallest. */

import { type Put, type StoryDef, h, rise, spr, box, fill, ease, lerp, line, CHECK } from "./kit";

const CREAM = 0, GRAY = 1, BLUE = 2, GOLD = 3, PURPLE = 4, GREEN = 5, CORAL = 6, TEAL = 7;

const BOTTLE = [".CCC.", ".CCC.", "..X..", "XXXXX", "XXXXX", "XXXXX", "XXXXX"];
const GEAR_A = ["...X...", ".XXXXX.", ".XX.XX.", "XX...XX", ".XX.XX.", ".XXXXX.", "...X..."];
const GEAR_B = [".X...X.", "..XXX..", ".XX.XX.", ".X...X.", ".XX.XX.", "..XXX..", ".X...X."];
const SPARK_A = ["...X...", "...X...", "..XXX..", "XXXXXXX", "..XXX..", "...X...", "...X..."];
const SPARK_B = ["X.....X", "...X...", "..XXX..", ".XXXXX.", "..XXX..", "...X...", "X.....X"];
/* the small claim icons on the ads */
const GEAR5_A = ["X.X.X", ".XXX.", "XX.XX", ".XXX.", "X.X.X"];
const GEAR5_B = ["..X..", ".XXX.", "XX.XX", ".XXX.", "..X.."];
const SPARK5_A = ["..X..", "..X..", "XXXXX", "..X..", "..X.."];
const SPARK5_B = ["X...X", "..X..", ".XXX.", "..X..", "X...X"];
const CURSOR = ["X...", "XX..", "XXX.", "XXXX", "XX..", "..X."];
const LOGO_S = ["XXXXX", "X...X", "X.X.X", "X...X", "XXXXX"];
const LOGO_U = [".BB..", "B..C.", "B.BB.", ".C..B", "..BB."];

const CARDS = [1, 16]; /* left edge of the structured ad, the unstructured ad */
const METER = [5, 20]; /* left edge of each click meter */

/* the ad's picture, an 11 by 11 square under the product: structured is
   concentric squares (symmetric, regular, balanced), unstructured is
   uneven curves that cross and drift */
function design(put: Put, x0: number, structured: boolean, t: number, v: number) {
  if (structured) {
    for (const r of [0, 2, 4]) box(put, x0 + 1 + r, 10 + r, 11 - 2 * r, 11 - 2 * r, BLUE, 0.95 * v);
    put(x0 + 6, 15, BLUE, v);
  } else {
    const clip: Put = (x, y, c, vv) => {
      const rx = Math.round(x), ry = Math.round(y);
      if (ry >= 10 && ry <= 20 && rx >= x0 + 1 && rx <= x0 + 11) put(rx, ry, c, vv);
    };
    const curves = [[11.5, 1.6, 0.9, 0], [14.5, 2.8, 0.55, 1.7], [17, 1.5, 1.3, 3.1], [19, 2.2, 0.7, 4.4]];
    for (const [b, a, f, p] of curves) {
      const yAt = (x: number) => b + a * Math.sin(x * f + p + 0.8 * Math.sin(t * 0.5 + p));
      for (let x = x0 + 1; x < x0 + 11; x++) line(clip, x, yAt(x), x + 1, yAt(x + 1), BLUE, 0.95 * v);
    }
  }
}

/* claim: 1 practical (gear), 2 fun (sparkle); k fades it in */
function claimIcon(put: Put, x0: number, claim: number, t: number, k: number) {
  if (k <= 0) return;
  const f = Math.floor(t * 2) % 2;
  if (claim === 1) spr(put, x0 + 7, 3, f ? GEAR5_A : GEAR5_B, { X: GOLD }, k);
  else spr(put, x0 + 7, 3, f ? SPARK5_A : SPARK5_B, { X: PURPLE }, k);
}

function ad(put: Put, side: number, t: number, claim: number, ck: number, frame: number, fv: number, v = 1) {
  const x0 = CARDS[side];
  box(put, x0, 1, 13, 21, frame, fv * v);
  spr(put, x0 + 1, 2, BOTTLE, { X: TEAL, C: CREAM }, 0.95 * v);
  claimIcon(put, x0, claim, t, ck * v);
  design(put, x0, side === 0, t, v);
}

/* one click: a pointer moves onto the ad and taps it, and the click
   drops into that ad's meter below */
type Click = { u: number; side: number; tx: number; ty: number };
function schedule(left: number, right: number, a: number, b: number, seed: number): Click[] {
  const out: Click[] = [];
  const n = left + right;
  let l = 0, r = 0;
  for (let i = 0; i < n; i++) {
    const side = (l / left <= r / right && l < left) || r >= right ? 0 : 1;
    if (side === 0) l++; else r++;
    out.push({
      u: a + ((b - a) * (i + 0.5)) / n,
      side,
      tx: CARDS[side] + 2 + Math.floor(h(i, seed, 1) * 7),
      ty: 11 + Math.floor(h(seed, i, 2) * 5),
    });
  }
  return out;
}
const P1 = schedule(9, 6, 0.2, 0.74, 3);
const P2 = schedule(6, 8, 0.22, 0.74, 7);
const P3 = schedule(7, 7, 0.28, 0.76, 11);

/* draw the pointers and the falling clicks; return each meter's count */
function clicks(put: Put, u: number, list: Click[]): [number, number] {
  const count: [number, number] = [0, 0];
  for (const c of list) {
    const k = rise(u, c.u - 0.07, c.u);
    if (k > 0 && u < c.u + 0.05) {
      const x = lerp(c.tx + 4, c.tx, ease(k)), y = lerp(c.ty + 5, c.ty, ease(k));
      spr(put, x, y, CURSOR, { X: CREAM }, u < c.u ? 1 : 1 - rise(u, c.u + 0.02, c.u + 0.05));
      if (u >= c.u && u < c.u + 0.03) { put(c.tx - 1, c.ty - 1, CREAM, 1); put(c.tx + 1, c.ty - 1, CREAM, 1); put(c.tx - 1, c.ty + 1, CREAM, 1); put(c.tx + 1, c.ty + 1, CREAM, 1); }
    }
    const d = rise(u, c.u, c.u + 0.06);
    if (d > 0 && d < 1) fill(put, METER[c.side] + 2, lerp(23, 33 - count[c.side], d), 1, 1, CREAM, 1);
    if (d >= 1) count[c.side]++;
  }
  return count;
}

function meters(put: Put, n: [number, number], v = 1) {
  for (let s = 0; s < 2; s++) {
    fill(put, METER[s] - 2, 35, 9, 1, GRAY, 0.6 * v);
    for (let i = 0; i < Math.round(n[s]); i++) fill(put, METER[s], 34 - i, 5, 1, CREAM, (i % 2 ? 0.75 : 0.95) * v);
  }
}

/* the spec label of exact facts hung under each ad */
function specs(put: Put, x0: number, k: number) {
  if (k <= 0) return;
  box(put, x0 + 1, 22, 11, 5, CREAM, 0.7 * k);
  const lens = [6, 4, 5];
  lens.forEach((len, i) => {
    const show = rise(k, 0.3 + i * 0.2, 0.5 + i * 0.2);
    put(x0 + 3, 23 + i, GOLD, show);
    for (let x = 0; x < Math.round(len * show); x++) put(x0 + 5 + x, 23 + i, CREAM, x === len - 1 ? 1 : 0.7);
  });
}

export const story: StoryDef = {
  cols: 30, rows: 37,
  colors: ["#f4e9d6", "#8b9099", "#6f9fd8", "#d9a441", "#b58ad6", "#7dc87d", "#DA7756", "#3fa7a0"],
  phases: [
    { dur: 5.5, render(u, put, t) {
      /* a practical claim: the structured ad gets more clicks */
      const ck = rise(u, 0.06, 0.14);
      const match = rise(u, 0.14, 0.2);
      ad(put, 0, t, 1, ck, match > 0 ? CORAL : GRAY, 0.6 + 0.4 * match);
      ad(put, 1, t, 1, ck, GRAY, 0.6);
      const n = clicks(put, u, P1);
      meters(put, n);
      if (u > 0.82) spr(put, METER[0], 34 - n[0] - 5, CHECK, { X: GREEN }, rise(u, 0.82, 0.88));
    }},
    { dur: 5.5, render(u, put, t) {
      /* a fun claim: the unstructured ad gets more clicks */
      const swap = rise(u, 0, 0.1);
      const match = rise(u, 0.16, 0.22);
      for (let s = 0; s < 2; s++) {
        ad(put, s, t, swap < 0.5 ? 1 : 2, swap < 0.5 ? 1 - swap * 2 : swap * 2 - 1,
          s === 1 && match > 0 ? CORAL : GRAY, s === 1 ? 0.6 + 0.4 * match : 0.6);
      }
      const drain = 1 - rise(u, 0, 0.1);
      const n = clicks(put, u, P2);
      meters(put, [Math.max(n[0], 9 * drain), Math.max(n[1], 6 * drain)]);
      if (u > 0.82) spr(put, METER[1], 34 - n[1] - 5, CHECK, { X: GREEN }, rise(u, 0.82, 0.88));
    }},
    { dur: 5.5, render(u, put, t) {
      /* exact facts on both ads: the design stops mattering */
      const swap = rise(u, 0, 0.1);
      for (let s = 0; s < 2; s++) {
        ad(put, s, t, swap < 0.5 ? 2 : 1, swap < 0.5 ? 1 - swap * 2 : swap * 2 - 1, GRAY, 0.6);
        specs(put, CARDS[s], rise(u, 0.08, 0.24));
      }
      const drain = 1 - rise(u, 0, 0.1);
      const n = clicks(put, u, P3);
      meters(put, [Math.max(n[0], 6 * drain), Math.max(n[1], 8 * drain)]);
      if (u > 0.8) {
        const v = rise(u, 0.8, 0.86);
        fill(put, 13, 29, 4, 1, CREAM, v);
        fill(put, 13, 31, 4, 1, CREAM, v);
      }
    }},
    { dur: 6, render(u, put, t) {
      /* the most valuable brands: the matching logos stand tallest */
      const out = 1 - rise(u, 0, 0.1);
      if (out > 0) for (let s = 0; s < 2; s++) { ad(put, s, t, 1, 1, GRAY, 0.6, out); specs(put, CARDS[s], out); }
      const k = rise(u, 0.1, 0.2);
      if (k <= 0) return;
      const f = Math.floor(t * 2) % 2;
      spr(put, 4, 3, f ? GEAR_A : GEAR_B, { X: GOLD }, k);
      spr(put, 19, 3, f ? SPARK_A : SPARK_B, { X: PURPLE }, k);
      fill(put, 1, 35, 13, 1, GOLD, 0.7 * k);
      fill(put, 16, 35, 13, 1, PURPLE, 0.7 * k);
      /* practical brands: structured, unstructured; fun brands: structured, unstructured */
      const cols: [number, boolean, number][] = [[2, true, 15], [8, false, 7], [17, true, 7], [23, false, 15]];
      const grow = ease(rise(u, 0.24, 0.62));
      const glow = rise(u, 0.66, 0.74);
      cols.forEach(([x, structured, hgt]) => {
        if (structured) spr(put, x, 30, LOGO_S, { X: BLUE }, k);
        else spr(put, x, 30, LOGO_U, { B: BLUE, C: CREAM }, k);
        const n = Math.round(hgt * grow);
        for (let i = 0; i < n; i++) {
          const y = 29 - i;
          const top = hgt === 15 && i >= n - 2 && glow > 0;
          spr(put, x, y, [i % 2 ? ".XXX." : "XXXXX"], { X: top ? CORAL : CREAM }, top ? 1 : 0.8);
        }
      });
    }},
  ],
};
