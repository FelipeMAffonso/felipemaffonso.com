/* Interdependent conditions for human-AI delegation (TiCS). The four
   conditions are four meshed gears driving the work between a person
   and an AI: when all four turn, tasks flow and the person's checking
   catches the wrong results. The AI's confidence dial pins at full and
   its gear jams; the jam spreads gear to gear, the line stops, and
   wrong results pile up. Repairing the dial alone does not restart it:
   the monitoring gear is now the bottleneck. Repaired together, all
   four turn again. */

import { type Put, type StoryDef, h, clamp01, env, rise, spr, box, fill, ease, lerp, line, ring, burst, coast, spinUp, path, CHECK, CROSS } from "./kit";

/* ---- TiCS: the four conditions of delegation as four meshed gears ---- */
const STICK = ["..X..", "XXXXX", "..X..", ".X.X.", "X...X"]; /* the person judging the AI */
const DIAL = [".XXX.", "X...X", "X...X", "XXXXX"]; /* the AI's stated confidence */
const LENS = [".XX..", "X..X.", "X..X.", ".XXX.", "....X"]; /* the person checking the output */
const TASKS = ["X.XXX", ".....", "X.XXX", ".....", "X.XXX"]; /* the task's structure */
const HUMAN = [".XXX.", ".XXX.", "..X..", "XXXXX", "..X..", ".X.X.", ".X.X."];
const ROBOT = ["..X..", "XXXXX", "X.X.X", "XXXXX", ".XXX.", ".X.X."];

/* ring order: assessment (top left), AI confidence (top right), task
   structure (bottom right), monitoring (bottom left); neighbours turn in
   opposite directions, as meshed gears do */
const GEARS = [
  { x: 9, y: 19, dir: 1, off: 0, icon: STICK },
  { x: 20, y: 19, dir: -1, off: Math.PI / 8, icon: DIAL },
  { x: 20, y: 30, dir: 1, off: 0, icon: TASKS },
  { x: 9, y: 30, dir: -1, off: Math.PI / 8, icon: LENS },
];
const MESH: [number, number][] = [[14.5, 19], [20, 24.5], [14.5, 30], [9, 24.5]];
const SPIN = 1.2;
/* when each gear jams in the cascade (fraction of that phase): the dial
   first, then assessment, then monitoring, then the task */
const JAM = [0.42, 0.25, 0.74, 0.58];

function gear(put: Put, cx: number, cy: number, ang: number, c: number, v: number) {
  for (let y = Math.floor(cy - 6); y <= Math.ceil(cy + 6); y++) {
    for (let x = Math.floor(cx - 6); x <= Math.ceil(cx + 6); x++) {
      const dx = x - cx, dy = y - cy, r = Math.hypot(dx, dy);
      if (r >= 3.1 && r <= 4.3) put(x, y, c, v * 0.7);
      else if (r > 4.3 && r <= 5.7 && Math.cos(8 * (Math.atan2(dy, dx) - ang)) > 0.4) put(x, y, c, v);
    }
  }
}

type GearState = { ang: number; ok: boolean; shake?: boolean };

/* the whole delegation machine: the person hands tasks to the AI on the
   top lane and gets results back on the lower lane; wrong results (red)
   are caught at the person's end while monitoring works, otherwise they
   pile up under the person; the four gears below drive it all */
function delegationScene(put: Put, t: number, gs: GearState[], s: number, caught: boolean,
  pile: number, level: number, needleOk: boolean, speed: number) {
  spr(put, 1, 2, HUMAN, { X: 0 }, 0.9);
  spr(put, 24, 2, ROBOT, { X: 6 }, 0.9);
  if (t % 2.6 > 0.15) { put(25, 4, 5, 1); put(27, 4, 5, 1); } /* the AI's eyes, blinking */
  fill(put, 7, 4, 16, 1, 1, 0.16);
  fill(put, 7, 7, 16, 1, 1, 0.16);
  for (let j = 0; j < 4; j++) {
    const q = s + j * 4;
    put(7 + (q % 16), 4, 0, 0.7);
    const id = Math.floor(q / 16) * 4 + j;
    const bad = h(id, 3, 5) < 0.34;
    const x = 22 - (q % 16);
    if (bad && caught && x < 10) {
      if (x >= 8) { put(x, 7, 5, 1); put(x, 6, 5, 0.55); put(x, 8, 5, 0.55); }
      continue;
    }
    if (x >= 7) put(x, 7, bad ? 3 : 2, 0.9);
  }
  for (let k = 0; k < pile; k++) put(1 + (k % 5), 11 - Math.floor(k / 5), 3, 0.85);
  gs.forEach((st, i) => {
    const g = GEARS[i];
    const jx = st.shake ? (Math.floor(t * 12) % 2 ? 0.6 : -0.6) : 0;
    gear(put, g.x + jx, g.y, st.ang, st.ok ? 0 : 3, st.ok ? 0.6 : 0.8);
    spr(put, g.x - 2, g.y - 2, g.icon, { X: st.ok ? 2 : 3 }, 0.95);
  });
  put(20, 19, needleOk ? 5 : 3, 1);
  put(19 + Math.round(clamp01(level) * 2), 18, needleOk ? 5 : 3, 1);
  if (speed > 0.05) {
    MESH.forEach(([mx, my], i) => put(mx, my, 5, speed * (0.3 + 0.3 * (1 + Math.sin(t * 14 + i * 1.7)))));
  }
}

export const story: StoryDef = {
  cols: 30, rows: 38,
  colors: ["#f4e9d6", "#5c6b7a", "#7dc87d", "#c25048", "#DA7756", "#d9a441", "#3fa7a0"],
  phases: [
    { dur: 5.5, render(u, put, t) {
      const gs = GEARS.map((g) => ({ ang: g.dir * SPIN * t + g.off, ok: true }));
      delegationScene(put, t, gs, 5 * t, true, 0, 0.5 + 0.5 * Math.sin(t * 1.7), true, 1);
    }},
    { dur: 6, render(u, put, t) {
      const t0 = t - u * 6;
      const gs = GEARS.map((g, i) => ({
        ang: g.dir * SPIN * (t0 + 6 * Math.min(u, JAM[i])) + g.off,
        ok: u < JAM[i],
        shake: i === 1 && u > 0.1 && u < 0.25,
      }));
      const pin = rise(u, 0, 0.12);
      const level = (1 - pin) * (0.5 + 0.5 * Math.sin(t * 1.7)) + pin;
      delegationScene(put, t, gs, 5 * (t0 + 6 * coast(u, 0.25, 0.75)), u < JAM[3],
        Math.round(rise(u, 0.6, 0.95) * 7), level, pin < 1, 1 - rise(u, 0.25, 0.75));
      /* the jam passes from gear to gear: dial to person, person to
         lens, lens to tasks */
      burst(put, MESH[0][0], MESH[0][1], rise(u, JAM[0], JAM[0] + 0.12), 3, 8, 2.5);
      burst(put, MESH[3][0], MESH[3][1], rise(u, JAM[3], JAM[3] + 0.12), 3, 8, 2.5);
      burst(put, MESH[2][0], MESH[2][1], rise(u, JAM[2], JAM[2] + 0.12), 3, 8, 2.5);
    }},
    { dur: 4.5, render(u, put, t) {
      const t2 = t - u * 4.5 - 6;
      const fixed = u > 0.28;
      const gs = GEARS.map((g, i) => {
        let ang = g.dir * SPIN * (t2 + 6 * JAM[i]) + g.off;
        if (i === 1 && u > 0.35) ang += 0.22 * Math.sin(t * 10); /* it strains against the jam */
        return { ang, ok: i === 1 && fixed };
      });
      delegationScene(put, t, gs, 5 * (t2 + 6 * coast(1, 0.25, 0.75)), false, 7,
        fixed ? 0.5 + 0.5 * Math.sin(t * 1.7) : 1, fixed, 0);
      burst(put, 20, 19, rise(u, 0.05, 0.4), 4, 16, 7); /* the repair */
      if (u > 0.4) { /* the new bottleneck: brackets close in on the monitoring gear */
        const v = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(t * 8));
        const k = Math.round(2 * (1 - ease(rise(u, 0.4, 0.6))));
        for (const [cx, cy, sx, sy] of [[2, 23, 1, 1], [16, 23, -1, 1], [2, 37, 1, -1], [16, 37, -1, -1]]) {
          const x0 = cx - sx * k, y0 = cy - sy * k;
          line(put, x0, y0, x0 + sx * 2, y0, 3, v);
          line(put, x0, y0, x0, y0 + sy * 2, 3, v);
        }
      }
    }},
    { dur: 6, render(u, put, t) {
      const t2 = t - u * 6 - 4.5 - 6;
      const fixAt = [0.06, 0.14, 0.22, 0.3];
      const go = spinUp(u, 0.38, 0.55);
      const gs = GEARS.map((g, i) => ({
        ang: g.dir * SPIN * (t2 + 6 * JAM[i] + 6 * go) + g.off,
        ok: i === 1 || u > fixAt[i] + 0.04,
      }));
      const lensOk = u > fixAt[3] + 0.04;
      delegationScene(put, t, gs, 5 * (t2 + 6 * coast(1, 0.25, 0.75) + 6 * go), lensOk,
        Math.round(7 * (1 - rise(u, 0.45, 0.8))), 0.5 + 0.5 * Math.sin(t * 1.7), true, rise(u, 0.38, 0.55));
      GEARS.forEach((g, i) => burst(put, g.x, g.y, rise(u, fixAt[i], fixAt[i] + 0.22), 4, 14, 6));
    }},
  ],
};
