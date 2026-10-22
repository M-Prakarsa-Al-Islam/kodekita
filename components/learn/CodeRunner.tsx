"use client";

import { useEffect, useId, useState } from "react";
import dynamic from "next/dynamic";
import type { LessonFile } from "@/content/types";
import { runProject, stopRun, type RunResult } from "@/lib/pyodide";
import { useFilesDraft } from "@/lib/use-code-draft";
import { DEFAULT_ENTRY, defaultActiveFile, isEditable } from "@/lib/lesson-files";
import { Button } from "@/components/ui/Button";

// CodeMirror is ~130 kB gzipped: load it only on lessons that have a code
// editor, never for quiz / theory-only pages.
const CodeEditor = dynamic(() => import("./CodeEditor"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[8rem] bg-ink px-4 py-3 font-mono text-sm text-white/50">
      Memuat editor...
    </div>
  ),
});

// "Budi\n3\n" -> ["Budi", "3"]; blank box -> []. A trailing newline is not an
// extra empty answer, but blank lines in the middle are.
function parseLines(text: string): string[] {
  if (text === "") return [];
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  if (lines[lines.length - 1] === "") lines.pop();
  return lines;
}

export default function CodeRunner({
  files,
  entry = DEFAULT_ENTRY,
  stdin,
  onCheck,
  checkLabel,
  draft,
}: {
  // The lesson's files, as the learner first sees them. One file = the classic
  // single editor (no tabs); several = tabs. The author decides which files
  // exist; the learner can't add, delete or rename any.
  files: LessonFile[];
  // The file that is run (as __main__).
  entry?: string;
  // Scripted answers for input(). If defined, an "Input program" box appears,
  // prefilled with them; "Cek Jawaban" always uses these (deterministic).
  stdin?: string[];
  // If provided, what the learner types is remembered in this browser (keyed
  // by user + lesson + file) so it survives a refresh, and a "Reset kode"
  // button appears. If omitted, the editor starts from the starter every time.
  draft?: { chapterSlug: string; lessonId: string };
  // Called only when the "check" button is used (not on a plain run) -
  // this is what triggers grading/marking a lesson complete. Receives every
  // file's current content (file name -> text).
  onCheck?: (result: RunResult, files: Record<string, string>) => void;
  // If provided, a second button is shown next to "Jalankan" that runs
  // the code AND calls onCheck. If omitted, only the plain "Jalankan"
  // (run, no grading) button is shown.
  checkLabel?: string;
}) {
  const uid = useId();
  const multi = files.length > 1;
  const defaultInput = (stdin ?? []).join("\n");
  const lessonSignature = JSON.stringify([files, entry, stdin]);

  const { files: contents, setFile, reset, restored, changed, hasDraft, starters } =
    useFilesDraft(draft, files);

  const [active, setActive] = useState(() => defaultActiveFile(files, entry));
  const [inputText, setInputText] = useState(defaultInput);
  const [resetToken, setResetToken] = useState(0);
  const [result, setResult] = useState<RunResult | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "running">("idle");
  const [pendingAction, setPendingAction] = useState<"run" | "check" | null>(null);

  // A different lesson reuses this component: start its tab and input afresh.
  useEffect(() => {
    setActive(defaultActiveFile(files, entry));
    setInputText(defaultInput);
    setResult(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonSignature]);

  const activeName = files.some((f) => f.name === active)
    ? active
    : defaultActiveFile(files, entry);
  const activeFile = files.find((f) => f.name === activeName) ?? files[0];

  async function execute(action: "run" | "check") {
    setPendingAction(action);
    setStatus((s) => (s === "idle" ? "loading" : "running"));
    // "Cek Jawaban" always uses the lesson's own input so the expected output
    // is deterministic; "Jalankan" uses whatever is in the box.
    const lines = action === "check" ? stdin ?? [] : parseLines(inputText);
    try {
      const r = await runProject({
        files: contents,
        entry,
        stdin: lines,
        onStart: () => setStatus("running"),
      });
      setResult(r);
      if (action === "check") onCheck?.(r, contents);
    } catch (e) {
      const r = { stdout: "", error: "Python runtime gagal dimuat. Coba lagi." };
      setResult(r);
      if (action === "check") onCheck?.(r, contents);
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
    const message = multi
      ? "Kembalikan semua file ke kode awal? Kode yang kamu tulis akan hilang."
      : "Kembalikan ke kode awal? Kode yang kamu tulis akan hilang.";
    if (window.confirm(message)) {
      reset();
      setResetToken((n) => n + 1);
    }
  }

  // Arrow keys / Home / End move between tabs (the ARIA tabs pattern).
  function onTabKeyDown(e: React.KeyboardEvent, index: number) {
    let next = -1;
    if (e.key === "ArrowRight") next = (index + 1) % files.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + files.length) % files.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = files.length - 1;
    if (next < 0) return;
    e.preventDefault();
    setActive(files[next].name);
    document.getElementById(`${uid}-tab-${next}`)?.focus();
  }

  const panelId = `${uid}-panel`;
  const activeIndex = files.findIndex((f) => f.name === activeName);

  return (
    <div className="overflow-hidden rounded-lg border border-line">
      {multi && (
        <div
          role="tablist"
          aria-label="File program"
          className="flex overflow-x-auto bg-[#0d1017]"
        >
          {files.map((f, i) => {
            const selected = f.name === activeName;
            const edited = isEditable(f) && contents[f.name] !== starters[f.name];
            return (
              <button
                key={f.name}
                id={`${uid}-tab-${i}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={panelId}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(f.name)}
                onKeyDown={(e) => onTabKeyDown(e, i)}
                className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-2.5 font-mono text-[0.8125rem] transition-colors ${
                  selected
                    ? "border-sun bg-ink text-white"
                    : "border-transparent text-white/55 hover:text-white"
                }`}
              >
                {f.name}
                {!isEditable(f) && (
                  <span className="rounded bg-white/10 px-1.5 py-0.5 text-[0.65rem] text-white/60">
                    baca saja
                  </span>
                )}
                {edited && (
                  <span aria-label="sudah kamu ubah" className="text-sun">
                    ●
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      <div
        id={panelId}
        role={multi ? "tabpanel" : undefined}
        aria-labelledby={multi && activeIndex >= 0 ? `${uid}-tab-${activeIndex}` : undefined}
      >
        <CodeEditor
          value={contents[activeName] ?? ""}
          onChange={(text) => setFile(activeName, text)}
          readOnly={!isEditable(activeFile)}
          fileId={activeName}
          resetToken={resetToken}
        />
      </div>

      {stdin !== undefined && (
        <div className="border-t border-line bg-white/60 px-4 py-3">
          <label htmlFor={`${uid}-stdin`} className="text-xs font-medium text-ink">
            Input program{" "}
            <span className="font-normal text-ink-soft">— satu baris untuk setiap input()</span>
          </label>
          <textarea
            id={`${uid}-stdin`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={Math.min(4, Math.max(1, parseLines(inputText).length))}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            className="mt-1 block w-full resize-y rounded border border-line bg-white px-3 py-2 font-mono text-sm text-ink"
          />
          {checkLabel && inputText !== defaultInput && (
            <p className="mt-1 text-xs text-ink-soft">
              Catatan: &quot;{checkLabel}&quot; selalu memakai input bawaan lesson (
              {(stdin ?? []).join(" · ")}), bukan isi kotak ini.
            </p>
          )}
        </div>
      )}

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
        {status === "running" && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => stopRun()}
            className="px-4 py-1.5"
          >
            Hentikan
          </Button>
        )}
        {multi && <span className="text-xs text-ink-soft">menjalankan {entry}</span>}
        {draft && (hasDraft || changed) && (
          <div className="ml-auto flex items-center gap-3 text-xs text-ink-soft">
            {hasDraft && (
              <span>
                {restored ? "Kode terakhirmu dipulihkan · " : ""}tersimpan di perangkat ini
              </span>
            )}
            {changed && (
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
