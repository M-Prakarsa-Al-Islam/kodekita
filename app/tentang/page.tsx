export const metadata = { title: "Tentang" };

// TEMPORARY placeholder so the "Tentang" menu link is not a 404. The real page
// (what PyMula is, who runs it, service status, refund rules, FAQ) is planned.
export default function TentangPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold text-ink">Tentang</h1>
      <p className="mt-2 text-ink-soft">PyMula, belajar Python dalam Bahasa Indonesia.</p>
      <p className="mt-8 rounded-lg border border-line bg-white/60 p-6 text-sm text-ink-soft">
        Halaman ini sedang disusun.
      </p>
    </section>
  );
}
