"use client";

import { useState } from "react";
import { runPython, type RunResult } from "@/lib/pyodide";
import { Button } from "@/components/ui/Button";

export default function CodeRunner({
  starterCode,
  onResult,
  runLabel = "Jalankan",
}: {
  starterCode: string;
  onResult?: (result: RunResult) => void;
  runLabel?: string;
}) {
  const [code, setCode] = useState(starterCode);
  const [result, setResult] = useState<RunResult | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "running">("idle");

  async function handleRun() {
    setStatus((s) => (s === "idle" ? "loading" : "running"));
    try {
      const r = await runPython(code);
      setResult(r);
      onResult?.(r);
    } catch (e) {
      const r = { stdout: "", error: "Python runtime gagal dimuat. Coba lagi." };
      setResult(r);
      onResult?.(r);
    } finally {
      setStatus("idle");
    }
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
      <div className="flex items-center justify-between border-t border-line bg-white/60 px-4 py-2">
        <Button
          type="button"
          onClick={handleRun}
          disabled={status !== "idle"}
          className="px-4 py-1.5"
        >
          {status === "loading"
            ? "Memuat Python..."
            : status === "running"
            ? "Menjalankan..."
            : runLabel}
        </Button>
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
