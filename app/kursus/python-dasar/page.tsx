import Link from "next/link";
import { chapters } from "@/content/chapters";
import { getCompletedLessonKeys, lessonKey } from "@/lib/progress-server";

export default async function PythonDasarPage() {
  const completed = await getCompletedLessonKeys();
  const loggedIn = completed !== null;

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold text-ink">
        Python Dasar
      </h1>
      <p className="mt-2 text-ink-soft">
        Chapter 1–5 gratis. Chapter 6–13 dengan sekali bayar, Rp25.000.
      </p>

      {!loggedIn && (
        <div className="mt-6 rounded-lg border border-sun bg-sun/10 px-5 py-4 text-sm text-ink">
          Masuk dulu untuk mencoba 5 chapter pertama secara gratis.{" "}
          <Link href="/register" className="font-medium underline">
            Daftar gratis
          </Link>{" "}
          atau{" "}
          <Link href="/login" className="font-medium underline">
            masuk
          </Link>
          .
        </div>
      )}

      <ol className="mt-8 divide-y divide-line rounded-lg border border-line bg-white/60">
        {chapters.map((chapter) => {
          const isTodo = chapter.status === "todo";
          const totalLessons = !isTodo ? chapter.lessons.length : 0;
          const doneLessons =
            !isTodo && completed
              ? chapter.lessons.filter((l) => completed.has(lessonKey(chapter.slug, l.id))).length
              : 0;

          const inner = (
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm text-ink-soft">Chapter {chapter.order}</p>
                <p className="font-display text-base font-medium text-ink">
                  {chapter.title}
                </p>
                {loggedIn && !isTodo && (
                  <p className="mt-1 text-xs text-ink-soft">
                    {doneLessons}/{totalLessons} lesson selesai
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs">
                {!chapter.isFree && (
                  <span className="rounded bg-sun/30 px-2 py-1 text-ink">Berbayar</span>
                )}
                {isTodo && (
                  <span className="rounded bg-line px-2 py-1 text-ink-soft">Segera hadir</span>
                )}
              </div>
            </div>
          );

          const clickable = !isTodo && loggedIn;

          return (
            <li key={chapter.slug}>
              {clickable ? (
                <Link href={`/kursus/python-dasar/${chapter.slug}`} className="block hover:bg-white">
                  {inner}
                </Link>
              ) : isTodo ? (
                <div className="opacity-60">{inner}</div>
              ) : (
                <Link
                  href={`/login?next=${encodeURIComponent(`/kursus/python-dasar/${chapter.slug}`)}`}
                  className="block hover:bg-white"
                >
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
