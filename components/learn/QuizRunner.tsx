"use client";

import { useState } from "react";
import type { QuizPractice } from "@/content/types";
import { checkQuizAnswer } from "@/lib/checker";
import { markLessonComplete } from "@/lib/progress";
import { Button } from "@/components/ui/Button";

export default function QuizRunner({
  practice,
  chapterSlug,
  lessonId,
}: {
  practice: QuizPractice;
  chapterSlug: string;
  lessonId: string;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [passed, setPassed] = useState(false);

  async function handleSubmit() {
    if (selected === null) return;
    const result = checkQuizAnswer(selected, practice.correctIndex);
    setSubmitted(true);
    setPassed(result.passed);
    if (result.passed) {
      await markLessonComplete(chapterSlug, lessonId);
    }
  }

  function tryAgain() {
    setSubmitted(false);
    setSelected(null);
  }

  return (
    <div>
      <p className="text-sm text-ink">{practice.question}</p>

      <div className="mt-4 space-y-2">
        {practice.options.map((option, i) => {
          const isSelected = selected === i;
          const isCorrectAnswer = submitted && i === practice.correctIndex;
          const isWrongSelected = submitted && isSelected && i !== practice.correctIndex;

          return (
            <button
              key={i}
              type="button"
              disabled={submitted}
              onClick={() => setSelected(i)}
              className={`block w-full rounded-md border px-4 py-2.5 text-left text-sm transition-colors disabled:cursor-default ${
                isCorrectAnswer
                  ? "border-code bg-code-bg text-ink"
                  : isWrongSelected
                  ? "border-amber-600 bg-amber-50 text-ink"
                  : isSelected
                  ? "border-ink bg-ink/5 text-ink"
                  : "border-line bg-white text-ink hover:border-ink/40"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={selected === null}
          className="mt-4"
        >
          Jawab
        </Button>
      ) : (
        <div className="mt-4">
          <p className={`text-sm font-medium ${passed ? "text-code" : "text-amber-700"}`}>
            {passed ? "Benar!" : "Belum tepat."}
          </p>
          <p className="mt-1 text-sm text-ink-soft">{practice.explanation}</p>
          {!passed && (
            <Button type="button" variant="ghost" className="mt-2 px-0 text-sm underline" onClick={tryAgain}>
              Coba lagi
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
