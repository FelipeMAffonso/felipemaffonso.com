/* Strategic personalities of language models (arXiv preprint). Three
   providers' models, each drawn as its own mark (Anthropic's starburst,
   Google's Gemini spark, OpenAI's knot), sit at three game tables
   across from the same grey opponent. In a competitive guessing game
   all three throw their guesses to exactly the same spots: they play
   alike. In a ten-round cooperation game they split: the Anthropic
   model mostly hands coins over (green), the Google model a little
   less, the OpenAI model takes a coin every round (red), and the
   opponent's eyes show what it just got. Across four model generations
   the Google model hands over more each time while the OpenAI model
   hands over less. In the last round, where the opponent can no longer
   punish (the coral frame), the Anthropic model still hands the coin
   over and the Google model, after nine rounds of cooperating, takes
   it. */

import { type Put, type StoryDef, rise, spr, fill, ease, lerp, line } from "./kit";

/* the three provider marks (7x7), top to bottom: Anthropic, Google, OpenAI */
const CLAUDE_MARK = ["X..X..X", ".X.X.X.", "..XXX..", "XXX.XXX", "..XXX..", ".X.X.X.", "X..X..X"];
const GEMINI_MARK = ["...X...", "...X...", "..XXX..", "XXXXXXX", "..XXX..", "...X...", "...X..."];
const OPENAI_MARK = ["..XXX..", ".X...X.", "X..X..X", "X.X.X.X", "X..X..X", ".X...X.", "..XXX.."];
const MARKS = [CLAUDE_MARK, GEMINI_MARK, OPENAI_MARK];
/* the opponent every model faces: a plain grey robot */
const OPP = ["..X..", "XXXXX", "X.X.X", "XXXXX", ".XXX.", ".X.X."];
/* a guess in the competitive game */
const PIECE = [".X.", "XXX", ".X."];

/* lane tops and each provider's color */
const LANES = [4, 17, 30];
const PCOL = [2, 4, 3];
const CREAM = 0, GREEN = 5, RED = 6, CORAL = 7;

/* the competitive guessing game: three guesses, the same for everyone */
const GUESS = [18, 15, 12];
/* the ten-round cooperation game, newest models (C hands a coin over,
   D takes one): Anthropic 7 of 10, Google 6 of 10, OpenAI 0 of 10 */
const PLAY = ["CCCDCCDCDC", "CCDCDCCDCD", "DDDDDDDDDD"];
/* rounds handed over in each of four generations (Google rose, OpenAI fell) */
const GENS = [[7, 7, 7, 7], [1, 2, 4, 6], [5, 3, 1, 0]];
/* the endgame: nine rounds, then the last one */
const ENDGAME = ["CCCCCCCCCC", "CCCCCCCCCD", "DDDDDDDDDD"];

/* the table: the provider's mark on the left, the opponent on the right;
   eye is the color of the opponent's eyes (what it just got), or -1 for
   plain eyes (left unlit, so they read in both themes) */
function table(put: Put, i: number, v: number, eye = -1) {
  const y = LANES[i];
  spr(put, 1, y, MARKS[i], { X: PCOL[i] }, 0.95 * v);
  spr(put, 23, y + 1, OPP, { X: 1 }, 0.9 * v);
  if (eye >= 0) { put(24, y + 3, eye, v); put(26, y + 3, eye, v); }
  line(put, 8, y + 6, 21, y + 6, CREAM, 0.5 * v);
}

/* the frame around the last round: a rounded ring one cell clear of it */
function lastRoundFrame(put: Put, i: number, v: number) {
  const y = LANES[i] + 7;
  for (let x = 19; x <= 22; x++) { put(x, y, CORAL, v); put(x, y + 5, CORAL, v); }
  for (let yy = y + 1; yy <= y + 4; yy++) { put(18, yy, CORAL, v); put(23, yy, CORAL, v); }
}

/* the round record under the table: rounds one to nine, a gap, then
   round ten drawn larger */
function slots(put: Put, i: number, v: number) {
  const y = LANES[i] + 9;
  for (let r = 0; r < 9; r++) fill(put, 8 + r, y, 1, 2, 1, 0.45 * v);
  fill(put, 20, y, 2, 2, 1, 0.45 * v);
}
function cell(put: Put, i: number, r: number, c: number, v: number) {
  const y = LANES[i] + 9;
  if (r < 9) fill(put, 8 + r, y, 1, 2, c, v);
  else fill(put, 20, y, 2, 2, c, v);
}

/* one round: a green coin handed across, or a red coin taken back */
function coin(put: Put, i: number, k: number, coop: boolean) {
  if (k <= 0 || k >= 0.75) return;
  const p = ease(k / 0.75);
  const x = coop ? lerp(8, 20, p) : lerp(20, 8, p);
  fill(put, x, LANES[i] + 3, 2, 2, coop ? GREEN : RED, 1);
}

/* how many generations each provider has shipped, as pips over the mark */
function pips(put: Put, i: number, n: number, v: number) {
  for (let p = 0; p < 4; p++) put(1 + p * 2, LANES[i] - 2, PCOL[i], p < n ? 0.95 * v : 0.3 * v);
}

export const story: StoryDef = {
  cols: 30, rows: 43,
  colors: ["#f4e9d6", "#5c6b7a", "#d9a066", "#a9b4c0", "#5b8ff0", "#7dc87d", "#c25048", "#DA7756"],
  phases: [
    /* the competitive game: every provider guesses the same */
    { dur: 4.5, render(u, put) {
      const v = rise(u, 0, 0.15);
      for (let i = 0; i < 3; i++) {
        const y = LANES[i];
        table(put, i, v);
        for (let g = 0; g < 3; g++) {
          const k = rise(u, 0.2 + g * 0.16, 0.32 + g * 0.16);
          if (k <= 0) continue;
          const X = GUESS[g];
          if (k < 1) {
            const x = lerp(7, X - 1, k);
            const yy = lerp(y + 2, y + 3, k) - Math.sin(Math.PI * k) * 3;
            spr(put, x, yy, PIECE, { X: PCOL[i] }, 1);
          } else spr(put, X - 1, y + 3, PIECE, { X: PCOL[i] }, g === 2 ? 1 : 0.55);
        }
      }
      /* all three guesses line up */
      const a = rise(u, 0.74, 0.84);
      if (a > 0) for (let yy = 1; yy <= 41; yy++) if (yy % 2 === 0) put(GUESS[2], yy, CREAM, 0.75 * a);
    }},
    /* the cooperation game: the providers split */
    { dur: 6.5, render(u, put) {
      const fadeOut = 1 - rise(u, 0, 0.08);
      for (let i = 0; i < 3; i++) {
        let eye = -1;
        for (let r = 0; r < 10; r++) {
          if (rise(u, 0.1 + r * 0.078, 0.1 + (r + 1) * 0.078) > 0.7) eye = PLAY[i][r] === "C" ? GREEN : RED;
        }
        table(put, i, 1, eye);
        pips(put, i, 4, rise(u, 0, 0.1));
        if (fadeOut > 0) spr(put, GUESS[2] - 1, LANES[i] + 3, PIECE, { X: PCOL[i] }, fadeOut);
        slots(put, i, rise(u, 0, 0.1));
        for (let r = 0; r < 10; r++) {
          const k = rise(u, 0.1 + r * 0.078, 0.1 + (r + 1) * 0.078);
          if (k <= 0) continue;
          const coop = PLAY[i][r] === "C";
          coin(put, i, k, coop);
          if (k > 0.7) cell(put, i, r, coop ? GREEN : RED, 0.95);
        }
      }
    }},
    /* four generations: Google's models hand over more, OpenAI's less */
    { dur: 5.5, render(u, put) {
      for (let i = 0; i < 3; i++) {
        if (i === 0) {
          table(put, 0, 0.6);
          pips(put, 0, 4, 0.6);
          slots(put, 0, 0.6);
          for (let r = 0; r < 10; r++) cell(put, 0, r, PLAY[0][r] === "C" ? GREEN : RED, 0.6);
          continue;
        }
        const g = Math.max(0, Math.min(3, Math.floor((u - 0.04) / 0.22)));
        const gu = (u - 0.04 - g * 0.22) / 0.22;
        /* the new model replaces the old: the mark blinks off and back on */
        const blink = u < 0.04 ? 1 : 0.25 + 0.75 * rise(gu, 0.08, 0.2);
        table(put, i, blink);
        pips(put, i, g + 1, 1);
        slots(put, i, 1);
        const n = GENS[i][g];
        const shown = u < 0.04 ? 10 : Math.round(rise(gu, 0.2, 0.62) * 10);
        /* the previous generation stays faint until the new one covers it */
        const prev = g > 0 ? GENS[i][g - 1] : n;
        for (let r = shown; r < 10; r++) if (g > 0) cell(put, i, r, r < prev ? GREEN : RED, 0.4);
        for (let r = 0; r < shown; r++) cell(put, i, r, r < n ? GREEN : RED, 0.95);
      }
    }},
    /* the last round, where the opponent can no longer punish */
    { dur: 6, render(u, put) {
      for (let i = 0; i < 3; i++) {
        const dim = i === 2 ? 0.6 : 1;
        const k = rise(u, 0.58, 0.76);
        const coop = ENDGAME[i][9] === "C";
        const eye = k > 0.7 ? (coop ? GREEN : RED) : u > 0.06 ? (ENDGAME[i][0] === "C" ? GREEN : RED) : -1;
        table(put, i, dim, eye);
        pips(put, i, 4, dim);
        slots(put, i, 1);
        for (let r = 0; r < 9; r++) {
          const kr = rise(u, 0.06 + r * 0.042, 0.06 + (r + 1) * 0.042);
          if (kr > 0.5) cell(put, i, r, ENDGAME[i][r] === "C" ? GREEN : RED, 0.95 * dim);
        }
        const f = rise(u, 0.46, 0.54);
        if (f > 0) lastRoundFrame(put, i, f);
        coin(put, i, k, coop);
        if (k > 0.7) cell(put, i, 9, coop ? GREEN : RED, 1);
      }
    }},
  ],
};
