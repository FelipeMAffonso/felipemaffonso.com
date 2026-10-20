/* Concealing prices: how delayed price disclosure influences consumer
   purchase decisions (Journal of Consumer Research). An espresso machine,
   the product in most of the paper's studies, sits on a store counter
   with its price tag turned face down (coral): the price is hidden. While
   it stays hidden, the shopper guesses the price from the store, shown
   as a stack of coins in a thought bubble. In an upscale store (purple
   awning, a crown) the store's look keeps adding coins to the guess.
   When the tag flips, the real price pours out as gold coins beside the
   guess; it is lower than the guess, the coins the shopper expected to
   spend turn green, and the shopper takes the machine home. At a sale
   event (blue awning, a sale sign) the same hidden price lets the guess
   shrink instead. The same machine at the same price is revealed; it is
   now higher than the guess, the coins above the guess turn red, and the
   shopper walks away without it. */

import { type Put, type StoryDef, rise, spr, fill, ease, lerp, line, ring, CHECK, CROSS } from "./kit";

const CREAM = 0, SLATE = 1, GOLD = 2, TEAL = 3, PURPLE = 4, BLUE = 5, CORAL = 6, GREEN = 7, RED = 8;

const STAND = ["..X..", ".XXX.", "..X..", "XXXXX", "..X..", "..X..", ".X.X.", ".X.X."];
const WALK_A = ["..X..", ".XXX.", "..X..", "XXXXX", "..X..", "..X..", ".X.X.", "X...X"];
const WALK_B = ["..X..", ".XXX.", "..X..", ".XXX.", "X.X.X", "..X..", "..X..", ".X.X."];
/* the espresso machine: body, a dial, the brew head, a cup in the bay */
const MACHINE = [
  ".XXXXXXX.",
  "XXXXXXXXX",
  "XdXXXXXdX",
  "XXXXXXXXX",
  "XX.HHH.XX",
  "X.......X",
  "X..ccc..X",
  "X..ccc..X",
  "XXXXXXXXX",
];
const TAG = [".XXXX", "X.XXX", "XXXXX", ".XXXX"];
const CROWN = ["X..X..X", "XX.X.XX", "XXXXXXX", "XXXXXXX"];
const PERCENT = ["XX....X", "XX...X.", "....X..", "...X...", "..X....", ".X...XX", "X....XX"];
const ARROW = ["X...X", ".X.X.", "..X.."];

const BASE = 25; /* the bottom coin of both stacks sits on this row */
const PX = 11; /* the real price's stack */
const GX = 19; /* the guess's stack, inside the thought bubble */
const PRICE = 4; /* the machine's price, in coins, the same in both stores */
const START = 3; /* the guess from the machine alone, before the store adds to it */
const MX = 0, MY = 16; /* the machine on its stand */
const SX = 24; /* where the shopper stands */

function machine(put: Put, x: number, y: number, t: number) {
  spr(put, x, y, MACHINE, { X: TEAL, d: CREAM, H: SLATE, c: CREAM }, 0.9);
  const s = (t * 1.6) % 1; /* coffee drips from the brew head into the cup */
  put(x + 4, y + 5, CREAM, 0.5 + 0.5 * (s < 0.5 ? 1 : 0));
}

function awning(put: Put, c: number, wipe: number, prev: number) {
  for (let x = 0; x < 30; x++) {
    const col = x / 30 < wipe ? c : prev;
    const stripe = Math.floor(x / 2) % 2 === 0;
    for (let y = 0; y <= 2; y++) put(x, y, stripe ? col : CREAM, stripe ? 0.9 : 0.55);
    if (x % 2 === 0) put(x, 3, stripe ? col : CREAM, stripe ? 0.9 : 0.55);
  }
}

function counter(put: Put, stand: number) {
  fill(put, 0, BASE + 1, 16, 1, SLATE, 0.8);
  fill(put, MX, BASE, 9, 1, stand, 0.9); /* the stand under the machine, in the store's color */
  fill(put, 0, 37, 30, 1, SLATE, 0.5);
}

/* a coin stack of n coins on the shared baseline; color picks per coin */
/* each coin is two rows: a narrow rim over a full side, so a stack shows
   every coin */
function coin(put: Put, x: number, y: number, c: number, v: number) {
  fill(put, x, y, 4, 1, c, 0.8 * v);
  fill(put, x + 1, y - 1, 2, 1, c, v);
}
function stack(put: Put, x: number, n: number, col: (k: number) => number, v: number) {
  for (let k = 0; k < n; k++) coin(put, x, BASE - 2 * k, col(k), v);
}

function bubble(put: Put, v: number) {
  ring(put, GX + 1.5, BASE - 6, 5, 7.5, CREAM, 0.6 * v);
  put(23, 28, CREAM, 0.6 * v);
  put(24, 29, CREAM, 0.6 * v);
}

/* the price tag hanging from the machine: face down (coral) while the
   price is hidden; flip runs 0 to 1 as it turns face up */
function tag(put: Put, flip: number, v: number) {
  line(put, MX + 8, MY + 1, PX, MY - 2, SLATE, 0.8);
  const w = Math.abs(Math.cos(Math.PI * flip));
  const up = flip > 0.5;
  const cx = PX + 2;
  for (let r = 0; r < TAG.length; r++) {
    for (let c = 0; c < 5; c++) {
      if (TAG[r][c] !== "X") continue;
      const x = cx + (c - 2) * w;
      put(x, MY - 2 + r, up ? CREAM : CORAL, up ? 0.8 : v);
    }
  }
}

function shopper(put: Put, x: number, t: number, walking: boolean) {
  spr(put, x, 29, walking ? (Math.floor(t * 5) % 2 ? WALK_A : WALK_B) : STAND, { X: CREAM }, 0.9);
}

/* the dashed line that compares the two stacks at the height of n coins */
function compare(put: Put, n: number, v: number) {
  for (let x = PX + 4; x < GX; x++) if (x % 2 === 0) put(x, BASE - 2 * n, CREAM, 0.8 * v);
}

/* the real price pours out of the flipped tag, coin by coin */
function pour(put: Put, u: number, a: number, b: number, col: (k: number) => number) {
  const n = Math.floor(rise(u, a, b) * PRICE + 1e-6);
  stack(put, PX, Math.min(PRICE, n), col, 1);
  if (n < PRICE && u > a) {
    const f = (rise(u, a, b) * PRICE) % 1;
    coin(put, PX, Math.round(lerp(MY + 1, BASE - 2 * n, f)), GOLD, 1);
  }
}

export const story: StoryDef = {
  cols: 30, rows: 38,
  colors: ["#f4e9d6", "#5c6b7a", "#d9a441", "#3fa7a0", "#9b6fb0", "#7fb3e6", "#DA7756", "#7dc87d", "#c25048"],
  phases: [
    /* in an upscale store the price stays hidden, and the store's look
       keeps adding coins to the shopper's guess */
    { dur: 5.5, render(u, put, t) {
      awning(put, PURPLE, 1, PURPLE);
      spr(put, 11, 6, CROWN, { X: PURPLE }, 0.95);
      counter(put, PURPLE);
      machine(put, MX, MY, t);
      tag(put, 0, 0.85 + 0.15 * Math.sin(t * 5));
      shopper(put, SX, t, false);
      const b = rise(u, 0.05, 0.15);
      bubble(put, b);
      let n = Math.round(START * b);
      for (let i = 0; i < 3; i++) {
        const a = 0.25 + i * 0.17;
        const k = rise(u, a, a + 0.13);
        if (k >= 1) n++;
        else if (k > 0) { /* a glint leaves the crown and lands on the guess */
          const x = lerp(14, GX + 1.5, ease(k)), y = lerp(10, BASE - 2 * n - 2, ease(k));
          put(x, y, CREAM, 1); put(x - 1, y, CREAM, 0.7); put(x + 1, y, CREAM, 0.7); put(x, y - 1, CREAM, 0.7);
        }
      }
      stack(put, GX, n, () => CREAM, 1);
    }},
    /* the tag flips: the real price is lower than the guess, the coins
       the shopper expected to spend above it turn green, and the machine
       goes home with the shopper */
    { dur: 6, render(u, put, t) {
      awning(put, PURPLE, 1, PURPLE);
      spr(put, 11, 6, CROWN, { X: PURPLE }, 0.95);
      counter(put, PURPLE);
      const sold = ease(rise(u, 0.58, 0.84));
      const [mx, my] = sold < 0.5 ? [MX, lerp(MY, 28, sold * 2)] : [lerp(MX, 13, (sold - 0.5) * 2), 28];
      machine(put, mx, my, t);
      tag(put, rise(u, 0, 0.12), 1);
      shopper(put, SX, t, false);
      bubble(put, 1);
      const good = rise(u, 0.46, 0.54);
      stack(put, GX, START + 3, (k) => (k >= PRICE && good > 0.5 ? GREEN : CREAM), 1);
      pour(put, u, 0.12, 0.4, () => GOLD);
      compare(put, PRICE, rise(u, 0.42, 0.46));
      if (good > 0) spr(put, 25, 24, CHECK, { X: GREEN }, good);
    }},
    /* at a sale event the same hidden price lets the guess shrink */
    { dur: 5, render(u, put, t) {
      const wipe = ease(rise(u, 0, 0.18));
      awning(put, BLUE, wipe, PURPLE);
      if (wipe < 0.3) spr(put, 11, 6, CROWN, { X: PURPLE }, 0.95);
      else if (wipe > 0.45) spr(put, 11, 4, PERCENT, { X: BLUE }, 0.95);
      counter(put, wipe > 0.5 ? BLUE : PURPLE);
      machine(put, MX, MY, t);
      tag(put, 0, 0.85 + 0.15 * Math.sin(t * 5));
      shopper(put, SX, t, false);
      bubble(put, 1);
      let n = START;
      for (let i = 0; i < 2; i++) {
        const a = 0.28 + i * 0.22;
        const k = rise(u, a, a + 0.13);
        if (k <= 0) continue;
        if (k < 1) { /* an arrow leaves the sale sign and knocks a coin off */
          spr(put, lerp(12, GX, ease(k)), lerp(11, BASE - 2 * n - 4, ease(k)), ARROW, { X: BLUE }, 0.95);
        } else {
          n--;
          const f = rise(u, a + 0.13, a + 0.24);
          if (f < 1) coin(put, GX + Math.round(f * 2), Math.round(lerp(BASE - 2 * n, 36, f)), CREAM, 0.9 * (1 - f));
        }
      }
      stack(put, GX, n, () => CREAM, 1);
    }},
    /* the tag flips: the same price is now higher than the guess, the
       coins above the guess turn red, and the shopper walks away */
    { dur: 6, render(u, put, t) {
      awning(put, BLUE, 1, BLUE);
      spr(put, 11, 4, PERCENT, { X: BLUE }, 0.95);
      counter(put, BLUE);
      machine(put, MX, MY, t);
      tag(put, rise(u, 0, 0.12), 1);
      const leave = rise(u, 0.6, 0.86);
      if (leave < 1) shopper(put, lerp(SX, 31, ease(leave)), t, leave > 0);
      const fade = 1 - rise(u, 0.56, 0.62);
      bubble(put, fade);
      if (fade > 0) stack(put, GX, START - 2, () => CREAM, fade);
      const bad = rise(u, 0.46, 0.54);
      pour(put, u, 0.12, 0.4, (k) => (k >= START - 2 && bad > 0.5 ? RED : GOLD));
      compare(put, START - 2, rise(u, 0.42, 0.46) * fade);
      if (bad > 0) spr(put, 26, 25, CROSS, { X: RED }, bad);
    }},
  ],
};
