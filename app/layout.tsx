import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@fontsource/ultra"; // slab serif for pixel-poster titles, self-hosted
import "@fontsource/alfa-slab-one"; // ADJUDICATION ONLY: candidate B; loser is removed at bake
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Nav } from "@/components/Nav";
import { CvFrame } from "@/components/CvFrame";
import { FooterLine } from "@/components/FooterLine";

const SITE_DESCRIPTION =
  "Felipe M. Affonso. Assistant Professor of Marketing at Oklahoma State University. Research on consumer decision-making, human-technology interactions, and health/environmental policy.";

export const metadata: Metadata = {
  metadataBase: new URL("https://felipemaffonso.com"),
  title: {
    default: "Felipe M. Affonso",
    template: "%s | Felipe M. Affonso",
  },
  description: SITE_DESCRIPTION,
  icons: { icon: "/favicon.svg" },
  alternates: { canonical: "/" },
  verification: {
    // preserved exactly — losing this drops Google Search Console ownership
    google: "x66T2PCnYUqNbY4DC-jw_Y0M7glCv8RBEzie2C69vps",
  },
};

// Microsoft Clarity — preserved exactly (project wexegoktgd)
const CLARITY_SCRIPT = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "wexegoktgd");`;

// ADJUDICATION ONLY: apply stored pixel-variant CSS axes before first
// paint so a hard reload keeps the chosen look with no flash. Mirrors
// PIXEL_CSS_AXES in lib/pixelVariants.tsx; removed at bake.
const PIXEL_VARIANT_SCRIPT = `(function(){try{var d=JSON.parse(localStorage.getItem("pixel-variants")||"{}");var a={posterfont:["ultra","alfa"],pubposters:["on","off"],teachingposter:["on","off"],spears:["scan","still","led","pixelart"],navhover:["gradient","cells"]};for(var k in a){var v=d[k];if(a[k].indexOf(v)>-1){document.documentElement.setAttribute("data-"+k,v)}}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body>
        {/* The CV is always fetched up front so opening or downloading it is
            instant: the self-hosted PDF is prefetched and the Drive viewer
            origin is preconnected on every page. */}
        <link rel="prefetch" href="/files/cv.pdf" />
        <link rel="preconnect" href="https://drive.google.com" />

        {/* analytics: rendered into the static HTML */}
        <script dangerouslySetInnerHTML={{ __html: CLARITY_SCRIPT }} />
        {/* pixel-variant pre-paint (adjudication only) */}
        <script dangerouslySetInnerHTML={{ __html: PIXEL_VARIANT_SCRIPT }} />

        <Providers>
          <Nav />
          {children}
          <footer className="footer-line">
            <FooterLine />
          </footer>
          {/* The single persistent CV viewer, warmed on every page. */}
          <CvFrame />
        </Providers>

        {/* Cloudflare Web Analytics — preserved exactly */}
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "db16777525f64d0abb899762c3c29b9c"}'
        />
      </body>
    </html>
  );
}
