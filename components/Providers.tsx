"use client";

import { ThemeProvider } from "next-themes";
import { SoundProvider } from "@/lib/sound";
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
      <SoundProvider>{children}</SoundProvider>
    </ThemeProvider>
  );
}
