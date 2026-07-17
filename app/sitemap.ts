import type { MetadataRoute } from "next";

// required for `output: 'export'` so /sitemap.xml is emitted statically
export const dynamic = "force-static";

const BASE = "https://felipemaffonso.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ["/", "/research/", "/teaching/", "/cv/", "/contact/"];
  return routes.map((path) => ({
    url: BASE + path,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
