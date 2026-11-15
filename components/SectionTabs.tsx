"use client";

// The site's tab row with an icon on every choice, where only the chosen one shows its name and
// count: Fluid Tabs with activeLabel, in the filter row's own shell (its border, surface and sticky
// place under the nav). Felipe chose it for the Publications type row on 2026-11-14 ("I want Only the
// chosen name") and asked for it on Teaching the same day ("apply the same tabsubtle idea we have in
// the publications one"). A hovered icon names its choice in a tooltip; the count of the chosen one
// sits after its name on the same baseline (--n, printed by app/fluid-additions.css, .section-tabs).
import { useEffect, useRef, useState, type ComponentType } from "react";
import { Tabs, TabsItem } from "@/components/ui/tabs";
import { FluidProvider } from "@/lib/fluid-provider";

export type SectionTab<K extends string> = {
  key: K;
  label: string;
  icon: ComponentType<{ className?: string }>;
  n?: number;
};

const NAV_H = 64;

export function SectionTabs<K extends string>({ items, value, onPick, ariaLabel, sticky = false }: {
  items: SectionTab<K>[]; value: K; onPick: (k: K) => void; ariaLabel: string; sticky?: boolean;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    if (!sticky) return;
    const onScroll = () => {
      const r = rowRef.current;
      if (r) setStuck(r.getBoundingClientRect().top <= NAV_H + 0.5);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sticky]);

  const at = Math.max(0, items.findIndex((i) => i.key === value));
  return (
    <div ref={rowRef} className={`pub-filter${sticky ? "" : " pub-filter-static"}${stuck ? " stuck" : ""}`}>
      <div className="pub-filter-seg section-tabs">
        <FluidProvider>
          <Tabs selectedIndex={at} onSelect={(i) => onPick(items[i].key)} activeLabel aria-label={ariaLabel}>
            {items.map((it, i) => (
              <TabsItem
                key={it.key}
                index={i}
                icon={it.icon}
                label={it.label}
                // the chosen tab's count, printed at the end of its name's own text (fluid-additions.css),
                // so the two share one baseline; the tab measures that text, count included
                style={i === at && it.n !== undefined ? ({ ["--n" as string]: `"${it.n}"` }) : undefined}
                title={i === at ? undefined : it.n !== undefined ? `${it.label} (${it.n})` : it.label}
              />
            ))}
          </Tabs>
        </FluidProvider>
      </div>
    </div>
  );
}
