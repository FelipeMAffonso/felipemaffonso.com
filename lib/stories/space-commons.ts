/* Behavioral micro-foundations for the space commons (Research Policy).
   Two space operators, teal and violet, launch from the same Earth into
   the same orbit, and every launch earns a gold prestige star on their
   leaderboard, so they race and the orbit fills. To show its strength,
   violet fires a missile at its own dead satellite: the blast earns a
   star too, but the debris spreads along the orbit, breaks a teal
   satellite and swarms around the crewed station. Then the rules of the
   game change, with no police: the leaderboard becomes a public ranking
   (coral), the blast star turns red and falls off it, and every dead
   satellite carries a default plan to come down. Teal brings its dead
   satellite down to burn up and earns the star; violet copies it. The
   same race for status now cleans the orbit, which glows green. */

import { type Put, type StoryDef, h, clamp01, rise, spr, box, fill, ease, lerp, ring, burst } from "./kit";

const CREAM = 0, GRAY = 1, BLUE = 2, TEAL = 3, VIOLET = 4, GOLD = 5, CORAL = 6, RED = 7, GREEN = 8;

/* the scene: Earth in the lower middle, the shared orbit around it, the
   station on a lower orbit, the leaderboard top left, the Moon top right */
const EX = 15, EY = 27.5, ER = 4.3;
const RX = 13.5, RY = 9.5;
const IX = 8.6, IY = 6.6;

/* one timeline in loop seconds; the four phases are windows on it */
const DUR = [6, 5.5, 6.5, 4.5];
const START = [0, 6, 11.5, 18];
const OMEGA = (2 * Math.PI) / 11.25; /* two laps per loop, so the orbit never jumps */
const OMEGA_ST = (2 * Math.PI) / 22.5; /* the station laps once per loop */
const SLOTS = 16, STEP = (2 * Math.PI) / SLOTS;

const T_MISSILE = 7.0, T_BLAST = 7.6, T_HIT = 8.8;
const T_FRAME = 11.6, T_SHAME = 12.4, T_TAGS = 13.0;
const T_GREEN = 18.4;
const STAR_FLY = 0.7, ROCKET_FLY = 1.0, DESC = 1.2;
const BLAST_SLOT = 10, VICTIM_SLOT = 11;

const PHI = (-40 * Math.PI) / 180 - BLAST_SLOT * STEP - OMEGA * T_BLAST;
const slotAng = (s: number, T: number) => PHI + s * STEP + OMEGA * T;
const ringPt = (a: number, k = 1): [number, number] => [EX + RX * k * Math.cos(a), EY + RY * k * Math.sin(a)];
const angDist = (a: number, b: number) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));
const deg = (d: number) => (d * Math.PI) / 180;

/* launch pads on Earth's surface, and where each operator aims in orbit */
const PAD_ANG: Record<number, number> = { [TEAL]: deg(232), [VIOLET]: deg(308) };
const padPt = (own: number): [number, number] => [EX + ER * Math.cos(PAD_ANG[own]), EY + ER * Math.sin(PAD_ANG[own])];

type Sat = { slot: number; own: number; dead: boolean; born: number };
const INITIAL: [number, number, boolean][] = [
  [3, TEAL, false], [11, TEAL, false], [7, VIOLET, false], [13, VIOLET, false],
  [4, TEAL, true], [10, VIOLET, true], [15, VIOLET, true],
];
const LAUNCHES: [number, number][] = [[0.9, TEAL], [1.4, VIOLET], [2.0, TEAL], [2.5, VIOLET], [3.1, TEAL], [3.6, VIOLET], [4.2, TEAL], [4.7, VIOLET]];

/* each launch takes the free place in orbit nearest its pad's side */
const SATS: Sat[] = (() => {
  const out: Sat[] = INITIAL.map(([slot, own, dead]) => ({ slot, own, dead, born: -1 }));
  const used = new Set(out.map((s) => s.slot));
  for (const [T, own] of LAUNCHES) {
    let best = -1, bd = 9;
    for (let s = 0; s < SLOTS; s++) {
      if (used.has(s)) continue;
      const d = angDist(slotAng(s, T), PAD_ANG[own]);
      if (d < bd) { bd = d; best = s; }
    }
    used.add(best);
    out.push({ slot: best, own, dead: false, born: T });
  }
  return out;
})();

/* the dead satellites that come down under the new default, teal first */
const DISPOSE = [{ slot: 4, own: TEAL, t0: 13.4 }, { slot: 15, own: VIOLET, t0: 14.8 }];
const descendK = (T: number, t0: number) => lerp(1, 0.3, ease(rise(T, t0, t0 + DESC)));
const inEarth = (x: number, y: number) => Math.hypot(x - EX, y - EY) < ER + 0.4;
/* when and where each one reaches the atmosphere */
const ENTRY = DISPOSE.map((d) => {
  for (let T = d.t0; T < d.t0 + DESC + 0.5; T += 0.02) {
    const [x, y] = ringPt(slotAng(d.slot, T), descendK(T, d.t0));
    if (inEarth(x, y)) return { T, x, y };
  }
  const [x, y] = ringPt(slotAng(d.slot, d.t0 + DESC), 0.3);
  return { T: d.t0 + DESC, x, y };
});

/* the debris: fragments of the blast, then of the broken teal satellite;
   fragment 0 is the one that reaches the teal satellite */
type Frag = { a0: number; t0: number; d: number; rho: number; fall: number };
const FRAGS: Frag[] = (() => {
  const out: Frag[] = [];
  const a0 = slotAng(BLAST_SLOT, T_BLAST);
  for (let k = 0; k < 14; k++) {
    out.push({
      a0, t0: T_BLAST,
      d: k === 0 ? STEP / (T_HIT - T_BLAST) : (h(k, 2, 3) * 2 - 1) * 0.85,
      rho: k === 0 ? 0 : h(k, 5, 1) * 0.58 - 0.42,
      fall: 13.8 + h(k, 9, 2) * 3.2,
    });
  }
  const a1 = slotAng(VICTIM_SLOT, T_HIT);
  for (let k = 0; k < 8; k++) {
    out.push({ a0: a1, t0: T_HIT, d: (h(k, 4, 7) * 2 - 1) * 0.7, rho: h(k, 6, 8) * 0.44 - 0.3, fall: 14.2 + h(k, 3, 9) * 3 });
  }
  return out;
})();

function fragPos(f: Frag, T: number): [number, number] {
  const k = (1 + f.rho * ease(rise(T, f.t0, f.t0 + 1.2))) * lerp(1, 0.3, ease(rise(T, f.fall, f.fall + 1.3)));
  return ringPt(f.a0 + (OMEGA + f.d) * (T - f.t0), k);
}

/* the leaderboard: one bar per operator, two cells per gold star */
const BASE = 16;
const BAR_X: Record<number, number> = { [TEAL]: 2, [VIOLET]: 5 };
function units(own: number, T: number) {
  let n = 1;
  for (const s of SATS) if (s.born >= 0 && s.own === own && T >= s.born + STAR_FLY) n++;
  if (own === VIOLET && T >= T_BLAST + 0.3 + STAR_FLY && T < T_SHAME) n++;
  DISPOSE.forEach((d, i) => { if (d.own === own && T >= ENTRY[i].T + STAR_FLY) n++; });
  return n;
}
const barTop = (own: number, T: number): [number, number] => [BAR_X[own] + 0.5, BASE - 1 - 2 * units(own, T)];

const STAR = [".X.", "XXX", ".X."];
const STATION = ["XX.X.XX", "XXXXXXX", "XX.X.XX"];
const SATURN = ["..XXX..", ".XXXXX.", "RRRRRRR", ".XXXXX.", "..XXX.."];

function flyStar(put: Put, from: [number, number], to: [number, number], k: number) {
  if (k <= 0 || k >= 1) return;
  const e = ease(k);
  const x = lerp(from[0], to[0], e), y = lerp(from[1], to[1], e) - Math.sin(Math.PI * k) * 3;
  spr(put, Math.round(x) - 1, Math.round(y) - 1, STAR, { X: GOLD }, 1);
}

/* a satellite: a body between two solar panels; a dead one tumbles,
   its panels turning from upright to flat and back */
function satSprite(put: Put, x: number, y: number, panel: number, body: number, v: number, bv = v, flat = false) {
  const cx = Math.round(x), cy = Math.round(y);
  for (const e of [-1, 0, 1]) {
    if (flat) { put(cx + e, cy - 1, panel, v); put(cx + e, cy + 1, panel, v); }
    else { put(cx - 1, cy + e, panel, v); put(cx + 1, cy + e, panel, v); }
  }
  put(cx, cy, body, bv);
}

/* a rocket (or the missile) on its way from a pad to a point in orbit */
function rocket(put: Put, from: [number, number], to: [number, number], k: number, body: number, t: number) {
  if (k <= 0 || k >= 1) return;
  const e = ease(k);
  const x = lerp(from[0], to[0], e), y = lerp(from[1], to[1], e);
  const L = Math.hypot(to[0] - from[0], to[1] - from[1]) || 1;
  const ux = (to[0] - from[0]) / L, uy = (to[1] - from[1]) / L;
  put(x, y, body === RED ? RED : CREAM, 1);
  put(x - ux, y - uy, body, 0.95);
  put(x - 2 * ux, y - 2 * uy, body, 0.95);
  const fl = Math.floor(t * 16) % 2;
  put(x - 3 * ux, y - 3 * uy, GOLD, fl ? 0.95 : 0.7);
  put(x - 4 * ux, y - 4 * uy, GOLD, fl ? 0.55 : 0.75);
}

const TWINKLE: [number, number][] = [[11, 1], [16, 3], [21, 1], [13, 7], [19, 9], [10, 12], [22, 13], [28, 11], [25, 16], [1, 21], [28, 36], [1, 37], [18, 5]];

function scene(put: Put, T: number, t: number) {
  /* distant stars */
  TWINKLE.forEach(([x, y], i) => put(x, y, CREAM, 0.3 + 0.25 * (0.5 + 0.5 * Math.sin(t * 1.3 + i * 2.1))));

  /* the Moon */
  for (let y = 1; y <= 9; y++) for (let x = 22; x <= 30; x++) {
    const d = Math.hypot(x - 26, y - 5);
    if (d <= 2.8) put(x, y, GRAY, d > 2 ? 0.85 : 0.65);
  }
  put(25, 4, CREAM, 0.7); put(27, 6, CREAM, 0.6);

  /* a ringed planet far away */
  spr(put, 11, 3, SATURN, { X: CREAM, R: GRAY }, 0.7);

  /* Earth, turning slowly: bright land on a darker ocean */
  for (let y = 22; y <= 33; y++) for (let x = 9; x <= 21; x++) {
    const d = Math.hypot(x - EX, y - EY);
    if (d > ER) continue;
    const lon = Math.asin(clamp01((x - EX) / ER * 0.5 + 0.5) * 2 - 1) + t * 0.35;
    const land = Math.sin(lon * 1.7 + y * 0.45) + 0.6 * Math.cos(y * 0.9 - lon * 2.1) > 0.55;
    put(x, y, BLUE, land ? 0.95 : 0.55);
  }
  /* the two launch pads */
  for (const own of [TEAL, VIOLET]) {
    const [px, py] = padPt(own);
    put(px - Math.cos(PAD_ANG[own]) * 0.6, py - Math.sin(PAD_ANG[own]) * 0.6, own, 1);
  }

  /* the shared orbit: grey, then green once it is clean */
  ring(put, EX, EY, RX, RY, GRAY, 0.3);
  const green = rise(T, T_GREEN, T_GREEN + 0.9);
  if (green > 0) ring(put, EX, EY, RX, RY, GREEN, 0.3 + 0.5 * green);

  /* the leaderboard */
  fill(put, 1, BASE, 7, 1, GRAY, 0.5);
  for (const own of [TEAL, VIOLET]) {
    const n = units(own, T);
    fill(put, BAR_X[own], BASE - 2 * n, 2, 2 * n, own, 0.85);
  }
  /* it becomes a public ranking: the coral frame */
  const fr = rise(T, T_FRAME, T_FRAME + 0.6);
  if (fr > 0) box(put, 0, 2, 9, 16, CORAL, 0.95 * fr);
  /* the blast star turns red and falls off the board */
  if (T >= T_SHAME && T < T_SHAME + 1.5) {
    const top = BASE - 2 * units(VIOLET, T_SHAME - 0.01);
    const k = rise(T, T_SHAME + 0.4, T_SHAME + 1.5);
    const x = BAR_X[VIOLET] + 0.5 + 6 * ease(k), y = top - 0.5 - 2 * Math.sin(Math.PI * Math.min(k, 0.5)) + 13 * k * k;
    spr(put, Math.round(x) - 1, Math.round(y) - 1, STAR, { X: RED }, 1 - 0.4 * k);
  }

  /* satellites on the shared orbit */
  for (const s of SATS) {
    if (s.born >= 0 && T < s.born) continue;
    const a = slotAng(s.slot, T);
    if (s.dead) {
      if (s.slot === BLAST_SLOT && T >= T_BLAST) continue;
      const di = DISPOSE.findIndex((d) => d.slot === s.slot);
      let k = 1;
      if (di >= 0) {
        if (T >= ENTRY[di].T) continue;
        k = descendK(T, DISPOSE[di].t0);
      }
      const [x, y] = ringPt(a, k);
      const burning = di >= 0 && T > DISPOSE[di].t0 && Math.hypot(x - EX, y - EY) < ER + 2;
      const tagged = di >= 0 && T >= T_TAGS;
      satSprite(put, x, y, burning ? GOLD : tagged ? CORAL : GRAY, s.own, tagged || burning ? 1 : 0.75, 0.9, Math.floor(t * 1.6 + s.slot * 0.7) % 2 === 1);
      /* the default plan: a coral arrow pointing it home */
      if (di >= 0 && T >= T_TAGS) {
        const ux = (EX - x) / (Math.hypot(EX - x, EY - y) || 1), uy = (EY - y) / (Math.hypot(EX - x, EY - y) || 1);
        const v = rise(T, T_TAGS, T_TAGS + 0.3);
        put(x + ux * 3.3, y + uy * 3.3, CORAL, v);
        put(x + ux * 2.3, y + uy * 2.3, CORAL, v);
        put(x + ux * 2.3 - uy, y + uy * 2.3 + ux, CORAL, v);
        put(x + ux * 2.3 + uy, y + uy * 2.3 - ux, CORAL, v);
      }
      continue;
    }
    if (s.slot === VICTIM_SLOT && T >= T_HIT) {
      if (T < T_HIT + 0.45) { const [x, y] = ringPt(a); satSprite(put, x + (Math.floor(t * 20) % 2 ? 0.6 : -0.6), y, RED, RED, 1); }
      continue;
    }
    const [x, y] = ringPt(a);
    satSprite(put, x, y, s.own, CREAM, 0.9, 1);
  }

  /* rockets and the stars their launches earn */
  for (const s of SATS) {
    if (s.born < 0) continue;
    const to = ringPt(slotAng(s.slot, s.born));
    rocket(put, padPt(s.own), to, rise(T, s.born - ROCKET_FLY, s.born), s.own, t);
    flyStar(put, to, barTop(s.own, s.born + STAR_FLY), rise(T, s.born, s.born + STAR_FLY));
  }

  /* the show of strength: a missile, the blast, and its star */
  const target = ringPt(slotAng(BLAST_SLOT, T_BLAST));
  rocket(put, padPt(VIOLET), target, rise(T, T_MISSILE, T_BLAST), RED, t);
  burst(put, target[0], target[1], rise(T, T_BLAST, T_BLAST + 0.9), RED, 14, 4);
  flyStar(put, target, barTop(VIOLET, T_BLAST + 0.3 + STAR_FLY), rise(T, T_BLAST + 0.3, T_BLAST + 0.3 + STAR_FLY));

  /* the debris; pieces that fall into the air burn up */
  for (const f of FRAGS) {
    if (T < f.t0) continue;
    const [x, y] = fragPos(f, T);
    const d = Math.hypot(x - EX, y - EY);
    if (d < ER + 0.4) continue;
    put(x, y, T > f.fall && d < ER + 2 ? GOLD : RED, 0.9);
  }

  /* the crewed station on its lower orbit: it flashes when debris is near */
  const sa = deg(-75) + OMEGA_ST * (T - 9.6); /* it passes through the debris after the blast */
  const sx = EX + IX * Math.cos(sa), sy = EY + IY * Math.sin(sa);
  let danger = false;
  for (const f of FRAGS) {
    if (T < f.t0) continue;
    const [x, y] = fragPos(f, T);
    if (T < f.fall && Math.hypot(x - sx, y - sy) < 2.6) danger = true;
  }
  const flash = danger && Math.floor(t * 8) % 2 === 0;
  spr(put, Math.round(sx) - 3, Math.round(sy) - 1, STATION, { X: flash ? RED : CREAM }, flash ? 1 : 0.8);

  /* the disposals earn the stars now */
  DISPOSE.forEach((d, i) => {
    const e = ENTRY[i];
    if (T >= e.T && T < e.T + 0.5) { put(e.x, e.y, GOLD, 1); put(e.x + 1, e.y, GOLD, 0.6); put(e.x - 1, e.y, GOLD, 0.6); }
    flyStar(put, [e.x, e.y], barTop(d.own, e.T + STAR_FLY), rise(T, e.T, e.T + STAR_FLY));
  });
}

export const story: StoryDef = {
  cols: 30, rows: 39,
  colors: ["#f4e9d6", "#8b9099", "#4a8fd6", "#3fa7a0", "#9b6fb0", "#d9a441", "#DA7756", "#c25048", "#7dc87d"],
  phases: DUR.map((dur, i) => ({
    dur,
    render(u: number, put: Put, t: number) { scene(put, START[i] + u * dur, t); },
  })),
};
