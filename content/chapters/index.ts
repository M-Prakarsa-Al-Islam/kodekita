import type { Chapter, ChapterContent, ChapterStatus, Lesson } from "@/content/types";
import { chapter1 } from "./chapter-1";
import { chapter2 } from "./chapter-2";
import { chapter3 } from "./chapter-3";
import { chapter4 } from "./chapter-4";
import { chapter5 } from "./chapter-5";
import { chapter6 } from "./chapter-6";
import { chapter7 } from "./chapter-7";
import { chapter8 } from "./chapter-8";
import { todoChapters } from "./todo";

// Add a chapter here (and to the imports above) once it's written,
// and remove its metadata-only entry from todo.ts.
export const chapters: Chapter[] = [
  chapter1,
  chapter2,
  chapter3,
  chapter4,
  chapter5,
  chapter6,
  chapter7,
  chapter8,
  ...todoChapters,
].sort((a, b) => a.order - b.order);

export function getChapterBySlug(slug: string): Chapter | undefined {
  return chapters.find((c) => c.slug === slug);
}

export function getAdjacentChapterSlugs(order: number) {
  const prev = chapters.find((c) => c.order === order - 1)?.slug ?? null;
  const next = chapters.find((c) => c.order === order + 1)?.slug ?? null;
  return { prev, next };
}

function isPublished(c: Chapter): c is ChapterContent {
  return c.status === "published";
}

export function getLesson(chapterSlug: string, lessonId: string): Lesson | undefined {
  const chapter = getChapterBySlug(chapterSlug);
  if (!chapter || !isPublished(chapter)) return undefined;
  return chapter.lessons.find((l) => l.id === lessonId);
}

export type FlatLesson = {
  chapterSlug: string;
  chapterOrder: number;
  chapterTitle: string;
  chapterIsFree: boolean;
  lessonId: string;
  lessonTitle: string;
  index: number; // position in the flattened, ordered list
};

// Every lesson across every *published* chapter, in course order.
// Used to find "what's next" for progress/dashboard, and for lesson
// prev/next navigation that crosses chapter boundaries.
export function getAllLessons(): FlatLesson[] {
  const flat: FlatLesson[] = [];
  for (const chapter of chapters) {
    if (!isPublished(chapter)) continue;
    for (const lesson of chapter.lessons) {
      flat.push({
        chapterSlug: chapter.slug,
        chapterOrder: chapter.order,
        chapterTitle: chapter.title,
        chapterIsFree: chapter.isFree,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        index: flat.length,
      });
    }
  }
  return flat;
}

export function getAdjacentLessons(chapterSlug: string, lessonId: string) {
  const flat = getAllLessons();
  const i = flat.findIndex(
    (l) => l.chapterSlug === chapterSlug && l.lessonId === lessonId
  );
  return {
    prev: i > 0 ? flat[i - 1] : null,
    next: i >= 0 && i < flat.length - 1 ? flat[i + 1] : null,
  };
}

export type NavLesson = { id: string; title: string };
export type NavChapter = {
  slug: string;
  order: number;
  title: string;
  isFree: boolean;
  status: ChapterStatus;
  lessons: NavLesson[]; // empty for todo chapters
};

// Trimmed chapter/lesson list, safe to pass into a CLIENT component
// (e.g. the header's course nav menu). Deliberately strips theory,
// practice, starter code, hints and answerHint - none of that should
// ever end up in client-side JS, or the spoiler-answer protection and
// the auto-grader's expected output are trivially visible via devtools.
export function getNavChapters(): NavChapter[] {
  return chapters.map((c) => ({
    slug: c.slug,
    order: c.order,
    title: c.title,
    isFree: c.isFree,
    status: c.status,
    lessons: isPublished(c) ? c.lessons.map((l) => ({ id: l.id, title: l.title })) : [],
  }));
}
