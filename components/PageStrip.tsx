"use client";

/* ============================================================
   PageStrip — the bare header grid, one per page, each with its
   own pattern (Felipe 2026-07-19): Home drifts, Research sparks,
   Teaching runs the classroom tide, CV pulses in ordered
   structure, Contact converges. No card chrome, no title; the
   quiet pixel signature above the content. Theme adaptive.
   ============================================================ */

import { PixelPoster } from "./PixelPoster";
import type { MotifSpec } from "@/lib/pixelEngine";

/* quiet strip palette: gray and coral only; the gold was demoted
   (Felipe 2026-07-19, it read mustard against the page) */
const PALETTE = ["#8b9099", "#DA7756", "#DA7756", "#e8e8ea"];

const STRIPS: Record<string, { spec: MotifSpec; rows?: number }> = {
  home: { spec: { engine: "drift", seed: 131, params: { blobs: 2, radius: 0.5 }, colors: PALETTE } },
  research: { spec: { engine: "spark", seed: 97, params: { rate: 0.1, thresh: 0.985 }, colors: PALETTE } },
  teaching: { spec: { engine: "tide", seed: 53, params: { cycle: 0.09 }, colors: ["#8a4f38", "#d9a441", "#DA7756", "#f4e9d6"] } },
  cv: { spec: { engine: "structure", seed: 137, params: { splitAt: 0.55, col: 0.82 }, colors: PALETTE } },
  contact: { spec: { engine: "converge", seed: 139, params: { count: 18, speed: 0.05, tx: 0.85 }, colors: PALETTE } },
};

export function PageStrip({ page }: { page: keyof typeof STRIPS }) {
  const s = STRIPS[page];
  if (!s) return null;
  return (
    <div className="page-strip enter">
      <PixelPoster
        spec={s.spec}
        cols={46}
        rows={s.rows ?? 4}
        title=""
        caption=""
        className="poster-bare"
      />
    </div>
  );
}
