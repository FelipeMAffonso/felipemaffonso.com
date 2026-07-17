import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Nav } from "@/components/Nav";

const SITE_DESCRIPTION =
  "Felipe M. Affonso — Assistant Professor of Marketing at Oklahoma State University. Research on consumer decision-making, human-technology interactions, and health/environmental policy.";

export const metadata: Metadata = {
  metadataBase: new URL("https://felipemaffonso.com"),
  title: {
    default: "Felipe M. Affonso",
    template: "%s — Felipe M. Affonso",
  },
  description: SITE_DESCRIPTION,
  icons: { icon: "/favicon.svg" },
  verification: {
    // preserved exactly — losing this drops Google Search Console ownership
    google: "x66T2PCnYUqNbY4DC-jw_Y0M7glCv8RBEzie2C69vps",
  },
};

// Pre-paint: apply variant data-attributes from ?query so entrance/nav/
// accordion variants render with no flash. (Dev/adjudication only.)
const VARIANT_SCRIPT = `(function(){try{var p=new URLSearchParams(location.search);var d=document.documentElement;var m={nav:['underline','pill','slide'],accordion:['crisp','soft'],entrance:['stagger','fade','none']};for(var k in m){var v=p.get(k);if(v&&m[k].indexOf(v)>=0){d.setAttribute('data-'+k,v);}}}catch(e){}})();`;

// Microsoft Clarity — preserved exactly (project wexegoktgd)
const CLARITY_SCRIPT = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "wexegoktgd");`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body>
        {/* pre-paint variant + analytics: rendered into the static HTML */}
        <script dangerouslySetInnerHTML={{ __html: VARIANT_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: CLARITY_SCRIPT }} />

        <Providers>
          <Nav />
          {children}
          <footer className="footer-line">
            <div className="footer-line-inner" />
          </footer>
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
