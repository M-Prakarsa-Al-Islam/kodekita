// CodeMirror 6 configuration for the in-browser Python editor.
//
// Kept free of React so the key behaviours (Tab / Shift-Tab indent,
// auto-indent on Enter, Backspace over indentation) can be unit-tested in
// Node: see scripts/test-editor.mjs. The React wrapper is
// components/learn/CodeEditor.tsx.
//
// Keyboard accessibility: Tab indents, which would trap keyboard-only users
// inside the editor. CodeMirror (>= 6.37, we have 6.43) has a built-in
// escape hatch: press Esc, then Tab within 2 seconds, and Tab moves focus
// out like a normal control; any other key cancels it. We rely on that
// rather than re-implementing it (an earlier hand-written version
// duplicated it with different timing). The hint under the editor tells
// users. If the package is ever downgraded below that, this breaks.

import {
  EditorSelection,
  EditorState,
  countColumn,
  type Extension,
  type StateCommand,
} from "@codemirror/state";
import {
  EditorView,
  highlightActiveLine,
  keymap,
  lineNumbers,
} from "@codemirror/view";
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentLess,
  indentMore,
} from "@codemirror/commands";
import { python } from "@codemirror/lang-python";
import {
  HighlightStyle,
  getIndentUnit,
  indentUnit,
  syntaxHighlighting,
} from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

// Python convention (and what every lesson uses): 4 spaces, never a tab
// character. Mixing them is a TabError in Python.
export const INDENT = "    ";

// Tab key / "Indent" button. Like VS Code:
//  - nothing selected: insert spaces AT THE CURSOR, up to the next 4-column
//    tab stop (so Tab in the middle of a line moves only the text to the
//    right of the cursor, it does not shift the whole line);
//  - something selected: indent every selected line.
// (CodeMirror's built-in `indentMore` always indents the whole line, which
// is what an earlier version of this editor did - wrong for typing.)
export const insertIndentAtCursor: StateCommand = ({ state, dispatch }) => {
  if (state.readOnly) return false;
  if (state.selection.ranges.some((range) => !range.empty)) {
    return indentMore({ state, dispatch });
  }
  const unit = getIndentUnit(state);
  dispatch(
    state.update(
      state.changeByRange((range) => {
        const line = state.doc.lineAt(range.head);
        const column = countColumn(
          line.text.slice(0, range.head - line.from),
          state.tabSize
        );
        const spaces = " ".repeat(unit - (column % unit));
        return {
          changes: { from: range.head, insert: spaces },
          range: EditorSelection.cursor(range.head + spaces.length),
        };
      }),
      { scrollIntoView: true, userEvent: "input.indent" }
    )
  );
  return true;
};

// Colours chosen for the dark `ink` background (#171B24) and the site palette.
const highlightStyle = HighlightStyle.define([
  { tag: [t.keyword, t.controlKeyword, t.definitionKeyword, t.operatorKeyword], color: "#F2A93B" },
  { tag: [t.string, t.special(t.string)], color: "#7ED6B5" },
  { tag: [t.number, t.bool, t.null], color: "#F5B58C" },
  { tag: t.comment, color: "rgba(255,255,255,0.45)", fontStyle: "italic" },
  { tag: [t.function(t.variableName), t.function(t.definition(t.variableName))], color: "#8CC8FF" },
  { tag: [t.className, t.definition(t.className)], color: "#8CC8FF" },
]);

const theme = EditorView.theme(
  {
    "&": {
      backgroundColor: "#171B24",
      color: "#FFFFFF",
      fontSize: "14px",
    },
    "&.cm-focused": {
      // Visible focus ring (the old textarea had none) - also signals that
      // Tab now indents.
      outline: "2px solid rgba(242,169,59,0.55)",
      outlineOffset: "-2px",
    },
    ".cm-scroller": {
      overflowX: "auto",
      fontFamily: 'var(--font-mono), "JetBrains Mono", ui-monospace, monospace',
      lineHeight: "1.6",
      minHeight: "112px",
    },
    ".cm-content": { padding: "12px 0", caretColor: "#F2A93B" },
    ".cm-line": { padding: "0 16px 0 8px" },
    ".cm-cursor, .cm-dropCursor": { borderLeftColor: "#F2A93B" },
    ".cm-content ::selection": { backgroundColor: "rgba(242,169,59,0.35)" },
    ".cm-activeLine": { backgroundColor: "rgba(255,255,255,0.05)" },
    ".cm-gutters": {
      backgroundColor: "#171B24",
      color: "rgba(255,255,255,0.35)",
      border: "none",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "rgba(255,255,255,0.05)",
      color: "rgba(255,255,255,0.7)",
    },
    ".cm-lineNumbers .cm-gutterElement": { padding: "0 8px 0 12px", minWidth: "2.2em" },
  },
  { dark: true }
);

export function createEditorExtensions(opts: {
  onChange?: (doc: string) => void;
  readOnly?: boolean;
}): Extension[] {
  const extensions: Extension[] = [
    lineNumbers(),
    highlightActiveLine(),
    history(),
    indentUnit.of(INDENT),
    EditorState.tabSize.of(4),
    python(),
    syntaxHighlighting(highlightStyle),
    // Deliberately NO EditorView.lineWrapping: a long line stays one line
    // and the editor scrolls horizontally (owner's request).
    theme,
    // Phone keyboards: smart quotes / auto-capitalisation would corrupt code.
    EditorView.contentAttributes.of({
      autocapitalize: "off",
      autocorrect: "off",
      autocomplete: "off",
      spellcheck: "false",
      "aria-label": "Editor kode Python",
    }),
    // Tab: spaces at the cursor (or indent selected lines); Shift-Tab:
    // dedent the line(s). Indent unit is 4 spaces.
    keymap.of([
      { key: "Tab", run: insertIndentAtCursor, shift: indentLess },
      ...defaultKeymap,
      ...historyKeymap,
    ]),
  ];
  if (opts.onChange) {
    const onChange = opts.onChange;
    extensions.push(
      EditorView.updateListener.of((update) => {
        if (update.docChanged) onChange(update.state.doc.toString());
      })
    );
  }
  if (opts.readOnly) {
    extensions.push(EditorState.readOnly.of(true), EditorView.editable.of(false));
  }
  return extensions;
}
