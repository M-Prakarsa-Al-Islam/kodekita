import { createClient } from "@/lib/supabase/server";
import { lessonKey, type CompletedLessonKey } from "@/lib/progress-keys";

// Re-exported so existing imports from "@/lib/progress-server" keep working.
export { lessonKey };
export type { CompletedLessonKey };

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
