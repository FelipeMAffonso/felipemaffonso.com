"use client";

// The Teaching page's sections under a filter row like the one on Publications (All, Awards,
// Courses, Comments), sticky under the nav. The comments section holds its own heading plus the
// comment grid. The preview options panel that sat above it on branch teaching-feedback-options
// is gone (Felipe 2026-10-25: "you just keep the section filter row"); its last version is kept
// in the private cv repo, teaching-feedback/site-design-archive/, with the student quotes.
//
// The row is SectionTabs since 2026-11-14: an icon on each section, and only the chosen one shows its
// name and count (Felipe: "apply the same tabsubtle idea we have in the publications one. for teaching
// we dont need filters ... it's just a different display").
import { Fragment, useState, type ReactNode } from "react";
import { Award, Layers, MessageSquareQuote, Presentation } from "lucide-react";
import { SectionTabs } from "@/components/SectionTabs";
import { StudentFeedback } from "@/components/StudentFeedback";

/* the icon for each section: a stack for All, a ribbon for Awards, a presentation board for Courses,
   a speech bubble with a quote for Comments */
const ICONS: Record<string, typeof Layers> = { all: Layers, awards: Award, courses: Presentation, feedback: MessageSquareQuote };

export interface TeachingSection { key: string; label: string; short?: string; n?: number; content: ReactNode; feedback?: boolean }

const NAV_H = 64;

export function TeachingSections({ sections }: { sections: TeachingSection[] }) {
  const [section, setSection] = useState("all");
  const visible = section === "all" ? sections : sections.filter((s) => s.key === section);

  // Picking a section from further down the page brings the reader back to its start, just under
  // the sticky row (Felipe 2026-10-25: "if I click comments when being at the bottom of scrolling
  // down, it filters, but it doesnt put me at the top of comments"); the same jump the Publications
  // filter makes, and it also fires when the section picked is the one already showing.
  const pick = (key: string) => {
    const bar = document.querySelector<HTMLElement>(".pub-filter:not(.pub-filter-static)");
    const first = bar?.nextElementSibling as HTMLElement | null;
    if (bar && first) {
      const top = first.getBoundingClientRect().top + window.scrollY - NAV_H - bar.offsetHeight - 8;
      // "instant", not "auto": the site sets scroll-behavior smooth, which turned "auto" into a
      // long glide that the section switch landed in the middle of
      if (window.scrollY > top) window.scrollTo({ top, behavior: "instant" });
    }
    setSection(key);
  };

  return (
    <>
      <SectionTabs sticky ariaLabel="Show sections" value={section} onPick={pick}
        items={[{ key: "all", label: "All", icon: ICONS.all }, ...sections.map((s) => ({ key: s.key, label: s.label, icon: ICONS[s.key] ?? Layers, n: s.n }))]} />

      {visible.map((s, i) =>
        s.feedback ? (
          <section key={s.key} className="section enter" style={{ ["--enter-i" as string]: i }}>
            {s.content}
            <StudentFeedback />
          </section>
        ) : (
          <Fragment key={s.key}>{s.content}</Fragment>
        ),
      )}
    </>
  );
}
