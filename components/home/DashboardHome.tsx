import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import { getAllLessons } from "@/content/chapters";
import { getCompletedLessonKeys, lessonKey } from "@/lib/progress-server";

export default async function DashboardHome({ name }: { name: string }) {
  const allLessons = getAllLessons();
  const completed = (await getCompletedLessonKeys()) ?? new Set<string>();

  const doneCount = allLessons.filter((l) =>
    completed.has(lessonKey(l.chapterSlug, l.lessonId))
  ).length;

  const nextLesson =
    allLessons.find((l) => !completed.has(lessonKey(l.chapterSlug, l.lessonId))) ?? null;

  const hasStarted = doneCount > 0;

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-2xl font-semibold text-ink">Halo, {name}</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {hasStarted
          ? `Kamu sudah menyelesaikan ${doneCount} dari ${allLessons.length} lesson yang tersedia.`
          : "Kamu belum mulai lesson apa pun. Yuk mulai dari Chapter 1."}
      </p>

      <div className="mt-8 rounded-lg border border-line bg-white/60 p-6">
        <p className="font-display text-lg font-semibold text-ink">Python Dasar</p>
        <p className="mt-1 text-sm text-ink-soft">
          {doneCount}/{allLessons.length} lesson selesai
        </p>

        {nextLesson ? (
          <LinkButton
            href={`/kursus/python-dasar/${nextLesson.chapterSlug}/${nextLesson.lessonId}`}
            className="mt-4"
          >
            {hasStarted ? "Lanjutkan" : "Mulai"} — {nextLesson.chapterTitle}: {nextLesson.lessonTitle}
          </LinkButton>
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
