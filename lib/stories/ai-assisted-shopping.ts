/* AI-assisted shopping (Consumer Psychology and AI). The shopper wants
   the striped teal product. With a vague request, the assistant drone
   is pulled toward the familiar brand (the coral rings) and brings it
   to the cart: a poor fit. Every such purchase feeds the brand's sales
   and the text later models learn from, so its pull grows. With a
   detailed request, the drone resists the pull and brings what the
   shopper wanted. */

import { type Put, type StoryDef, h, clamp01, env, rise, spr, box, fill, ease, lerp, line, ring, burst, coast, spinUp, path, CHECK, CROSS } from "./kit";

/* ---- the AI shopping chapter: a shopper, a shelf, an assistant drone ---- */
const DRONE_A = ["X.X.X", ".XXX.", "..X.."];
const DRONE_B = [".X.X.", ".XXX.", "..X.."];
const SHOPPER = [".XXX.", ".XXX.", "..X..", "XXXXX", "X.X.X", "..X..", ".X.X.", ".X.X."];
const CART = ["X......", ".XXXXXX", ".X.X.X.", ".XXXXXX", "..X..X."];
/* two shelves of five; index 4 is the familiar brand (gold, upper right),
   index 6 is what the shopper wants (striped teal, lower left) */
const SHELF = [
  { x: 3, y: 6, c: 7 }, { x: 8, y: 6, c: 0 }, { x: 13, y: 6, c: 7 }, { x: 18, y: 6, c: 0 }, { x: 23, y: 6, c: 3 },
  { x: 3, y: 15, c: 0 }, { x: 8, y: 15, c: 2 }, { x: 13, y: 15, c: 7 }, { x: 18, y: 15, c: 0 }, { x: 23, y: 15, c: 7 },
];
const BRAND = 4, WANT = 6;

function product(put: Put, i: number, x: number, y: number, v: number) {
  fill(put, x, y, 3, 4, SHELF[i].c, v);
  if (i === WANT) { fill(put, x, y + 1, 3, 1, 0, v * 0.85); fill(put, x, y + 3, 3, 1, 0, v * 0.85); }
}

/* the store; gone: products not on the shelf right now; dim: how far
   the other products fade; pull: how strongly the familiar brand pulls */
function shopScene(put: Put, t: number, gone: number[], dim: number, pull: number) {
  fill(put, 1, 10, 28, 1, 1, 0.5);
  fill(put, 1, 19, 28, 1, 1, 0.5);
  fill(put, 1, 37, 28, 1, 1, 0.35);
  SHELF.forEach((p, i) => {
    if (gone.includes(i)) return;
    product(put, i, p.x, p.y, i === BRAND || i === WANT ? 0.9 : 0.6 * (1 - dim));
  });
  put(24, 5, 3, 0.75 + 0.25 * Math.sin(t * 6)); /* the familiar brand's badge */
  for (let k = 0; k < 2; k++) {
    const ph = (t * 0.7 + k / 2) % 1;
    const rr = 2.6 + ph * 3.2 * pull;
    ring(put, 24, 7.5, rr, rr * 0.85, 4, 0.85 * (1 - ph) * Math.min(1, pull));
  }
  spr(put, 1, 29, SHOPPER, { X: 0 }, 0.9);
  spr(put, 21, 32, CART, { X: 0 }, 0.6);
}

function drone(put: Put, t: number, x: number, y: number, carrying: number) {
  spr(put, x, y, Math.floor(t * 10) % 2 ? DRONE_A : DRONE_B, { X: 8 }, 1);
  if (carrying >= 0) product(put, carrying, x + 1, y + 3, 0.95);
}

/* the request bubble: one short line, or three full ones */
function request(put: Put, lines: number, k: number) {
  box(put, 7, 27, 12, 5, 0, 0.5 * ease(k * 3));
  put(6, 30, 0, 0.5 * ease(k * 3));
  const widths = lines === 1 ? [3] : [8, 8, 6];
  widths.forEach((w, i) => fill(put, 9, 28 + i, Math.round(w * rise(k, 0.2 + i * 0.25, 0.45 + i * 0.25)), 1, 0, 0.8));
}

/* what the shopper wants, in a thought cloud; c is its outline color */
function wish(put: Put, c: number, v: number) {
  ring(put, 4, 24, 3.2, 2.4, c, v);
  fill(put, 3, 23, 3, 3, 2, 0.9);
  fill(put, 3, 24, 3, 1, 0, 0.75);
}

export const story: StoryDef = {
  cols: 30, rows: 40,
  colors: ["#f4e9d6", "#5c6b7a", "#3fa7a0", "#d9a441", "#DA7756", "#7dc87d", "#c25048", "#9b6fb0", "#7fb3e6"],
  phases: [
    { dur: 7, render(u, put, t) {
      const [x, y] = path(u, [[13, 23, 0.12], [3, 11, 0.24], [16, 11, 0.34], [22, 11, 0.46], [22, 11, 0.5], [22, 25, 0.66], [13, 23, 0.85]]);
      const holding = u > 0.48 && u < 0.68;
      const inCart = u >= 0.68;
      shopScene(put, t, holding || inCart ? [BRAND] : [], 0, 1);
      request(put, 1, rise(u, 0, 0.3));
      wish(put, u > 0.72 ? 6 : 0, u > 0.72 ? 0.9 : 0.5);
      if (u > 0.3 && u < 0.48) line(put, 24, 10, x + 2, y, 4, 0.35 + 0.3 * Math.sin(t * 12)); /* the pull */
      drone(put, t, x, y, holding ? BRAND : -1);
      if (inCart) product(put, BRAND, 23, 29, 0.95);
      if (u > 0.72) spr(put, 23, 24, CROSS, { X: 6 }, rise(u, 0.72, 0.8));
    }},
    { dur: 6, render(u, put, t) {
      /* time passes: trip after trip brings the familiar brand, its
         sales stack up, and the text about it trains the next model */
      const trip = (u * 3) % 1;
      const [x, y] = path(trip, [[13, 23, 0], [22, 11, 0.35], [22, 25, 0.75], [13, 23, 1]]);
      const grow = rise(u, 0, 0.9);
      shopScene(put, t, [], 0.6 * grow, 1 + 1.4 * grow);
      wish(put, 0, 0.35);
      drone(put, t, x, y, trip > 0.35 && trip < 0.75 ? BRAND : -1);
      const hgt = Math.round(grow * 13);
      for (let k = 0; k < hgt; k++) fill(put, 28, 36 - k, 2, 1, 3, 0.85);
      for (let k = 0; k < 4; k++) {
        const p = (t * 0.9 + k / 4) % 1;
        put(lerp(28.5, x + 2, p), lerp(36 - hgt, y + 1, p), 3, 0.8 * grow * (1 - p));
      }
    }},
    { dur: 6.5, render(u, put, t) {
      const [x, y] = path(u, [[13, 23, 0.18], [20, 20, 0.28], [14, 20, 0.36], [7, 20, 0.46], [7, 20, 0.5], [22, 25, 0.68], [13, 23, 0.86]]);
      const holding = u > 0.48 && u < 0.7;
      const inCart = u >= 0.7;
      shopScene(put, t, holding || inCart ? [WANT] : [], 0, 1);
      const fade = 1 - rise(u, 0, 0.15);
      for (let k = 0; k < Math.round(13 * fade); k++) fill(put, 28, 36 - k, 2, 1, 3, 0.85 * fade);
      request(put, 3, rise(u, 0, 0.3));
      wish(put, u > 0.72 ? 5 : 0, u > 0.72 ? 0.95 : 0.5);
      if (u > 0.22 && u < 0.46) line(put, 24, 10, x + 2, y, 4, 0.5 * (1 - rise(u, 0.3, 0.46))); /* the pull, resisted */
      drone(put, t, x, y, holding ? WANT : -1);
      if (inCart) product(put, WANT, 23, 29, 0.95);
      if (u > 0.72) {
        spr(put, 22, 24, CHECK, { X: 5 }, rise(u, 0.72, 0.8));
        burst(put, 3, 28, rise(u, 0.74, 0.95), 5, 10, 4);
      }
    }},
  ],
};
