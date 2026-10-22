// Web Worker that runs the learner's Python OFF the page's main thread, so a
// runaway loop (`while True: pass`) can only freeze this worker; the page
// then terminates it (see lib/pyodide.ts) instead of the whole tab hanging.
//
// It is a plain classic-worker script in /public (no bundler involved). The
// Python harness is NOT duplicated here: the page sends it in the "init"
// message (single source of truth: lib/python-harness.ts).
//
// Protocol (page -> worker):
//   { type: "init", indexURL, harness }
//   { type: "run", id, files, entry, stdin, showLocation }   (JSON strings)
// Protocol (worker -> page):
//   { type: "ready" } | { type: "init-error", message }
//   { type: "result", id, stdout, error }
//
// scripts/test-worker.mjs runs THIS file in a Node worker_thread with the real
// Pyodide, so keep it free of browser-only APIs other than importScripts /
// self.loadPyodide / self.postMessage.

let pyodide = null;

self.onmessage = async (event) => {
  const msg = event.data;

  if (msg.type === "init") {
    try {
      importScripts(msg.indexURL + "pyodide.js");
      pyodide = await self.loadPyodide({ indexURL: msg.indexURL });
      await pyodide.runPythonAsync(msg.harness);
      self.postMessage({ type: "ready" });
    } catch (err) {
      self.postMessage({ type: "init-error", message: String((err && err.message) || err) });
    }
    return;
  }

  if (msg.type === "run") {
    let stdout = "";
    let error = null;
    try {
      const run = pyodide.globals.get("__pymula_run__");
      try {
        const result = run(msg.files, msg.entry, msg.stdin, msg.showLocation);
        const pair = result.toJs();
        result.destroy();
        stdout = pair[0];
        error = pair[1];
      } finally {
        run.destroy();
      }
    } catch (err) {
      // Not a learner error (those are returned by the harness): the runtime
      // itself failed, e.g. out of memory.
      error = "Python runtime error: " + String((err && err.message) || err);
    }
    self.postMessage({ type: "result", id: msg.id, stdout, error });
  }
};
