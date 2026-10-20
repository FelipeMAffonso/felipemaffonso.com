/* Complexity in visual design (Advertising Theory, 3rd edition): the
   chapter's goal-contingent framework. One billboard slides from plain to
   busy (the slider under it). A viewer in a hurry, with no time to think,
   likes it plain: the fluency default. Then four viewers with four goals
   watch the same slide and react in opposite directions: a product that
   works (the bolt) and sensory enjoyment (the ice cream) like it busy;
   health (the cross) and sustainability (the leaf) like it plain. Last,
   the billboard splits and each pair gets the version its goal wants, so
   all four meters fill. The goal decides what complexity signals. */

import { type Put, type StoryDef, h, clamp01, env, rise, spr, box, fill, ease, lerp, line, ring, burst, coast, spinUp, path, CHECK, CROSS } from "./kit";

const STAND = ["..X..", ".XXX.", "..X..", "XXXXX", "..X..", "..X..", ".X.X.", ".X.X."];
const RUN_A = ["..X..", ".XXX.", "..X..", "XXXXX", "..X..", "..X..", ".X.X.", "X...X"];
const RUN_B = ["..X..", ".XXX.", "..X..", ".XXX.", "X.X.X", "..X..", "..X..", ".X.X."];
const BOTTLE = [".X.", ".X.", "XXX", "XXX", "XXX", "XXX"];
const SMALL_HEART = ["X.X", "XXX", ".X."];

/* the goals, each drawn above its viewer; like: how much that goal wants
   complexity (1 = busy, 0 = plain) */
const HOURGLASS = ["XXXXX", ".XXX.", "..X..", ".XXX.", "XXXXX"];
const GOALS = [
  { icon: ["..XX.", ".XX..", "XXXX.", "..XX.", ".XX.."], c: 2, like: 1 }, /* efficacy */
  { icon: [".XXX.", "XXXXX", ".XXX.", "..X..", "..X.."], c: 7, like: 1 }, /* enjoyment */
  { icon: ["..X..", "..X..", "XXXXX", "..X..", "..X.."], c: 6, like: 0 }, /* health */
  { icon: ["..XXX", ".XXXX", "XXXX.", "X.X..", "X...."], c: 3, like: 0 }, /* sustainability */
];
const VX = [2, 9, 16, 23];

/* a billboard whose busyness c runs from 0 (one headline, one bottle) to
   1 (ornaments in every corner and a patterned border); the same cells
   switch on in the same order as c rises, so it fills in smoothly */
function billboard(put: Put, x0: number, w: number, c: number, t: number, v: number) {
  const y0 = 2, hgt = 14;
  const bx = x0 + Math.floor(w / 2) - 1, by = y0 + hgt - 8;
  box(put, x0, y0, w, hgt, 0, 0.75 * v);
  fill(put, x0 + 2, y0 + 2, Math.round(w * 0.4), 1, 0, 0.75 * v);
  spr(put, bx, by, BOTTLE, { X: 0 }, 0.9 * v);
  const tones = [2, 6, 7, 0];
  for (let y = y0 + 1; y <= y0 + hgt - 2; y++) {
    for (let x = x0 + 1; x <= x0 + w - 2; x++) {
      if (y === y0 + 2 && x >= x0 + 2 && x < x0 + 2 + Math.round(w * 0.4)) continue;
      if (x >= bx - 1 && x <= bx + 3 && y >= by - 1) continue;
      const edge = y === y0 + 1 || y === y0 + hgt - 2 || x === x0 + 1 || x === x0 + w - 2;
      const on = edge ? c > 0.55 && h(x, y, 21) < (c - 0.55) * 2.4 : h(x, y, 13) < c * 0.62;
      if (!on) continue;
      const col = edge ? ((x + y) % 2 ? 2 : 6) : tones[Math.floor(h(y, x, 17) * 4)];
      put(x, y, col, v * (0.5 + 0.35 * h(x, y, 19) + 0.12 * Math.sin(t * 2 + x * y)));
    }
  }
}

function slider(put: Put, c: number, v: number) {
  fill(put, 5, 18, 20, 1, 1, 0.45 * v);
  put(3, 18, 0, 0.7 * v); /* the plain end */
  put(26, 17, 2, 0.8 * v); put(27, 17, 6, 0.8 * v); put(26, 18, 7, 0.8 * v); put(27, 18, 2, 0.8 * v); /* the busy end */
  fill(put, Math.round(5 + c * 19), 17, 1, 3, 0, v);
}

/* a viewer: the goal above, a liking meter beside, a heart or a red cross
   over the goal when the liking is strong either way */
function viewer(put: Put, x: number, icon: string[], ic: number, lik: number, t: number, v: number, running = false) {
  spr(put, x, 31, running ? (Math.floor(t * 6) % 2 ? RUN_A : RUN_B) : STAND, { X: 0 }, 0.9 * v);
  spr(put, x, 24, icon, { X: ic }, 0.95 * v);
  put(x + 2, 29.6, 0, 0.45 * v);
  fill(put, x + 5, 31, 1, 8, 1, 0.22 * v);
  const n = Math.round(8 * clamp01(lik));
  const mc = lik > 0.6 ? 3 : lik < 0.4 ? 4 : 0;
  for (let k = 0; k < n; k++) put(x + 5, 38 - k, mc, 0.9 * v);
  if (lik > 0.75) spr(put, x + 1, 20 - Math.round(Math.sin(t * 4) * 0.6 + 0.4), SMALL_HEART, { X: 5 }, rise(lik, 0.75, 0.92) * v);
  if (lik < 0.25) spr(put, x + 1, 20, CROSS, { X: 4 }, rise(0.25 - lik, 0, 0.17) * v);
}

export const story: StoryDef = {
  cols: 30, rows: 41,
  colors: ["#f4e9d6", "#8b9099", "#d9a441", "#7dc87d", "#c25048", "#DA7756", "#3fa7a0", "#9b6fb0"],
  phases: [
    { dur: 6, render(u, put, t) {
      /* no time to think: the hurried viewer likes it plain */
      const c = 0.5 - 0.5 * Math.cos(2 * Math.PI * u);
      billboard(put, 3, 24, c, t, 1);
      slider(put, c, 1);
      viewer(put, 12, HOURGLASS, 0, 1 - c, t, 1, true);
      fill(put, 0, 39, 30, 1, 1, 0.35);
    }},
    { dur: 7, render(u, put, t) {
      /* four goals watch the same slide and react in opposite directions */
      const c = 0.5 - 0.5 * Math.cos(2 * Math.PI * u);
      const a = rise(u, 0, 0.12);
      billboard(put, 3, 24, c, t, 1);
      slider(put, c, 1);
      GOALS.forEach((g, i) => viewer(put, VX[i], g.icon, g.c, g.like ? c : 1 - c, t, a));
      fill(put, 0, 39, 30, 1, 1, 0.35);
    }},
    { dur: 6, render(u, put, t) {
      /* the billboard splits: each pair gets the version its goal wants */
      const k = ease(rise(u, 0, 0.25));
      billboard(put, 3, 24, 0.5, t, 1 - k);
      slider(put, 0.5, 1 - k);
      billboard(put, 1, 14, 1, t, k);
      billboard(put, 15, 14, 0, t, k);
      const lik = rise(u, 0.25, 0.5);
      GOALS.forEach((g, i) => {
        viewer(put, VX[i], g.icon, g.c, 0.5 + 0.5 * lik, t, 1);
        if (k > 0.9) line(put, VX[i] + 2, 23, i < 2 ? 8 : 22, 16, 0, 0.28); /* each looks at its own version */
        burst(put, VX[i] + 2, 21, rise(u, 0.5 + i * 0.04, 0.75 + i * 0.04), 5, 8, 3);
      });
      fill(put, 0, 39, 30, 1, 1, 0.35);
    }},
  ],
};
