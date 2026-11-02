"use client";

import { createClient } from "@/lib/supabase/client";
import { getBrowserStorage, passedKey, savePassed } from "@/lib/code-drafts";

// Called when a code lesson passes: remember the learner's editable files on this
// device, so the project download can contain the code that actually passed.
// Best effort, never throws: if it fails the download falls back to the model answer.
export async function rememberPassedFiles(
  chapterSlug: string,
  lessonId: string,
  files: Record<string, string>,
  editableNames: string[]
): Promise<void> {
  try {
    const storage = getBrowserStorage();
    if (!storage || editableNames.length === 0) return;
    const { data } = await createClient().auth.getSession();
    const userId = data.session?.user.id;
    if (!userId) return;
    const mine: Record<string, string> = {};
    for (const name of editableNames) if (typeof files[name] === "string") mine[name] = files[name];
    savePassed(storage, passedKey(userId, chapterSlug, lessonId), mine);
  } catch {
    /* ignore */
  }
}
