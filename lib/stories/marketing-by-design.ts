/* Structured layout carries utilitarian claims; the same cells
   scatter into an unstructured, hedonic arrangement. */

import { type Put, type StoryDef, h, clamp01, env, rise, spr, box, fill, ease, lerp, line, ring, burst, coast, spinUp, path, CHECK, CROSS } from "./kit";

export const story: StoryDef = {
  cols: 24, rows: 14,
  colors: ["#3fa7a0", "#DA7756", "#f4e9d6", "#8b9099"],
  phases: [
    { dur: 6, render(u, put) {
      const v = env(u);
      fill(put, 3, 2, 18, 1, 2, v * 0.9); /* the headline */
      fill(put, 3, 4, 8, 5, 0, v * 0.8); /* the image block */
      for (let r = 0; r < 4; r++) fill(put, 13, 4 + r, 8, 1, 3, v * 0.6); /* the copy */
      fill(put, 3, 11, 6, 1, 0, v * (0.6 + 0.4 * Math.sin(u * 8))); /* utilitarian glow */
    }},
    { dur: 6, render(u, put, t) {
      /* the same mass of cells, scattered free */
      for (let i = 0; i < 46; i++) {
        const x = 2 + Math.floor(h(i, 3, 7) * 20);
        const y = 2 + Math.floor(h(7, i, 3) * 10);
        const wob = 0.5 + 0.5 * Math.sin(t * 1.4 + i);
        put(x, y, i % 3 === 0 ? 1 : 2, env(u) * (0.35 + 0.55 * wob));
      }
      fill(put, 15, 11, 6, 1, 1, env(u) * (0.6 + 0.4 * Math.sin(u * 8))); /* hedonic glow */
    }},
  ],
};
