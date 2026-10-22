import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import Farewell from "@/components/site/Farewell";
import EndNoticeModal from "@/components/site/EndNoticeModal";
import { SERVICE_END_ISO, daysLeft, formatDateId, serviceState } from "@/lib/site-config";
import { Analytics } from "@vercel/analytics/next";

// The state of the service depends on the clock, so never bake it in at build time.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "PyMula, Belajar Coding. Praktik. Bangun Sesuatu.",
  description:
    "Belajar programming secara mandiri dalam Bahasa Indonesia dengan latihan coding langsung di browser dan proyek nyata.",
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
