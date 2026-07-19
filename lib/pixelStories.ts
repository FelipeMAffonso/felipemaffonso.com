/* ============================================================
   Pixel stories — narrative motifs that depict each paper.
   A story is a looping timeline of phases; each phase paints
   sprites (ASCII cell art) and simple effects into a frame
   buffer. Less abstract than the noise engines: the Strategic
   Personalities card shows the three model-provider marks, the
   Concealing Prices card opens a box to reveal a price tag,
   and so on. Cycles run 12 to 18 seconds so the story reads.
   ============================================================ */

import type { Cell } from "./pixelEngine";

type Put = (x: number, y: number, c: number, v?: number) => void;
type Phase = { dur: number; render: (u: number, put: Put, t: number) => void };
export type StoryDef = {
  cols: number;
  rows: number;
  colors: string[];
  phases: Phase[];
};

/* deterministic hash for twinkle effects */
function h(x: number, y: number, z: number) {
  const n = Math.sin(x * 127.1 + y * 269.5 + z * 419.2) * 43758.5453;
  return n - Math.floor(n);
}
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
/* fade in over the first 15% of a phase, out over the last 15% */
const env = (u: number) => clamp01(Math.min(u / 0.15, (1 - u) / 0.15));
const rise = (u: number, a: number, b: number) => clamp01((u - a) / (b - a));

/* paint ASCII art; keys map characters to color indices */
function spr(put: Put, ox: number, oy: number, art: string[], map: Record<string, number>, v = 1) {
  for (let r = 0; r < art.length; r++) {
    for (let c = 0; c < art[r].length; c++) {
      const ch = art[r][c];
      if (ch === "." || ch === " ") continue;
      if (map[ch] === undefined) continue;
      put(ox + c, oy + r, map[ch], v);
    }
  }
}

function box(put: Put, x0: number, y0: number, w: number, hh: number, c: number, v = 1) {
  for (let x = x0; x < x0 + w; x++) { put(x, y0, c, v); put(x, y0 + hh - 1, c, v); }
  for (let y = y0; y < y0 + hh; y++) { put(x0, y, c, v); put(x0 + w - 1, y, c, v); }
}
function fill(put: Put, x0: number, y0: number, w: number, hh: number, c: number, v = 1) {
  for (let y = y0; y < y0 + hh; y++) for (let x = x0; x < x0 + w; x++) put(x, y, c, v);
}

/* the three provider marks (7x7) */
const CLAUDE_MARK = ["X..X..X", ".X.X.X.", "..XXX..", "XXX.XXX", "..XXX..", ".X.X.X.", "X..X..X"];
const OPENAI_MARK = ["..XXX..", ".X...X.", "X..X..X", "X.X.X.X", "X..X..X", ".X...X.", "..XXX.."];
const GEMINI_MARK = ["...X...", "..XXX..", ".XXXXX.", "XXXXXXX", ".XXXXX.", "..XXX..", "...X..."];

export const STORIES: Record<string, StoryDef> = {
  /* Three providers converge on competition, diverge on cooperation:
     marks appear, volley (all trade), then the cooperation bars split. */
  "strategic-personalities": {
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
  },

  /* Respondents stream onto platforms; one platform fills with bots;
     the quality ranking settles. */
  "data-quality": {
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
  },

  /* Platform above, sellers below, consumers squeezed in the middle. */
  "vertical-tacit-collusion": {
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
  },

  /* A point estimate vs a range; the preference marker flips when
     persuasion knowledge (the eye) switches on. */
  "point-vs-range": {
    cols: 26, rows: 14,
    colors: ["#f4e9d6", "#3fa7a0", "#DA7756", "#d9a441"],
    phases: [
      { dur: 6, render(u, put) {
        fill(put, 2, 7, 22, 1, 0, 0.25);
        put(6, 7, 2, 1); /* the point */
        for (let x = 15; x <= 21; x++) put(x, 7, 1, 0.55); /* the range */
        put(15, 6, 1, 0.55); put(21, 6, 1, 0.55);
        /* preference chevron under the point */
        const v = env(u);
        spr(put, 5, 9, ["X.X", ".X."], { X: 3 }, v * (0.6 + 0.4 * Math.sin(u * 12)));
      }},
      { dur: 6, render(u, put) {
        fill(put, 2, 7, 22, 1, 0, 0.25);
        put(6, 7, 2, 0.6);
        for (let x = 15; x <= 21; x++) put(x, 7, 1, 1);
        put(15, 6, 1, 1); put(21, 6, 1, 1);
        /* persuasion knowledge: the eye opens above */
        spr(put, 10, 1, [".XXXX.", "X.XX.X", ".XXXX."], { X: 3 }, rise(u, 0, 0.25));
        /* the marker slides to the range */
        const slide = rise(u, 0.2, 0.6);
        const mx = Math.round(5 + slide * 12);
        spr(put, mx, 9, ["X.X", ".X."], { X: 3 }, 0.9);
      }},
    ],
  },

  /* Epistemic (the brain) rewards precision; aleatory (the die)
     rewards the honest wide interval. */
  "precise-predictions": {
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
  },

  /* A survey; the robot answers until it falls into the trap; the
     human walks through clean. */
  "cognitive-traps": {
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
  },

  /* The price stays behind the box; when it opens, expectations
     decide: premium reveal delights, discount reveal deflates. */
  "concealing-prices": {
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
  },

  /* Simple package reads eco; complex package reads effective. */
  "simple-eco-friendly": {
    cols: 24, rows: 14,
    colors: ["#f4e9d6", "#7dc87d", "#d9a441", "#8b9099"],
    phases: [
      { dur: 6, render(u, put) {
        box(put, 3, 4, 7, 8, 0, 0.8);
        put(6, 8, 0, 0.7); /* the simple package: one mark */
        box(put, 14, 4, 7, 8, 0, 0.8);
        for (let y = 5; y < 11; y++) for (let x = 15; x < 20; x++) if ((x + y) % 2 === 0) put(x, y, 3, 0.7);
        /* the leaf above the simple one */
        spr(put, 4, 1, [".XX", "XXX", "X.."], { X: 1 }, env(u));
        box(put, 3, 4, 7, 8, 1, 0.5 + 0.4 * Math.sin(u * 8));
      }},
      { dur: 6, render(u, put) {
        box(put, 3, 4, 7, 8, 0, 0.8);
        put(6, 8, 0, 0.7);
        box(put, 14, 4, 7, 8, 0, 0.8);
        for (let y = 5; y < 11; y++) for (let x = 15; x < 20; x++) if ((x + y) % 2 === 0) put(x, y, 3, 0.7);
        /* the bolt above the complex one */
        spr(put, 16, 1, [".X", "XX", "X."], { X: 2 }, env(u));
        box(put, 14, 4, 7, 8, 2, 0.5 + 0.4 * Math.sin(u * 8));
      }},
    ],
  },

  /* Structured layout carries utilitarian claims; the same cells
     scatter into an unstructured, hedonic arrangement. */
  "marketing-by-design": {
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
  },

  /* A wandering path happens upon the gift: fireworks. The planned
     straight path hits the same gift: nothing. */
  serendipity: {
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
  },

  /* The accessible goal decides what difficulty does to search. */
  "constructive-choice": {
    cols: 24, rows: 14,
    colors: ["#3fa7a0", "#DA7756", "#f4e9d6", "#d9a441"],
    phases: [
      { dur: 6, render(u, put) {
        /* accuracy goal: the target; difficulty grows search */
        spr(put, 2, 1, ["XXXXX", "X.X.X", "XXXXX"], { X: 0 }, 0.9);
        put(4, 2, 1, 1);
        const wave = rise(u, 0.15, 0.5); /* the difficulty wave */
        fill(put, 2, 6, Math.round(20 * wave), 1, 3, 0.5);
        const search = Math.round(rise(u, 0.3, 0.9) * 18);
        for (let i = 0; i < search; i++) put(3 + (i % 9) * 2, 9 + Math.floor(i / 9) * 2, 0, 0.8);
      }},
      { dur: 6, render(u, put) {
        /* effort goal: the battery; difficulty kills search */
        spr(put, 17, 1, ["XXXX.", "X..XX", "XXXX."], { X: 1 }, 0.9);
        const wave = rise(u, 0.15, 0.5);
        fill(put, 2, 6, Math.round(20 * wave), 1, 3, 0.5);
        const keep = Math.round((1 - rise(u, 0.3, 0.9)) * 18);
        for (let i = 0; i < 18; i++) {
          if (i < keep) put(3 + (i % 9) * 2, 9 + Math.floor(i / 9) * 2, 1, 0.8);
        }
      }},
    ],
  },

  /* The ad broadcasts; the similar extension absorbs the message,
     the moderate one meets the skepticism shield. */
  "ad-skepticism": {
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
  },
};

/* render one frame of a story into a cell buffer */
export function renderStory(def: StoryDef, t: number): (Cell | null)[] {
  const buf: (Cell | null)[] = new Array(def.cols * def.rows).fill(null);
  const total = def.phases.reduce((s, p) => s + p.dur, 0);
  let tt = t % total;
  let phase = def.phases[0];
  for (const p of def.phases) {
    if (tt < p.dur) { phase = p; break; }
    tt -= p.dur;
  }
  const u = tt / phase.dur;
  const put: Put = (x, y, c, v = 1) => {
    x = Math.round(x); y = Math.round(y);
    if (x < 0 || y < 0 || x >= def.cols || y >= def.rows) return;
    const prev = buf[y * def.cols + x];
    if (prev && prev.v > v) return;
    buf[y * def.cols + x] = { v: clamp01(v), c };
  };
  phase.render(u, put, t);
  return buf;
}
