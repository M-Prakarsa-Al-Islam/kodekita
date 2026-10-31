import Link from "next/link";
import { projects } from "@/content/projects";
import { getCoursePrice } from "@/content/pricing";
import { projectBase } from "@/lib/project-paths";

// noindex until Phase 4 (SEO): then add "/proyek" (and each project page) to
// INDEXABLE_PATHS in lib/seo.ts, update scripts/test-seo.mjs, and drop the robots line.
export const metadata = { title: "Proyek", robots: { index: false } };

function freeLabel(chapters: { order: number; isFree: boolean }[]): string | null {
  const free = chapters.filter((c) => c.isFree).map((c) => c.order);
  if (!free.length) return null;
  const lo = Math.min(...free), hi = Math.max(...free);
  return lo === hi ? `Bab ${lo} gratis` : `Bab ${lo}–${hi} gratis`;
}

export default function ProyekPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold text-ink">Proyek</h1>
      <p className="mt-2 text-ink-soft">Belajar dengan membangun sesuatu yang nyata.</p>
      <ul className="mt-8 space-y-4">
        {projects.map((p) => {
          const price = getCoursePrice(p.slug);
          const free = freeLabel(p.chapters);
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
