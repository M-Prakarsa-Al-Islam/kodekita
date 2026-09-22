import { createClient } from "@/lib/supabase/client";

// Client-side: called from Challenge/Quiz components right after a
// learner passes a lesson's practice.
export async function markLessonComplete(chapterSlug: string, lessonId: string) {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return; // guests shouldn't reach practice pages, but stay safe

  await supabase.from("lesson_progress").upsert(
    {
      user_id: data.user.id,
      chapter_slug: chapterSlug,
      lesson_id: lessonId,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,chapter_slug,lesson_id" }
  );
}
