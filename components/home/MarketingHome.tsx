import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import { chapters } from "@/content/chapters";

export default function MarketingHome() {
  const freePreview = chapters.filter((c) => c.isFree).slice(0, 5);

  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-5xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
        <div>
          <h1 className="font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
            Belajar coding. Praktik. Bangun sesuatu.
          </h1>
          <p className="mt-4 max-w-md text-ink-soft">
            Belajar programming secara mandiri, dalam Bahasa Indonesia — langsung
            menulis dan menjalankan kode di browser, bukan hanya membaca teori.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="/register">Mulai Belajar Gratis</LinkButton>
            <LinkButton href="/kursus" variant="ghost">
              Lihat Kursus
            </LinkButton>
          </div>
          <p className="mt-3 text-xs text-ink-soft">
            Chapter 1–5 gratis. Tidak perlu kartu kredit.
          </p>
        </div>

        {/* Code panel: the product's actual loop, not a generic graphic */}
        <div className="overflow-hidden rounded-lg border border-line bg-ink shadow-sm">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="ml-2 text-xs text-white/50">chapter_2_variabel.py</span>
          </div>
          <pre className="overflow-x-auto px-4 py-4 font-mono text-sm leading-relaxed text-white">
            <code>{`nama = "Sari"
umur = 21

print(f"Halo, {nama}!")
print(f"Umur kamu {umur} tahun.")

# Coba ubah nilai umur, lalu jalankan lagi`}</code>
          </pre>
          <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
            <span className="text-xs text-white/50">Teori → Kuis / Latihan Kode</span>
            <span className="rounded bg-code px-3 py-1 text-xs font-medium text-white">
              Jalankan
            </span>
          </div>
        </div>
      </section>

      {/* Free chapter preview - gated */}
      <section className="border-t border-line bg-white/40">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="font-display text-2xl font-semibold text-ink">
            Chapter gratis yang bisa kamu coba
          </h2>
          <p className="mt-2 text-sm text-ink-soft">
            Masuk atau daftar untuk membuka chapter 1–5 secara gratis.
          </p>

          <ol className="mt-6 divide-y divide-line rounded-lg border border-line bg-white">
            {freePreview.map((chapter) => (
              <li key={chapter.slug} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm text-ink-soft">Chapter {chapter.order}</p>
                  <p className="font-display text-base font-medium text-ink">
                    {chapter.title}
                  </p>
                </div>
                <span className="text-xs text-ink-soft">🔒 Masuk untuk mencoba</span>
              </li>
            ))}
          </ol>

          <LinkButton href="/register" className="mt-6">
            Daftar Gratis
          </LinkButton>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-display text-2xl font-semibold text-ink">
          Cara belajarnya
        </h2>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {[
            ["Teori", "Penjelasan singkat dan satu contoh kode nyata, tanpa teori berlebihan."],
            ["Kuis", "Cek pemahaman konsep dengan pertanyaan singkat."],
            ["Latihan Kode", "Tulis dan jalankan kode sendiri di browser, dapat feedback langsung."],
          ].map(([title, desc]) => (
            <div key={title}>
              <p className="font-mono text-sm text-code">{title}</p>
              <p className="mt-2 text-sm text-ink-soft">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="font-display text-2xl font-semibold text-ink">
            Mulai dari mana saja
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-line bg-white/60 p-6">
              <p className="font-display text-lg font-semibold text-ink">Python Dasar</p>
              <p className="mt-2 text-sm text-ink-soft">
                13 chapter dari nol sampai paham struktur data dasar. Chapter 1–5
                gratis, chapter 6–13 dengan sekali bayar.
              </p>
              <p className="mt-4 font-mono text-sm text-ink">Rp25.000</p>
            </div>
            <div className="rounded-lg border border-line bg-white/60 p-6">
              <p className="font-display text-lg font-semibold text-ink">Proyek</p>
              <p className="mt-2 text-sm text-ink-soft">
                Sudah paham dasar? Bangun program kecil yang nyata, dengan hint
                bertahap — bukan copy-paste solusi.
              </p>
              <p className="mt-4 font-mono text-sm text-ink">mulai Rp10.000</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
