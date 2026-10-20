/* Consumer responses to infectious disease cues (European Journal of
   Marketing). One shopper, one shop, two trips. The shopper's thought
   bubble holds the three things the paper says a disease cue changes:
   feelings (a face), attention (an eye) and motive (a heart for others).
   On a normal day the shopper eats a free sample, tries the new product,
   waits right behind another shopper and drops a coin in the charity jar.
   On the second trip the customer in line sneezes: in coral, the face
   turns to disgust, the eye narrows and the heart becomes a shield. Then
   choices that have nothing to do with germs change: the shopper leans
   away from the sample, takes the familiar brand, keeps a distance in the
   queue and keeps the coin. */

import { type Put, type StoryDef, rise, spr, fill, ease, lerp, path } from "./kit";

const CREAM = 0, GRAY = 1, SLATE = 2, VIOLET = 3, GOLD = 4, CORAL = 5, RED = 6;

/* people: the shopper (cream) and the other customer (grey) */
const WALK_A = [".XXX.", ".XXX.", "..X..", "XXXXX", "X.X.X", "..X..", ".X.X.", "X...X"];
const WALK_B = [".XXX.", ".XXX.", "..X..", ".XXX.", ".XXX.", "..X..", "..X..", ".X.X."];
const STAND = [".XXX.", ".XXX.", "..X..", "XXXXX", "X.X.X", "..X..", ".X.X.", ".X.X."];
const LEAN = ["...XXX", "...XXX", "...X..", "..XXXX", "..XX.X", "..X...", ".X.X..", ".X.X.."]; /* leaning away from the table */
const SNEEZE = ["XXX..", "XXX..", ".X...", "XXXXX", "X.X.X", "..X..", ".X.X.", ".X.X."]; /* head jerks forward */

/* the thought bubble: before and after the cue */
const SMILE = [".X.X.", ".X.X.", ".....", "X...X", ".XXX."];
const DISGUST = ["XX.XX", ".....", ".....", ".XXX.", "X...X"];
const EYE_WIDE = ["..XXX..", ".X...X.", "X..X..X", ".X...X.", "..XXX.."];
const EYE_NARROW = [".......", ".XXXXX.", "X..X..X", ".XXXXX.", "......."];
const HEART = [".X.X.", "XXXXX", "XXXXX", ".XXX.", "..X.."];
const SHIELD = ["XXXXX", "X...X", "X...X", ".X.X.", "..X.."];
const JAR_HEART = ["X.X", "XXX", ".X."];

const FLOOR = 38, PY = 30; /* people stand on rows 30 to 37 */
const BY = 5; /* the bubble's icons start on this row */
const OTHER_X = 19; /* the other customer waits in line at the register */

/* the shop, left to right: the free-sample counter, the shelf, the
   register with its charity jar */
function shop(put: Put, t: number, cups: number, shelfGone: number, coins: number, glow: number) {
  fill(put, 0, FLOOR, 30, 1, SLATE, 0.4);
  /* the free-sample table with its cups */
  fill(put, 0, 33, 5, 1, SLATE, 0.8);
  fill(put, 2, 34, 1, 4, SLATE, 0.6);
  fill(put, 1, 37, 3, 1, SLATE, 0.6);
  for (let i = 0; i < cups; i++) { put(i * 2, 32, CREAM, 0.95); put(i * 2, 31, GOLD, 0.8); }
  /* the shelf: the new product (violet, it sparkles) on top, the
     familiar brand (gold, with its label) below */
  for (const x of [10, 16]) fill(put, x, 19, 1, 19, SLATE, 0.55);
  for (const y of [19, 24, 29]) fill(put, 10, y, 7, 1, SLATE, 0.65);
  if (shelfGone !== VIOLET) {
    fill(put, 11, 20, 3, 4, VIOLET, 0.9);
    put(12, 21, CREAM, 0.5 + 0.5 * (0.5 + 0.5 * Math.sin(t * 7)));
  }
  fill(put, 14, 21, 2, 3, GRAY, 0.5);
  if (shelfGone !== GOLD) {
    fill(put, 11, 25, 3, 4, GOLD, 0.9);
    fill(put, 11, 26, 3, 1, CREAM, 0.75);
  }
  fill(put, 14, 26, 2, 3, GRAY, 0.5);
  /* the register counter and its charity jar, marked with a heart */
  fill(put, 24, 34, 6, 1, SLATE, 0.8);
  for (const x of [24, 29]) fill(put, x, 35, 1, 3, SLATE, 0.55);
  for (let y = 28; y <= 33; y++) { put(25, y, CREAM, 0.7); put(29, y, CREAM, 0.7); }
  fill(put, 25, 33, 5, 1, CREAM, 0.7);
  spr(put, 26, 25, JAR_HEART, { X: glow > 0 ? GOLD : CREAM }, glow > 0 ? glow : 0.7);
  for (let i = 0; i < coins; i++) put(26 + (i % 3), 32 - Math.floor(i / 3), GOLD, 0.95);
}

/* the shopper's thought bubble, joined to the head; trig is how far each of the
   three changes has happened (0 calm, 1 changed) */
function mind(put: Put, hx: number, trig: [number, number, number]) {
  const n = 64;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    put(15 + Math.cos(a) * 14, BY + 2.5 + Math.sin(a) * 4.8, CREAM, 0.45);
  }
  put(lerp(15, hx, 0.35), lerp(BY + 8, PY - 1, 0.35), CREAM, 0.7);
  put(lerp(15, hx, 0.7), lerp(BY + 8, PY - 1, 0.7), CREAM, 0.7);
  const icon = (calm: string[], changed: string[], x: number, k: number) => {
    if (k <= 0) spr(put, x, BY, calm, { X: CREAM }, 0.75);
    else spr(put, x, BY, changed, { X: CORAL }, k < 0.35 ? 1 : 0.9);
  };
  icon(SMILE, DISGUST, 4, trig[0]);
  icon(EYE_WIDE, EYE_NARROW, 12, trig[1]);
  icon(HEART, SHIELD, 21, trig[2]);
}

function person(put: Put, x: number, art: string[], c: number, v: number) {
  spr(put, Math.round(x), PY, art, { X: c }, v);
}

/* what the shopper carries: the product picked, held at the chest */
function carry(put: Put, x: number, c: number) {
  fill(put, Math.round(x) + 1, PY + 3, 3, 2, c, 0.95);
}

const walkArt = (moving: boolean, t: number) => (moving ? (Math.floor(t * 5) % 2 ? WALK_A : WALK_B) : STAND);

export const story: StoryDef = {
  cols: 30, rows: 40,
  colors: ["#f4e9d6", "#8b9099", "#5c6b7a", "#9b6fb0", "#d9a441", "#DA7756", "#c25048"],
  phases: [
    /* a normal day: sample, the new product, close in line, a coin */
    { dur: 7.5, render(u, put, t) {
      const [x] = path(u, [[-5, 0, 0], [5, 0, 0.12], [5, 0, 0.26], [11, 0, 0.34], [11, 0, 0.46], [14, 0, 0.54], [14, 0, 0.68], [19, 0, 0.76]]);
      const moving = (u < 0.12) || (u > 0.26 && u < 0.34) || (u > 0.46 && u < 0.54) || (u > 0.68 && u < 0.76);
      const ate = u > 0.22, picked = u > 0.44;
      const given = u > 0.88;
      shop(put, t, ate ? 2 : 3, picked ? VIOLET : -1, given ? 3 : 2, given ? 0.75 + 0.25 * Math.sin(t * 6) : 0);
      /* the sample goes to the shopper's mouth */
      if (u > 0.14 && u <= 0.22) {
        const k = ease(rise(u, 0.14, 0.22));
        put(lerp(4, 7, k), lerp(33, PY + 1, k), CREAM, 0.95);
      }
      /* the new product comes off the shelf into the shopper's hands */
      if (u > 0.36 && u <= 0.44) {
        const k = ease(rise(u, 0.36, 0.44));
        fill(put, Math.round(lerp(11, x + 1, k)), Math.round(lerp(20, PY + 3, k)), 3, 2, VIOLET, 0.95);
      }
      /* the other customer pays and leaves */
      const ox = u < 0.58 ? OTHER_X : lerp(OTHER_X, 32, rise(u, 0.58, 0.72));
      person(put, ox, u > 0.58 && u < 0.72 ? walkArt(true, t) : STAND, GRAY, 0.85);
      person(put, x, walkArt(moving, t), CREAM, 0.95);
      if (picked) carry(put, x, VIOLET);
      /* a coin into the charity jar */
      if (u > 0.78 && u <= 0.88) {
        const k = rise(u, 0.78, 0.88);
        put(lerp(x + 4, 27, k), lerp(PY + 3, 30, k) - Math.sin(Math.PI * k) * 5, GOLD, 1);
      }
      mind(put, x + 2, [0, 0, 0]);
    }},
    /* a second trip: the customer in line sneezes, and the shopper's feelings,
       attention and motive change */
    { dur: 4.5, render(u, put, t) {
      const [x] = path(u, [[-5, 0, 0], [5, 0, 0.26]]);
      shop(put, t, 3, -1, 3, 0);
      const sneeze = u > 0.3 && u < 0.44;
      person(put, OTHER_X - (sneeze ? 1 : 0), sneeze ? SNEEZE : STAND, GRAY, 0.85);
      /* the spray of droplets, forward from the sneeze */
      const b = rise(u, 0.32, 0.66);
      if (b > 0 && b < 1) {
        for (let i = 0; i < 22; i++) {
          const a = Math.PI + (((i * 5) % 11) / 10 - 0.5) * 1.0;
          const d = 1 + ease(b) * (4 + 7 * ((i * 7) % 6) / 5);
          put(OTHER_X - 0.5 + Math.cos(a) * d, PY + 1.5 + Math.sin(a) * d * 0.9, RED, b < 0.7 ? 1 : 1 - (b - 0.7) * 1.5);
        }
      }
      person(put, x, walkArt(u < 0.26, t), CREAM, 0.95);
      mind(put, x + 2, [rise(u, 0.56, 0.62), rise(u, 0.66, 0.72), rise(u, 0.76, 0.82)]);
    }},
    /* everything else changes too: no sample, the familiar brand, a gap
       in the queue, and the coin stays in the shopper's pocket */
    { dur: 9.5, render(u, put, t) {
      const [x] = path(u, [[5, 0, 0], [5, 0, 0.11], [11, 0, 0.19], [11, 0, 0.31], [7, 0, 0.37], [7, 0, 0.64], [19, 0, 0.75]]);
      const moving = (u > 0.11 && u < 0.19) || (u > 0.31 && u < 0.37) || (u > 0.64 && u < 0.75);
      const picked = u > 0.29;
      shop(put, t, 3, picked ? GOLD : -1, 3, 0);
      /* the familiar brand comes off the shelf */
      if (u > 0.21 && u <= 0.29) {
        const k = ease(rise(u, 0.21, 0.29));
        fill(put, Math.round(lerp(11, x + 1, k)), Math.round(lerp(25, PY + 3, k)), 3, 2, GOLD, 0.95);
      }
      const ox = u < 0.52 ? OTHER_X : lerp(OTHER_X, 32, rise(u, 0.52, 0.64));
      person(put, ox, u > 0.52 && u < 0.64 ? walkArt(true, t) : STAND, GRAY, 0.85);
      const leaning = u < 0.11;
      person(put, x, leaning ? LEAN : walkArt(moving, t), CREAM, 0.95);
      if (picked) carry(put, x, GOLD);
      /* the coin starts toward the jar, then goes back to the shopper's hand */
      if (u > 0.77 && u < 0.87) {
        const k = Math.sin(Math.PI * rise(u, 0.77, 0.87));
        put(lerp(x + 4, 25, k * 0.5), PY + 3 - k * 3, GOLD, 1);
      }
      mind(put, x + 2, [1, 1, 1]);
    }},
  ],
};
