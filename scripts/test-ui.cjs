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
let hang = false, hangResolve = null, stopCalls = 0;
const fakePyodide = {
  runProject: async (o) => {
    runCalls.push(JSON.parse(JSON.stringify(o)));
    if (hang) { o.onStart && o.onStart(); return new Promise((res) => { hangResolve = res; }); }
    return runResult;
  },
  stopRun: () => { stopCalls++; hangResolve && hangResolve({ stdout: "", error: "Program dihentikan.", stopped: true }); },
};
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

    global.__realLocalStorageDescriptor = Object.getOwnPropertyDescriptor(w, "localStorage");
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

  // ================= CodeRunner: the stop button (runaway-program safeguard) =================
  console.log("--- CodeRunner (Hentikan)");
  {
    const buttonByText = (c, t) => [...c.querySelectorAll("button")].find((b) => b.textContent.trim() === t);
    const one = [{ name: "main.py", content: "while True:\n    pass\n" }];
    const got = []; hang = true;
    const mm = await mountEl(React.createElement(CodeRunner, { files: one, entry: "main.py", checkLabel: "Cek Jawaban", onCheck: (r) => got.push(r) }));
    check("no 'Hentikan' button while idle", !buttonByText(mm.c, "Hentikan"));
    await act(async () => { buttonByText(mm.c, "Jalankan").dispatchEvent(new w.MouseEvent("click", { bubbles: true })); });
    await act(async () => { await sleep(30); });
    check("'Hentikan' appears once the program is running", !!buttonByText(mm.c, "Hentikan"));
    check("Jalankan / Cek Jawaban are disabled while it runs", buttonByText(mm.c, "Menjalankan...")?.disabled === true && buttonByText(mm.c, "Cek Jawaban")?.disabled === true);
    await act(async () => { buttonByText(mm.c, "Hentikan").dispatchEvent(new w.MouseEvent("click", { bubbles: true })); });
    await act(async () => { await sleep(30); });
    check("clicking Hentikan calls stopRun once", stopCalls === 1);
    check("the stop message is shown and the buttons are usable again", mm.c.textContent.includes("Program dihentikan.") && !buttonByText(mm.c, "Hentikan") && buttonByText(mm.c, "Jalankan")?.disabled === false);
    await act(async () => { buttonByText(mm.c, "Cek Jawaban").dispatchEvent(new w.MouseEvent("click", { bubbles: true })); });
    await act(async () => { await sleep(30); });
    await act(async () => { buttonByText(mm.c, "Hentikan").dispatchEvent(new w.MouseEvent("click", { bubbles: true })); });
    await act(async () => { await sleep(30); });
    check("a stopped 'Cek Jawaban' is reported to onCheck as an error result (so it cannot pass)", got.length === 1 && got[0].stopped === true && !!got[0].error);
    hang = false;
    await mm.unmount();
  }

  // ================= Halaman akun: ganti nama, ganti password, hapus akun =================
  console.log("--- Halaman akun");
  {
    // an earlier test replaced localStorage with a throwing getter; the account page needs the real one back
    if (global.__realLocalStorageDescriptor) Object.defineProperty(w, "localStorage", global.__realLocalStorageDescriptor);
    const calls = { updateName: [], changePassword: [], deleteAccount: [], replace: [], refresh: 0, signOut: 0 };
    let nextDelete = { ok: true };
    const actions = {
      updateName: async (n) => { calls.updateName.push(n); return { ok: true, message: "Nama berhasil diubah." }; },
      changePassword: async (...a) => { calls.changePassword.push(a); return { ok: true, message: "Password berhasil diubah. Perangkat lain dikeluarkan." }; },
      deleteAccount: async (pw, c) => { calls.deleteAccount.push([pw, c]); return nextDelete; },
    };
    const account = load("lib/account.ts");
    const drafts2 = load("lib/code-drafts.ts");
    const Btn = ({ children, variant, ...rest }) => React.createElement("button", rest, children);
    const shim = {
      "@/app/akun/actions": actions, "@/lib/account": account, "@/components/ui/Button": { Button: Btn },
      "@/components/ui/PasswordInput": { default: load("components/ui/PasswordInput.tsx").default },
      "next/navigation": { useRouter: () => ({ replace: (u) => calls.replace.push(u), refresh: () => { calls.refresh++; }, push: () => {} }) },
      "@/lib/supabase/client": { createClient: () => ({ auth: { signOut: async () => { calls.signOut++; } } }) },
      "@/lib/code-drafts": drafts2,
    };
    const ProfileForm = load("components/account/ProfileForm.tsx", shim).default;
    const PasswordForm = load("components/account/PasswordForm.tsx", shim).default;
    const DeleteAccountForm = load("components/account/DeleteAccountForm.tsx", shim).default;
    const setVal = async (el, v) => act(async () => { Object.getOwnPropertyDescriptor(w.HTMLInputElement.prototype, "value").set.call(el, v); el.dispatchEvent(new w.Event("input", { bubbles: true })); });
    const submit = async (form) => act(async () => { form.dispatchEvent(new w.Event("submit", { bubbles: true, cancelable: true })); await sleep(20); });
    const click = async (el) => act(async () => { el.dispatchEvent(new w.MouseEvent("click", { bubbles: true })); await sleep(20); });
    const btn = (c, t) => [...c.querySelectorAll("button")].find((b) => b.textContent.trim() === t);

    // --- rename
    let pm = await mountEl(React.createElement(ProfileForm, { email: "a@b.id", initialName: "Budi" }));
    check("akun: email is shown read-only", pm.c.querySelector("#akun-email").readOnly === true && pm.c.querySelector("#akun-email").value === "a@b.id");
    check("akun: the save button is disabled until the name changes", btn(pm.c, "Simpan nama").disabled === true);
    await setVal(pm.c.querySelector("#akun-nama"), "  Ani   Lestari ");
    check("akun: it enables once the name differs", btn(pm.c, "Simpan nama").disabled === false);
    await submit(pm.c.querySelector("form"));
    check("akun: the name is sent to the server action", calls.updateName.length === 1 && calls.updateName[0] === "  Ani   Lestari ");
    check("akun: success message shown and the page refreshed", pm.c.textContent.includes("Nama berhasil diubah.") && calls.refresh === 1);
    check("akun: the field shows the tidied name afterwards", pm.c.querySelector("#akun-nama").value === "Ani Lestari");
    await setVal(pm.c.querySelector("#akun-nama"), "   ");
    await submit(pm.c.querySelector("form"));
    check("akun: an empty name is rejected on the page without calling the server", calls.updateName.length === 1 && pm.c.textContent.includes("Nama tidak boleh kosong."));
    await pm.unmount();

    // --- password
    pm = await mountEl(React.createElement(PasswordForm));
    await setVal(pm.c.querySelector("#pw-sekarang"), "lama123");
    await setVal(pm.c.querySelector("#pw-baru"), "baru1234");
    await setVal(pm.c.querySelector("#pw-ulang"), "beda1234");
    await submit(pm.c.querySelector("form"));
    check("akun: mismatching confirmation is caught on the page, server not called", calls.changePassword.length === 0 && pm.c.textContent.includes("Konfirmasi password tidak cocok."));
    await setVal(pm.c.querySelector("#pw-ulang"), "baru1234");
    await submit(pm.c.querySelector("form"));
    check("akun: valid change calls the server action with the three values", JSON.stringify(calls.changePassword) === JSON.stringify([["lama123", "baru1234", "baru1234"]]));
    check("akun: success message shown and the three fields are cleared", pm.c.textContent.includes("Password berhasil diubah") && ["#pw-sekarang", "#pw-baru", "#pw-ulang"].every((q) => pm.c.querySelector(q).value === ""));
    check("akun: password inputs use the right autocomplete hints", pm.c.querySelector("#pw-sekarang").autocomplete === "current-password" && pm.c.querySelector("#pw-baru").autocomplete === "new-password");
    await pm.unmount();

    // --- delete
    w.localStorage.clear();
    w.localStorage.setItem("pymula:draft:v1:u1:3-fungsi:L9", "x"); w.localStorage.setItem("other-site-key", "keep");
    pm = await mountEl(React.createElement(DeleteAccountForm, { hasPaidAccess: true, hasPendingPurchase: false }));
    check("akun: delete starts collapsed (no password field yet)", !pm.c.querySelector("#hapus-password") && !!btn(pm.c, "Hapus akun..."));
    await click(btn(pm.c, "Hapus akun..."));
    check("akun: it explains that paid access is lost for good", pm.c.textContent.includes("Akses chapter berbayarmu hilang permanen"));
    check("akun: it explains re-registering starts from scratch", pm.c.textContent.includes("mulai dari awal"));
    const delBtn = () => btn(pm.c, "Hapus akun saya permanen");
    check("akun: the delete button is disabled at first", delBtn().disabled === true);
    await setVal(pm.c.querySelector("#hapus-password"), "rahasia");
    await setVal(pm.c.querySelector("#hapus-konfirmasi"), "hapus");
    check("akun: lowercase 'hapus' does not enable it", delBtn().disabled === true);
    await setVal(pm.c.querySelector("#hapus-konfirmasi"), "HAPUS");
    check("akun: password + HAPUS enable it", delBtn().disabled === false);
    nextDelete = { ok: false, message: "Password salah." };
    await submit(pm.c.querySelector("form"));
    check("akun: a server refusal is shown and nothing redirects or signs out", pm.c.textContent.includes("Password salah.") && calls.replace.length === 0 && calls.signOut === 0 && w.localStorage.getItem("pymula:draft:v1:u1:3-fungsi:L9") === "x");
    nextDelete = { ok: true };
    await submit(pm.c.querySelector("form"));
    check("akun: the action got the password and the confirmation word", JSON.stringify(calls.deleteAccount[1]) === JSON.stringify(["rahasia", "HAPUS"]));
    check("akun: success redirects to login with the deleted notice", JSON.stringify(calls.replace) === JSON.stringify(["/login?deleted=1"]));
    check("akun: success signs out the browser session", calls.signOut === 1);
    check("akun: success clears the saved lesson drafts but not other sites' keys", w.localStorage.getItem("pymula:draft:v1:u1:3-fungsi:L9") === null && w.localStorage.getItem("other-site-key") === "keep");
    await pm.unmount();

    pm = await mountEl(React.createElement(DeleteAccountForm, { hasPaidAccess: false, hasPendingPurchase: true }));
    await click(btn(pm.c, "Hapus akun..."));
    check("akun: without paid access the 'paid access lost' line is absent", !pm.c.textContent.includes("Akses chapter berbayarmu"));
    check("akun: a pending payment shows the warning up front", pm.c.textContent.includes("menunggu verifikasi"));
    await click(btn(pm.c, "Batal"));
    check("akun: Batal collapses the form again", !pm.c.querySelector("#hapus-password"));
    await pm.unmount();
  }

  // ================= Lupa password, show/hide password, Keluar di halaman akun =================
  console.log("--- Lupa password / PasswordInput / Keluar");
  {
    const calls = { reset: [], resetAction: [], push: [], refresh: 0, signOut: 0 };
    let sendResult = { error: null };
    let resetResult = { ok: true, message: "Password berhasil diubah. Kamu sudah masuk dengan password baru." };
    const Btn = ({ children, variant, ...rest }) => React.createElement("button", { ...rest, "data-variant": variant }, children);
    const LinkBtn = ({ children, href }) => React.createElement("a", { href }, children);
    const account = load("lib/account.ts");
    const reset = load("lib/password-reset.ts", { "./account": account });
    const drafts3 = load("lib/code-drafts.ts");
    const PasswordInput = load("components/ui/PasswordInput.tsx").default;
    const base = {
      "@/components/ui/Button": { Button: Btn, LinkButton: LinkBtn },
      "@/components/ui/PasswordInput": { default: PasswordInput },
      "@/lib/account": account, "@/lib/password-reset": reset, "@/lib/code-drafts": drafts3,
      "next/navigation": { useRouter: () => ({ push: (u) => calls.push.push(u), replace: (u) => calls.push.push(u), refresh: () => { calls.refresh++; } }) },
      "@/lib/supabase/client": { createClient: () => ({ auth: {
        resetPasswordForEmail: async (email, opts) => { calls.reset.push([email, opts]); return sendResult; },
        signOut: async () => { calls.signOut++; },
      } }) },
      "@/app/reset-password/actions": { resetPassword: async (a, b) => { calls.resetAction.push([a, b]); return resetResult; } },
    };
    const Forgot = load("components/auth/ForgotPasswordForm.tsx", base).default;
    const ResetForm = load("components/auth/ResetPasswordForm.tsx", base).default;
    const SignOut = load("components/site/SignOutButton.tsx", base).default;
    const setVal = async (el, v) => act(async () => { Object.getOwnPropertyDescriptor(w.HTMLInputElement.prototype, "value").set.call(el, v); el.dispatchEvent(new w.Event("input", { bubbles: true })); });
    const submit = async (form) => act(async () => { form.dispatchEvent(new w.Event("submit", { bubbles: true, cancelable: true })); await sleep(20); });
    const click = async (el) => act(async () => { el.dispatchEvent(new w.MouseEvent("click", { bubbles: true })); await sleep(20); });

    // --- show / hide password
    let submits = 0;
    let pm = await mountEl(React.createElement("form", { onSubmit: (e) => { e.preventDefault(); submits++; } },
      React.createElement("label", { htmlFor: "p1" }, "Password"),
      React.createElement(PasswordInput, { id: "p1", autoComplete: "current-password", required: true })));
    const pw = pm.c.querySelector("#p1"), tg = pm.c.querySelector("button");
    check("password: hidden by default", pw.type === "password" && tg.getAttribute("aria-pressed") === "false");
    check("password: the label still points at the input", pm.c.querySelector("label").htmlFor === "p1" && pw.id === "p1");
    check("password: extra props (autocomplete, required) reach the input", pw.autocomplete === "current-password" && pw.required === true);
    check("password: phone keyboards are told not to autocorrect", pw.getAttribute("autocapitalize") === "off" && pw.getAttribute("autocorrect") === "off" && pw.getAttribute("spellcheck") === "false");
    await setVal(pw, "rahasia123");
    await click(tg);
    check("password: clicking the eye shows the text", pw.type === "text" && tg.getAttribute("aria-pressed") === "true" && tg.title === "Sembunyikan password");
    check("password: what was typed is kept when toggling", pw.value === "rahasia123");
    await click(tg);
    check("password: clicking again hides it", pw.type === "password" && tg.title === "Tampilkan password" && pw.value === "rahasia123");
    check("password: the toggle is a plain button and never submits the form", tg.type === "button" && submits === 0);
    await pm.unmount();

    // --- forgot password
    pm = await mountEl(React.createElement(Forgot, { cooldownSeconds: 1 }));
    check("lupa: no link-error banner by default", !pm.c.textContent.includes("kedaluwarsa"));
    await setVal(pm.c.querySelector("#lupa-email"), "bukan-email");
    await submit(pm.c.querySelector("form"));
    check("lupa: an invalid email is caught on the page, nothing sent", calls.reset.length === 0 && pm.c.textContent.includes("alamat email yang valid"));
    await setVal(pm.c.querySelector("#lupa-email"), " siti@mail.id ");
    await submit(pm.c.querySelector("form"));
    check("lupa: the email is sent (trimmed) to Supabase", calls.reset.length === 1 && calls.reset[0][0] === "siti@mail.id");
    check("lupa: redirectTo is this site's callback asking for /reset-password", calls.reset[0][1].redirectTo === "https://pymula.test/auth/callback?next=%2Freset-password");
    check("lupa: the neutral message is shown (no account probing)", pm.c.textContent.includes("Jika email itu terdaftar"));
    check("lupa: it tells the learner to open the link in the same browser", pm.c.textContent.includes("browser yang sama"));
    const sendBtn = () => [...pm.c.querySelectorAll("button")].find((b) => b.type === "submit");
    check("lupa: the button is disabled during the cooldown and shows the countdown", sendBtn().disabled === true && /Kirim ulang dalam 1 dtk/.test(sendBtn().textContent));
    await act(async () => { await sleep(1200); });
    check("lupa: after the cooldown it can be pressed again", sendBtn().disabled === false && /Kirim ulang link/.test(sendBtn().textContent));
    sendResult = { error: { status: 429, message: "email rate limit exceeded" } };
    await submit(pm.c.querySelector("form"));
    check("lupa: a rate-limit error is explained and hides the success message", pm.c.textContent.includes("Terlalu banyak permintaan") && !pm.c.textContent.includes("Jika email itu terdaftar"));
    sendResult = { error: null };
    await pm.unmount();
    pm = await mountEl(React.createElement(Forgot, { linkError: true }));
    check("lupa: an expired/invalid link shows the 'minta link baru' banner", pm.c.textContent.includes("Link tidak valid atau sudah kedaluwarsa"));
    check("lupa: there is a way back to login", !!pm.c.querySelector('a[href="/login"]'));
    check("lupa: signed-out visitors see 'Kembali masuk' and no link to /akun", pm.c.textContent.includes("Kembali masuk") && !pm.c.querySelector('a[href="/akun"]'));
    await pm.unmount();
    pm = await mountEl(React.createElement(Forgot, { signedIn: true }));
    check("lupa: a signed-in visitor gets 'Kembali ke akun' -> /akun instead of the login page (the reported bug)", !!pm.c.querySelector('a[href="/akun"]') && pm.c.textContent.includes("Kembali ke akun") && !pm.c.querySelector('a[href="/login"]') && !pm.c.textContent.includes("Kembali masuk"));
    await pm.unmount();

    // --- reset password
    pm = await mountEl(React.createElement(ResetForm));
    check("reset: both fields are hidden-by-default password fields with toggles", ["#reset-baru", "#reset-ulang"].every((q) => pm.c.querySelector(q).type === "password") && pm.c.querySelectorAll('button[aria-pressed]').length === 2);
    await setVal(pm.c.querySelector("#reset-baru"), "baru1234");
    await setVal(pm.c.querySelector("#reset-ulang"), "beda1234");
    await submit(pm.c.querySelector("form"));
    check("reset: a mismatch is caught on the page, server not called", calls.resetAction.length === 0 && pm.c.textContent.includes("Konfirmasi password tidak cocok."));
    resetResult = { ok: false, message: "Link reset sudah kedaluwarsa atau tidak valid. Minta link baru." };
    await setVal(pm.c.querySelector("#reset-ulang"), "baru1234");
    await submit(pm.c.querySelector("form"));
    check("reset: a server refusal is shown and the form stays", calls.resetAction.length === 1 && pm.c.textContent.includes("kedaluwarsa") && !!pm.c.querySelector("#reset-baru"));
    resetResult = { ok: true, message: "Password berhasil diubah. Kamu sudah masuk dengan password baru." };
    await submit(pm.c.querySelector("form"));
    check("reset: success sends both values and shows the success state with a dashboard link", JSON.stringify(calls.resetAction[1]) === JSON.stringify(["baru1234", "baru1234"]) && pm.c.textContent.includes("Password berhasil diubah") && !!pm.c.querySelector('a[href="/"]') && !pm.c.querySelector("#reset-baru"));
    check("reset: the page is refreshed so the header updates", calls.refresh >= 1);
    await pm.unmount();

    // --- Keluar (now on /akun)
    w.localStorage.clear();
    w.localStorage.setItem("pymula:draft:v1:u1:3-fungsi:L9", "x"); w.localStorage.setItem("other-site-key", "keep");
    pm = await mountEl(React.createElement(SignOut, { variant: "secondary" }));
    const so = pm.c.querySelector("button");
    check("keluar: the button says Keluar and uses the variant it was given", so.textContent.trim() === "Keluar" && so.getAttribute("data-variant") === "secondary");
    await click(so);
    check("keluar: signs out, clears saved lesson code (not other sites'), and goes home", calls.signOut === 1 && w.localStorage.getItem("pymula:draft:v1:u1:3-fungsi:L9") === null && w.localStorage.getItem("other-site-key") === "keep" && calls.push.includes("/"));
    await pm.unmount();
  }

  console.log(fail ? `\n${fail} FAILED` : "\nAll UI behaviours verified."); process.exit(fail ? 1 : 0);
})().catch((e) => { console.error("SCRIPT ERROR", e); process.exit(2); });
