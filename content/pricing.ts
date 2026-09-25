// Course prices in Rupiah. Configurable here, never hardcoded inline
// in pages/components — the master spec caps Python Dasar at
// Rp30.000 and expects project courses to be cheaper (e.g. Rp10.000).
export const PYTHON_DASAR_COURSE_SLUG = "python-dasar";

const COURSE_PRICES: Record<string, number> = {
  [PYTHON_DASAR_COURSE_SLUG]: 25000,
};

export function getCoursePrice(courseSlug: string): number {
  return COURSE_PRICES[courseSlug] ?? 0;
}
