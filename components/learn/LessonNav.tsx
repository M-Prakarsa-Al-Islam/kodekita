"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { chapters } from "@/content/chapters";

// Two independent dropdown selectors for the lesson page's top bar:
// - Chapter selector: shows "ChN: <title>", expands to every chapter in
//   the course. Picking one goes to that chapter's entry route, which
//   already redirects to lesson 1 (or the first incomplete lesson).
// - Lesson selector: shows "LN: <title>", expands to every lesson in the
//   *current* chapter only. Picking one jumps straight to that lesson.
// Both always reflect the chapter/lesson passed in via props (i.e. the
// current URL), so they stay in sync as the learner navigates.
export default function LessonNav({
  chapterSlug,
  lessonId,
}: {
  chapterSlug: string;
  lessonId: string;
}) {
  const [openMenu, setOpenMenu] = useState<"chapter" | "lesson" | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const chapter = chapters.find((c) => c.slug === chapterSlug);
  if (!chapter || chapter.status !== "published") return null;

  const lessonIndex = chapter.lessons.findIndex((l) => l.id === lessonId);
  const lesson = chapter.lessons[lessonIndex];
  if (!lesson) return null;

  return (
    <div ref={navRef} className="flex flex-wrap gap-2 text-sm">
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenMenu((m) => (m === "chapter" ? null : "chapter"))}
          aria-expanded={openMenu === "chapter"}
          className="flex items-center gap-1 rounded-md border border-line bg-white px-3 py-1.5 text-ink hover:bg-ink/5"
        >
          <span className="font-medium">
            Ch{chapter.order}: {chapter.title}
          </span>
          <span className="text-ink-soft">▾</span>
        </button>
        {openMenu === "chapter" && (
          <div className="absolute left-0 top-full z-10 mt-1 max-h-80 w-72 overflow-y-auto rounded-md border border-line bg-white py-1 shadow-lg">
            {chapters.map((c) => {
              if (c.status !== "published") {
                return (
                  <div
                    key={c.slug}
                    className="flex cursor-not-allowed items-center justify-between gap-2 px-3 py-2 text-ink-soft/70"
                  >
                    <span>
                      Ch{c.order}: {c.title}
                    </span>
                    <span className="shrink-0 text-xs">Segera hadir</span>
                  </div>
                );
              }
              const isCurrent = c.slug === chapterSlug;
              return (
                <Link
                  key={c.slug}
                  href={`/kursus/python-dasar/${c.slug}`}
                  onClick={() => setOpenMenu(null)}
                  className={`block px-3 py-2 hover:bg-ink/5 ${
                    isCurrent ? "bg-code-bg font-medium text-ink" : "text-ink"
                  }`}
                >
                  Ch{c.order}: {c.title}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenMenu((m) => (m === "lesson" ? null : "lesson"))}
          aria-expanded={openMenu === "lesson"}
          className="flex items-center gap-1 rounded-md border border-line bg-white px-3 py-1.5 text-ink hover:bg-ink/5"
        >
          <span className="font-medium">
            L{lessonIndex + 1}: {lesson.title}
          </span>
          <span className="text-ink-soft">▾</span>
        </button>
        {openMenu === "lesson" && (
          <div className="absolute left-0 top-full z-10 mt-1 max-h-80 w-72 overflow-y-auto rounded-md border border-line bg-white py-1 shadow-lg">
            {chapter.lessons.map((l, i) => {
              const isCurrent = l.id === lessonId;
              return (
                <Link
                  key={l.id}
                  href={`/kursus/python-dasar/${chapter.slug}/${l.id}`}
                  onClick={() => setOpenMenu(null)}
                  className={`block px-3 py-2 hover:bg-ink/5 ${
                    isCurrent ? "bg-code-bg font-medium text-ink" : "text-ink"
                  }`}
                >
                  L{i + 1}: {l.title}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
