import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@fontsource/alfa-slab-one"; // the poster-title slab serif, self-hosted
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
