"use client";

/* ============================================================
   Pixel-era variant machinery (DEV/ADJUDICATION ONLY).
   Same pattern as the retired July 17 variant system, revived for
   the pixel-poster adjudication: Felipe compares options LIVE via
   the floating switcher panel or ?<key>=<value> URL params.

   Resolution on first mount: URL param > localStorage
   ("pixel-variants", JSON) > DEFAULTS. CSS-driven axes ride on
   <html data-*> attributes (the pre-paint script in app/layout.tsx
   sets them before first paint); component-driven axes are read
   through usePixelVariants().

   Trivially removable once adjudicated: delete this file and
   PixelVariantSwitcher, unwrap Providers, drop the pre-paint
   script, bake the chosen options, remove the losers.
   ============================================================ */

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type PixelVariants = {
  portrait: "constellation" | "mosaic";
  posterfont: "ultra" | "alfa";
  teachingposter: "on" | "off";
  icons: "brand" | "pixel";
  navicons: "off" | "line" | "pixel";
  navhover: "gradient" | "cells";
  footer: "line" | "led";
  covers: "static" | "cycle";
  reslayout: "list" | "rail" | "gallery";
  resheader: "banner" | "strip" | "mini" | "off";
};

/* Shipping recommendation; these win if the system is stripped.
   Felipe's 2026-07-19 calls baked in: brand icons everywhere, line
   icons in the navbar, story covers on by default, the in-panel
   poster off (the story lives in the cover slot now), and the
   research header banner on. */
export const PIXEL_DEFAULTS: PixelVariants = {
  portrait: "constellation",
  posterfont: "alfa",
  teachingposter: "on",
  icons: "brand",
  navicons: "line",
  navhover: "gradient",
  footer: "led",
  covers: "cycle",
  reslayout: "list",
  resheader: "strip",
};

export const PIXEL_ALLOWED: Record<keyof PixelVariants, string[]> = {
  portrait: ["constellation", "mosaic"],
  posterfont: ["ultra", "alfa"],
  teachingposter: ["on", "off"],
  icons: ["brand", "pixel"],
  navicons: ["off", "line", "pixel"],
  navhover: ["gradient", "cells"],
  footer: ["line", "led"],
  covers: ["static", "cycle"],
  reslayout: ["list", "rail", "gallery"],
  resheader: ["banner", "strip", "mini", "off"],
};

/* Axes consumed purely by CSS via <html data-*>. The rest are read
   in components (portrait, spears "led" branch, icons, footer). */
export const PIXEL_CSS_AXES: (keyof PixelVariants)[] = [
  "posterfont",
  "teachingposter",
  "navhover",
  "reslayout",
];

export const PIXEL_STORAGE_KEY = "pixel-variants";

const VariantContext = createContext<PixelVariants>(PIXEL_DEFAULTS);
type SetVariant = <K extends keyof PixelVariants>(key: K, value: PixelVariants[K]) => void;
const SetVariantContext = createContext<SetVariant>(() => {});

export function usePixelVariants() {
  return useContext(VariantContext);
}
export function useSetPixelVariant() {
  return useContext(SetVariantContext);
}

function readStored(): Partial<PixelVariants> {
  try {
    const raw = localStorage.getItem(PIXEL_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function applyAttr(key: keyof PixelVariants, value: string) {
  if (PIXEL_CSS_AXES.includes(key)) {
    document.documentElement.setAttribute(`data-${key}`, value);
  }
}

export function PixelVariantProvider({ children }: { children: ReactNode }) {
  const [variants, setVariants] = useState<PixelVariants>(PIXEL_DEFAULTS);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stored = readStored();
    const next: PixelVariants = { ...PIXEL_DEFAULTS };
    (Object.keys(PIXEL_DEFAULTS) as (keyof PixelVariants)[]).forEach((key) => {
      const fromUrl = params.get(key);
      const fromStore = stored[key];
      let value: string | undefined;
      if (fromUrl && PIXEL_ALLOWED[key].includes(fromUrl)) value = fromUrl;
      else if (fromStore && PIXEL_ALLOWED[key].includes(fromStore)) value = fromStore;
      if (value) {
        // @ts-expect-error narrowed by the PIXEL_ALLOWED check
        next[key] = value;
      }
    });
    setVariants(next);
    PIXEL_CSS_AXES.forEach((key) => applyAttr(key, next[key]));
  }, []);

  const setVariant = useCallback<SetVariant>((key, value) => {
    setVariants((prev) => {
      const next = { ...prev, [key]: value };
      applyAttr(key, value as string);
      try {
        localStorage.setItem(PIXEL_STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* storage blocked, live state still updates */
      }
      return next;
    });
  }, []);

  return (
    <VariantContext.Provider value={variants}>
      <SetVariantContext.Provider value={setVariant}>{children}</SetVariantContext.Provider>
    </VariantContext.Provider>
  );
}
