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
export function projectBuyPath(projectSlug: string): string {
  return `${projectBase(projectSlug)}/beli`;
}
