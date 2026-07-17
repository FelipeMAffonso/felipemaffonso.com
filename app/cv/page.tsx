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

        <div className="cv-embed enter">
          <iframe
            src="https://drive.google.com/file/d/13ephsH3DcEmjTE43Ugi3K_KZ2Kz7pwKP/preview"
            allow="autoplay"
            title="Curriculum Vitae — Felipe M. Affonso"
          />
        </div>
      </main>
    </>
  );
}
