// Loads Pyodide (Python compiled to WebAssembly) from a CDN, once, and
// reuses the same instance for every code run on the page. This is the
// entire "code execution engine" — no backend, no sandbox to host.
// See PROGRESS.md for why (Piston's public API stopped being free;
// self-hosting a sandbox was judged unnecessary for a Python-only course).

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

export async function runPython(code: string): Promise<RunResult> {
  const pyodide = await getPyodide();
  pyodide.globals.set("__user_code__", code);

  const result = await pyodide.runPythonAsync(`
import sys, io, contextlib
__stdout__ = io.StringIO()
__error__ = None
try:
    with contextlib.redirect_stdout(__stdout__):
        exec(__user_code__, {})
except Exception as e:
    __error__ = f"{type(e).__name__}: {e}"
(__stdout__.getvalue(), __error__)
`);

  const [stdout, error] = result.toJs();
  result.destroy();
  return { stdout, error };
}
