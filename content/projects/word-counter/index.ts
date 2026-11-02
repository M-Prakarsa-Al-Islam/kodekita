import type { Chapter, ProjectContent } from "@/content/types";
import { WORD_COUNTER_PROJECT_SLUG } from "@/content/pricing";
import { chapter1 } from "./chapter-1";
import { chapter2 } from "./chapter-2";
import { chapter3 } from "./chapter-3";
import { chapter4 } from "./chapter-4";
import { chapter5 } from "./chapter-5";
import { chapter6 } from "./chapter-6";
import { chapter7 } from "./chapter-7";
import { chapter8 } from "./chapter-8";
import { chapter9 } from "./chapter-9";
import { chapter10 } from "./chapter-10";
import { todoChapters } from "./todo";

// Chapters 1-2 are free (isFree comes from each bab-N-*.md header).
const chapters: Chapter[] = [chapter1, chapter2, chapter3, chapter4, chapter5, chapter6, chapter7, chapter8, chapter9, chapter10, ...todoChapters].sort(
  (a, b) => a.order - b.order
);

export const wordCounter: ProjectContent = {
  slug: WORD_COUNTER_PROJECT_SLUG,
  title: "Build a Word Counter",
  tagline: "Bangun program yang menghitung kata dan menampilkan 5 kata paling sering muncul.",
  description:
    "Sebuah program Python kecil yang membaca file teks, membersihkannya, lalu menampilkan jumlah kata, jumlah kata unik, dan 5 kata yang paling sering muncul. Kamu membangunnya bab demi bab, dengan latihan yang dicek otomatis.",
  chapters,
};
