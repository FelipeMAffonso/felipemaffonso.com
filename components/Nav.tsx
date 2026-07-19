"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ParticleField } from "./ParticleField";
import { ThemeToggle } from "./ThemeToggle";
import { SoundToggle } from "./SoundToggle";
import { useSound } from "@/lib/sound";
import { usePixelVariants } from "@/lib/pixelVariants";
import { NAV_ICON_SETS } from "./navIcons";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/research/", label: "Research" },
  { href: "/teaching/", label: "Teaching" },
  { href: "/cv/", label: "CV" },
  { href: "/contact/", label: "Contact" },
] as const;

function norm(path: string) {
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

export function Nav() {
  const pathname = usePathname();
  const { play } = useSound();
  const { navicons } = usePixelVariants();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const iconSet = navicons === "off" ? null : NAV_ICON_SETS[navicons];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the mobile menu whenever the route changes
  useEffect(() => setMenuOpen(false), [pathname]);

  const current = norm(pathname || "/");

  // Navigating to a DIFFERENT page plays a page-change cue; clicking the
  // tab you are already on stays silent.
  const onNavClick = (href: string) => {
    if (norm(href) !== current) play("release");
  };

  return (
    <div className={`nav-bar${scrolled ? " scrolled" : ""}`}>
      <ParticleField variant="nav" />
      <nav className="nav">
        <Link href="/" className="nav-name" onClick={() => onNavClick("/")}>Felipe M. Affonso</Link>
        <ul className={`nav-links${menuOpen ? " open" : ""}`}>
          {LINKS.map((l) => {
            const Glyph = iconSet ? iconSet[l.href] : null;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={norm(l.href) === current ? "active" : undefined}
                  onClick={() => onNavClick(l.href)}
                >
                  {Glyph && <Glyph />}
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="nav-right">
          <SoundToggle />
          <ThemeToggle />
          <button
            className="nav-hamburger"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>
    </div>
  );
}
