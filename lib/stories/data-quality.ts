/* AI agent prevalence and data quality across online sample providers
   (PsyArXiv preprint). Ten recruitment platforms, drawn as four clusters
   of storefronts: three direct panels (teal), two hybrid networks
   (purple), four marketplaces (blue) and MTurk on its own (grey).
   Respondents walk from each cluster through a gate to the same survey,
   and each finished survey lands as a cell on the board at the right.

   The gate's detector turns on: the only respondents it exposes as bots
   (red robots) come from MTurk, and they drop into the bot tally at the
   bottom. Then a quality check (the coral lens) reads every answer on
   the board: nearly all direct-panel answers pass (green), fewer from
   the hybrid networks, about half from the marketplaces, and few from
   MTurk. The careless human answers drop into their own tally, many
   times longer than the bot tally. Last, coins show what one usable
   answer costs on each kind of platform: the direct panels, though
   dearer per person, cost the least. */

import { type Put, type StoryDef, rise, spr, fill, box, ease, lerp, ring, line, CHECK } from "./kit";

const CREAM = 0, GREY = 1, TEAL = 2, PURPLE = 3, BLUE = 4, GOLD = 5, GREEN = 6, RED = 7, CORAL = 8;

/* lane tops: direct panels, hybrid networks, marketplaces, MTurk */
const LANES = [0, 7, 14, 21];
const LCOL = [TEAL, PURPLE, BLUE, GREY];
/* storefronts per cluster (the ten platforms) */
const STORES = [3, 2, 4, 1];
const STORE_AT: [number, number][] = [[0, 0], [4, 0], [0, 3], [4, 3]];
/* a storefront: a doorway the respondents walk out of */
const ARCH = ["XXX", "X.X"];

const WALK_A = [".X.", "XXX", ".X.", ".X.", "X.X"];
const WALK_B = [".X.", "XXX", ".X.", ".X.", ".X."];
const BOT = ["XXX", "X.X", "XXX", "X.X"];
const BOT_ICON = ["XXX", "X.X", "XXX"];
const PERSON_ICON = [".X.", "XXX", "X.X"];

/* the walk: ten respondents per lane, leaving the storefronts in turn */
const WALKERS = 10;
const WALK_TIME = 1.2;
const depart = (lane: number, j: number) => 0.3 + j * 0.8 + lane * 0.18;
const GATE = 13;
/* MTurk respondents the detector exposes as bots (both reach the gate
   after the detector turns on, at five seconds) */
const BOTS = [5, 8];
/* which answers fail the quality check, by position on the board */
const FAILS = [[6], [1, 4, 7, 9], [0, 2, 5, 6, 8], [0, 1, 3, 4, 6, 7]];
/* coins one usable answer costs on each kind of platform */
const COST = [2, 3, 8, 10];

function stores(put: Put, lane: number, v: number) {
  for (let k = 0; k < STORES[lane]; k++) {
    const [dx, dy] = STORE_AT[k];
    spr(put, dx, LANES[lane] + dy, ARCH, { X: LCOL[lane] }, 0.95 * v);
  }
}

function board(put: Put, v: number) {
  box(put, 18, 0, 12, 27, CREAM, 0.45 * v);
}
const cellX = (j: number) => 19 + j;
function answer(put: Put, lane: number, j: number, c: number, v: number) {
  fill(put, cellX(j), LANES[lane] + 2, 1, 2, c, v);
}
/* how many answers each lane has delivered by time s (bots never arrive) */
function delivered(lane: number, s: number) {
  let n = 0;
  for (let j = 0; j < WALKERS; j++) {
    if (lane === 3 && BOTS.includes(j)) continue;
    if (s >= depart(lane, j) + WALK_TIME) n++;
  }
  return n;
}

/* the tallies at the bottom: bots caught, and careless human answers */
function tallies(put: Put, bots: number, careless: number, v: number) {
  spr(put, 0, 28, BOT_ICON, { X: RED }, 0.9 * v);
  spr(put, 0, 31, PERSON_ICON, { X: CREAM }, 0.9 * v);
  for (let k = 0; k < bots; k++) fill(put, 4 + k, 29, 1, 2, RED, 0.95);
  for (let k = 0; k < careless; k++) fill(put, 4 + k, 32, 1, 2, RED, 0.95);
}

/* the walk and the gate for the time s since the story began */
function crowd(put: Put, t: number, s: number) {
  let caught = 0;
  for (let lane = 0; lane < 4; lane++) {
    for (let j = 0; j < WALKERS; j++) {
      const k = (s - depart(lane, j)) / WALK_TIME;
      if (lane === 3 && BOTS.includes(j)) {
        const tGate = depart(lane, j) + WALK_TIME * ((GATE - 8) / 9);
        const d = s - tGate;
        if (d >= 1) { caught++; continue; }
        if (d >= 0) {
          /* exposed at the gate: it shakes, then drops into the bot tally */
          const slot = BOTS.indexOf(j);
          if (d < 0.4) {
            spr(put, GATE - 1 + (Math.floor(t * 12) % 2), LANES[3] + 2, BOT, { X: RED }, 1);
            for (let y = LANES[3] - 1; y <= LANES[3] + 6; y++) put(GATE, y, RED, 1);
          }
          else {
            const f = ease((d - 0.4) / 0.6);
            spr(put, lerp(GATE - 1, 4 + slot, f), lerp(LANES[3] + 2, 28, f), BOT, { X: RED }, 1);
          }
          continue;
        }
      }
      if (k < 0 || k >= 1) continue;
      spr(put, lerp(8, 17, k) - 1, LANES[lane] + 1, Math.floor(t * 6 + j) % 2 ? WALK_A : WALK_B, { X: CREAM }, 0.9);
    }
  }
  return caught;
}

function gate(put: Put, v: number) {
  for (let y = 0; y <= 27; y++) if (y % 2 === 0) put(GATE, y, CREAM, 0.6 * v);
  fill(put, GATE - 1, 27, 3, 1, CREAM, 0.8 * v);
}

/* the delivered answers on the board, unjudged */
function plainBoard(put: Put, s: number) {
  for (let lane = 0; lane < 4; lane++) {
    const n = delivered(lane, s);
    for (let j = 0; j < n; j++) answer(put, lane, j, CREAM, 0.85);
  }
}

const nAnswers = (lane: number) => (lane === 3 ? WALKERS - BOTS.length : WALKERS);
const careless = FAILS.reduce((a, f) => a + f.length, 0);

export const story: StoryDef = {
  cols: 30, rows: 34,
  colors: ["#f4e9d6", "#8b9099", "#3fa7a0", "#9b6fb0", "#5b8ff0", "#d9a441", "#7dc87d", "#c25048", "#DA7756"],
  phases: [
    /* respondents from ten platforms walk to the same survey */
    { dur: 5, render(u, put, t) {
      const v = rise(u, 0, 0.12);
      const s = u * 5;
      for (let lane = 0; lane < 4; lane++) stores(put, lane, v);
      board(put, v);
      crowd(put, t, s);
      plainBoard(put, s);
    }},
    /* the gate's detector finds bots, nearly all from MTurk */
    { dur: 5.5, render(u, put, t) {
      const s = 5 + u * 5.5;
      for (let lane = 0; lane < 4; lane++) stores(put, lane, 1);
      board(put, 1);
      gate(put, rise(u, 0, 0.08));
      const caught = crowd(put, t, s);
      plainBoard(put, s);
      tallies(put, caught, 0, rise(u, 0, 0.1));
    }},
    /* the quality check: the bigger gap is among the humans */
    { dur: 6, render(u, put, t) {
      for (let lane = 0; lane < 4; lane++) stores(put, lane, 1);
      board(put, 1);
      gate(put, 1 - rise(u, 0, 0.1));
      /* the lens reads each row of answers in turn */
      const row = Math.min(3, Math.floor(rise(u, 0.05, 0.65) * 4));
      const rk = rise(u, 0.05 + row * 0.15, 0.2 + row * 0.15);
      const lensX = lerp(18, 18 + nAnswers(row), rk);
      let gone = 0;
      for (let lane = 0; lane < 4; lane++) {
        for (let j = 0; j < nAnswers(lane); j++) {
          const judged = u > 0.05 && (lane < row || (lane === row && cellX(j) <= lensX)) || u >= 0.65;
          const fail = FAILS[lane].includes(j);
          if (!judged) { answer(put, lane, j, CREAM, 0.85); continue; }
          if (!fail) { answer(put, lane, j, GREEN, 0.95); continue; }
          /* careless answers fall into the tally, one after another */
          const f = ease(rise(u, 0.68 + gone * 0.008, 0.76 + gone * 0.008));
          if (f <= 0) answer(put, lane, j, RED, 0.95);
          else if (f < 1) fill(put, lerp(cellX(j), 4 + gone, f), lerp(LANES[lane] + 2, 32, f), 1, 2, RED, 0.95);
          gone++;
        }
      }
      let landed = 0;
      for (let g = 0; g < careless; g++) if (rise(u, 0.68 + g * 0.008, 0.76 + g * 0.008) >= 1) landed++;
      tallies(put, 2, landed, 1);
      if (u > 0.04 && u < 0.67) {
        const ly = LANES[row] + 2.5;
        ring(put, lensX, ly, 1.8, 1.8, CORAL, 1);
        line(put, lensX + 2, ly + 2, lensX + 3, ly + 3, CORAL, 1);
      }
    }},
    /* what one usable answer costs: the direct panels cost the least */
    { dur: 5.5, render(u, put, t) {
      for (let lane = 0; lane < 4; lane++) stores(put, lane, 1);
      board(put, 1);
      for (let lane = 0; lane < 4; lane++) {
        for (let j = 0; j < nAnswers(lane); j++) if (!FAILS[lane].includes(j)) answer(put, lane, j, GREEN, 0.95);
        /* one usable answer, and the coins it costs, paid at an even pace */
        const y = LANES[lane] + 2;
        fill(put, 7, y, 1, 2, GREEN, rise(u, 0.04, 0.1));
        const paid = Math.min(COST[lane], Math.floor(rise(u, 0.12, 0.72) * 10.99));
        for (let c = 0; c < paid; c++) fill(put, 8 + c, y, 1, 2, GOLD, c % 2 ? 0.75 : 0.95);
      }
      tallies(put, 2, careless, 1);
      if (u > 0.76) spr(put, 11, 1, CHECK, { X: GREEN }, rise(u, 0.76, 0.82));
    }},
  ],
};
