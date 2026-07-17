import type { MetadataRoute } from "next";

// required for `output: 'export'` so /robots.txt is emitted statically
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://felipemaffonso.com/sitemap.xml",
    host: "https://felipemaffonso.com",
  };
}
