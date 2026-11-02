import Link from "next/link";
import { projects } from "@/content/projects";
import { getCoursePrice } from "@/content/pricing";
import type { Metadata } from "next";
import { freeChaptersLabel, projectBase } from "@/lib/project-paths";

export const metadata: Metadata = {
  title: "Proyek",
  description:
    "Proyek PyMula: bangun program Python yang nyata dalam Bahasa Indonesia, dengan latihan kode yang dicek otomatis di browser dan hint bertahap. Bab pertama gratis.",
  alternates: { canonical: "/proyek" },
};

export default function ProyekPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold text-ink">Proyek</h1>
      <p className="mt-2 text-ink-soft">Belajar dengan membangun sesuatu yang nyata.</p>
      <ul className="mt-8 space-y-4">
        {projects.map((p) => {
          const price = getCoursePrice(p.slug);
          const free = freeChaptersLabel(p.chapters);
          return (
            <li key={p.slug}>
              <Link href={projectBase(p.slug)} className="block rounded-lg border border-line bg-white/60 p-5 hover:bg-white">
                <p className="font-display text-xl font-semibold text-ink">{p.title}</p>
                <p className="mt-1 text-ink-soft">{p.tagline}</p>
                <p className="mt-3 text-xs text-ink-soft">
                  {free ? `${free} · ` : ""}Sekali bayar Rp{price.toLocaleString("id-ID")}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
