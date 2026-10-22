// Loads Pyodide (Python compiled to WebAssembly) from a CDN, once, and
// reuses the same instance for every code run on the page. This is the
// entire "code execution engine" — no backend, no sandbox to host.
// See PROGRESS.md for why (Piston's public API stopped being free;
// self-hosting a sandbox was judged unnecessary for a Python-only course).

import { PYTHON_HARNESS } from "@/lib/python-harness";

const PYODIDE_VERSION = "0.26.2";
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<any>;
  }
}

let pyodideInstance: any = null;
let loadingPromise: Promise<any> | null = null;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Gagal memuat Python runtime."));
    document.body.appendChild(script);
  });
}

export async function getPyodide() {
  if (pyodideInstance) return pyodideInstance;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    await loadScript(`${PYODIDE_CDN}pyodide.js`);
    if (!window.loadPyodide) {
      throw new Error("Python runtime tidak tersedia.");
    }
    pyodideInstance = await window.loadPyodide({ indexURL: PYODIDE_CDN });
    return pyodideInstance;
  })();

  return loadingPromise;
}

export type RunResult = {
  stdout: string;
  error: string | null;
  // true when the run was cut short by the safeguard (timeout, crash or the
  // learner pressing "Hentikan"); the text is in `error`.
  stopped?: boolean;
};

export type ProjectFiles = Record<string, string>;

export type ProjectRun = {
  files: ProjectFiles;
  entry?: string;
  stdin?: string[];
  // Called when the program actually starts running (after the Python runtime
  // has loaded), so the UI can switch from "Memuat Python..." to "Menjalankan...".
  onStart?: () => void;
  // Longest a program may run before it is stopped. Default RUN_TIMEOUT_MS.
  timeoutMs?: number;
};

// Run a small project on a given Pyodide instance: every file is written to
// its virtual disk and `entry` is executed as __main__ (rules in
// lib/python-harness.ts: clean slate per run, fresh module imports, scripted
// input()). Takes the instance as a parameter so it can be tested in Node.
export async function runProjectWith(pyodide: any, opts: ProjectRun): Promise<RunResult> {
  if (!pyodide.globals.has("__pymula_run__")) {
    await pyodide.runPythonAsync(PYTHON_HARNESS);
  }
  const entry = opts.entry ?? "main.py";
  // Only multi-file programs get "(file, baris N)" appended to errors; a
  // single-file lesson keeps the plain "Type: message" it always had.
  const showLocation = Object.keys(opts.files).length > 1;

  const run = pyodide.globals.get("__pymula_run__");
  try {
    const result = run(
      JSON.stringify(opts.files),
      entry,
      JSON.stringify(opts.stdin ?? []),
      showLocation
    );
    const [stdout, error] = result.toJs();
    result.destroy();
    return { stdout, error };
  } finally {
    run.destroy();
  }
}

// ---------------------------------------------------------------------------
// Safeguard against runaway programs (infinite loops, endless printing).
//
// Pyodide runs on ONE thread, so a `while True: pass` on the page's main thread
// freezes the whole tab and the learner can only close it. Instead the real
// program runs inside a Web Worker (public/pyodide-worker.js). If it has not
// finished after RUN_TIMEOUT_MS, or the learner presses "Hentikan", or the
// worker crashes (e.g. out of memory), the page terminates the worker, starts a
// fresh one in the background, and shows a clear message. The page itself never
// blocks. The time spent loading Pyodide is NOT counted against the limit.
// Only if the browser has no Web Worker do we fall back to the main thread
// (works, but without the safeguard).
// ---------------------------------------------------------------------------

export const RUN_TIMEOUT_MS = 8000;
const INIT_TIMEOUT_MS = 90000;
const WORKER_URL = "/pyodide-worker.js";

type WorkerSlot = { worker: Worker; ready: Promise<void> };
type Pending = {
  id: number;
  resolve: (r: RunResult) => void;
  timer: ReturnType<typeof setTimeout>;
};

let slot: WorkerSlot | null = null;
let pending: Pending | null = null;
let nextRunId = 1;
let queue: Promise<unknown> = Promise.resolve();

function createWorker(): WorkerSlot {
  const worker = new Worker(WORKER_URL);
  const me: WorkerSlot = { worker, ready: undefined as unknown as Promise<void> };

  me.ready = new Promise<void>((resolve, reject) => {
    const initTimer = setTimeout(() => {
      reject(new Error("Python runtime terlalu lama dimuat."));
    }, INIT_TIMEOUT_MS);
    const done = (fn: () => void) => {
      clearTimeout(initTimer);
      fn();
    };

    worker.onmessage = (ev: MessageEvent) => {
      const m = ev.data;
      if (m?.type === "ready") {
        done(resolve);
      } else if (m?.type === "init-error") {
        done(() => reject(new Error(m.message)));
      } else if (m?.type === "result" && pending && pending.id === m.id) {
        const p = pending;
        pending = null;
        clearTimeout(p.timer);
        p.resolve({ stdout: m.stdout, error: m.error });
      }
    };
    // An uncaught error / crash of the worker itself (not a Python error).
    worker.onerror = () => {
      done(() => reject(new Error("Python runtime berhenti tiba-tiba.")));
      if (slot === me) endRun(CRASH_MESSAGE);
    };
  });
  // The rejection is handled where the run awaits it; never leave it unhandled.
  me.ready.catch(() => {});

  worker.postMessage({ type: "init", indexURL: PYODIDE_CDN, harness: PYTHON_HARNESS });
  return me;
}

function ensureWorker(): WorkerSlot {
  if (!slot) slot = createWorker();
  return slot;
}

function discardWorker() {
  if (slot) {
    try {
      slot.worker.terminate();
    } catch {
      /* already gone */
    }
    slot = null;
  }
}

const timeoutMessage = (ms: number) =>
  `Programmu berjalan lebih dari ${Math.round(ms / 1000)} detik, jadi dihentikan. ` +
  "Kemungkinan ada loop yang tidak pernah berhenti (misalnya while True tanpa break, " +
  "atau kondisi while yang tidak pernah menjadi False). Periksa kodemu, lalu jalankan lagi.";
const STOPPED_MESSAGE = "Program dihentikan.";
const CRASH_MESSAGE =
  "Program berhenti di tengah jalan (kemungkinan memakai memori terlalu banyak). " +
  "Periksa kodemu, lalu jalankan lagi.";

// Ends the current run early: kills the worker (the only way to stop Python
// that is stuck in a loop), resolves the waiting run with `message`, and warms
// up a replacement so the next run starts quickly (the files are in the
// browser cache after the first load).
function endRun(message: string) {
  const p = pending;
  pending = null;
  discardWorker();
  if (p) {
    clearTimeout(p.timer);
    p.resolve({ stdout: "", error: message, stopped: true });
  }
  try {
    ensureWorker();
  } catch {
    /* next run will try again */
  }
}

// Used by the "Hentikan" button. Does nothing if no program is running.
export function stopRun() {
  if (pending) endRun(STOPPED_MESSAGE);
}

async function runInWorker(opts: ProjectRun): Promise<RunResult> {
  const current = ensureWorker();
  await current.ready; // throws if the runtime could not load
  const timeoutMs = opts.timeoutMs ?? RUN_TIMEOUT_MS;
  const entry = opts.entry ?? "main.py";
  const showLocation = Object.keys(opts.files).length > 1;
  const id = nextRunId++;

  return new Promise<RunResult>((resolve) => {
    const timer = setTimeout(() => endRun(timeoutMessage(timeoutMs)), timeoutMs);
    pending = { id, resolve, timer };
    opts.onStart?.();
    current.worker.postMessage({
      type: "run",
      id,
      files: JSON.stringify(opts.files),
      entry,
      stdin: JSON.stringify(opts.stdin ?? []),
      showLocation,
    });
  });
}

export async function runProject(opts: ProjectRun): Promise<RunResult> {
  // Browsers without Web Workers: run on the main thread (no safeguard).
  if (typeof Worker === "undefined") {
    const py = await getPyodide();
    opts.onStart?.();
    return runProjectWith(py, opts);
  }
  // One program at a time: a second call waits for the first to finish.
  const result = queue.then(() => runInWorker(opts));
  queue = result.catch(() => {});
  try {
    return await result;
  } catch (e) {
    // The runtime failed to load: forget it so the next click retries.
    discardWorker();
    throw e;
  }
}

// Single-file convenience (what every lesson used before multi-file existed).
export async function runPython(code: string, stdin?: string[]): Promise<RunResult> {
  return runProject({ files: { "main.py": code }, entry: "main.py", stdin });
}
