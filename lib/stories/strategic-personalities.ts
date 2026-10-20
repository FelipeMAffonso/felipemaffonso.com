/* Three providers converge on competition, diverge on cooperation:
   marks appear, volley (all trade), then the cooperation bars split. */

import { type Put, type StoryDef, h, clamp01, env, rise, spr, box, fill, ease, lerp, line, ring, burst, coast, spinUp, path, CHECK, CROSS } from "./kit";

/* the three provider marks (7x7) */
const CLAUDE_MARK = ["X..X..X", ".X.X.X.", "..XXX..", "XXX.XXX", "..XXX..", ".X.X.X.", "X..X..X"];
const OPENAI_MARK = ["..XXX..", ".X...X.", "X..X..X", "X.X.X.X", "X..X..X", ".X...X.", "..XXX.."];
const GEMINI_MARK = ["...X...", "..XXX..", ".XXXXX.", "XXXXXXX", ".XXXXX.", "..XXX..", "...X..."];

export const story: StoryDef = {
  cols: 27, rows: 17,
  colors: ["#DA7756", "#74aa9c", "#4b8bf5", "#7dc87d", "#c25048", "#f4e9d6"],
  phases: [
    { dur: 4, render(u, put) {
      const v = env(u);
      spr(put, 1, 2, CLAUDE_MARK, { X: 0 }, v * rise(u, 0, 0.3));
      spr(put, 10, 2, OPENAI_MARK, { X: 1 }, v * rise(u, 0.15, 0.45));
      spr(put, 19, 2, GEMINI_MARK, { X: 2 }, v * rise(u, 0.3, 0.6));
    }},
    { dur: 6, render(u, put, t) {
      spr(put, 1, 2, CLAUDE_MARK, { X: 0 }, 0.9);
      spr(put, 10, 2, OPENAI_MARK, { X: 1 }, 0.9);
      spr(put, 19, 2, GEMINI_MARK, { X: 2 }, 0.9);
      /* cooperation volleys along the bottom lane */
      for (let i = 0; i < 4; i++) {
        const p = (u * 2 + i * 0.25) % 1;
        const xx = Math.round(2 + p * 22);
        put(xx, 11, 3, 0.9 * env(u));
        put(xx, 12, 3, 0.4 * env(u));
      }
    }},
    { dur: 6, render(u, put) {
      spr(put, 1, 2, CLAUDE_MARK, { X: 0 }, 0.9);
      spr(put, 10, 2, OPENAI_MARK, { X: 1 }, 0.9);
      spr(put, 19, 2, GEMINI_MARK, { X: 2 }, 0.9);
      /* cooperation bars: 72%, 2%, 57% */
      const g = rise(u, 0.1, 0.8);
      const bars: [number, number, number][] = [[3, 5, 3], [12, 1, 4], [21, 4, 3]];
      for (const [bx, hMax, col] of bars) {
        const hh = Math.round(hMax * g);
        for (let k = 0; k < hh; k++) fill(put, bx, 15 - k, 3, 1, col, 0.9);
        if (hMax === 1 && g > 0.5) put(bx + 1, 15, 4, 0.6 + 0.4 * h(bx, 0, Math.floor(u * 10)));
      }
    }},
  ],
};
