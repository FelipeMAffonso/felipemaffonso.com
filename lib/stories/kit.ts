/* ============================================================
   Story kit: the shared drawing vocabulary of the pixel stories.
   A story is a looping timeline of phases; each phase paints
   sprites (ASCII cell art) and effects into a frame buffer
   through put(x, y, colorIndex, brightness). Every story file in
   lib/stories/ draws with these helpers only.
   ============================================================ */

export type Put = (x: number, y: number, c: number, v?: number) => void;
export type Phase = { dur: number; render: (u: number, put: Put, t: number) => void };
export type StoryDef = {
  cols: number;
  rows: number;
  colors: string[];
  phases: Phase[];
};

/* deterministic hash for twinkle effects */
export function h(x: number, y: number, z: number) {
  const n = Math.sin(x * 127.1 + y * 269.5 + z * 419.2) * 43758.5453;
  return n - Math.floor(n);
}
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
/* fade in over the first 15% of a phase, out over the last 15% */
export const env = (u: number) => clamp01(Math.min(u / 0.15, (1 - u) / 0.15));
export const rise = (u: number, a: number, b: number) => clamp01((u - a) / (b - a));

/* paint ASCII art; keys map characters to color indices */
export function spr(put: Put, ox: number, oy: number, art: string[], map: Record<string, number>, v = 1) {
  for (let r = 0; r < art.length; r++) {
    for (let c = 0; c < art[r].length; c++) {
      const ch = art[r][c];
      if (ch === "." || ch === " ") continue;
      if (map[ch] === undefined) continue;
      put(ox + c, oy + r, map[ch], v);
    }
  }
}

export function box(put: Put, x0: number, y0: number, w: number, hh: number, c: number, v = 1) {
  for (let x = x0; x < x0 + w; x++) { put(x, y0, c, v); put(x, y0 + hh - 1, c, v); }
  for (let y = y0; y < y0 + hh; y++) { put(x0, y, c, v); put(x0 + w - 1, y, c, v); }
}
export function fill(put: Put, x0: number, y0: number, w: number, hh: number, c: number, v = 1) {
  for (let y = y0; y < y0 + hh; y++) for (let x = x0; x < x0 + w; x++) put(x, y, c, v);
}

/* ---- helpers for the larger scene stories (the TiCS paper and the two
   book chapters, 2026-10-20): taller portrait grids with characters,
   machines and props that move, not single icons ---- */
export const ease = (x: number) => { const k = clamp01(x); return k * k * (3 - 2 * k); };
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

export function line(put: Put, x0: number, y0: number, x1: number, y1: number, c: number, v = 1) {
  const n = Math.max(1, Math.round(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))));
  for (let i = 0; i <= n; i++) put(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, c, v);
}
export function ring(put: Put, cx: number, cy: number, rx: number, ry: number, c: number, v = 1) {
  const n = Math.max(8, Math.ceil((rx + ry) * 4));
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    put(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, c, v);
  }
}
/* sparks flying out from a point while b runs from 0 to 1 */
export function burst(put: Put, cx: number, cy: number, b: number, c: number, n = 12, reach = 5) {
  if (b <= 0 || b >= 1) return;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + 0.3;
    const d = 1 + ease(b) * reach;
    put(cx + Math.cos(a) * d, cy + Math.sin(a) * d, c, 1 - b);
  }
}
/* distance travelled at a speed that falls from 1 to 0 between a and b,
   so a conveyor or a gear coasts to a stop and never runs backward */
export function coast(u: number, a: number, b: number) {
  if (u < a) return u;
  if (u < b) return a + (u - a) - (u - a) ** 2 / (2 * (b - a));
  return a + (b - a) / 2;
}
/* distance travelled at a speed that rises from 0 to 1 between a and b */
export function spinUp(u: number, a: number, b: number) {
  if (u < a) return 0;
  if (u < b) return (u - a) ** 2 / (2 * (b - a));
  return (b - a) / 2 + (u - b);
}
/* a position along timed waypoints [x, y, u], eased between them */
export function path(u: number, pts: [number, number, number][]): [number, number] {
  if (u <= pts[0][2]) return [pts[0][0], pts[0][1]];
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0, u0] = pts[i - 1];
    const [x1, y1, u1] = pts[i];
    if (u <= u1) {
      const k = ease((u - u0) / (u1 - u0));
      return [lerp(x0, x1, k), lerp(y0, y1, k)];
    }
  }
  const last = pts[pts.length - 1];
  return [last[0], last[1]];
}

export const CHECK = ["....X", "...X.", "X.X..", ".X..."];
export const CROSS = ["X.X", ".X.", "X.X"];
