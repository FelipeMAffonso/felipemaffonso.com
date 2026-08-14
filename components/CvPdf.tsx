"use client";

import { useEffect, useRef, useState } from "react";

const PDF_URL = "/files/cv.pdf";
const MAX_SHEET_WIDTH = 880;

// The CV viewer: a real PDF.js render of public/files/cv.pdf, the same file
// the Download button serves, so the page always shows exactly the published
// CV. Each page is drawn onto a canvas inside a paper-sheet figure, with the
// PDF's own text layer (selectable, searchable text) and its link annotations
// as real anchors, so the email address, the site link, pre-prints and media
// coverage all stay clickable. Canvases render at devicePixelRatio and
// re-render on width changes, so pages stay sharp on retina screens and
// phones.
export function CvPdf() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    let renderSeq = 0;
    let loadingTask: { destroy(): Promise<void> } | null = null;
    let docPromise: Promise<import("pdfjs-dist").PDFDocumentProxy> | null = null;

    const buildAll = async () => {
      const seq = ++renderSeq;
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";
        if (!docPromise) {
          const task = pdfjs.getDocument({
            url: PDF_URL,
            standardFontDataUrl: "/pdfjs/standard_fonts/",
          });
          loadingTask = task;
          docPromise = task.promise;
        }
        const doc = await docPromise;
        if (cancelled || seq !== renderSeq) return;

        const sheetWidth = Math.min(host.clientWidth, MAX_SHEET_WIDTH);
        const contentWidth = sheetWidth - 2; // inside the 1px sheet borders
        const dpr = window.devicePixelRatio || 1;
        host.replaceChildren();

        for (let n = 1; n <= doc.numPages; n++) {
          const page = await doc.getPage(n);
          if (cancelled || seq !== renderSeq) return;
          const viewport = page.getViewport({
            scale: contentWidth / page.getViewport({ scale: 1 }).width,
          });

          const figure = document.createElement("figure");
          figure.className = "cv-page";
          figure.style.width = `${sheetWidth}px`;
          figure.style.aspectRatio = `${sheetWidth} / ${viewport.height + 2}`;

          const canvas = document.createElement("canvas");
          canvas.width = Math.round(viewport.width * dpr);
          canvas.height = Math.round(viewport.height * dpr);
          canvas.setAttribute("role", "img");
          canvas.setAttribute("aria-label", `Curriculum Vitae, page ${n} of ${doc.numPages}`);
          figure.appendChild(canvas);

          const textDiv = document.createElement("div");
          textDiv.className = "textLayer";
          textDiv.style.setProperty("--scale-factor", String(viewport.scale));
          figure.appendChild(textDiv);
          host.appendChild(figure);

          await page.render({
            canvas,
            viewport,
            transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined,
          }).promise;
          if (cancelled || seq !== renderSeq) return;

          await new pdfjs.TextLayer({
            textContentSource: page.streamTextContent(),
            container: textDiv,
            viewport,
          }).render();
          if (cancelled || seq !== renderSeq) return;

          // The selection anchor the full PDF.js viewer adds on top of the core
          // text layer. Without it, dragging a selection across line and
          // paragraph boundaries balloons over whole blocks instead of
          // following the text.
          if (!textDiv.querySelector(".endOfContent")) {
            const end = document.createElement("div");
            end.className = "endOfContent";
            textDiv.appendChild(end);
          }
          textDiv.addEventListener("pointerdown", () => {
            textDiv.classList.add("selecting");
          });

          const toViewport = (x: number, y: number): [number, number] => {
            const m = viewport.transform;
            return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
          };
          for (const annot of await page.getAnnotations()) {
            if (annot.subtype !== "Link" || !annot.url) continue;
            const [ax1, ay1] = toViewport(annot.rect[0], annot.rect[1]);
            const [ax2, ay2] = toViewport(annot.rect[2], annot.rect[3]);
            const a = document.createElement("a");
            a.className = "cv-page-link";
            a.href = annot.url;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            a.ariaLabel = annot.url.replace(/^mailto:/, "Email ");
            a.style.left = `${(Math.min(ax1, ax2) / viewport.width) * 100}%`;
            a.style.top = `${(Math.min(ay1, ay2) / viewport.height) * 100}%`;
            a.style.width = `${(Math.abs(ax2 - ax1) / viewport.width) * 100}%`;
            a.style.height = `${(Math.abs(ay2 - ay1) / viewport.height) * 100}%`;
            figure.appendChild(a);
          }
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    };

    buildAll();

    const endSelecting = () => {
      for (const el of host.querySelectorAll(".textLayer.selecting")) {
        el.classList.remove("selecting");
      }
    };
    window.addEventListener("pointerup", endSelecting);
    window.addEventListener("pointercancel", endSelecting);

    let lastWidth = host.clientWidth;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const observer = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (Math.abs(host.clientWidth - lastWidth) > 1) {
          lastWidth = host.clientWidth;
          buildAll();
        }
      }, 200);
    });
    observer.observe(host);

    return () => {
      cancelled = true;
      renderSeq++;
      observer.disconnect();
      clearTimeout(resizeTimer);
      window.removeEventListener("pointerup", endSelecting);
      window.removeEventListener("pointercancel", endSelecting);
      loadingTask?.destroy().catch(() => {});
    };
  }, []);

  if (failed) {
    return (
      <p className="cv-intro">
        The inline viewer could not load in this browser. Use the Download PDF button above.
      </p>
    );
  }
  return <div ref={hostRef} className="cv-pages enter" />;
}
