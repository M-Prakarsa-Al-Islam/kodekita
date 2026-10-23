// noindex while this is only a placeholder; add it to INDEXABLE_PATHS (lib/seo.ts)
// and remove the robots line once the real Proyek page exists.
export const metadata = { title: "Proyek", robots: { index: false } };

export default function ProyekPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold text-ink">Proyek</h1>
      <p className="mt-2 text-ink-soft">Belajar dengan membangun sesuatu yang nyata.</p>
      <p className="mt-8 rounded-lg border border-line bg-white/60 p-6 text-sm text-ink-soft">
        Kelas proyek sedang disiapkan. Untuk sekarang, mulai dari kursus Python Dasar.
      </p>
    </section>
  );
}
