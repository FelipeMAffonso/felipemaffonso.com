/* Boundaries of constructive choice (Journal of Consumer Psychology).
   Two shoppers search the same kind of screen the experiments used:
   two options show, and a plus box brings up one more option each
   time it is clicked. Each option card shows three attribute bars.
   On the left screen the choice is easy: every card's bars are the
   same length, so the cards line up from better to worse. On the
   right screen the choice is hard: every card is long on one bar and
   short on another, so each option is better on one attribute and
   worse on another, and a question mark rises over that shopper.
   First both shoppers are asked to be accurate (the target): the
   hard choice makes the right-hand shopper stop early and pick a
   card that is not the best. Then both are asked to save effort (the
   hourglass): now the hard choice makes the right-hand shopper keep
   clicking, and the extra cards turn coral. Then each shopper first
   picks from a screen of fifty movies, which brings the target to
   mind beside the hourglass, and with both goals in mind the hard
   choice cuts the search short again. */

import { type Put, type StoryDef, rise, spr, box, fill, ease, lerp } from "./kit";

/* ---- colors ---- */
const CREAM = 0, SLATE = 1, BLUE = 2, TEAL = 3, GOLD = 4, CORAL = 5, GREEN = 6, RED = 7;

/* ---- sprites ---- */
const STAND = [".XXX.", ".XXX.", "..X..", "XXXXX", "X.X.X", "..X..", ".X.X.", ".X.X."];
const REACH = [".XXX..", ".XXX.X", "..X.X.", "XXXX..", "X.X...", "..X...", ".X.X..", ".X.X.."];
const TARGET = [".XXX.", "X...X", "X.X.X", "X...X", ".XXX."];
const HOURGLASS = ["XXXXX", ".X.X.", "..X..", ".X.X.", "XXXXX"];
const QUESTION = ["XXX", "..X", ".XX", ".X.", "...", ".X."];
const PLUS = ["..X..", ".XXX.", "..X.."];

/* ---- the two screens ---- */
const LEFT = 0, RIGHT = 15; /* panel x offsets; each panel is 15 wide */
/* the option cards, in the order the clicks reveal them: bar lengths
   for the three attributes. Easy cards have equal bars; the best easy
   card (index 5) is the widest. Hard cards trade one attribute off
   against another. */
const EASY = [3, 2, 3, 4, 2, 5, 3, 4, 2, 3].map((w) => [w, w, w]);
const HARD = [[5, 1, 3], [2, 4, 1], [1, 3, 5], [4, 2, 2], [3, 5, 1], [2, 1, 4], [5, 3, 2], [1, 5, 3], [4, 1, 5], [3, 4, 1]];

function slot(ox: number, i: number): [number, number] {
  return [ox + 2 + (i % 2) * 6, 3 + Math.floor(i / 2) * 4];
}

function card(put: Put, x: number, y: number, bars: number[], c: number, v: number) {
  bars.forEach((w, r) => fill(put, x, y + r, w, 1, c, v * (r === 1 ? 0.75 : 0.95)));
}

function monitor(put: Put, ox: number, v = 0.45) {
  box(put, ox, 1, 15, 23, SLATE, v);
}

/* one shopper's search on one screen. n: cards seen in the end; pick:
   the card chosen; good: whether that was the right pick for the
   goal; t0 and dt: when the clicking starts and how long each click
   takes (fractions of the phase); coralFrom: cards from this index on
   are the extra search the paper is about */
type Search = { hard: boolean; n: number; pick: number; good: boolean; t0: number; dt: number; coralFrom?: number };

function lastClick(s: Search) { return s.t0 + (s.n - 3) * s.dt; }
function decideAt(s: Search) { return lastClick(s) + 0.07; }

/* returns whether the shopper is reaching for the plus box right now */
function search(put: Put, ox: number, u: number, s: Search, fade: number): boolean {
  const opts = s.hard ? HARD : EASY;
  let shown = 0;
  for (let i = 0; i < s.n; i++) {
    const at = i < 2 ? 0.03 : s.t0 + (i - 2) * s.dt;
    if (u < at) break;
    shown = i + 1;
    const k = rise(u, at, at + 0.03);
    const [x, y] = slot(ox, i);
    const coral = s.coralFrom !== undefined && i >= s.coralFrom;
    card(put, x, y, opts[i], coral ? CORAL : BLUE, (0.35 + 0.65 * k) * fade);
  }
  const decided = u >= decideAt(s);
  let reaching = false;
  if (!decided && shown < 10) {
    /* the plus box sits in the next free slot and flashes when clicked */
    const [x, y] = slot(ox, shown);
    const next = shown < 2 ? 1 : s.t0 + (shown - 2) * s.dt;
    const flash = shown < s.n ? rise(u, next - 0.03, next) : 0;
    reaching = flash > 0;
    spr(put, x, y, PLUS, { X: CREAM }, (0.55 + 0.45 * flash) * fade);
  }
  if (decided) {
    const [x, y] = slot(ox, s.pick);
    const k = ease(rise(u, decideAt(s), decideAt(s) + 0.05));
    box(put, x - 1, y - 1, 7, 5, s.good ? GREEN : RED, 0.95 * k * fade);
  }
  return reaching;
}

/* a shopper under each screen, with the goal above the head */
function shopper(put: Put, t: number, ox: number, reach: boolean, goals: number[][], unsure: number, v = 1) {
  spr(put, ox + 5, 31, reach ? REACH : STAND, { X: CREAM }, 0.9 * v);
  goals.forEach(([g, x, a]) => {
    if (a <= 0) return;
    spr(put, ox + x, 25, g === TEAL ? TARGET : HOURGLASS, { X: g }, a * v);
    /* a grain of sand falls through the hourglass */
    if (g === GOLD) put(ox + x + 2, 26 + 2 * (Math.floor(t * 1.5) % 2), CREAM, 0.85 * a * v);
  });
  if (unsure > 0) spr(put, ox + 11, 31, QUESTION, { X: CREAM }, 0.95 * unsure * v);
}

export const story: StoryDef = {
  cols: 30, rows: 39,
  colors: ["#f4e9d6", "#5c6b7a", "#7fb3e6", "#3fa7a0", "#d9a441", "#DA7756", "#7dc87d", "#c25048"],
  phases: [
    /* asked to be accurate: the easy chooser searches long and finds
       the best card; the hard chooser stops early and misses it */
    { dur: 6.5, render(u, put, t) {
      const fade = 1 - rise(u, 0.94, 1);
      const easy: Search = { hard: false, n: 9, pick: 5, good: true, t0: 0.14, dt: 0.065 };
      const hard: Search = { hard: true, n: 5, pick: 3, good: false, t0: 0.14, dt: 0.065 };
      monitor(put, LEFT); monitor(put, RIGHT);
      const ra = search(put, LEFT, u, easy, fade);
      const rb = search(put, RIGHT, u, hard, fade);
      const g = rise(u, 0, 0.08);
      shopper(put, t, LEFT, ra, [[TEAL, 5, g]], 0);
      shopper(put, t, RIGHT, rb, [[TEAL, 5, g]], rise(u, 0.12, 0.24));
    }},
    /* asked to save effort: the easy chooser takes the fourth card and
       stops; the hard chooser keeps clicking (coral) */
    { dur: 6.5, render(u, put, t) {
      const fade = 1 - rise(u, 0.94, 1);
      const easy: Search = { hard: false, n: 4, pick: 3, good: true, t0: 0.14, dt: 0.065 };
      const hard: Search = { hard: true, n: 9, pick: 2, good: false, t0: 0.14, dt: 0.065, coralFrom: 4 };
      monitor(put, LEFT); monitor(put, RIGHT);
      const ra = search(put, LEFT, u, easy, fade);
      const rb = search(put, RIGHT, u, hard, fade);
      const g = rise(u, 0, 0.08);
      shopper(put, t, LEFT, ra, [[GOLD, 5, g]], 0);
      shopper(put, t, RIGHT, rb, [[GOLD, 5, g]], rise(u, 0.12, 0.24));
    }},
    /* a first choice from fifty movies brings accuracy to mind beside
       effort */
    { dur: 3.5, render(u, put, t) {
      monitor(put, LEFT); monitor(put, RIGHT);
      const out = 1 - rise(u, 0.82, 0.96);
      for (const ox of [LEFT, RIGHT]) {
        for (let k = 0; k < 50; k++) {
          const at = 0.04 + 0.3 * (k / 50);
          if (u < at) continue;
          const x = ox + 3 + (k % 5) * 2, y = 3 + Math.floor(k / 5) * 2;
          put(x, y, BLUE, 0.8 * out);
        }
        /* the shopper picks one of the fifty */
        const pk = rise(u, 0.36, 0.42) * out;
        if (pk > 0) box(put, ox + 6, 10, 3, 3, CREAM, 0.9 * pk);
      }
      const slide = ease(rise(u, 0.4, 0.75));
      for (const ox of [LEFT, RIGHT]) {
        shopper(put, t, ox, false, [[GOLD, lerp(5, 8, slide), 1], [TEAL, lerp(5, 2, slide), slide]], 0);
      }
    }},
    /* with both goals in mind, the hard choice cuts search for both */
    { dur: 6, render(u, put, t) {
      const easy: Search = { hard: false, n: 5, pick: 3, good: true, t0: 0.14, dt: 0.075 };
      const hard: Search = { hard: true, n: 3, pick: 1, good: false, t0: 0.14, dt: 0.075 };
      monitor(put, LEFT); monitor(put, RIGHT);
      const fade = 1 - rise(u, 0.95, 1);
      const ra = search(put, LEFT, u, easy, fade);
      const rb = search(put, RIGHT, u, hard, fade);
      shopper(put, t, LEFT, ra, [[TEAL, 2, 1], [GOLD, 8, 1]], 0);
      shopper(put, t, RIGHT, rb, [[TEAL, 2, 1], [GOLD, 8, 1]], rise(u, 0.1, 0.22));
    }},
  ],
};
