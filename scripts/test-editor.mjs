// Tests for the code editor's key behaviours (lib/editor-extensions.ts).
// Runs the exact CodeMirror commands that the keymap binds, against an
// EditorState in Node (no DOM needed). What this CANNOT prove: that the
// browser delivers the Tab key to the editor, mobile keyboards, focus
// handling, Esc-then-Tab - those need the manual checklist in
// PROJECT_DESIGN.md (Esc-then-Tab is CodeMirror's built-in tab-focus mode).
//
// Run: node scripts/test-editor.mjs
import { createRequire } from "node:module";
import fs from "node:fs";
import ts from "typescript";

const require = createRequire(import.meta.url);
const { EditorState, EditorSelection } = require("@codemirror/state");
const {
  indentMore,
  indentLess,
  insertNewlineAndIndent,
  deleteCharBackward,
} = require("@codemirror/commands");

const src = fs.readFileSync(new URL("../lib/editor-extensions.ts", import.meta.url), "utf8");
const js = ts.transpileModule(src, { compilerOptions: { module: "CommonJS", target: "ES2020" } }).outputText;
const mod = { exports: {} };
new Function("require", "module", "exports", js)(require, mod, mod.exports);
const { createEditorExtensions, insertIndentAtCursor, INDENT } = mod.exports;

function make(doc, anchor, head) {
  return EditorState.create({
    doc,
    selection: EditorSelection.single(anchor, head ?? anchor),
    extensions: createEditorExtensions({}),
  });
}
// Run a command; return { doc, changed }.
function run(cmd, state) {
  let next = state;
  let dispatched = false;
  const handled = cmd({
    state,
    dispatch: (tr) => {
      dispatched = true;
      next = tr.state;
    },
  });
  return { doc: next.doc.toString(), changed: dispatched, handled, head: next.selection.main.head, state: next };
}

let failures = 0;
let count = 0;
function check(name, actual, expected) {
  count++;
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"} - ${name}${ok ? "" : `\n      expected ${JSON.stringify(expected)}\n      got      ${JSON.stringify(actual)}`}`);
}

check("INDENT is four spaces", INDENT, "    ");

// --- Tab: inserts spaces AT THE CURSOR (the bug the owner reported was that
// it indented the whole line instead) ---
const tab = (doc, anchor, head) => run(insertIndentAtCursor, make(doc, anchor, head));
check("Tab at line start inserts 4 spaces before the text", tab("x = 1", 0).doc, "    x = 1");
check("Tab at line start leaves the cursor before the text", tab("x = 1", 0).head, 4);
check("Tab in the MIDDLE of a line inserts at the cursor, not at line start (col 1 -> next stop 4)", tab("x = 1", 1).doc, "x    = 1");
check("...and the cursor ends up right after the inserted spaces", tab("x = 1", 1).head, 4);
check("Tab at the END of a line appends spaces, the line is not shifted", tab("print(1)", 8).doc, "print(1)    ");
check("Tab at column 6 inserts 2 spaces (to the stop at 8)", tab("abcdef", 6).doc, "abcdef  ");
check("Tab at a tab stop (column 4) inserts a full 4", tab("abcd", 4).doc, "abcd    ");
check("Tab on the empty line after 'if x:' gives 4 spaces", tab("if x:\n", 6).doc, "if x:\n    ");
check("Tab after auto-indent (cursor at col 4 of '    ') goes to 8", tab("if x:\n    ", 10).doc, "if x:\n        ");
check("Tab only touches the cursor's line (cursor at the start of 'b')", tab("a\nb\nc", 2).doc, "a\n    b\nc");
check("Tab at the end of 'b' (col 1 -> stop 4) adds 3 spaces on that line only", tab("a\nb\nc", 3).doc, "a\nb   \nc");
check("Tab with several lines selected indents every line", tab("a\nb\nc", 0, 5).doc, "    a\n    b\n    c");
check("Tab with a selection inside one line indents that line (selection is not replaced)", tab("hello", 1, 3).doc, "    hello");
check("Tab never inserts a tab character", tab("x", 1).doc.includes("\t"), false);
{
  const ro = EditorState.create({ doc: "x", extensions: createEditorExtensions({ readOnly: true }) });
  const r = run(insertIndentAtCursor, ro);
  check("Tab is refused in a read-only editor", [r.handled, r.changed], [false, false]);
}
{
  // Two cursors (multi-cursor): each gets its own spaces at its own place.
  const st = EditorState.create({
    doc: "ab\ncd",
    selection: EditorSelection.create([EditorSelection.cursor(1), EditorSelection.cursor(4)]),
    extensions: [createEditorExtensions({}), EditorState.allowMultipleSelections.of(true)],
  });
  check("Tab with two cursors inserts at both", run(insertIndentAtCursor, st).doc, "a   b\nc   d");
}

// --- Shift+Tab (indentLess) ---
check("Shift+Tab removes one level (8 -> 4 spaces)", run(indentLess, make("        x", 9)).doc, "    x");
check("Shift+Tab on an unindented line changes nothing", run(indentLess, make("x", 1)).doc, "x");
check("Shift+Tab with several lines selected dedents all", run(indentLess, make("    a\n    b", 0, 11)).doc, "a\nb");

// --- Enter (auto-indent) ---
check("Enter after 'if x:' indents 4 spaces", run(insertNewlineAndIndent, make("if x:", 5)).doc, "if x:\n    ");
check("Enter after 'for i in range(3):' indents", run(insertNewlineAndIndent, make("for i in range(3):", 18)).doc, "for i in range(3):\n    ");
// Realistic case: a line that already sits inside a block (a lone indented
// line with no enclosing block is invalid Python, so there is nothing to keep).
check("Enter after a line inside a block keeps the indentation", run(insertNewlineAndIndent, make("if x:\n    y = 1", 15)).doc, "if x:\n    y = 1\n    ");
check("Enter after a nested block opener indents one more level", run(insertNewlineAndIndent, make("if x:\n    if y:", 15)).doc, "if x:\n    if y:\n        ");
check("Enter on an unindented plain line adds no indentation", run(insertNewlineAndIndent, make("x = 1", 5)).doc, "x = 1\n");
check("Enter after 'def f():' indents", run(insertNewlineAndIndent, make("def f():", 8)).doc, "def f():\n    ");

// --- Backspace over indentation ---
check("Backspace in 8 leading spaces removes a whole level (-> 4)", run(deleteCharBackward, make("        ", 8)).doc, "    ");
check("Backspace in 4 leading spaces removes them all", run(deleteCharBackward, make("    ", 4)).doc, "");
check("Backspace after text removes one character", run(deleteCharBackward, make("    abc", 7)).doc, "    ab");

// --- The configuration itself ---
{
  const state = make("", 0);
  check("tab size is 4", state.tabSize, 4);
  check("indent unit is 4 spaces", state.facet(require("@codemirror/language").indentUnit), "    ");
  // Long lines must scroll sideways, not wrap (owner's request).
  const src2 = fs.readFileSync(new URL("../lib/editor-extensions.ts", import.meta.url), "utf8");
  check("line wrapping is not enabled (uses `EditorView.lineWrapping` only in a comment)",
    /^[^/\n]*EditorView\.lineWrapping/m.test(src2), false);
  check("read-only option blocks edits", (() => {
    const ro = EditorState.create({ doc: "x", extensions: createEditorExtensions({ readOnly: true }) });
    return ro.readOnly;
  })(), true);
}

console.log(`\n${count - failures}/${count} editor test-cases behaved as expected.`);
process.exit(failures ? 1 : 0);
