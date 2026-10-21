// Tests for the PyMula wordmark (components/site/Logo.tsx) and its colours.
// Run: node scripts/test-logo.mjs
import { createRequire } from "node:module";
import fs from "node:fs";
import ts from "typescript";

const require = createRequire(import.meta.url);
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

const Link = ({ href, children, ...rest }) => React.createElement("a", { href, ...rest }, children);
const src = fs.readFileSync(new URL("../components/site/Logo.tsx", import.meta.url), "utf8");
const js = ts.transpileModule(src, { compilerOptions: { module: "CommonJS", target: "ES2020", jsx: "react-jsx" } }).outputText;
const mod = { exports: {} };
new Function("require", "module", "exports", js)((id) => (id === "next/link" ? { default: Link } : require(id)), mod, mod.exports);
const Logo = mod.exports.default;

let failures = 0, count = 0;
function check(name, ok, detail = "") {
  count++;
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"} - ${name}${ok ? "" : " " + detail}`);
}

const html = renderToStaticMarkup(React.createElement(Logo));
const text = html.replace(/<[^>]+>/g, "");
check("reads as the single word 'PyMula' (no gap between the parts)", text === "PyMula", JSON.stringify(text));
check("'Py' uses the brand-py colour token", /<span class="text-brand-py">Py<\/span>/.test(html), html);
check("'Mula' uses the brand-mula colour token", /<span class="text-brand-mula">Mula<\/span>/.test(html), html);
check("links to the home page", html.includes('href="/"'));
check("has an accessible name", html.includes('aria-label="PyMula, kembali ke beranda"'));
check("extra classes can be added", renderToStaticMarkup(React.createElement(Logo, { className: "ml-2" })).includes("ml-2"));

// The tokens must hold the exact hex values the owner specified.
const cfg = fs.readFileSync(new URL("../tailwind.config.ts", import.meta.url), "utf8");
check("tailwind: brand.py is #29235c", /py:\s*"#29235c"/i.test(cfg));
check("tailwind: brand.mula is #f2ad3d", /mula:\s*"#f2ad3d"/i.test(cfg));

// Contrast (informational): WCAG relative-luminance ratio against the page background.
const lum = (hex) => { const c = [1,3,5].map((i) => parseInt(hex.slice(i, i+2), 16) / 255).map((v) => v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4); return 0.2126*c[0] + 0.7152*c[1] + 0.0722*c[2]; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
console.log(`  info: contrast on the #F3F5F5 background - Py ${ratio("#29235c", "#F3F5F5").toFixed(1)}:1, Mula ${ratio("#f2ad3d", "#F3F5F5").toFixed(1)}:1`);

console.log(`\n${count - failures}/${count} logo test-cases behaved as expected.`);
process.exit(failures ? 1 : 0);
