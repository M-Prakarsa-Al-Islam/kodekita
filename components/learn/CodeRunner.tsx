"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { runPython, type RunResult } from "@/lib/pyodide";
import { useCodeDraft } from "@/lib/use-code-draft";
import { Button } from "@/components/ui/Button";

// CodeMirror is ~120 kB gzipped: load it only on lessons that have a code
// editor, never for quiz / theory-only pages.
const CodeEditor = dynamic(() => import("./CodeEditor"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[8rem] bg-ink px-4 py-3 font-mono text-sm text-white/50">
      Memuat editor...
    </div>
  ),
});

export default function CodeRunner({
  starterCode,
  onCheck,
  checkLabel,
  draft,
}: {
  starterCode: string;
  // If provided, what the learner types is remembered in this browser (keyed
  // by user + lesson) so it survives a refresh, and a "Reset kode" button
  // appears. If omitted, the editor starts from the starter every time.
  draft?: { chapterSlug: string; lessonId: string };
  // Called only when the "check" button is used (not on a plain run) -
  // this is what triggers grading/marking a lesson complete.
  onCheck?: (result: RunResult, code: string) => void;
  // If provided, a second button is shown next to "Jalankan" that runs
  // the code AND calls onCheck. If omitted, only the plain "Jalankan"
  // (run, no grading) button is shown.
  checkLabel?: string;
}) {
  const { code, setCode, reset, restored, hasDraft } = useCodeDraft(draft, starterCode);
  const [result, setResult] = useState<RunResult | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "running">("idle");
  const [pendingAction, setPendingAction] = useState<"run" | "check" | null>(null);

  async function execute(action: "run" | "check") {
    setPendingAction(action);
    setStatus((s) => (s === "idle" ? "loading" : "running"));
    try {
      const r = await runPython(code);
      setResult(r);
      if (action === "check") onCheck?.(r, code);
    } catch (e) {
      const r = { stdout: "", error: "Python runtime gagal dimuat. Coba lagi." };
      setResult(r);
      if (action === "check") onCheck?.(r, code);
    } finally {
      setStatus("idle");
      setPendingAction(null);
    }
  }

  function label(action: "run" | "check", idleLabel: string) {
    if (status !== "idle" && pendingAction === action) {
      return status === "loading" ? "Memuat Python..." : "Menjalankan...";
    }
    return idleLabel;
  }

  function handleReset() {
    if (window.confirm("Kembalikan ke kode awal? Kode yang kamu tulis akan hilang.")) reset();
  }

  return (
    <div className="overflow-hidden rounded-lg border border-line">
      <CodeEditor value={code} onChange={setCode} />
      <div className="flex flex-wrap items-center gap-2 border-t border-line bg-white/60 px-4 py-2">
        <Button
          type="button"
          variant={checkLabel ? "secondary" : "primary"}
          onClick={() => execute("run")}
          disabled={status !== "idle"}
          className="px-4 py-1.5"
        >
          {label("run", "Jalankan")}
        </Button>
        {checkLabel && (
          <Button
            type="button"
            variant="primary"
            onClick={() => execute("check")}
            disabled={status !== "idle"}
            className="px-4 py-1.5"
          >
            {label("check", checkLabel)}
          </Button>
        )}
        {draft && (hasDraft || code !== starterCode) && (
          <div className="ml-auto flex items-center gap-3 text-xs text-ink-soft">
            {hasDraft && (
              <span>
                {restored ? "Kode terakhirmu dipulihkan · " : ""}tersimpan di perangkat ini
              </span>
            )}
            {code !== starterCode && (
              <button
                type="button"
                onClick={handleReset}
                disabled={status !== "idle"}
                className="underline hover:text-ink disabled:opacity-50"
              >
                Reset kode
              </button>
            )}
          </div>
        )}
      </div>
      {result && (
        <div className="border-t border-line bg-ink/95 px-4 py-3 font-mono text-sm text-white">
          {result.error ? (
            <p className="text-amber-300">{result.error}</p>
          ) : result.stdout ? (
            <pre className="whitespace-pre-wrap">{result.stdout}</pre>
          ) : (
            <p className="text-white/40">(tidak ada output)</p>
          )}
        </div>
      )}
    </div>
  );
}
