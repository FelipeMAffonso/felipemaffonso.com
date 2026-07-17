import type { Metadata } from "next";
import { PageBanner } from "@/components/PageBanner";
import { CvDownload } from "@/components/CvDownload";

export const metadata: Metadata = {
  title: "Curriculum Vitae",
  description:
    "Curriculum Vitae of Felipe M. Affonso, Assistant Professor of Marketing at Oklahoma State University.",
  alternates: { canonical: "/cv/" },
};

export default function CvPage() {
  return (
    <>
      <PageBanner title="Curriculum Vitae" />
      <main className="page page-wide">
        <p className="cv-intro enter">You can view my CV below.</p>

        <CvDownload />

        {/* Placeholder that reserves the viewer's box and shows a calm loading
            shimmer. The real Drive iframe is a single persistent element
            (components/CvFrame) that is warmed on every page and overlaid here
            in document coordinates, so opening this page shows an already
            rendered viewer instead of a cold blank box. */}
        <div className="cv-embed enter">
          <div id="cv-embed-slot" className="cv-embed-slot" aria-hidden="true" />
        </div>
      </main>
    </>
  );
}
