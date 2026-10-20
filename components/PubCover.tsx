/* ============================================================
   PubCover: the journal or book cover inside an open publication
   panel, the plain locked cover (float-wrap beside the abstract).
   From 2026-07-19 this slot showed an animated pixel story that
   flipped to the cover on click; Felipe removed the stories on
   2026-10-20 ("remove all pixel ones. keep only journal and book
   covers"). The last versions of the stories are kept on the
   branch pixel-stories-tics-chapters. An entry with no cover
   (the book chapters) shows nothing here.
   ============================================================ */

import type { Cover } from "@/lib/publications";

export function PubCover({ cover }: { cover: Cover; pubId?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="pub-cover"
      src={cover.src}
      alt={cover.alt}
      width={cover.w}
      height={cover.h}
      style={cover.style}
      loading="lazy"
    />
  );
}
