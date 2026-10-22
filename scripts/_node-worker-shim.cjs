// Test helper for scripts/test-worker.mjs: makes a Node worker_thread look
// enough like a browser Worker that the REAL public/pyodide-worker.js runs in
// it, with the real Pyodide from the `pyodide` devDependency.
const { parentPort } = require("node:worker_threads");
const fs = require("node:fs");
const path = require("node:path");
globalThis.self = globalThis;
globalThis.importScripts = () => {}; // Pyodide comes from node_modules here
globalThis.loadPyodide = () => require("pyodide").loadPyodide(); // ignore the CDN url
globalThis.postMessage = (m) => parentPort.postMessage(m);
parentPort.on("message", (data) => globalThis.onmessage && globalThis.onmessage({ data }));
const src = fs.readFileSync(path.join(__dirname, "..", "public", "pyodide-worker.js"), "utf8");
// `let pyodide` at top level of a script is shared global state in a browser worker; same here.
(0, eval)(src);
