/* Simple is eco-friendly (Journal of Advertising; Felipe 2026-10-20:
   this exact story, first drawn for the visual complexity chapter, is
   the one for this paper). A passerby glances at a plain poster and a
   busy one: the plain one is easy to take in and wins the heart. Give
   the viewer a goal of a product that works (the bolt) and the busy
   poster reads powerful and wins it. Switch the goal to sustainability
   (the leaf) and the same ornaments fall off as waste while the plain
   poster grows a leaf. */

import { type Put, type StoryDef, h, clamp01, env, rise, spr, box, fill, ease, lerp, line, ring, burst, coast, spinUp, path, CHECK, CROSS } from "./kit";

/* ---- two posters, a passerby, a goal ---- */
const WALK_A = ["..X..", ".XXX.", "..X..", "XXXXX", "..X..", "..X..", ".X.X.", "X...X"];
const WALK_B = ["..X..", ".XXX.", "..X..", ".XXX.", "X.X.X", "..X..", "..X..", ".X.X."];
const STAND = ["..X..", ".XXX.", "..X..", "XXXXX", "..X..", "..X..", ".X.X.", ".X.X."];
const BOTTLE = [".X.", ".X.", "XXX", "XXX", "XXX", "XXX"];
const HEART = [".X.X.", "XXXXX", "XXXXX", ".XXX.", "..X.."];
const BOLT = ["..XX", ".XX.", "XXXX", ".XX.", "XX.."];
const LEAF = ["..XXX", ".XXXX", "XXXX.", "X.X..", "X...."];

/* the busy poster's ornaments; each falls to its own place on the
   litter pile when the viewer's goal turns to sustainability */
const ORNAMENTS = (() => {
  const out: { x: number; y: number; c: number; px: number; py: number; st: number }[] = [];
  const tones = [2, 6, 7, 0];
  for (let y = 5; y <= 15; y++) {
    for (let x = 19; x <= 25; x++) {
      if (x >= 20 && x <= 24 && y >= 9) continue; /* keep the bottle clear */
      if (h(x, y, 3) < 0.3) continue;
      const k = out.length;
      out.push({ x, y, c: tones[Math.floor(h(y, x, 5) * 4)], px: 17 + (k % 11), py: 37 - Math.floor(k / 11), st: 0.14 + 0.46 * h(k, 1, 9) });
    }
  }
  return out;
})();

function plainPoster(put: Put, frame: number, fv: number, glow: number) {
  box(put, 2, 3, 11, 15, frame, fv);
  fill(put, 4, 6, 7, 1, 0, 0.5 + 0.4 * glow);
  spr(put, 6, 10, BOTTLE, { X: 0 }, 0.55 + 0.4 * glow);
}

/* bright: how vivid it reads; flicker: how hard it is to take in at a
   glance; fall: the sustainability phase's clock, or -1 */
function busyPoster(put: Put, frame: number, fv: number, t: number, bright: number, flicker: number, fall: number) {
  box(put, 17, 3, 11, 15, frame, fv);
  for (let x = 18; x <= 26; x++) for (const y of [4, 16]) put(x, y, (x + y) % 2 ? 2 : 6, 0.65 * bright);
  for (let y = 5; y <= 15; y++) for (const x of [18, 26]) put(x, y, (x + y) % 2 ? 2 : 6, 0.65 * bright);
  for (const o of ORNAMENTS) {
    const f = fall < 0 ? 0 : ease(rise(fall, o.st, o.st + 0.16));
    if (f <= 0) {
      const fl = flicker > 0 && h(o.x, o.y, Math.floor(t * 10)) < flicker ? 0.12 : 1;
      put(o.x, o.y, o.c, bright * fl * (0.5 + 0.35 * h(o.x, o.y, 9) + 0.12 * Math.sin(t * 2 + o.x * o.y)));
    } else {
      put(lerp(o.x, o.px, f), lerp(o.y, o.py, f * f), 4, 0.8);
    }
  }
  spr(put, 21, 10, BOTTLE, { X: 0 }, 0.85 * Math.max(0.6, bright));
}

function thought(put: Put, v: number) {
  ring(put, 14.5, 23, 4.5, 3, 0, 0.55 * v);
  put(15, 28, 0, 0.55 * v);
}

function heartAt(put: Put, from: [number, number], to: [number, number], k: number) {
  const x = lerp(from[0], to[0], ease(k));
  const y = lerp(from[1], to[1], ease(k)) - Math.sin(Math.PI * clamp01(k)) * 5;
  spr(put, x, y, HEART, { X: 5 }, 1);
}
const HEART_PLAIN: [number, number] = [5, 19];
const HEART_BUSY: [number, number] = [20, 19];

export const story: StoryDef = {
  cols: 30, rows: 40,
  colors: ["#f4e9d6", "#8b9099", "#d9a441", "#7dc87d", "#c25048", "#DA7756", "#3fa7a0", "#9b6fb0"],
  phases: [
    { dur: 6, render(u, put, t) {
      const wx = lerp(-6, 30, u);
      const head = wx + 2;
      const onPlain = head >= 1 && head <= 13, onBusy = head >= 16 && head <= 29;
      plainPoster(put, 0, onPlain || u > 0.4 ? 0.8 : 0.45, onPlain ? 1 : 0.5);
      busyPoster(put, 1, 0.5, t, 0.8, onBusy ? 0.5 : 0, -1);
      spr(put, wx, 30, Math.floor(t * 5) % 2 ? WALK_A : WALK_B, { X: 0 }, 0.9);
      fill(put, 0, 38, 30, 1, 1, 0.35);
      /* the glance: smooth on the plain poster, broken on the busy one */
      if (onPlain) line(put, head, 29, 7, 13, 1, 0.3);
      if (onBusy && Math.floor(t * 8) % 2) line(put, head, 29, 22, 13, 1, 0.3);
      if (u > 0.3) spr(put, HEART_PLAIN[0], HEART_PLAIN[1], HEART, { X: 5 }, rise(u, 0.3, 0.4));
    }},
    { dur: 6, render(u, put, t) {
      const walk = rise(u, 0, 0.3);
      const wx = lerp(-6, 12, ease(walk));
      const goal = rise(u, 0.28, 0.4);
      const power = rise(u, 0.4, 0.55);
      plainPoster(put, 1, 0.45, 0.2);
      busyPoster(put, power > 0 ? 2 : 1, 0.5 + 0.4 * power, t, 0.8 + 0.2 * power, 0, -1);
      /* the busy poster radiates power */
      if (power > 0) {
        for (let k = 0; k < 8; k++) {
          const a = (k / 8) * Math.PI * 2 + 0.2;
          const len = 1 + 3 * power * (0.6 + 0.4 * Math.sin(t * 6 + k));
          for (let d = 0; d <= len; d++) {
            /* rays leave from the frame outward, never over the plain poster */
            const rx = 22 + Math.cos(a) * (7 + d), ry = 10 + Math.sin(a) * (9 + d);
            if (rx > 14 && ry >= 0 && ry < 19) put(rx, ry, 2, power * (1 - d / 5));
          }
        }
      }
      spr(put, wx, 30, walk < 1 ? (Math.floor(t * 5) % 2 ? WALK_A : WALK_B) : STAND, { X: 0 }, 0.9);
      fill(put, 0, 38, 30, 1, 1, 0.35);
      thought(put, goal);
      spr(put, 13, 21, BOLT, { X: 2 }, goal);
      heartAt(put, HEART_PLAIN, HEART_BUSY, rise(u, 0.5, 0.8));
    }},
    { dur: 6.5, render(u, put, t) {
      const swap = rise(u, 0, 0.15);
      const green = rise(u, 0.25, 0.5);
      plainPoster(put, green > 0 ? 3 : 1, 0.45 + 0.45 * green, 0.2 + 0.8 * green);
      busyPoster(put, u > 0.2 ? 4 : 2, 0.7, t, 1 - 0.4 * rise(u, 0.15, 0.6), 0, u);
      /* the plain poster grows a leaf beside its bottle */
      const vine: [number, number][] = [[9, 14], [10, 13], [10, 12], [11, 11], [10, 10], [11, 9], [10, 8], [11, 8]];
      const grown = Math.round(rise(u, 0.3, 0.65) * vine.length);
      for (let i = 0; i < grown; i++) put(vine[i][0], vine[i][1], 3, 0.95);
      spr(put, 12, 30, STAND, { X: 0 }, 0.9);
      fill(put, 0, 38, 30, 1, 1, 0.35);
      thought(put, 1);
      spr(put, 13, 21, BOLT, { X: 2 }, 1 - swap);
      spr(put, 12, 21, LEAF, { X: 3 }, rise(u, 0.08, 0.2));
      heartAt(put, HEART_BUSY, HEART_PLAIN, rise(u, 0.55, 0.85));
    }},
  ],
};
