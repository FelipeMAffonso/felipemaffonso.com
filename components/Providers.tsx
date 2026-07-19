"use client";

import { ThemeProvider } from "next-themes";
import { SoundProvider } from "@/lib/sound";
import { PixelVariantProvider } from "@/lib/pixelVariants";
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
      <SoundProvider>
        {/* ADJUDICATION ONLY: the pixel variant system + floating
            switcher; stripped once Felipe bakes his picks. */}
        <PixelVariantProvider>
          {children}
        </PixelVariantProvider>
      </SoundProvider>
    </ThemeProvider>
  );
}
