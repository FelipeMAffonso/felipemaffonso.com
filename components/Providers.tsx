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
      defaultTheme="system"     /* follow the OS preference until the user picks */
      enableSystem={true}       /* resolves to light or dark; the nav toggle stays */
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
