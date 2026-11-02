// Tests for the project download ("take-home"): the zip writer, the rule that unlocks
// it, the README, the "code that passed" snapshot, and that the server (not the
// browser) keeps the model answer back until every code lesson is finished.
//
// Proves: the zip is a valid ZIP (read back and run by Python), the unlock rule, the README
// text, the storage helpers, and the wiring in the page sources.
// Cannot prove here: the click-to-download in a real browser (Blob + anchor) and on a phone.
// Run: node scripts/test-take-home.mjs
import { createRequire } from "node:module";
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const cache = new Map();
function resolveTs(rel) {
  for (const c of [`${rel}.ts`, `${rel}.tsx`, path.join(rel, "index.ts")]) if (fs.existsSync(path.join(root, c))) return c;
  throw new Error(`cannot resolve ${rel}`);
}
function loadTs(rel) {
  if (cache.has(rel)) return cache.get(rel).exports;
  const js = ts.transpileModule(fs.readFileSync(path.join(root, rel), "utf8"), { compilerOptions: { module: "CommonJS", target: "ES2020" } }).outputText;
  const mod = { exports: {} };
  cache.set(rel, mod);
  const req = (id) => (id.startsWith("@/") ? loadTs(resolveTs(id.slice(2))) : id.startsWith(".") ? loadTs(resolveTs(path.join(path.dirname(rel), id))) : require(id));
  new Function("require", "module", "exports", js)(req, mod, mod.exports);
  return mod.exports;
}
let failures = 0, count = 0;
function check(name, actual, expected) {
  count++;
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"} - ${name}${ok ? "" : `\n      got:      ${JSON.stringify(actual)}\n      expected: ${JSON.stringify(expected)}`}`);
}
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");

const { createZip, crc32 } = loadTs("lib/zip.ts");
const TH = loadTs("lib/take-home.ts");
const { projects, getProject, getTakeHome } = loadTs("content/projects/index.ts");
const { lessonKey } = loadTs("lib/progress-keys.ts");
const D = loadTs("lib/code-drafts.ts");
const wc = getProject("word-counter");
const info = getTakeHome(wc);

// ======================= the zip writer =======================
check("crc32 of the standard test string is 0xCBF43926", crc32(new TextEncoder().encode("123456789")), 0xcbf43926);
const big = new Uint8Array(70000).map((_, i) => (i * 31 + 7) & 255);
const entries = [
  { name: "word-counter/README.md", data: "# Judul\n\nIsi dengan karakter non-ASCII: é – “kutip” 日本\n" },
  { name: "word-counter/main.py", data: 'print("halo")\n' },
  { name: "word-counter/kosong.txt", data: "" },
  { name: "word-counter/biner.bin", data: big },
  { name: "word-counter/nama-ünï.txt", data: "nama non-ASCII" },
];
const zipPath = path.join(os.tmpdir(), "test-take-home.zip");
fs.writeFileSync(zipPath, createZip(entries, new Date(2026, 9, 28, 12, 30, 20)));
// Never throws: a broken zip must show up as ONE failed check, not stop the whole script and hide the others.
const py = (code) => {
  const r = spawnSync("python3", ["-c", code, zipPath], { encoding: "utf8" });
  return r.status === 0 ? r.stdout : `PYTHON ERROR: ${r.stderr.trim().split("\n").slice(-1)[0]}`;
};
check("Python's zipfile accepts the archive (testzip finds no bad file)", py("import zipfile,sys;print(zipfile.ZipFile(sys.argv[1]).testzip())").trim(), "None");
check("file names and order are kept (including a non-ASCII name)", JSON.parse(py("import zipfile,sys,json;print(json.dumps(zipfile.ZipFile(sys.argv[1]).namelist()))")), entries.map((e) => e.name));
check("contents are byte-for-byte identical (text, empty, 70 KB binary)", py(`import zipfile,sys,hashlib
z=zipfile.ZipFile(sys.argv[1])
print(z.read("word-counter/README.md").decode("utf-8")=="# Judul\\n\\nIsi dengan karakter non-ASCII: é – “kutip” 日本\\n", z.read("word-counter/kosong.txt")==b"", hashlib.md5(z.read("word-counter/biner.bin")).hexdigest()==hashlib.md5(bytes((i*31+7)&255 for i in range(70000))).hexdigest(), z.read("word-counter/nama-ünï.txt")==b"nama non-ASCII")`).trim(), "True True True True");
check("every entry is 'stored' and flagged as UTF-8", py("import zipfile,sys;z=zipfile.ZipFile(sys.argv[1]);print(all(i.compress_type==0 and i.flag_bits&0x800 for i in z.infolist()))").trim(), "True");
check("the timestamp is the one given", py("import zipfile,sys;z=zipfile.ZipFile(sys.argv[1]);print(z.infolist()[0].date_time)").trim(), "(2026, 10, 28, 12, 30, 20)");
for (const bad of ["../x", "/abs", "a\\b", ""]) {
  let threw = false; try { createZip([{ name: bad, data: "x" }]); } catch { threw = true; }
  check(`an unsafe entry name is refused: ${JSON.stringify(bad)}`, threw, true);
}

// ======================= the unlock rule =======================
const codeLessons = TH.getCodeLessons(wc);
check("29 lessons contain code (every published code lesson, none from Bab 10)", [codeLessons.length, codeLessons.some((l) => l.chapterOrder === 10)], [29, false]);
check("nothing finished -> locked, all 29 remaining (also for a guest: completed = null)", [TH.getTakeHomeState(wc, new Set()).unlocked, TH.getTakeHomeState(wc, null).remaining.length], [false, 29]);
const keyOf = (l) => lessonKey(l.progressSlug, l.lessonId);
check("the key format equals lib/progress-keys.ts", codeLessons.every((l) => keyOf(l) === `${l.progressSlug}:${l.lessonId}`), true);
const allCode = new Set(codeLessons.map(keyOf));
check("every code lesson finished -> unlocked, nothing remaining", [TH.getTakeHomeState(wc, allCode).unlocked, TH.getTakeHomeState(wc, allCode).remaining.length], [true, 0]);
const missingOne = new Set(allCode); const gone = codeLessons[10]; missingOne.delete(keyOf(gone));
const sOne = TH.getTakeHomeState(wc, missingOne);
check("ONE code lesson missing -> still locked, and it is exactly that lesson (with a link to it)", [sOne.unlocked, sOne.remaining.map((l) => l.href)], [false, [gone.href]]);
const everyOtherLesson = new Set(wc.chapters.flatMap((c) => c.lessons.map((l) => [c, l])).filter(([, l]) => l.practice.kind !== "code").map(([c, l]) => lessonKey(`word-counter/${c.slug}`, l.id)));
check("quizzes and the open challenge alone do NOT unlock it", TH.getTakeHomeState(wc, everyOtherLesson).unlocked, false);
check("...and the unfinished open challenge does not keep it locked", TH.getTakeHomeState(wc, allCode).unlocked, true);
const last = TH.getLastCodeLesson(wc);
check("the program is the last code lesson: Bab 9 L4, files main.py + fungsi.py", [last.ref.chapterOrder, last.ref.lessonId, TH.editableFileNames(last.practice)], [9, "L4", ["main.py", "fungsi.py"]]);
const mc = TH.modelCode(last.practice);
check("model answer: BOTH files are complete (fungsi.py is not listed in answerFiles of that lesson, so it must come from the starter, never empty)", [Object.keys(mc), mc["main.py"].includes("def main()"), mc["fungsi.py"].includes("def urutkan_frekuensi"), mc["fungsi.py"].includes("def hitung_frekuensi"), Object.values(mc).every((c) => c.trim().length > 50)], [["main.py", "fungsi.py"], true, true, true, true]);
check("model answer contains no leftover TODO notes", Object.values(mc).some((c) => /TODO/.test(c)), false);
const article = read("content/projects/word-counter/artikel-kopi.txt");
check("the seed file for the zip really is the article", info.seedFiles.map((n) => last.practice.files.find((f) => f.name === n)?.content), [article]);

// ======================= README =======================
const label = "Bab 9, lesson 4: File Kosong dan Kata Sedikit";
const readmeOwn = info.buildReadme(true, label), readmeModel = info.buildReadme(false, label);
const ch9L1 = wc.chapters.find((c) => c.slug === "input-dan-file-hilang").lessons[0].practice.checker.expected;
check("the sample output in the README is EXACTLY the program's output (Bab 9 L1 expected)", readmeOwn.includes("```\n" + ch9L1 + "\n```"), true);
check("README tells how to run it and what the files are", ["python main.py", "python3 main.py", "`main.py`", "`fungsi.py`", "`artikel-kopi.txt`", "python.org"].map((x) => readmeOwn.includes(x)), [true, true, true, true, true, true]);
check("README (own code) is honest: built step by step with PyMula's starting code, not 'from scratch alone'", [readmeOwn.includes(label), /bukan ditulis dari nol/.test(readmeOwn)], [true, true]);
check("README (model code) says it is the example version and why", [readmeModel.includes("versi contoh"), readmeModel.includes("tidak ditemukan di perangkat ini"), /bukan ditulis dari nol/.test(readmeModel)], [true, true, false]);
check("README never claims the learner wrote everything alone", [readmeOwn, readmeModel].map((r) => /kamu tulis sendiri|ditulis sendiri sepenuhnya|karyamu sendiri/i.test(r)), [false, false]);

// ======================= end to end: zip -> extract -> run =======================
const model = TH.modelCode(last.practice);
const zipEntries = TH.buildTakeHomeEntries({ folder: info.folder, code: model, seed: Object.fromEntries(info.seedFiles.map((n) => [n, article])), readme: readmeModel });
check("the zip holds README + program + data under one folder", zipEntries.map((e) => e.name), ["word-counter/README.md", "word-counter/main.py", "word-counter/fungsi.py", "word-counter/artikel-kopi.txt"]);
const out = path.join(os.tmpdir(), "take-home-e2e"); fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
const zp = path.join(out, "word-counter.zip"); fs.writeFileSync(zp, createZip(zipEntries));
const extracted = spawnSync("python3", ["-c", "import zipfile,sys;zipfile.ZipFile(sys.argv[1]).extractall(sys.argv[2])", zp, out], { encoding: "utf8" });
check("the download extracts without errors", extracted.status, 0);
// run it the way the learner would, with 'Nama file:' typed and echoed like a terminal
const runner = `import builtins,sys
def _in(p=""):
    sys.stdout.write(p); sys.stdout.write("artikel-kopi.txt\\n"); return "artikel-kopi.txt"
builtins.input=_in
sys.path.insert(0,".")
exec(compile(open("main.py").read(),"main.py","exec"),{"__name__":"__main__"})`;
const run = spawnSync("python3", ["-c", runner], { cwd: path.join(out, "word-counter"), encoding: "utf8" });
// the site's checker ignores spaces at the end of a line (.center() pads the title line), so this does too
const trimEnds = (s) => s.split("\n").map((l) => l.replace(/\s+$/, "")).join("\n").trim();
check("the extracted program runs and prints exactly the target output", [run.status, trimEnds(run.stdout)], [0, ch9L1]);

// ======================= the code that passed =======================
class Store { constructor() { this.m = new Map(); } get length() { return this.m.size; } key(i) { return [...this.m.keys()][i] ?? null; } getItem(k) { return this.m.has(k) ? this.m.get(k) : null; } setItem(k, v) { this.m.set(k, v); } removeItem(k) { this.m.delete(k); } }
const st = new Store();
const pk = D.passedKey("user-1", "word-counter/input-dan-file-hilang", "L4");
check("passed-code key is per user, chapter and lesson", pk, "pymula:passed:v1:user-1:word-counter/input-dan-file-hilang:L4");
check("save then load returns the same files", [D.savePassed(st, pk, { "main.py": "a", "fungsi.py": "b" }), D.loadPassed(st, pk)], ["saved", { "main.py": "a", "fungsi.py": "b" }]);
check("another user cannot read it (different key)", D.loadPassed(st, D.passedKey("user-2", "word-counter/input-dan-file-hilang", "L4")), null);
check("nothing to save -> skipped", D.savePassed(st, "k", {}), "skipped");
st.setItem("bad1", "{not json"); st.setItem("bad2", JSON.stringify({ files: { "main.py": 5 } })); st.setItem("bad3", JSON.stringify({ files: ["x"] }));
check("corrupt, non-string or array values load as null (never throw)", ["bad1", "bad2", "bad3", "missing"].map((k) => D.loadPassed(st, k)), [null, null, null, null]);
check("a full or blocked storage reports 'failed' instead of throwing", D.savePassed({ setItem() { throw new Error("quota"); } }, "k", { "main.py": "a" }), "failed");
st.setItem(D.draftKey("user-1", "x", "L1"), JSON.stringify({ code: "c", starter: "s", savedAt: 1 })); st.setItem("sb-auth-token", "keep me");
check("sign-out cleanup removes passed code AND drafts (2 keys), and nothing else (4 other keys stay)", [D.clearAllDrafts(st), st.length, st.getItem("sb-auth-token")], [2, 4, "keep me"]);

// ======================= the open challenge and the open lesson shapes =======================
const ch10 = wc.chapters.find((c) => c.slug === "selesai-dan-bawa-pulang");
check("Bab 10: five quizzes, then one open challenge", ch10.lessons.map((l) => l.practice.kind), ["quiz", "quiz", "quiz", "quiz", "quiz", "open"]);
check("only L2 shows the download box", ch10.lessons.map((l) => !!l.takeHome), [false, true, false, false, false, false]);
const open = ch10.lessons[5].practice;
check("the open challenge has a prompt, 2-5 ideas and a success message, and no checker or answer", [!!open.prompt, open.ideas.length >= 2 && open.ideas.length <= 5, !!open.successFeedback, "checker" in open, "answerFiles" in open], [true, true, true, false, false]);
check("no other lesson of the project has the download box", wc.chapters.flatMap((c) => c.lessons ?? []).filter((l) => l.takeHome).length, 1);

// ======================= wiring in the sources =======================
const lessonPage = read("app/proyek/[project]/[slug]/[lessonId]/page.tsx");
const iElse = lessonPage.indexOf("} else {", lessonPage.indexOf("!state.unlocked"));
check("lesson page: the model answer and README are built only in the UNLOCKED branch (server side)", [lessonPage.indexOf("modelCode:") > iElse && iElse > 0, lessonPage.indexOf("readmeOwn:") > iElse, lessonPage.slice(lessonPage.indexOf("!state.unlocked"), iElse).includes("modelCode")], [true, true, false]);
check("lesson page builds the fallback code with modelCode() (not a bare answerFiles lookup that can come out empty)", [/modelCode: modelCode\(last\.practice\)/.test(lessonPage), /answerFiles\?\.\[n\] \?\? ""/.test(lessonPage)], [true, false]);
check("lesson page: the box is decided from the server-side progress (getTakeHomeState with the completed keys)", /getTakeHomeState\(project, completed\)/.test(lessonPage) && /if \(lesson\.takeHome\)/.test(lessonPage), true);
const dl = read("components/learn/TakeHomeDownload.tsx");
check("the download component never imports the content registry or answers (they would be bundled into the browser)", [/@\/content\/projects/.test(dl), /answerFiles/.test(dl)], [false, false]);
check("the download component prefers the passed code and falls back to the model answer", /loadPassed\(/.test(dl) && /modelCode/.test(dl) && /readmeOwn/.test(dl) && /readmeModel/.test(dl), true);
const ch = read("components/learn/Challenge.tsx");
check("Challenge remembers the passing code BEFORE it marks the lesson complete", ch.indexOf("rememberPassedFiles(") > 0 && ch.indexOf("rememberPassedFiles(") < ch.indexOf("await markLessonComplete("), true);
check("Practice renders the open task", /kind === "open"/.test(read("components/learn/Practice.tsx")) && /OpenChallenge/.test(read("components/learn/Practice.tsx")), true);
const oc = read("components/learn/OpenChallenge.tsx");
check("the open challenge marks completion only when the learner says so, and never calls the checker", [/markLessonComplete/.test(oc), /checkOutput|checkQuizAnswer/.test(oc)], [true, false]);

console.log(`\n${count - failures}/${count} take-home checks passed.`);
if (failures) { console.log(`${failures} FAILED`); process.exit(1); }
console.log("All take-home checks passed.");
