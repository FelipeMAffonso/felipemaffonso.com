/* ============================================================
   Filter options review: every word the review page shows, in one
   place (the board is generated from this manifest). Plain English;
   claude-home's prose_lint.py reads this file before each publish.
   Felipe 2026-11-14: "I don't want a "Filter" button, I want a button
   to filter by Journal and a button to filter by year, two buttons."
   Decided by Felipe the same day, so their settings left the page:
   "journal list is journals only (preprints get filtered out). list
   length is scroll", "placement will be LEFT", "icons will be book and
   calendar", "forthcoming is it's own stop", "for many years, I want the
   "Zooms to your range" idea", "I want "Only the chosen name" by the way,
   the way it is" (DECIDED below; FIXED in Board.tsx applies the ones that
   are settings). Every setting is decided, so the page offers none.
   ============================================================ */

import type { Forth, Icons, Layer, ListLen, Place, Types } from "./model";

export const BOARD = {
  title: "Publication filters",
  lead:
    "This is the real Publications page with your 18 entries, running on this computer, with every choice you made today: " +
    "Journal and Year on the left, and the type buttons that show only the chosen name. Journal opens the journals with a " +
    "checkbox and a count for each; Year opens the orange slider. Every count updates with the other filters. " +
    "The desktop view and the phone view are the same page, and the notes kit in the corner records your pins.",

  /* Felipe's decisions of 2026-11-14; the page shows them and no longer offers the alternatives */
  decided: {
    title: "Decided on November 14",
    items: [
      {
        name: "Only the chosen name",
        what: "Each type shows its icon, and only the chosen one shows its name and count, as Fluid's active label does.",
      },
      {
        name: "Journals only",
        what: "The Journal list holds the ten journals. Checking a journal moves the type to Journal publications, so preprints and book chapters leave the list.",
      },
      {
        name: "No choice clears another",
        what: "All keeps the chosen journals and years, so with JCP chosen, All lists its two papers. Preprints with a journal chosen says that no preprints match. Only Clear resets the type, the journals and the years.",
      },
      {
        name: "Scroll",
        what: "The Journal list shows six rows, and the other four scroll inside the panel under a soft fade.",
      },
      {
        name: "Left",
        what: "Journal and Year come first in the row, then All and the type buttons.",
      },
      {
        name: "Book and calendar",
        what: "Journal has an open book with lines of text, and Year has a calendar with a range across it.",
      },
      {
        name: "Many years: the slider zooms",
        what: "When the papers span many years, the slider zooms to the chosen years after each drag or click, with Show all years to zoom back out, as in the second example below. Today's eight years fit without it.",
      },
      {
        name: "Forthcoming, its own stop",
        what: "The slider runs from 2019 to a last stop called Forthcoming, set apart by a gap and a dashed track, which holds the seven entries that have no year yet (five papers and two chapters).",
      },
    ],
    settings: {
      layer: "journals" as Layer, list: "scroll" as ListLen, place: "left" as Place, icons: "book" as Icons, forth: "stop" as Forth,
      types: "active" as Types,
    },
  },

  /* an example with made-up years, to show how the slider behaves when the papers span 30 years */
  long: {
    title: "Example: thirty years of papers",
    what:
      "These two sliders use made-up years, 1996 to 2026 and Forthcoming, to show what happens when the papers span thirty years. " +
      "Drag a handle or click a year in each.",
    modes: [
      {
        key: "thin",
        name: "Fewer labels",
        what: "The axis labels every fifth year, and each handle shows its own year above it. Hovering over the track shows the year a click would pick.",
      },
      {
        key: "zoom",
        name: "Zooms to your range",
        what: "After a drag or a click, the axis zooms to the chosen years with a little room on each side, and labels every year once the view is narrow enough. Show all years zooms back out.",
      },
    ],
  },

  order: {
    title: "The order of the journal list",
    what:
      "By prestige and impact factor, as I read it: Trends in Cognitive Sciences, Journal of Consumer Research, Journal of Marketing, " +
      "Journal of Marketing Research, Journal of Consumer Psychology, Research Policy, Journal of Experimental Psychology: General, " +
      "Journal of Advertising, European Journal of Marketing, Psychology & Marketing. Pin any journal that should move.",
  },


  phoneNote: "The phone view is the same page at 390 pixels. On a phone, each button opens its list as a dialog.",
};
