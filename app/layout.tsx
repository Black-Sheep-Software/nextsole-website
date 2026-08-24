import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-Y350WLM4QG";
const SITE_URL = "https://nextsole.co.uk";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  verification: { google: "_eyvvFzi2kVIZqI-4dLmeRKrX007WXPUF-MtcmMmoq0" },
  title: "Nextsole — Sneaker Collection Tracker",
  description: "Track, value and manage your sneaker collection. Know what you own, what it's worth, and what to wear next.",
  keywords: ["sneaker collection", "sneaker tracker", "shoe collection", "Jordan tracker", "Nike collection", "sneakerhead", "deadstock", "resell value"],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE_URL,
    siteName: "Nextsole",
    title: "Nextsole — Sneaker Collection Tracker",
    description: "Track, value and manage your sneaker collection. Know what you own, what it's worth, and what to wear next.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Nextsole" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nextsole — Sneaker Collection Tracker",
    description: "Track, value and manage your sneaker collection.",
    images: ["/og-image.png"],
  },
  icons: { icon: "/icon-192.png", apple: "/icon-192.png" },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <head>
        {/* Inline gtag init in <head> so Google Search Console GA verification passes */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`,
          }}
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-full bg-neutral-950 text-white">
        {children}
      </body>
    </html>
  );
}
