"use client";

/* ============================================================
   Publications — the crown jewel.
   List (not cards) + the LOCKED expandable panel. One open at a
   time, page-wide. The win lives in the DYNAMICS: grid-rows
   expansion, synced chevron, subtle in-panel stagger, coral
   button hover, press feedback, and cuelume on open/close +
   button press/release. Static design is unchanged.
   ============================================================ */

import { useState, type CSSProperties, type KeyboardEvent } from "react";
import { preprints, journals, type Pub, type PubLink } from "@/lib/publications";
import { pubPosters } from "@/lib/posterConfigs";
import { useSound } from "@/lib/sound";
import { usePixelVariants } from "@/lib/pixelVariants";
import { PixelPoster } from "./PixelPoster";
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
  pub, index, open, onToggle, pressSounds,
}: {
  pub: Pub; index: number; open: boolean; onToggle: () => void; pressSounds: boolean;
}) {
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  };
  return (
    <li className={`pub-entry enter${open ? " open" : ""}`} style={{ "--enter-i": index } as CSSProperties}>
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
              {pub.cover && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="pub-cover"
                  src={pub.cover.src}
                  alt={pub.cover.alt}
                  width={pub.cover.w}
                  height={pub.cover.h}
                  style={pub.cover.style}
                  loading="lazy"
                />
              )}
              <p>{pub.abstract}</p>
            </div>
            {/* The pixel poster is a Felipe-approved appended block
                (2026-07-19); the locked elements above are unchanged. */}
            {pubPosters[pub.id] && (
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

export function PublicationsSections() {
  const [openId, setOpenId] = useState<string | null>(null);
  const { play } = useSound();
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
    />
  );

  return (
    <>
      <p className="pub-subtitle enter">Click any title for abstract and download options</p>

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
}
