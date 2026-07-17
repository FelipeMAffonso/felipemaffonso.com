"use client";

/* ============================================================
   Variant machinery — DEV/ADJUDICATION ONLY.
   Lets Felipe compare motion/interaction options via ?<key>=<value>.
   Trivially removable: delete this file, delete <VariantProvider>
   from Providers, and remove the three useVariants() reads
   (Nav, Reveal, PublicationEntry). The shipping DEFAULTS below
   are the recommended choices and survive removal.
   ============================================================ */

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type NavVariant = "underline" | "pill" | "slide";
export type EntranceVariant = "stagger" | "fade" | "none";
export type AccordionVariant = "crisp" | "soft";
export type ThemeAnimVariant = "morph" | "swap";
export type SoundMapVariant = "A" | "B";

export type Variants = {
  nav: NavVariant;
  entrance: EntranceVariant;
  accordion: AccordionVariant;
  themeanim: ThemeAnimVariant;
  soundmap: SoundMapVariant;
};

// SHIPPING DEFAULTS (the recommendation). These win when the variant
// system is stripped.
const DEFAULTS: Variants = {
  nav: "underline",
  entrance: "stagger",
  accordion: "crisp",
  themeanim: "morph",
  soundmap: "B",
};

const ALLOWED: Record<keyof Variants, string[]> = {
  nav: ["underline", "pill", "slide"],
  entrance: ["stagger", "fade", "none"],
  accordion: ["crisp", "soft"],
  themeanim: ["morph", "swap"],
  soundmap: ["A", "B"],
};

const VariantContext = createContext<Variants>(DEFAULTS);

export function useVariants() {
  return useContext(VariantContext);
}

export function VariantProvider({ children }: { children: ReactNode }) {
  const [variants, setVariants] = useState<Variants>(DEFAULTS);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next: Variants = { ...DEFAULTS };
    (Object.keys(DEFAULTS) as (keyof Variants)[]).forEach((key) => {
      const v = params.get(key);
      if (v && ALLOWED[key].includes(v)) {
        // @ts-expect-error narrowed by ALLOWED check
        next[key] = v;
      }
    });
    setVariants(next);
    // CSS-driven variants ride on <html> data-attributes. The pre-paint
    // inline script in layout also sets these (so variant screenshots have
    // no flash); this keeps them in sync for the SPA-navigated case.
    document.documentElement.dataset.nav = next.nav;
    document.documentElement.dataset.accordion = next.accordion;
    document.documentElement.dataset.entrance = next.entrance;
  }, []);

  return <VariantContext.Provider value={variants}>{children}</VariantContext.Provider>;
}
