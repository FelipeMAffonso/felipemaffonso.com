/* Placeholder: this paper's story is being drawn (2026-10-20). Until it
   lands, a quiet frame keeps the cover slot valid. */

import { type Put, type StoryDef, h, clamp01, env, rise, spr, box, fill, ease, lerp, line, ring, burst, coast, spinUp, path, CHECK, CROSS } from "./kit";

export const story: StoryDef = {
  cols: 30, rows: 38,
  colors: ["#f4e9d6"],
  phases: [
    { dur: 4, render(u, put) {
      box(put, 2, 2, 26, 34, 0, 0.3 * env(u));
    }},
  ],
};
