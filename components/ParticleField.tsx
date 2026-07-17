"use client";

/* ============================================================
   Coral particle constellation — the site signature, rebuilt.
   - devicePixelRatio-aware canvas (crisp on retina)
   - gentle drift + spring-interpolated mouse influence (useSpring)
   - theme-aware coral (reads --coral-particle rgb triplet)
   - fully STATIC under prefers-reduced-motion
   - debounced resize; pauses when tab hidden
   ============================================================ */

import { useEffect, useRef } from "react";
import { useSpring } from "motion/react";

type Variant = "nav" | "hero";

const CONFIG: Record<Variant, { maxParticles: number; densityDivisor: number; maxDistance: number; speed: number; dotAlpha: number; lineAlpha: number }> = {
  hero: { maxParticles: 80, densityDivisor: 8000, maxDistance: 150, speed: 0.4, dotAlpha: 0.55, lineAlpha: 0.18 },
  nav: { maxParticles: 46, densityDivisor: 2400, maxDistance: 120, speed: 0.28, dotAlpha: 0.5, lineAlpha: 0.16 },
};

type P = { x: number; y: number; vx: number; vy: number; r: number };

export function ParticleField({ variant }: { variant: Variant }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Spring-smoothed pointer position (CSS px, canvas-local). ~stiffness 100 / damping 20.
  const mx = useSpring(-9999, { stiffness: 100, damping: 20 });
  const my = useSpring(-9999, { stiffness: 100, damping: 20 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cfg = CONFIG[variant];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    let particles: P[] = [];
    let cssW = 0;
    let cssH = 0;
    let raf = 0;
    let coral: [number, number, number] = [218, 119, 86];

    function readCoral() {
      const raw = getComputedStyle(document.documentElement).getPropertyValue("--coral-particle").trim();
      const parts = raw.split(",").map((n) => parseInt(n, 10));
      if (parts.length === 3 && parts.every((n) => !Number.isNaN(n))) {
        coral = [parts[0], parts[1], parts[2]];
      }
    }

    function seed() {
      const num = Math.min(cfg.maxParticles, Math.floor((cssW * cssH) / cfg.densityDivisor));
      particles = [];
      for (let i = 0; i < num; i++) {
        particles.push({
          x: Math.random() * cssW,
          y: Math.random() * cssH,
          vx: (Math.random() - 0.5) * cfg.speed,
          vy: (Math.random() - 0.5) * cfg.speed,
          r: Math.random() * 2 + 1,
        });
      }
    }

    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssW = parent.offsetWidth;
      cssH = parent.offsetHeight;
      canvas!.width = Math.round(cssW * dpr);
      canvas!.height = Math.round(cssH * dpr);
      canvas!.style.width = cssW + "px";
      canvas!.style.height = cssH + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function frame() {
      ctx!.clearRect(0, 0, cssW, cssH);
      const [cr, cg, cb] = coral;
      const pmx = mx.get();
      const pmy = my.get();
      const hasMouse = pmx > -9000;

      // links
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const d = Math.hypot(dx, dy);
          if (d < cfg.maxDistance) {
            ctx!.beginPath();
            ctx!.moveTo(p.x, p.y);
            ctx!.lineTo(p2.x, p2.y);
            ctx!.strokeStyle = `rgba(${cr},${cg},${cb},${cfg.lineAlpha * (1 - d / cfg.maxDistance)})`;
            ctx!.lineWidth = 1;
            ctx!.stroke();
          }
        }
      }

      // dots + integrate
      for (const p of particles) {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${cr},${cg},${cb},${cfg.dotAlpha})`;
        ctx!.fill();

        p.x += p.vx;
        p.y += p.vy;

        // gentle, spring-smoothed pointer repulsion (subtle so text always wins)
        if (hasMouse) {
          const dx = p.x - pmx;
          const dy = p.y - pmy;
          const dist = Math.hypot(dx, dy);
          const R = cfg.maxDistance;
          if (dist < R && dist > 0.01) {
            const push = (1 - dist / R) * 0.6;
            p.x += (dx / dist) * push;
            p.y += (dy / dist) * push;
          }
        }

        if (p.x < 0 || p.x > cssW) p.vx *= -1;
        if (p.y < 0 || p.y > cssH) p.vy *= -1;
        p.x = Math.max(0, Math.min(cssW, p.x));
        p.y = Math.max(0, Math.min(cssH, p.y));
      }

      raf = requestAnimationFrame(frame);
    }

    function drawStatic() {
      // one calm frame: dots + links, no motion
      ctx!.clearRect(0, 0, cssW, cssH);
      const [cr, cg, cb] = coral;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const d = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (d < cfg.maxDistance) {
            ctx!.beginPath();
            ctx!.moveTo(p.x, p.y);
            ctx!.lineTo(p2.x, p2.y);
            ctx!.strokeStyle = `rgba(${cr},${cg},${cb},${cfg.lineAlpha * (1 - d / cfg.maxDistance)})`;
            ctx!.lineWidth = 1;
            ctx!.stroke();
          }
        }
      }
      for (const p of particles) {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${cr},${cg},${cb},${cfg.dotAlpha})`;
        ctx!.fill();
      }
    }

    function start() {
      cancelAnimationFrame(raf);
      if (reduce.matches || document.hidden) {
        drawStatic();
      } else {
        raf = requestAnimationFrame(frame);
      }
    }

    // debounced resize
    let resizeTimer: number | undefined;
    function onResize() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resize();
        start();
      }, 150);
    }

    // pointer tracking (canvas-local); springs smooth it
    function onPointerMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      mx.set(e.clientX - rect.left);
      my.set(e.clientY - rect.top);
    }
    function onPointerLeave() {
      mx.set(-9999);
      my.set(-9999);
    }

    function onVisibility() {
      start();
    }
    function onReduceChange() {
      start();
    }

    readCoral();
    resize();
    start();

    // theme changes recolor the constellation
    const mo = new MutationObserver(() => readCoral());
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    reduce.addEventListener("change", onReduceChange);
    // pointer influence only where a fine pointer exists
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (finePointer && !reduce.matches) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerleave", onPointerLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      mo.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      reduce.removeEventListener("change", onReduceChange);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [variant, mx, my]);

  return <canvas ref={canvasRef} aria-hidden="true" />;
}
