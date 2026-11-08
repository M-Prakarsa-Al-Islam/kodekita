// Tests for "reason when a payment is rejected": the validation rules and static checks
// that the pieces are wired together. Run: node scripts/test-reject-reason.mjs
// (Cannot prove: the real database update, or how the form looks on a phone.)
import { createRequire } from "node:module";
import fs from "node:fs";
import ts from "typescript";

const require = createRequire(import.meta.url);
const read = (f) => fs.readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
function load(file) {
  const js = ts.transpileModule(read(file), { compilerOptions: { module: "CommonJS", target: "ES2020" } }).outputText;
  const mod = { exports: {} };
  new Function("require", "module", "exports", js)(require, mod, mod.exports);
  return mod.exports;
}
const R = load("lib/reject-reason.ts");

let failures = 0, count = 0;
function check(name, actual, expected) {
  count++;
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"} - ${name}${ok ? "" : `\n      got      ${JSON.stringify(actual)}\n      expected ${JSON.stringify(expected)}`}`);
}

// ---- validation ----
check("a normal reason is kept", R.cleanRejectReason("Nominal tidak sesuai"), "Nominal tidak sesuai");
check("surrounding and repeated whitespace is tidied", R.cleanRejectReason("  Bukti   tidak \n jelas  "), "Bukti tidak jelas");
check("empty is refused", R.cleanRejectReason(""), null);
check("only spaces is refused", R.cleanRejectReason("     "), null);
check("too short is refused", R.cleanRejectReason("ab"), null);
check("exactly the minimum is accepted", R.cleanRejectReason("abc"), "abc");
check("exactly the maximum is accepted", R.cleanRejectReason("a".repeat(300))?.length, 300);
check("one over the maximum is refused", R.cleanRejectReason("a".repeat(301)), null);
check("a missing field (null) is refused", R.cleanRejectReason(null), null);
check("a file instead of text is refused", R.cleanRejectReason({ name: "x" }), null);
check("every suggested reason is itself valid", R.REJECT_REASON_PRESETS.every((r) => R.cleanRejectReason(r) === r), true);
check("the limits match the database CHECK", /char_length\(reject_reason\) <= 300/.test(read("supabase/schema_phase6_reject_reason.sql")) && R.REJECT_REASON_MAX === 300, true);

// ---- wiring ----
const actions = read("app/admin/purchases/actions.ts");
const rejectFn = actions.slice(actions.indexOf("export async function rejectPurchase"));
check("rejecting stores the reason together with the status", /status: "rejected", reject_reason: reason/.test(rejectFn), true);
check("rejecting without a valid reason changes nothing", rejectFn.indexOf("if (!reason) return;") > -1 && rejectFn.indexOf("if (!reason) return;") < rejectFn.indexOf(".update("), true);
check("only a still-pending payment can be rejected (no overwriting a decision)", /\.eq\("status", "pending"\)/.test(rejectFn), true);
check("rejecting still requires an admin session", /await requireAdmin\(\)/.test(rejectFn), true);

const page = read("app/admin/purchases/page.tsx");
check("the admin form has a required reason field and no one-tap reject", /name="reason"/.test(page) && /\brequired\b/.test(page) && !/<form action=\{rejectPurchase\}>\s*<input type="hidden" name="id" value=\{p\.id\} \/>\s*<button/.test(page), true);

const ps = read("lib/purchase-server.ts");
const latest = ps.slice(ps.indexOf("export async function getLatestPurchase"), ps.indexOf("export async function hasApprovedPurchase"));
check("access to paid chapters does NOT depend on the new column", !/reject_reason/.test(latest), true);
check("a failing reason read returns null instead of throwing", /if \(error\) return null;/.test(ps), true);
for (const f of ["app/kursus/python-dasar/beli/page.tsx", "app/proyek/[project]/beli/page.tsx"]) {
  const s = read(f);
  check(`${f}: shows the reason, only for a rejected payment`, /purchase\?\.status === "rejected" \? await getRejectReason/.test(s) && /Alasan dari admin:<\/strong> \{rejectReason\}/.test(s), true);
}
check("account deletion also clears the reason (it can mention the person)", /note: null, reject_reason: null, proof_path: null/.test(read("app/akun/actions.ts")), true);
check("the migration only ADDS a nullable column", /add column if not exists reject_reason text/.test(read("supabase/schema_phase6_reject_reason.sql")) && !/drop |delete |truncate /i.test(read("supabase/schema_phase6_reject_reason.sql").replace(/--.*$/gm, "")), true);

console.log(`\n${count - failures}/${count} reject-reason test-cases behaved as expected.`);
process.exit(failures ? 1 : 0);
