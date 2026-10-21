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
};

export type ProjectFiles = Record<string, string>;

export type ProjectRun = {
  files: ProjectFiles;
  entry?: string;
  stdin?: string[];
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

export async function runProject(opts: ProjectRun): Promise<RunResult> {
  return runProjectWith(await getPyodide(), opts);
}

// Single-file convenience (what every lesson used before multi-file existed).
export async function runPython(code: string, stdin?: string[]): Promise<RunResult> {
  return runProject({ files: { "main.py": code }, entry: "main.py", stdin });
}
