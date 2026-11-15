import type { Metadata } from "next";
import { FilterOptionsBoard } from "@/components/filter-options/Board";

/* The publication filter options, for Felipe's review (branch pub-filter-options,
   2026-11-14). This page never reaches the live site: the branch is not merged,
   and the chosen design replaces it on the real Publications page. */
export const metadata: Metadata = {
  title: "Publication filters",
  robots: { index: false, follow: false },
};

export default function FilterOptionsPage() {
  return <FilterOptionsBoard />;
}
