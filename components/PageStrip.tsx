"use client";

/* ============================================================
   PageStrip â€” the bare header grid, one per page, each with its
   own pattern (Felipe 2026-07-19): Home drifts, Research sparks,
   Teaching runs the classroom tide, CV pulses in ordered
   structure, Contact converges. No card chrome, no title; the
   quiet pixel signature above the content. Theme adaptive.
   ============================================================ */

import { useState } from "react";
import { PixelPoster } from "./PixelPoster";
import { useSound } from "@/lib/sound";
import type { MotifSpec } from "@/lib/pixelEngine";

/* Clicking a strip cycles its palette (Felipe 2026-07-19): close
   siblings of the site family, no mustard, no dot indicators. */
const PALETTES = [
  ["#8b9099", "#DA7756", "#DA7756", "#e8e8ea"], // coral (default)
  ["#8b9099", "#3fa7a0", "#3fa7a0", "#e8e8ea"], // teal
  ["#8b9099", "#7a93b5", "#7a93b5", "#e8e8ea"], // slate blue
  ["#8b9099", "#b58989", "#b58989", "#e8e8ea"], // dusty rose
];

const STRIPS: Record<string, { spec: MotifSpec; rows?: number }> = {
  home: { spec: { engine: "drift", seed: 131, params: { blobs: 2, radius: 0.5 }, colors: PALETTES[0] } },
  research: { spec: { engine: "spark", seed: 97, params: { rate: 0.1, thresh: 0.985 }, colors: PALETTES[0] } },
  teaching: { spec: { engine: "tide", seed: 53, params: { cycle: 0.09 }, colors: ["#8a4f38", "#d9a441", "#DA7756", "#f4e9d6"] } },
  cv: { spec: { engine: "structure", seed: 137, params: { splitAt: 0.55, col: 0.82 }, colors: PALETTES[0] } },
  contact: { spec: { engine: "converge", seed: 139, params: { count: 18, speed: 0.05, tx: 0.85 }, colors: PALETTES[0] } },
};

export function PageStrip({ page }: { page: keyof typeof STRIPS }) {
  const s = STRIPS[page];
  const { play } = useSound();
  const [pal, setPal] = useState(0);
  if (!s) return null;
  const spec = { ...s.spec, colors: PALETTES[pal % PALETTES.length] };
  return (
    <div
      className="page-strip enter"
      style={{ cursor: "pointer" }}
      onClick={() => {
        play("tick");
        setPal((p) => p + 1);
      }}
      aria-hidden="true"
    >
      <PixelPoster
        spec={spec}
        cols={46}
        rows={s.rows ?? 4}
        title=""
        caption=""
        className="poster-bare"
      />
    </div>
  );
}
