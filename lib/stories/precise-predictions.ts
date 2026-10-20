/* Epistemic (the brain) rewards precision; aleatory (the die)
   rewards the honest wide interval. */

import { type Put, type StoryDef, h, clamp01, env, rise, spr, box, fill, ease, lerp, line, ring, burst, coast, spinUp, path, CHECK, CROSS } from "./kit";

export const story: StoryDef = {
  cols: 26, rows: 14,
  colors: ["#f4e9d6", "#d9a441", "#DA7756", "#3fa7a0"],
  phases: [
    { dur: 6, render(u, put) {
      spr(put, 2, 1, [".XXX.", "XXXXX", "XXXXX", ".X.X."], { X: 3 }, env(u)); /* brain */
      for (let x = 4; x <= 8; x++) put(x, 9, 0, 1); /* narrow, bright */
      for (let x = 14; x <= 24; x++) put(x, 9, 0, 0.3); /* wide, dim */
      spr(put, 5, 11, ["X.X", ".X."], { X: 1 }, 0.9);
    }},
    { dur: 6, render(u, put) {
      spr(put, 20, 1, ["XXXX", "X..X", "X..X", "XXXX"], { X: 2 }, env(u)); /* die */
      put(21, 2, 0, env(u)); put(22, 3, 0, env(u)); /* pips */
      for (let x = 4; x <= 8; x++) put(x, 9, 0, 0.3);
      for (let x = 14; x <= 24; x++) put(x, 9, 0, 1);
      spr(put, 18, 11, ["X.X", ".X."], { X: 1 }, 0.9);
    }},
  ],
};
