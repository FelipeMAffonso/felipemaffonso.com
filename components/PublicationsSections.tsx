"use client";

/* ============================================================
   Publications — the crown jewel.
   List (not cards) + the LOCKED expandable panel. One open at a
   time, page-wide. The win lives in the DYNAMICS: grid-rows
   expansion, synced chevron, subtle in-panel stagger, coral
   button hover, press feedback, and cuelume on open/close +
   button press/release. Static design is unchanged.

   ADJUDICATION LAYER (Felipe 2026-07-19, behind variants):
   - covers=cycle (default): the cover slot shows the paper's
     pixel STORY; clicking flips to the real journal cover.
   - resheader: a minimal horizontal research card at the top of
     the list (banner / strip / mini / off).
   - reslayout: list (default) · rail (sticky-free art rail that
     ALIGNS to the open paper) · gallery (List | Posters wall).
   - pubposters=on restores the old in-panel poster block.
   The clean list is always the fallback; the locked panel
   anatomy is never altered.
   ============================================================ */

import { useEffect, useState, type CSSProperties, type KeyboardEvent } from "react";
import { preprints, journals, type Pub, type PubLink } from "@/lib/publications";
import { pubPosters, idlePoster } from "@/lib/posterConfigs";
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

/* icons=pixel is an ADJUDICATION variant; the default is brand. */
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
  const cfg = pubPosters[pub.id];
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
            {/* pubposters=on restores the appended poster block below
                the locked anatomy (off by default: the story lives in
                the cover slot now). */}
            {showPoster && cfg && (
              <div className="pub-poster">
                <PixelPoster
                  story={cfg.story}
                  spec={cfg.spec}
                  cols={cfg.cols}
                  rows={cfg.rows}
                  title={cfg.title}
                  caption={cfg.caption}
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

/* the minimal research header card (resheader axis) */
function ResearchHeader() {
  const { resheader } = usePixelVariants();
  if (resheader === "off") return null;
  if (resheader === "strip") {
    return (
      <div className="res-header res-header-strip enter">
        <PixelPoster
          spec={{ engine: "spark", seed: 97, params: { rate: 0.1, thresh: 0.985 }, colors: idlePoster.spec!.colors }}
          cols={46}
          rows={4}
          title=""
          caption=""
          className="poster-bare"
        />
      </div>
    );
  }
  if (resheader === "mini") {
    return (
      <div className="res-header res-header-mini enter">
        <PixelPoster
          spec={{ engine: "spark", seed: 97, params: { rate: 0.11, thresh: 0.982 }, colors: idlePoster.spec!.colors }}
          cols={24}
          rows={6}
          title="Research"
          caption=""
          className="poster-compact"
        />
      </div>
    );
  }
  return (
    <div className="res-header res-header-banner enter">
      <PixelPoster
        spec={{ engine: "spark", seed: 97, params: { rate: 0.11, thresh: 0.982 }, colors: idlePoster.spec!.colors }}
        cols={46}
        rows={7}
        title="Research"
        caption="Consumer judgment, human-AI interaction, and policy"
        className="poster-compact"
      />
    </div>
  );
}

export function PublicationsSections() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [galleryView, setGalleryView] = useState<"list" | "posters">("list");
  const [railY, setRailY] = useState(0);
  const { play } = useSound();
  const { reslayout, pubposters } = usePixelVariants();
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
  const showPanelPoster = pubposters === "on" && !rail;

  /* rail alignment: the card slides to sit level with the open
     citation (Felipe: the fixed-top card read as misaligned) */
  useEffect(() => {
    if (!rail) return;
    const measure = () => {
      if (!openId) { setRailY(0); return; }
      const entry = document.getElementById(`pub-${openId}`);
      const cont = document.querySelector(".res-two");
      if (!entry || !cont) return;
      const y = entry.getBoundingClientRect().top - cont.getBoundingClientRect().top;
      setRailY(Math.max(0, y));
    };
    /* after the 240ms panel expansion settles */
    const t1 = window.setTimeout(measure, 60);
    const t2 = window.setTimeout(measure, 320);
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("resize", measure);
    };
  }, [rail, openId]);

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

  const railCfg = openPub ? pubPosters[openPub.id] : null;

  return (
    <>
      {!rail && !gallery && <ResearchHeader />}
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
          {allPubs.map((p) => {
            const cfg = pubPosters[p.id];
            return cfg ? (
              <button
                key={p.id}
                type="button"
                className="res-wall-item"
                aria-label={`Open ${cfg.title} in the list`}
                onClick={() => openFromGallery(p.id)}
              >
                <PixelPoster
                  story={cfg.story}
                  spec={cfg.spec}
                  cols={cfg.cols}
                  rows={cfg.rows}
                  title={cfg.title}
                  caption={cfg.caption}
                />
              </button>
            ) : null;
          })}
        </div>
      ) : rail ? (
        <div className="res-two">
          <aside className="res-rail" aria-live="polite">
            <div className="res-rail-card" style={{ transform: `translateY(${railY}px)` }}>
              {railCfg ? (
                <PixelPoster
                  key={openPub!.id}
                  story={railCfg.story}
                  spec={railCfg.spec}
                  cols={railCfg.cols}
                  rows={railCfg.rows}
                  title={railCfg.title}
                  caption={railCfg.caption}
                />
              ) : (
                <PixelPoster
                  key="idle"
                  spec={idlePoster.spec}
                  cols={idlePoster.cols}
                  rows={idlePoster.rows}
                  title={idlePoster.title}
                  caption={idlePoster.caption}
                />
              )}
            </div>
          </aside>
          <div className="res-list">{listBody}</div>
        </div>
      ) : (
        listBody
      )}
    </>
  );
}
