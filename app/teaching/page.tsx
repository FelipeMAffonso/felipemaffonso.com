import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { PageBanner } from "@/components/PageBanner";
import { PageStrip } from "@/components/PageStrip";
import { TeachingSections, type TeachingSection } from "@/components/TeachingSections";
import { feedback } from "@/lib/student-feedback";
import { TeachingAwards } from "@/components/TeachingAwards";

export const metadata: Metadata = {
  title: "Teaching",
  description:
    "Teaching experience and courses by Felipe M. Affonso at Oklahoma State University and University of Florida.",
  alternates: { canonical: "/teaching/" },
};

const d = (i: number) => ({ "--enter-i": i } as CSSProperties);

// Teaching Interests removed (Felipe 2026-10-25: "teaching interests can go away ... remove it").
// Awards open like Publications entries (Felipe 2026-10-25); their text is in TeachingAwards.
const sections: TeachingSection[] = [
  {
    key: "awards",
    n: 2,
    label: "Awards",
    content: (
          <section key="awards" className="section enter" style={d(0)}>
            <h2 className="section-title">Teaching Awards</h2>
            <TeachingAwards />
          </section>
    ),
  },
  {
    key: "courses",
    n: 14,
    label: "Courses",
    content: (
          <section key="courses" className="section enter" style={d(2)}>
            <h2 className="section-title">Teaching Experience</h2>

            <h3 className="subsection-title">Instructor</h3>

            <p className="institution-name">Spears School of Business, Oklahoma State University, USA</p>
            <ul className="course-list">
              <li>Principles of Marketing (Core Course, B.Sc.), Fall 2026</li>
              <li>Marketing Research (B.Sc.), Spring 2025, Spring 2026, Summer 2026, Fall 2026</li>
              <li>Honors Course: Marketing Science Laboratory (B.Sc.), Fall 2025, Spring 2026</li>
              <li>Marketing Internship for Credit (B.Sc.), Summer 2026</li>
              <li>Managerial Strategies in Marketing (B.Sc.), Spring 2024</li>
            </ul>

            <p className="institution-name">Warrington College of Business, University of Florida, USA</p>
            <ul className="course-list">
              <li>Problems and Methods in Marketing Management (M.Sc.), Spring 2023</li>
              <li>Marketing Management (B.Sc.), Spring 2021</li>
            </ul>

            <h3 className="subsection-title">Guest Lecturer</h3>

            <p className="institution-name">Spears School of Business, Oklahoma State University, USA</p>
            <ul className="course-list">
              <li>Executive Doctorate in Business Administration Cohort, April 2026</li>
            </ul>

            <p className="institution-name">Rutgers Business School, Rutgers University, USA</p>
            <ul className="course-list">
              <li>Building Experiments in Qualtrics (Ph.D. Seminar, Experimental Design), Fall 2022</li>
              <li>Building Experiments in Qualtrics (Ph.D. Seminar, Experimental Design), Fall 2020</li>
            </ul>

            <h3 className="subsection-title">Teaching Assistant</h3>

            <p className="institution-name">School of Economics, Business, and Accounting, University of Sao Paulo, Brazil</p>
            <ul className="course-list">
              <li>Product, Service, and Price Decisions (B.Sc.), Fall 2016</li>
            </ul>

            <p className="institution-name">School of Arts, Sciences, and Humanities, University of Sao Paulo, Brazil</p>
            <ul className="course-list">
              <li>Multivariate Data Analysis I (B.Sc.), Spring 2014</li>
              <li>Marketing Research III (B.Sc.), Spring 2015</li>
              <li>Statistical Inference (B.Sc.), Fall 2014, Fall 2015</li>
            </ul>
          </section>
    ),
  },
  {
    key: "feedback",
    n: feedback.length,
    label: "Comments",
    short: "Comments",
    feedback: true,
    // TeachingSections wraps this heading and the comment grid in one section
    content: <h2 key="feedback" className="section-title">Selected Comments on Teaching</h2>,
  },
];

export default function TeachingPage() {
  return (
    <>
      <PageBanner title="Teaching" />
      <main className="page">
        <PageStrip page="teaching" />
        <TeachingSections sections={sections} />

      </main>
    </>
  );
}
