import type { ChapterTodo } from "@/content/types";

// Metadata only. Each of these becomes a `content/chapters/chapter-N.ts`
// file (following the chapter-1.ts / chapter-2.ts pattern) in a future
// content-writing session, then gets removed from this list and added
// to content/chapters/index.ts. Track real status in PROGRESS.md.
export const todoChapters: ChapterTodo[] = [
  { slug: "3-fungsi", order: 3, title: "Fungsi", isFree: true, status: "todo" },
  { slug: "4-scope", order: 4, title: "Scope", isFree: true, status: "todo" },
  {
    slug: "5-testing-debugging",
    order: 5,
    title: "Testing & Debugging",
    isFree: true,
    status: "todo",
  },
  { slug: "6-computing", order: 6, title: "Computing", isFree: false, status: "todo" },
  {
    slug: "7-perbandingan",
    order: 7,
    title: "Perbandingan",
    isFree: false,
    status: "todo",
  },
  { slug: "8-loop", order: 8, title: "Loop", isFree: false, status: "todo" },
  { slug: "9-list", order: 9, title: "List", isFree: false, status: "todo" },
  {
    slug: "10-dictionary",
    order: 10,
    title: "Dictionary",
    isFree: false,
    status: "todo",
  },
  { slug: "11-set", order: 11, title: "Set", isFree: false, status: "todo" },
  { slug: "12-error", order: 12, title: "Error", isFree: false, status: "todo" },
  {
    slug: "13-type-hints",
    order: 13,
    title: "Type Hints",
    isFree: false,
    status: "todo",
  },
];
