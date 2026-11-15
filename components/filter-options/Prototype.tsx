"use client";

/* ============================================================
   Filter options review: the Publications list with the two-button
   filter (Journal and Year) beside the type buttons. The state and
   the rules that connect the three filters are in model.ts.
   ============================================================ */

import { useEffect, useState } from "react";
import { PublicationEntry } from "@/components/PublicationsSections";
import { FluidProvider } from "@/lib/fluid-provider";
import { Button } from "@/components/ui/button";
import { useSound } from "@/lib/sound";
import { ITEMS, KINDS } from "./data";
import {
  anyActive, initialState, pickType, shown, stops, toggleVenue, typeCounts, venueShort, yearActive, yearButtonText, yearDomain,
  type FilterState, type Settings,
} from "./model";
import { FilterMenu, ICON_PAIRS, MenuFooter, ResultLine, TypeMenu, TypeRow, TypeTabs, VenueChecks, YearRange } from "./Controls";

export function Prototype({ s }: { s: Settings }) {
  const [st, setSt] = useState<FilterState>(() => initialState(s.forth));
  const [openId, setOpenId] = useState<string | null>(null);
  const { play } = useSound();

  // a new rule starts from a clean slate
  useEffect(() => setSt(initialState(s.forth)), [s.forth, s.layer]);

  /* when a type or journal choice leaves the chosen years with no matching entry at all, the year
     range resets, because the slider's axis now holds only years the choice does not touch */
  useEffect(() => {
    if (!yearActive(st, s.forth)) return;
    const [a, b] = yearDomain(st, s.forth);
    if (st.hi < a || st.lo > b) setSt((x) => ({ ...x, lo: 0, hi: stops(s.forth).length - 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [st.kind, st.venues.join("|")]);

  const counts = typeCounts(st, s.forth);
  const items = shown(st, s.forth);
  const active = anyActive(st, s.forth);
  const total = ITEMS.length;
  const align = s.place === "right" ? "end" : "start";
  const word = s.layer === "journals" ? "Journal" : "Venue";

  /* every Clear (in the Journal list, in the Year slider, and Clear filters under the row) resets all
     three filters: All, all journals, all years (Felipe 2026-11-14: "if I click CLEAR it
     clears/defaults all factors ... even if I just clear the Journal") */
  const clearAll = () => setSt(initialState(s.forth));
  const anyChosen = active || st.kind !== "all";

  const venueLabel =
    st.venues.length === 0 ? word
      : st.venues.length === 1 ? venueShort(st.venues[0])
      : `${st.venues.length} ${s.layer === "journals" ? "journals" : "venues"}`;

  const pair = ICON_PAIRS[s.icons];
  const journalButton = (
    <FilterMenu
      label={venueLabel}
      icon={pair.journal}
      on={st.venues.length > 0}
      ariaLabel={s.layer === "journals" ? "Filter by journal" : "Filter by venue"}
      title={word}
      align={align}
      footer={(close) => <MenuFooter close={close} n={items.length} canClear={anyChosen} onClear={clearAll} />}
    >
      <VenueChecks st={st} s={s} onToggle={(v) => setSt(toggleVenue(st, v, s))} />
    </FilterMenu>
  );
  const yearButton = (
    <FilterMenu
      label={yearActive(st, s.forth) ? yearButtonText(st, s.forth) : "Year"}
      icon={pair.year}
      on={yearActive(st, s.forth)}
      ariaLabel="Filter by year"
      title="Year"
      align={align}
      // 540 spaces the years about 48px apart (Felipe 2026-11-14: "years more spaced out")
      width={540}
      footer={(close) => <MenuFooter close={close} n={items.length} canClear={anyChosen} onClear={clearAll} />}
    >
      <YearRange st={st} s={s} onRange={(lo, hi) => setSt({ ...st, lo, hi })} onIncF={(on) => setSt({ ...st, incF: on })} />
    </FilterMenu>
  );
  const buttons = <>{journalButton}{yearButton}</>;
  const onType = (k: Parameters<typeof pickType>[1]) => setSt(pickType(st, k, s));
  const typeRow =
    s.types === "row" ? <TypeRow kind={st.kind} counts={counts} onPick={onType} />
      : s.types === "menu" ? <TypeMenu kind={st.kind} counts={counts} onPick={onType} align={align} />
      : <TypeTabs kind={st.kind} counts={counts} onPick={onType} activeLabel={s.types === "active"} />;

  const row = (
    <div className={`pub-filter fo-row place-${s.place}`}>
      {s.types === "menu" ? (
        // three buttons read in order: what kind, which journal, which years
        <div className="fo-line">
          {s.place === "right" && <span className="fo-push" />}
          {typeRow}{buttons}
        </div>
      ) : s.place === "below" ? (
        <>
          <div className="fo-line">{typeRow}</div>
          <div className="fo-line fo-line2">{buttons}</div>
        </>
      ) : (
        <div className="fo-line">
          {s.place === "left" ? <>{buttons}{typeRow}</> : <>{typeRow}<span className="fo-push" />{buttons}</>}
        </div>
      )}
    </div>
  );

  const toggle = (id: string) =>
    setOpenId((prev) => {
      if (prev === id) { play("whisper"); return null; }
      play("bloom");
      return id;
    });

  let n = 0;
  const sig = `${st.kind}|${st.venues.join(",")}|${st.lo}-${st.hi}|${st.incF}`;

  return (
    <FluidProvider>
      <div className="fo-proto">
        {row}
        <ResultLine n={items.length} total={total} active={active} onClear={clearAll} />
        {items.length === 0 ? (
          <div className="fo-empty">
            <p>No publications match these filters.</p>
            <Button variant="secondary" size="compact" onClick={() => setSt(initialState(s.forth))}>Clear the filters</Button>
          </div>
        ) : (
          <div className="pub-sections" key={sig}>
            {KINDS.map((k) => {
              const these = items.filter((i) => i.kind === k.key);
              if (these.length === 0) return null;
              return (
                <section className="section" key={k.key}>
                  <h2 className="section-title">{k.title}</h2>
                  {k.key === "journal" && <p className="pub-note-sub"><em>*Denotes equal authorship</em></p>}
                  <ol className="pub-list">
                    {these.map((i) => (
                      <PublicationEntry
                        key={i.pub.id}
                        pub={i.pub}
                        index={n++}
                        open={openId === i.pub.id}
                        onToggle={() => toggle(i.pub.id)}
                        pressSounds
                      />
                    ))}
                  </ol>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </FluidProvider>
  );
}
