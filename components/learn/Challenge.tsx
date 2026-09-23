"use client";

import { useState } from "react";
import type { CodePractice } from "@/content/types";
import { checkOutput } from "@/lib/checker";
import { markLessonComplete } from "@/lib/progress";
import CodeRunner from "./CodeRunner";
import { Button } from "@/components/ui/Button";

export default function Challenge({
  practice,
  chapterSlug,
  lessonId,
}: {
  practice: CodePractice;
  chapterSlug: string;
  lessonId: string;
}) {
  const [hintsShown, setHintsShown] = useState(0);
  const [answerShown, setAnswerShown] = useState(false);
  const [feedback, setFeedback] = useState<{ passed: boolean; message: string } | null>(
    null
  );

  async function handleResult(result: { stdout: string; error: string | null }) {
    const outcome = checkOutput(result.stdout, result.error, practice.checker);
    setFeedback(outcome);
    if (outcome.passed) {
      await markLessonComplete(chapterSlug, lessonId);
    }
  }

  return (
    <div>
      <p className="whitespace-pre-line text-sm text-ink">{practice.instructions}</p>

      <div className="mt-4">
        <CodeRunner
          starterCode={practice.starterCode}
          onCheck={handleResult}
          checkLabel="Cek Jawaban"
        />
      </div>

      {feedback && (
        <p
          className={`mt-3 text-sm font-medium ${
            feedback.passed ? "text-code" : "text-amber-700"
          }`}
        >
          {feedback.passed ? practice.successFeedback : feedback.message}
        </p>
      )}

      {!feedback?.passed && practice.hints.length > 0 && (
        <div className="mt-4">
          {practice.hints.slice(0, hintsShown).map((hint, i) => (
            <p key={i} className="mt-1 text-sm text-ink-soft">
              Hint {i + 1}: {hint}
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
              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded bg-ink px-3 py-2 font-mono text-xs text-white">
                {practice.answerHint}
              </pre>
            </>
          )}
        </div>
      )}
    </div>
  );
}
