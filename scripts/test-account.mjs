// Tests lib/account.ts: input rules and, above all, the ORDER and the abort
// rules of the delete-account flow, using fake dependencies that record every
// call. (The real Supabase calls are in app/akun/actions.ts and can only be
// proven against a real project: see the checklist in PROGRESS.md.)
// Run: node scripts/test-account.mjs
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
function load(file) {
  const src = fs.readFileSync(path.join(here, "..", file), "utf8");
  const js = ts.transpileModule(src, { compilerOptions: { module: "CommonJS", target: "ES2020" } }).outputText;
  const mod = { exports: {} };
  new Function("require", "module", "exports", js)(require, mod, mod.exports);
  return mod.exports;
}
const A = load("lib/account.ts");

let failures = 0, count = 0;
function check(name, actual, expected) {
  count++;
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"} - ${name}${ok ? "" : `\n      expected ${JSON.stringify(expected)}\n      got      ${JSON.stringify(actual)}`}`);
}

// ---- names ----------------------------------------------------------------
check("normalizeName trims and collapses spaces", A.normalizeName("  Budi   Santoso \n"), "Budi Santoso");
check("normalizeName turns control characters into spaces", A.normalizeName("Bu\u0000di\u0007 S"), "Bu di S");
check("normalizeName copes with non-strings", A.normalizeName(undefined), "");
check("empty name is rejected", A.validateName(""), "Nama tidak boleh kosong.");
check("a name of only spaces is rejected (after normalising)", A.validateName(A.normalizeName("   ")), "Nama tidak boleh kosong.");
check("a normal name is accepted", A.validateName("Budi"), null);
check("a 60-character name is accepted", A.validateName("a".repeat(60)), null);
check("a 61-character name is rejected", A.validateName("a".repeat(61)), "Nama maksimal 60 karakter.");

// ---- password change --------------------------------------------------------
check("missing current password", A.validatePasswordChange("", "abcdef", "abcdef"), "Isi password saat ini.");
check("new password too short", A.validatePasswordChange("old123", "abc", "abc"), "Password baru minimal 6 karakter.");
check("new password too long", A.validatePasswordChange("old123", "a".repeat(73), "a".repeat(73)), "Password baru maksimal 72 karakter.");
check("confirmation mismatch", A.validatePasswordChange("old123", "abcdef", "abcdeg"), "Konfirmasi password tidak cocok.");
check("same as current is rejected", A.validatePasswordChange("abcdef", "abcdef", "abcdef"), "Password baru harus berbeda dari password saat ini.");
check("a valid change passes", A.validatePasswordChange("old123", "abcdef", "abcdef"), null);
check("exactly 6 characters passes (same rule as register)", A.validatePasswordChange("old123", "abcdef", "abcdef"), null);

// ---- delete input ----------------------------------------------------------
check("delete needs a password", A.validateDeleteInput("", "HAPUS"), "Isi password untuk menghapus akun.");
check("delete needs the confirmation word", A.validateDeleteInput("pw", "hapus"), "Ketik HAPUS untuk mengonfirmasi.");
check("the word is case-sensitive", A.validateDeleteInput("pw", "Hapus"), "Ketik HAPUS untuk mengonfirmasi.");
check("surrounding spaces around HAPUS are tolerated", A.validateDeleteInput("pw", "  HAPUS "), null);

// ---- the delete flow -------------------------------------------------------
function makeDeps(over = {}) {
  const calls = [];
  const rec = (name, impl) => async (...args) => { calls.push(name); return impl ? impl(...args) : undefined; };
  const deps = {
    getCurrentUser: rec("getCurrentUser", () => ({ id: "u1", email: "a@b.id" })),
    verifyPassword: rec("verifyPassword", () => true),
    migrationReady: rec("migrationReady", () => true),
    isAdmin: rec("isAdmin", () => false),
    countPending: rec("countPending", () => 0),
    removeProofFiles: rec("removeProofFiles"),
    scrubPurchases: rec("scrubPurchases"),
    deleteAuthUser: rec("deleteAuthUser"),
    log: (step) => calls.push("log:" + step),
  };
  for (const [k, v] of Object.entries(over)) deps[k] = rec(k, v);
  return { deps, calls };
}
const GOOD = { password: "pw", confirmText: "HAPUS" };

{
  const { deps, calls } = makeDeps();
  const r = await A.deleteAccountFlow(deps, GOOD);
  check("happy path succeeds", r, { ok: true });
  check("happy path runs the steps in the safe order, deleting the user LAST", calls, ["getCurrentUser", "verifyPassword", "migrationReady", "isAdmin", "countPending", "removeProofFiles", "scrubPurchases", "deleteAuthUser"]);
}
{
  const { deps, calls } = makeDeps();
  const r = await A.deleteAccountFlow(deps, { password: "pw", confirmText: "nope" });
  check("bad confirmation word: nothing is called at all", [r.ok, calls], [false, []]);
}
{
  const { deps, calls } = makeDeps({ getCurrentUser: () => null });
  const r = await A.deleteAccountFlow(deps, GOOD);
  check("not signed in: refused, nothing else called", [r, calls], [{ ok: false, message: "Kamu belum masuk." }, ["getCurrentUser"]]);
}
{
  const { deps, calls } = makeDeps({ verifyPassword: () => false });
  const r = await A.deleteAccountFlow(deps, GOOD);
  check("wrong password: refused before anything is touched", [r, calls.includes("removeProofFiles"), calls.includes("deleteAuthUser")], [{ ok: false, message: "Password salah." }, false, false]);
}
{
  const { deps, calls } = makeDeps({ migrationReady: () => false });
  const r = await A.deleteAccountFlow(deps, GOOD);
  check("migration not applied: refused so the cascade can never erase purchases", [r.ok, /migrasi/.test(r.message), calls.includes("deleteAuthUser"), calls.includes("removeProofFiles")], [false, true, false, false]);
}
{
  const { deps, calls } = makeDeps({ isAdmin: () => true });
  const r = await A.deleteAccountFlow(deps, GOOD);
  check("admin accounts cannot be deleted here", [r.ok, calls.includes("deleteAuthUser")], [false, false]);
}
{
  const { deps, calls } = makeDeps({ countPending: () => 2 });
  const r = await A.deleteAccountFlow(deps, GOOD);
  check("a payment waiting for review blocks deletion, with a clear message", [r.ok, /menunggu verifikasi/.test(r.message), calls.includes("removeProofFiles"), calls.includes("deleteAuthUser")], [false, true, false, false]);
}
{
  const { deps, calls } = makeDeps({ removeProofFiles: () => { throw new Error("storage down"); } });
  const r = await A.deleteAccountFlow(deps, GOOD);
  check("storage failure: aborts, user NOT deleted, purchases not touched", [r.ok, calls.includes("scrubPurchases"), calls.includes("deleteAuthUser"), calls.includes("log:removeProofFiles")], [false, false, false, true]);
  check("storage failure tells the learner the account is not deleted", /belum dihapus/.test(r.message), true);
}
{
  const { deps, calls } = makeDeps({ scrubPurchases: () => { throw new Error("db"); } });
  const r = await A.deleteAccountFlow(deps, GOOD);
  check("scrub failure: aborts before deleting the user", [r.ok, calls.includes("deleteAuthUser")], [false, false]);
}
{
  const { deps, calls } = makeDeps({ deleteAuthUser: () => { throw new Error("auth down"); } });
  const r = await A.deleteAccountFlow(deps, GOOD);
  check("deleteUser failure: reported as not deleted and logged", [r.ok, /belum dihapus/.test(r.message), calls.includes("log:deleteAuthUser")], [false, true, true]);
}
{
  // retry after a failure in the last step is safe: every earlier step is idempotent
  let fail = true;
  const { deps, calls } = makeDeps({ deleteAuthUser: () => { if (fail) { fail = false; throw new Error("blip"); } } });
  const first = await A.deleteAccountFlow(deps, GOOD);
  const second = await A.deleteAccountFlow(deps, GOOD);
  check("pressing the button again after a failure succeeds", [first.ok, second.ok], [false, true]);
}
{
  const { deps } = makeDeps({ countPending: () => { throw new Error("db"); } });
  const r = await A.deleteAccountFlow(deps, GOOD);
  check("an error while counting pending purchases aborts (never assume zero)", r.ok, false);
}

// ---- the SQL migration is what the flow relies on ---------------------------
const sql = fs.readFileSync(path.join(here, "..", "supabase", "schema_phase5_account.sql"), "utf8");
check("migration makes purchases.user_id nullable", /alter column user_id drop not null/.test(sql), true);
check("migration makes proof_path nullable", /alter column proof_path drop not null/.test(sql), true);
check("migration uses ON DELETE SET NULL on the user link", /references public\.profiles\(id\) on delete set null/.test(sql), true);
check("the readiness function is service_role only", /revoke all on function public\.purchases_survive_user_deletion\(\) from public, anon, authenticated/.test(sql) && /grant execute on function public\.purchases_survive_user_deletion\(\) to service_role/.test(sql), true);

console.log(`\n${count - failures}/${count} account test-cases behaved as expected.`);
process.exit(failures ? 1 : 0);
