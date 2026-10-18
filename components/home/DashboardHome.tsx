import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import { getAllLessons } from "@/content/chapters";
import { PYTHON_DASAR_COURSE_SLUG } from "@/content/pricing";
import { getCompletedLessonKeys } from "@/lib/progress-server";
import { summarizeProgress } from "@/lib/progress-summary";
import { hasApprovedPurchase } from "@/lib/purchase-server";

export default async function DashboardHome({ name }: { name: string }) {
  const completed = (await getCompletedLessonKeys()) ?? new Set<string>();
  const purchased = await hasApprovedPurchase(PYTHON_DASAR_COURSE_SLUG);
  const summary = summarizeProgress(getAllLessons(), completed, purchased);
  const hasStarted = summary.doneAll > 0;

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-2xl font-semibold text-ink">Halo, {name}</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {hasStarted
          ? `Kamu sudah menyelesaikan ${summary.doneAll} dari ${summary.totalAll} lesson yang tersedia.`
          : "Kamu belum mulai lesson apa pun. Yuk mulai dari Chapter 1."}
      </p>

      <div className="mt-8 rounded-lg border border-line bg-white/60 p-6">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-display text-lg font-semibold text-ink">Python Dasar</p>
          <p className="text-sm text-ink-soft">{summary.percent}%</p>
        </div>
        <ProgressBar
          value={summary.scopeDone}
          max={summary.scopeTotal}
          label="Progres Python Dasar"
          className="mt-3"
        />
        <p className="mt-2 text-sm text-ink-soft">
          {summary.scopeDone}/{summary.scopeTotal} lesson selesai
          {!purchased && " (chapter gratis)"}
        </p>

        {summary.next ? (
          <LinkButton
            href={`/kursus/python-dasar/${summary.next.chapterSlug}/${summary.next.lessonId}`}
            className="mt-4"
          >
            {hasStarted ? "Lanjutkan" : "Mulai"} — {summary.next.chapterTitle}:{" "}
            {summary.next.lessonTitle}
          </LinkButton>
        ) : summary.lockedNext ? (
          <>
            <p className="mt-4 text-sm text-code">
              Semua chapter gratis sudah kamu selesaikan. Kerja bagus!
            </p>
            <LinkButton href="/kursus/python-dasar/beli" className="mt-3">
              Buka chapter berikutnya
            </LinkButton>
          </>
        ) : (
          <p className="mt-4 text-sm text-code">
            Semua lesson yang tersedia sudah selesai. Chapter baru akan segera hadir.
          </p>
        )}
      </div>

      <div className="mt-6">
        <Link href="/kursus/python-dasar" className="text-sm underline">
          Lihat semua chapter
        </Link>
      </div>
    </section>
  );
}
