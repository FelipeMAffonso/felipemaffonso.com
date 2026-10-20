/* Serendipity (Journal of Marketing). An art gallery, as in the paper's
   museum study, with the paper's enjoyment slider underneath (from "I
   hated it" on the left to "I loved it" at the heart). First the visitor
   chooses: two covered paintings, the visitor points at one and it is unveiled;
   the visitor likes it, and the gray tick marks how much. Then chance: the visitor walks
   down the hallway, turns the corner and happens upon the same lovely
   painting; this good surprise (coral) moves the slider past the tick.
   The surprise has to be good: turning the corner onto an unattractive
   painting brings no delight (red), and the slider falls. The surprise
   has to look like chance: when a gallery worker (purple) carries the
   painting over and points it out as picked for the visitor, who likes it only
   as much as the one the visitor chose. */

import { type Put, type StoryDef, h, rise, spr, box, fill, ease, lerp, line } from "./kit";

const CREAM = 0, GRAY = 1, GOLD = 2, BLUE = 3, TEAL = 4, CORAL = 5, RED = 6, BROWN = 7, PURPLE = 8;

const STAND = [".XXX.", ".XXX.", "..X..", "XXXXX", "X.X.X", "..X..", ".X.X.", ".X.X."];
const WALK_A = [".XXX.", ".XXX.", "..X..", ".XXX.", "X.X.X", "..X..", ".X.X.", "X...X"];
const WALK_B = [".XXX.", ".XXX.", "..X..", "XXXXX", "..X..", "..X..", ".X.X.", ".X.X."];
const POINT_L = ["..XXX.", "..XXX.", "X..X..", ".XXXXX", "...X.X", "...X..", "..X.X.", "..X.X."];
const CARRY = ["X...X", "XXXXX", ".XXX.", "..X..", ".XXX.", "..X..", ".X.X.", ".X.X."];
const HEART = [".X.X.", "XXXXX", ".XXX.", "..X.."];
const BROKEN = [".X.X.", "XX.XX", ".X.X.", "..X.."];
const LOVELY = [
  "FFFFFFFFF",
  "FBBBBBSBF",
  "FBBBBSSSF",
  "FBBTBBSBF",
  "FBTTTBBTF",
  "FTTTTTTTF",
  "FFFFFFFFF",
];
const UGLY = [
  "FFFFFFFFF",
  "FMM.MMM.F",
  "F.MMM.M.F",
  "FMM..MMMF",
  "F.MMMM..F",
  "FMM.M.MMF",
  "FFFFFFFFF",
];
const PAINT = { F: GOLD, B: BLUE, S: GOLD, T: TEAL, M: BROWN };

/* enjoyment, 0 to 100, as the paper measured it */
const CHOICE = 60, CHANCE = 70, BAD = 43, PLANNED = 57;
const sx = (v: number) => 1 + (v / 100) * 24;

function room(put: Put) {
  fill(put, 0, 3, 30, 1, GRAY, 0.5);
  fill(put, 0, 29, 30, 1, GRAY, 0.55);
}

function covered(put: Put, x: number, y: number, v: number) {
  box(put, x, y, 9, 7, GOLD, 0.8 * v);
  for (let r = 1; r < 6; r++) for (let c = 1; c < 8; c++) if ((r + c) % 2 === 0) put(x + c, y + r, GRAY, 0.6 * v);
}

/* the enjoyment slider; tick marks the level when the visitor chose */
function slider(put: Put, val: number, c: number, tick: boolean) {
  fill(put, 1, 33, 25, 1, GRAY, 0.5);
  const x = Math.round(sx(val));
  if (val > 0) fill(put, 1, 33, x, 1, c, 0.9);
  fill(put, x, 32, 1, 3, val < 1 ? GRAY : c, val < 1 ? 0.7 : 1);
  if (tick) { put(Math.round(sx(CHOICE)), 31, GRAY, 0.9); put(Math.round(sx(CHOICE)), 35, GRAY, 0.9); }
  spr(put, 26, 32, ["X.X", "XXX", ".X."], { X: CREAM }, 0.85);
}

function walker(put: Put, t: number, x: number, moving: boolean) {
  spr(put, x, 21, moving ? (Math.floor(t * 5) % 2 ? WALK_A : WALK_B) : STAND, { X: CREAM }, 0.95);
}

/* the good surprise: sparkles twinkle around the painting the visitor found */
function sparkles(put: Put, k: number, t: number) {
  if (k <= 0 || k >= 1) return;
  const v = Math.min(1, k * 6, (1 - k) * 4);
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const d = 1 + 0.6 * Math.sin(t * 7 + i * 1.3);
    const x = 22 + Math.cos(a) * (6 + d), y = 10 + Math.sin(a) * (4.5 + d);
    if (h(i, Math.floor(t * 8), 3) < 0.7) put(x, y, CORAL, v);
  }
}

/* down the hallway and round the corner onto a painting; the visitor passes
   behind the corner wall for a moment */
function corner(put: Put, u: number, t: number, art: string[]) {
  room(put);
  fill(put, 14, 4, 2, 25, GRAY, 0.65); /* the corner */
  const x = lerp(-5, 20, ease(rise(u, 0, 0.42)));
  const seen = rise(u, 0.3, 0.38); /* the visitor rounds the corner */
  if (seen > 0) spr(put, 18, 7, art, PAINT, seen);
  const hidden: Put = (px, py, c, v) => { const rx = Math.round(px); if (rx < 14 || rx > 15) put(px, py, c, v); };
  walker(hidden, t, x, u < 0.42);
  return seen;
}

export const story: StoryDef = {
  cols: 30, rows: 37,
  colors: ["#f4e9d6", "#8b9099", "#d9a441", "#7fb3e6", "#3fa7a0", "#DA7756", "#c25048", "#9a7b55", "#9b6fb0"],
  phases: [
    { dur: 5.5, render(u, put, t) {
      /* the visitor chooses one of two covered paintings */
      room(put);
      const lift = rise(u, 0.45, 0.6);
      if (lift < 1) covered(put, 3, 7, 1 - lift);
      if (lift > 0) spr(put, 3, 7, LOVELY, PAINT, lift);
      covered(put, 18, 7, 1);
      fill(put, 5, 15, 5, 1, CREAM, 0.6); fill(put, 20, 15, 5, 1, CREAM, 0.6); /* the titles */
      /* the visitor weighs one against the other, then points */
      if (u > 0.1 && u < 0.38) box(put, Math.floor(t * 2.5) % 2 ? 2 : 17, 6, 11, 9, CREAM, 0.75);
      if (u >= 0.38 && u < 0.6) box(put, 2, 6, 11, 9, CREAM, 0.9);
      if (u >= 0.38) spr(put, 11, 21, POINT_L, { X: CREAM }, 0.95);
      else spr(put, 12, 21, STAND, { X: CREAM }, 0.95);
      const like = rise(u, 0.62, 0.7);
      if (like > 0) spr(put, 12, 16, HEART, { X: CREAM }, like);
      slider(put, CHOICE * ease(rise(u, 0.62, 0.8)), CREAM, false);
    }},
    { dur: 6, render(u, put, t) {
      /* by chance, round the corner: a good surprise */
      const seen = corner(put, u, t, LOVELY);
      sparkles(put, rise(u, 0.34, 0.8), t);
      const joy = rise(u, 0.44, 0.52);
      if (joy > 0) spr(put, 20, 15 - Math.round(rise(u, 0.44, 0.6)), HEART, { X: CORAL }, joy);
      slider(put, seen > 0 ? CHANCE * ease(rise(u, 0.46, 0.66)) : 0, CORAL, true);
    }},
    { dur: 5, render(u, put, t) {
      /* the same chance, but an unattractive painting: no delight */
      corner(put, u, t, UGLY);
      const sad = rise(u, 0.46, 0.54);
      if (sad > 0) spr(put, 20, 15, BROKEN, { X: RED }, sad);
      slider(put, BAD * ease(rise(u, 0.48, 0.68)), RED, true);
    }},
    { dur: 6, render(u, put, t) {
      /* a gallery worker brings it and points it out: picked for the visitor */
      room(put);
      const wx = lerp(31, 20, ease(rise(u, 0, 0.32)));
      const hang = ease(rise(u, 0.34, 0.48));
      const px = lerp(wx - 2, 10, hang), py = lerp(13, 7, hang); /* resting on the raised arms */
      spr(put, px, py, LOVELY, PAINT, 1);
      if (u < 0.34) spr(put, wx, 21, CARRY, { X: PURPLE }, 0.95);
      else if (u < 0.5) spr(put, wx, 21, STAND, { X: PURPLE }, 0.95);
      else {
        spr(put, wx - 1, 21, POINT_L, { X: PURPLE }, 0.95);
        if (u < 0.72) line(put, wx - 2, 20, 19, 12, PURPLE, 0.6 + 0.3 * Math.sin(t * 8));
      }
      walker(put, t, 7, false);
      const like = rise(u, 0.6, 0.68);
      if (like > 0) spr(put, 7, 16, HEART, { X: CREAM }, like);
      slider(put, PLANNED * ease(rise(u, 0.6, 0.78)), CREAM, true);
    }},
  ],
};
