// Runs EVERY code lesson of EVERY chapter through the real runner + the real
// checker, in the real Pyodide the site uses (Python 3.12):
//   - the author's answer must PASS the checker (output and source rules);
//   - the starter, untouched, must NOT pass (else a learner could click
//     "Cek Jawaban" without doing anything);
//   - the lesson's own files are valid (names, entry file, an editable file);
//   - the theory example runs (an example may raise on purpose if the error's
//     name appears in the example's text, e.g. a ZeroDivisionError demo);
//   - quizzes have a valid single correct option.
// Run: node scripts/test-lessons-pyodide.mjs [--verbose]   (~10 s)
import { createRequire } from "node:module";
import fs from "node:fs";
import ts from "typescript";

const require = createRequire(import.meta.url);
const VERBOSE = process.argv.includes("--verbose");
function load(file, shims = {}) {
  const src = fs.readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
  const js = ts.transpileModule(src, { compilerOptions: { module: "CommonJS", target: "ES2020" } }).outputText;
  const mod = { exports: {} };
  new Function("require", "module", "exports", js)((id) => (id in shims ? shims[id] : require(id)), mod, mod.exports);
  return mod.exports;
}
const harness = load("lib/python-harness.ts");
const { runProjectWith } = load("lib/pyodide.ts", { "@/lib/python-harness": harness });
const { checkOutput } = load("lib/checker.ts");
const LF = load("lib/lesson-files.ts");
const { loadPyodide } = await import("pyodide");
const py = await loadPyodide();

// Deliberate exceptions to "the untouched starter must not pass":
// a warm-up lesson whose instruction is literally "just press Run, don't change
// the code". For these the starter MUST pass and no answer is needed.
const STARTER_IS_THE_ANSWER = new Set(["chapter-1 L1"]);

const problems = [];
const fail = (where, msg) => { problems.push(`${where}: ${msg}`); console.log(`  FAIL ${where}: ${msg}`); };
let counts = { chapters: 0, lessons: 0, code: 0, multi: 0, withInput: 0, quiz: 0, examples: 0, sectionPrograms: 0 };

const dir = new URL("../content/chapters/", import.meta.url);
const chapterFiles = fs.readdirSync(dir).filter((n) => /^chapter-\d+\.ts$/.test(n)).sort((a, b) => parseInt(a.slice(8)) - parseInt(b.slice(8)));

async function runAndCheck(practice, files, entry, stdin) {
  const r = await runProjectWith(py, { files, entry, stdin });
  return { r, verdict: checkOutput(r.stdout, r.error, practice.checker, files) };
}

for (const f of chapterFiles) {
  const chapter = Object.values(load(`content/chapters/${f}`)).find((v) => v && v.lessons);
  counts.chapters++;
  for (const l of chapter.lessons) {
    counts.lessons++;
    const where = `${f.replace(".ts", "")} ${l.id}`;
    const p = l.practice;

    // ---- theory example ----
    if (l.theory.example) {
      counts.examples++;
      const seedFiles = {};
      for (const lf of p.kind === "code" && p.files ? p.files : []) if (lf.name !== "main.py") seedFiles[lf.name] = lf.content;
      const r = await runProjectWith(py, { files: { ...seedFiles, "main.py": l.theory.example.code }, entry: "main.py", stdin: p.kind === "code" ? p.stdin : undefined });
      if (r.error) {
        // An example may end in an error on purpose, to show what the error is.
        // Accepted only if the example itself says so: it names the error class
        // or the word "error" appears in it (e.g. "# akan ERROR karena ...").
        const cls = r.error.split(":")[0];
        const says = l.theory.example.code.includes(cls) || /\berror\b/i.test(l.theory.example.code);
        if (!says) fail(where, `theory example fails and does not say it should: ${r.error}`);
        else if (VERBOSE) console.log(`  ok   ${where}: example raises ${cls} on purpose`);
      }
    }
    // ---- theory sections that are really a small program (each heading is a .py file) ----
    const secs = l.theory.sections || [];
    const pyHeads = secs.filter((s) => s.heading && /^[\w.-]+\.py$/.test(s.heading) && s.code);
    if (pyHeads.length >= 2) {
      counts.sectionPrograms++;
      const files = Object.fromEntries(pyHeads.map((s) => [s.heading, s.code]));
      const r = await runProjectWith(py, { files, entry: "main.py" });
      if (r.error) fail(where, `theory program (sections) fails: ${r.error}`);
    }

    // ---- quiz ----
    if (p.kind === "quiz") {
      counts.quiz++;
      const ok = Number.isInteger(p.correctIndex) && p.correctIndex >= 0 && p.correctIndex < p.options.length && new Set(p.options).size === p.options.length;
      if (!ok) fail(where, "quiz needs a valid correctIndex and distinct options");
      continue;
    }

    // ---- code lesson ----
    counts.code++;
    const entry = LF.getEntry(p);
    const lessonFiles = LF.getPracticeFiles(p);
    const multi = lessonFiles.length > 1;
    if (multi) counts.multi++;
    if (p.stdin) counts.withInput++;
    for (const msg of LF.validateFiles(lessonFiles, entry)) fail(where, msg);

    const starterMap = Object.fromEntries(lessonFiles.map((x) => [x.name, x.content]));
    const stdin = p.stdin ?? [];

    // starter must not pass (except the allow-listed warm-up lessons, where it must)
    {
      const { r, verdict } = await runAndCheck(p, starterMap, entry, stdin);
      if (STARTER_IS_THE_ANSWER.has(where)) {
        if (!verdict.passed) fail(where, "warm-up lesson: the starter should pass but does not");
        else if (VERBOSE) console.log(`  ok   ${where}: warm-up, the starter is the answer`);
        continue;
      }
      if (verdict.passed) fail(where, "the UNTOUCHED starter passes the checker");
      else if (VERBOSE) console.log(`  ok   ${where}: starter fails (${r.error ? "error" : "wrong output"})`);
    }

    // answer must pass
    const answers = p.answerFiles ?? (p.answerHint !== undefined ? { [entry]: p.answerHint } : null);
    if (!answers) { fail(where, "no answerHint / answerFiles"); continue; }
    if (multi && !p.answerFiles) fail(where, "multi-file lesson needs answerFiles");
    const unknown = Object.keys(answers).filter((n) => !(n in starterMap));
    if (unknown.length) fail(where, `answer has files the lesson doesn't: ${unknown.join(", ")}`);
    const answerMap = { ...starterMap, ...answers };
    let { r, verdict } = await runAndCheck(p, answerMap, entry, stdin);
    let how = "answer alone";
    if (!verdict.passed && !multi) {
      // some single-file answers show only the lines to add (the data comes from the starter)
      const combined = { [entry]: starterMap[entry] + "\n" + answers[entry] };
      ({ r, verdict } = await runAndCheck(p, combined, entry, stdin));
      how = "starter + answer";
    }
    if (!verdict.passed) fail(where, `the author's answer does not pass: ${verdict.message}${r.error ? " [" + r.error + "]" : ""}`);
    else if (VERBOSE) console.log(`  ok   ${where}: answer passes (${how})${multi ? " [multi-file]" : ""}${p.stdin ? " [input]" : ""}`);

    // a stdin lesson must not pass when the input is missing (proves the input matters)
    if (p.stdin && p.stdin.length) {
      const nostdin = await runAndCheck(p, answerMap, entry, []);
      if (nostdin.verdict.passed) fail(where, "passes even with no input - the input isn't used");
    }
  }
}

console.log(`\nChecked ${counts.chapters} chapters, ${counts.lessons} lessons: ${counts.code} code (${counts.multi} multi-file, ${counts.withInput} with input), ${counts.quiz} quiz, ${counts.examples} theory examples, ${counts.sectionPrograms} multi-file theory programs.`);
console.log(problems.length ? `\n${problems.length} PROBLEM(S).` : "\nEvery lesson verified in the real Pyodide: answers pass, starters fail, examples run.");
process.exit(problems.length ? 1 : 0);
