import type { Metadata } from "next";
import { PageBanner } from "@/components/PageBanner";
import { PixelLab } from "@/components/PixelLab";

/* ADJUDICATION ONLY: the pixel-poster showroom. Not in the nav, not
   in the sitemap, noindex. Deleted at bake with the switcher. */

export const metadata: Metadata = {
  title: "Pixel Lab",
  robots: { index: false, follow: false },
};

export default function PixelLabPage() {
  return (
    <>
      <PageBanner title="Pixel Lab" />
      <PixelLab />
    </>
  );
}
