/* Detecting AI agents in online research with cognitive traps (Journal
   of Consumer Research). A person (cream) and an AI agent (teal) take the
   same online survey; the agent sees the screen through screenshots (the
   teal corners). An ordinary attention check cannot tell them apart: the
   agent reads every word, follows the hidden instruction (gold) and both
   tick the right box. Then a cognitive trap from the paper, the Moving
   Robot: a gold token steps toward the center of a box, and the question
   is where it will be next. The person puts it at the center; the agent
   puts it in the wrong corner. Five more visual traps follow (two lines
   with fins, a cafe wall, a circle ringed by circles, planets ringed by
   shapes, a big circle rolling toward a small one); the person passes
   nearly all, the agent fails most. Three failures flag it: the floor
   opens under the agent (coral) and it drops out, its rows leave the
   data, and the person's answers stay. */

import { type Put, type StoryDef, rise, spr, box, fill, ease, lerp, line, ring, CHECK } from "./kit";

const CREAM = 0, GRAY = 1, TEAL = 2, GREEN = 3, RED = 4, CORAL = 5, GOLD = 6;

const PERSON = [".XXX.", ".XXX.", "..X..", "XXXXX", "X.X.X", "..X..", ".X.X.", ".X.X.", ".X.X."];
const AGENT = ["...X...", ".XXXXX.", ".XEXEX.", ".XXXXX.", "...X...", "XXXXXXX", "X.XXX.X", "..X.X..", "..X.X.."];
const BIGX = ["X...X", ".X.X.", "..X..", ".X.X.", "X...X"];
/* the flag left where the agent stood: a gray pole, a coral cloth */
const FLAG = ["PFFFF", "PFFFF", "PFFF.", "P....", "P....", "P....", "P...."];
const PX = 4, AX = 20, TOP = 26; /* where the person and the agent stand */
const P_HEAD: [number, number] = [6, 24];
const A_HEAD: [number, number] = [23, 24];

/* tally of the six traps above each actor: -1 not yet, 1 pass, 0 fail */
type Tally = number[];

function monitor(put: Put, frame: number, fv: number) {
  box(put, 1, 1, 28, 17, frame, fv);
  fill(put, 13, 18, 4, 1, GRAY, 0.6);
  fill(put, 11, 19, 8, 1, GRAY, 0.6);
}

function tally(put: Put, x0: number, marks: Tally, glow = 0) {
  for (let i = 0; i < 6; i++) {
    const x = x0 + i * 2, m = marks[i];
    if (m === undefined || m < 0) put(x, 24, GRAY, 0.5);
    else fill(put, x, 23, 1, 2, m ? GREEN : RED, 0.95);
  }
  if (glow > 0) box(put, x0 - 1, 22, 13, 4, CORAL, glow);
}

/* the stage: monitor, floor, the two actors and their tallies. fall moves
   the agent down through the open trapdoor (0 = standing) */
function stage(put: Put, t: number, pt: Tally, at: Tally, opts: { frame?: number; fv?: number; fall?: number; flap?: number; glow?: number } = {}) {
  monitor(put, opts.frame ?? GRAY, opts.fv ?? 0.65);
  const flap = opts.flap ?? 0;
  fill(put, 0, 35, 19, 1, GRAY, 0.55);
  fill(put, 29, 35, 1, 1, GRAY, 0.55);
  if (flap <= 0) fill(put, 19, 35, 10, 1, GRAY, 0.55);
  else {
    /* the trapdoor: two flaps hinged at the ends swing down */
    const a = ease(flap) * Math.PI / 2;
    line(put, 19, 35, 19 + Math.cos(a) * 4.5, 35 + Math.sin(a) * 4.5, CORAL, 1);
    line(put, 28, 35, 28 - Math.cos(a) * 4.5, 35 + Math.sin(a) * 4.5, CORAL, 1);
  }
  spr(put, PX, TOP, PERSON, { X: CREAM }, 0.9);
  const fy = TOP + (opts.fall ?? 0);
  const blink = t % 3.1 < 0.15;
  spr(put, AX, fy, AGENT, { X: TEAL, E: blink ? TEAL : GOLD }, 0.95);
  tally(put, 2, pt);
  if ((opts.fall ?? 0) < 1) tally(put, 18, at, opts.glow ?? 0);
}

/* the agent's screenshot: four teal corners close on the monitor */
function snap(put: Put, k: number) {
  if (k <= 0 || k >= 1) return;
  const v = 0.6 + 0.4 * Math.sin(k * Math.PI);
  const d = Math.round(2 * (1 - ease(k * 2)));
  for (const [cx, cy, sx, sy] of [[0, 0, 1, 1], [29, 0, -1, 1], [0, 18, 1, -1], [29, 18, -1, -1]]) {
    const x0 = cx - sx * d, y0 = cy - sy * d;
    line(put, x0, y0, x0 + sx * 3, y0, TEAL, v);
    line(put, x0, y0, x0, y0 + sy * 3, TEAL, v);
  }
}

/* an answer leaving an actor's head for the screen, on a small arc */
function fly(put: Put, from: [number, number], to: [number, number], k: number, c: number) {
  if (k <= 0) return;
  const e = ease(k);
  const x = lerp(from[0], to[0], e), y = lerp(from[1], to[1], e) - Math.sin(Math.PI * Math.min(1, k)) * 3;
  fill(put, x, y, 2, 2, c, 1);
}

function verdict(put: Put, who: "p" | "a", pass: boolean, v: number) {
  if (v <= 0) return;
  const x = who === "p" ? PX : AX + 1;
  if (pass) spr(put, x, 18, CHECK, { X: GREEN }, v);
  else spr(put, x, 17, BIGX, { X: RED }, v);
}

const question = (put: Put) => fill(put, 4, 3, 13, 1, CREAM, 0.8);

/* ---- the five traps of the third phase, drawn on the screen ---- */
function mullerLyer(put: Put, v: number) {
  line(put, 6, 7, 23, 7, CREAM, v); /* the top line is really longer */
  for (const [x, s] of [[6, -1], [23, 1]] as [number, number][]) { put(x + s, 6, CREAM, v); put(x + 2 * s, 5, CREAM, v); put(x + s, 8, CREAM, v); put(x + 2 * s, 9, CREAM, v); }
  line(put, 9, 13, 20, 13, CREAM, v);
  for (const [x, s] of [[9, 1], [20, -1]] as [number, number][]) { put(x + s, 12, CREAM, v); put(x + 2 * s, 11, CREAM, v); put(x + s, 14, CREAM, v); put(x + 2 * s, 15, CREAM, v); }
}
function cafeWall(put: Put, v: number) {
  const shift = [0, 2, 0, 2];
  for (let r = 0; r < 4; r++) {
    const y = 5 + r * 3;
    for (let x = 3; x <= 26; x++) if (Math.floor((x - 3 + shift[r]) / 3) % 2 === 0) { put(x, y, CREAM, v); put(x, y + 1, CREAM, v); }
    if (r < 3) line(put, 3, y + 2, 26, y + 2, GRAY, 0.6 * v);
  }
}
function ebbinghaus(put: Put, v: number) {
  ring(put, 9, 10, 1.6, 1.6, CREAM, v);
  for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; ring(put, 9 + Math.cos(a) * 4.4, 10 + Math.sin(a) * 4.4, 1.2, 1.2, GRAY, 0.75 * v); }
  ring(put, 21, 10, 2.3, 2.3, CREAM, v);
  fill(put, 21, 10, 1, 1, CREAM, v);
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; put(21 + Math.cos(a) * 4.2, 10 + Math.sin(a) * 4.2, GRAY, 0.8 * v); }
}
function planets(put: Put, v: number) {
  let k = 0;
  for (const y of [7, 13]) for (const x of [6, 14, 22]) {
    fill(put, x, y, 2, 2, GOLD, v);
    const n = k === 4 ? 4 : 5; /* one planet has one shape fewer */
    for (let i = 0; i < n; i++) { const a = (i / 5) * Math.PI * 2 + k; put(x + 0.5 + Math.cos(a) * 2.6, y + 0.5 + Math.sin(a) * 2.2, CREAM, 0.8 * v); }
    k++;
  }
}
function oranges(put: Put, v: number) {
  ring(put, 21, 10, 2.6, 2.6, CREAM, v);
  ring(put, 6, 10, 1, 1, CREAM, v);
  for (let x = 9; x <= 17; x += 2) put(x, 10, GRAY, 0.7 * v); /* its straight path */
  put(13, 9, GOLD, v); put(12, 10, GOLD, v); put(13, 10, GOLD, v); put(14, 10, GOLD, v); /* the triangle in the way */
  ring(put, 11, 5, 1, 1, CREAM, 0.7 * v);
  fill(put, 15, 14, 2, 2, CREAM, 0.7 * v);
}
const TRAPS = [mullerLyer, cafeWall, ebbinghaus, planets, oranges];
/* results for traps two to six (the Moving Robot is the first) */
const P_RES = [1, 1, 1, 1, 0];
const A_RES = [0, 0, 0, 1, 1];
const TOKEN: [number, number][] = [[8, 6], [10, 7], [12, 8]]; /* steps one to three; step four is (14, 9), the center */

/* the data the researcher keeps: person rows (cream) and agent rows (teal) */
const ROWS = [0, 1, 0, 1, 1, 0];

export const story: StoryDef = {
  cols: 30, rows: 38,
  colors: ["#f4e9d6", "#8b9099", "#3fa7a0", "#7dc87d", "#c25048", "#DA7756", "#d9a441"],
  phases: [
    { dur: 5, render(u, put, t) {
      /* an ordinary attention check: both read it and both pass */
      stage(put, t, [-1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1]);
      question(put);
      const rows: [number, number][] = [[5, 22], [7, 20], [9, 17]];
      const total = 22 + 20 + 17;
      const read = Math.floor(rise(u, 0.22, 0.48) * total);
      let n = 0;
      for (const [y, len] of rows) {
        for (let x = 4; x < 4 + len; x++, n++) {
          const instr = y === 7 && x >= 15 && x <= 19; /* the hidden instruction */
          const c = instr ? GOLD : CREAM;
          if (n < read && u < 0.5) put(x, y, instr ? GOLD : TEAL, n === read - 1 ? 1 : 0.75);
          else put(x, y, c, instr ? 0.8 : 0.5);
        }
      }
      for (let i = 0; i < 5; i++) box(put, 4 + i * 5, 12, 3, 3, i === 3 && u > 0.66 ? GREEN : GRAY, 0.75);
      snap(put, rise(u, 0.06, 0.22));
      fly(put, P_HEAD, [19.5, 12.5], rise(u, 0.48, 0.6), CREAM);
      fly(put, A_HEAD, [19.5, 12.5], rise(u, 0.53, 0.65), TEAL);
      if (u > 0.6) put(20, 13, CREAM, 1);
      verdict(put, "p", true, rise(u, 0.66, 0.72));
      verdict(put, "a", true, rise(u, 0.68, 0.74));
    }},
    { dur: 6.5, render(u, put, t) {
      /* the Moving Robot trap: where will the token be on step four? */
      const pt = [u > 0.55 ? 1 : -1, -1, -1, -1, -1, -1];
      const at = [u > 0.78 ? 0 : -1, -1, -1, -1, -1, -1];
      stage(put, t, pt, at);
      question(put);
      box(put, 5, 4, 20, 12, GRAY, 0.7);
      TOKEN.forEach(([x, y], k) => {
        const on = rise(u, 0.05 + k * 0.1, 0.08 + k * 0.1);
        const latest = u < 0.38 && (k === 2 || u < 0.15 + k * 0.1);
        if (on > 0) fill(put, x, y, 2, 2, GOLD, on * (latest ? 1 : 0.55));
      });
      /* the empty fourth step waits */
      if (u > 0.34 && u < 0.4 && Math.floor(t * 6) % 2) box(put, 13, 8, 4, 4, GOLD, 0.6);
      fly(put, P_HEAD, [14, 9], rise(u, 0.38, 0.5), CREAM);
      if (u > 0.5) fill(put, 14, 9, 2, 2, CREAM, 1);
      if (u > 0.52) ring(put, 14.5, 9.5, 2.3, 2.3, GREEN, 0.9);
      verdict(put, "p", true, rise(u, 0.52, 0.58));
      snap(put, rise(u, 0.52, 0.64));
      fly(put, A_HEAD, [21, 5], rise(u, 0.62, 0.74), TEAL);
      if (u > 0.74) fill(put, 21, 5, 2, 2, TEAL, 1);
      if (u > 0.76) ring(put, 21.5, 5.5, 2.1, 1.6, RED, 0.9);
      verdict(put, "a", false, rise(u, 0.76, 0.82));
    }},
    { dur: 5.5, render(u, put, t) {
      /* five more traps: the person passes nearly all, the agent fails most */
      const pt: Tally = [1, -1, -1, -1, -1, -1];
      const at: Tally = [0, -1, -1, -1, -1, -1];
      let cur = -1, local = 0;
      for (let k = 0; k < 5; k++) {
        const s = 0.04 + k * 0.19;
        if (u >= s + 0.12) { pt[k + 1] = P_RES[k]; at[k + 1] = A_RES[k]; }
        if (u >= s && u < s + 0.19) { cur = k; local = (u - s) / 0.19; }
      }
      stage(put, t, pt, at);
      question(put);
      if (cur >= 0) {
        const v = Math.min(1, local / 0.12, (1 - local) / 0.08);
        TRAPS[cur](put, 0.6 + 0.4 * v);
        if (local > 0.63) {
          verdict(put, "p", P_RES[cur] === 1, 1);
          verdict(put, "a", A_RES[cur] === 1, 1);
        }
      }
    }},
    { dur: 6, render(u, put, t) {
      /* three failures flag the agent: the floor opens and it drops out */
      const pt: Tally = [1, 1, 1, 1, 1, 0];
      const at: Tally = [0, 0, 0, 0, 1, 1];
      const glow = u < 0.22 ? (Math.floor(t * 6) % 2 ? 1 : 0.6) : 0;
      const fall = Math.pow(rise(u, 0.24, 0.42), 2) * 16;
      const done = rise(u, 0.78, 0.84);
      const flap = rise(u, 0.2, 0.28) - rise(u, 0.46, 0.54);
      stage(put, t, pt, at, { fall, flap, glow, frame: done > 0 ? GREEN : GRAY, fv: 0.65 + 0.3 * done });
      if (u < 0.42) verdict(put, "a", false, 1 - rise(u, 0.3, 0.42));
      /* the agent is flagged: a coral flag rises where it stood */
      const up = Math.round(rise(u, 0.54, 0.64) * 7);
      if (up > 0) spr(put, 22, 35 - up, FLAG.slice(0, up), { P: GRAY, F: CORAL }, 1);
      verdict(put, "p", true, rise(u, 0.5, 0.56));
      /* the data: the agent's rows turn red and leave, the person's close up */
      const show = rise(u, 0.3, 0.4);
      const gone = rise(u, 0.6, 0.68);
      const close = ease(rise(u, 0.68, 0.78));
      let kept = 0;
      ROWS.forEach((agent, i) => {
        const y0 = 4 + i * 2;
        if (agent) {
          if (gone >= 1) return;
          const c = u > 0.52 ? RED : TEAL;
          const v = show * (1 - gone);
          fill(put, 4, y0, 2, 1, c, v);
          for (let x = 8; x <= 24; x += 2) put(x, y0, c, 0.85 * v);
        } else {
          const y = Math.round(lerp(y0, 4 + kept * 2, close));
          kept++;
          fill(put, 4, y, 2, 1, CREAM, show);
          for (let x = 8; x <= 24; x += 2) put(x, y, CREAM, 0.75 * show);
        }
      });
    }},
  ],
};
