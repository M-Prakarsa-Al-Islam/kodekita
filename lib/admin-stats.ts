import { lessonKey } from "./progress-keys";
import { summarizeProgress, type SummaryLesson } from "./progress-summary";

// Pure maths for the admin statistics page (/admin/statistik). No I/O, so it is
// unit-tested in scripts/test-admin-stats.mjs.
//
// Rules worth knowing:
// - Only lessons that EXIST in `courses` are counted. The database can hold
//   progress rows for lessons that were later renamed or removed.
// - A learner "started" a course when at least one of its existing lessons is done,
//   and "completed" it when every one of its lessons is done.
// - Purchases of deleted accounts are kept anonymously (user_id is null): they count
//   in sales and revenue, but not as an identifiable buyer.
// - Dates are Jakarta (WIB) calendar days, whatever the server's time zone.

export type StatsCourse = {
  slug: string; // = purchases.course_slug
  title: string;
  // Project lessons use the namespaced progress slug ("word-counter/<chapter>"),
  // exactly as lib/progress-summary.ts and getProjectLessons() expect.
  lessons: SummaryLesson[];
};

export type StatsInput = {
  now: Date;
  profiles: { id: string; created_at: string }[];
  purchases: { user_id: string | null; course_slug: string; amount: number; status: string; created_at: string }[];
  progress: { user_id: string; chapter_slug: string; lesson_id: string; completed_at: string }[];
  courses: StatsCourse[];
};

export type LessonStat = {
  chapterSlug: string;
  chapterTitle: string;
  lessonId: string;
  lessonTitle: string;
  done: number; // learners who finished it
  percentOfStarted: number; // done / learners who started the course, whole number
};

export type ChapterStat = { chapterSlug: string; chapterTitle: string; started: number; completed: number };

export type StuckStat = { chapterTitle: string; lessonId: string; lessonTitle: string; count: number };

export type CourseStats = {
  slug: string;
  title: string;
  lessonCount: number;
  approved: number;
  pending: number;
  rejected: number;
  revenue: number;
  buyers: number; // distinct, identifiable learners with an approved purchase
  started: number;
  completed: number;
  completionPercent: number; // completed / started
  avgLessonsDone: number; // among learners who started, one decimal
  waitingToBuy: number; // finished every free lesson, no approved purchase, paid lessons remain
  chapters: ChapterStat[];
  lessons: LessonStat[]; // in course order
  stuckAt: StuckStat[]; // where unfinished learners will continue next, most common first
};

export type Stats = {
  users: {
    total: number;
    last7: number;
    last30: number;
    active7: number; // finished at least one lesson in the last 7 days
    neverStarted: number; // no completed lesson in any course
    daily: { date: string; count: number }[]; // sign-ups per Jakarta day, oldest first
  };
  sales: {
    approved: number;
    pending: number;
    rejected: number;
    revenue: number;
    uniqueBuyers: number;
    conversionPercent: number; // uniqueBuyers / total users, one decimal
  };
  courses: CourseStats[];
};

const DAY_MS = 24 * 60 * 60 * 1000;
const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
export const DAILY_WINDOW_DAYS = 14;

// "2026-11-05": the calendar date in Jakarta for an instant.
export function wibDate(ms: number): string {
  return new Date(ms + WIB_OFFSET_MS).toISOString().slice(0, 10);
}

function pct(part: number, whole: number, digits = 0): number {
  if (whole <= 0) return 0;
  const f = 10 ** digits;
  return Math.round((part / whole) * 100 * f) / f;
}

export function computeStats(input: StatsInput): Stats {
  const nowMs = input.now.getTime();
  const total = input.profiles.length;

  // ---- sign-ups ----
  const signupDay = new Map<string, number>();
  let last7 = 0;
  let last30 = 0;
  for (const p of input.profiles) {
    const t = new Date(p.created_at).getTime();
    if (Number.isNaN(t)) continue;
    signupDay.set(wibDate(t), (signupDay.get(wibDate(t)) ?? 0) + 1);
    if (nowMs - t <= 7 * DAY_MS) last7++;
    if (nowMs - t <= 30 * DAY_MS) last30++;
  }
  const daily: { date: string; count: number }[] = [];
  for (let i = DAILY_WINDOW_DAYS - 1; i >= 0; i--) {
    const date = wibDate(nowMs - i * DAY_MS);
    daily.push({ date, count: signupDay.get(date) ?? 0 });
  }

  // ---- progress grouped per learner ----
  const doneByUser = new Map<string, Set<string>>();
  const active = new Set<string>();
  for (const r of input.progress) {
    let set = doneByUser.get(r.user_id);
    if (!set) doneByUser.set(r.user_id, (set = new Set()));
    set.add(lessonKey(r.chapter_slug, r.lesson_id));
    const t = new Date(r.completed_at).getTime();
    if (!Number.isNaN(t) && nowMs - t <= 7 * DAY_MS) active.add(r.user_id);
  }
  const profileIds = new Set(input.profiles.map((p) => p.id));
  // Only learners that still exist count (progress of deleted accounts cascades away anyway).
  const neverStarted = input.profiles.filter((p) => !doneByUser.has(p.id)).length;
  const active7 = [...active].filter((id) => profileIds.has(id)).length;

  // ---- sales ----
  const approvedRows = input.purchases.filter((p) => p.status === "approved");
  const buyerIds = new Set(approvedRows.map((p) => p.user_id).filter((id): id is string => Boolean(id)));
  const sales = {
    approved: approvedRows.length,
    pending: input.purchases.filter((p) => p.status === "pending").length,
    rejected: input.purchases.filter((p) => p.status === "rejected").length,
    revenue: approvedRows.reduce((sum, p) => sum + p.amount, 0),
    uniqueBuyers: buyerIds.size,
    conversionPercent: pct(buyerIds.size, total, 1),
  };

  // ---- per course ----
  const courses: CourseStats[] = input.courses.map((course) => {
    const rows = input.purchases.filter((p) => p.course_slug === course.slug);
    const approved = rows.filter((p) => p.status === "approved");
    const purchasedBy = new Set(approved.map((p) => p.user_id).filter((id): id is string => Boolean(id)));

    const lessons = course.lessons;
    const doneCount = new Map<string, number>(); // lessonKey -> learners
    const chapterStarted = new Map<string, number>();
    const chapterCompleted = new Map<string, number>();
    const chapterLessonTotal = new Map<string, number>();
    const chapterOrder: { chapterSlug: string; chapterTitle: string }[] = [];
    for (const l of lessons) {
      if (!chapterLessonTotal.has(l.chapterSlug)) chapterOrder.push({ chapterSlug: l.chapterSlug, chapterTitle: l.chapterTitle });
      chapterLessonTotal.set(l.chapterSlug, (chapterLessonTotal.get(l.chapterSlug) ?? 0) + 1);
    }

    let started = 0;
    let completed = 0;
    let doneSum = 0;
    let waitingToBuy = 0;
    const stuck = new Map<string, number>(); // lessonKey -> learners

    for (const [userId, done] of doneByUser) {
      if (!profileIds.has(userId)) continue;
      const perChapterDone = new Map<string, number>();
      let doneInCourse = 0;
      for (const l of lessons) {
        const key = lessonKey(l.chapterSlug, l.lessonId);
        if (!done.has(key)) continue;
        doneInCourse++;
        doneCount.set(key, (doneCount.get(key) ?? 0) + 1);
        perChapterDone.set(l.chapterSlug, (perChapterDone.get(l.chapterSlug) ?? 0) + 1);
      }
      if (doneInCourse === 0) continue;
      started++;
      doneSum += doneInCourse;
      for (const [slug, n] of perChapterDone) {
        chapterStarted.set(slug, (chapterStarted.get(slug) ?? 0) + 1);
        if (n === chapterLessonTotal.get(slug)) chapterCompleted.set(slug, (chapterCompleted.get(slug) ?? 0) + 1);
      }

      if (doneInCourse === lessons.length) {
        completed++;
        continue;
      }
      const summary = summarizeProgress(lessons, done, purchasedBy.has(userId));
      if (summary.next) {
        const key = lessonKey(summary.next.chapterSlug, summary.next.lessonId);
        stuck.set(key, (stuck.get(key) ?? 0) + 1);
      } else if (summary.lockedNext) {
        waitingToBuy++;
      }
    }

    const byKey = new Map(lessons.map((l) => [lessonKey(l.chapterSlug, l.lessonId), l]));
    const stuckAt: StuckStat[] = [...stuck.entries()]
      .map(([key, count]) => {
        const l = byKey.get(key)!;
        return { chapterTitle: l.chapterTitle, lessonId: l.lessonId, lessonTitle: l.lessonTitle, count };
      })
      .sort((a, b) => b.count - a.count || a.chapterTitle.localeCompare(b.chapterTitle) || a.lessonId.localeCompare(b.lessonId))
      .slice(0, 5);

    return {
      slug: course.slug,
      title: course.title,
      lessonCount: lessons.length,
      approved: approved.length,
      pending: rows.filter((p) => p.status === "pending").length,
      rejected: rows.filter((p) => p.status === "rejected").length,
      revenue: approved.reduce((sum, p) => sum + p.amount, 0),
      buyers: purchasedBy.size,
      started,
      completed,
      completionPercent: pct(completed, started),
      avgLessonsDone: started === 0 ? 0 : Math.round((doneSum / started) * 10) / 10,
      waitingToBuy,
      chapters: chapterOrder.map((c) => ({
        ...c,
        started: chapterStarted.get(c.chapterSlug) ?? 0,
        completed: chapterCompleted.get(c.chapterSlug) ?? 0,
      })),
      lessons: lessons.map((l) => {
        const done = doneCount.get(lessonKey(l.chapterSlug, l.lessonId)) ?? 0;
        return {
          chapterSlug: l.chapterSlug,
          chapterTitle: l.chapterTitle,
          lessonId: l.lessonId,
          lessonTitle: l.lessonTitle,
          done,
          percentOfStarted: pct(done, started),
        };
      }),
      stuckAt,
    };
  });

  return {
    users: { total, last7, last30, active7, neverStarted, daily },
    sales,
    courses,
  };
}
