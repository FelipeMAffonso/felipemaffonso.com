/* The ad broadcasts; the similar extension absorbs the message,
   the moderate one meets the skepticism shield. */

import { type Put, type StoryDef, h, clamp01, env, rise, spr, box, fill, ease, lerp, line, ring, burst, coast, spinUp, path, CHECK, CROSS } from "./kit";

export const story: StoryDef = {
  cols: 24, rows: 14,
  colors: ["#d9a441", "#3fa7a0", "#c25048", "#f4e9d6"],
  phases: [
    { dur: 6, render(u, put) {
      spr(put, 1, 5, ["XX..", "XXXX", "XX.."], { X: 0 }, 0.9); /* the megaphone */
      spr(put, 18, 2, ["XXX", "XXX"], { X: 1 }, 0.9); /* the similar extension */
      /* waves reach it */
      for (let i = 0; i < 3; i++) {
        const p = (u * 1.6 + i * 0.33) % 1;
        const x = 6 + Math.round(p * 11);
        put(x, 3, 3, 0.7 * (1 - p));
        put(x, 5, 3, 0.7 * (1 - p));
      }
      if (u > 0.5) box(put, 17, 1, 5, 4, 1, 0.4 + 0.4 * Math.sin(u * 10));
    }},
    { dur: 6, render(u, put) {
      spr(put, 1, 5, ["XX..", "XXXX", "XX.."], { X: 0 }, 0.9);
      spr(put, 18, 9, ["XXX", "XXX"], { X: 1 }, 0.6); /* the moderate extension */
      for (let y = 8; y <= 12; y++) put(15, y, 2, 0.9); /* the skepticism shield */
      for (let i = 0; i < 3; i++) {
        const p = (u * 1.6 + i * 0.33) % 1;
        const x = Math.min(14, 6 + Math.round(p * 11));
        put(x, 9, 3, 0.7 * (1 - p));
        put(x, 11, 3, 0.7 * (1 - p));
        if (x === 14) put(15, 10, 2, 1); /* the block flash */
      }
    }},
  ],
};
