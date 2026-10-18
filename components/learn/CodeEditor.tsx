"use client";

import { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { indentLess } from "@codemirror/commands";
import { createEditorExtensions, insertIndentAtCursor } from "@/lib/editor-extensions";

// Python code editor (CodeMirror 6). Loaded lazily by CodeRunner via
// next/dynamic so quiz / theory-only lessons never download it.
//
// Reusable on purpose: the project workspace will use this same component
// for each file tab (swap `value`), and `readOnly` shows spoiler solutions.
export default function CodeEditor({
  value,
  onChange,
  readOnly = false,
}: {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  });

  // Create the editor once (re-create only if readOnly flips).
  useEffect(() => {
    const view = new EditorView({
      parent: hostRef.current!,
      state: EditorState.create({
        doc: value,
        extensions: createEditorExtensions({
          readOnly,
          onChange: (doc) => onChangeRef.current?.(doc),
        }),
      }),
    });
    viewRef.current = view;
    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // `value` is intentionally read only at creation; later changes are
    // pushed in by the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readOnly]);

  // Keep the editor in sync when the parent replaces the code (e.g. a new
  // lesson's starter). Typing round-trips through onChange, so the doc
  // already equals `value` and nothing is dispatched.
  useEffect(() => {
    const view = viewRef.current;
    if (view && view.state.doc.toString() !== value) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: value },
      });
    }
  }, [value]);

  function run(command: typeof indentLess) {
    const view = viewRef.current;
    if (!view) return;
    command(view);
    view.focus();
  }

  return (
    // min-w-0: a long (unwrapped) line must scroll inside the editor, never
    // widen the page.
    <div className="min-w-0 max-w-full">
      <div ref={hostRef} className="min-w-0" />
      {!readOnly && (
        <div className="flex items-center justify-between gap-2 border-t border-white/10 bg-ink px-3 py-1.5 text-xs text-white/50">
          {/* Desktop / mouse: keyboard hint. Phone / touch: indent buttons
              (touch keyboards have no Tab key). */}
          <span className="hidden [@media(pointer:fine)]:inline">
            Tab = indentasi · Esc lalu Tab = pindah fokus
          </span>
          <div className="flex gap-2 [@media(pointer:fine)]:hidden">
            <button
              type="button"
              aria-label="Tambah indentasi"
              // Keep the keyboard open / editor focused when tapped.
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => run(insertIndentAtCursor)}
              className="rounded border border-white/20 px-3 py-1.5 text-white/80"
            >
              → Indent
            </button>
            <button
              type="button"
              aria-label="Kurangi indentasi"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => run(indentLess)}
              className="rounded border border-white/20 px-3 py-1.5 text-white/80"
            >
              ← Outdent
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
