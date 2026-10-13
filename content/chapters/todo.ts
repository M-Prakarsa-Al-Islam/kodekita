import type { ChapterTodo } from "@/content/types";

// Metadata only, for chapters whose content isn't written yet. Each entry
// becomes a `content/chapters/chapter-N.ts` file (following the
// chapter-1.ts / chapter-2.ts pattern) in a content-writing session, then
// gets removed from this list and added to content/chapters/index.ts.
// Track real status in PROGRESS.md.
//
// Currently empty: all 13 Python Dasar chapters are written. Keep this
// export (index.ts spreads it) and add entries here when planning new
// courses/chapters.
export const todoChapters: ChapterTodo[] = [];
