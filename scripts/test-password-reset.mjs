// Tests the "lupa password" logic (lib/password-reset.ts, the new rules in
// lib/account.ts) with fake dependencies, plus a few static guards over the
// source (every password field goes through the show/hide component, "Keluar"
// lives on the account page, "use client" files really start with the directive).
// Run: node scripts/test-password-reset.mjs
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..");
function load(file, shims = {}) {
  const src = fs.readFileSync(path.join(root, file), "utf8");
  const js = ts.transpileModule(src, { compilerOptions: { module: "CommonJS", target: "ES2020" } }).outputText;
  const mod = { exports: {} };
  new Function("require", "module", "exports", js)((id) => (id in shims ? shims[id] : require(id)), mod, mod.exports);
  return mod.exports;
}
const A = load("lib/account.ts");
const P = load("lib/password-reset.ts", { "./account": A });

let failures = 0, count = 0;
function check(name, actual, expected) {
  count++;
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"} - ${name}${ok ? "" : `\n      expected ${JSON.stringify(expected)}\n      got      ${JSON.stringify(actual)}`}`);
}

// ---- email + redirect ---------------------------------------------------------
check("valid emails pass", ["a@b.id", " siti@mail.co.id "].map(P.isValidEmail), [true, true]);
check("invalid emails fail", ["", "abc", "a@b", "a b@c.id", "@c.id"].map(P.isValidEmail), [false, false, false, false, false]);
check("redirect URL points at the callback and asks for /reset-password", P.buildResetRedirect("https://pymula.id"), "https://pymula.id/auth/callback?next=%2Freset-password");
check("redirect URL has no double slash when the origin ends with /", P.buildResetRedirect("http://localhost:3000/"), "http://localhost:3000/auth/callback?next=%2Freset-password");

// ---- safeNext (open-redirect guard) ---------------------------------------------
check("safeNext keeps /reset-password", P.safeNext("/reset-password"), "/reset-password");
for (const bad of ["https://evil.com", "//evil.com", "/\\evil.com", "/admin/purchases", "/reset-password/../x", "javascript:alert(1)", "", null, undefined]) {
  check(`safeNext rejects ${JSON.stringify(bad)}`, P.safeNext(bad), "/");
}

// ---- error mapping ----------------------------------------------------------------
check("no error -> no message", P.mapResetError(null), null);
check("rate limit by status", /Terlalu banyak/.test(P.mapResetError({ status: 429, message: "x" })), true);
check("rate limit by code", /Terlalu banyak/.test(P.mapResetError({ code: "over_email_send_rate_limit" })), true);
check("rate limit by message", /Terlalu banyak/.test(P.mapResetError({ message: "email rate limit exceeded" })), true);
check("other errors get a generic message", P.mapResetError({ message: "boom" }), "Gagal mengirim link. Periksa koneksimu, lalu coba lagi.");
check("password errors: same password", A.mapPasswordUpdateError({ code: "same_password", message: "New password should be different from the old password." }), "Password baru harus berbeda dari password lama.");
check("password errors: weak", /terlalu lemah/.test(A.mapPasswordUpdateError({ code: "weak_password" })), true);
check("password errors: unknown", A.mapPasswordUpdateError({ message: "???" }), "Gagal mengubah password. Coba lagi.");
check("password errors: null is safe", A.mapPasswordUpdateError(null), "Gagal mengubah password. Coba lagi.");

// ---- new-password rules (shared with the account page) ----------------------------
check("validateNewPassword: too short", A.validateNewPassword("abc", "abc"), "Password baru minimal 6 karakter.");
check("validateNewPassword: mismatch", A.validateNewPassword("abcdef", "abcdeg"), "Konfirmasi password tidak cocok.");
check("validateNewPassword: ok", A.validateNewPassword("abcdef", "abcdef"), null);
check("validatePasswordChange still behaves as before", [A.validatePasswordChange("", "abcdef", "abcdef"), A.validatePasswordChange("abcdef", "abcdef", "abcdef"), A.validatePasswordChange("old123", "abcdef", "abcdef")], ["Isi password saat ini.", "Password baru harus berbeda dari password saat ini.", null]);

// ---- /auth/callback -----------------------------------------------------------------
function cbDeps(over = {}) {
  const calls = [];
  return {
    calls,
    deps: {
      exchangeCode: async (c) => { calls.push("exchange:" + c); return over.exchange ?? true; },
      verifyRecoveryOtp: async (t) => { calls.push("otp:" + t); return over.otp ?? true; },
      markRecovery: async () => { calls.push("mark"); },
      ...(over.throwOn ? { [over.throwOn]: async () => { throw new Error("boom"); } } : {}),
    },
  };
}
{
  const { deps, calls } = cbDeps();
  const r = await P.resolveCallback({ code: "C1", next: "/reset-password" }, deps);
  check("code link: exchanged, marked as recovery, sent to /reset-password", [r, calls], ["/reset-password", ["exchange:C1", "mark"]]);
}
{
  const { deps, calls } = cbDeps({ exchange: false });
  const r = await P.resolveCallback({ code: "BAD", next: "/reset-password" }, deps);
  check("bad/expired code: sent to the 'minta link baru' page, NOT marked", [r, calls.includes("mark")], ["/lupa-password?error=link", false]);
}
{
  const { deps, calls } = cbDeps();
  const r = await P.resolveCallback({ code: "C2" }, deps);
  check("code without next: signed in but NOT marked as recovery, goes to /", [r, calls.includes("mark")], ["/", false]);
}
{
  const { deps, calls } = cbDeps();
  const r = await P.resolveCallback({ code: "C3", next: "//evil.com" }, deps);
  check("code with an evil next: ignored, goes to /", [r, calls.includes("mark")], ["/", false]);
}
{
  const { deps, calls } = cbDeps();
  const r = await P.resolveCallback({ tokenHash: "T1", type: "recovery" }, deps);
  check("token_hash recovery link (works across devices): verified, marked, /reset-password", [r, calls], ["/reset-password", ["otp:T1", "mark"]]);
}
{
  const { deps, calls } = cbDeps();
  const r = await P.resolveCallback({ tokenHash: "T2", type: "signup" }, deps);
  check("token_hash with another type is refused untouched", [r, calls], ["/lupa-password?error=link", []]);
}
{
  const { deps } = cbDeps({ otp: false });
  const r = await P.resolveCallback({ tokenHash: "T3", type: "recovery" }, deps);
  check("expired token_hash: sent to the 'minta link baru' page", r, "/lupa-password?error=link");
}
{
  const { deps } = cbDeps();
  check("no code and no token: error page", await P.resolveCallback({}, deps), "/lupa-password?error=link");
}
{
  const { deps } = cbDeps({ throwOn: "exchangeCode" });
  check("an exception inside Supabase never escapes: error page", await P.resolveCallback({ code: "X", next: "/reset-password" }, deps), "/lupa-password?error=link");
}

// ---- reset-password flow -----------------------------------------------------------------
function rDeps(over = {}) {
  const calls = [];
  const d = {
    hasRecoveryCookie: () => { calls.push("cookie?"); return over.cookie ?? true; },
    getUserId: async () => { calls.push("user?"); return "user" in over ? over.user : "u1"; },
    updatePassword: async (pw) => { calls.push("update:" + pw); return over.updateError ?? null; },
    clearRecoveryCookie: () => calls.push("clear"),
    signOutOtherSessions: async () => { calls.push("signout-others"); if (over.signOutThrows) throw new Error("x"); },
  };
  return { deps: d, calls };
}
const IN = { password: "baru1234", confirm: "baru1234" };
{
  const { deps, calls } = rDeps();
  const r = await P.resetPasswordFlow(deps, IN);
  check("reset succeeds and runs update -> clear cookie -> sign out others", [r.ok, calls], [true, ["cookie?", "user?", "update:baru1234", "clear", "signout-others"]]);
}
{
  const { deps, calls } = rDeps();
  const r = await P.resetPasswordFlow(deps, { password: "abc", confirm: "abc" });
  check("too-short password is rejected before anything else is checked", [r.ok, calls], [false, []]);
}
{
  const { deps, calls } = rDeps();
  const r = await P.resetPasswordFlow(deps, { password: "baru1234", confirm: "lain1234" });
  check("mismatch is rejected before anything else", [r.ok, calls], [false, []]);
}
{
  const { deps, calls } = rDeps({ cookie: false });
  const r = await P.resetPasswordFlow(deps, IN);
  check("an ordinary session without the recovery cookie CANNOT change the password this way", [r.ok, /kedaluwarsa/.test(r.message), calls.some((c) => c.startsWith("update"))], [false, true, false]);
}
{
  const { deps, calls } = rDeps({ user: null });
  const r = await P.resetPasswordFlow(deps, IN);
  check("no signed-in user: refused, no update", [r.ok, calls.some((c) => c.startsWith("update"))], [false, false]);
}
{
  const { deps, calls } = rDeps({ updateError: { code: "same_password", message: "x" } });
  const r = await P.resetPasswordFlow(deps, IN);
  check("update error is shown in Indonesian and the cookie is KEPT so the learner can retry", [r, calls.includes("clear")], [{ ok: false, message: "Password baru harus berbeda dari password lama." }, false]);
}
{
  const { deps } = rDeps({ signOutThrows: true });
  check("failing to sign out other devices does not fail the reset", (await P.resetPasswordFlow(deps, IN)).ok, true);
}

// ---- static guards over the source ----------------------------------------------------------
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
function walk(dir) {
  return fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap((e) => {
    const rel = path.join(dir, e.name);
    return e.isDirectory() ? walk(rel) : [rel];
  });
}
const tsx = [...walk("app"), ...walk("components")].filter((f) => f.endsWith(".tsx"));
const rawPassword = tsx.filter((f) => /type=\"password\"/.test(read(f)) && !f.endsWith("PasswordInput.tsx"));
check("no password field bypasses the show/hide PasswordInput", rawPassword, []);
const usesPI = ["app/login/page.tsx", "app/register/page.tsx", "components/account/PasswordForm.tsx", "components/account/DeleteAccountForm.tsx", "components/auth/ResetPasswordForm.tsx"].map((f) => /<PasswordInput/.test(read(f)));
check("login, register, change-password, delete and reset all use PasswordInput", usesPI, [true, true, true, true, true]);
check("PasswordInput is hidden by default", /useState\(false\)/.test(read("components/ui/PasswordInput.tsx")), true);
const needClient = tsx.filter((f) => /from "react"/.test(read(f)) && /\buse(State|Effect|Ref|Memo|Callback)\b/.test(read(f)) && !/^\s*["']use client["']/.test(read(f)));
check("every file that uses React hooks starts with \"use client\"", needClient, []);
check("Keluar is no longer in the header", !/SignOutButton/.test(read("components/site/Header.tsx")), true);
check("Keluar is on the account page", /<SignOutButton/.test(read("app/akun/page.tsx")), true);
check("the login page links to lupa password", /href="\/lupa-password"/.test(read("app/login/page.tsx")), true);
check("the account password form and delete form link to lupa password", [/href="\/lupa-password"/.test(read("components/account/PasswordForm.tsx")), /href="\/lupa-password"/.test(read("components/account/DeleteAccountForm.tsx"))], [true, true]);
check("/reset-password and /lupa-password are NOT behind the login-only middleware", !/reset-password|lupa-password/.test(read("middleware.ts")), true);
check("the callback route exists", fs.existsSync(path.join(root, "app/auth/callback/route.ts")), true);

console.log(`\n${count - failures}/${count} password-reset test-cases behaved as expected.`);
process.exit(failures ? 1 : 0);
