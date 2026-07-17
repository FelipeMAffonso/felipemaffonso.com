"use client";

import { ThemeProvider } from "next-themes";
import { VariantProvider } from "@/lib/variants";
import { SoundProvider } from "@/lib/sound";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      storageKey="site-theme"   /* migrate cleanly from the 11ty site's key */
      defaultTheme="light"      /* the old inline script defaulted to light */
      enableSystem={false}
      enableColorScheme={false}
    >
      <VariantProvider>
        <SoundProvider>{children}</SoundProvider>
      </VariantProvider>
    </ThemeProvider>
  );
}
