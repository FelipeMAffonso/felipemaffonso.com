/* A survey; the robot answers until it falls into the trap; the
   human walks through clean. */

import { type Put, type StoryDef, h, clamp01, env, rise, spr, box, fill, ease, lerp, line, ring, burst, coast, spinUp, path, CHECK, CROSS } from "./kit";

export const story: StoryDef = {
  cols: 24, rows: 16,
  colors: ["#8b9099", "#DA7756", "#c25048", "#7dc87d", "#f4e9d6"],
  phases: [
    { dur: 7, render(u, put) {
      box(put, 1, 1, 14, 14, 0, 0.5);
      for (let r = 0; r < 5; r++) fill(put, 3, 3 + r * 2, 8, 1, 0, 0.35);
      /* the robot works down the survey */
      const step = Math.min(4, Math.floor(u * 6));
      spr(put, 17, 2 + step * 2, [".X.", "XXX", "X.X"], { X: 4 }, 0.9);
      for (let r = 0; r < step; r++) put(12, 3 + r * 2, 3, 0.8);
      /* row four hides the trap */
      if (step >= 3) {
        put(12, 9, 1, 1);
        if (u > 0.75) {
          spr(put, 16, 8, ["X.X", ".X.", "X.X"], { X: 2 }, (u - 0.75) * 4); /* flagged */
        }
      }
    }},
    { dur: 6, render(u, put) {
      box(put, 1, 1, 14, 14, 0, 0.5);
      for (let r = 0; r < 5; r++) fill(put, 3, 3 + r * 2, 8, 1, 0, 0.35);
      const step = Math.min(5, Math.floor(u * 7));
      spr(put, 17, 2 + Math.min(step, 4) * 2, [".X.", "X.X", ".X."], { X: 4 }, 0.9); /* human */
      for (let r = 0; r < step; r++) put(12, 3 + r * 2, 3, 0.85); /* all clean checks */
    }},
  ],
};
