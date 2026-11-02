import type { Chapter, ChapterContent, Lesson, ProjectContent } from "@/content/types";
import type { FlatLesson, NavChapter } from "@/content/chapters";
import { projectProgressSlug } from "@/lib/project-paths";
import { wordCounter } from "./word-counter";
import { wordCounterTakeHome } from "./word-counter/take-home";

// Registry of project courses + the same helpers content/chapters/index.ts has
// for Python Dasar, scoped to ONE project. (Kept separate on purpose so the
// working Python Dasar code is untouched; the duplication is small.)
export const projects: ProjectContent[] = [wordCounter];

export function getProject(slug: string): ProjectContent | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectChapter(project: ProjectContent, chapterSlug: string): Chapter | undefined {
  return project.chapters.find((c) => c.slug === chapterSlug);
}

function isPublished(c: Chapter): c is ChapterContent {
  return c.status === "published";
}

export function getProjectLesson(project: ProjectContent, chapterSlug: string, lessonId: string): Lesson | undefined {
  const chapter = getProjectChapter(project, chapterSlug);
  if (!chapter || !isPublished(chapter)) return undefined;
  return chapter.lessons.find((l) => l.id === lessonId);
}

// Every lesson of every PUBLISHED chapter, in order. `chapterSlug` here is the
// PROGRESS slug ("word-counter/<chapter>") so these rows plug straight into
// summarizeProgress() and the completed-lesson keys; use `chapterUrlSlug` for URLs.
export type ProjectFlatLesson = FlatLesson & { chapterUrlSlug: string };

export function getProjectLessons(project: ProjectContent): ProjectFlatLesson[] {
  const flat: ProjectFlatLesson[] = [];
  for (const chapter of project.chapters) {
    if (!isPublished(chapter)) continue;
    for (const lesson of chapter.lessons) {
      flat.push({
        chapterSlug: projectProgressSlug(project.slug, chapter.slug),
        chapterUrlSlug: chapter.slug,
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

export function getProjectAdjacent(project: ProjectContent, chapterSlug: string, lessonId: string) {
  const flat = getProjectLessons(project);
  const i = flat.findIndex((l) => l.chapterUrlSlug === chapterSlug && l.lessonId === lessonId);
  return { prev: i > 0 ? flat[i - 1] : null, next: i >= 0 && i < flat.length - 1 ? flat[i + 1] : null };
}

// Trimmed list that is safe to send to a CLIENT component (no theory, answers
// or expected output; see the same note in content/chapters/index.ts).
export function getProjectNavChapters(project: ProjectContent): NavChapter[] {
  return project.chapters.map((c) => ({
    slug: c.slug,
    order: c.order,
    title: c.title,
    isFree: c.isFree,
    status: c.status,
    lessons: isPublished(c) ? c.lessons.map((l) => ({ id: l.id, title: l.title })) : [],
  }));
}

// What a project gives the learner to take home (server side only: the browser
// gets just the README text and, once everything is finished, the files).
export function getTakeHome(project: ProjectContent) {
  return project.slug === wordCounter.slug ? wordCounterTakeHome : undefined;
}
