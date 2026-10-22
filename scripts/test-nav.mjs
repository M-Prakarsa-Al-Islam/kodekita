// Guards the site menu (components/site/Header.tsx) against two bugs:
//  1. a menu that is hidden on phones with nothing in its place
//  2. a menu link that points at a page that does not exist (404)
// Static check over the source; no browser needed.
// Run: node scripts/test-nav.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const header = fs.readFileSync(path.join(root, "components/site/Header.tsx"), "utf8");

let failures = 0, count = 0;
function check(name, ok, detail = "") {
  count++;
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"} - ${name}${ok || !detail ? "" : `\n      ${detail}`}`);
}

// the shared list
const list = [...header.matchAll(/\{\s*href:\s*"(\/[^"]*)",\s*label:\s*"([^"]+)"\s*\}/g)].map((m) => ({ href: m[1], label: m[2] }));
check("the menu lists Kursus, Proyek and Tentang", JSON.stringify(list.map((l) => l.label)) === JSON.stringify(["Kursus", "Proyek", "Tentang"]), JSON.stringify(list));

// both menus are rendered from that one list
const rendersList = (header.match(/NAV_LINKS\.map\(/g) || []).length;
check("both the desktop and the phone menu are built from the same list", rendersList === 2, `NAV_LINKS.map used ${rendersList} times`);

const desktop = header.match(/<nav[^>]*className="([^"]*)"[^>]*>\s*\{NAV_LINKS/);
const phone = header.match(/<nav[^>]*className="([^"]*)"[^>]*>\s*<ul/);
check("the desktop menu is shown from md up", !!desktop && /\bhidden\b/.test(desktop[1]) && /\bmd:flex\b/.test(desktop[1]));
check("a phone menu exists and is hidden only from md up (so it shows on phones)", !!phone && /\bmd:hidden\b/.test(phone[1]) && !/(^|\s)hidden(\s|$)/.test(phone[1]));

// every link in the header goes to a page that exists
function routeExists(route) {
  const clean = route.split("?")[0].split("#")[0].replace(/\/$/, "") || "/";
  const dir = path.join(root, "app", clean === "/" ? "" : clean);
  return ["page.tsx", "page.ts", "route.ts"].some((f) => fs.existsSync(path.join(dir, f)));
}
const hrefs = [...new Set([...header.matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1]).concat(list.map((l) => l.href)))];
for (const h of hrefs) check(`the header link ${h} has a page`, routeExists(h));

console.log(`\n${count - failures}/${count} nav test-cases behaved as expected.`);
process.exit(failures ? 1 : 0);
