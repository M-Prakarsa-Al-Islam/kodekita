// Guards "no font ligatures": our code font (JetBrains Mono) would draw "!=" as a
// not-equal sign, ">=" / "<=" as single glyphs, "->" as an arrow and "==" as one
// wide glyph, so a learner could not see what to type. See app/globals.css.
//
// What this proves: the CSS and the editor theme switch ligatures off, on every
// element that shows code, and nothing in the source switches them back on.
// What it cannot prove: how a browser really draws the glyphs. After changing fonts
// or CSS, look at "!=  >=  <=  ==  ->" in a lesson, the editor and the output panel.
// Run: node scripts/test-fonts.mjs
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
let failures = 0, count = 0;
function check(name, ok, detail = "") {
  count++; if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"} - ${name}${ok || !detail ? "" : `\n      ${detail}`}`);
}

// ---- globals.css: parse "selectors { declarations }" blocks (no nesting is used there)
const css = read("app/globals.css").replace(/\/\*[\s\S]*?\*\//g, "");
const rules = [...css.matchAll(/([^{}@]+)\{([^{}]*)\}/g)].map((m) => ({
  selectors: m[1].split(",").map((x) => x.trim()).filter(Boolean),
  body: m[2],
}));
const noLig = rules.filter((r) => /font-variant-ligatures\s*:\s*none/.test(r.body) && /"calt"\s*0/.test(r.body) && /"liga"\s*0/.test(r.body));
const covered = new Set(noLig.flatMap((r) => r.selectors));
check("globals.css has a rule turning ligatures off (font-variant-ligatures: none + calt 0 + liga 0)", noLig.length > 0);
for (const sel of ["html", "body", "code", "pre", "kbd", "samp", "textarea", "input", ".font-mono", ".cm-editor", ".cm-editor *"]) {
  check(`ligatures are off for "${sel}"`, covered.has(sel), `selectors covered: ${[...covered].join(", ")}`);
}

// ---- the CodeMirror theme must say so itself (it sets its own fontFamily)
const ext = read("lib/editor-extensions.ts");
const scroller = ext.match(/"\.cm-scroller":\s*\{([\s\S]*?)\n\s*\},/);
check("editor theme: .cm-scroller turns ligatures off", !!scroller && /fontVariantLigatures:\s*"none"/.test(scroller[1]) && /"calt" 0/.test(scroller[1]));

// ---- nothing in the source may turn them back on
const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(path.join(root, d), { withFileTypes: true })) {
    if (["node_modules", ".next", ".git"].includes(e.name)) continue;
    const rel = path.join(d, e.name);
    e.isDirectory() ? walk(rel) : /\.(css|tsx?|mjs)$/.test(e.name) && !rel.startsWith("scripts") && files.push(rel);
  }
})(".");
const offenders = files.filter((f) => {
  const t = read(f).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  return /(font-variant-ligatures|fontVariantLigatures)\s*:\s*["']?(normal|common-ligatures|contextual|discretionary|historical)/.test(t)
    || /ligatures-(normal|common|contextual)/.test(t)
    || /font-feature-settings\s*:[^;]*"(calt|liga)"\s*1/.test(t)
    || /fontFeatureSettings\s*:[^,}]*"(calt|liga)"\s*1/.test(t);
});
check("no CSS, Tailwind class or style turns ligatures back on", offenders.length === 0, `offenders: ${offenders.join(", ")}`);

// ---- documentation of the cause stays next to the rule
check("globals.css explains why (so nobody deletes the rule as 'unused')", /ligature/i.test(read("app/globals.css")) && /!=/.test(read("app/globals.css")));

console.log(`\n${count - failures}/${count} font checks passed.`);
if (failures) { console.log(`${failures} FAILED`); process.exit(1); }
console.log("All font checks passed.");
