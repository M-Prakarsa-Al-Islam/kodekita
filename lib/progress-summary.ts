import { lessonKey } from "./progress-keys";

// Pure progress maths for the dashboard / course page. No I/O, so it is
// unit-tested in scripts/test-progress.mjs.
//
// Two ideas worth knowing:
// - Only lessons that EXIST in `lessons` are counted. The database can hold
//   progress rows for lessons that were later renamed or removed; counting
//   those would give "12/10" or >100%.
// - A learner who hasn't purchased can only open free chapters, so their
//   headline progress ("scope") covers the free chapters only. The "next
//   lesson" is the first unfinished lesson they can actually open; if none is
//   left but paid lessons remain, `lockedNext` tells the UI to show a "buy to
//   continue" call to action instead of a link that would just bounce them to
//   the purchase page.

export type SummaryLesson = {
  chapterSlug: string;
  chapterTitle: string;
  chapterIsFree: boolean;
  lessonId: string;
  lessonTitle: string;
};

export type ProgressSummary<L extends SummaryLesson = SummaryLesson> = {
  totalAll: number; // every published lesson
  doneAll: number;
  scopeTotal: number; // lessons the learner can open now
  scopeDone: number;
  percent: number; // scopeDone / scopeTotal, whole number 0-100
  next: L | null; // first unfinished lesson the learner can open
  lockedNext: L | null; // first unfinished lesson behind the paywall, only when `next` is null
};

export function summarizeProgress<L extends SummaryLesson>(
  lessons: readonly L[],
  completed: ReadonlySet<string>,
  purchased: boolean
): ProgressSummary<L> {
  const isDone = (l: L) => completed.has(lessonKey(l.chapterSlug, l.lessonId));
  const canOpen = (l: L) => purchased || l.chapterIsFree;

  const scope = lessons.filter(canOpen);
  const scopeDone = scope.filter(isDone).length;
  const next = scope.find((l) => !isDone(l)) ?? null;
  const lockedNext = next ? null : lessons.find((l) => !canOpen(l) && !isDone(l)) ?? null;

  return {
    totalAll: lessons.length,
    doneAll: lessons.filter(isDone).length,
    scopeTotal: scope.length,
    scopeDone,
    percent: scope.length === 0 ? 0 : Math.round((scopeDone / scope.length) * 100),
    next,
    lockedNext,
  };
}
