"use client";

/* ============================================================
   Sound — cuelume wrapper.
   - Global on/off persisted in localStorage ("site-sound"), DEFAULT ON.
   - setEnabled() makes total silence when off (all plays no-op).
   - bind() wires data-cuelume-* (press/release/hover/toggle) once;
     it is pointer-aware and hover-throttled, so it never gets noisy.
   - Every trigger is user-gesture-driven (Web Audio autoplay safe).
   ============================================================ */

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { bind, play as cuePlay, setEnabled, type SoundName } from "cuelume";

const STORAGE_KEY = "site-sound";

type SoundCtx = {
  enabled: boolean;
  toggle: () => void;
  play: (name: SoundName) => void;
};

const Ctx = createContext<SoundCtx>({
  enabled: true,
  toggle: () => {},
  play: () => {},
});

export function useSound() {
  return useContext(Ctx);
}

export function SoundProvider({ children }: { children: ReactNode }) {
  // Default ON; hydrate from storage after mount to avoid SSR mismatch.
  const [enabled, setEnabledState] = useState(true);

  useEffect(() => {
    bind(); // idempotent; delegated; survives route swaps
    let initial = true;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "off") initial = false;
    } catch {
      /* storage blocked — stay ON */
    }
    setEnabledState(initial);
    setEnabled(initial);
  }, []);

  const toggle = useCallback(() => {
    setEnabledState((prev) => {
      const next = !prev;
      setEnabled(next);
      try {
        localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
      } catch {
        /* ignore */
      }
      // Confirm the turn-ON with a gentle cue (turn-OFF stays silent).
      if (next) cuePlay("toggle");
      return next;
    });
  }, []);

  const play = useCallback((name: SoundName) => {
    // cuelume already no-ops when disabled; this is just an explicit gate.
    cuePlay(name);
  }, []);

  return <Ctx.Provider value={{ enabled, toggle, play }}>{children}</Ctx.Provider>;
}
