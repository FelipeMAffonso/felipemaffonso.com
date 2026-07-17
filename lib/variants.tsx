"use client";

/* ============================================================
   Variant machinery (DEV/ADJUDICATION ONLY).
   Lets Felipe compare motion/interaction/look options LIVE via the
   floating VariantSwitcher panel (bottom-right, every page), and via
   ?<key>=<value> URL params.

   Resolution order on first mount: URL param > localStorage
   ("site-variants", JSON) > DEFAULTS. Every setVariant() updates state,
   writes the <html data-*> attribute for the CSS-driven axes, and
   persists the full picks object to localStorage, so a hard reload
   keeps the chosen look with no flash of defaults (the pre-paint script
   in app/layout.tsx reads the same storage before first paint).

   Trivially removable: delete this file, delete <VariantProvider> and
   <VariantSwitcher> from Providers, remove the useVariants() reads
   (Nav, ThemeToggle, PublicationsSections), and drop the pre-paint
   VARIANT_SCRIPT. The shipping DEFAULTS below are the recommended
   choices and survive removal.
   ============================================================ */

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type NavVariant = "underline" | "pill" | "slide";
export type EntranceVariant = "stagger" | "fade" | "none";
export type AccordionVariant = "crisp" | "soft";
export type ThemeAnimVariant = "morph" | "swap";
export type SoundMapVariant = "A" | "B";
export type HeroWeightVariant = "600" | "500" | "300";
export type DarkThemeVariant = "cool" | "warm";

export type Variants = {
  nav: NavVariant;
  entrance: EntranceVariant;
  accordion: AccordionVariant;
  themeanim: ThemeAnimVariant;
  soundmap: SoundMapVariant;
  heroweight: HeroWeightVariant;
  darktheme: DarkThemeVariant;
};

// SHIPPING DEFAULTS (the recommendation). These win when the variant
// system is stripped.
const DEFAULTS: Variants = {
  nav: "underline",
  entrance: "stagger",
  accordion: "crisp",
  themeanim: "morph",
  soundmap: "B",
  heroweight: "600",
  darktheme: "cool",
};

const ALLOWED: Record<keyof Variants, string[]> = {
  nav: ["underline", "pill", "slide"],
  entrance: ["stagger", "fade", "none"],
  accordion: ["crisp", "soft"],
  themeanim: ["morph", "swap"],
  soundmap: ["A", "B"],
  heroweight: ["600", "500", "300"],
  darktheme: ["cool", "warm"],
};

// CSS-driven axes ride on <html data-*>. The pre-paint inline script in
// layout sets the same attributes (no flash on hard reload); these keep them
// in sync for live changes and SPA navigation. themeanim and soundmap are
// consumed in React (useVariants) rather than via a data-attribute.
const CSS_AXES: (keyof Variants)[] = ["nav", "entrance", "accordion", "heroweight", "darktheme"];

const STORAGE_KEY = "site-variants";

const VariantContext = createContext<Variants>(DEFAULTS);

type SetVariant = <K extends keyof Variants>(key: K, value: Variants[K]) => void;
const SetVariantContext = createContext<SetVariant>(() => {});

export function useVariants() {
  return useContext(VariantContext);
}

export function useSetVariant() {
  return useContext(SetVariantContext);
}

function readStored(): Partial<Variants> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function applyAttr(key: keyof Variants, value: string) {
  if (CSS_AXES.includes(key)) {
    document.documentElement.setAttribute(`data-${key}`, value);
  }
}

export function VariantProvider({ children }: { children: ReactNode }) {
  const [variants, setVariants] = useState<Variants>(DEFAULTS);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stored = readStored();
    const next: Variants = { ...DEFAULTS };
    (Object.keys(DEFAULTS) as (keyof Variants)[]).forEach((key) => {
      const fromUrl = params.get(key);
      const fromStore = stored[key];
      let value: string | undefined;
      if (fromUrl && ALLOWED[key].includes(fromUrl)) value = fromUrl;
      else if (fromStore && ALLOWED[key].includes(fromStore)) value = fromStore;
      if (value) {
        // @ts-expect-error narrowed by the ALLOWED check
        next[key] = value;
      }
    });
    setVariants(next);
    CSS_AXES.forEach((key) => applyAttr(key, next[key]));
  }, []);

  const setVariant = useCallback<SetVariant>((key, value) => {
    setVariants((prev) => {
      const next = { ...prev, [key]: value };
      applyAttr(key, value as string);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
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
