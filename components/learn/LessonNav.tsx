"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
// Type-only import (erased at build). Never import the full `chapters`
// array here: this is a client component, so that would ship every
// lesson's theory, answers and expected output (incl. paid chapters)
// to the browser. The trimmed list comes in as a prop instead.
import type { NavChapter } from "@/content/chapters";
import { lessonKey } from "@/lib/progress-keys";

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
  navChapters,
  completedKeys = [],
}: {
  chapterSlug: string;
  lessonId: string;
  navChapters: NavChapter[];
  // The signed-in learner's own finished lessons, as `${chapterSlug}:${lessonId}`.
  completedKeys?: string[];
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

  const done = new Set(completedKeys);
  const chapter = navChapters.find((c) => c.slug === chapterSlug);
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
            {navChapters.map((c) => {
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
              const doneCount = c.lessons.filter((l) => done.has(lessonKey(c.slug, l.id))).length;
              const allDone = c.lessons.length > 0 && doneCount === c.lessons.length;
              return (
                <Link
                  key={c.slug}
                  href={`/kursus/python-dasar/${c.slug}`}
                  onClick={() => setOpenMenu(null)}
                  className={`flex items-center justify-between gap-2 px-3 py-2 hover:bg-ink/5 ${
                    isCurrent ? "bg-code-bg font-medium text-ink" : "text-ink"
                  }`}
                >
                  <span>
                    Ch{c.order}: {c.title}
                  </span>
                  <span className={`shrink-0 text-xs ${allDone ? "text-code" : "text-ink-soft"}`}>
                    {allDone ? "✓" : `${doneCount}/${c.lessons.length}`}
                    <span className="sr-only">{allDone ? " selesai" : " lesson selesai"}</span>
                  </span>
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
              const isDone = done.has(lessonKey(chapter.slug, l.id));
              return (
                <Link
                  key={l.id}
                  href={`/kursus/python-dasar/${chapter.slug}/${l.id}`}
                  onClick={() => setOpenMenu(null)}
                  className={`flex items-center justify-between gap-2 px-3 py-2 hover:bg-ink/5 ${
                    isCurrent ? "bg-code-bg font-medium text-ink" : "text-ink"
                  }`}
                >
                  <span>
                    L{i + 1}: {l.title}
                  </span>
                  {isDone && (
                    <span className="shrink-0 text-xs text-code">
                      ✓<span className="sr-only"> selesai</span>
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
