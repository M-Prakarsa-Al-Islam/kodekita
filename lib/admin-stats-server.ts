import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAllLessons } from "@/content/chapters";
import { projects, getProjectLessons } from "@/content/projects";
import { PYTHON_DASAR_COURSE_SLUG } from "@/content/pricing";
import { computeStats, type Stats, type StatsCourse, type StatsInput } from "@/lib/admin-stats";

// Reads every row the statistics need, with the service-role client (RLS only lets
// a signed-in person see their OWN profile and progress, so an admin's own session
// cannot see everybody). The CALLER must have checked is_admin first.
//
// Supabase returns at most 1000 rows per request, so each table is read in pages.
const PAGE = 1000;

async function fetchAll<T>(table: string, columns: string, order: string[]): Promise<T[]> {
  const admin = createAdminClient();
  const rows: T[] = [];
  for (let from = 0; ; from += PAGE) {
    let query = admin.from(table).select(columns).range(from, from + PAGE - 1);
    for (const col of order) query = query.order(col, { ascending: true });
    const { data, error } = await query;
    if (error) throw new Error(`${table}: ${error.message}`);
    const page = (data ?? []) as T[];
    rows.push(...page);
    if (page.length < PAGE) return rows;
  }
}

// The courses that can have statistics: Python Dasar plus every project course.
export function statsCourses(): StatsCourse[] {
  return [
    { slug: PYTHON_DASAR_COURSE_SLUG, title: "Python Dasar", lessons: getAllLessons() },
    ...projects.map((p) => ({ slug: p.slug, title: `Proyek: ${p.title}`, lessons: getProjectLessons(p) })),
  ];
}

export async function loadStats(now = new Date()): Promise<Stats> {
  const [profiles, purchases, progress] = await Promise.all([
    fetchAll<StatsInput["profiles"][number]>("profiles", "id, created_at", ["id"]),
    fetchAll<StatsInput["purchases"][number]>("purchases", "user_id, course_slug, amount, status, created_at", ["id"]),
    fetchAll<StatsInput["progress"][number]>("lesson_progress", "user_id, chapter_slug, lesson_id, completed_at", [
      "user_id",
      "chapter_slug",
      "lesson_id",
    ]),
  ]);
  return computeStats({ now, profiles, purchases, progress, courses: statsCourses() });
}
