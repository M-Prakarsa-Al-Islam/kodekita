// Pure helpers (no Supabase / Next imports) so progress logic can be unit
// tested in Node. `lib/progress-server.ts` re-exports these.
export type CompletedLessonKey = string; // `${chapterSlug}:${lessonId}`

export function lessonKey(chapterSlug: string, lessonId: string): CompletedLessonKey {
  return `${chapterSlug}:${lessonId}`;
}
