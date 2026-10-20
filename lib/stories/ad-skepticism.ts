/* Advertising skepticism and brand extensions (Psychology and
   Marketing). A computer brand advertises a new product, and two
   people watch the ad: one takes ads at their word, the other is a
   skeptic who inspects it through a magnifying glass. The teal dots
   are what the ad claims: that the computer maker's skill carries
   over to the new product. A printer is so close to a computer that
   the claim reaches both viewers without thought, and both hearts
   fill. Sunglasses are so far from a computer that the claim never
   reaches the product, and neither heart fills. An espresso machine
   sits in between: the trusting viewer accepts the claim, but at the
   skeptic's lens it stops, and the skeptic's heart stays empty (the
   paper's key result). Then the ad shows the espresso machine with
   the computer's own parts, a screen and buttons, and the claim gets
   through the lens: the skeptic's heart fills too (Study 3). */

import { type Put, type StoryDef, clamp01, rise, spr, box, fill, ease, lerp } from "./kit";

/* ---- colors ---- */
const CREAM = 0, SLATE = 1, TEAL = 2, GOLD = 3, CORAL = 4, RED = 5, GREEN = 6;

/* ---- the computer brand and its three new products ---- */
const COMPUTER = ["XXXXXXXXX", "XSSSSSSSX", "XSSSSSSSX", "XSSSSSSSX", "XXXXXXXXX", "...XXX...", ".XXXXXXX."];
const PRINTER = ["..ppppp..", "XXXXXXXXX", "XTTXXXXXX", "XXXXXXXXX", "XXXXXXXXX", ".ppppppp."];
const ESPRESSO = ["XXXXXXXXX", "XXXXXXXXX", "XX.XXX.XX", "XX..g..XX", "XX.ccc.XX", "XX.ccc.XX", "XXXXXXXXX"];
const SUNGLASSES = ["GGGGGGGGGGG", "GLLLG.GLLLG", ".GLG...GLG."];

/* ---- the two viewers ---- */
const STAND = [".XXX.", ".XXX.", "..X..", "XXXXX", "X.X.X", "..X..", ".X.X.", ".X.X."];
const HEART = [".X.X.", "XXXXX", "XXXXX", ".XXX.", "..X.."];
const HEART_OUT = [".X.X.", "X.X.X", "X...X", ".X.X.", "..X.."];

type Pt = [number, number];
/* the claim travels down from the computer into the product, then out
   to each viewer; the skeptic's path runs through the lens */
const INNER: Pt[] = [[14, 10], [14, 13]];
const TO_TRUST: Pt[] = [[12, 21], [7, 29]];
const TO_SKEPTIC: Pt[] = [[17, 21], [18, 28]];

function along(pts: Pt[], s: number): Pt {
  const segs: number[] = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    segs.push(d); total += d;
  }
  let d = clamp01(s) * total;
  for (let i = 0; i < segs.length; i++) {
    if (d <= segs[i] || i === segs.length - 1) {
      const k = segs[i] ? Math.min(1, d / segs[i]) : 0;
      return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)];
    }
    d -= segs[i];
  }
  return pts[pts.length - 1];
}

/* a stream of dots along a path: front is how far the stream has
   reached (0 to 1); stop is where dots die (1 = they arrive) */
function stream(put: Put, t: number, pts: Pt[], front: number, stop: number, c: number, n = 5, speed = 0.6) {
  if (front <= 0) return;
  for (let k = 0; k < n; k++) {
    const s = (t * speed + k / n) % 1;
    if (s > front) continue;
    if (s > stop) continue;
    const near = stop < 1 ? clamp01((stop - s) / 0.15) : 1;
    const [x, y] = along(pts, s);
    put(x, y, c, 0.95 * (0.35 + 0.65 * near));
  }
}

/* a product drawn in two passes: the body dimmer, the details
   brighter, so the paper and the cup stand out in both themes */
function product(put: Put, x: number, y: number, art: string[], body: Record<string, number>, detail: Record<string, number>, p: number) {
  spr(put, x, y, art, body, 0.6 * p);
  spr(put, x, y, art, detail, 0.95 * p);
}

function ad(put: Put, v = 1) {
  box(put, 7, 1, 16, 21, SLATE, 0.55 * v);
  spr(put, 10, 3, COMPUTER, { X: SLATE, S: TEAL }, 0.95 * v);
}

/* the trusting viewer stands with arms down; the skeptic raises a
   magnifying glass toward the ad. lens: the color inside the lens
   (teal when the claim passes, red when it is stopped, -1 for none) */
const SKEPTIC = ["...XXX.", ".X.XXX.", "..X.X..", "...XXXX", "....X.X", "....X..", "...X.X.", "...X.X."];
const LENS_RING = [".XXX.", "X...X", "X...X", "X...X", ".XXX."];

function viewers(put: Put, lens: number, lv: number) {
  spr(put, 3, 30, STAND, { X: CREAM }, 0.9);
  spr(put, 20, 30, SKEPTIC, { X: CREAM }, 0.9);
  spr(put, 16, 26, LENS_RING, { X: CREAM }, 0.95);
  put(20, 30, CREAM, 0.95);
  if (lens >= 0 && lv > 0) fill(put, 17, 27, 3, 3, lens, lv);
}

/* green sparks that open outward from just outside a heart, so they
   are not hidden behind it */
function sparks(put: Put, cx: number, cy: number, b: number, c: number) {
  if (b <= 0 || b >= 1) return;
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 + 0.3;
    const d = 3.5 + ease(b) * 3;
    put(cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.9, c, 0.95 * Math.sqrt(1 - b));
  }
}

/* each viewer's heart: a gray outline until the claim lands, then
   a full coral heart */
function hearts(put: Put, a: number, b: number) {
  if (a > 0) spr(put, 3, 24, HEART, { X: CORAL }, 0.5 + 0.5 * a);
  else spr(put, 3, 24, HEART_OUT, { X: SLATE }, 0.8);
  if (b > 0) spr(put, 23, 24, HEART, { X: CORAL }, 0.5 + 0.5 * b);
  else spr(put, 23, 24, HEART_OUT, { X: SLATE }, 0.8);
}

export const story: StoryDef = {
  cols: 30, rows: 38,
  colors: ["#f4e9d6", "#5c6b7a", "#3fa7a0", "#d9a441", "#DA7756", "#c25048", "#7dc87d"],
  phases: [
    /* a printer: the claim reaches both viewers by itself */
    { dur: 5.5, render(u, put, t) {
      ad(put);
      const p = rise(u, 0, 0.1);
      product(put, 10, 13, PRINTER, { X: SLATE }, { T: TEAL, p: CREAM }, p);
      const inner = rise(u, 0.12, 0.25);
      stream(put, t, INNER, inner, 1, TEAL, 3, 0.9);
      if (inner >= 1) fill(put, 11, 15, 2, 1, TEAL, 1);
      stream(put, t, TO_TRUST, rise(u, 0.25, 0.45), 1, TEAL);
      const fs = rise(u, 0.28, 0.48);
      stream(put, t, TO_SKEPTIC, fs, 1, TEAL);
      viewers(put, TEAL, fs >= 1 ? 0.6 + 0.3 * Math.sin(t * 5) : 0);
      hearts(put, rise(u, 0.45, 0.52), rise(u, 0.5, 0.57));
    }},
    /* sunglasses: the claim dies before it reaches the product */
    { dur: 4.5, render(u, put, t) {
      ad(put);
      const p = rise(u, 0, 0.1);
      product(put, 9, 15, SUNGLASSES, { L: SLATE }, { G: GOLD }, p);
      /* the claim fades out halfway to the sunglasses */
      stream(put, t, [[14, 10], [14, 15]], rise(u, 0.12, 0.3), 0.5, TEAL, 4, 0.7);
      viewers(put, -1, 0);
      hearts(put, 0, 0);
    }},
    /* an espresso machine: the trusting viewer accepts the claim, the
       skeptic's lens stops it */
    { dur: 6, render(u, put, t) {
      ad(put);
      const p = rise(u, 0, 0.1);
      product(put, 10, 13, ESPRESSO, { X: SLATE }, { g: GOLD, c: CREAM }, p);
      const inner = rise(u, 0.12, 0.25);
      stream(put, t, INNER, inner, 1, TEAL, 3, 0.9);
      if (inner >= 1) put(17, 14, TEAL, 1);
      stream(put, t, TO_TRUST, rise(u, 0.25, 0.45), 1, TEAL);
      const front = rise(u, 0.28, 0.48);
      stream(put, t, TO_SKEPTIC, front, 0.8, TEAL);
      const blocked = front >= 1 ? 1 : 0;
      viewers(put, RED, blocked * (0.65 + 0.3 * Math.sin(t * 9)));
      /* the stopped claim drops out of the lens */
      if (blocked) {
        for (let k = 0; k < 3; k++) {
          const f = (t * 0.8 + k / 3) % 1;
          put(17 + k, lerp(31, 37, f), RED, 0.85 * (1 - f));
        }
      }
      hearts(put, rise(u, 0.45, 0.52), 0);
    }},
    /* the ad shows the espresso machine with a computer's screen and
       buttons: now the claim gets through the lens too */
    { dur: 5.5, render(u, put, t) {
      ad(put);
      product(put, 10, 13, ESPRESSO, { X: SLATE }, { g: GOLD, c: CREAM }, 1);
      /* the computer's own screen appears on the machine */
      const tech = rise(u, 0.05, 0.2);
      fill(put, 11, 13, 7, 2, TEAL, 0.95 * tech);
      const inner = rise(u, 0.2, 0.32);
      stream(put, t, INNER, inner, 1, TEAL, 3, 0.9);
      stream(put, t, TO_TRUST, rise(u, 0.32, 0.5), 1, TEAL);
      const fs = rise(u, 0.35, 0.55);
      stream(put, t, TO_SKEPTIC, fs, 1, TEAL);
      viewers(put, TEAL, fs >= 1 ? 0.6 + 0.3 * Math.sin(t * 5) : 0);
      const b = rise(u, 0.55, 0.62);
      hearts(put, rise(u, 0.5, 0.57), b);
      sparks(put, 25, 26, rise(u, 0.6, 0.9), GREEN);
    }},
  ],
};
