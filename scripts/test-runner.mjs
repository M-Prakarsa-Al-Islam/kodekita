// Tests the project runner with the REAL Pyodide (the same 0.26.2 / Python 3.12
// the site loads from the CDN), running the exact harness code the site uses.
// Run: node scripts/test-runner.mjs      (needs the `pyodide` devDependency; ~5 s)
import { createRequire } from "node:module";
import fs from "node:fs";
import ts from "typescript";

const require = createRequire(import.meta.url);
function load(file, shims = {}) {
  const src = fs.readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
  const js = ts.transpileModule(src, { compilerOptions: { module: "CommonJS", target: "ES2020" } }).outputText;
  const mod = { exports: {} };
  new Function("require", "module", "exports", js)((id) => (id in shims ? shims[id] : require(id)), mod, mod.exports);
  return mod.exports;
}
const harness = load("lib/python-harness.ts");
const { runProjectWith } = load("lib/pyodide.ts", { "@/lib/python-harness": harness });
const { loadPyodide } = await import("pyodide");
const py = await loadPyodide();
const run = (files, opts = {}) => runProjectWith(py, { files, ...opts });
const probe = (code) => py.runPython(code);

let failures = 0, count = 0;
function check(name, actual, expected) {
  count++;
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"} - ${name}${ok ? "" : `\n      expected ${JSON.stringify(expected)}\n      got      ${JSON.stringify(actual)}`}`);
}

console.log(`(python ${probe("import sys; sys.version.split()[0]")})`);

// ---- single file: behaves like it always did ----
let r = await run({ "main.py": 'print("halo")' });
check("single file: prints", [r.stdout, r.error], ["halo\n", null]);
r = await run({ "main.py": "print(x)" });
check("single file: error text is the plain legacy 'Type: message' (no location suffix)", r.error, "NameError: name 'x' is not defined");
r = await run({ "main.py": 'print("a")\nraise ValueError("oops")' });
check("single file: output before the error is kept", [r.stdout, r.error], ["a\n", "ValueError: oops"]);
r = await run({ "main.py": "print(__name__)" });
check("the entry file runs as __main__", r.stdout, "__main__\n");

// ---- imports between files ----
const libFiles = (fn) => ({ "main.py": "from fungsi import sapa\nprint(sapa('Budi'))", "fungsi.py": fn });
r = await run(libFiles('def sapa(nama):\n    return "Halo, " + nama + "!"'));
check("multi file: from fungsi import sapa works", [r.stdout, r.error], ["Halo, Budi!\n", null]);
r = await run({ "main.py": "import fungsi\nprint(fungsi.sapa('Siti'))", "fungsi.py": 'def sapa(n):\n    return "Hai " + n' });
check("multi file: import fungsi (dotted access) works", r.stdout, "Hai Siti\n");

// ---- TRAP 1: module cache. Edit fungsi.py between runs; the 2nd run must see the edit ----
r = await run(libFiles('def sapa(nama):\n    return "VERSI 1 " + nama'));
const r2 = await run(libFiles('def sapa(nama):\n    return "VERSI 2 " + nama'));
check("module cache: the second run uses the EDITED fungsi.py, not the cached old one", [r.stdout, r2.stdout], ["VERSI 1 Budi\n", "VERSI 2 Budi\n"]);
r = await run(libFiles("def sapa(nama):\n    return nama +"));
check("module cache: a broken fungsi.py after a good one reports an error (does not reuse the good one)", r.error !== null, true);
check("module cache: no learner module is left in sys.modules afterwards", probe("'fungsi' in __import__('sys').modules"), false);

// ---- TRAP 2: the virtual disk persists; every run must start clean ----
r = await run({ "main.py": 'with open("hasil.txt", "w") as f:\n    f.write("rahasia")\nprint("ditulis")' });
check("file I/O: writing a file works", [r.stdout, r.error], ["ditulis\n", null]);
r = await run({ "main.py": 'print(open("hasil.txt").read())' });
check("clean slate: a file written in the previous run is gone", r.error, "FileNotFoundError: [Errno 44] No such file or directory: 'hasil.txt'");
const seed = { "main.py": 'print(open("catatan.txt").read())', "catatan.txt": "Satu\nDua" };
r = await run(seed);
check("seed file: open('catatan.txt') reads the provided content", r.stdout, "Satu\nDua\n");
await run({ "main.py": 'open("catatan.txt", "w").write("DIRUSAK")', "catatan.txt": "Satu\nDua" });
r = await run(seed);
check("clean slate: a seed file the learner overwrote is back to the original next run", r.stdout, "Satu\nDua\n");
r = await run({ "main.py": 'print(open("catatan.txt", encoding="utf-8").read())', "catatan.txt": "Halo dunia: é ñ 日本" });
check("unicode text survives the round trip", r.stdout, "Halo dunia: é ñ 日本\n");
r = await run({ "main.py": 'with open("a.txt", "w") as f:\n    f.write("x\\ny\\n")\nwith open("a.txt") as f:\n    print(repr(f.read()))' });
check("newlines are written and read back unchanged (\\n)", r.stdout, "'x\\ny\\n'\n");
check("the work folder is deleted after a run", probe("__import__('os').path.exists('/home/pyodide/__pymula_work__')"), false);

// ---- input() ----
r = await run({ "main.py": 'nama = input("Nama: ")\nprint(f"Halo, {nama}!")' }, { stdin: ["Budi"] });
check("input(): output looks like a terminal session (prompt, typed text, newline)", r.stdout, "Nama: Budi\nHalo, Budi!\n");
r = await run({ "main.py": 'a = input("A? ")\nb = input("B? ")\nprint(a + b)' }, { stdin: ["x", "y"] });
check("input(): several inputs are consumed in order", r.stdout, "A? x\nB? y\nxy\n");
r = await run({ "main.py": 'x = input("Nama: ")\nprint(x)' });
check("input() with no lines left: EOFError, and the prompt was still shown", [r.stdout, r.error], ["Nama: ", "EOFError: EOF when reading a line"]);
r = await run({ "main.py": "x = input()\nprint(type(x).__name__)" }, { stdin: ["5"] });
check("input() always returns a string, even for '5'", r.stdout, "5\nstr\n");
r = await run({ "main.py": 'print(input("p"))' }, { stdin: ["a"] });
check("input() is restored after a run (a later run without lines fails, not reuses old lines)", (await run({ "main.py": "input()" })).error, "EOFError: EOF when reading a line");
check("builtins.input is the real one again afterwards", probe("__import__('builtins').input.__name__"), "input");

// ---- error locations (multi-file only) ----
r = await run({ "main.py": "from fungsi import f\nf()", "fungsi.py": "def f():\n    x = 1\n    return y" });
check("multi file: runtime error names the file and line where it happened", r.error, "NameError: name 'y' is not defined (fungsi.py, baris 3)");
r = await run({ "main.py": "print('a')\nprint(zzz)", "fungsi.py": "" });
check("multi file: error in main.py is located too", r.error, "NameError: name 'zzz' is not defined (main.py, baris 2)");
r = await run({ "main.py": "from fungsi import f", "fungsi.py": "def f(:\n    pass" });
check("multi file: syntax error in a module shows the bare file name, not the internal path", r.error.includes("__pymula_work__"), false);
check("multi file: ...and does name the file", r.error.startsWith("SyntaxError") && r.error.includes("fungsi.py"), true);
r = await run({ "main.py": "print('a'\nprint('b')", "fungsi.py": "" });
check("multi file: syntax error in main.py", r.error.startsWith("SyntaxError") && r.error.includes("main.py"), true);
r = await run({ "main.py": "from fungsi import tidak_ada", "fungsi.py": "x = 1" });
check("multi file: importing a name that doesn't exist is reported", r.error.startsWith("ImportError"), true);
r = await run({ "main.py": "import fungsi_hilang" });
check("single file: importing a missing module gives ModuleNotFoundError", r.error, "ModuleNotFoundError: No module named 'fungsi_hilang'");
r = await run({ "main.py": "import math\nprint(math.sqrt(144))\nfrom math import pi\nprint(round(pi, 2))" });
check("standard library imports work (math)", [r.stdout, r.error], ["12.0\n3.14\n", null]);

// ---- __name__ in modules ----
r = await run({ "main.py": "import fungsi", "fungsi.py": "print(__name__)" });
check("an imported module sees its own name, not __main__", r.stdout, "fungsi\n");

// ---- robustness ----
r = await run({ "main.py": 'print("a")\nimport sys\nsys.exit()\nprint("b")' });
check("sys.exit() ends the program quietly (no crash)", [r.stdout, r.error], ["a\n", null]);
r = await run({ "main.py": 'print("x")', "../evil.py": "x" });
check("a file name with a path is rejected", r.error, "Nama file tidak valid: ../evil.py");
r = await run({ "fungsi.py": "x = 1" });
check("missing entry file is reported", r.error, "File utama main.py tidak ditemukan.");
r = await run({ "app.py": 'print("dari app")' }, { entry: "app.py" });
check("a custom entry file works", r.stdout, "dari app\n");
check("cwd and sys.path are restored after runs", [probe("__import__('os').getcwd()"), probe("'/home/pyodide/__pymula_work__' in __import__('sys').path")], ["/home/pyodide", false]);
check("state is restored even after an error", ((await run({ "main.py": "1/0" })), probe("__import__('os').getcwd()")), "/home/pyodide");
r = await run({ "main.py": "print(1/0)" });
check("division by zero (single file) stays the plain legacy format", r.error, "ZeroDivisionError: division by zero");
r = await run({ "main.py": "x = 1\nfor i in range(3):\n    print(i)" });
check("normal multi-line code and loops run", r.stdout, "0\n1\n2\n");
{
  const t0 = Date.now();
  for (let i = 0; i < 30; i++) await run({ "main.py": "from fungsi import f\nprint(f())", "fungsi.py": `def f():\n    return ${i}` });
  const last = await run({ "main.py": "from fungsi import f\nprint(f())", "fungsi.py": "def f():\n    return 29" });
  check("30 consecutive runs stay correct and fast (< 5 s total)", [last.stdout, Date.now() - t0 < 5000], ["29\n", true]);
}

console.log(`\n${count - failures}/${count} runner test-cases behaved as expected.`);
process.exit(failures ? 1 : 0);
