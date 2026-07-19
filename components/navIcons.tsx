/* ============================================================
   Nav tab icons (adjudication axis "navicons").
   Two candidate sets for the five nav tabs, both sized 15px and
   colored by currentColor so they follow the tab's text state:
   - line: stroked glyphs in the site's existing icon voice
     (stroke 2, rounded), like the Nucleo sidebar reference;
   - pixel: cell-grid glyphs in the poster language.
   Default is off (no icons), the clean fallback.
   ============================================================ */

type Cells = [number, number][];

function Px({ cells }: { cells: Cells }) {
  const u = 2.5;
  return (
    <svg className="nav-glyph" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      {cells.map(([c, r], i) => (
        <rect key={i} x={c * u + 0.25} y={r * u + 0.25} width={2} height={2} rx={0.45} />
      ))}
    </svg>
  );
}

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

/* ---- line set ---------------------------------------------- */

export function LineHomeIcon() {
  return (
    <Ln>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </Ln>
  );
}
export function LineResearchIcon() {
  // flask
  return (
    <Ln>
      <path d="M10 2v6L4.5 18a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L14 8V2" />
      <line x1="8.5" y1="2" x2="15.5" y2="2" />
      <line x1="7" y1="14" x2="17" y2="14" />
    </Ln>
  );
}
export function LineTeachingIcon() {
  // graduation cap
  return (
    <Ln>
      <path d="M22 10L12 5 2 10l10 5 10-5z" />
      <path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
    </Ln>
  );
}
export function LineCvIcon() {
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
export function LineContactIcon() {
  // envelope
  return (
    <Ln>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 7l-10 6L2 7" />
    </Ln>
  );
}

/* ---- pixel set --------------------------------------------- */

export function PixelHomeIcon() {
  const cells: Cells = [
    [3, 1], [4, 1],
    [2, 2], [5, 2],
    [1, 3], [6, 3],
    [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4],
    [1, 5], [2, 5], [5, 5], [6, 5],
    [1, 6], [2, 6], [5, 6], [6, 6],
  ];
  return <Px cells={cells} />;
}
export function PixelResearchIcon() {
  // flask: neck then widening bowl
  const cells: Cells = [
    [3, 1], [4, 1],
    [3, 2], [4, 2],
    [3, 3], [4, 3],
    [2, 4], [3, 4], [4, 4], [5, 4],
    [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5],
    [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6],
  ];
  return <Px cells={cells} />;
}
export function PixelTeachingIcon() {
  // mortarboard with tassel
  const cells: Cells = [
    [3, 1], [4, 1],
    [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2],
    [2, 3], [3, 3], [4, 3], [5, 3],
    [2, 4], [3, 4], [4, 4], [5, 4],
    [6, 3], [6, 4], [6, 5],
  ];
  return <Px cells={cells} />;
}
export function PixelCvIcon() {
  // sheet with folded corner and text rows
  const cells: Cells = [
    [1, 1], [2, 1], [3, 1], [4, 1],
    [5, 2],
    [1, 2], [1, 3], [1, 4], [1, 5], [1, 6],
    [5, 3], [5, 4], [5, 5], [5, 6],
    [2, 3], [3, 3], [4, 3],
    [2, 5], [3, 5],
    [2, 6], [3, 6], [4, 6],
  ];
  return <Px cells={cells} />;
}
export function PixelContactIcon() {
  // envelope with the V flap
  const cells: Cells = [
    [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2],
    [1, 3], [2, 3], [5, 3], [6, 3],
    [3, 4], [4, 4],
    [1, 4], [6, 4],
    [1, 5], [6, 5],
    [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6],
  ];
  return <Px cells={cells} />;
}

export const NAV_ICON_SETS = {
  line: {
    "/": LineHomeIcon,
    "/research/": LineResearchIcon,
    "/teaching/": LineTeachingIcon,
    "/cv/": LineCvIcon,
    "/contact/": LineContactIcon,
  },
  pixel: {
    "/": PixelHomeIcon,
    "/research/": PixelResearchIcon,
    "/teaching/": PixelTeachingIcon,
    "/cv/": PixelCvIcon,
    "/contact/": PixelContactIcon,
  },
} as const;
