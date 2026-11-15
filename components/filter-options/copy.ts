/* ============================================================
   Filter options review: every word the review page shows, in one
   place (the board is generated from this manifest). Plain English;
   claude-home's prose_lint.py reads this file before each publish.
   Felipe 2026-11-14: "I don't want a "Filter" button, I want a button
   to filter by Journal and a button to filter by year, two buttons."
   Decided by Felipe the same day, so their settings left the page:
   "journal list is journals only (preprints get filtered out). list
   length is scroll" (DECIDED below; FIXED in Board.tsx applies them).
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

  icons: [
    { key: "none" as Icons, name: "No icons", what: "Journal and Year are words only." },
    { key: "book" as Icons, name: "Book and calendar", what: "Journal has an open book with lines of text, and Year has a calendar with a range across it." },
    { key: "library" as Icons, name: "Shelf and calendar", what: "Journal has books on a shelf, and Year has a calendar page." },
    { key: "news" as Icons, name: "Periodical and clock", what: "Journal has a newspaper, and Year has a clock with an arrow turning back." },
  ],

  places: [
    { key: "left" as Place, name: "Left", what: "Journal and Year come first in the row, then All and the type buttons." },
    { key: "right" as Place, name: "Right", what: "All and the type buttons come first, and Journal and Year sit at the right end of the row." },
    { key: "below" as Place, name: "Line below", what: "All and the type buttons keep the row to themselves, and Journal and Year sit on a line under it." },
  ],

  /* Felipe's decisions of 2026-11-14; the page shows them and no longer offers the alternatives */
  decided: {
    title: "Decided on November 14",
    items: [
      {
        name: "Journals only",
        what: "The Journal list holds the ten journals. Checking a journal moves the type to Journal publications, so preprints and book chapters leave the list; choosing Preprints or Book chapters clears the journals.",
      },
      {
        name: "Scroll",
        what: "The Journal list shows six rows, and the other four scroll inside the panel under a soft fade.",
      },
    ],
    settings: { layer: "journals" as Layer, list: "scroll" as ListLen },
  },

  forths: [
    {
      key: "stop" as Forth,
      name: "Its own stop",
      what: "The slider runs from 2019 to a last stop called Forthcoming, which holds the seven entries that have no year yet (five papers and two chapters).",
    },
    {
      key: "year" as Forth,
      name: "Counted in a year",
      what: "The five forthcoming papers count as 2026 and the two chapters as 2027, the year their citations give, so the slider runs from 2019 to 2027.",
    },
    {
      key: "toggle" as Forth,
      name: "A checkbox",
      what: "The slider runs from 2019 to 2026, and a checkbox under it, on at first, includes the seven forthcoming entries.",
    },
  ],

  order: {
    title: "The order of the journal list",
    what:
      "By prestige and impact factor, as I read it: Trends in Cognitive Sciences, Journal of Consumer Research, Journal of Marketing, " +
      "Journal of Marketing Research, Journal of Consumer Psychology, Research Policy, Journal of Experimental Psychology: General, " +
      "Journal of Advertising, European Journal of Marketing, Psychology & Marketing. Pin any journal that should move.",
  },

  pick: {
    settings: { place: "left" as Place, forth: "stop" as Forth, icons: "book" as Icons, types: "row" as Types },
    why:
      "My pick is today's type row with the Journal and Year buttons on its left, a book and a calendar on the two buttons, and " +
      "Forthcoming as the slider's last stop. A professor who visits reads every choice as a word, with no icon to decode; the two " +
      "icons only repeat what the words say. The Forthcoming stop keeps the seven entries without a year inside the range.",
  },

  phoneNote: "The phone view is the same page at 390 pixels. On a phone, each button opens its list as a dialog.",
};
