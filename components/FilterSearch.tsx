"use client";

// A search that lives in the filter row's own shell (the same border, surface and type as
// FilterRow and FilterButton). Closed, it is a "Search" button; a click opens it in place into a
// text field, the shell growing to hold it, with no pop-up (Felipe 2026-10-25: "no, i dont want
// panel ... figure out to do some way"). Escape or the close button clears it and folds it back.
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Search, X } from "lucide-react";
import { spring } from "@/lib/springs";

const GROW = { layout: { type: spring.moderate.type, duration: spring.moderate.duration, bounce: spring.moderate.bounce } };

export function FilterSearch({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { if (open) input.current?.focus(); }, [open]);
  const close = () => { onChange(""); setOpen(false); };

  return (
    <motion.div layout transition={GROW} className="pub-filter pub-filter-static fb-search-wrap">
      <motion.div layout transition={GROW} className={`pub-filter-seg pub-filter-search${open ? " open" : ""}`}>
        {open ? (
          <>
            <Search className="size-3.5 pub-filter-search-icon" aria-hidden="true" />
            <input
              ref={input}
              type="search"
              className="pub-filter-input"
              value={value}
              placeholder={placeholder}
              aria-label="Search the comments"
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Escape") close(); }}
            />
            <button type="button" className="pub-filter-btn pub-filter-action" aria-label="Close the search" onClick={close}
              data-cuelume-press="" data-cuelume-release="">
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </>
        ) : (
          <button type="button" className="pub-filter-btn pub-filter-action" onClick={() => setOpen(true)}
            data-cuelume-press="" data-cuelume-release="">
            <Search className="size-3.5" aria-hidden="true" />
            Search
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}
