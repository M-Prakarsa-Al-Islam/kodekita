// Tests for the admin statistics page: the pure maths (lib/admin-stats.ts) and static
// checks on the page and the data loader. Run: node scripts/test-admin-stats.mjs
// (Cannot prove: the real Supabase queries, or how the page looks in a browser.)
import { createRequire } from "node:module";
import fs from "node:fs";
import ts from "typescript";

const require = createRequire(import.meta.url);

function load(file, extra = {}) {
  const src = fs.readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
  const js = ts.transpileModule(src, { compilerOptions: { module: "CommonJS", target: "ES2020", jsx: "react-jsx" } }).outputText;
  const mod = { exports: {} };
  const req = (id) => (id in extra ? extra[id] : require(id));
  new Function("require", "module", "exports", js)(req, mod, mod.exports);
  return mod.exports;
}
const read = (f) => fs.readFileSync(new URL(`../${f}`, import.meta.url), "utf8");

const keys = load("lib/progress-keys.ts");
const summary = load("lib/progress-summary.ts", { "./progress-keys": keys });
const S = load("lib/admin-stats.ts", { "./progress-keys": keys, "./progress-summary": summary });

let failures = 0, count = 0;
function check(name, actual, expected) {
  count++;
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"} - ${name}${ok ? "" : `\n      got      ${JSON.stringify(actual)}\n      expected ${JSON.stringify(expected)}`}`);
}

// ---- Jakarta dates ----
check("wibDate: 17:30 UTC is already the next day in Jakarta", S.wibDate(Date.parse("2026-11-04T17:30:00Z")), "2026-11-05");
check("wibDate: 16:59 UTC is still the same day in Jakarta", S.wibDate(Date.parse("2026-11-04T16:59:00Z")), "2026-11-04");

// ---- fixture: one course, ch1 free (L1, L2), ch2 paid (L1) ----
const L = (chapterSlug, chapterTitle, chapterIsFree, lessonId) => ({ chapterSlug, chapterTitle, chapterIsFree, lessonId, lessonTitle: `T-${lessonId}` });
const course = {
  slug: "kursus-a",
  title: "Kursus A",
  lessons: [L("ch1", "Bab 1", true, "L1"), L("ch1", "Bab 1", true, "L2"), L("ch2", "Bab 2", false, "L1")],
};
const now = new Date("2026-11-05T05:00:00Z"); // 12:00 in Jakarta
const day = (n) => new Date(now.getTime() - n * 86400000).toISOString();
const prog = (u, c, l, at) => ({ user_id: u, chapter_slug: c, lesson_id: l, completed_at: at });
const input = {
  now,
  profiles: [
    { id: "u1", created_at: day(40) },
    { id: "u2", created_at: day(20) },
    { id: "u3", created_at: day(3) },
    { id: "u4", created_at: day(0.1) },
    { id: "u5", created_at: day(0.2) },
  ],
  purchases: [
    { user_id: "u1", course_slug: "kursus-a", amount: 20000, status: "approved", created_at: day(30) },
    { user_id: null, course_slug: "kursus-a", amount: 20000, status: "approved", created_at: day(25) }, // deleted account
    { user_id: "u2", course_slug: "kursus-a", amount: 20000, status: "pending", created_at: day(1) },
    { user_id: "u3", course_slug: "kursus-a", amount: 20000, status: "rejected", created_at: day(2) },
    { user_id: "u1", course_slug: "lain", amount: 10000, status: "approved", created_at: day(5) },
  ],
  progress: [
    prog("u1", "ch1", "L1", day(30)), prog("u1", "ch1", "L2", day(30)), prog("u1", "ch2", "L1", day(2)), // finished everything
    prog("u2", "ch1", "L1", day(10)), // stopped after one lesson
    prog("u3", "ch1", "L1", day(1)), prog("u3", "ch1", "L2", day(1)), // finished the free part, did not buy
    prog("u5", "ch9", "L9", day(1)), // a lesson that no longer exists
    prog("ghost", "ch1", "L1", day(1)), // account that no longer exists
  ],
  courses: [course],
};
const r = S.computeStats(input);

check("users: total", r.users.total, 5);
check("users: last 7 and last 30 days", [r.users.last7, r.users.last30], [3, 4]);
check("users: active in 7 days (u1, u3, u5; a deleted account never counts)", r.users.active7, 3);
check("users: never started (u4 only; u5 has a row)", r.users.neverStarted, 1);
check("users: daily has 14 days, oldest first, last is today in Jakarta", [r.users.daily.length, r.users.daily[13].date, r.users.daily[0].date], [14, "2026-11-05", "2026-10-23"]);
check("users: today's sign-ups (u4 and u5)", r.users.daily[13].count, 2);
check("users: sign-ups 3 days ago", r.users.daily[10].count, 1);

check("sales: approved, pending, rejected", [r.sales.approved, r.sales.pending, r.sales.rejected], [3, 1, 1]);
check("sales: revenue counts every approved row including the deleted account", r.sales.revenue, 50000);
check("sales: unique buyers ignore the anonymous row and count u1 once", r.sales.uniqueBuyers, 1);
check("sales: conversion is buyers / users with one decimal", r.sales.conversionPercent, 20);

const c = r.courses[0];
check("course: purchases only for this course", [c.approved, c.pending, c.rejected, c.revenue, c.buyers], [2, 1, 1, 40000, 1]);
check("course: started counts only existing lessons of existing learners (u1,u2,u3)", c.started, 3);
check("course: completed = every lesson done (u1)", [c.completed, c.completionPercent], [1, 33]);
check("course: average lessons done among starters ((3+1+2)/3)", c.avgLessonsDone, 2);
check("course: u3 finished the free part and is waiting to buy", c.waitingToBuy, 1);
check("course: chapters started/completed", c.chapters.map((x) => [x.started, x.completed]), [[3, 2], [1, 1]]);
check("course: per-lesson done and percent of starters", c.lessons.map((x) => [x.done, x.percentOfStarted]), [[3, 100], [2, 67], [1, 33]]);
check("course: learners stop at the next lesson they can open (u2 -> Bab 1 L2)", c.stuckAt, [{ chapterTitle: "Bab 1", lessonId: "L2", lessonTitle: "T-L2", count: 1 }]);

// a buyer who has not finished: the paid lesson is where they continue
const input2 = { ...input, progress: [prog("u1", "ch1", "L1", day(1)), prog("u1", "ch1", "L2", day(1))] };
const c2 = S.computeStats(input2).courses[0];
check("a buyer who finished the free part continues at the first paid lesson, not 'waiting to buy'", [c2.stuckAt[0]?.chapterTitle, c2.stuckAt[0]?.lessonId, c2.waitingToBuy], ["Bab 2", "L1", 0]);

// empty database
const empty = S.computeStats({ now, profiles: [], purchases: [], progress: [], courses: [course] });
check("empty data: zeros, no divide-by-zero", [empty.users.total, empty.sales.conversionPercent, empty.courses[0].completionPercent, empty.courses[0].avgLessonsDone, empty.courses[0].lessons[0].percentOfStarted], [0, 0, 0, 0, 0]);

// ---- static checks ----
const page = read("app/admin/statistik/page.tsx");
const server = read("lib/admin-stats-server.ts");
check("the page 404s for non-admins before any data is loaded", page.indexOf("is_admin") > -1 && page.indexOf("is_admin") < page.indexOf("loadStats()") && /notFound\(\)/.test(page), true);
check("the page does not crash when the service key is missing", /SUPABASE_SERVICE_ROLE_KEY/.test(page), true);
check("the loader is server-only and reads in pages of 1000 rows", /import "server-only"/.test(server) && /PAGE = 1000/.test(server) && /\.range\(/.test(server), true);
check("the admin layout keeps every /admin page noindex", /robots:\s*\{\s*index:\s*false/.test(read("app/admin/layout.tsx")), true);
check("the statistics page is reachable from the purchases page and back", /admin\/statistik/.test(read("app/admin/purchases/page.tsx")) && /admin\/purchases/.test(page), true);
check("no client component imports the stats loader (it uses the service key)", fs.readdirSync(new URL("../components", import.meta.url), { recursive: true }).filter((f) => f.endsWith(".tsx")).filter((f) => /admin-stats-server|supabase\/admin/.test(read(`components/${f}`))), []);

console.log(`\n${count - failures}/${count} admin-stats test-cases behaved as expected.`);
process.exit(failures ? 1 : 0);
