import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  getChapterBySlug,
  getLesson,
  getAdjacentLessons,
  getNavChapters,
} from "@/content/chapters";
import { hasApprovedPurchase } from "@/lib/purchase-server";
import { PYTHON_DASAR_COURSE_SLUG } from "@/content/pricing";
import Practice from "@/components/learn/Practice";
import LessonNav from "@/components/learn/LessonNav";
import ChapterProgress from "@/components/learn/ChapterProgress";
import CodeBlock from "@/components/learn/CodeBlock";
import LessonText from "@/components/learn/LessonText";
import { getCompletedLessonKeys, lessonKey } from "@/lib/progress-server";

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

  // The learner's own progress (null only if somehow signed out).
  const completed = await getCompletedLessonKeys();
  const completedKeys = completed ? Array.from(completed) : [];
  const completedIds = chapter.lessons
    .filter((l) => completed?.has(lessonKey(chapter.slug, l.id)))
    .map((l) => l.id);

  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <LessonNav
        chapterSlug={chapter.slug}
        lessonId={lesson.id}
        navChapters={getNavChapters()}
        completedKeys={completedKeys}
      />
      <div className="mt-4">
        <ChapterProgress
          lessons={chapter.lessons.map((l) => ({ id: l.id, title: l.title }))}
          currentId={lesson.id}
          completedIds={completedIds}
        />
      </div>
      <h1 className="mt-8 text-balance font-display text-3xl font-semibold leading-tight tracking-tight text-ink">
        {lesson.title}
      </h1>

      <div className="mt-8 space-y-14">
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-code">
            Teori
          </p>
          <LessonText text={lesson.theory.explanation} className="mt-3" />
          {lesson.theory.sections?.map((section, i) => (
            <div key={i} className={section.heading ? "mt-10" : "mt-5"}>
              {section.heading && (
                <h2 className="font-display text-xl font-semibold leading-snug text-ink">
                  {section.heading}
                </h2>
              )}
              {section.text && (
                <LessonText text={section.text} className={section.heading ? "mt-2" : ""} />
              )}
              {section.code && <CodeBlock code={section.code} className="mt-4" />}
            </div>
          ))}
          {lesson.theory.example && (
            <div className="mt-10">
              <LessonText
                text={lesson.theory.example.description}
                size="sm"
                className="text-ink-soft"
              />
              <CodeBlock code={lesson.theory.example.code} className="mt-3" />
            </div>
          )}
        </div>

        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-code">
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
