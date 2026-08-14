import type { Metadata } from "next";
import { PageBanner } from "@/components/PageBanner";
import { PageStrip } from "@/components/PageStrip";
import { CvDownload } from "@/components/CvDownload";
import { CvPages } from "@/components/CvPages";

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
        <PageStrip page="cv" />
        <p className="cv-intro enter">You can view my CV below.</p>

        <CvDownload />

        <CvPages />
      </main>
    </>
  );
}
