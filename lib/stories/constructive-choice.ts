/* The accessible goal decides what difficulty does to search. */

import { type Put, type StoryDef, h, clamp01, env, rise, spr, box, fill, ease, lerp, line, ring, burst, coast, spinUp, path, CHECK, CROSS } from "./kit";

export const story: StoryDef = {
  cols: 24, rows: 14,
  colors: ["#3fa7a0", "#DA7756", "#f4e9d6", "#d9a441"],
  phases: [
    { dur: 6, render(u, put) {
      /* accuracy goal: the target; difficulty grows search */
      spr(put, 2, 1, ["XXXXX", "X.X.X", "XXXXX"], { X: 0 }, 0.9);
      put(4, 2, 1, 1);
      const wave = rise(u, 0.15, 0.5); /* the difficulty wave */
      fill(put, 2, 6, Math.round(20 * wave), 1, 3, 0.5);
      const search = Math.round(rise(u, 0.3, 0.9) * 18);
      for (let i = 0; i < search; i++) put(3 + (i % 9) * 2, 9 + Math.floor(i / 9) * 2, 0, 0.8);
    }},
    { dur: 6, render(u, put) {
      /* effort goal: the battery; difficulty kills search */
      spr(put, 17, 1, ["XXXX.", "X..XX", "XXXX."], { X: 1 }, 0.9);
      const wave = rise(u, 0.15, 0.5);
      fill(put, 2, 6, Math.round(20 * wave), 1, 3, 0.5);
      const keep = Math.round((1 - rise(u, 0.3, 0.9)) * 18);
      for (let i = 0; i < 18; i++) {
        if (i < keep) put(3 + (i % 9) * 2, 9 + Math.floor(i / 9) * 2, 1, 0.8);
      }
    }},
  ],
};
