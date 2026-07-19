/* ============================================================
   Pixel icons (adjudication option "icons=pixel").
   Glyphs drawn as small cell grids in the poster language: rects
   on an 8x8 map, gap-separated, rounded like the poster cells.
   Color comes from the surrounding CSS class (.social-icon,
   .pub-link-icon-fill) or currentColor for the nav toggles.
   Covers every icon surface: Contact profiles, Research panel
   buttons, the CV download button, and the nav toggles.
   ============================================================ */

type Cells = [number, number][];

function PixelGlyph({
  cells,
  className = "social-icon",
  size,
}: {
  cells: Cells;
  className?: string;
  size?: number;
}) {
  const u = 2.5; // cell pitch on a 20x20 viewBox
  return (
    <svg
      className={className || undefined}
      viewBox="0 0 20 20"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
    >
      {cells.map(([c, r], i) => (
        <rect key={i} x={c * u + 0.25} y={r * u + 0.25} width={2} height={2} rx={0.45} />
      ))}
    </svg>
  );
}

/* ---- contact profiles -------------------------------------- */

/* graduation cap with tassel */
export function PixelScholarIcon() {
  const cells: Cells = [
    [3, 1], [4, 1],
    [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2],
    [2, 3], [3, 3], [4, 3], [5, 3],
    [2, 4], [3, 4], [4, 4], [5, 4],
    [6, 3], [6, 4], [6, 5],
  ];
  return <PixelGlyph cells={cells} />;
}

/* cat head with ears, eye gaps at row four */
export function PixelGitHubIcon() {
  const cells: Cells = [
    [1, 1], [6, 1],
    [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2],
    [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3],
    [1, 4], [3, 4], [4, 4], [6, 4],
    [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5],
    [2, 6], [3, 6], [4, 6], [5, 6],
  ];
  return <PixelGlyph cells={cells} />;
}

/* ring */
export function PixelOsfIcon() {
  const cells: Cells = [
    [2, 1], [3, 1], [4, 1], [5, 1],
    [1, 2], [6, 2],
    [1, 3], [6, 3],
    [1, 4], [6, 4],
    [1, 5], [6, 5],
    [2, 6], [3, 6], [4, 6], [5, 6],
  ];
  return <PixelGlyph cells={cells} />;
}

/* the letters "in" */
export function PixelLinkedInIcon() {
  const cells: Cells = [
    [1, 1],
    [1, 3], [1, 4], [1, 5], [1, 6],
    [3, 3], [3, 4], [3, 5], [3, 6],
    [4, 3],
    [5, 3], [5, 4], [5, 5], [5, 6],
  ];
  return <PixelGlyph cells={cells} />;
}

/* diagonal cross */
export function PixelXIcon() {
  const cells: Cells = [
    [1, 1], [6, 1],
    [2, 2], [5, 2],
    [3, 3], [4, 3],
    [3, 4], [4, 4],
    [2, 5], [5, 5],
    [1, 6], [6, 6],
  ];
  return <PixelGlyph cells={cells} />;
}

/* a small building with column gaps */
export function PixelExpertsIcon() {
  const cells: Cells = [
    [3, 1], [4, 1],
    [2, 2], [3, 2], [4, 2], [5, 2],
    [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3],
    [1, 4], [3, 4], [4, 4], [6, 4],
    [1, 5], [3, 5], [4, 5], [6, 5],
    [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6],
  ];
  return <PixelGlyph cells={cells} />;
}

/* ---- research panel buttons (fill via .pub-link-icon-fill) -- */

const PUB = "pub-link-icon pub-link-icon-fill";

/* external link: partial box, arrow escaping top-right */
export function PixelJournalPixIcon() {
  const cells: Cells = [
    [2, 2], [3, 2],
    [1, 2], [1, 3], [1, 4], [1, 5], [1, 6],
    [2, 6], [3, 6], [4, 6], [5, 6],
    [5, 4], [5, 5],
    [3, 4], [4, 3],
    [5, 1], [6, 1], [6, 2], [5, 2],
  ];
  return <PixelGlyph cells={cells} className={PUB} />;
}

/* arrow dropping into a tray */
export function PixelDownloadPixIcon() {
  const cells: Cells = [
    [3, 1], [4, 1],
    [3, 2], [4, 2],
    [2, 3], [3, 3], [4, 3], [5, 3],
    [3, 4], [4, 4],
    [1, 5], [6, 5],
    [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6],
  ];
  return <PixelGlyph cells={cells} className={PUB} />;
}

/* full diagonal chi (arXiv) */
export function PixelArxivPixIcon() {
  const cells: Cells = [
    [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6],
    [6, 1], [5, 2], [4, 3], [3, 4], [2, 5], [1, 6],
  ];
  return <PixelGlyph cells={cells} className={PUB} />;
}

/* psi trident (PsyArXiv) */
export function PixelPsyArxivPixIcon() {
  const cells: Cells = [
    [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6],
    [1, 1], [1, 2], [1, 3],
    [5, 1], [5, 2], [5, 3],
    [2, 4], [4, 4],
  ];
  return <PixelGlyph cells={cells} className={PUB} />;
}

/* lines of text (SSRN) */
export function PixelSsrnPixIcon() {
  const cells: Cells = [
    [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1],
    [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3],
    [1, 5], [2, 5], [3, 5], [4, 5],
  ];
  return <PixelGlyph cells={cells} className={PUB} />;
}

/* ring, panel-button sizing (OSF) */
export function PixelOsfPixIcon() {
  const cells: Cells = [
    [2, 1], [3, 1], [4, 1], [5, 1],
    [1, 2], [6, 2],
    [1, 3], [6, 3],
    [1, 4], [6, 4],
    [1, 5], [6, 5],
    [2, 6], [3, 6], [4, 6], [5, 6],
  ];
  return <PixelGlyph cells={cells} className={PUB} />;
}

/* cat head, panel-button sizing (GitHub) */
export function PixelGitHubPixIcon() {
  const cells: Cells = [
    [1, 1], [6, 1],
    [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2],
    [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3],
    [1, 4], [3, 4], [4, 4], [6, 4],
    [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5],
    [2, 6], [3, 6], [4, 6], [5, 6],
  ];
  return <PixelGlyph cells={cells} className={PUB} />;
}

/* ---- CV download button (coral fill via .cv-download) ------- */

export function PixelCvDownloadIcon() {
  const cells: Cells = [
    [3, 1], [4, 1],
    [3, 2], [4, 2],
    [2, 3], [3, 3], [4, 3], [5, 3],
    [3, 4], [4, 4],
    [1, 5], [6, 5],
    [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6],
  ];
  return <PixelGlyph cells={cells} className="pixel-cv-dl" size={16} />;
}

/* ---- nav toggles (currentColor, 16px) ----------------------- */

export function PixelSunIcon() {
  const cells: Cells = [
    [3, 3], [4, 3], [3, 4], [4, 4],
    [3, 1], [4, 1], [3, 6], [4, 6],
    [1, 3], [1, 4], [6, 3], [6, 4],
    [1, 1], [6, 1], [1, 6], [6, 6],
  ];
  return <PixelGlyph cells={cells} className="" size={16} />;
}

export function PixelMoonIcon() {
  const cells: Cells = [
    [3, 1], [4, 1],
    [2, 2], [1, 3], [1, 4],
    [2, 5], [3, 6], [4, 6],
    [5, 5], [5, 2],
  ];
  return <PixelGlyph cells={cells} className="" size={16} />;
}

export function PixelSpeakerOnIcon() {
  const cells: Cells = [
    [1, 3], [1, 4],
    [2, 2], [2, 3], [2, 4], [2, 5],
    [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6],
    [5, 2], [6, 3], [6, 4], [5, 5],
  ];
  return <PixelGlyph cells={cells} className="" size={16} />;
}

export function PixelSpeakerOffIcon() {
  const cells: Cells = [
    [1, 3], [1, 4],
    [2, 2], [2, 3], [2, 4], [2, 5],
    [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6],
    [5, 2], [7, 2], [6, 3], [5, 4], [7, 4],
  ];
  return <PixelGlyph cells={cells} className="" size={16} />;
}
