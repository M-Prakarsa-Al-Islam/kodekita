// "Lesson 3/8 · 2 selesai" plus one segment per lesson of the chapter:
// green = finished, amber ring = the lesson you are on, grey = not yet.
// Server-rendered (no client JS); updates when the page re-renders, e.g. after
// router.refresh() once the learner passes a lesson.
export default function ChapterProgress({
  lessons,
  currentId,
  completedIds,
}: {
  lessons: { id: string; title: string }[];
  currentId: string;
  completedIds: string[];
}) {
  const done = new Set(completedIds);
  const doneCount = lessons.filter((l) => done.has(l.id)).length;
  const position = lessons.findIndex((l) => l.id === currentId) + 1;

  return (
    <div>
      <div className="flex items-center justify-between text-sm text-ink-soft">
        <span>
          Lesson {position}/{lessons.length}
        </span>
        <span>
          {doneCount}/{lessons.length} selesai
        </span>
      </div>
      <ol aria-label="Progres chapter" className="mt-2 flex gap-1.5">
        {lessons.map((l) => {
          const isDone = done.has(l.id);
          const isCurrent = l.id === currentId;
          return (
            <li
              key={l.id}
              title={l.title}
              aria-current={isCurrent ? "step" : undefined}
              className={`h-2 flex-1 rounded-full ${isDone ? "bg-code" : "bg-line"} ${
                isCurrent ? "ring-2 ring-sun ring-offset-1 ring-offset-paper" : ""
              }`}
            >
              <span className="sr-only">
                {l.title}: {isDone ? "selesai" : isCurrent ? "sedang dibuka" : "belum selesai"}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
