// Pure helpers (no Next / Supabase) for the project courses, so the URL and
// progress-key rules can be unit tested in Node (scripts/test-projects.mjs).
//
// PROGRESS KEY. A project lesson is stored in the SAME table as Python Dasar
// (lesson_progress: user_id, chapter_slug, lesson_id) with a namespaced
// chapter_slug, "<project>/<chapter>". The namespace cannot collide with a
// Python Dasar chapter slug (those never contain "/"), so no SQL change is
// needed and the Python Dasar progress maths ignores project rows.
export function projectProgressSlug(projectSlug: string, chapterSlug: string): string {
  return `${projectSlug}/${chapterSlug}`;
}

export function projectBase(projectSlug: string): string {
  return `/proyek/${projectSlug}`;
}
export function projectChapterPath(projectSlug: string, chapterSlug: string): string {
  return `${projectBase(projectSlug)}/${chapterSlug}`;
}
export function projectLessonPath(projectSlug: string, chapterSlug: string, lessonId: string): string {
  return `${projectChapterPath(projectSlug, chapterSlug)}/${lessonId}`;
}
// "Bab 1–2 gratis" for the chapters flagged free (null when there are none).
export function freeChaptersLabel(chapters: { order: number; isFree: boolean }[]): string | null {
  const free = chapters.filter((c) => c.isFree).map((c) => c.order);
  if (!free.length) return null;
  const lo = Math.min(...free), hi = Math.max(...free);
  return lo === hi ? `Bab ${lo} gratis` : `Bab ${lo}–${hi} gratis`;
}

// The sentence Google may show under the project's title (kept under about 160 characters).
export function projectMetaDescription(project: {
  title: string;
  tagline: string;
  chapters: { order: number; isFree: boolean }[];
}): string {
  const free = freeChaptersLabel(project.chapters);
  return `${project.title}: ${project.tagline} Latihan kode langsung di browser, ${project.chapters.length} bab.${free ? ` ${free}.` : ""}`;
}

export function projectBuyPath(projectSlug: string): string {
  return `${projectBase(projectSlug)}/beli`;
}
