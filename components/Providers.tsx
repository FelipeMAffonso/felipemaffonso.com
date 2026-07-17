"use client";

import { ThemeProvider } from "next-themes";
import { VariantProvider } from "@/lib/variants";
import { SoundProvider } from "@/lib/sound";
import { VariantSwitcher } from "@/components/VariantSwitcher";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      storageKey="site-theme"   /* migrate cleanly from the 11ty site's key */
      defaultTheme="light"      /* the old inline script defaulted to light */
      enableSystem={true}       /* let the switcher offer a "system" pick */
      enableColorScheme={false}
    >
      <VariantProvider>
        <SoundProvider>
          {children}
          {/* DEV/adjudication: floating switcher on every page */}
          <VariantSwitcher />
        </SoundProvider>
      </VariantProvider>
    </ThemeProvider>
  );
}
