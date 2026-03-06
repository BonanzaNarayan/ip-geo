import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "IPGEO.API — Free IP Geolocation API",
  description:
    "Instant IP geolocation for developers. Get country, city, region, coordinates, ISP, timezone and more. One REST endpoint. Zero auth. Free forever.",

  metadataBase: new URL("https://ip-geo-backend.onrender.com"),

  // ── Open Graph (Facebook, LinkedIn, WhatsApp, Slack previews) ──────────────
  openGraph: {
    title:       "IPGEO.API — Free IP Geolocation API",
    description:
      "Instant IP geolocation for developers. Country, city, coordinates, ISP and more. One endpoint. Zero auth. Free forever.",
    url:         "https://ip-geo-backend.onrender.com",
    siteName:    "IPGEO.API",
    locale:      "en_US",
    type:        "website",
    images: [
      {
        url:    "/og-home.png",   // place a 1200×630 image in /public
        width:  1200,
        height: 630,
        alt:    "IPGEO.API — Free IP Geolocation API",
      },
    ],
  },

  // ── Twitter / X card ────────────────────────────────────────────────────────
  twitter: {
    card:        "summary_large_image",
    title:       "IPGEO.API — Free IP Geolocation API",
    description:
      "Instant IP geolocation. Country, city, coordinates, ISP and more. One endpoint. Zero auth. Free.",
    images:      ["/og-home.png"],
    // creator:  "@yourhandle",   // uncomment and fill in if you have one
  },

  // ── Search engine directives ─────────────────────────────────────────────────
  robots: {
    index:             true,
    follow:            true,
    googleBot: {
      index:           true,
      follow:          true,
      "max-image-preview":  "large",
      "max-snippet":        -1,
      "max-video-preview":  -1,
    },
  },

  // ── Canonical ────────────────────────────────────────────────────────────────
  alternates: {
    canonical: "https://ip-geo-backend.onrender.com",
  },

  // ── Extra meta tags ──────────────────────────────────────────────────────────
  keywords: [
    "ip geolocation api",
    "free ip api",
    "ip lookup",
    "ip address location",
    "ip to country",
    "ip to city",
    "rest api geolocation",
    "geoip api free",
    "ip timezone api",
    "ip isp lookup",
  ],

  authors:  [{ name: "IPGEO.API" }],
  category: "Developer Tools",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      ><ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <main>
              {children}
            </main>
          </ThemeProvider>
      </body>
    </html>
  );
}
