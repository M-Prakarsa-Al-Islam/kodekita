import type { Practice as PracticeType } from "@/content/types";
import Challenge from "./Challenge";
import QuizRunner from "./QuizRunner";

export default function Practice({
  practice,
  chapterSlug,
  lessonId,
}: {
  practice: PracticeType;
  chapterSlug: string;
  lessonId: string;
}) {
  if (practice.kind === "code") {
    return <Challenge practice={practice} chapterSlug={chapterSlug} lessonId={lessonId} />;
  }
  return <QuizRunner practice={practice} chapterSlug={chapterSlug} lessonId={lessonId} />;
}
