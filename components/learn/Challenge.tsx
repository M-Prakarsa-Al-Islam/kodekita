"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CodePractice } from "@/content/types";
import { checkOutput } from "@/lib/checker";
import { markLessonComplete } from "@/lib/progress";
import CodeRunner from "./CodeRunner";
import { Button } from "@/components/ui/Button";
import CodeBlock from "@/components/learn/CodeBlock";
import LessonText, { InlineText } from "@/components/learn/LessonText";

export default function Challenge({
  practice,
  chapterSlug,
  lessonId,
}: {
  practice: CodePractice;
  chapterSlug: string;
  lessonId: string;
}) {
  const router = useRouter();
  const [hintsShown, setHintsShown] = useState(0);
  const [answerShown, setAnswerShown] = useState(false);
  const [feedback, setFeedback] = useState<{ passed: boolean; message: string } | null>(
    null
  );

  async function handleResult(
    result: { stdout: string; error: string | null },
    code: string
  ) {
    const outcome = checkOutput(result.stdout, result.error, practice.checker, code);
    setFeedback(outcome);
    if (outcome.passed) {
      await markLessonComplete(chapterSlug, lessonId);
      // Re-render the server parts of the page so the progress bar, segments
      // and ticks update right away (client state, e.g. the code, is kept).
      router.refresh();
    }
  }

  return (
    <div>
      <LessonText text={practice.instructions} />

      <div className="mt-6">
        <CodeRunner
          starterCode={practice.starterCode}
          draft={{ chapterSlug, lessonId }}
          onCheck={handleResult}
          checkLabel="Cek Jawaban"
        />
      </div>

      {feedback && (
        <p
          className={`mt-4 whitespace-pre-line text-[0.9375rem] font-medium leading-relaxed ${
            feedback.passed ? "text-code" : "text-amber-700"
          }`}
        >
          {feedback.passed ? <InlineText text={practice.successFeedback} /> : feedback.message}
        </p>
      )}

      {!feedback?.passed && practice.hints.length > 0 && (
        <div className="mt-4">
          {practice.hints.slice(0, hintsShown).map((hint, i) => (
            <p key={i} className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">
              <span className="font-medium text-ink">Hint {i + 1}:</span>{" "}
              <InlineText text={hint} />
            </p>
          ))}
          {hintsShown < practice.hints.length && (
            <Button
              type="button"
              variant="ghost"
              className="mt-2 px-0 text-sm underline"
              onClick={() => setHintsShown((n) => n + 1)}
            >
              Tampilkan hint {hintsShown + 1}
            </Button>
          )}
        </div>
      )}

      {!feedback?.passed && practice.answerHint && (
        <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-3">
          {!answerShown ? (
            <Button
              type="button"
              variant="ghost"
              className="px-0 text-sm font-medium text-amber-800 underline"
              onClick={() => setAnswerShown(true)}
            >
              ⚠️ Lihat Jawaban Lengkap (Spoiler! Coba dulu sendiri sebelum klik ini)
            </Button>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                ⚠️ Spoiler — Jawaban Lengkap
              </p>
              <CodeBlock code={practice.answerHint} size="sm" wrap className="mt-2" />
            </>
          )}
        </div>
      )}
    </div>
  );
}
