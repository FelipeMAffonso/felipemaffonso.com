/* ============================================================
   Pixel poster engine.
   Deterministic per-cell motif programs for the animated LED-grid
   posters (the its_sslvr language: a fixed grid of rounded cells
   on a dark card, a slow organic motif moving through it).

   Contract: an engine answers, for one cell at one moment, either
   null (cell unlit) or { v, c } where v is intensity 0..1 and c
   indexes into the poster's color list. Everything is a pure
   function of (x, y, t, grid), so rendering is resumable and
   cheap; there is no per-frame state.
   ============================================================ */

export type Cell = { v: number; c: number } | null;

export type Grid = {
  cols: number;
  rows: number;
  seed: number;
  colorsN: number;
  p: Record<string, number>;
  /* optional spatial map for map-driven engines (glimmer): one
     palette index per cell, 0 = unlit, indexing into colors */
  map?: number[];
};

export type EngineName =
  | "drift"
  | "tide"
  | "blaze"
  | "converge"
  | "reveal"
  | "spark"
  | "structure"
  | "orbit"
  | "contagion"
  | "band"
  | "glimmer";

export type MotifSpec = {
  engine: EngineName;
  colors: string[];
  seed?: number;
  params?: Record<string, number>;
  map?: number[];
};

/* ---- deterministic hash + value noise ----------------------- */

function fract(n: number) {
  return n - Math.floor(n);
}
function hash1(n: number) {
  return fract(Math.sin(n * 127.1 + 311.7) * 43758.5453);
}
function hash3(x: number, y: number, z: number) {
  return fract(Math.sin(x * 127.1 + y * 269.5 + z * 419.2) * 43758.5453);
}
function lerp(a: number, b: number, u: number) {
  return a + (b - a) * u;
}
function smooth(u: number) {
  return u * u * (3 - 2 * u);
}

/* 3D value noise, smooth in every axis; z carries time. */
function noise3(x: number, y: number, z: number) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = smooth(x - xi), yf = smooth(y - yi), zf = smooth(z - zi);
  const c000 = hash3(xi, yi, zi), c100 = hash3(xi + 1, yi, zi);
  const c010 = hash3(xi, yi + 1, zi), c110 = hash3(xi + 1, yi + 1, zi);
  const c001 = hash3(xi, yi, zi + 1), c101 = hash3(xi + 1, yi, zi + 1);
  const c011 = hash3(xi, yi + 1, zi + 1), c111 = hash3(xi + 1, yi + 1, zi + 1);
  const x00 = lerp(c000, c100, xf), x10 = lerp(c010, c110, xf);
  const x01 = lerp(c001, c101, xf), x11 = lerp(c011, c111, xf);
  return lerp(lerp(x00, x10, yf), lerp(x01, x11, yf), zf);
}

/* ---- engines ------------------------------------------------ */

/* Small creatures of light wandering a mostly dark grid: dark rim,
   saturated middle, white-hot core, ghost trails where they just were,
   flickering edge cells, and a few stray satellite cells. This is the
   closest transcription of the reference's "A Wandering Mind" card. */
function drift(x: number, y: number, t: number, g: Grid): Cell {
  const blobs = g.p.blobs ?? 2;
  const r = Math.min(g.cols, g.rows) * (g.p.radius ?? 0.19);
  let out: Cell = null;
  let sum = 0, best = 0, bestB = 0, bestF = 0;
  for (let b = 0; b < blobs; b++) {
    const s = g.seed + b * 17.3;
    /* current position plus two echoes into the recent past (the trail) */
    for (let e = 0; e < 3; e++) {
      const te = t - e * 0.55;
      const cx = g.cols * (0.5 + 0.33 * (noise3(s, 3.1, te * 0.055) * 2 - 1));
      const cy = g.rows * (0.5 + 0.3 * (noise3(4.7, s, te * 0.055 + 7) * 2 - 1));
      const f = Math.max(0, 1 - Math.hypot(x - cx, y - cy) / r);
      const w = e === 0 ? 1 : e === 1 ? 0.22 : 0.09;
      const v = f * f * w;
      if (e === 0) {
        sum += v;
        if (v > best) { best = v; bestB = b % Math.max(1, g.colorsN - 1); bestF = f; }
      } else if (v > (out?.v ?? 0) && v > 0.04) {
        out = { v: v * 0.6, c: b % Math.max(1, g.colorsN - 1) };
      }
    }
  }
  /* edge flicker: cells at the blob rim blink on and off each beat */
  const flick = hash3(x, y, Math.floor(t * 3.2) + g.seed);
  if (sum > 0.05) {
    if (bestF < 0.42 && flick < 0.45) return out; // rim cell sitting this beat out
    const merged = sum > best * 1.55 && sum > 0.3;
    const core = bestF > 0.8;
    const tex = 0.72 + 0.28 * noise3(x * 0.9, y * 0.9, t * 0.3 + g.seed);
    return {
      v: Math.min(1, sum * 1.4) * tex,
      c: merged || core ? g.colorsN - 1 : bestB,
    };
  }
  /* stray satellites far from the creatures, faintly alive */
  if (hash3(x, y, g.seed) > 0.986 && noise3(x * 0.3, y * 0.3, t * 0.15) > 0.55) {
    return { v: 0.16, c: Math.floor(hash3(y, x, g.seed) * Math.max(1, g.colorsN - 1)) };
  }
  return out;
}

/* A wave that builds, breaks, and recedes; the last color is foam. */
function tide(x: number, y: number, t: number, g: Grid): Cell {
  const amp = 0.16 + 0.62 * (0.5 + 0.5 * Math.sin(t * (g.p.cycle ?? 0.11) + g.seed));
  const front =
    g.rows * (1 - amp) +
    Math.sin(x * 0.52 + t * 0.45) * 1.3 +
    (noise3(x * 0.3, g.seed, t * 0.1) * 2 - 1) * 2.2;
  if (y < front - 1.1) {
    return hash3(x, y, g.seed) > 0.965 ? { v: 0.12, c: 0 } : null;
  }
  if (Math.abs(y - front) < 1.1) return { v: 0.95, c: g.colorsN - 1 };
  const depth = Math.min(1, (y - front) / Math.max(1, g.rows - front));
  const tex = 0.6 + 0.4 * noise3(x * 0.7, y * 0.7, t * 0.32);
  const c = Math.min(g.colorsN - 2, Math.floor(depth * (g.colorsN - 1)));
  return { v: (0.88 - depth * 0.38) * tex, c };
}

/* Rising fire; color climbs the ramp with intensity. */
function blaze(x: number, y: number, t: number, g: Grid): Cell {
  const h = 1 - y / g.rows;
  const n = noise3(x * 0.55, y * 0.4 - t * (g.p.rise ?? 0.85), g.seed);
  const center = 1 - Math.abs(x - g.cols / 2) / (g.cols * 0.62);
  const shape = n * (0.5 + 0.5 * Math.sin(t * 0.6 + x * 0.9)) * (h + 0.18) * Math.max(0, center);
  if (shape < 0.13) return null;
  const c = Math.min(g.colorsN - 1, Math.floor(shape * (g.colorsN + 1.5)));
  return { v: Math.min(1, shape * 1.6), c };
}

/* Particles on a conveyor from scatter to a destination column
   (reverse: they disperse from it). Arrivals glow the last color. */
function converge(x: number, y: number, t: number, g: Grid): Cell {
  const count = g.p.count ?? 26;
  const rev = (g.p.reverse ?? 0) > 0;
  let out: Cell = null;
  for (let i = 0; i < count; i++) {
    const ph = fract(t * (g.p.speed ?? 0.045) + hash1(i * 3.7 + g.seed));
    let e = smooth(ph);
    if (rev) e = 1 - e;
    const sx = g.cols * hash1(i * 12.9 + g.seed + 1);
    const sy = g.rows * hash1(i * 7.3 + g.seed + 2);
    const dx = g.cols * (g.p.tx ?? 0.78);
    const dy = g.rows * (0.12 + 0.76 * hash1(i * 5.1 + g.seed + 3));
    const px = lerp(sx, dx, e);
    const py = lerp(sy, dy, e);
    const f = Math.max(0, 1 - Math.hypot(x - px, y - py) / 1.6);
    if (f <= (out?.v ?? 0)) continue;
    const env = Math.min(1, Math.min(ph, 1 - ph) * 6);
    const near = rev ? ph < 0.2 : ph > 0.8;
    out = {
      v: f * (0.35 + 0.65 * env),
      c: near ? g.colorsN - 1 : Math.floor(hash1(i * 9.1) * (g.colorsN - 1)),
    };
  }
  return out;
}

/* A curtain sweeps open and closed over a hidden coral block. */
function reveal(x: number, y: number, t: number, g: Grid): Cell {
  const ph = fract(t * (g.p.speed ?? 0.04) + g.seed * 0.31);
  const sweep = ph < 0.5 ? smooth(ph * 2) : smooth((1 - ph) * 2);
  const edge = (g.cols + 2) * sweep - 1;
  if (x > edge) {
    return hash3(x, y, g.seed) > 0.94 ? { v: 0.15, c: 0 } : null;
  }
  if (edge - x < 1.2) return { v: 0.92, c: g.colorsN - 1 };
  const inBlock =
    Math.abs(x - g.cols * 0.6) < g.cols * 0.17 && Math.abs(y - g.rows * 0.48) < g.rows * 0.2;
  const tex = 0.65 + 0.35 * noise3(x * 0.8, y * 0.8, t * 0.25);
  if (inBlock) return { v: 0.85 * tex, c: g.colorsN - 2 };
  const stripe = (x + y) % 4 < 2;
  if (!stripe) return null;
  return { v: 0.38 * tex, c: 0 };
}

/* A calm dim field with occasional blooming sparks. */
function spark(x: number, y: number, t: number, g: Grid): Cell {
  const rate = g.p.rate ?? 0.13;
  const cellId = x + y * g.cols;
  const off = hash1(cellId * 1.7 + g.seed) * 10;
  const win = Math.floor(t * rate + off);
  const r = hash3(x, y, win * 13.7 + g.seed);
  if (r > (g.p.thresh ?? 0.975)) {
    const ph = fract(t * rate + off);
    const env = Math.sin(Math.PI * ph);
    const c = hash3(y, x, win) > 0.45 ? g.colorsN - 1 : g.colorsN - 2;
    return { v: 0.25 + 0.75 * env, c };
  }
  const base = noise3(x * 0.5, y * 0.5, t * 0.09 + g.seed);
  return base > 0.74 ? { v: 0.13, c: 0 } : null;
}

/* An ordered lattice pulsing in phase against a noise field. */
function structure(x: number, y: number, t: number, g: Grid): Cell {
  const half = x < g.cols * (g.p.splitAt ?? 0.5);
  const ordered = (g.p.reverse ?? 0) > 0 ? !half : half;
  const col = g.p.col ?? -1;
  if (col >= 0 && Math.abs(x - g.cols * col) < 0.6) {
    const pulse = 0.6 + 0.4 * Math.sin(t * 0.5 + y * 0.5);
    return { v: pulse, c: g.colorsN - 1 };
  }
  if (ordered) {
    if ((x + y) % 2 !== 0) return null;
    const pulse = 0.5 + 0.38 * Math.sin(t * 0.45 + (x + y) * 0.16);
    return { v: pulse, c: 0 };
  }
  const n = noise3(x * 0.9, y * 0.9, t * 0.26 + g.seed);
  if (n < 0.56) return null;
  return { v: (n - 0.56) / 0.44, c: n > 0.82 ? g.colorsN - 2 : Math.min(1, g.colorsN - 1) };
}

/* A breathing core with satellites riding an elliptical ring. */
function orbit(x: number, y: number, t: number, g: Grid): Cell {
  const cx = g.cols / 2, cy = g.rows / 2;
  const squish = g.p.squish ?? 1.35;
  const dist = Math.hypot(x - cx, (y - cy) * squish);
  const coreR = Math.min(g.cols, g.rows) * 0.17;
  const core = Math.max(0, 1 - dist / coreR);
  let out: Cell = core > 0.05 ? { v: core * (0.65 + 0.35 * Math.sin(t * 0.55 + g.seed)), c: 0 } : null;
  const R = Math.min(g.cols, g.rows) * (g.p.radius ?? 0.46);
  const sats = g.p.sats ?? 5;
  for (let i = 0; i < sats; i++) {
    const a = t * (0.22 + 0.06 * hash1(i + g.seed)) + (i / sats) * Math.PI * 2;
    const sx = cx + Math.cos(a) * R;
    const sy = cy + (Math.sin(a) * R) / squish;
    const f = Math.max(0, 1 - Math.hypot(x - sx, y - sy) / 1.7);
    if (f > (out?.v ?? 0)) out = { v: f, c: i % 2 === 0 ? g.colorsN - 1 : g.colorsN - 2 };
  }
  if (Math.abs(dist - R) < 0.45 && (out?.v ?? 0) < 0.14) out = { v: 0.1, c: 0 };
  return out;
}

/* An infection front that spreads from a seed cell and recedes. */
function contagion(x: number, y: number, t: number, g: Grid): Cell {
  const ph = fract(t * (g.p.speed ?? 0.045) + g.seed * 0.17);
  const R = Math.hypot(g.cols, g.rows) * 0.52 * Math.sin(Math.PI * ph);
  const sx = g.cols * 0.34, sy = g.rows * 0.42;
  const dist = Math.hypot(x - sx, y - sy);
  if (dist > R) {
    return hash3(x, y, g.seed) > 0.955 ? { v: 0.12, c: 0 } : null;
  }
  if (Math.abs(dist - R) < 1.3) return { v: 0.9, c: g.colorsN - 1 };
  const n = noise3(x * 0.8, y * 0.8, t * 0.28 + g.seed);
  if (n < 0.34) return null;
  const inner = 1 - dist / Math.max(R, 0.001);
  return { v: 0.22 + 0.5 * inner, c: n > 0.72 ? 1 % g.colorsN : 0 };
}

/* A tight point cluster against a breathing band; emphasis alternates.
   Both figures are porous — cells inside them sit beats out on noise —
   so they stay small lights in darkness, never solid slabs. */
function band(x: number, y: number, t: number, g: Grid): Cell {
  const e = 0.5 + 0.5 * Math.sin(t * (g.p.cycle ?? 0.16) + g.seed);
  const tex = 0.7 + 0.3 * noise3(x * 0.8, y * 0.8, t * 0.3 + g.seed);
  const pore = noise3(x * 0.7 + 9, y * 0.7, t * 0.22 + g.seed * 2);
  let out: Cell = null;
  const cx = g.cols * 0.28, cy = g.rows * 0.5;
  const cluster = Math.max(0, 1 - Math.hypot(x - cx, y - cy) / (Math.min(g.cols, g.rows) * 0.17));
  if (cluster > 0.05 && (cluster > 0.6 || pore > 0.42)) {
    out = { v: cluster * (0.3 + 0.7 * e) * tex, c: cluster > 0.72 ? g.colorsN - 1 : 0 };
  }
  const inBandX = x > g.cols * 0.56 && x < g.cols * 0.88;
  const bandHalf = g.rows * (0.1 + 0.13 * (0.5 + 0.5 * Math.sin(t * (g.p.breathe ?? 0.1) + 2)));
  const edgeF = 1 - Math.abs(y - g.rows * 0.5) / Math.max(bandHalf, 0.001);
  if (inBandX && edgeF > 0 && pore > 0.46) {
    const v = (0.25 + 0.5 * edgeF) * (0.3 + 0.7 * (1 - e)) * tex;
    if (v > (out?.v ?? 0)) out = { v, c: Math.min(1, g.colorsN - 1) };
  }
  return out;
}

/* A fixed scene (from Grid.map) kept alive by gentle shimmer:
   most cells hold their mapped color with a small luminance
   wobble; cells at or above p.brightFrom behave like lit windows
   at dusk, blinking on and off on slow beats. */
function glimmer(x: number, y: number, t: number, g: Grid): Cell {
  const idx = g.map?.[y * g.cols + x] ?? 0;
  if (idx <= 0) return null;
  const bright = idx >= (g.p.brightFrom ?? g.colorsN);
  if (bright) {
    const beat = Math.floor(t * 0.45 + hash3(x, y, g.seed) * 8);
    if (hash3(x, y, beat * 7.7 + g.seed) < 0.22) {
      return { v: 0.2, c: idx - 1 }; // window dark this beat
    }
    const wob = 0.8 + 0.2 * noise3(x * 0.8, y * 0.8, t * 0.5);
    return { v: Math.min(1, 0.85 * wob + 0.15), c: idx };
  }
  /* quiet classes (sky, distant mass) stay dim so the glow carries
     the scene; p.dimUpTo names the last dim palette index and
     p.base lifts overall brightness (covers want ~0.9) */
  const dim = idx <= (g.p.dimUpTo ?? -1);
  const wob = 0.78 + 0.22 * noise3(x * 0.7, y * 0.7, t * 0.22 + g.seed);
  return { v: (dim ? 0.4 : (g.p.base ?? 0.68)) * wob, c: idx };
}

export const ENGINES: Record<EngineName, (x: number, y: number, t: number, g: Grid) => Cell> = {
  drift, tide, blaze, converge, reveal, spark, structure, orbit, contagion, band, glimmer,
};
