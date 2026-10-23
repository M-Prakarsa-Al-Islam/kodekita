import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import Farewell from "@/components/site/Farewell";
import EndNoticeModal from "@/components/site/EndNoticeModal";
import { SERVICE_END_ISO, SITE_NAME, SITE_URL, daysLeft, formatDateId, serviceState } from "@/lib/site-config";
import { Analytics } from "@vercel/analytics/next";

// The state of the service depends on the clock, so never bake it in at build time.
export const dynamic = "force-dynamic";

const DEFAULT_TITLE = "PyMula, Belajar Coding. Praktik. Bangun Sesuatu.";
const DESCRIPTION =
  "Belajar programming secara mandiri dalam Bahasa Indonesia dengan latihan coding langsung di browser dan proyek nyata.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Subpages become "Tentang & FAQ | PyMula"; the home page keeps the full title.
  title: { default: DEFAULT_TITLE, template: "%s | PyMula" },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  // Google's favicon rules: crawlable, a multiple of 48 px (or a square SVG), a stable URL.
  // favicon.ico holds 16/32/48 px; the PNGs are 96 and 192 px.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "192x192", type: "image/png" }],
  },
  // Link previews (WhatsApp, Telegram, LinkedIn, ...). No og:url here: it would be
  // inherited by every page; each indexable page sets its own canonical instead.
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "id_ID",
    title: DEFAULT_TITLE,
    description: DESCRIPTION,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "PyMula, belajar Python dalam Bahasa Indonesia" }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const now = new Date();
  const state = serviceState(now);

  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        {state === "ended" ? (
          // After the end date: only the farewell page, and no Supabase calls at all
          // (Header, pages and middleware all talk to Supabase, so none of them run).
          <Farewell />
        ) : (
          <>
            <Header />
            {state === "notice" && (
              <EndNoticeModal endLabel={formatDateId(SERVICE_END_ISO)} daysLeft={daysLeft(now)} />
            )}
            <main>{children}</main>
            <Footer />
          </>
        )}
        <Analytics />
      </body>
    </html>
  );
}
