/* Vertical tacit collusion in AI-mediated markets (arXiv preprint). A
   shopper's AI agent (the blue drone) buys from a platform's ranked
   list and reads it from the top. Product A (teal) is the best and costs
   one coin; product B (rose) is decent but costs three, and its seller
   keeps most of the difference. The platform (purple tower with a crane
   arm) sets the order of the list; the seller (rose stall with a pen)
   writes B's page. A wall stands between them: they never talk.

   With an honest list the drone buys A. The platform alone lifts B to
   the top, but B's plain page does not convince the drone, which buys
   A: a sliver of harm (the purple bar). The seller alone dresses up B's
   page, but B sits low on the list, where the drone barely reads; the
   drone feels the pull and still buys A: some harm (the rose bar). When
   both act, B sits on top with a dressed-up page, the drone buys it, the
   shopper pays three coins, and the coins go to the seller and the
   platform. The two separate harms are stacked together, and the harm
   from both at once (red) rises above that stack: the extra, which
   neither causes alone, is coral. */

import { type Put, type StoryDef, rise, spr, fill, box, ease, lerp, line, path, CHECK, CROSS } from "./kit";

const CREAM = 0, PURPLE = 1, GOLD = 2, BLUE = 3, TEAL = 4, ROSE = 5, RED = 6, CORAL = 7, GREEN = 8;

const TOWER = ["..X..", ".XXX.", "XXXXX", "X.X.X", "XXXXX", "X.X.X", "XXXXX"];
const STALL = ["XXXXXXX", "X.X.X.X", ".......", "X.....X", "X.....X", "XXXXXXX"];
const DRONE_A = ["X.X.X", ".XXX.", "..X.."];
const DRONE_B = [".X.X.", ".XXX.", "..X.."];
const SHOPPER = [".XXX.", ".XXX.", "..X..", "XXXXX", "X.X.X", "..X..", ".X.X.", ".X.X."];
const STAR = [".X.", "XXX", ".X."];

type Prod = { c: number; v: number; price: number; d: [number, number] };
const PRODUCTS: Record<string, Prod> = {
  A: { c: TEAL, v: 0.95, price: 1, d: [6, 4] },
  B: { c: ROSE, v: 0.95, price: 3, d: [3, 2] },
  C: { c: CREAM, v: 0.55, price: 2, d: [5, 3] },
  D: { c: CREAM, v: 0.55, price: 2, d: [6, 2] },
};
const ry = (slot: number) => 11 + 4 * slot;
const HONEST: Record<string, number> = { A: 0, C: 1, D: 2, B: 3 };
const HOME: [number, number] = [25, ry(0)];

/* where each row is drawn: box position and whether its page shows */
type Row = { p: string; x: number; y: number; page: boolean };

function honestRows(): Row[] {
  return Object.keys(HONEST).map((p) => ({ p, x: 5, y: ry(HONEST[p]), page: true }));
}
/* the platform's crane takes B out to the left margin, up past the
   others (which slide down a slot) and back into the top slot */
function riggedRows(k: number): Row[] {
  const [bx, by] = path(k, [[5, ry(3), 0], [0, ry(3), 0.22], [0, ry(0), 0.78], [5, ry(0), 1]]);
  const shift = ease(rise(k, 0.22, 0.78));
  const rows: Row[] = ["A", "C", "D"].map((p) => ({ p, x: 5, y: ry(HONEST[p] + shift), page: true }));
  rows.push({ p: "B", x: bx, y: by, page: k <= 0 || k >= 1 });
  return rows;
}

function productBox(put: Put, p: string, x: number, y: number, v = 1) {
  fill(put, x, y, 3, 3, PRODUCTS[p].c, PRODUCTS[p].v * v);
}

/* the platform's ranked list. dressed: how far the seller has dressed up
   B's page; reading: the slot the drone reads (or -1); gone: the product
   the drone has taken */
function list(put: Put, t: number, rows: Row[], dressed: number, reading: number, gone: string) {
  box(put, 3, 9, 22, 18, CREAM, 0.45);
  for (const r of rows) {
    if (r.p === gone) continue;
    const y = Math.round(r.y);
    productBox(put, r.p, r.x, y);
    if (!r.page) continue;
    const pr = PRODUCTS[r.p];
    let [l1, l2] = pr.d;
    if (r.p === "B") { l1 = Math.round(lerp(3, 7, dressed)); l2 = Math.round(lerp(2, 7, dressed)); }
    const lv = reading >= 0 && y === ry(reading) ? 1 : 0.6;
    fill(put, 9, y, l1, 1, CREAM, lv);
    fill(put, 9, y + 2, l2, 1, CREAM, lv);
    if (r.p === "B" && dressed > 0) {
      spr(put, 16, y, STAR, { X: ROSE }, dressed);
      if (dressed >= 1) put(19, y - 1 + (Math.floor(t * 4) % 3), ROSE, 0.75);
    }
    fill(put, 20, y + 1, pr.price, 1, GOLD, 0.95);
  }
  if (reading >= 0) for (let k = 0; k < 3; k++) put(24, ry(reading) + k, BLUE, 1);
}

/* the two parties with the wall between them. crane: the crane's grip
   point [x, y] or null; pen: the seller's pen tip [x, y] or null */
function parties(put: Put, crane: [number, number] | null, pen: [number, number] | null) {
  spr(put, 1, 1, TOWER, { X: PURPLE }, 0.9);
  spr(put, 20, 2, STALL, { X: ROSE }, 0.85);
  fill(put, 22, 6, 3, 1, ROSE, 0.95); /* B on the seller's counter */
  /* the wall: brick courses, two cells wide */
  for (let y = 0; y <= 7; y++) { put(13, y, CREAM, y % 2 ? 0.6 : 0.5); put(14, y, CREAM, y % 2 ? 0.5 : 0.6); }
  if (crane) {
    const [cx, cy] = crane;
    line(put, 1, 8, 1, cy, PURPLE, 0.9);
    if (cx > 1) line(put, 1, cy, cx, cy, PURPLE, 0.9);
  }
  if (pen) {
    line(put, 23, 8, pen[0], pen[1], ROSE, 0.7);
    put(pen[0], pen[1], CREAM, 1);
  }
}

function drone(put: Put, t: number, x: number, y: number, carrying: string) {
  spr(put, x, y, Math.floor(t * 10) % 2 ? DRONE_A : DRONE_B, { X: BLUE }, 1);
  if (carrying) productBox(put, carrying, x + 1, y + 3, 1);
}

/* the drone flies back up from the shopper to the top of the list */
function returnTrip(u: number, a: number, b: number): [number, number] {
  return path(u, [[7, 29, a], [25, 28, a + (b - a) * 0.4], [HOME[0], HOME[1], b]]);
}
/* the drone carries what it bought down to the shopper */
function delivery(u: number, y: number, a: number, b: number): [number, number] {
  return path(u, [[25, y, a], [25, 28, a + (b - a) * 0.4], [8, 28, a + (b - a) * 0.8], [7, 29, b]]);
}

/* the harm ledger. p, s: how far the platform-alone and seller-alone bars
   have grown; stack: the two copies sliding together (0 to 1); sum: the
   line at the height of the two added; joint: the bar for both at once */
function ledger(put: Put, p: number, s: number, stack: number, sum: number, joint: number) {
  const col = (x: number, y0: number, h: number, c: number) => { for (let k = 0; k < h; k++) fill(put, x, y0 - k, 2, 1, c, 0.95); };
  if (p > 0) col(13, 41, Math.round(p), PURPLE);
  if (s > 0) col(16, 41, Math.round(5 * s), ROSE);
  if (stack > 0) {
    const ks = ease(rise(stack, 0, 0.5)), kp = ease(rise(stack, 0.5, 1));
    col(Math.round(lerp(16, 20, ks)), 41, 5, ROSE);
    col(Math.round(lerp(13, 20, kp)), Math.round(lerp(41, 36, kp)), 1, PURPLE);
  }
  if (sum > 0) fill(put, 20, 35, Math.round(lerp(2, 6, sum)), 1, CREAM, 0.9);
  if (joint > 0) {
    const h = Math.round(9 * joint);
    for (let k = 0; k < h; k++) {
      const y = k < 6 ? 41 - k : 40 - k;
      fill(put, 24, y, 2, 1, k < 6 ? RED : CORAL, 1);
    }
    put(24, 42, PURPLE, 0.9);
    put(25, 42, ROSE, 0.9);
  }
}

/* what the shopper got and paid */
function bought(put: Put, p: string, coins: number) {
  productBox(put, p, 7, 37);
  for (let k = 0; k < coins; k++) put(7 + k, 41, GOLD, 1);
}

export const story: StoryDef = {
  cols: 30, rows: 43,
  colors: ["#f4e9d6", "#9b6fb0", "#d9a441", "#7fb3e6", "#3fa7a0", "#d46a9f", "#c25048", "#DA7756", "#7dc87d"],
  phases: [
    /* an honest list: the drone reads the top and buys A */
    { dur: 5, render(u, put, t) {
      const v = rise(u, 0, 0.12);
      const taken = u > 0.44;
      const reading = u > 0.16 && u < 0.3 ? 0 : u >= 0.3 && u < 0.37 ? 1 : u >= 0.37 && u <= 0.44 ? 0 : -1;
      parties(put, null, null);
      list(put, t, honestRows(), 0, reading, taken ? "A" : "");
      spr(put, 1, 34, SHOPPER, { X: CREAM }, 0.9 * v);
      let [x, y] = taken ? delivery(u, ry(0), 0.44, 0.74) : [HOME[0], reading >= 0 ? ry(reading) : HOME[1]];
      if (u < 0.14) y = lerp(31, HOME[1], ease(rise(u, 0, 0.14)));
      drone(put, t, x, y, taken && u < 0.76 ? "A" : "");
      if (u >= 0.76) bought(put, "A", 1);
      if (u > 0.8) spr(put, 1, 29, CHECK, { X: GREEN }, rise(u, 0.8, 0.86));
    }},
    /* the platform alone lifts B to the top; its plain page does not sell */
    { dur: 5.5, render(u, put, t) {
      const k = rise(u, 0.12, 0.38);
      const rows = riggedRows(k);
      const taken = u > 0.56;
      const reading = u > 0.4 && u < 0.48 ? 0 : u >= 0.48 && u <= 0.56 ? 1 : -1;
      const b = rows[3];
      const reach = rise(u, 0.04, 0.12);
      const crane: [number, number] | null = u < 0.04 || u > 0.42 ? null
        : k <= 0 ? [Math.round(lerp(1, 4, reach)), Math.round(lerp(8, ry(3) + 1, reach))]
        : [Math.round(b.x) - 1, Math.round(b.y) + 1];
      parties(put, crane, null);
      list(put, t, rows, 0, reading, taken ? "A" : "");
      spr(put, 1, 34, SHOPPER, { X: CREAM }, 0.9);
      const [x, y] = u < 0.12 ? returnTrip(u, 0, 0.12)
        : taken ? delivery(u, ry(1), 0.56, 0.78) : [HOME[0], reading >= 0 ? ry(reading) : HOME[1]];
      drone(put, t, x, y, taken && u < 0.8 ? "A" : "");
      if (u >= 0.8) bought(put, "A", 1);
      ledger(put, rise(u, 0.84, 0.9), 0, 0, 0, 0);
    }},
    /* the seller alone dresses up B, low on the list; it pulls, A still wins */
    { dur: 5.5, render(u, put, t) {
      const dressed = rise(u, 0.1, 0.32);
      const taken = u > 0.6;
      const reading = u > 0.34 && u <= 0.6 ? 0 : -1;
      const pen: [number, number] | null = u > 0.08 && u < 0.34 ? [Math.round(lerp(9, 18, dressed)), ry(3) - 1] : null;
      parties(put, null, pen);
      list(put, t, honestRows(), dressed, reading, taken ? "A" : "");
      spr(put, 1, 34, SHOPPER, { X: CREAM }, 0.9);
      /* the dressed-up page pulls the drone down toward B */
      const pull = u > 0.36 && u < 0.58 ? Math.sin(Math.PI * rise(u, 0.36, 0.58)) : 0;
      let [x, y] = u < 0.12 ? returnTrip(u, 0, 0.12) : taken ? delivery(u, ry(0), 0.6, 0.8) : HOME;
      if (!taken && u >= 0.12) y += Math.round(pull * 5);
      if (pull > 0.05) for (let s = 1; s < 6; s++) put(Math.round(lerp(19, x, s / 6)), Math.round(lerp(ry(3) + 1, y + 1, s / 6)), ROSE, 0.6 + 0.4 * pull);
      drone(put, t, x, y, taken && u < 0.82 ? "A" : "");
      if (u >= 0.82) bought(put, "A", 1);
      ledger(put, 1, rise(u, 0.84, 0.94), 0, 0, 0);
    }},
    /* both act, without a word: B is dressed up, lifted to the top, bought */
    { dur: 6.5, render(u, put, t) {
      const dressed = rise(u, 0.06, 0.18);
      const k = rise(u, 0.18, 0.32);
      const rows = riggedRows(k);
      const b = rows[3];
      const taken = u > 0.46;
      const reading = u > 0.33 && u <= 0.46 ? 0 : -1;
      const reach = rise(u, 0.12, 0.18);
      const crane: [number, number] | null = u < 0.12 || u > 0.35 ? null
        : k <= 0 ? [Math.round(lerp(1, 4, reach)), Math.round(lerp(8, ry(3) + 1, reach))]
        : [Math.round(b.x) - 1, Math.round(b.y) + 1];
      const pen: [number, number] | null = u > 0.04 && u < 0.2 ? [Math.round(lerp(9, 18, dressed)), ry(3) - 1] : null;
      parties(put, crane, pen);
      list(put, t, rows, dressed, reading, taken ? "B" : "");
      spr(put, 1, 34, SHOPPER, { X: CREAM }, 0.9);
      const [x, y] = u < 0.1 ? returnTrip(u, 0, 0.1) : taken ? delivery(u, ry(0), 0.46, 0.62) : HOME;
      drone(put, t, x, y, taken && u < 0.64 ? "B" : "");
      if (u >= 0.64) bought(put, "B", 0);
      /* three coins: paid, then carried off to the seller and the platform */
      const fly = rise(u, 0.67, 0.75);
      if (u >= 0.64 && fly <= 0) for (let c = 0; c < 3; c++) put(7 + c, 41, GOLD, 1);
      if (fly > 0 && fly < 1) {
        put(lerp(7, 23, fly), lerp(41, 7, fly), GOLD, 1);
        put(lerp(8, 24, fly), lerp(41, 7, fly), GOLD, 1);
        put(lerp(9, 3, fly), lerp(41, 8, fly), GOLD, 1);
      }
      if (u > 0.65) spr(put, 2, 30, CROSS, { X: RED }, rise(u, 0.65, 0.69));
      ledger(put, 1, 1, rise(u, 0.66, 0.72), rise(u, 0.72, 0.75), rise(u, 0.75, 0.83));
    }},
  ],
};
