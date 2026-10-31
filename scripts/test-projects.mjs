// Tests for the project courses (Word Counter): content rules, the namespaced
// progress keys, the route guard, the paywall wiring in the page sources, the
// seed article's numbers, and that the generated .ts matches its .md.
// Run: node scripts/test-projects.mjs
// (Lessons are executed in the real Pyodide by scripts/test-lessons-pyodide.mjs.
//  Cannot prove here: how the pages look in a browser - check visually.)
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
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
  const src = fs.readFileSync(path.join(root, rel), "utf8");
  const js = ts.transpileModule(src, { compilerOptions: { module: "CommonJS", target: "ES2020" } }).outputText;
  const mod = { exports: {} };
  cache.set(rel, mod);
  const req = (id) => {
    if (id.startsWith("@/")) return loadTs(resolveTs(id.slice(2)));
    if (id.startsWith(".")) return loadTs(resolveTs(path.join(path.dirname(rel), id)));
    return require(id);
  };
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

const { projects, getProject, getProjectLessons, getProjectAdjacent, getProjectNavChapters, getProjectLesson } = loadTs("content/projects/index.ts");
const { getCoursePrice } = loadTs("content/pricing.ts");
const paths = loadTs("lib/project-paths.ts");
const { summarizeProgress } = loadTs("lib/progress-summary.ts");
const { lessonKey } = loadTs("lib/progress-keys.ts");
const guard = loadTs("lib/route-guard.ts");
const dasar = loadTs("content/chapters/index.ts");

const wc = getProject("word-counter");
check("registry: word-counter exists, unknown slug does not", [!!wc, getProject("nope")], [true, undefined]);
check("registry: project slugs are unique", new Set(projects.map((p) => p.slug)).size, projects.length);

// ---------- content rules (every project) ----------
for (const p of projects) {
  const orders = p.chapters.map((c) => c.order);
  check(`${p.slug}: chapter orders unique and ascending`, orders, [...new Set(orders)].sort((a, b) => a - b));
  check(`${p.slug}: chapter slugs unique and url-safe (no "/")`, p.chapters.every((c) => /^[a-z0-9-]+$/.test(c.slug)) && new Set(p.chapters.map((c) => c.slug)).size === p.chapters.length, true);
  check(`${p.slug}: has a price`, getCoursePrice(p.slug) > 0, true);
  for (const c of p.chapters) {
    if (c.status === "todo") { check(`${p.slug}/${c.slug}: planned chapter has no lessons`, "lessons" in c, false); continue; }
    check(`${p.slug}/${c.slug}: lesson ids are L1..Ln in order`, c.lessons.map((l) => l.id), c.lessons.map((_, i) => `L${i + 1}`));
    check(`${p.slug}/${c.slug}: lesson slugs unique`, new Set(c.lessons.map((l) => l.slug)).size, c.lessons.length);
    for (const l of c.lessons) {
      const pr = l.practice;
      if (pr.kind !== "code") continue;
      const names = pr.files.map((f) => f.name);
      check(`${p.slug}/${c.slug} ${l.id}: files are main.py + fungsi.py + read-only seed (+ read-only extra data)`, [names.slice(0, 3), pr.files.find((f) => f.name === "main.py").editable !== false, pr.files.find((f) => f.name === "artikel-kopi.txt").editable, pr.files.slice(3).every((f) => f.editable === false)], [["main.py", "fungsi.py", "artikel-kopi.txt"], true, false, true]);
      for (const line of pr.stdin ?? []) check(`${p.slug}/${c.slug} ${l.id}: stdin line "${line}" is echoed in the expected output like a terminal`, pr.checker.expected.split("\n").some((x) => x.endsWith(line) && x.startsWith("Nama file: ")), true);
      check(`${p.slug}/${c.slug} ${l.id}: has 2-3 hints and answerFiles for main.py`, [pr.hints.length >= 2 && pr.hints.length <= 3, typeof pr.answerFiles?.["main.py"]], [true, "string"]);
    }
  }
}
check("word-counter: Bab 1 and 2 are free, the rest are paid", wc.chapters.map((c) => c.isFree), wc.chapters.map((c) => c.order <= 2));
check("word-counter: price is Rp10.000", getCoursePrice("word-counter"), 10000);

// ---------- what the learner reads must be reliable ----------
// The lesson UI collapses runs of spaces in ordinary text, so any text where
// spaces matter must sit in a ``` block (lib/lesson-text.ts). And a hint is a
// nudge, never a line the learner can copy as the answer.
const outsideFences = (t) => { let inFence = false; return t.split("\n").filter((l) => { if (/^\s*```\s*$/.test(l)) { inFence = !inFence; return false; } return !inFence; }).join("\n"); };
const fencedBlocks = (t) => { const out = []; let cur = null; for (const l of t.split("\n")) { if (/^\s*```\s*$/.test(l)) { if (cur) { out.push(cur); cur = null; } else cur = []; } else if (cur) cur.push(l); } return out; };
const squash = (x) => x.replace(/\s+/g, "");
for (const p of projects) for (const c of p.chapters) {
  if (c.status !== "published") continue;
  for (const l of c.lessons) {
    const pr = l.practice;
    const prose = pr.kind === "code"
      ? { instructions: pr.instructions, success: pr.successFeedback, ...Object.fromEntries(pr.hints.map((h, i) => [`hint ${i + 1}`, h])) }
      : { question: pr.question, explanation: pr.explanation, ...Object.fromEntries(pr.options.map((o, i) => [`option ${i + 1}`, o])) };
    prose.theory = l.theory.explanation;
    const where = `${p.slug} Bab ${c.order} ${l.id}`;
    const spaced = Object.entries(prose).filter(([, t]) => t && /\S {2,}\S/.test(outsideFences(t))).map(([k]) => k);
    check(`${where}: no text relies on runs of spaces outside a code block`, spaced, []);
    if (pr.kind !== "code") continue;
    const answerLines = Object.values(pr.answerFiles).flatMap((src) => src.split("\n").map((x) => x.trim())).filter((x) => x.length >= 10 && !x.startsWith("#"));
    const leaked = pr.hints.filter((h) => answerLines.some((a) => squash(h).includes(squash(a))));
    check(`${where}: hints do not contain a copyable answer line`, leaked, []);
    const expectedLines = new Set(pr.checker.expected.split("\n"));
    const shown = fencedBlocks(pr.instructions).flat().filter((x) => x.trim() && !x.startsWith("("));
    check(`${where}: every line shown in the instructions' code blocks is a line of the checked output (same spacing)`, shown.filter((x) => !expectedLines.has(x)), []);
  }
}

// ---------- explanation standard (AUTHORING_TEMPLATE_PROYEK.md, "Standar penjelasan") ----------
// A chapter is listed here once it has been (re)written to the standard. Other chapters are
// still to be reviewed; add a chapter's slug when it is. The vague phrases below are what made
// the first Bab 7 impossible to follow: they name an idea without ever showing it.
const STANDARD_CHAPTERS = new Set(["mengurutkan-5-teratas"]);
const VAGUE = ["sekumpulan data", "isi pertama", "isi kedua", "isi keduanya", "kita perlu melihatnya dulu"];
for (const c of wc.chapters.filter((x) => STANDARD_CHAPTERS.has(x.slug))) {
  for (const l of c.lessons) {
    const where = `word-counter ${c.slug} ${l.id}`;
    const all = [l.theory.explanation, ...(l.theory.sections ?? []).map((x) => x.text ?? ""), l.theory.example?.description ?? "", l.practice.kind === "code" ? l.practice.instructions : l.practice.question].join("\n").toLowerCase();
    check(`${where}: no vague, unexplained wording`, VAGUE.filter((v) => all.includes(v)), []);
    check(`${where}: theory explains in at least 3 paragraphs and shows an example`, [l.theory.explanation.split(/\n\s*\n/).length >= 3, !!(l.theory.example || l.theory.sections?.length)], [true, true]);
    if (l.practice.kind !== "code") continue;
    const ins = l.practice.instructions;
    check(`${where}: instructions start with a one-sentence goal ("Tujuan:"), then "Tugasmu:" with numbered steps, then a result block`, [ins.startsWith("Tujuan: "), /\nTugasmu:\n1\. /.test(ins), fencedBlocks(ins).length >= 1, ins.indexOf("Tujuan:") < ins.indexOf("Tugasmu:")], [true, true, true, true]);
    check(`${where}: the result block is explained in words (a sentence introduces it, and says if it is temporary)`, [/Hasilnya harus seperti ini/.test(ins), /sementara|dirapikan|berikutnya/i.test(ins) || !ins.includes("sementara")], [true, true]);
    check(`${where}: exactly 3 graded hints`, l.practice.hints.length, 3);
    check(`${where}: the success message looks ahead (says what comes next or what was learned)`, /lesson berikutnya|berikutnya|Bab berikutnya|Kamu sudah|Terbukti|Berhasil|Jawaban untuk/.test(l.practice.successFeedback), true);
  }
}

// ---------- the starter of every lesson = the answer of the previous one (code lines only) ----------
// The learner's own code is NOT carried between lessons (15.2), so the authored starter is the
// only thing connecting two lessons. If it drifts from the previous answer the learner meets code
// they never saw. Comment lines (the TODOs) and blank lines are ignored.
const codeOnly = (src) => (src ?? "").split("\n").filter((x) => x.trim() && !x.trim().startsWith("#")).map((x) => x.replace(/\s+$/, "")).join("\n");
const seq = wc.chapters.filter((c) => c.status === "published").flatMap((c) => c.lessons.map((l) => ({ c, l }))).filter(({ l }) => l.practice.kind === "code");
for (let k = 1; k < seq.length; k++) {
  const prev = seq[k - 1], cur = seq[k];
  if (prev.c.order === 1 && prev.l.id === "L2") continue; // Bab 1 L2 is a scratch lesson; Bab 1 L3 starts clean on purpose
  for (const file of ["main.py", "fungsi.py"]) {
    const a = prev.l.practice.answerFiles[file] ?? prev.l.practice.files.find((f) => f.name === file).content; // unchanged files carry over
    const b = cur.l.practice.files.find((f) => f.name === file).content;
    check(`continuity ${file}: Bab ${cur.c.order} ${cur.l.id} starts from the answer of Bab ${prev.c.order} ${prev.l.id}`, codeOnly(b), codeOnly(a));
  }
}

// ---------- spec guard: banner + summary format in every expected output ----------
const BANNER = ["=".repeat(34), " ".repeat(11) + "WORD COUNTER", "=".repeat(34)];
const codeLessons = wc.chapters.filter((c) => c.status === "published").flatMap((c) => c.lessons.map((l) => ({ c, l }))).filter(({ l }) => l.practice.kind === "code");
for (const { c, l } of codeLessons) {
  if (c.order === 1 && l.id === "L2") continue; // scratch lesson, no banner by design
  check(`word-counter Bab ${c.order} ${l.id}: expected output starts with the exact banner`, l.practice.checker.expected.split("\n").slice(0, 3), BANNER);
}
const allExpected = codeLessons.map(({ l }) => l.practice.checker.expected).join("\n");
check("summary lines always use the specified spacing (colons aligned)", [...new Set([...allExpected.matchAll(/^(Jumlah kata|Kata unik) +: \d+$/gm)].map((m) => m[0].replace(/\d+$/, "N")))].sort(), ["Jumlah kata      : N", "Kata unik        : N"]);
check("no summary line in any lesson is written with other spacing", (allExpected.match(/^(Jumlah kata|Kata unik)\b.*$/gm) || []).filter((l) => !/^(Jumlah kata {6}|Kata unik {8}): \d+$/.test(l)), []);

// ---------- the seed article: the numbers every lesson depends on ----------
const articlePath = path.join(root, "content/projects/word-counter/artikel-kopi.txt");
const article = fs.readFileSync(articlePath, "utf8");
const PUNCT = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
const strip = (w) => { let a = 0, b = w.length; while (a < b && PUNCT.includes(w[a])) a++; while (b > a && PUNCT.includes(w[b - 1])) b--; return w.slice(a, b); };
const raw = article.split(/\s+/).filter(Boolean);
const words = raw.map((w) => strip(w).toLowerCase()).filter(Boolean);
const freq = new Map();
for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);
const top5 = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5); // JS sort is stable: ties keep first appearance
check("artikel-kopi.txt: 93 raw pieces, 70 raw unique", [raw.length, new Set(raw).size], [93, 70]);
check("artikel-kopi.txt: 92 words and 59 unique after cleaning", [words.length, freq.size], [92, 59]);
check("artikel-kopi.txt: top 5 (ties by first appearance)", top5, [["kopi", 12], ["di", 7], ["yang", 5], ["banyak", 4], ["orang", 3]]);
check("artikel-kopi.txt: the tie at count 3 is orang, dan, biji (first appearance picks orang)", words.filter((w, i) => freq.get(w) === 3 && words.indexOf(w) === i), ["orang", "dan", "biji"]);
// The numbers each lesson promises must equal an INDEPENDENT calculation from the article (not just the lesson's own answer).
const lowerOnly = new Set(raw.map((w) => w.toLowerCase()));
const stripped = raw.map((w) => strip(w.toLowerCase()));
const expectedOf = (chapterSlug, id) => wc.chapters.find((c) => c.slug === chapterSlug).lessons.find((l) => l.id === id).practice.checker.expected;
const sum = (jumlah, unik) => ["--- Ringkasan ---", `Jumlah kata      : ${jumlah}`, `Kata unik        : ${unik}`];
check("Bab 3: raw pieces and raw unique", expectedOf("memecah-teks-menjadi-kata", "L3").split("\n").slice(-3), sum(raw.length, new Set(raw).size));
check("Bab 4 L1: lowercase only", expectedOf("membersihkan-kata", "L1").split("\n").slice(-3), sum(raw.length, lowerOnly.size));
check("Bab 4 L2: + punctuation stripped (an empty word still counts)", expectedOf("membersihkan-kata", "L2").split("\n").slice(-3), sum(stripped.length, new Set(stripped).size));
{
  // Bab 4 L2 introduces the string module: it must refresh what a module is, say why it is used, and show the dotted access.
  const th = wc.chapters.find((c) => c.slug === "membersihkan-kata").lessons[1].theory.explanation;
  check("Bab 4 L2 explains what a module is, that it is built in, how to import and use it, and why string is used", [/modul adalah/i, /bawaan/i, /import/, /nama modul, titik/i, /string\.punctuation/, /Kenapa memakai modul string/i].map((re) => re.test(th)), [true, true, true, true, true, true]);
}
check("Bab 4 L3 and L4: empty words dropped = the final numbers", ["L3", "L4"].map((id) => expectedOf("membersihkan-kata", id).split("\n").slice(-3)), [sum(words.length, freq.size), sum(words.length, freq.size)]);
check("Bab 5: summary unchanged in every lesson", ["L1", "L2", "L3"].map((id) => expectedOf("fungsi-dan-modul", id).split("\n").slice(-3)), [sum(words.length, freq.size), sum(words.length, freq.size), sum(words.length, freq.size)]);
check("Bab 6 L1/L2: the kopi example", ["L1", "L2"].map((id) => expectedOf("menghitung-frekuensi", id).split("\n").slice(-1)[0]), [`Contoh: kata kopi muncul ${freq.get("kopi")} kali`, `Contoh: kata kopi muncul ${freq.get("kopi")} kali`]);
check("Bab 6 L3: words with 3+ occurrences, in first-appearance (dict) order", expectedOf("menghitung-frekuensi", "L3").split("\n").slice(-8), ["Kata yang muncul 3 kali atau lebih:", ...[...freq.entries()].filter(([, v]) => v >= 3).map(([k, v]) => `${k}: ${v}`)]);
// ----- Bab 7-9: ranking, columns and the final report, again from an independent calculation -----
const byCount = [...freq.entries()].sort((a, b) => b[1] - a[1]); // stable: ties keep first appearance
const alpha = [...freq.entries()].sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
const kv = (pairs) => pairs.map(([k, v]) => `${k}: ${v}`);
const tailOf = (chapter, id, n) => expectedOf(chapter, id).split("\n").slice(-n);
const pairText = (pairs) => "[" + pairs.map(([k, v]) => `('${k}', ${v})`).join(", ") + "]";
check("Bab 7 L1: the five biggest counts as plain numbers", tailOf("mengurutkan-5-teratas", "L1", 1), [`5 jumlah terbesar: [${byCount.slice(0, 5).map(([, v]) => v).join(", ")}]`]);
check("Bab 7 L2: default sorted() on pairs is alphabetical by word (first three pairs shown as tuples)", tailOf("mengurutkan-5-teratas", "L2", 1), [`Tiga pasangan pertama: ${pairText(alpha.slice(0, 3))}`]);
check("Bab 7 L3: key + reverse gives the top three", tailOf("mengurutkan-5-teratas", "L3", 4), ["Tiga kata teratas:", ...kv(byCount.slice(0, 3))]);
check("Bab 7 L4: ranks 4-7 prove the tie rule (orang, dan, biji = first appearance, not alphabetical)", tailOf("mengurutkan-5-teratas", "L4", 5), ["Peringkat 4 sampai 7:", ...kv(byCount.slice(3, 7))]);
check("Bab 7 L4: ... and that really is NOT alphabetical order", [byCount.slice(4, 7).map(([k]) => k), alpha.filter(([k]) => ["orang", "dan", "biji"].includes(k)).map(([k]) => k)], [["orang", "dan", "biji"], ["biji", "dan", "orang"]]);
check("Bab 7 L5: top five", tailOf("mengurutkan-5-teratas", "L5", 6), ["5 kata teratas:", ...kv(byCount.slice(0, 5))]);
const top5rows = byCount.slice(0, 5).map(([k, v]) => `${k.padEnd(10)}${String(v).padStart(4)}`);
const top5num = top5rows.map((r, i) => `${i + 1}. ${r}`);
check("Bab 8 L1: columns (word left 10, count right 4)", tailOf("merapikan-tampilan", "L1", 6), ["5 kata teratas:", ...top5rows]);
check("Bab 8 L2: numbered rows", tailOf("merapikan-tampilan", "L2", 6), ["5 kata teratas:", ...top5num]);
const SPEC = ["=".repeat(34), " ".repeat(11) + "WORD COUNTER", "=".repeat(34), "Nama file: artikel-kopi.txt", "", "Membaca file: artikel-kopi.txt", "", "--- Ringkasan ---", "Jumlah kata      : 92", "Kata unik        : 59", "", "--- 5 kata yang paling sering muncul ---", "1. kopi        12", "2. di           7", "3. yang         5", "4. banyak       4", "5. orang        3"].join("\n");
// SPEC above is the target output as written by the owner (PROJECT_DESIGN 5.1): literal text, not computed.
check("Bab 8 L3: everything except the Nama file lines of the spec", expectedOf("merapikan-tampilan", "L3"), SPEC.replace("Nama file: artikel-kopi.txt\n\n", ""));
check("Bab 9 L1: the output is EXACTLY the target output of the spec (PROJECT_DESIGN 5.1)", expectedOf("input-dan-file-hilang", "L1"), SPEC);
check("Bab 9 L2: wrapping in main() changes nothing", expectedOf("input-dan-file-hilang", "L2"), SPEC);
check("Bab 9 L3: missing file prints the friendly message and stops (no summary)", expectedOf("input-dan-file-hilang", "L3"), ["=".repeat(34), " ".repeat(11) + "WORD COUNTER", "=".repeat(34), "Nama file: hilang.txt", "", "File 'hilang.txt' tidak ditemukan. Periksa kembali nama file."].join("\n"));
check("Bab 9 L4: empty file shows zeros and (belum ada kata)", expectedOf("input-dan-file-hilang", "L4"), ["=".repeat(34), " ".repeat(11) + "WORD COUNTER", "=".repeat(34), "Nama file: kosong.txt", "", "Membaca file: kosong.txt", "", "--- Ringkasan ---", "Jumlah kata      : 0", "Kata unik        : 0", "", "--- 5 kata yang paling sering muncul ---", "(belum ada kata)"].join("\n"));
check("Bab 9 L4: kosong.txt really has no words", (wc.chapters.find((c) => c.slug === "input-dan-file-hilang").lessons[3].practice.files.find((f) => f.name === "kosong.txt").content).trim(), "");

const copies = codeLessons.map(({ l }) => l.practice.files.find((f) => f.name === "artikel-kopi.txt").content);
check("every lesson's read-only article is identical to artikel-kopi.txt", copies.every((x) => x === article), true);

// ---------- progress keys are namespaced and isolated ----------
check("progress slug is <project>/<chapter>", paths.projectProgressSlug("word-counter", "menyiapkan-proyek"), "word-counter/menyiapkan-proyek");
check("a project progress slug can never equal a Python Dasar chapter slug", dasar.chapters.some((c) => c.slug.includes("/")), false);
const flat = getProjectLessons(wc);
check("project lessons: published chapters only (31 lessons in Bab 1-9), keyed by the progress slug", [flat.length, flat[0].chapterSlug, flat[0].chapterUrlSlug], [31, "word-counter/menyiapkan-proyek", "menyiapkan-proyek"]);
check("lessons per published chapter", wc.chapters.filter((c) => c.status === "published").map((c) => c.lessons.length), [3, 3, 3, 4, 3, 3, 5, 3, 4]);
const done = (ls) => new Set(ls.map((l) => lessonKey(l.chapterSlug, l.lessonId)));
const free = flat.filter((l) => l.chapterIsFree);
const s0 = summarizeProgress(flat, new Set(), false);
check("not purchased: scope is the 6 free lessons, next is Bab 1 L1", [s0.totalAll, s0.scopeTotal, s0.next.lessonId, s0.next.chapterUrlSlug, s0.percent], [31, 6, "L1", "menyiapkan-proyek", 0]);
const s1 = summarizeProgress(flat, done(free), false);
check("not purchased, free lessons done: no next, locked next is Bab 3 L1, 100%", [s1.next, s1.lockedNext.chapterUrlSlug, s1.lockedNext.lessonId, s1.percent], [null, "memecah-teks-menjadi-kata", "L1", 100]);
const s2 = summarizeProgress(flat, done(free), true);
check("purchased: scope is all 31, next is Bab 3 L1", [s2.scopeTotal, s2.next.chapterUrlSlug, s2.next.lessonId], [31, "memecah-teks-menjadi-kata", "L1"]);
const dasarAll = dasar.getAllLessons();
const onlyDasar = new Set([lessonKey(dasarAll[0].chapterSlug, dasarAll[0].lessonId)]);
const withProject = new Set([...onlyDasar, ...done(flat)]);
check("Python Dasar progress ignores project rows", summarizeProgress(dasarAll, withProject, false), summarizeProgress(dasarAll, onlyDasar, false));

// ---------- navigation ----------
check("adjacent: first lesson has no prev; Bab 1 L3 -> Bab 2 L1; Bab 3 L3 -> Bab 4 L1; Bab 6 L3 -> Bab 7 L1; last published lesson has no next (planned chapters skipped)", [
  getProjectAdjacent(wc, "menyiapkan-proyek", "L1").prev,
  getProjectAdjacent(wc, "menyiapkan-proyek", "L3").next.chapterUrlSlug + "/" + getProjectAdjacent(wc, "menyiapkan-proyek", "L3").next.lessonId,
  getProjectAdjacent(wc, "memecah-teks-menjadi-kata", "L3").next.chapterUrlSlug + "/" + getProjectAdjacent(wc, "memecah-teks-menjadi-kata", "L3").next.lessonId,
  getProjectAdjacent(wc, "menghitung-frekuensi", "L3").next.chapterUrlSlug + "/" + getProjectAdjacent(wc, "menghitung-frekuensi", "L3").next.lessonId,
  getProjectAdjacent(wc, "input-dan-file-hilang", "L4").next,
], [null, "membaca-file-artikel/L1", "membersihkan-kata/L1", "mengurutkan-5-teratas/L1", null]);
check("getProjectLesson: found / not found", [getProjectLesson(wc, "menyiapkan-proyek", "L2")?.title, getProjectLesson(wc, "menyiapkan-proyek", "L9"), getProjectLesson(wc, "selesai-dan-bawa-pulang", "L1")], ["Mengenal Workspace Proyek", undefined, undefined]);
const nav = getProjectNavChapters(wc);
check("nav list: all 10 chapters, planned ones with no lessons", [nav.length, nav.filter((c) => c.lessons.length === 0).length], [10, 1]);
check("nav list sent to the browser holds no theory, answers or expected output", /answerFiles|expected|explanation|successFeedback/.test(JSON.stringify(nav)), false);
check("paths", [paths.projectBase("word-counter"), paths.projectChapterPath("word-counter", "a"), paths.projectLessonPath("word-counter", "a", "L1"), paths.projectBuyPath("word-counter")], ["/proyek/word-counter", "/proyek/word-counter/a", "/proyek/word-counter/a/L1", "/proyek/word-counter/beli"]);

// ---------- route guard ----------
const prot = (p) => guard.isProtectedPath(p);
check("guard: /proyek and /proyek/<slug> are public", [prot("/proyek"), prot("/proyek/word-counter"), prot("/proyek/word-counter/")], [false, false, false]);
check("guard: chapter, lesson and buy pages need an account", [prot("/proyek/word-counter/menyiapkan-proyek"), prot("/proyek/word-counter/menyiapkan-proyek/L1"), prot("/proyek/word-counter/beli")], [true, true, true]);
check("guard: logged-out lesson visit goes to login with next", guard.guardRedirect("/proyek/word-counter/menyiapkan-proyek/L1", false, null), "/login?next=" + encodeURIComponent("/proyek/word-counter/menyiapkan-proyek/L1"));
check("guard: needsSession for a project lesson, not for the catalog", [guard.needsSession("/proyek/word-counter/beli"), guard.needsSession("/proyek")], [true, false]);
check("guard: Python Dasar rules unchanged", [prot("/kursus/python-dasar"), prot("/kursus/python-dasar/1-pengenalan")], [false, true]);

// ---------- paywall wiring in the page sources ----------
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
const lessonPage = read("app/proyek/[project]/[slug]/[lessonId]/page.tsx");
const chapterPage = read("app/proyek/[project]/[slug]/page.tsx");
const buyPage = read("app/proyek/[project]/beli/page.tsx");
check("lesson page: paid chapters are checked on the server against THIS project's purchase", /!chapter\.isFree && !\(await hasApprovedPurchase\(project\.slug\)\)/.test(lessonPage) && /redirect\(projectBuyPath\(project\.slug\)\)/.test(lessonPage), true);
check("chapter page: same server-side check", /!chapter\.isFree && !\(await hasApprovedPurchase\(project\.slug\)\)/.test(chapterPage), true);
check("buy page: purchase is for this project's slug and price", /getLatestPurchase\(project\.slug\)/.test(buyPage) && /courseSlug=\{project\.slug\}/.test(buyPage) && /getCoursePrice\(project\.slug\)/.test(buyPage), true);
check("lesson page: code lessons tell the learner their earlier code is not carried over (PROJECT_DESIGN 15.3)", /Kodemu dari lesson sebelumnya tidak dibawa otomatis/.test(lessonPage) && /Kodemu dari lesson sebelumnya tidak dibawa otomatis|tidak dibawa otomatis/.test(buyPage), true);
check("lesson page: progress and drafts use the namespaced progress slug", /chapterSlug=\{progressSlug\}/.test(lessonPage), true);
const proyekFiles = [];
(function walk(d) { for (const e of fs.readdirSync(path.join(root, d), { withFileTypes: true })) e.isDirectory() ? walk(path.join(d, e.name)) : proyekFiles.push(path.join(d, e.name)); })("app/proyek");
check("no project page hardcodes python-dasar", proyekFiles.filter((f) => /python-dasar/.test(read(f))), []);
check("middleware matcher still covers project pages (guard is applied to all paths)", /needsSession|isProtectedPath|guardRedirect/.test(read("middleware.ts")), true);

// ---------- generated .ts matches its .md ----------
let converterOk = true, converterMsg = "";
try { converterMsg = execFileSync("node", ["scripts/convert-project-md.mjs", "word-counter", "--check"], { cwd: root, encoding: "utf8" }); } catch (e) { converterOk = false; converterMsg = String(e.stdout || e.message); }
check("generated chapter-N.ts files match their bab-N-*.md", [converterOk, converterOk ? "" : converterMsg], [true, ""]);

console.log(`\n${count - failures}/${count} project checks passed.`);
if (failures) { console.log(`${failures} FAILED`); process.exit(1); }
console.log("All project checks passed.");
