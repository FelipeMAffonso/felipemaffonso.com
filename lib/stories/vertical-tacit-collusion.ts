/* Platform above, sellers below, consumers squeezed in the middle. */

import { type Put, type StoryDef, h, clamp01, env, rise, spr, box, fill, ease, lerp, line, ring, burst, coast, spinUp, path, CHECK, CROSS } from "./kit";

export const story: StoryDef = {
  cols: 25, rows: 15,
  colors: ["#4a6a8a", "#DA7756", "#f4e9d6", "#c25048"],
  phases: [
    { dur: 4, render(u, put) {
      const v = env(u);
      fill(put, 2, 1, 21, 2, 0, v * 0.9);
      fill(put, 2, 12, 21, 2, 0, v * 0.9);
      for (let i = 0; i < 7; i++) put(4 + i * 3, 7, 2, v * 0.8);
    }},
    { dur: 7, render(u, put, t) {
      fill(put, 2, 1, 21, 2, 0, 0.9);
      fill(put, 2, 12, 21, 2, 0, 0.9);
      /* price pressure drips from both sides toward the consumers */
      for (let i = 0; i < 7; i++) {
        const x = 4 + i * 3;
        const p = (u * 2 + i * 0.14) % 1;
        put(x, 3 + Math.round(p * 3), 1, 0.85);
        put(x, 11 - Math.round(p * 3), 1, 0.85);
        const squeezed = rise(u, 0.3, 1);
        put(x, 7, squeezed > (i + 1) / 8 ? 3 : 2, squeezed > (i + 1) / 8 ? 0.9 : 0.8 - squeezed * 0.4);
      }
    }},
    { dur: 4, render(u, put) {
      fill(put, 2, 1, 21, 2, 0, 0.9);
      fill(put, 2, 12, 21, 2, 0, 0.9);
      for (let i = 0; i < 7; i++) put(4 + i * 3, 7, 3, 0.6 + 0.3 * h(i, 1, Math.floor(u * 8)));
    }},
  ],
};
