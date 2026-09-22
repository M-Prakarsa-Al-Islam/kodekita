import { createClient } from "@/lib/supabase/server";

export type CompletedLessonKey = string; // `${chapterSlug}:${lessonId}`

export function lessonKey(chapterSlug: string, lessonId: string): CompletedLessonKey {
  return `${chapterSlug}:${lessonId}`;
}

// Returns null if nobody is signed in, otherwise the set of completed
// lesson keys for the current user.
export async function getCompletedLessonKeys(): Promise<Set<CompletedLessonKey> | null> {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;

  const { data, error } = await supabase
    .from("lesson_progress")
    .select("chapter_slug, lesson_id")
    .eq("user_id", userData.user.id);

  if (error || !data) return new Set();

  return new Set(data.map((row) => lessonKey(row.chapter_slug, row.lesson_id)));
}
