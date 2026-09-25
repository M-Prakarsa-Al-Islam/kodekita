import Link from "next/link";
import { chapters } from "@/content/chapters";
import { getCompletedLessonKeys, lessonKey } from "@/lib/progress-server";
import { hasApprovedPurchase } from "@/lib/purchase-server";
import { getCoursePrice, PYTHON_DASAR_COURSE_SLUG } from "@/content/pricing";

export default async function PythonDasarPage() {
  const completed = await getCompletedLessonKeys();
  const loggedIn = completed !== null;
  const purchased = loggedIn && (await hasApprovedPurchase(PYTHON_DASAR_COURSE_SLUG));
  const price = getCoursePrice(PYTHON_DASAR_COURSE_SLUG);

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold text-ink">
        Python Dasar
      </h1>
      <p className="mt-2 text-ink-soft">
        Chapter 1–5 gratis. Chapter 6–13 dengan sekali bayar, Rp{price.toLocaleString("id-ID")}.
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

      {loggedIn && !purchased && (
        <div className="mt-6 rounded-lg border border-sun bg-sun/10 px-5 py-4 text-sm text-ink">
          Selesaikan chapter gratis, lalu buka Chapter 6–13 dengan sekali bayar.{" "}
          <Link href="/kursus/python-dasar/beli" className="font-medium underline">
            Beli sekarang
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
                {!chapter.isFree && purchased && (
                  <span className="rounded bg-code-bg px-2 py-1 text-code">Sudah dibeli</span>
                )}
                {!chapter.isFree && !purchased && (
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
