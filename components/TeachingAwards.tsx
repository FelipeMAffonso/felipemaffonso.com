"use client";

// The Teaching Awards list, opening like a Publications entry. Each award opens to two paragraphs
// (Felipe 2026-10-25: "a plain english version of what the two teaching awards were, their official
// descriptions", then "official description but also a highlight of what I did"): first what the
// Spears School gives the award for, rewritten from its own description (the awards call of
// 29 Apr 2026, the same words as 2025), then what the course that won it did, from Felipe's
// nominations (MKTG 4333 Spring 2025, 19 May 2025; MKTG 4333 Spring 2026, 26 May 2026). SOL drafted
// the text and the session checked every number against the nominations; the call, the
// nominations and SOL's drafts are kept in the private cv repo, teaching-feedback/sources/ and
// teaching-feedback/awards-sol/.
import { ExpandList, type ExpandItem } from "@/components/ExpandList";

const awards: ExpandItem[] = [
  {
    id: "innovation-2026",
    citation: "Innovation in Pedagogy and High-Impact Practices Teaching Award, Oklahoma State University, 2026",
    detail: (
      <>
        <p>
          The Spears School of Business gives this award for the best teaching in its courses that helps
          students learn through active participation or teamwork.
        </p>
        <p>
          The school gave it for Marketing Research (MKTG 4333) in Spring 2026. That semester, 210 students
          in two sections worked in teams on three research projects, two of them done for clients, 67
          Oklahoma organizations in all. AffonsoGPT, an AI teaching assistant built for the course,
          answered students&apos; questions at any hour but did not do their assignments. Students rated
          their confidence in conducting marketing research at 2.41 out of 5 at the start of the semester
          and 4.09 at the end.
        </p>
      </>
    ),
  },
  {
    id: "engagement-2025",
    citation: "Engagement with Practice and Social Impact Teaching Award, Oklahoma State University, 2025",
    detail: (
      <>
        <p>
          The Spears School of Business gives this award for the best course activities that help students
          learn through direct work with business or nonprofit professionals.
        </p>
        <p>
          The school gave it for Marketing Research (MKTG 4333) in Spring 2025. That semester, 143 students
          in 22 teams did research for 22 Oklahoma organizations and presented their findings and
          recommendations to them. The organizations were 17 small businesses, 4 nonprofits (among them the
          American Lung Association and United Way of Central Oklahoma) and the Spears School&apos;s
          Marketing and Communications department. Half of the organizations said they planned to use some
          or most of the students&apos; recommendations.
        </p>
      </>
    ),
  },
];

export function TeachingAwards() {
  return <ExpandList items={awards} idPrefix="award" />;
}
