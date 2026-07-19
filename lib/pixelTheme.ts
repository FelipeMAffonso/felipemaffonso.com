"use client";

/* ============================================================
   Theme adaptation for the pixel cards.
   In dark mode the cards keep the night palette as designed. In
   light mode the card chrome goes light (CSS) and the canvas
   colors adapt here: near-white tones become ink (cream cells
   cannot read on a light card) and everything else darkens a
   step. The portrait flip and the Spears dusk scene stay dark
   always (alwaysDark).
   ============================================================ */

import { useEffect, useState } from "react";

export function useIsLight() {
  const [light, setLight] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const read = () => setLight(!el.classList.contains("dark"));
    read();
    const mo = new MutationObserver(read);
    mo.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);
  return light;
}

const INK = "#3a3f45";

export function adaptColor(hex: string, light: boolean): string {
  if (!light) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  if (lum > 0.72) return INK;
  const f = 0.8;
  const to = (v: number) => Math.round(v * f).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

export function adaptPalette(colors: string[], light: boolean): string[] {
  return light ? colors.map((c) => adaptColor(c, true)) : colors;
}

/* unlit cell tints per card theme */
export const CELL_TINTS = {
  dark: {
    fill: "rgba(232, 232, 234, 0.024)",
    stroke: "rgba(232, 232, 234, 0.06)",
    anchor: "rgba(139, 144, 153, 0.55)",
  },
  light: {
    fill: "rgba(26, 28, 32, 0.035)",
    stroke: "rgba(26, 28, 32, 0.08)",
    anchor: "rgba(107, 112, 120, 0.55)",
  },
};
