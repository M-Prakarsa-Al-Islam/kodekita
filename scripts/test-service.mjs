// Tests the end-of-service machinery (lib/site-config.ts) and guards the places
// that depend on it. Pure logic + static checks over the source; no browser.
// Run: node scripts/test-service.mjs
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
function load(file) {
  const js = ts.transpileModule(read(file), { compilerOptions: { module: "CommonJS", target: "ES2020" } }).outputText;
  const mod = { exports: {} };
  new Function("require", "module", "exports", js)(require, mod, mod.exports);
  return mod.exports;
}
const C = load("lib/site-config.ts");

let failures = 0, count = 0;
function check(name, actual, expected) {
  count++;
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"} - ${name}${ok ? "" : `\n      expected ${JSON.stringify(expected)}\n      got      ${JSON.stringify(actual)}`}`);
}
const DAY = 86400000;
const END = new Date(C.SERVICE_END_ISO).getTime();
const at = (offsetMs) => new Date(END + offsetMs);

// ---- the committed settings ------------------------------------------------------------
check("the committed settings have no problems", C.configProblems(), []);
check("the end date is 1 Oktober 2027", C.formatDateId(C.SERVICE_END_ISO), "1 Oktober 2027");
check("the end is at least 14 days before the domain expires (17 Oktober 2027)", (new Date(C.DOMAIN_EXPIRES_ISO).getTime() - END) / DAY >= 14, true);
check("the promised notice is 30 days, the pop-up starts at 45", [C.MIN_NOTICE_DAYS, C.NOTICE_DAYS], [30, 45]);
check("refund window is 45 days and sales close 45 days before the end", [C.REFUND_DAYS, C.SALES_CLOSE_DAYS], [45, 45]);
check("today (22 Oktober 2026) the site is plain 'active' with sales open", [C.serviceState(new Date("2026-10-22T10:00:00+07:00")), C.salesOpen(new Date("2026-10-22T10:00:00+07:00"))], ["active", true]);

// ---- state boundaries -------------------------------------------------------------------------
check("46 days before the end: active, sales open", [C.serviceState(at(-46 * DAY)), C.salesOpen(at(-46 * DAY))], ["active", true]);
check("just over 45 days before: still active", C.serviceState(at(-45 * DAY - 1000)), "active");
check("45 days before: the notice starts and sales close", [C.serviceState(at(-45 * DAY + 1000)), C.salesOpen(at(-45 * DAY + 1000))], ["notice", false]);
check("30 days before: notice, sales closed", [C.serviceState(at(-30 * DAY)), C.salesOpen(at(-30 * DAY))], ["notice", false]);
check("1 second before the end: still notice (the service still runs)", C.serviceState(at(-1000)), "notice");
check("1 second after the end: ended, sales closed", [C.serviceState(at(1000)), C.salesOpen(at(1000))], ["ended", false]);
check("a year after: ended", C.serviceState(at(365 * DAY)), "ended");
check("daysLeft rounds up", [C.daysLeft(at(-10.2 * DAY)), C.daysLeft(at(-1000)), C.daysLeft(at(5 * DAY)) <= 0], [11, 1, true]);

// The promise made to users: when the notice first appears, at least 30 days remain.
{
  let lo = END - 120 * DAY, hi = END; // find the first instant that is "notice"
  while (hi - lo > 1000) {
    const mid = Math.floor((lo + hi) / 2);
    if (C.serviceState(new Date(mid)) === "active") lo = mid; else hi = mid;
  }
  check("the notice appears at least 30 days before the end (the promise)", (END - hi) / DAY >= C.MIN_NOTICE_DAYS, true);
  check("and sales close in the same moment (nobody can buy after the notice)", C.salesOpen(new Date(hi)) === false && C.salesOpen(new Date(hi - 2000)) === true, true);
}

// ---- stopping EARLIER than planned (owner changes the date) -----------------------------------
{
  const now = new Date("2027-03-01T12:00:00+07:00");
  const earlier = (days) => new Date(now.getTime() + days * DAY).toISOString();
  check("end set 60 days ahead: nothing visible yet", [C.serviceState(now, earlier(60)), C.salesOpen(now, earlier(60))], ["active", true]);
  check("end set 30 days ahead (the minimum): notice shows and sales are closed at once", [C.serviceState(now, earlier(30)), C.salesOpen(now, earlier(30))], ["notice", false]);
  check("end set 44 days ahead: notice, sales closed", [C.serviceState(now, earlier(44)), C.salesOpen(now, earlier(44))], ["notice", false]);
}

// ---- dates are the Jakarta calendar day, whatever the machine's time zone -------------------------
check("23:59 WIB stays on the same day", C.formatDateId("2027-10-01T23:59:59+07:00"), "1 Oktober 2027");
check("20:00 UTC on 31 Dec is already 1 Jan in Jakarta", C.formatDateId("2027-12-31T20:00:00Z"), "1 Januari 2028");
check("dateAfter adds whole days", C.formatDateId(C.dateAfter(C.SERVICE_END_ISO, 30)), "31 Oktober 2027");
check("every month name is Indonesian", Array.from({ length: 12 }, (_, m) => C.formatDateId(new Date(Date.UTC(2027, m, 15)).toISOString()).split(" ")[1]), ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]);

// ---- static guards ---------------------------------------------------------------------------------------
const farewell = read("components/site/Farewell.tsx");
check("the farewell page imports no Supabase code (it must work after the project is deleted)", /from\s+["'][^"']*supabase/i.test(farewell), false);
check("the farewell page does not import the Header (which calls Supabase)", /from\s+["'][^"']*Header["']/.test(farewell), false);

const layout = read("app/layout.tsx");
check("the layout is dynamic (the state depends on the clock)", /export const dynamic = "force-dynamic"/.test(layout), true);
check("the layout shows Farewell for 'ended' and only otherwise renders the Header", layout.indexOf("<Farewell />") !== -1 && layout.indexOf("<Farewell />") < layout.indexOf("<Header />") && /state === "ended"/.test(layout), true);
check("the layout shows the end-notice pop-up only in the 'notice' state", /state === "notice" &&[\s\S]{0,40}<EndNoticeModal/.test(layout), true);

const mw = read("middleware.ts");
const iEnded = mw.indexOf('serviceState(new Date()) === "ended"');
const iSession = mw.indexOf("needsSession(pathname)");
const iClient = mw.indexOf("createServerClient(");
check("middleware sends every request to the farewell route once the service has ended, before any Supabase client exists", iEnded !== -1 && /NextResponse\.rewrite\(new URL\(ENDED_PATH/.test(mw) && iEnded < iClient, true);
check("middleware lets pages that need no session through without touching Supabase", iSession !== -1 && iSession < iClient, true);
check("the middleware matcher covers every page (so the farewell rewrite reaches all of them)", /matcher: \["\/\(\(\?!_next\/static/.test(mw), true);
const selesai = read("app/selesai/page.tsx");
check("the farewell route exists, does not use Supabase, and is a 404 before the end date", /notFound\(\)/.test(selesai) && !/supabase/i.test(selesai) && /serviceState\(new Date\(\)\) !== "ended"/.test(selesai), true);
check("ENDED_PATH matches the route's folder", C.ENDED_PATH === "/selesai" && fs.existsSync(path.join(root, "app/selesai/page.tsx")), true);

const beli = read("app/kursus/python-dasar/beli/page.tsx");
check("the purchase page closes the sale with salesOpen()", /salesOpen\(new Date\(\)\)/.test(beli), true);
check("the purchase page tells buyers about the limits before paying", /Baca dulu sebelum membayar/.test(beli) && /tentang#status/.test(beli), true);

// Nothing may still promise lifetime access (negations like "bukan akses selamanya" are fine).
const allSrc = [];
(function walk(dir) {
  for (const e of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    const rel = path.join(dir, e.name);
    if (e.isDirectory()) walk(rel);
    else if (/\.(tsx?|md)$/.test(e.name) && !rel.startsWith("content") && !/PROGRESS|PROJECT_DESIGN|SHUTDOWN|README/.test(rel)) allSrc.push(rel);
  }
})("app");
(function walkC(dir) { for (const e of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) { const rel = path.join(dir, e.name); if (e.isDirectory()) walkC(rel); else if (/\.tsx?$/.test(e.name)) allSrc.push(rel); } })("components");
const promises = allSrc.flatMap((f) => read(f).split("\n").map((l, i) => ({ f, i: i + 1, l }))).filter(({ l }) => /akses selamanya|seumur hidup|lifetime/i.test(l) && !/bukan|tidak|jangan/i.test(l));
check("no page still promises lifetime access", promises.map((p) => `${p.f}:${p.i}`), []);

check("the WhatsApp number lives only in lib/site-config.ts", allSrc.filter((f) => /6285185203197/.test(read(f))), []);

const tentang = read("app/tentang/page.tsx");
const ids = [...tentang.matchAll(/id: "([a-z-]+)"/g)].map((m) => m[1]);
check("the About page has all its sections", ["apa-itu", "pengelola", "status", "harga", "refund", "data", "penutupan", "kontak", "faq"].every((x) => ids.includes(x)), true);
const anchors = [...new Set(allSrc.flatMap((f) => [...read(f).matchAll(/\/tentang#([a-z-]+)/g)].map((m) => m[1])))];
check("every /tentang#section link in the site points at a section that exists", anchors.filter((a) => !ids.includes(a)), []);
check("the About page takes its dates and numbers from the config (nothing hard-coded)", /formatDateId\(SERVICE_END_ISO\)/.test(tentang) && !/1 Oktober 2027/.test(tentang) && /REFUND_DAYS/.test(tentang), true);
check("the About page and the pop-up only mention downloads when they exist", /DOWNLOADS_AVAILABLE/.test(tentang) && /DOWNLOADS_AVAILABLE/.test(read("components/site/EndNoticeModal.tsx")), true);
check("the footer links to the About page, refund, WhatsApp and email", ["/tentang", "/tentang#refund", "WHATSAPP_URL", "mailto:"].every((s) => read("components/site/Footer.tsx").includes(s)), true);
check("the menu's Tentang page is no longer a placeholder", !/Halaman ini sedang disusun/.test(tentang), true);

console.log(`\n${count - failures}/${count} service test-cases behaved as expected.`);
process.exit(failures ? 1 : 0);
