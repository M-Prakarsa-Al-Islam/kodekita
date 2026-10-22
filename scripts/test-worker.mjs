// Tests the runaway-program safeguard: lib/pyodide.ts (runProject / stopRun)
// talking to the REAL public/pyodide-worker.js running the REAL Pyodide in a
// Node worker_thread (see scripts/_node-worker-shim.cjs).
// Run: node scripts/test-worker.mjs      (~40 s: every restart reloads Pyodide)
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Worker as NodeWorker } from "node:worker_threads";
import ts from "typescript";

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
function load(file, shims = {}) {
  const src = fs.readFileSync(path.join(here, "..", file), "utf8");
  const js = ts.transpileModule(src, { compilerOptions: { module: "CommonJS", target: "ES2020" } }).outputText;
  const mod = { exports: {} };
  new Function("require", "module", "exports", js)((id) => (id in shims ? shims[id] : require(id)), mod, mod.exports);
  return mod.exports;
}

// A browser-like Worker backed by a Node worker_thread.
let created = 0, terminated = 0;
class FakeWorker {
  constructor(url) {
    created++;
    FakeWorker.instances.push(this);
    this.url = url;
    this.w = new NodeWorker(path.join(here, "_node-worker-shim.cjs"));
    this.w.on("message", (data) => this.onmessage && this.onmessage({ data }));
    this.w.on("error", (e) => this.onerror && this.onerror(e));
  }
  postMessage(m) { this.w.postMessage(m); }
  terminate() { terminated++; this.w.terminate(); }
}
FakeWorker.instances = [];
globalThis.Worker = FakeWorker;

const harness = load("lib/python-harness.ts");
const { runProject, stopRun, RUN_TIMEOUT_MS } = load("lib/pyodide.ts", { "@/lib/python-harness": harness });

let failures = 0, count = 0;
function check(name, actual, expected) {
  count++;
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"} - ${name}${ok ? "" : `\n      expected ${JSON.stringify(expected)}\n      got      ${JSON.stringify(actual)}`}`);
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const run = (code, extra = {}) => runProject({ files: { "main.py": code }, ...extra });

check("default timeout is 8 seconds", RUN_TIMEOUT_MS, 8000);

// --- normal programs are unaffected --------------------------------------
let started = 0;
let r = await run('print("halo")', { onStart: () => started++ });
check("a normal program runs in the worker", [r.stdout, r.error, r.stopped], ["halo\n", null, undefined]);
check("onStart is called once when the program starts", started, 1);
check("only one worker was created so far", created, 1);

r = await run("x = 1/0");
check("a Python error is returned normally (no restart)", [r.error, r.stopped, created], ["ZeroDivisionError: division by zero", undefined, 1]);

r = await runProject({ files: { "main.py": "from fungsi import sapa\nsapa()", "fungsi.py": 'def sapa():\n    print("hai")' } });
check("multi-file programs work through the worker", [r.stdout, r.error], ["hai\n", null]);

r = await run('nama = input("Nama: ")\nprint(nama)', { stdin: ["Budi"] });
check("scripted input() works through the worker", [r.stdout, r.error], ["Nama: Budi\nBudi\n", null]);

// --- infinite loop -> timeout, page stays responsive ---------------------
let ticks = 0;
const ticker = setInterval(() => ticks++, 50); // proves the event loop (the "page") is never blocked
const t0 = Date.now();
r = await run("while True:\n    pass", { timeoutMs: 1500 });
const took = Date.now() - t0;
clearInterval(ticker);
check("an infinite loop is stopped with stopped=true", r.stopped, true);
check("the timeout message names the limit and the cause", /1\s*detik|2 detik/.test(r.error) && /loop/.test(r.error), true);
check("the loop is stopped near the limit (1.5 s, not hung)", took >= 1400 && took < 6000, true);
check("the page's own timers kept ticking during the loop (never frozen)", ticks >= 15, true);
check("the stuck worker was terminated", terminated, 1);
check("a replacement worker was started right away", created, 2);

// --- the next run works after a timeout ----------------------------------
r = await run('print("masih hidup")');
check("a normal run works right after a timeout", [r.stdout, r.error, r.stopped], ["masih hidup\n", null, undefined]);

// --- the same bad code twice: still recovers -----------------------------
r = await run("while 1 == 1:\n    x = 1", { timeoutMs: 1000 });
check("a second infinite loop is also stopped", r.stopped, true);
r = await run("print(2 + 2)");
check("and the run after it works", [r.stdout, r.error], ["4\n", null]);

// --- heavy but finite work is not killed ---------------------------------
r = await run("t = 0\nfor i in range(300000):\n    t += i\nprint(t)", { timeoutMs: 6000 });
check("a heavy but finite program still finishes", [r.stdout, r.error], ["44999850000\n", null]);

// --- endless output -------------------------------------------------------
r = await run('while True:\n    print("spam")', { timeoutMs: 6000 });
check("endless printing is cut off by the output cap, with a clear message", [/Output terlalu banyak/.test(r.error || ""), r.stopped], [true, undefined]);
check("the output cap keeps the output bounded", r.stdout.length <= 100000, true);

// --- a learner's try/except cannot swallow the stop ----------------------
r = await run("while True:\n    try:\n        while True:\n            pass\n    except Exception:\n        pass", { timeoutMs: 1000 });
check("try/except inside the loop cannot prevent the timeout", r.stopped, true);

// --- the Stop button ------------------------------------------------------
// Like the UI, only press Stop once the program has really started (onStart).
let startedStop; const startedStopP = new Promise((res) => (startedStop = res));
const pendingRun = run("while True:\n    pass", { timeoutMs: 30000, onStart: startedStop });
await startedStopP;
await sleep(300);
stopRun();
r = await pendingRun;
check("stopRun() stops a running program with a clear message", [r.stopped, r.error], [true, "Program dihentikan."]);
r = await run('print("ok")');
check("a run works after pressing stop", r.stdout, "ok\n");
stopRun(); // nothing running: must be a harmless no-op
r = await run('print("ok2")');
check("stopRun() with nothing running does nothing", r.stdout, "ok2\n");

// --- a crashed worker (not a Python error) -------------------------------
{
  let startedCrash; const startedCrashP = new Promise((res) => (startedCrash = res));
  const pendingCrash = run("while True:\n    pass", { timeoutMs: 30000, onStart: startedCrash });
  await startedCrashP;
  await sleep(300);
  const live = FakeWorker.instances[FakeWorker.instances.length - 1];
  live.onerror(new Error("boom")); // what a browser does when the worker dies (e.g. out of memory)
  r = await pendingCrash;
  check("a crashed worker ends the run with a clear message", [r.stopped, /memori/.test(r.error)], [true, true]);
  r = await run('print("pulih")');
  check("a run works after a crash", r.stdout, "pulih\n");
}

// --- two runs started at once are queued, not mixed ----------------------
const [a, b] = await Promise.all([run('print("A")'), run('print("B")')]);
check("two simultaneous runs are queued and each gets its own output", [a.stdout, b.stdout], ["A\n", "B\n"]);

console.log(`\n${count - failures}/${count} worker test-cases behaved as expected.`);
process.exit(failures ? 1 : 0);
