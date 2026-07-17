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

    // Audio latency warm-up. cuelume builds ONE shared AudioContext lazily
    // on the first play() and, while that context is still suspended, awaits
    // context.resume() before rendering the first cue. That async device
    // wake-up is the cost the first sound pays; the cue envelopes themselves
    // are ~1ms (tick/release use attack 0.001). cuelume exposes no
    // context/init/resume handle, and its only context-creating path (play)
    // is always audible, so its own context cannot be warmed silently.
    // Instead, on the first user gesture we create and resume a parallel,
    // silent AudioContext (no nodes attached), which opens the browser's
    // shared audio device up front. cuelume's context then resumes against an
    // already-running audio thread, so the first real cue skips the cold start.
    let warmed = false;
    let warmCtx: AudioContext | null = null;
    const warmUp = () => {
      if (warmed) return;
      warmed = true;
      try {
        const Ctor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return;
        warmCtx = new Ctor();
        void warmCtx.resume().catch(() => {});
      } catch {
        /* audio unavailable — nothing to warm */
      }
    };
    window.addEventListener("pointerdown", warmUp, { capture: true, once: true });

    return () => {
      window.removeEventListener("pointerdown", warmUp, true);
      if (warmCtx) void warmCtx.close().catch(() => {});
    };
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
