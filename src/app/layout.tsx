import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ecotap.rw"),
  title: {
    default: "EcoTap — Smart NFC Business Cards",
    template: "%s | EcoTap",
  },
  description: "Digital business cards for companies and individuals. Tap, share, connect. Sustainable networking powered by NFC technology.",
  keywords: ["NFC business cards", "digital business cards", "sustainable networking", "Rwanda", "eco-friendly", "smart cards"],
  openGraph: {
    type: "website",
    locale: "en_RW",
    siteName: "EcoTap",
    title: "EcoTap — Smart NFC Business Cards",
    description: "Digital business cards for companies and individuals. Tap, share, connect.",
  },
  twitter: {
    card: "summary_large_image",
    title: "EcoTap — Smart NFC Business Cards",
    description: "Digital business cards for companies and individuals. Tap, share, connect.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-ivory text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
