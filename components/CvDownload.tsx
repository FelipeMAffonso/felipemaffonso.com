"use client";

import { useSound } from "@/lib/sound";
import { useVariants } from "@/lib/variants";

// Self-hosted so the download never depends on a third party (the Drive
// iframe below is still the in-page viewer).
const CV_DOWNLOAD_URL = "/files/cv.pdf";

export function CvDownload() {
  const { play } = useSound();
  const { soundmap } = useVariants();
  return (
    <p className="cv-download-link enter">
      <a
        href={CV_DOWNLOAD_URL}
        className="cv-download"
        download
        onClick={() => {
          if (soundmap === "B") play("success");
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download PDF
      </a>
    </p>
  );
}
