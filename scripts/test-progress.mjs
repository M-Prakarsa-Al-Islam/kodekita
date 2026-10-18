// Tests for the progress UI: the pure maths (lib/progress-summary.ts) and the
// markup of the two display components. Run: node scripts/test-progress.mjs
// (Cannot prove: how it looks in a browser - check visually.)
import { createRequire } from "node:module";
import fs from "node:fs";
import ts from "typescript";

const require = createRequire(import.meta.url);
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

function load(file, extra = {}) {
  const src = fs.readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
  const js = ts.transpileModule(src, {
    compilerOptions: { module: "CommonJS", target: "ES2020", jsx: "react-jsx" },
  }).outputText;
  const mod = { exports: {} };
  const req = (id) => (id in extra ? extra[id] : require(id));
  new Function("require", "module", "exports", js)(req, mod, mod.exports);
  return mod.exports;
}

const keys = load("lib/progress-keys.ts");
const { summarizeProgress } = load("lib/progress-summary.ts", { "./progress-keys": keys });
const ProgressBar = load("components/ui/ProgressBar.tsx").default;
const ChapterProgress = load("components/learn/ChapterProgress.tsx").default;

let failures = 0, count = 0;
function check(name, actual, expected) {
  count++;
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"} - ${name}${ok ? "" : `\n      expected ${JSON.stringify(expected)}\n      got      ${JSON.stringify(actual)}`}`);
}

// Fixture: c1 (free) L1,L2 | c2 (free) L1 | c3 (paid) L1,L2
const L = (chapterSlug, lessonId, free) => ({
  chapterSlug, chapterTitle: chapterSlug.toUpperCase(), chapterIsFree: free, lessonId, lessonTitle: `${chapterSlug} ${lessonId}`,
});
const lessons = [L("c1","L1",true), L("c1","L2",true), L("c2","L1",true), L("c3","L1",false), L("c3","L2",false)];
const done = (...k) => new Set(k.map((x) => x));
const brief = (s) => ({ totalAll: s.totalAll, doneAll: s.doneAll, scopeTotal: s.scopeTotal, scopeDone: s.scopeDone, percent: s.percent,
  next: s.next && `${s.next.chapterSlug}:${s.next.lessonId}`, lockedNext: s.lockedNext && `${s.lockedNext.chapterSlug}:${s.lockedNext.lessonId}` });

check("lessonKey format is unchanged (matches rows already in the DB)", keys.lessonKey("1-intro", "L3"), "1-intro:L3");

// --- summarizeProgress ---
check("nothing done, not purchased: scope = free lessons only, next = first lesson",
  brief(summarizeProgress(lessons, done(), false)),
  { totalAll: 5, doneAll: 0, scopeTotal: 3, scopeDone: 0, percent: 0, next: "c1:L1", lockedNext: null });
check("one done: next moves on, 33%",
  brief(summarizeProgress(lessons, done("c1:L1"), false)),
  { totalAll: 5, doneAll: 1, scopeTotal: 3, scopeDone: 1, percent: 33, next: "c1:L2", lockedNext: null });
check("out-of-order completion: next is the FIRST unfinished lesson",
  summarizeProgress(lessons, done("c1:L2"), false).next.lessonId, "L1");
check("all free done, not purchased: no next link, paywall lesson reported instead, 100%",
  brief(summarizeProgress(lessons, done("c1:L1","c1:L2","c2:L1"), false)),
  { totalAll: 5, doneAll: 3, scopeTotal: 3, scopeDone: 3, percent: 100, next: null, lockedNext: "c3:L1" });
check("all free done, purchased: next is the first paid lesson, scope is the whole course (60%)",
  brief(summarizeProgress(lessons, done("c1:L1","c1:L2","c2:L1"), true)),
  { totalAll: 5, doneAll: 3, scopeTotal: 5, scopeDone: 3, percent: 60, next: "c3:L1", lockedNext: null });
check("everything done, purchased: no next, nothing locked, 100%",
  brief(summarizeProgress(lessons, done("c1:L1","c1:L2","c2:L1","c3:L1","c3:L2"), true)),
  { totalAll: 5, doneAll: 5, scopeTotal: 5, scopeDone: 5, percent: 100, next: null, lockedNext: null });
check("stale rows for lessons that no longer exist are NOT counted (never >100%)",
  brief(summarizeProgress(lessons, done("c1:L1","old-chapter:L9","c1:L99"), false)),
  { totalAll: 5, doneAll: 1, scopeTotal: 3, scopeDone: 1, percent: 33, next: "c1:L2", lockedNext: null });
check("a paid lesson completed earlier counts toward doneAll but not the free-only scope",
  brief(summarizeProgress(lessons, done("c3:L1"), false)),
  { totalAll: 5, doneAll: 1, scopeTotal: 3, scopeDone: 0, percent: 0, next: "c1:L1", lockedNext: null });
check("empty course does not crash or divide by zero",
  brief(summarizeProgress([], done(), true)),
  { totalAll: 0, doneAll: 0, scopeTotal: 0, scopeDone: 0, percent: 0, next: null, lockedNext: null });
check("percent rounds to a whole number (2/3 = 67)", summarizeProgress(lessons, done("c1:L1","c1:L2"), false).percent, 67);

// --- ProgressBar markup ---
const bar = (props) => renderToStaticMarkup(React.createElement(ProgressBar, props));
let html = bar({ value: 3, max: 8, label: "Progres X" });
check("bar: role + aria values", [html.includes('role="progressbar"'), html.includes('aria-valuenow="3"'), html.includes('aria-valuemax="8"'), html.includes('aria-valuemin="0"'), html.includes('aria-label="Progres X"')], [true, true, true, true, true]);
check("bar: 3/8 renders width 38%", html.includes("width:38%"), true);
check("bar: value above max is clamped to 100%", bar({ value: 10, max: 8, label: "x" }).includes("width:100%"), true);
check("bar: negative value is clamped to 0%", bar({ value: -2, max: 8, label: "x" }).includes("width:0%"), true);
html = bar({ value: 0, max: 0, label: "x" });
check("bar: max 0 gives 0% and no NaN anywhere", [html.includes("width:0%"), html.includes("NaN")], [true, false]);
check("bar: small size uses the thin height", bar({ value: 1, max: 2, label: "x", size: "sm" }).includes("h-1.5"), true);

// --- ChapterProgress markup ---
const les = [{ id: "L1", title: "Satu" }, { id: "L2", title: "Dua" }, { id: "L3", title: "Tiga" }, { id: "L4", title: "Empat" }];
html = renderToStaticMarkup(React.createElement(ChapterProgress, { lessons: les, currentId: "L2", completedIds: ["L1"] }));
check("segments: shows 'Lesson 2/4' and '1/4 selesai'", [html.includes("Lesson 2/4"), html.includes("1/4 selesai")], [true, true]);
check("segments: one <li> per lesson", (html.match(/<li /g) || []).length, 4);
check("segments: exactly one aria-current=step", (html.match(/aria-current="step"/g) || []).length, 1);
check("segments: screen-reader text for each state", [html.includes("Satu: selesai"), html.includes("Dua: sedang dibuka"), html.includes("Tiga: belum selesai")], [true, true, true]);
check("segments: finished lesson is green", /<li[^>]*title="Satu"[^>]*class="[^"]*bg-code/.test(html) || /<li[^>]*class="[^"]*bg-code[^"]*"[^>]*title="Satu"/.test(html), true);
html = renderToStaticMarkup(React.createElement(ChapterProgress, { lessons: les, currentId: "L1", completedIds: ["L1", "L2", "GONE"] }));
check("segments: unknown completed ids are ignored (still 2/4)", html.includes("2/4 selesai"), true);
html = renderToStaticMarkup(React.createElement(ChapterProgress, { lessons: les, currentId: "L1", completedIds: [] }));
check("segments: nothing done -> 0/4 selesai", html.includes("0/4 selesai"), true);

console.log(`\n${count - failures}/${count} progress test-cases behaved as expected.`);
process.exit(failures ? 1 : 0);
