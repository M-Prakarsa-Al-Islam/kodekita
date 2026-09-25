import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getChapterBySlug, getLesson, getAdjacentLessons } from "@/content/chapters";
import { hasApprovedPurchase } from "@/lib/purchase-server";
import { PYTHON_DASAR_COURSE_SLUG } from "@/content/pricing";
import Practice from "@/components/learn/Practice";
import LessonNav from "@/components/learn/LessonNav";

export default async function LessonPage({
  params,
}: {
  params: { slug: string; lessonId: string };
}) {
  const chapter = getChapterBySlug(params.slug);
  if (!chapter || chapter.status !== "published") notFound();

  // Server-side enforcement, not just hiding the UI: a logged-in user
  // who has not purchased cannot reach paid lesson content directly by
  // URL either, matching the master spec's access-control requirement.
  if (!chapter.isFree && !(await hasApprovedPurchase(PYTHON_DASAR_COURSE_SLUG))) {
    redirect("/kursus/python-dasar/beli");
  }

  const lesson = getLesson(params.slug, params.lessonId);
  if (!lesson) notFound();

  const { prev, next } = getAdjacentLessons(params.slug, params.lessonId);
  const lessonNumber = chapter.lessons.findIndex((l) => l.id === lesson.id) + 1;

  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <LessonNav chapterSlug={chapter.slug} lessonId={lesson.id} />
      <p className="mt-3 text-sm text-ink-soft">
        Lesson {lessonNumber}/{chapter.lessons.length}
      </p>
      <h1 className="font-display text-2xl font-semibold text-ink">{lesson.title}</h1>

      <div className="mt-8 space-y-10">
        <div>
          <p className="font-mono text-xs uppercase text-code">Teori</p>
          <p className="mt-2 whitespace-pre-line text-sm text-ink">
            {lesson.theory.explanation}
          </p>
          {lesson.theory.example && (
            <>
              <p className="mt-4 text-sm text-ink-soft">
                {lesson.theory.example.description}
              </p>
              <pre className="mt-3 overflow-x-auto rounded-lg bg-ink px-4 py-3 font-mono text-sm text-white">
                <code>{lesson.theory.example.code}</code>
              </pre>
            </>
          )}
        </div>

        <div>
          <p className="font-mono text-xs uppercase text-code">
            {lesson.practice.kind === "quiz" ? "Kuis" : "Latihan"}
          </p>
          <div className="mt-3">
            <Practice
              practice={lesson.practice}
              chapterSlug={chapter.slug}
              lessonId={lesson.id}
            />
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-between border-t border-line pt-6 text-sm">
        {prev ? (
          <Link href={`/kursus/python-dasar/${prev.chapterSlug}/${prev.lessonId}`} className="underline">
            ← {prev.lessonTitle}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/kursus/python-dasar/${next.chapterSlug}/${next.lessonId}`} className="underline">
            {next.lessonTitle} →
          </Link>
        ) : (
          <Link href="/kursus/python-dasar" className="underline">
            Selesai — kembali ke daftar chapter
          </Link>
        )}
      </div>
    </section>
  );
}
