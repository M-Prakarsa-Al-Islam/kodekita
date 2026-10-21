// UI behaviour tests for the code editor, the file tabs, the Input box, Reset
// and the saved-code drafts, using the REAL components and CodeMirror in a
// simulated DOM (jsdom), with Pyodide and Supabase replaced by fakes.
// Run: node scripts/test-ui.cjs     (needs the `jsdom` devDependency)
//
// What this can NOT prove: how it looks, real mobile keyboards, real focus and
// scrolling in real browsers, or that Pyodide itself runs the code (that is
// scripts/test-runner.mjs and scripts/test-lessons-pyodide.mjs).
const { JSDOM } = require("jsdom");
const ts = require("typescript"), fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "..");
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://pymula.test/", pretendToBeVisual: true });
const w = dom.window;
for (const k of ["window","document","navigator","KeyboardEvent","MouseEvent","MutationObserver","Node","HTMLElement","getComputedStyle","requestAnimationFrame","cancelAnimationFrame","Event"]) { try { global[k]=w[k]; } catch { Object.defineProperty(global,k,{value:w[k],configurable:true}); } }
global.IS_REACT_ACT_ENVIRONMENT = true; global.Window = w.Window;
const rect={x:0,y:0,top:0,left:0,right:0,bottom:0,width:0,height:0,toJSON(){}};
w.Range.prototype.getClientRects=()=>[]; w.Range.prototype.getBoundingClientRect=()=>rect; w.Element.prototype.getClientRects=()=>[];
let confirmAnswer = true; w.confirm = () => confirmAnswer;

const React = require("react");
const { createRoot } = require("react-dom/client");
const { act } = require("react-dom/test-utils");
const { EditorView } = require("@codemirror/view");
const { undo } = require("@codemirror/commands");

const cache = {};
function load(file, shims = {}) {
  const js = ts.transpileModule(fs.readFileSync(path.join(ROOT, file), "utf8"), { compilerOptions: { module: "CommonJS", target: "ES2020", jsx: "react-jsx" } }).outputText;
  const m = { exports: {} };
  new Function("require", "module", "exports", js)((id) => (id in shims ? shims[id] : require(id)), m, m.exports);
  return m.exports;
}
let currentUser = "user-A";
const fakeSupabase = { createClient: () => ({ auth: { getSession: async () => ({ data: { session: currentUser ? { user: { id: currentUser } } : null } }) } }) };
const runCalls = []; let runResult = { stdout: "ok\n", error: null };
const fakePyodide = { runProject: async (o) => { runCalls.push(JSON.parse(JSON.stringify(o))); return runResult; } };
function build() {
  const editorLib = load("lib/editor-extensions.ts");
  const CodeEditor = load("components/learn/CodeEditor.tsx", { "@/lib/editor-extensions": editorLib }).default;
  const drafts = load("lib/code-drafts.ts");
  const lessonFiles = load("lib/lesson-files.ts");
  const hook = load("lib/use-code-draft.ts", { "@/lib/supabase/client": fakeSupabase, "@/lib/code-drafts": drafts });
  const dynamic = (loader) => function Dyn(props) { const [C, setC] = React.useState(null); React.useEffect(() => { loader().then((m) => setC(() => m.default)); }, []); return C ? React.createElement(C, props) : null; };
  const Button = ({ children, variant, ...rest }) => React.createElement("button", rest, children);
  const requireShim = { "next/dynamic": { default: dynamic }, "./CodeEditor": { default: CodeEditor }, "@/lib/pyodide": fakePyodide, "@/lib/use-code-draft": hook, "@/lib/lesson-files": lessonFiles, "@/components/ui/Button": { Button } };
  const CodeRunner = load("components/learn/CodeRunner.tsx", requireShim).default;
  return { CodeEditor, CodeRunner, drafts, hook };
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let fail = 0; const check = (n, ok, x = "") => { if (!ok) fail++; console.log(`${ok ? "PASS" : "FAIL"} - ${n} ${x}`); };
const viewOf = (c) => EditorView.findFromDOM(c.querySelector(".cm-editor"));
const typeInto = async (view, text) => act(async () => { view.dispatch({ changes: { from: view.state.doc.length, insert: text } }); });
async function mountEl(el) { const c = w.document.createElement("div"); w.document.body.appendChild(c); const root = createRoot(c); await act(async () => { root.render(el); }); await act(async () => { await sleep(40); }); return { c, root, rerender: async (e) => act(async () => { root.render(e); }), unmount: async () => act(async () => root.unmount()) }; }

(async () => {
  const { CodeEditor, CodeRunner } = build();

  // ================= CodeEditor: per-file state =================
  console.log("--- CodeEditor: switching files keeps each file's content and undo history");
  const log = []; const h = (id) => React.createElement(CodeEditor, { value: vals[id], onChange: (t) => { vals[active] = t; log.push([active, t]); }, fileId: active, readOnly: ro[active] || false, resetToken });
  let vals = { "main.py": "A\n", "fungsi.py": "B\n", "catatan.txt": "DATA\n" }, active = "main.py", ro = { "catatan.txt": true }, resetToken = 0;
  let m = await mountEl(h(active));
  let v = viewOf(m.c);
  check("starts on main.py", v.state.doc.toString() === "A\n");
  await typeInto(v, "a1\n"); await act(async () => { await sleep(650); }); await typeInto(v, "a2\n");
  check("typing in main.py updates its text via onChange", vals["main.py"] === "A\na1\na2\n", JSON.stringify(vals["main.py"]));
  active = "fungsi.py"; await m.rerender(h(active)); v = viewOf(m.c);
  check("switching shows fungsi.py's text", v.state.doc.toString() === "B\n");
  await typeInto(v, "b1\n"); await act(async () => { await sleep(650); }); await typeInto(v, "b2\n");
  check("typing in fungsi.py goes to fungsi.py, main.py untouched", vals["fungsi.py"] === "B\nb1\nb2\n" && vals["main.py"] === "A\na1\na2\n");
  active = "main.py"; await m.rerender(h(active)); v = viewOf(m.c);
  check("back on main.py: its edited text is there", v.state.doc.toString() === "A\na1\na2\n");
  await act(async () => { undo(v); });
  check("Ctrl+Z in main.py undoes ITS last edit (a2), history survived the tab switch", v.state.doc.toString() === "A\na1\n", JSON.stringify(v.state.doc.toString()));
  check("...and fungsi.py was not touched by that undo", vals["fungsi.py"] === "B\nb1\nb2\n");
  active = "fungsi.py"; await m.rerender(h(active)); v = viewOf(m.c);
  check("fungsi.py still has its own text after the undo in the other tab", v.state.doc.toString() === "B\nb1\nb2\n");
  await act(async () => { undo(v); });
  check("undo in fungsi.py reverts only fungsi.py's last edit (b2)", v.state.doc.toString() === "B\nb1\n" && vals["main.py"] === "A\na1\n", JSON.stringify([v.state.doc.toString(), vals["main.py"]]));

  console.log("--- read-only file");
  active = "catatan.txt"; await m.rerender(h(active)); v = viewOf(m.c);
  check("read-only file shows its text", v.state.doc.toString() === "DATA\n");
  await act(async () => { v.contentDOM.dispatchEvent(new w.KeyboardEvent("keydown", { key: "a", bubbles: true })); });
  check("read-only file: the state is read-only and not editable", v.state.readOnly === true && v.contentDOM.getAttribute("contenteditable") === "false", v.contentDOM.getAttribute("contenteditable"));
  check("read-only file shows the 'hanya untuk dibaca' note", m.c.textContent.includes("hanya untuk dibaca"));
  active = "main.py"; await m.rerender(h(active)); v = viewOf(m.c);
  check("back to an editable file: editing works again", v.state.readOnly === false && v.contentDOM.getAttribute("contenteditable") === "true");
  await typeInto(v, "x\n");
  check("...and the edit reaches the parent", vals["main.py"] === "A\na1\nx\n", JSON.stringify(vals["main.py"]));

  console.log("--- stale cache and reset");
  active = "fungsi.py"; await m.rerender(h(active));
  vals["main.py"] = "RESTORED DRAFT\n";   // parent replaced main.py's text while it was parked
  active = "main.py"; await m.rerender(h(active)); v = viewOf(m.c);
  check("a parked state whose text no longer matches the parent's value is discarded", v.state.doc.toString() === "RESTORED DRAFT\n", JSON.stringify(v.state.doc.toString()));
  vals = { "main.py": "A\n", "fungsi.py": "B\n", "catatan.txt": "DATA\n" }; resetToken = 1;
  await m.rerender(h(active)); v = viewOf(m.c);
  check("after reset the shown file is back to the new value", v.state.doc.toString() === "A\n");
  active = "fungsi.py"; await m.rerender(h(active)); v = viewOf(m.c);
  check("after reset another file shows its starter and the old undo history is gone", v.state.doc.toString() === "B\n");
  await act(async () => { undo(v); });
  check("undo after a reset does not bring back old edits", v.state.doc.toString() === "B\n");
  await m.unmount();

  // ================= CodeRunner: tabs, stdin, reset, check =================
  console.log("--- CodeRunner (multi-file)");
  const FILES = [
    { name: "main.py", content: "from fungsi import sapa\nprint(sapa(input('Nama: ')))\n" },
    { name: "fungsi.py", content: "# tulis sapa()\n" },
    { name: "catatan.txt", content: "Data\n", editable: false },
  ];
  const checks = [];
  const scope = { chapterSlug: "3-fungsi", lessonId: "L9" };
  const mk = (extra = {}) => React.createElement(CodeRunner, { files: FILES, entry: "main.py", stdin: ["Budi"], draft: scope, checkLabel: "Cek Jawaban", onCheck: (r, f) => checks.push([r, f]), ...extra });
  w.localStorage.clear();
  m = await mountEl(mk());
  const tabs = () => [...m.c.querySelectorAll('[role="tab"]')];
  check("one tab per file, in the author's order", tabs().map((t) => t.textContent.replace(/●|baca saja/g, "").trim()).join(",") === "main.py,fungsi.py,catatan.txt", tabs().map((t) => t.textContent).join("|"));
  check("main.py (the entry) is selected first", tabs()[0].getAttribute("aria-selected") === "true");
  check("the data file is labelled 'baca saja'", tabs()[2].textContent.includes("baca saja"));
  check("a tablist and a tabpanel exist and are linked", !!m.c.querySelector('[role="tablist"]') && m.c.querySelector('[role="tabpanel"]').getAttribute("aria-labelledby") === tabs()[0].id);
  check("the Input program box is prefilled with the lesson's lines", m.c.querySelector("textarea").value === "Budi");
  check("it says which file is run", m.c.textContent.includes("menjalankan main.py"));
  check("no 'Reset kode' before anything is changed", !m.c.textContent.includes("Reset kode"));

  await act(async () => { tabs()[1].dispatchEvent(new w.MouseEvent("click", { bubbles: true })); });
  check("clicking a tab selects it and shows that file", tabs()[1].getAttribute("aria-selected") === "true" && viewOf(m.c).state.doc.toString() === "# tulis sapa()\n");
  await typeInto(viewOf(m.c), "def sapa(n):\n    return 'Halo, ' + n + '!'\n");
  check("an edited file gets the ● marker", tabs()[1].textContent.includes("●") && !tabs()[0].textContent.includes("●"));
  check("'Reset kode' appears once something changed", m.c.textContent.includes("Reset kode"));

  await act(async () => { tabs()[1].dispatchEvent(new w.KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })); });
  check("ArrowRight moves to the next tab (the data file) and focuses it", tabs()[2].getAttribute("aria-selected") === "true" && w.document.activeElement === tabs()[2]);
  await act(async () => { tabs()[2].dispatchEvent(new w.KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })); });
  check("ArrowRight wraps around to the first tab", tabs()[0].getAttribute("aria-selected") === "true");
  await act(async () => { tabs()[0].dispatchEvent(new w.KeyboardEvent("keydown", { key: "End", bubbles: true })); });
  check("End jumps to the last tab", tabs()[2].getAttribute("aria-selected") === "true");
  await act(async () => { tabs()[2].dispatchEvent(new w.KeyboardEvent("keydown", { key: "Home", bubbles: true })); });
  check("Home jumps to the first tab", tabs()[0].getAttribute("aria-selected") === "true");

  const btn = (text) => [...m.c.querySelectorAll("button")].find((b) => b.textContent.trim() === text);
  await act(async () => { btn("Jalankan").dispatchEvent(new w.MouseEvent("click", { bubbles: true })); await sleep(30); });
  let call = runCalls[runCalls.length - 1];
  check("Jalankan sends ALL files (incl. the read-only one) with the current edits", Object.keys(call.files).join() === "main.py,fungsi.py,catatan.txt" && call.files["fungsi.py"].includes("def sapa") && call.files["catatan.txt"] === "Data\n");
  check("Jalankan sends the entry and the box's lines", call.entry === "main.py" && JSON.stringify(call.stdin) === '["Budi"]');
  check("Jalankan does NOT call onCheck", checks.length === 0);
  check("the run output is shown", m.c.textContent.includes("ok"));

  const box = m.c.querySelector("textarea");
  await act(async () => { const set = Object.getOwnPropertyDescriptor(w.HTMLTextAreaElement.prototype, "value").set; set.call(box, "Siti\n"); box.dispatchEvent(new w.Event("input", { bubbles: true })); });
  await act(async () => { btn("Jalankan").dispatchEvent(new w.MouseEvent("click", { bubbles: true })); await sleep(30); });
  check("Jalankan uses what the learner typed in the box (trailing newline is not an extra answer)", JSON.stringify(runCalls[runCalls.length - 1].stdin) === '["Siti"]', JSON.stringify(runCalls[runCalls.length - 1].stdin));
  check("a note explains Cek Jawaban ignores an edited box", m.c.textContent.includes('"Cek Jawaban" selalu memakai input bawaan'));
  await act(async () => { btn("Cek Jawaban").dispatchEvent(new w.MouseEvent("click", { bubbles: true })); await sleep(30); });
  call = runCalls[runCalls.length - 1];
  check("Cek Jawaban ALWAYS uses the lesson's own input, not the box", JSON.stringify(call.stdin) === '["Budi"]', JSON.stringify(call.stdin));
  check("Cek Jawaban calls onCheck with the result and every file's content", checks.length === 1 && checks[0][0].stdout === "ok\n" && checks[0][1]["fungsi.py"].includes("def sapa") && checks[0][1]["catatan.txt"] === "Data\n");

  console.log("--- drafts per file + refresh");
  await act(async () => { await sleep(550); });
  const keys = [...Array(w.localStorage.length).keys()].map((i) => w.localStorage.key(i)).sort();
  check("one draft key per EDITED editable file; none for the read-only file or unchanged main.py", keys.length === 1 && keys[0].endsWith(":3-fungsi:L9:fungsi.py"), JSON.stringify(keys));
  await m.unmount();
  ({ CodeRunner: global.__CR } = build());
  const CodeRunner2 = global.__CR;
  m = await mountEl(React.createElement(CodeRunner2, { files: FILES, entry: "main.py", stdin: ["Budi"], draft: scope, checkLabel: "Cek Jawaban", onCheck: () => {} }));
  await act(async () => { tabs()[1].dispatchEvent(new w.MouseEvent("click", { bubbles: true })); });
  check("after a refresh the edited file is restored", viewOf(m.c).state.doc.toString().includes("def sapa"), JSON.stringify(viewOf(m.c).state.doc.toString()));
  check("...with the restored message", m.c.textContent.includes("Kode terakhirmu dipulihkan"));
  await act(async () => { tabs()[0].dispatchEvent(new w.MouseEvent("click", { bubbles: true })); });
  check("the untouched file still shows its starter", viewOf(m.c).state.doc.toString().startsWith("from fungsi import sapa"));

  console.log("--- Reset kode");
  confirmAnswer = false;
  const rbtn = () => [...m.c.querySelectorAll("button")].find((b) => b.textContent.trim() === "Reset kode");
  await act(async () => { rbtn().dispatchEvent(new w.MouseEvent("click", { bubbles: true })); });
  check("declining the confirm keeps the code", [...m.c.querySelectorAll("button")].some((b) => b.textContent.trim() === "Reset kode"));
  confirmAnswer = true;
  await act(async () => { rbtn().dispatchEvent(new w.MouseEvent("click", { bubbles: true })); await sleep(30); });
  await act(async () => { tabs()[1].dispatchEvent(new w.MouseEvent("click", { bubbles: true })); });
  check("confirming restores EVERY file to its starter", viewOf(m.c).state.doc.toString() === "# tulis sapa()\n");
  check("the Reset button and the edited marker are gone", !m.c.textContent.includes("Reset kode") && !tabs()[1].textContent.includes("●"));
  await act(async () => { await sleep(550); });
  check("the saved draft was removed", w.localStorage.length === 0, String(w.localStorage.length));
  await m.unmount();

  console.log("--- classic single-file lesson is unchanged");
  w.localStorage.clear(); runCalls.length = 0;
  m = await mountEl(React.createElement(CodeRunner2, { files: [{ name: "main.py", content: "print(1)\n" }], draft: { chapterSlug: "1-x", lessonId: "L1" }, checkLabel: "Cek Jawaban", onCheck: () => {} }));
  check("no tab bar for a single file", !m.c.querySelector('[role="tablist"]') && !m.c.querySelector('[role="tabpanel"]'));
  check("no 'Input program' box when the lesson has no stdin", !m.c.querySelector("textarea"));
  check("no 'menjalankan' note for a single file", !m.c.textContent.includes("menjalankan"));
  await typeInto(viewOf(m.c), "print(2)\n"); await act(async () => { await sleep(550); });
  const k = [...Array(w.localStorage.length).keys()].map((i) => w.localStorage.key(i));
  check("single-file draft uses the LEGACY key (no file name suffix), so old drafts still load", k.length === 1 && k[0].endsWith(":1-x:L1"), JSON.stringify(k));
  await act(async () => { [...m.c.querySelectorAll("button")].find((b) => b.textContent.trim() === "Jalankan").dispatchEvent(new w.MouseEvent("click", { bubbles: true })); await sleep(30); });
  check("single file run sends exactly one file named main.py", Object.keys(runCalls[0].files).join() === "main.py" && runCalls[0].stdin.length === 0);
  await m.unmount();


  console.log("--- saved code: the finer behaviours (debounce, closing the tab, other account, blocked storage)");
  {
    const { hook, drafts } = build();
    const mountHook = async (scopeArg, starters) => {
      const box = { api: null };
      function C() { box.api = hook.useFilesDraft(scopeArg, starters); return null; }
      const c = w.document.createElement("div"); w.document.body.appendChild(c);
      const root = createRoot(c);
      await act(async () => { root.render(React.createElement(C)); });
      await act(async () => { await sleep(40); });
      return { box, unmount: async () => act(async () => root.unmount()) };
    };
    const ST = [{ name: "main.py", content: "# mulai\n" }];
    const sc = { chapterSlug: "9-list", lessonId: "L3" };
    const key = drafts.draftKey("user-A", "9-list", "L3");
    w.localStorage.clear(); currentUser = "user-A";

    let hk = await mountHook(sc, ST);
    await act(async () => { hk.box.api.setFile("main.py", "# mulai\nprint(1)\n"); });
    check("typing is not written immediately (debounced)", w.localStorage.getItem(key) === null);
    await act(async () => { await sleep(550); });
    check("...it is saved shortly after typing stops", JSON.parse(w.localStorage.getItem(key) || "null")?.code === "# mulai\nprint(1)\n");
    await hk.unmount();

    hk = await mountHook(sc, ST);
    check("a refresh restores it", hk.box.api.files["main.py"] === "# mulai\nprint(1)\n" && hk.box.api.restored === true);
    await act(async () => { hk.box.api.setFile("main.py", "# mulai\nprint(2)\n"); });
    w.dispatchEvent(new w.Event("pagehide"));
    check("pagehide saves immediately (the last keystrokes survive closing the tab)", JSON.parse(w.localStorage.getItem(key) || "null")?.code === "# mulai\nprint(2)\n");
    await act(async () => { hk.box.api.setFile("main.py", "# mulai\nprint(3)\n"); });
    Object.defineProperty(w.document, "visibilityState", { value: "hidden", configurable: true });
    w.document.dispatchEvent(new w.Event("visibilitychange"));
    check("switching away from the tab saves immediately too", JSON.parse(w.localStorage.getItem(key) || "null")?.code === "# mulai\nprint(3)\n");
    Object.defineProperty(w.document, "visibilityState", { value: "visible", configurable: true });
    await hk.unmount();

    currentUser = "user-B";
    hk = await mountHook(sc, ST);
    check("a different account does NOT see user A's code", hk.box.api.files["main.py"] === "# mulai\n" && !hk.box.api.restored);
    await hk.unmount(); currentUser = "user-A";

    hk = await mountHook({ chapterSlug: "9-list", lessonId: "L4" }, [{ name: "main.py", content: "# lain\n" }]);
    check("another lesson has its own, separate code", hk.box.api.files["main.py"] === "# lain\n");
    await hk.unmount();

    hk = await mountHook(sc, [{ name: "main.py", content: "# starter BARU\n" }]);
    check("edited code is kept even if the author later changed the starter", hk.box.api.files["main.py"] === "# mulai\nprint(3)\n" && hk.box.api.restored);
    await hk.unmount();

    w.localStorage.clear();
    hk = await mountHook(sc, ST);
    await act(async () => { hk.box.api.setFile("main.py", "typed early\n"); });
    await act(async () => { await sleep(100); });
    check("code typed right away is not clobbered by the draft lookup", hk.box.api.files["main.py"] === "typed early\n");
    await hk.unmount(); w.localStorage.clear();

    currentUser = null;
    hk = await mountHook(sc, ST);
    await act(async () => { hk.box.api.setFile("main.py", "anon\n"); });
    await act(async () => { await sleep(550); });
    check("signed out: the editor works and nothing is stored", hk.box.api.files["main.py"] === "anon\n" && w.localStorage.length === 0);
    await hk.unmount(); currentUser = "user-A";

    hk = await mountHook(undefined, ST);
    await act(async () => { hk.box.api.setFile("main.py", "x\n"); });
    await act(async () => { await sleep(550); });
    check("without a scope nothing is stored", hk.box.api.files["main.py"] === "x\n" && w.localStorage.length === 0);
    await hk.unmount();

    Object.defineProperty(w, "localStorage", { get() { throw new Error("SecurityError"); }, configurable: true });
    const blocked = build();
    const hb = { api: null };
    function CB() { hb.api = blocked.hook.useFilesDraft(sc, ST); return null; }
    const cb = w.document.createElement("div"); w.document.body.appendChild(cb); const rb = createRoot(cb);
    await act(async () => { rb.render(React.createElement(CB)); }); await act(async () => { await sleep(40); });
    await act(async () => { hb.api.setFile("main.py", "works anyway\n"); }); await act(async () => { await sleep(550); });
    check("blocked storage (private mode): no crash, typing still works", hb.api.files["main.py"] === "works anyway\n");
    await act(async () => rb.unmount());
  }

  console.log(fail ? `\n${fail} FAILED` : "\nAll UI behaviours verified."); process.exit(fail ? 1 : 0);
})().catch((e) => { console.error("SCRIPT ERROR", e); process.exit(2); });
