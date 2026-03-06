import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "API Documentation — IPGEO.API",
  description:
    "Full API reference for IPGEO.API. Endpoints, request parameters, response fields, code examples in JavaScript, Python, PHP and cURL, and error codes.",

  metadataBase: new URL("https://ip-geo-phi.vercel.app"),

  openGraph: {
    title:       "API Documentation — IPGEO.API",
    description:
      "Complete reference docs for the IPGEO.API geolocation REST API. Endpoints, fields, code examples and error codes.",
    url:         "https://ip-geo-phi.vercel.app/docs",
    siteName:    "IPGEO.API",
    locale:      "en_US",
    type:        "website",
    images: [
      {
        url:    "/og-docs.png",   // place a 1200×630 image in /public
        width:  1200,
        height: 630,
        alt:    "IPGEO.API Documentation",
      },
    ],
  },

  twitter: {
    card:        "summary_large_image",
    title:       "API Documentation — IPGEO.API",
    description:
      "Full reference docs for IPGEO.API. Endpoints, fields, code examples and error codes.",
    images:      ["/og-docs.png"],
  },

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

  alternates: {
    canonical: "https://ip-geo-phi.vercel.app/docs",
  },

  keywords: [
    "ip geolocation api docs",
    "ip api documentation",
    "ip lookup api reference",
    "geoip rest api",
    "ip address api endpoints",
    "free geolocation api",
    "ip api javascript",
    "ip api python",
  ],

  authors:  [{ name: "IPGEO.API" }],
  category: "Developer Tools",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <main>
              {children}
            </main>
      </body>
    </html>
  );
}
