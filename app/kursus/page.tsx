import Link from "next/link";

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
          <p className="mt-4 font-mono text-sm text-ink">Rp25.000</p>
        </Link>
      </div>
    </section>
  );
}
