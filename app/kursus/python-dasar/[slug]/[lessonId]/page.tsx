import Link from "next/link";
import { notFound } from "next/navigation";
import { getChapterBySlug, getLesson, getAdjacentLessons } from "@/content/chapters";
import Practice from "@/components/learn/Practice";
import LessonNav from "@/components/learn/LessonNav";

export default function LessonPage({
  params,
}: {
  params: { slug: string; lessonId: string };
}) {
  const chapter = getChapterBySlug(params.slug);
  if (!chapter || chapter.status !== "published") notFound();

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
      {!chapter.isFree && (
        <p className="mt-2 inline-block rounded bg-sun/30 px-2 py-1 text-xs text-ink">
          Chapter berbayar — akan terkunci setelah sistem pembayaran aktif
        </p>
      )}

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
