"use client";

import { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { indentLess } from "@codemirror/commands";
import { createEditorExtensions, insertIndentAtCursor } from "@/lib/editor-extensions";

// Python code editor (CodeMirror 6). Loaded lazily by CodeRunner via
// next/dynamic so quiz / theory-only lessons never download it.
//
// ONE editor view shows ONE file at a time. `fileId` says which file `value`
// is; when it changes, the editor swaps in that file's own CodeMirror state
// (content, cursor, undo history), so switching tabs does not lose Ctrl+Z.
// The parent owns the text (`value` / `onChange`); a cached state whose text
// no longer matches `value` (e.g. a draft was restored) is discarded.
export default function CodeEditor({
  value,
  onChange,
  readOnly = false,
  fileId = "main",
  resetToken = 0,
}: {
  value: string;
  onChange?: (value: string) => void;
  // Per file: a read-only file (e.g. a data file) is shown but can't be edited.
  readOnly?: boolean;
  fileId?: string;
  // Bump this when the parent replaces ALL files at once (e.g. "Reset kode"):
  // the cached per-file states are dropped.
  resetToken?: number;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const statesRef = useRef(new Map<string, EditorState>());
  const activeFileRef = useRef(fileId);

  useEffect(() => {
    onChangeRef.current = onChange;
  });

  function makeState(doc: string, ro: boolean) {
    return EditorState.create({
      doc,
      extensions: createEditorExtensions({
        readOnly: ro,
        onChange: (text) => onChangeRef.current?.(text),
      }),
    });
  }

  // Create the editor once.
  useEffect(() => {
    const view = new EditorView({
      parent: hostRef.current!,
      state: makeState(value, readOnly),
    });
    viewRef.current = view;
    const states = statesRef.current;
    return () => {
      view.destroy();
      viewRef.current = null;
      states.clear();
    };
    // `value` / `readOnly` are read only at creation; later changes arrive
    // through the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Switching file: park the current state, load (or build) the next one.
  useEffect(() => {
    const view = viewRef.current;
    if (!view || activeFileRef.current === fileId) return;
    statesRef.current.set(activeFileRef.current, view.state);
    const cached = statesRef.current.get(fileId);
    const next =
      cached && cached.doc.toString() === value && cached.readOnly === readOnly
        ? cached
        : makeState(value, readOnly);
    view.setState(next);
    activeFileRef.current = fileId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileId]);

  // The parent replaced every file: forget the parked states.
  useEffect(() => {
    statesRef.current.clear();
  }, [resetToken]);

  // Keep the shown file in sync when the parent replaces its text (a restored
  // draft, a new starter). Typing round-trips through onChange, so the doc
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
      <div className="flex items-center justify-between gap-2 border-t border-white/10 bg-ink px-3 py-1.5 text-xs text-white/50">
        {readOnly ? (
          <span>File ini hanya untuk dibaca.</span>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
