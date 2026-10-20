/* When are less precise predictions more credible? (Journal of
   Experimental Psychology: General). The scene is the paper's Study 3:
   five judges give the combined score of an NBA Finals game, from one
   exact number (top) to a very wide range (bottom), each drawn as an
   interval around the same middle. A blue bar beside each judge is how
   credible people find that judge, and the coral frame marks the judge
   they pick. The gold strip under the court shows, on the same scale as
   the intervals, the final scores the game can have.
   First the game has already been played: the scoreboard holds one
   final score, the ball lies still, and the strip shows one point. The
   answer is knowable, credibility falls as the interval widens, and the
   exact judge is picked. Then the next game is still to come: shots go
   in or bounce out, the scoreboard runs through possible totals, and
   each one lands on the strip, building a spread. The answer is partly
   chance, credibility rises and then falls with width, and the judge
   whose range matches that spread is picked, while the widest range is
   still the least credible. */

import { type Put, type StoryDef, h, rise, spr, box, fill, ease, lerp, line, path } from "./kit";

const CREAM = 0, SLATE = 1, GOLD = 2, TEAL = 3, BLUE = 4, CORAL = 5;

const DIGITS: string[][] = [
  ["XXX", "X.X", "X.X", "X.X", "XXX"],
  [".X.", "XX.", ".X.", ".X.", "XXX"],
  ["XXX", "..X", "XXX", "X..", "XXX"],
  ["XXX", "..X", "XXX", "..X", "XXX"],
  ["X.X", "X.X", "XXX", "..X", "..X"],
  ["XXX", "X..", "XXX", "..X", "XXX"],
  ["XXX", "X..", "XXX", "X.X", "XXX"],
  ["XXX", "..X", ".X.", ".X.", ".X."],
  ["XXX", "X.X", "XXX", "X.X", "XXX"],
  ["XXX", "X.X", "XXX", "..X", "XXX"],
];
const JUDGE = [".XX.", ".XX.", "XXXX"]; /* head and shoulders */
const BALL = ["XX", "XX"];

const MID = 14; /* every judge's interval is centered here */
const HALF = [0, 1, 3, 5, 8]; /* exact, 200-205, 190-210, 170-230, 140-260 */
const ROW = (i: number) => 16 + 4 * i; /* top row of judge i */
const STRIP = 12; /* the row where the game's possible final scores land */
const BAR_X = 24; /* credibility bars grow right from here, up to 5 cells */
const PAST = [5, 4, 3, 2, 1]; /* finished game: credibility falls with width */
const NEXT = [2, 3, 5, 3, 1]; /* upcoming game: it rises, then falls */
/* possible totals for the upcoming game and where each lands on the
   strip, drawn on the scale of the 190 to 210 judge's bracket (one cell
   is about three and a half points), so together they span that bracket */
const TOTALS: [number, number][] = [
  [198, -1], [205, 1], [194, -2], [208, 2], [201, 0], [190, -3], [204, 1], [211, 3], [197, -1], [202, 0], [209, 2], [193, -2],
];

function scoreboard(put: Put, n: number | null, v: number) {
  box(put, 0, 0, 15, 9, SLATE, 0.8);
  if (n === null) {
    for (const x of [2, 6, 10]) fill(put, x, 4, 3, 1, CREAM, 0.6);
    return;
  }
  [Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10].forEach((d, i) => spr(put, 2 + 4 * i, 2, DIGITS[d], { X: CREAM }, v));
}

function court(put: Put, swish: number) {
  line(put, 27, 0, 27, 5, CREAM, 0.8);
  line(put, 28, 5, 28, 9, SLATE, 0.8);
  line(put, 22, 5, 26, 5, GOLD, 0.95);
  const s = swish > 0 ? 1 : 0;
  for (const x of [22, 24, 26]) put(x, 6 + s, CREAM, 0.6 + 0.4 * swish);
  for (const x of [23, 25]) put(x, 7 + s, CREAM, 0.6 + 0.4 * swish);
  fill(put, 0, 10, 30, 1, SLATE, 0.6);
  line(put, MID - 8, STRIP + 1, MID + 8, STRIP + 1, SLATE, 0.6);
}

/* judge i and the interval it gives; k grows the interval from its middle */
function judge(put: Put, i: number, k: number, hop: number) {
  const y = ROW(i);
  spr(put, 1, y - hop, JUDGE, { X: CREAM }, 0.9);
  if (k <= 0) return;
  const w = Math.round(HALF[i] * ease(k));
  for (let r = y; r <= y + 2; r++) { put(MID - w, r, TEAL, 0.95); put(MID + w, r, TEAL, 0.95); }
  line(put, MID - w, y + 1, MID + w, y + 1, TEAL, 0.95);
  put(MID, y + 1, CREAM, 1);
}

function bar(put: Put, i: number, len: number) {
  const n = Math.round(len);
  if (n > 0) fill(put, BAR_X, ROW(i), n, 3, BLUE, 0.9);
}

function pick(put: Put, y: number, v: number) {
  if (v > 0) box(put, 0, y - 1, 30, 5, CORAL, v);
}

export const story: StoryDef = {
  cols: 30, rows: 39,
  colors: ["#f4e9d6", "#5c6b7a", "#d9a441", "#3fa7a0", "#7fb3e6", "#DA7756"],
  phases: [
    /* five judges give the same game's score, from one exact number to a
       very wide range */
    { dur: 4.5, render(u, put, t) {
      scoreboard(put, null, 1);
      court(put, 0);
      const b = Math.abs(Math.sin(t * 5));
      spr(put, 17, 8 - Math.round(b * 3), BALL, { X: GOLD }, 0.95);
      for (let i = 0; i < 5; i++) {
        const a = 0.08 + 0.13 * i;
        if (u > a) judge(put, i, rise(u, a + 0.03, a + 0.15), 0);
      }
    }},
    /* the game is over and its score is fixed: credibility falls as the
       interval widens, and people pick the exact judge */
    { dur: 6.5, render(u, put) {
      const settle = rise(u, 0, 0.12);
      scoreboard(put, settle < 1 ? null : 203, 1);
      if (settle > 0 && settle < 1) for (const x of [2, 6, 10]) fill(put, x, 2, 3, 5, CREAM, 0.5 + 0.5 * settle);
      court(put, 0);
      spr(put, lerp(17, 19, ease(settle)), 8, BALL, { X: GOLD }, 0.95);
      /* the one final score drops onto the strip */
      const drop = ease(rise(u, 0.1, 0.2));
      if (drop > 0) { put(MID, lerp(8, STRIP, drop), GOLD, 1); put(MID, lerp(8, STRIP, drop) - 1, GOLD, 0.9 * drop); }
      const chosen = rise(u, 0.66, 0.74);
      for (let i = 0; i < 5; i++) {
        judge(put, i, 1, i === 0 && chosen > 0 && chosen < 1 ? 1 : 0);
        bar(put, i, PAST[i] * ease(rise(u, 0.22 + 0.07 * i, 0.32 + 0.07 * i)));
      }
      pick(put, ROW(0), chosen);
    }},
    /* the next game is still to come and its score is partly chance:
       possible totals spread across the strip, credibility rises and then
       falls with width, and people pick the range that matches the spread */
    { dur: 7.5, render(u, put, t) {
      const roll = Math.floor(u * 7.5 * 2.4);
      const k = Math.min(TOTALS.length - 1, roll);
      scoreboard(put, TOTALS[roll % TOTALS.length][0], 0.95);
      for (let i = 0; i <= k; i++) {
        const fresh = i === k ? rise((u * 7.5 * 2.4) % 1, 0, 0.3) : 1;
        put(MID + TOTALS[i][1], STRIP, GOLD, 0.6 + 0.4 * fresh);
      }
      /* shots from the floor: some drop through the net, some bounce out */
      const shot = Math.floor(t / 1.5);
      const s = (t % 1.5) / 1.5;
      const made = h(shot, 4, 9) < 0.5;
      const [bx, by] = made
        ? path(s, [[16, 7, 0], [19, 0, 0.38], [23, 3, 0.56], [23, 6, 0.68], [23, 8, 0.86]])
        : path(s, [[16, 7, 0], [19, 0, 0.38], [21, 3, 0.56], [18, 1, 0.72], [16, 8, 0.95]]);
      court(put, made && s > 0.6 && s < 0.8 ? 1 : 0);
      spr(put, bx, by, BALL, { X: GOLD }, 0.95);
      const chosen = ease(rise(u, 0.58, 0.74));
      for (let i = 0; i < 5; i++) {
        judge(put, i, 1, i === 2 && u > 0.74 && u < 0.82 ? 1 : 0);
        bar(put, i, lerp(PAST[i], NEXT[i], ease(rise(u, 0.3 + 0.06 * i, 0.42 + 0.06 * i))));
      }
      pick(put, lerp(ROW(0), ROW(2), chosen), 1);
    }},
  ],
};
