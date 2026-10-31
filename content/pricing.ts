// Course prices in Rupiah. Configurable here, never hardcoded inline
// in pages/components — the master spec caps Python Dasar at
// Rp30.000 and expects project courses to be cheaper (e.g. Rp10.000).
export const PYTHON_DASAR_COURSE_SLUG = "python-dasar";
// A project course is sold like a course: its slug is the purchases.course_slug.
export const WORD_COUNTER_PROJECT_SLUG = "word-counter";

const COURSE_PRICES: Record<string, number> = {
  [PYTHON_DASAR_COURSE_SLUG]: 20000,
  [WORD_COUNTER_PROJECT_SLUG]: 10000,
};

export function getCoursePrice(courseSlug: string): number {
  return COURSE_PRICES[courseSlug] ?? 0;
}
