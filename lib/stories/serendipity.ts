/* A wandering path happens upon the gift: fireworks. The planned
   straight path hits the same gift: nothing. */

import { type Put, type StoryDef, h, clamp01, env, rise, spr, box, fill, ease, lerp, line, ring, burst, coast, spinUp, path, CHECK, CROSS } from "./kit";

export const story: StoryDef = {
  cols: 24, rows: 14,
  colors: ["#f4e9d6", "#d9a441", "#DA7756", "#5c6b7a"],
  phases: [
    { dur: 7, render(u, put) {
      spr(put, 15, 6, ["XXX", "XSX", "XXX"], { X: 1, S: 2 }, 0.85); /* the gift */
      /* the wandering path */
      const steps = Math.floor(u * 26);
      let px = 2, py = 11;
      for (let i = 0; i < steps; i++) {
        px += h(i, 5, 1) > 0.35 ? 1 : 0;
        py += h(3, i, 2) > 0.5 ? -1 : (py < 12 ? 1 : 0);
        py = Math.max(3, Math.min(12, py));
        put(px, py, 0, i === steps - 1 ? 1 : 0.25);
        if (px >= 15) break;
      }
      /* the chance meeting bursts gold */
      if (u > 0.72) {
        const b = (u - 0.72) * 3.6;
        for (let i = 0; i < 10; i++) {
          const a = (i / 10) * Math.PI * 2;
          put(16 + Math.round(Math.cos(a) * (1 + b * 3)), 7 + Math.round(Math.sin(a) * (1 + b * 2)), 1, clamp01(1 - b));
        }
      }
    }},
    { dur: 5, render(u, put) {
      spr(put, 15, 6, ["XXX", "XSX", "XXX"], { X: 1, S: 2 }, 0.5); /* the same gift, dimmer */
      /* the planned straight line walks right past */
      const steps = Math.floor(u * 22);
      for (let i = 0; i < steps; i++) put(2 + i, 7, 3, i === steps - 1 ? 0.9 : 0.3);
    }},
  ],
};
