import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { PageBanner } from "@/components/PageBanner";
import { PixelPoster } from "@/components/PixelPoster";
import { teachingPoster } from "@/lib/posterConfigs";

export const metadata: Metadata = {
  title: "Teaching",
  description:
    "Teaching experience and courses by Felipe M. Affonso at Oklahoma State University and University of Florida.",
  alternates: { canonical: "/teaching/" },
};

const d = (i: number) => ({ "--enter-i": i } as CSSProperties);

export default function TeachingPage() {
  return (
    <>
      <PageBanner title="Teaching" />
      <main className="page">
        <section className="section enter" style={d(0)}>
          <h2 className="section-title">Teaching Interests</h2>
          <p className="body-text">Marketing research, managerial statistics, experimental methods, marketing management</p>
        </section>

        <section className="section enter" style={d(1)}>
          <h2 className="section-title">Teaching Awards</h2>
          <p className="body-text">Spears Engagement with Practice and Social Impact Teaching Award, Oklahoma State University, 2025</p>
        </section>

        <section className="section enter" style={d(2)}>
          <h2 className="section-title">Teaching Experience</h2>

          <h3 className="subsection-title">Instructor</h3>

          <p className="institution-name">Spears School of Business, Oklahoma State University, USA</p>
          <ul className="course-list">
            <li>Marketing Research (B.Sc.), Spring 2025, Spring 2026</li>
            <li>Honors Course: Marketing Science Laboratory (B.Sc.), Fall 2025, Spring 2026</li>
            <li>Managerial Strategies in Marketing (B.Sc.), Spring 2024</li>
          </ul>

          <p className="institution-name">Warrington College of Business, University of Florida, USA</p>
          <ul className="course-list">
            <li>Problems and Methods in Marketing Management (M.Sc.), Spring 2023</li>
            <li>Marketing Management (B.Sc.), Spring 2021</li>
          </ul>

          <h3 className="subsection-title">Guest Lecturer</h3>

          <p className="institution-name">Rutgers Business School, Rutgers University, USA</p>
          <ul className="course-list">
            <li>Building Experiments in Qualtrics (Ph.D. Seminar, Experimental Design), Fall 2020</li>
            <li>Building Experiments in Qualtrics (Ph.D. Seminar, Experimental Design), Fall 2022</li>
          </ul>

          <h3 className="subsection-title">Teaching Assistant</h3>

          <p className="institution-name">School of Economics, Business, and Accounting, University of Sao Paulo, Brazil</p>
          <ul className="course-list">
            <li>Product, Service, and Price Decisions (B.Sc.), Fall 2016</li>
          </ul>

          <p className="institution-name">School of Arts, Sciences, and Humanities, University of Sao Paulo, Brazil</p>
          <ul className="course-list">
            <li>Statistical Inference (B.Sc.), Fall 2014, Fall 2015</li>
            <li>Marketing Research III (B.Sc.), Spring 2015</li>
            <li>Multivariate Data Analysis I (B.Sc.), Spring 2014</li>
          </ul>
        </section>

        <section className="section enter" style={d(3)}>
          <h2 className="section-title">Selected Comments from Students</h2>
          <div className="student-quotes">
            <blockquote>&quot;I have enjoyed this course and the semester project! I will be utilizing what I have learned in this class for the rest of my career and for that I am so thankful. I hope you have a good summer!&quot;</blockquote>
            <blockquote>&quot;Felipe is the best professor ever and he is so kind and you can tell that he cares about each and every one of his students. Throughly enjoyed him every day in class, he is awesome!&quot;</blockquote>
            <blockquote>&quot;Thank you for everything this semester. I know this is a very hands-on and interactive course, but you are hands down one of my favorite professors I&apos;ve had so far at OSU. It is blatantly obvious that you truly care about the success and future of every single student in your classroom.&quot;</blockquote>
            <blockquote>&quot;The communication we have with you is unlike any other professor I&apos;ve ever had, you&apos;re always willing to help, and make sure we are on the right path. I always feel like what we work on in class will be useful to us in the future, so thank you!&quot;</blockquote>
          </div>
        </section>

        <section className="section enter teaching-poster-section" style={d(4)}>
          <div className="poster-center">
            <PixelPoster
              spec={teachingPoster.spec}
              cols={teachingPoster.cols}
              rows={teachingPoster.rows}
              title={teachingPoster.title}
              caption={teachingPoster.caption}
            />
          </div>
        </section>
      </main>
    </>
  );
}
