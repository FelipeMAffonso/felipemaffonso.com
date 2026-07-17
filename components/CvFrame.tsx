"use client";

/* ============================================================
   CvFrame: the single, persistent CV viewer.

   ONE Drive iframe for the whole app, mounted once in the root layout so it
   is never remounted or reparented across route changes (reparenting reloads
   an iframe). It loads the moment the site opens, on any page, so clicking CV
   shows an already-rendered viewer instead of a cold blank box.

   Positioning is in DOCUMENT coordinates (position:absolute, NOT fixed) so
   native scrolling keeps it glued to the page with zero jitter.

   - Off /cv/: parked far offscreen with real dimensions, still rendered (never
     display:none / visibility:hidden, because offscreen-but-rendered is the point, so
     the browser actually paints it while it warms). Marked aria-hidden + inert
     so it never enters the a11y tree or the tab order.
   - On /cv/: measures the placeholder's document-coordinate rect and sizes the
     host exactly over it; re-measures on resize and via ResizeObserver on both
     the placeholder and document.body (content above the slot can shift).
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const CV_SRC =
  "https://drive.google.com/file/d/13ephsH3DcEmjTE43Ugi3K_KZ2Kz7pwKP/preview";
const SLOT_ID = "cv-embed-slot";

// Offscreen warm-up box: real, generous dimensions so the Drive viewer lays out
// and renders a full page while parked out of view. Far to the left so it never
// touches the visible viewport or adds horizontal scroll.
const OFFSCREEN = { left: -12000, top: 0, width: 1100, height: 1400 };

function norm(path: string) {
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

export function CvFrame() {
  const pathname = usePathname();
  const onCv = norm(pathname || "/") === "/cv";

  const hostRef = useRef<HTMLDivElement | null>(null);
  const [box, setBox] = useState(OFFSCREEN);

  useEffect(() => {
    if (!onCv) {
      setBox(OFFSCREEN);
      return;
    }

    const measure = () => {
      const slot = document.getElementById(SLOT_ID);
      if (!slot) return;
      const r = slot.getBoundingClientRect();
      setBox({
        left: r.left + window.scrollX,
        top: r.top + window.scrollY,
        width: r.width,
        height: r.height,
      });
    };

    measure();

    // The viewport can resize, and content above the slot can shift (fonts,
    // images, the entrance animation), which moves the slot in the document.
    window.addEventListener("resize", measure);
    const slot = document.getElementById(SLOT_ID);
    const roSlot = slot ? new ResizeObserver(measure) : null;
    roSlot?.observe(slot as Element);
    const roBody = new ResizeObserver(measure);
    roBody.observe(document.body);

    // Catch late layout (font swap, the placeholder's entrance transform ending).
    const raf = requestAnimationFrame(measure);
    const t = window.setTimeout(measure, 300);

    return () => {
      window.removeEventListener("resize", measure);
      roSlot?.disconnect();
      roBody.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, [onCv]);

  const style: React.CSSProperties = {
    position: "absolute",
    left: box.left,
    top: box.top,
    width: box.width,
    height: box.height,
  };

  return (
    <div
      ref={hostRef}
      className="cv-frame-host"
      style={style}
      aria-hidden={onCv ? undefined : true}
      inert={onCv ? undefined : true}
    >
      <iframe
        className="cv-frame-iframe"
        src={CV_SRC}
        allow="autoplay"
        title="Curriculum Vitae, Felipe M. Affonso"
        tabIndex={onCv ? undefined : -1}
      />
    </div>
  );
}
