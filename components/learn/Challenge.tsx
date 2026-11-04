"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CodePractice } from "@/content/types";
import { checkOutput } from "@/lib/checker";
import { markLessonComplete } from "@/lib/progress";
import { rememberPassedFiles } from "@/lib/passed-code";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import CodeRunner from "./CodeRunner";
import { getEntry, getPracticeFiles } from "@/lib/lesson-files";
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
  // The full answer is one tap away and cannot be hidden again, so ask first (a pop-up).
  const [confirmOpen, setConfirmOpen] = useState(false);
  const hintsLeft = practice.hints.length - hintsShown;
  const [feedback, setFeedback] = useState<{ passed: boolean; message: string } | null>(
    null
  );

  async function handleResult(
    result: { stdout: string; error: string | null },
    files: Record<string, string>
  ) {
    const outcome = checkOutput(result.stdout, result.error, practice.checker, files);
    setFeedback(outcome);
    if (outcome.passed) {
      // Remember the passing code on this device (multi-file lessons only), so the
      // project download can contain code that really works. Best effort.
      void rememberPassedFiles(chapterSlug, lessonId, files, (practice.files ?? []).filter((f) => f.editable !== false).map((f) => f.name));
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
          files={getPracticeFiles(practice)}
          entry={getEntry(practice)}
          stdin={practice.stdin}
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

      {!feedback?.passed && (practice.answerHint || practice.answerFiles) && (
        <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-3">
          {!answerShown ? (
            <Button
              type="button"
              variant="ghost"
              className="px-0 text-sm font-medium text-amber-800 underline"
              onClick={() => setConfirmOpen(true)}
            >
              ⚠️ Lihat Jawaban Lengkap (Spoiler! Coba dulu sendiri sebelum klik ini)
            </Button>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                ⚠️ Spoiler — Jawaban Lengkap
              </p>
              {practice.answerFiles ? (
                Object.entries(practice.answerFiles).map(([name, code]) => (
                  <div key={name} className="mt-3">
                    <p className="font-mono text-xs font-medium text-amber-900">{name}</p>
                    <CodeBlock code={code} size="sm" wrap className="mt-1" />
                  </div>
                ))
              ) : (
                <CodeBlock code={practice.answerHint ?? ""} size="sm" wrap className="mt-2" />
              )}
            </>
          )}
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Lihat jawaban lengkap?"
        confirmLabel="Ya, tampilkan jawaban"
        cancelLabel="Batal, coba lagi sendiri"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          setAnswerShown(true);
        }}
      >
        <p>
          Jawaban lengkap akan langsung ditampilkan. Kamu belajar paling banyak saat mencoba sendiri dulu, termasuk
          ketika kodemu error lalu kamu perbaiki.
        </p>
        {hintsLeft > 0 && (
          <p className="font-medium text-ink">
            Kamu masih punya {hintsLeft} hint yang belum dibuka. Coba hint dulu, ya.
          </p>
        )}
      </ConfirmDialog>
    </div>
  );
}
