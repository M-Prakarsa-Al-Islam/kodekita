import type { Metadata } from "next";
import Link from "next/link";
import { SERVICE_END_ISO, formatDateId } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Kursus",
  description: "Kursus PyMula: Python Dasar dalam Bahasa Indonesia, 13 chapter dari nol dengan latihan kode langsung di browser. Chapter 1-5 gratis.",
  alternates: { canonical: "/kursus" },
};

export default function KursusPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold text-ink">Kursus</h1>
      <p className="mt-2 text-ink-soft">Mulai dari yang paling dasar.</p>

      <div className="mt-8">
        <Link
          href="/kursus/python-dasar"
          className="block rounded-lg border border-line bg-white/60 p-6 hover:border-code"
        >
          <p className="font-display text-lg font-semibold text-ink">
            Python Dasar
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            13 chapter dari nol sampai paham struktur data dasar. Chapter
            1–5 gratis.
          </p>
          <p className="mt-4 font-mono text-sm text-ink">Rp20.000</p>
          <p className="mt-1 text-xs text-ink-soft">
            Akses berlaku selama PyMula berjalan, direncanakan paling lama sampai {formatDateId(SERVICE_END_ISO)}.
          </p>
        </Link>
      </div>
    </section>
  );
}
