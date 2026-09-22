"use client";

import { useState } from "react";
import { runPython, type RunResult } from "@/lib/pyodide";
import { Button } from "@/components/ui/Button";

export default function CodeRunner({
  starterCode,
  onCheck,
  checkLabel,
}: {
  starterCode: string;
  // Called only when the "check" button is used (not on a plain run) -
  // this is what triggers grading/marking a lesson complete.
  onCheck?: (result: RunResult) => void;
  // If provided, a second button is shown next to "Jalankan" that runs
  // the code AND calls onCheck. If omitted, only the plain "Jalankan"
  // (run, no grading) button is shown.
  checkLabel?: string;
}) {
  const [code, setCode] = useState(starterCode);
  const [result, setResult] = useState<RunResult | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "running">("idle");
  const [pendingAction, setPendingAction] = useState<"run" | "check" | null>(null);

  async function execute(action: "run" | "check") {
    setPendingAction(action);
    setStatus((s) => (s === "idle" ? "loading" : "running"));
    try {
      const r = await runPython(code);
      setResult(r);
      if (action === "check") onCheck?.(r);
    } catch (e) {
      const r = { stdout: "", error: "Python runtime gagal dimuat. Coba lagi." };
      setResult(r);
      if (action === "check") onCheck?.(r);
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

  return (
    <div className="overflow-hidden rounded-lg border border-line">
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={Math.max(4, code.split("\n").length + 1)}
        spellCheck={false}
        className="w-full resize-none bg-ink px-4 py-3 font-mono text-sm text-white outline-none"
      />
      <div className="flex items-center gap-2 border-t border-line bg-white/60 px-4 py-2">
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
