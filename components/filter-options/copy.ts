/* ============================================================
   Filter options review: every word the review page shows, in one
   place (the board is generated from this manifest). Plain English;
   claude-home's prose_lint.py reads this file before each publish.
   Felipe 2026-11-14: "I don't want a "Filter" button, I want a button
   to filter by Journal and a button to filter by year, two buttons."
   Decided by Felipe the same day, so their settings left the page:
   "journal list is journals only (preprints get filtered out). list
   length is scroll", "placement will be LEFT", "icons will be book and
   calendar", "forthcoming is it's own stop" (DECIDED below; FIXED in
   Board.tsx applies them).
   ============================================================ */

import type { Forth, Icons, Layer, ListLen, Place, Types } from "./model";

export const BOARD = {
  title: "Publication filters",
  lead:
    "This is the real Publications page with your 18 entries, running on this computer, with two new buttons: Journal and Year. " +
    "Journal opens a list of the journals with a checkbox and a count for each; Year opens an orange slider with two handles. " +
    "Every count updates with the other filters: choosing 2021 to 2026 changes the numbers on the type buttons and beside each journal. " +
    "Switch the settings below to try any combination; the desktop view and the phone view follow, and the notes kit in the corner records your pins.",

  types: [
    {
      key: "row" as Types,
      name: "Today's row",
      what: "The type buttons stay as they are on the live page: All 18, Journal publications 13, Preprints 3, Book chapters 2.",
    },
    {
      key: "icons" as Types,
      name: "Icons and names",
      what: "The same choices with an icon before each name: a stack for All, an open book for journal publications, a page for preprints, a bookmarked book for chapters.",
    },
    {
      key: "active" as Types,
      name: "Only the chosen name",
      what: "Fluid's active label: every type shows its icon, and only the chosen one shows its name and count. A visitor has to hover over an icon to learn what the others are.",
    },
    {
      key: "menu" as Types,
      name: "A Type button",
      what: "The type becomes a third button beside Journal and Year. It reads All types, or the chosen type, and its menu lists each type with its count.",
    },
  ],

  /* Felipe's decisions of 2026-11-14; the page shows them and no longer offers the alternatives */
  decided: {
    title: "Decided on November 14",
    items: [
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
        name: "Forthcoming, its own stop",
        what: "The slider runs from 2019 to a last stop called Forthcoming, set apart by a gap and a dashed track, which holds the seven entries that have no year yet (five papers and two chapters).",
      },
    ],
    settings: {
      layer: "journals" as Layer, list: "scroll" as ListLen, place: "left" as Place, icons: "book" as Icons, forth: "stop" as Forth,
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

  pick: {
    settings: { types: "row" as Types },
    why:
      "My pick is today's type row. A professor who visits reads every type as a word, with no icon to decode. For thirty years of " +
      "papers I would keep fewer labels over the zoom: the axis stays where the eye left it, and the handles name their own years.",
  },

  phoneNote: "The phone view is the same page at 390 pixels. On a phone, each button opens its list as a dialog.",
};
