/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export (GitHub Pages compatible, no server runtime)
  output: 'export',
  // Emit /research/index.html so URLs keep their trailing slash, matching the 11ty site
  trailingSlash: true,
  // GitHub Pages has no image optimizer; ship images as-is
  images: { unoptimized: true },
  // Fail the build on type errors rather than shipping broken output
  typescript: { ignoreBuildErrors: false },
  // The build's moment, written into the pages, so a temporary publication link (lib/publications.tsx,
  // PubLink.temporary) renders the same in the static HTML and in the browser's first render
  env: { SITE_BUILT_AT: String(Date.now()) },
};

export default nextConfig;
