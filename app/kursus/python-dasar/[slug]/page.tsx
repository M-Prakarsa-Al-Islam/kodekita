import { notFound, redirect } from "next/navigation";
import { getChapterBySlug } from "@/content/chapters";
import { getCompletedLessonKeys, lessonKey } from "@/lib/progress-server";
import Link from "next/link";

export default async function ChapterEntryPage({
  params,
}: {
  params: { slug: string };
}) {
  const chapter = getChapterBySlug(params.slug);
  if (!chapter) notFound();

  if (chapter.status === "todo") {
    return (
      <section className="mx-auto max-w-2xl px-6 py-16">
        <p className="text-sm text-ink-soft">Chapter {chapter.order}</p>
        <h1 className="font-display text-2xl font-semibold text-ink">
          {chapter.title}
        </h1>
        <p className="mt-4 text-ink-soft">
          Chapter ini belum ditulis. Segera hadir.
        </p>
        <Link href="/kursus/python-dasar" className="mt-6 inline-block text-sm underline">
          Kembali ke daftar chapter
        </Link>
      </section>
    );
  }

  const completed = await getCompletedLessonKeys();
  const firstIncomplete =
    chapter.lessons.find(
      (lesson) => !completed?.has(lessonKey(chapter.slug, lesson.id))
    ) ?? chapter.lessons[0];

  redirect(`/kursus/python-dasar/${chapter.slug}/${firstIncomplete.id}`);
}
