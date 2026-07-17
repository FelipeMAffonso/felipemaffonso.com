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
};

export default nextConfig;
