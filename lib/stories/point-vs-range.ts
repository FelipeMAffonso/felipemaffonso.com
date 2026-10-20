/* A point estimate vs a range; the preference marker flips when
   persuasion knowledge (the eye) switches on. */

import { type Put, type StoryDef, h, clamp01, env, rise, spr, box, fill, ease, lerp, line, ring, burst, coast, spinUp, path, CHECK, CROSS } from "./kit";

export const story: StoryDef = {
  cols: 26, rows: 14,
  colors: ["#f4e9d6", "#3fa7a0", "#DA7756", "#d9a441"],
  phases: [
    { dur: 6, render(u, put) {
      fill(put, 2, 7, 22, 1, 0, 0.25);
      put(6, 7, 2, 1); /* the point */
      for (let x = 15; x <= 21; x++) put(x, 7, 1, 0.55); /* the range */
      put(15, 6, 1, 0.55); put(21, 6, 1, 0.55);
      /* preference chevron under the point */
      const v = env(u);
      spr(put, 5, 9, ["X.X", ".X."], { X: 3 }, v * (0.6 + 0.4 * Math.sin(u * 12)));
    }},
    { dur: 6, render(u, put) {
      fill(put, 2, 7, 22, 1, 0, 0.25);
      put(6, 7, 2, 0.6);
      for (let x = 15; x <= 21; x++) put(x, 7, 1, 1);
      put(15, 6, 1, 1); put(21, 6, 1, 1);
      /* persuasion knowledge: the eye opens above */
      spr(put, 10, 1, [".XXXX.", "X.XX.X", ".XXXX."], { X: 3 }, rise(u, 0, 0.25));
      /* the marker slides to the range */
      const slide = rise(u, 0.2, 0.6);
      const mx = Math.round(5 + slide * 12);
      spr(put, mx, 9, ["X.X", ".X."], { X: 3 }, 0.9);
    }},
  ],
};
