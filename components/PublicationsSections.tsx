"use client";

/* ============================================================
   Publications — the crown jewel.
   List (not cards) + the LOCKED expandable panel. One open at a
   time, page-wide. The win lives in the DYNAMICS: grid-rows
   expansion, synced chevron, subtle in-panel stagger, coral
   button hover, press feedback, and cuelume on open/close +
   button press/release. Static design is unchanged.

   ADJUDICATION LAYER (Felipe 2026-07-19, all behind variants):
   - covers=cycle: the cover inside the panel is the click-to-
     cycle artifact (real cover / pixel cover / motif), PubCover.
   - pubposters=on: the pixel poster appended after the abstract.
   - reslayout: list (default, the locked look) · rail (a sticky
     left art rail that follows whichever paper is open; desktop
     only, stacks back to the plain list on mobile) · gallery
     (a quiet List | Posters toggle; the poster wall opens the
     paper back in list mode). The clean list is always the
     fallback; the locked panel anatomy is never altered.
   ============================================================ */

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { preprints, journals, type Pub, type PubLink } from "@/lib/publications";
import { pubPosters } from "@/lib/posterConfigs";
import { useSound } from "@/lib/sound";
import { usePixelVariants } from "@/lib/pixelVariants";
import { PixelPoster } from "./PixelPoster";
import { PubCover } from "./PubCover";
import {
  JournalIcon, DownloadIcon, OsfIcon, GitHubGlyph, ArxivIcon, PsyArxivIcon, SsrnIcon,
} from "./icons";
import {
  PixelJournalPixIcon, PixelDownloadPixIcon, PixelOsfPixIcon, PixelGitHubPixIcon,
  PixelArxivPixIcon, PixelPsyArxivPixIcon, PixelSsrnPixIcon,
} from "./pixelIcons";

/* icons=pixel is an ADJUDICATION variant Felipe asked to judge here
   (2026-07-19); the locked default remains the brand set. */
function LinkIcon({ kind }: { kind: PubLink["kind"] }) {
  const { icons } = usePixelVariants();
  if (icons === "pixel") {
    switch (kind) {
      case "journal": return <PixelJournalPixIcon />;
      case "download": return <PixelDownloadPixIcon />;
      case "osf": return <PixelOsfPixIcon />;
      case "github": return <PixelGitHubPixIcon />;
      case "arxiv": return <PixelArxivPixIcon />;
      case "psyarxiv": return <PixelPsyArxivPixIcon />;
      case "ssrn": return <PixelSsrnPixIcon />;
    }
  }
  switch (kind) {
    case "journal": return <JournalIcon />;
    case "download": return <DownloadIcon />;
    case "osf": return <OsfIcon />;
    case "github": return <GitHubGlyph />;
    case "arxiv": return <ArxivIcon />;
    case "psyarxiv": return <PsyArxivIcon />;
    case "ssrn": return <SsrnIcon />;
  }
}

function ActionButton({ link, pressSounds }: { link: PubLink; pressSounds: boolean }) {
  const isDownload = link.kind === "download" || link.download;
  const soundAttrs: Record<string, string> = pressSounds
    ? { "data-cuelume-press": "", "data-cuelume-release": "" }
    : {};
  const linkAttrs: React.AnchorHTMLAttributes<HTMLAnchorElement> = isDownload
    ? { download: true }
    : { target: "_blank", rel: "noopener" };
  return (
    <a href={link.href} className="pub-link" {...linkAttrs} {...soundAttrs}>
      <LinkIcon kind={link.kind} />
      <div>
        <div className="pub-link-label">{link.label}</div>
        <div className="pub-link-desc">{link.desc}</div>
      </div>
    </a>
  );
}

function PublicationEntry({
  pub, index, open, onToggle, pressSounds, showPoster,
}: {
  pub: Pub; index: number; open: boolean; onToggle: () => void; pressSounds: boolean;
  showPoster: boolean;
}) {
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  };
  return (
    <li
      id={`pub-${pub.id}`}
      className={`pub-entry enter${open ? " open" : ""}`}
      style={{ "--enter-i": index } as CSSProperties}
    >
      <div
        className="pub-citation"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={onToggle}
        onKeyDown={onKey}
      >
        <span className="pub-text">{pub.citation}</span>
        <svg className="pub-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
      </div>
      <div className="pub-detail">
        <div className="pub-detail-inner">
          <div className="pub-detail-pad">
            {pub.links && pub.links.length > 0 && (
              <div className="pub-links">
                {pub.links.map((l) => (
                  <ActionButton key={l.href} link={l} pressSounds={pressSounds} />
                ))}
              </div>
            )}
            <div className="pub-abstract">
              {pub.cover && <PubCover cover={pub.cover} pubId={pub.id} />}
              <p>{pub.abstract}</p>
            </div>
            {/* The pixel poster is a Felipe-approved appended block
                (2026-07-19); the locked elements above are unchanged. */}
            {showPoster && pubPosters[pub.id] && (
              <div className="pub-poster">
                <PixelPoster
                  spec={pubPosters[pub.id].spec}
                  cols={pubPosters[pub.id].cols}
                  rows={pubPosters[pub.id].rows}
                  title={pubPosters[pub.id].title}
                  caption={pubPosters[pub.id].caption}
                  active={open}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

const IDLE_RAIL = {
  spec: {
    engine: "spark" as const,
    seed: 91,
    params: { rate: 0.1, thresh: 0.982 },
    colors: ["#8b9099", "#d9a441", "#DA7756", "#f4e9d6"],
  },
  cols: 15,
  rows: 19,
};

export function PublicationsSections() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [galleryView, setGalleryView] = useState<"list" | "posters">("list");
  const { play } = useSound();
  const { reslayout } = usePixelVariants();
  const listRef = useRef<HTMLDivElement>(null);
  const pressSounds = true;

  const toggle = (id: string) => {
    setOpenId((prev) => {
      if (prev === id) {
        play("whisper"); // collapse / go back
        return null;
      }
      play("bloom"); // reveal / expand
      return id;
    });
  };

  const allPubs = [...preprints, ...journals];
  const openPub = allPubs.find((p) => p.id === openId) ?? null;
  const rail = reslayout === "rail";
  const gallery = reslayout === "gallery";
  /* in rail mode the rail carries the art, so the in-panel poster
     block steps aside (pubposters=off also hides it, via CSS) */
  const showPanelPoster = !rail;

  const openFromGallery = (id: string) => {
    setGalleryView("list");
    setOpenId(id);
    play("bloom");
    window.setTimeout(() => {
      document.getElementById(`pub-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 60);
  };

  // page-wide index so the entrance stagger flows down both sections
  let i = 0;
  const render = (pub: Pub) => (
    <PublicationEntry
      key={pub.id}
      pub={pub}
      index={i++}
      open={openId === pub.id}
      onToggle={() => toggle(pub.id)}
      pressSounds={pressSounds}
      showPoster={showPanelPoster}
    />
  );

  const listBody = (
    <>
      <section className="section">
        <h2 className="section-title enter">Preprints</h2>
        <ol className="pub-list">{preprints.map(render)}</ol>
      </section>

      <section className="section">
        <h2 className="section-title enter">Journal Publications</h2>
        <p className="pub-note-sub enter"><em>*Denotes equal authorship</em></p>
        <ol className="pub-list">{journals.map(render)}</ol>
      </section>
    </>
  );

  const railPoster = openPub && pubPosters[openPub.id];

  return (
    <>
      <p className="pub-subtitle enter">Click any title for abstract and download options</p>

      {gallery && (
        <div className="res-seg enter" role="group" aria-label="Research view">
          {(["list", "posters"] as const).map((v) => (
            <button
              key={v}
              type="button"
              className={galleryView === v ? "is-on" : undefined}
              aria-pressed={galleryView === v}
              onClick={() => {
                if (galleryView !== v) play("tick");
                setGalleryView(v);
              }}
            >
              {v === "list" ? "List" : "Posters"}
            </button>
          ))}
        </div>
      )}

      {gallery && galleryView === "posters" ? (
        <div className="res-wall">
          {allPubs.map((p) =>
            pubPosters[p.id] ? (
              <button
                key={p.id}
                type="button"
                className="res-wall-item"
                aria-label={`Open ${pubPosters[p.id].title} in the list`}
                onClick={() => openFromGallery(p.id)}
              >
                <PixelPoster
                  spec={pubPosters[p.id].spec}
                  cols={pubPosters[p.id].cols}
                  rows={pubPosters[p.id].rows}
                  title={pubPosters[p.id].title}
                  caption={pubPosters[p.id].caption}
                />
              </button>
            ) : null,
          )}
        </div>
      ) : rail ? (
        <div className="res-two">
          <aside className="res-rail" aria-live="polite">
            {railPoster ? (
              <PixelPoster
                key={openPub!.id}
                spec={railPoster.spec}
                cols={railPoster.cols}
                rows={railPoster.rows}
                title={railPoster.title}
                caption={railPoster.caption}
              />
            ) : (
              <PixelPoster
                key="idle"
                spec={IDLE_RAIL.spec}
                cols={IDLE_RAIL.cols}
                rows={IDLE_RAIL.rows}
                title="Research"
                caption="Open any paper and its motif appears here"
              />
            )}
          </aside>
          <div className="res-list" ref={listRef}>{listBody}</div>
        </div>
      ) : (
        listBody
      )}
    </>
  );
}
