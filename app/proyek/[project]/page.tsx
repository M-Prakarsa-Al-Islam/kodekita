import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getProjectLessons } from "@/content/projects";
import { getCompletedLessonKeys, lessonKey } from "@/lib/progress-server";
import { hasApprovedPurchase } from "@/lib/purchase-server";
import { getCoursePrice } from "@/content/pricing";
import { summarizeProgress } from "@/lib/progress-summary";
import { freeChaptersLabel, projectBase, projectBuyPath, projectChapterPath, projectLessonPath, projectMetaDescription, projectProgressSlug } from "@/lib/project-paths";
import ProgressBar from "@/components/ui/ProgressBar";
import { LinkButton } from "@/components/ui/Button";
import { SERVICE_END_ISO, formatDateId, salesOpen } from "@/lib/site-config";

export async function generateMetadata({ params }: { params: { project: string } }): Promise<Metadata> {
  const project = getProject(params.project);
  // An unknown project ends in notFound() (a 404, which Next.js already marks noindex).
  if (!project) return { title: "Proyek" };
  return {
    title: project.title,
    description: projectMetaDescription(project),
    alternates: { canonical: projectBase(project.slug) },
  };
}

export default async function ProjectPage({ params }: { params: { project: string } }) {
  const project = getProject(params.project);
  if (!project) notFound();

  const completed = await getCompletedLessonKeys();
  const loggedIn = completed !== null;
  const purchased = loggedIn && (await hasApprovedPurchase(project.slug));
  const price = getCoursePrice(project.slug);
  const summary = loggedIn ? summarizeProgress(getProjectLessons(project), completed, purchased) : null;
  const canBuy = salesOpen(new Date());
  const endLabel = formatDateId(SERVICE_END_ISO);
  const freeLabel = freeChaptersLabel(project.chapters);
  const freeText = freeLabel ? `${freeLabel}. ` : "";
  const base = projectBase(project.slug);

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm text-ink-soft">
        <Link href="/proyek" className="underline">Proyek</Link>
      </p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-ink">{project.title}</h1>
      <p className="mt-2 text-ink-soft">{project.description}</p>
      <p className="mt-3 text-ink-soft">
        Sebaiknya kamu sudah menyelesaikan Python Dasar (fungsi, file, list, dictionary, set, dan penanganan error),
        karena proyek ini memakai semuanya. Di akhir, kamu bisa mengunduh programmu sebagai file zip dan mengunggahnya
        ke GitHub.
      </p>
      <p className="mt-3 text-ink-soft">
        {freeText}Sisanya dengan sekali bayar, Rp{price.toLocaleString("id-ID")}.
      </p>
      <p className="mt-1 text-xs text-ink-soft">
        Akses berlaku selama PyMula berjalan, direncanakan paling lama sampai {endLabel}.{" "}
        <Link href="/tentang#status" className="underline">Selengkapnya</Link>
      </p>
      <p className="mt-1 text-xs text-ink-soft">
        Di proyek ini setiap lesson punya kode awal sendiri. Kode yang kamu tulis di lesson sebelumnya tidak dibawa
        otomatis ke lesson berikutnya.
      </p>

      {!loggedIn && (
        <div className="mt-6 rounded-lg border border-sun bg-sun/10 px-5 py-4 text-sm text-ink">
          Masuk dulu untuk mencoba bab gratis.{" "}
          <Link href="/register" className="font-medium underline">Daftar gratis</Link> atau{" "}
          <Link href={`/login?next=${encodeURIComponent(base)}`} className="font-medium underline">masuk</Link>.
        </div>
      )}

      {loggedIn && !purchased && canBuy && (
        <div className="mt-6 rounded-lg border border-sun bg-sun/10 px-5 py-4 text-sm text-ink">
          Selesaikan bab gratis, lalu buka bab berikutnya dengan sekali bayar.{" "}
          <Link href={projectBuyPath(project.slug)} className="font-medium underline">Beli sekarang</Link>.
        </div>
      )}

      {loggedIn && !purchased && !canBuy && (
        <div className="mt-6 rounded-lg border border-sun bg-sun/10 px-5 py-4 text-sm text-ink">
          Penjualan bab berbayar sudah ditutup karena PyMula akan berhenti beroperasi pada {endLabel}.
        </div>
      )}

      {summary && (
        <div className="mt-6 rounded-lg border border-line bg-white/60 p-5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-display text-base font-semibold text-ink">Progres kamu</p>
            <p className="text-sm text-ink-soft">{summary.percent}%</p>
          </div>
          <ProgressBar value={summary.scopeDone} max={summary.scopeTotal} label={`Progres ${project.title}`} className="mt-3" />
          <p className="mt-2 text-xs text-ink-soft">
            {summary.scopeDone}/{summary.scopeTotal} lesson selesai{!purchased && " (bab gratis)"}
          </p>
          {summary.next ? (
            <LinkButton
              href={projectLessonPath(project.slug, summary.next.chapterUrlSlug, summary.next.lessonId)}
              className="mt-4"
            >
              {summary.scopeDone > 0 ? "Lanjutkan" : "Mulai"} — {summary.next.chapterTitle}: {summary.next.lessonTitle}
            </LinkButton>
          ) : summary.lockedNext ? (
            <>
              <p className="mt-4 text-sm text-code">Semua bab gratis sudah kamu selesaikan. Kerja bagus!</p>
              {canBuy && (
                <LinkButton href={projectBuyPath(project.slug)} className="mt-3">Buka bab berikutnya</LinkButton>
              )}
            </>
          ) : (
            <p className="mt-4 text-sm text-code">Semua lesson yang tersedia sudah selesai. Bab baru akan segera hadir.</p>
          )}
        </div>
      )}

      <ol className="mt-8 divide-y divide-line rounded-lg border border-line bg-white/60">
        {project.chapters.map((chapter) => {
          const isTodo = chapter.status === "todo";
          const progressSlug = projectProgressSlug(project.slug, chapter.slug);
          const totalLessons = !isTodo ? chapter.lessons.length : 0;
          const doneLessons =
            !isTodo && completed ? chapter.lessons.filter((l) => completed.has(lessonKey(progressSlug, l.id))).length : 0;
          const inner = (
            <div className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-ink-soft">Bab {chapter.order}</p>
                <p className="font-display text-base font-medium text-ink">{chapter.title}</p>
                {loggedIn && !isTodo && (
                  <div className="mt-2 max-w-xs">
                    <ProgressBar value={doneLessons} max={totalLessons} size="sm" label={`Progres Bab ${chapter.order}`} />
                    <p className="mt-1 text-xs text-ink-soft">{doneLessons}/{totalLessons} lesson selesai</p>
                  </div>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2 text-xs">
                {loggedIn && !isTodo && totalLessons > 0 && doneLessons === totalLessons && (
                  <span className="rounded bg-code-bg px-2 py-1 font-medium text-code">✓ Selesai</span>
                )}
                {!chapter.isFree && purchased && <span className="rounded bg-code-bg px-2 py-1 text-code">Sudah dibeli</span>}
                {!chapter.isFree && !purchased && <span className="rounded bg-sun/30 px-2 py-1 text-ink">Berbayar</span>}
                {isTodo && <span className="rounded bg-line px-2 py-1 text-ink-soft">Segera hadir</span>}
              </div>
            </div>
          );
          const target = projectChapterPath(project.slug, chapter.slug);
          return (
            <li key={chapter.slug}>
              {isTodo ? (
                <div className="opacity-60">{inner}</div>
              ) : (
                <Link href={loggedIn ? target : `/login?next=${encodeURIComponent(target)}`} className="block hover:bg-white">
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
