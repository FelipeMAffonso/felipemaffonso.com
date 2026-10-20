/* The price stays behind the box; when it opens, expectations
   decide: premium reveal delights, discount reveal deflates. */

import { type Put, type StoryDef, h, clamp01, env, rise, spr, box, fill, ease, lerp, line, ring, burst, coast, spinUp, path, CHECK, CROSS } from "./kit";

export const story: StoryDef = {
  cols: 24, rows: 15,
  colors: ["#d9a441", "#f4e9d6", "#7dc87d", "#c25048", "#5c6b7a"],
  phases: [
    { dur: 5, render(u, put, t) {
      box(put, 2, 2, 20, 11, 0, 0.8); /* the premium store frame */
      fill(put, 9, 5, 6, 5, 4, 0.9); /* the closed box */
      put(11, 4, 1, 0.5 + 0.5 * Math.sin(u * 18)); /* the "?" blink */
    }},
    { dur: 4, render(u, put) {
      box(put, 2, 2, 20, 11, 0, 0.8);
      const open = rise(u, 0, 0.5);
      fill(put, 9, 5 + Math.round(open * 3), 6, Math.max(1, 5 - Math.round(open * 4)), 4, 0.6);
      /* the price tag rises, and the reveal lands well */
      spr(put, 10, 5, ["XXXX", "X.SX", "XXXX"], { X: 1, S: 2 }, open);
      if (u > 0.55) {
        const b = (u - 0.55) * 2;
        for (let i = 0; i < 6; i++) {
          put(8 + Math.round(h(i, 1, 1) * 8), 3 + Math.round(h(1, i, 2) * 2), 2, clamp01(1 - b) * 0.9);
        }
      }
    }},
    { dur: 5, render(u, put) {
      box(put, 2, 2, 20, 11, 4, 0.8); /* the discount store frame */
      if (u < 0.4) {
        fill(put, 9, 5, 6, 5, 0, 0.9);
        put(11, 4, 1, 0.5 + 0.5 * Math.sin(u * 18));
      } else {
        const open = rise(u, 0.4, 0.7);
        spr(put, 10, 5, ["XXXX", "X.SX", "XXXX"], { X: 1, S: 3 }, open * 0.9);
        /* the deflation: the tag dims */
        if (u > 0.75) spr(put, 10, 5, ["XXXX", "X.SX", "XXXX"], { X: 1, S: 3 }, 0.9 - (u - 0.75) * 2.4);
      }
    }},
  ],
};
