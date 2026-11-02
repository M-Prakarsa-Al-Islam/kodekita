import type { ChapterContent, CodePractice, ProjectContent } from "@/content/types";
import { projectLessonPath, projectProgressSlug } from "@/lib/project-paths";
import type { ZipEntry } from "@/lib/zip";

// The project download ("take-home") unlocks only when EVERY lesson that has
// code in it is finished. Quizzes and the open challenge never block it.
// Pure functions (no React / Supabase), tested in scripts/test-take-home.mjs.

export type CodeLessonRef = {
  chapterUrlSlug: string;
  progressSlug: string; // "<project>/<chapter>", the key lesson_progress uses
  lessonId: string;
  chapterOrder: number;
  chapterTitle: string;
  lessonTitle: string;
  href: string;
};

export function getCodeLessons(project: ProjectContent): CodeLessonRef[] {
  const out: CodeLessonRef[] = [];
  for (const chapter of project.chapters) {
    if (chapter.status !== "published") continue;
    for (const lesson of (chapter as ChapterContent).lessons) {
      if (lesson.practice.kind !== "code") continue;
      out.push({
        chapterUrlSlug: chapter.slug,
        progressSlug: projectProgressSlug(project.slug, chapter.slug),
        lessonId: lesson.id,
        chapterOrder: chapter.order,
        chapterTitle: chapter.title,
        lessonTitle: lesson.title,
        href: projectLessonPath(project.slug, chapter.slug, lesson.id),
      });
    }
  }
  return out;
}

export type TakeHomeState = { total: number; remaining: CodeLessonRef[]; unlocked: boolean };

// `completed` holds "<progressSlug>:<lessonId>" keys, exactly as lib/progress-keys.ts builds them.
export function getTakeHomeState(project: ProjectContent, completed: ReadonlySet<string> | null): TakeHomeState {
  const all = getCodeLessons(project);
  const remaining = all.filter((l) => !completed?.has(`${l.progressSlug}:${l.lessonId}`));
  return { total: all.length, remaining, unlocked: all.length > 0 && remaining.length === 0 };
}

// The program the learner finished = the files of the LAST code lesson.
export function getLastCodeLesson(project: ProjectContent): { ref: CodeLessonRef; practice: CodePractice } | null {
  const refs = getCodeLessons(project);
  const ref = refs[refs.length - 1];
  if (!ref) return null;
  const chapter = project.chapters.find((c) => c.slug === ref.chapterUrlSlug) as ChapterContent;
  const lesson = chapter.lessons.find((l) => l.id === ref.lessonId)!;
  return { ref, practice: lesson.practice as CodePractice };
}

// Names of the files the learner edits (the program), and the model answer for them.
export function editableFileNames(practice: CodePractice): string[] {
  return (practice.files ?? []).filter((f) => f.editable !== false).map((f) => f.name);
}

// The model answer for every file the learner edits. A lesson lists in answerFiles only
// the files that CHANGE in that lesson, so a file that is not listed is unchanged and its
// answer is its starter content. (Without this, the last lesson's fungsi.py came out empty.)
export function modelCode(practice: CodePractice): Record<string, string> {
  return Object.fromEntries(
    editableFileNames(practice).map((n) => [n, practice.answerFiles?.[n] ?? practice.files?.find((f) => f.name === n)?.content ?? ""])
  );
}

// Build the zip content. `code` = the program files (the learner's own, or the
// model answer), `seed` = data files such as the article, `readme` = README text.
export function buildTakeHomeEntries(opts: {
  folder: string;
  code: Record<string, string>;
  seed: Record<string, string>;
  readme: string;
}): ZipEntry[] {
  const f = (name: string, data: string): ZipEntry => ({ name: `${opts.folder}/${name}`, data });
  return [
    f("README.md", opts.readme),
    ...Object.entries(opts.code).map(([n, c]) => f(n, c)),
    ...Object.entries(opts.seed).map(([n, c]) => f(n, c)),
  ];
}
