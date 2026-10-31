// Converts the project chapters written in the authoring format
// (content/AUTHORING_TEMPLATE_PROYEK.md, content/projects/<slug>/bab-*.md) into
// the TypeScript the site imports (content/projects/<slug>/chapter-N.ts).
//   node scripts/convert-project-md.mjs word-counter [--check]
// --check writes nothing and fails if a generated file is out of date (used by
// npm test, so the .md and the .ts can never drift apart).
// Strict on purpose: anything it does not recognise is an error, never a guess.
import fs from "node:fs";
import path from "node:path";

const FENCE = "```";
const slugArg = process.argv[2];
const CHECK = process.argv.includes("--check");
if (!slugArg) { console.error("usage: node scripts/convert-project-md.mjs <project-slug> [--check]"); process.exit(2); }
const dir = path.join(process.cwd(), "content", "projects", slugArg);

const tl = (s) => "`" + s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${") + "`";
const q = (s) => JSON.stringify(s);
const kebab = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const die = (where, msg) => { throw new Error(`${where}: ${msg}`); };

function fenced(text, where) {
  // exactly one ``` block; returns its inner text
  const m = text.match(new RegExp("^" + FENCE + "\\n([\\s\\S]*?)\\n" + FENCE + "$", "m"));
  if (!m) die(where, "expected a fenced code block");
  return m[1];
}
function blocksAfter(label, text, where) {
  // "file: name [(read-only)]\n```\n...\n```" repeated
  const out = [];
  const re = new RegExp("^file: (\\S+)( \\(read-only\\))?\\n" + FENCE + "\\n([\\s\\S]*?)\\n" + FENCE + "$", "gm");
  for (const m of text.matchAll(re)) out.push({ name: m[1], readOnly: !!m[2], content: m[3] + "\n" });
  if (!out.length) die(where, `no files found in "${label}"`);
  return out;
}
function section(text, startLabel, endLabels) {
  const i = text.indexOf(startLabel);
  if (i < 0) return null;
  let rest = text.slice(i + startLabel.length);
  let end = rest.length;
  for (const e of endLabels) { const j = rest.indexOf(e); if (j >= 0 && j < end) end = j; }
  return rest.slice(0, end);
}

function parseLesson(id, body, where) {
  const title = (body.match(/^LESSON TITLE: (.+)$/m) || die(where, "LESSON TITLE missing"))[1].trim();
  const theoryRaw = section(body, "THEORY:\n", ["\nEXAMPLE:\n", "\nPRACTICE:"]) ?? die(where, "THEORY missing");
  const explanation = theoryRaw.trim();
  let example = null;
  const exRaw = section(body, "\nEXAMPLE:\n", ["\nPRACTICE:"]);
  if (exRaw) {
    const d = exRaw.match(/^description: (.+)\n(run: no\n)?code:\n/m) || die(where, "EXAMPLE needs description, optional 'run: no', then code");
    example = { description: d[1].trim(), runnable: !d[2], code: fenced(exRaw.slice(exRaw.indexOf("code:\n") + 6).trim(), where + " example") };
  }
  const practiceRaw = body.slice(body.indexOf("\nPRACTICE:") + 1);
  const kind = (practiceRaw.match(/^PRACTICE: (quiz|code)$/m) || die(where, "PRACTICE: quiz|code missing"))[1];
  let practice;
  if (kind === "quiz") {
    const question = (practiceRaw.match(/^question: (.+)$/m) || die(where, "question missing"))[1].trim();
    const optSec = section(practiceRaw, "options:\n", ["\ncorrect:"]) ?? die(where, "options missing");
    const options = [...optSec.matchAll(/^\d+\. (.+)$/gm)].map((m) => m[1].trim());
    const correct = parseInt((practiceRaw.match(/^correct: (\d+)$/m) || die(where, "correct missing"))[1], 10);
    const explanationQ = (practiceRaw.match(/^explanation: ([\s\S]+)$/m) || die(where, "explanation missing"))[1].trim();
    if (options.length < 2 || correct < 1 || correct > options.length) die(where, "bad options/correct");
    practice = { kind: "quiz", question, options, correctIndex: correct - 1, explanation: explanationQ };
  } else {
    const ins = section(practiceRaw, "instructions: ", ["\nfiles:\n"]) ?? die(where, "instructions missing");
    const filesSec = section(practiceRaw, "\nfiles:\n", ["\nstdin:\n", "\nhints:\n"]) ?? die(where, "files missing");
    // Optional "stdin:" block: one line per input() call, between the files and "hints:".
    const stdinSec = section(practiceRaw, "\nstdin:\n", ["\nhints:\n"]);
    const stdin = stdinSec ? stdinSec.replace(/\n$/, "").split("\n") : null;
    if (stdin && stdin.some((x) => x.trim() === "")) die(where, "every stdin line must be non-empty");
    const files = blocksAfter("files", filesSec, where).map((f) => ({ name: f.name, content: f.content, editable: !f.readOnly }));
    const hintSec = section(practiceRaw, "\nhints:\n", ["\nanswer files (spoiler):\n"]) ?? die(where, "hints missing");
    const hints = [...hintSec.matchAll(/^\d+\. (.+)$/gm)].map((m) => m[1].trim());
    if (hints.length < 2) die(where, "need at least 2 hints");
    const ansSec = section(practiceRaw, "\nanswer files (spoiler):\n", ["\nexpected output (exact):\n"]) ?? die(where, "answer files missing");
    const answerFiles = Object.fromEntries(blocksAfter("answer files", ansSec, where).map((f) => [f.name, f.content]));
    const expSec = section(practiceRaw, "\nexpected output (exact):\n", ["\nsource requirements:\n", "\nsuccess message: "]) ?? die(where, "expected output missing");
    const expected = fenced(expSec.trim(), where + " expected");
    const reqSec = section(practiceRaw, "\nsource requirements:\n", ["\nsuccess message: "]);
    const sourceRequirements = reqSec
      ? [...reqSec.matchAll(/^- (\S+) must contain: (.+?)  -> message: (.+)$/gm)].map((m) => ({ pattern: m[2], message: m[3].trim(), file: m[1] }))
      : [];
    if (reqSec && sourceRequirements.length !== reqSec.trim().split("\n").length) die(where, "unparseable source requirement line");
    const success = (practiceRaw.match(/^success message: (.+)$/m) || die(where, "success message missing"))[1].trim();
    for (const f of Object.keys(answerFiles)) if (!files.some((x) => x.name === f)) die(where, `answer file ${f} is not a lesson file`);
    practice = { kind: "code", instructions: ins.trim(), hints, answerFiles, files, ...(stdin ? { stdin } : {}), checker: { type: "stdout_exact", expected, ...(sourceRequirements.length ? { sourceRequirements } : {}) }, successFeedback: success };
  }
  return { id, slug: kebab(title), title, explanation, example, practice };
}

function emitLesson(l) {
  // A runnable example is shown AND run by the tests. "run: no" (program output,
  // plain text...) is not Python, so it is published as a plain code section instead.
  const ex = !l.example ? ""
    : l.example.runnable
      ? `\n        example: {\n          description: ${tl(l.example.description)},\n          code: ${tl(l.example.code)},\n        },`
      : `\n        sections: [{ text: ${tl(l.example.description)}, code: ${tl(l.example.code)} }],`;
  const p = l.practice;
  let pr;
  if (p.kind === "quiz") {
    pr = `      practice: {\n        kind: "quiz",\n        question: ${tl(p.question)},\n        options: [${p.options.map(q).join(", ")}],\n        correctIndex: ${p.correctIndex},\n        explanation: ${tl(p.explanation)},\n      },`;
  } else {
    const files = p.files.map((f) => `          { name: ${q(f.name)}, content: ${tl(f.content)}${f.editable ? "" : ", editable: false"} },`).join("\n");
    const ans = Object.entries(p.answerFiles).map(([n, c]) => `          ${q(n)}: ${tl(c)},`).join("\n");
    const reqs = p.checker.sourceRequirements ? `\n          sourceRequirements: [\n${p.checker.sourceRequirements.map((r) => `            { pattern: ${tl(r.pattern)}, message: ${tl(r.message)}, file: ${q(r.file)} },`).join("\n")}\n          ],` : "";
    pr = `      practice: {\n        kind: "code",\n        instructions: ${tl(p.instructions)},\n        hints: [\n${p.hints.map((h) => `          ${tl(h)},`).join("\n")}\n        ],\n        files: [\n${files}\n        ],\n        answerFiles: {\n${ans}\n        },${p.stdin ? `\n        stdin: ${JSON.stringify(p.stdin)},` : ""}\n        checker: {\n          type: "stdout_exact",\n          expected: ${tl(p.checker.expected)},${reqs}\n        },\n        successFeedback: ${tl(p.successFeedback)},\n      },`;
  }
  return `    {\n      id: ${q(l.id)},\n      slug: ${q(l.slug)},\n      title: ${q(l.title)},\n      theory: {\n        explanation: ${tl(l.explanation)},${ex}\n      },\n${pr}\n    },`;
}

let drift = 0, written = 0;
const mdFiles = fs.readdirSync(dir).filter((n) => /^bab-\d+-.+\.md$/.test(n)).sort((a, b) => parseInt(a.slice(4)) - parseInt(b.slice(4)));
if (!mdFiles.length) die(dir, "no bab-N-*.md files");
const seen = new Set();
for (const f of mdFiles) {
  const where = f;
  const txt = fs.readFileSync(path.join(dir, f), "utf8");
  if (txt.split(FENCE).length % 2 === 0) die(where, "unbalanced code fences");
  const parts = txt.split(/^--- LESSON (L\d+) ---$/m);
  const head = parts[0];
  const num = parseInt((head.match(/^CHAPTER: (\d+)$/m) || die(where, "CHAPTER missing"))[1], 10);
  const title = (head.match(/^TITLE: (.+)$/m) || die(where, "TITLE missing"))[1].trim();
  const free = (head.match(/^FREE: (yes|no)$/m) || die(where, "FREE: yes|no missing"))[1] === "yes";
  if (seen.has(num)) die(where, `duplicate chapter ${num}`); seen.add(num);
  const lessons = [];
  for (let i = 1; i < parts.length; i += 2) lessons.push(parseLesson(parts[i], parts[i + 1], `${where} ${parts[i]}`));
  const ids = lessons.map((l) => l.id);
  if (new Set(ids).size !== ids.length) die(where, "duplicate lesson id");
  if (!lessons.length) die(where, "no lessons");
  const out = `// AUTO-GENERATED by scripts/convert-project-md.mjs from ${f}.\n// Edit the .md file, then run: node scripts/convert-project-md.mjs ${slugArg}\nimport type { ChapterContent } from "@/content/types";\n\nexport const chapter${num}: ChapterContent = {\n  slug: ${q(kebab(title))},\n  order: ${num},\n  title: ${q(title)},\n  isFree: ${free},\n  status: "published",\n  lessons: [\n${lessons.map(emitLesson).join("\n")}\n  ],\n};\n`;
  const target = path.join(dir, `chapter-${num}.ts`);
  const current = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : null;
  if (current !== out) {
    if (CHECK) { console.log(`OUT OF DATE: ${path.relative(process.cwd(), target)}`); drift++; }
    else { fs.writeFileSync(target, out); written++; console.log(`wrote ${path.relative(process.cwd(), target)} (${lessons.length} lessons)`); }
  }
}
if (CHECK) { if (drift) { console.error(`${drift} generated file(s) differ from their .md`); process.exit(1); } console.log(`generated chapter files match their .md (${mdFiles.length} chapters)`); }
else console.log(`done: ${written} file(s) written`);
