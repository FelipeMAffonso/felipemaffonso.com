/* Respondents stream onto platforms; one platform fills with bots;
   the quality ranking settles. */

import { type Put, type StoryDef, h, clamp01, env, rise, spr, box, fill, ease, lerp, line, ring, burst, coast, spinUp, path, CHECK, CROSS } from "./kit";

export const story: StoryDef = {
  cols: 25, rows: 15,
  colors: ["#f4e9d6", "#c25048", "#7dc87d", "#5c6b7a", "#d9a441"],
  phases: [
    { dur: 5, render(u, put) {
      /* ten platform columns fill with human respondents */
      for (let col = 0; col < 10; col++) {
        const filled = rise(u, col * 0.06, col * 0.06 + 0.5) * 9;
        for (let k = 0; k < filled; k++) put(2 + col * 2, 12 - k, 0, 0.75);
      }
      fill(put, 1, 14, 23, 1, 3, 0.5);
    }},
    { dur: 5, render(u, put, t) {
      for (let col = 0; col < 10; col++) {
        for (let k = 0; k < 9; k++) {
          /* the third column turns bot-red cell by cell */
          const isBot = col === 2 && k / 9 < rise(u, 0.1, 0.9);
          put(2 + col * 2, 12 - k, isBot ? 1 : 0, isBot ? 0.95 : 0.6);
        }
      }
      fill(put, 1, 14, 23, 1, 3, 0.5);
      /* the detector sweep */
      const sx = Math.round(1 + u * 22);
      for (let y = 2; y < 14; y++) put(sx, y, 4, 0.35);
    }},
    { dur: 5, render(u, put) {
      /* quality tiers: direct > hybrid > marketplace */
      const g = rise(u, 0.1, 0.7);
      const tiers: [number, number, number][] = [[2, 9, 2], [10, 6, 4], [18, 3, 1]];
      for (const [bx, hMax, col] of tiers) {
        const hh = Math.round(hMax * g);
        for (let k = 0; k < hh; k++) fill(put, bx, 12 - k, 5, 1, col, 0.85);
      }
      fill(put, 1, 14, 23, 1, 3, 0.5);
    }},
  ],
};
