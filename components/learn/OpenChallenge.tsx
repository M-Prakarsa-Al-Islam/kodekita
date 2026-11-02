"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { OpenPractice } from "@/content/types";
import { markLessonComplete } from "@/lib/progress";
import { Button } from "@/components/ui/Button";
import LessonText, { InlineText } from "@/components/learn/LessonText";

// An open-ended task: nothing is checked. The learner tries it on their own and
// says so. It is honour-based on purpose, and it never unlocks or blocks anything.
export default function OpenChallenge({
  practice,
  chapterSlug,
  lessonId,
}: {
  practice: OpenPractice;
  chapterSlug: string;
  lessonId: string;
}) {
  const router = useRouter();
  const [done, setDone] = useState(false);

  async function handleDone() {
    setDone(true);
    await markLessonComplete(chapterSlug, lessonId);
    router.refresh(); // update progress bar / ticks immediately
  }

  return (
    <div>
      <LessonText text={practice.prompt} />

      <p className="mt-6 font-medium text-ink">Beberapa ide untuk dicoba:</p>
      <ul className="mt-2 list-disc space-y-2 pl-5 text-ink-soft">
        {practice.ideas.map((idea, i) => (
          <li key={i}>
            <InlineText text={idea} />
          </li>
        ))}
      </ul>

      <p className="mt-6 rounded-lg border border-line bg-white/60 px-4 py-3 text-sm text-ink-soft">
        Tantangan ini tidak dinilai otomatis. Kamu sendiri yang menilai: apakah hasilnya sesuai yang kamu inginkan?
      </p>

      {done ? (
        <p className="mt-5 text-sm text-code">
          <InlineText text={practice.successFeedback} />
        </p>
      ) : (
        <Button className="mt-5" onClick={handleDone}>
          Saya sudah mencoba, tandai selesai
        </Button>
      )}
    </div>
  );
}
