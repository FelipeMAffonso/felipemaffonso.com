/* ============================================================
   Nav tab icons — the line set (adjudicated 2026-07-19).
   Stroked glyphs in the site's icon voice (stroke 2, rounded),
   15px, colored by currentColor so they follow the tab state.
   ============================================================ */

function Ln({ children }: { children: React.ReactNode }) {
  return (
    <svg
      className="nav-glyph"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function HomeIcon() {
  return (
    <Ln>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </Ln>
  );
}
export function ResearchIcon() {
  // flask
  return (
    <Ln>
      <path d="M10 2v6L4.5 18a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L14 8V2" />
      <line x1="8.5" y1="2" x2="15.5" y2="2" />
      <line x1="7" y1="14" x2="17" y2="14" />
    </Ln>
  );
}
export function TeachingIcon() {
  // graduation cap
  return (
    <Ln>
      <path d="M22 10L12 5 2 10l10 5 10-5z" />
      <path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
    </Ln>
  );
}
export function CvIcon() {
  // document with lines
  return (
    <Ln>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </Ln>
  );
}
export function ContactIcon() {
  // envelope
  return (
    <Ln>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 7l-10 6L2 7" />
    </Ln>
  );
}

export const NAV_ICONS = {
  "/": HomeIcon,
  "/research/": ResearchIcon,
  "/teaching/": TeachingIcon,
  "/cv/": CvIcon,
  "/contact/": ContactIcon,
} as const;
