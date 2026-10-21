// Tests for lesson typography: lib/lesson-text.ts (parser), the LessonText /
// CodeBlock components, and over EVERY real lesson text that nothing is lost.
// Run: node scripts/test-lesson-text.mjs          (pass/fail)
//      node scripts/test-lesson-text.mjs --report (also lists what got styled,
//                                                  to review for false positives)
// Cannot prove: how it looks in a browser.
import { createRequire } from "node:module";
import fs from "node:fs";
import ts from "typescript";

const require = createRequire(import.meta.url);
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const REPORT = process.argv.includes("--report");

function load(file, shims = {}) {
  const src = fs.readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
  const js = ts.transpileModule(src, { compilerOptions: { module: "CommonJS", target: "ES2020", jsx: "react-jsx" } }).outputText;
  const mod = { exports: {} };
  new Function("require", "module", "exports", js)((id) => (id in shims ? shims[id] : require(id)), mod, mod.exports);
  return mod.exports;
}

const lib = load("lib/lesson-text.ts");
const { parseLessonText, splitInline, splitLead } = lib;
const LessonText = load("components/learn/LessonText.tsx", { "@/lib/lesson-text": lib });
const CodeBlock = load("components/learn/CodeBlock.tsx").default;

let failures = 0, count = 0;
function check(name, actual, expected) {
  count++;
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"} - ${name}${ok ? "" : `\n      expected ${JSON.stringify(expected)}\n      got      ${JSON.stringify(actual)}`}`);
}
const codes = (t) => splitInline(t).filter((p) => p.type === "code").map((p) => p.text);

// ---------- inline code ----------
check("calls: print(), len(list), .append()", codes("Gunakan print() dan len(list) lalu .append(x)."), ["print()", "len(list)", ".append(x)"]);
check("nested call: print(sorted(roles))", codes("Tulis print(sorted(roles)) di sini"), ["print(sorted(roles))"]);
check("call with a quoted string containing a space", codes('Pakai .split(" ") untuk memecah'), ['.split(" ")']);
check('call with quoted arg: float("-inf")', codes('Mulai dengan float("-inf") ya'), ['float("-inf")']);
check("indexing and slicing: data[0], huruf[1:5]", codes("Panggil data[0] atau huruf[1:5] saja"), ["data[0]", "huruf[1:5]"]);
check("type hints: list[str], dict[str, list[str]]", codes("Label list[str] dan dict[str, list[str]] itu"), ["list[str]", "dict[str, list[str]]"]);
check("dotted call stays ONE token: math.sqrt(16)", codes("memanggilnya dengan math.sqrt(16) langsung"), ["math.sqrt(16)"]);
check('dotted call with a string: fungsi.sapa("Budi")', codes('menulis fungsi.sapa("Budi") di sini'), ['fungsi.sapa("Budi")']);
check('method call on a variable: file.write("x")', codes('lalu file.write("x") ya'), ['file.write("x")']);
check("a leading-dot method is still one token: .append(x)", codes("pakai .append(x) saja"), [".append(x)"]);
check("file names: main.py, fungsi.py, catatan.txt", codes("Buka main.py, fungsi.py dan catatan.txt sekarang"), ["main.py", "fungsi.py", "catatan.txt"]);
check("a file name at the end of a sentence loses only the full stop", codes("Baca file laporan.txt."), ["laporan.txt"]);
check("a call that contains a file name is one token: open(\"a.txt\")", codes('Tulis open("a.txt") dulu'), ['open("a.txt")']);
check("version numbers and sentence joins are not file names / calls", codes("Python 3.12 ada. Lalu lanjut.Selesai"), []);
check("an unknown extension is not treated as a file name", codes("contoh.nya dan buku.pdf"), []);
check("snake_case names", codes("Variabel kata_bersih dan hitung_diskon dipakai"), ["kata_bersih", "hitung_diskon"]);
check("True / False / None", codes("Hasilnya True atau False, bukan None"), ["True", "False", "None"]);
check("ordinary prose has NO code", codes("Chapter 10 (Dictionary) membahas kunci dan nilai (key-value) pada Python."), []);
check("a parenthesised aside with a space is not a call", codes("kita belajar tentang list (daftar) hari ini"), []);
check("a plain word followed by punctuation is not code", codes("Jawabannya: ya. Tidak! Mungkin; entah, atau?"), []);
check("text around code is preserved in order", splitInline("a print() b").map((p) => p.text), ["a ", "print()", " b"]);
check("joining the pieces gives back the exact original", splitInline("x .append(1) y list[str] z").map((p) => p.text).join(""), "x .append(1) y list[str] z");
check("empty string", splitInline(""), []);
{
  const t0 = Date.now();
  const evil = "print(" + "(".repeat(3000) + "x".repeat(3000);
  splitInline(evil); splitInline('x["' + "a".repeat(5000)); splitInline("a_".repeat(3000));
  check("pathological input stays fast (< 1 s; typically ~150 ms, the budget is loose so a busy machine doesn't flake)", Date.now() - t0 < 1000, true);
  const t1 = Date.now();
  const longRun = "a_".repeat(60000);
  const parts = splitInline(longRun);
  check("an absurdly long text is returned untouched and instantly (length guard)", [parts.length, parts[0].type, parts[0].text.length, Date.now() - t1 < 100], [1, "text", 120000, true]);
}

// ---------- bold lead-ins ----------
check("lead-in: 'Unik (Tidak Menerima Duplikat): jika...'", splitLead("Unik (Tidak Menerima Duplikat): jika kamu memasukkan"), { lead: "Unik (Tidak Menerima Duplikat)", rest: "jika kamu memasukkan" });
check("lead-in: '.split(separator): diterapkan'", splitLead(".split(separator): diterapkan pada string")?.lead, ".split(separator)");
check("lead-in: 'ValueError: terjadi saat'", splitLead("ValueError: terjadi saat ...")?.lead, "ValueError");
check("no lead-in for a lower-case start ('except ValueError: yang mencetak')", splitLead('except ValueError: yang mencetak "Salah input".'), null);
check("no lead-in when the lead is a long sentence", splitLead("Tambahkan Type Hints pada definisi fungsi: parameter daftar_kata"), null);
check("no lead-in when the lead has a comma", splitLead("Di dalam loop, periksa nama kasirnya: jika belum ada"), null);
check("no lead-in without a colon", splitLead("Parameter harga harus dilabeli sebagai int."), null);

// ---------- blocks ----------
check("two paragraphs split on a blank line", parseLessonText("Satu.\n\nDua."), [{ type: "p", text: "Satu." }, { type: "p", text: "Dua." }]);
check("single newlines stay inside the paragraph", parseLessonText("Baris a\nBaris b"), [{ type: "p", text: "Baris a\nBaris b" }]);
check("a bulleted list", parseLessonText("- a\n- b"), [{ type: "ul", items: ["a", "b"] }]);
check("a numbered list keeps its first number", parseLessonText("1. a\n2. b"), [{ type: "ol", start: 1, items: ["a", "b"] }]);
check("intro line + list in one block (no blank line)", parseLessonText("Tugasmu:\n1. a\n2. b"), [{ type: "p", text: "Tugasmu:" }, { type: "ol", start: 1, items: ["a", "b"] }]);
check("a line after a list becomes its own paragraph", parseLessonText("1. a\n2. b\n(Penting: x)"), [{ type: "ol", start: 1, items: ["a", "b"] }, { type: "p", text: "(Penting: x)" }]);
check("indented bullets after numbered items; numbering resumes with `start`", parseLessonText("3. c\n   - x\n   - y\n4. d"), [{ type: "ol", start: 3, items: ["c"] }, { type: "ul", items: ["x", "y"] }, { type: "ol", start: 4, items: ["d"] }]);
check("a dash inside a sentence is not a list", parseLessonText("Ini - bukan list"), [{ type: "p", text: "Ini - bukan list" }]);
check("'- -1 adalah' is a bullet whose text starts with -1", parseLessonText("- -1 adalah terakhir"), [{ type: "ul", items: ["-1 adalah terakhir"] }]);
check("a decimal like 5.0 on its own line is text, not a list", parseLessonText("5.0\n80000.0"), [{ type: "p", text: "5.0\n80000.0" }]);
check("callout: Penting:", parseLessonText("Penting: karena Set tidak urut."), [{ type: "callout", label: "Penting", text: "karena Set tidak urut." }]);
check("callout: Peringatan:", parseLessonText("Peringatan: jika tidak ada.")[0].type, "callout");
check("callout: 'Catatan khusus untuk .items(): ...'", parseLessonText("Catatan khusus untuk .items(): karena metode ini")[0], { type: "callout", label: "Catatan khusus untuk .items()", text: "karena metode ini" });
check("'Penting untuk diingat bahwa ...: x' is NOT a callout", parseLessonText("Penting untuk diingat bahwa urutan berpengaruh: hasil")[0].type, "p");
check("'(Penting: ...)' in parentheses is NOT a callout", parseLessonText("(Penting: lakukan cetak)")[0].type, "p");
check("Windows line endings are handled", parseLessonText("a\r\n\r\nb").length, 2);
check("empty / whitespace-only text gives no blocks", [parseLessonText("").length, parseLessonText("  \n \n").length], [0, 0]);

// ---------- markup ----------
const html = (props) => renderToStaticMarkup(React.createElement(LessonText.default, props));
let h = html({ text: "Intro dengan print().\n\n- Bug: salah\n- Error (Exception): berhenti\n\n1. satu\n2. dua\n\nPenting: hati-hati." });
check("markup: <ul>, <ol>, call-out and code element", [h.includes("<ul"), h.includes("<ol"), h.includes("border-sun"), h.includes("<code")], [true, true, true, true]);
check("markup: bold lead-ins rendered", h.includes("<strong") && h.includes("Bug") && h.includes("Error (Exception)"), true);
check("markup: <ol> carries its start number", html({ text: "4. a\n5. b" }).includes('start="4"'), true);
check("markup: sm size uses the smaller text class", html({ text: "x", size: "sm" }).includes("text-[0.9375rem]") && html({ text: "x" }).includes("text-[1.0625rem]"), true);
check("markup: text is HTML-escaped (no injection)", html({ text: "<script>alert(1)</script> & kawan" }).includes("<script>"), false);
check("code block: <pre> is keyboard-focusable", renderToStaticMarkup(React.createElement(CodeBlock, { code: "x = 1" })).includes('tabindex="0"'), true);
check("code block: wrap option uses pre-wrap, default scrolls", [renderToStaticMarkup(React.createElement(CodeBlock, { code: "x", wrap: true })).includes("whitespace-pre-wrap"), renderToStaticMarkup(React.createElement(CodeBlock, { code: "x" })).includes("overflow-x-auto")], [true, true]);

// ---------- every real lesson: nothing may be lost ----------
const decode = (s) => s.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const squash = (s) => s.replace(/\s+/g, "");
const stripMarkers = (s) => s.split(/\r?\n/).map((l) => l.replace(/^\s*-\s+/, "").replace(/^\s*\d+\.\s+/, "")).join("\n");
const textOf = (markup) => decode(markup.replace(/<[^>]+>/g, ""));

const texts = [];
const dir = new URL("../content/chapters/", import.meta.url);
for (const f of fs.readdirSync(dir).filter((n) => /^chapter-\d+\.ts$/.test(n))) {
  const mod = load(`content/chapters/${f}`);
  const chapter = Object.values(mod).find((v) => v && v.lessons);
  for (const l of chapter.lessons) {
    const where = `${f.replace(".ts", "")} ${l.id}`;
    const add = (kind, t) => t && texts.push({ where, kind, text: t });
    add("theory", l.theory.explanation);
    (l.theory.sections || []).forEach((s) => { add("section", s.text); });
    add("caption", l.theory.example?.description);
    const p = l.practice;
    if (p.kind === "code") { add("instructions", p.instructions); p.hints.forEach((x) => add("hint", x)); add("success", p.successFeedback); }
    else { add("question", p.question); p.options.forEach((x) => add("option", x)); add("explanation", p.explanation); }
  }
}
let lossy = 0;
const seenCode = new Map(), seenLead = new Map(), seenCallout = new Map();
for (const t of texts) {
  for (const size of ["base", "sm"]) {
    const rendered = textOf(html({ text: t.text, size }));
    if (squash(rendered) !== squash(stripMarkers(t.text))) {
      lossy++;
      console.log(`  LOSSY [${t.where} ${t.kind} ${size}]\n    original: ${JSON.stringify(t.text.slice(0, 120))}\n    rendered: ${JSON.stringify(rendered.slice(0, 120))}`);
    }
  }
  for (const c of codes(t.text)) seenCode.set(c, (seenCode.get(c) || 0) + 1);
  for (const b of parseLessonText(t.text)) {
    if (b.type === "callout") seenCallout.set(`${b.label}  <- ${t.where}`, 1);
    if (b.type === "ul" || b.type === "ol") for (const it of b.items) { const L = splitLead(it); if (L) seenLead.set(L.lead, (seenLead.get(L.lead) || 0) + 1); }
  }
}
check(`lossless: ${texts.length} real lesson texts render with every character intact (both sizes)`, lossy, 0);
check("every real text parses to at least one block", texts.filter((t) => parseLessonText(t.text).length === 0).length, 0);
check("no inline-code token spans a line break", [...seenCode.keys()].filter((c) => c.includes("\n")).length, 0);

if (REPORT) {
  console.log(`\n--- inline code tokens styled across all lessons (${seenCode.size} distinct) ---`);
  console.log([...seenCode.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${v}x ${k}`).join("\n"));
  console.log(`\n--- bold lead-ins (${seenLead.size}) ---\n` + [...seenLead.keys()].join("\n"));
  console.log(`\n--- call-outs (${seenCallout.size}) ---\n` + [...seenCallout.keys()].join("\n"));
}
console.log(`\n${count - failures}/${count} lesson-text test-cases behaved as expected.`);
process.exit(failures ? 1 : 0);
