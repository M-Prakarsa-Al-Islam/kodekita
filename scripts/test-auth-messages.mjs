// Tests for the new-learner sign-up experience: the Indonesian error messages, the resend pause,
// and the wiring that cannot be seen from a component test (the welcome notice after the email
// link, the callback parameter, no raw English errors on screen).
// Proves: the mapping table and the countdown. Cannot prove: how the screens look, or that an
// email really arrives (that depends on Supabase's email settings and the learner's mail provider).
// Run: node scripts/test-auth-messages.mjs
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const cache = new Map();
function resolveTs(rel) {
  for (const c of [`${rel}.ts`, `${rel}.tsx`, path.join(rel, "index.ts")]) if (fs.existsSync(path.join(root, c))) return c;
  throw new Error(`cannot resolve ${rel}`);
}
function loadTs(rel) {
  if (cache.has(rel)) return cache.get(rel).exports;
  const js = ts.transpileModule(fs.readFileSync(path.join(root, rel), "utf8"), { compilerOptions: { module: "CommonJS", target: "ES2020" } }).outputText;
  const mod = { exports: {} };
  cache.set(rel, mod);
  const req = (id) => (id.startsWith("@/") ? loadTs(resolveTs(id.slice(2))) : id.startsWith(".") ? loadTs(resolveTs(path.join(path.dirname(rel), id))) : require(id));
  new Function("require", "module", "exports", js)(req, mod, mod.exports);
  return mod.exports;
}
let failures = 0, count = 0;
function check(name, actual, expected) {
  count++;
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"} - ${name}${ok ? "" : `\n      got:      ${JSON.stringify(actual)}\n      expected: ${JSON.stringify(expected)}`}`);
}
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
const { describeAuthError: d, cooldownLeft } = loadTs("lib/auth-messages.ts");
const { RESEND_COOLDOWN_SECONDS } = loadTs("lib/password-reset.ts");
const kind = (e) => d(e)?.kind;

// ---------- the error table ----------
check("no error -> nothing to show", d(null), null);
check("unconfirmed email, by code and by message", [kind({ code: "email_not_confirmed" }), kind({ message: "Email not confirmed" })], ["unconfirmed", "unconfirmed"]);
check("wrong credentials, by code and by message", [kind({ code: "invalid_credentials" }), kind({ message: "Invalid login credentials" })], ["credentials", "credentials"]);
check("an already registered email, by code and by message", [kind({ code: "user_already_exists" }), kind({ code: "email_exists" }), kind({ message: "User already registered" })], ["exists", "exists", "exists"]);
check("a weak or short password", [kind({ code: "weak_password" }), kind({ message: "Password should be at least 6 characters." }), kind({ message: "Password is known to be weak and easy to guess" })], ["weak_password", "weak_password", "weak_password"]);
check("rate limits (status 429, codes, and the 'only request this after N seconds' text)", [kind({ status: 429 }), kind({ code: "over_email_send_rate_limit" }), kind({ code: "over_request_rate_limit" }), kind({ message: "For security purposes, you can only request this after 45 seconds." }), kind({ message: "email rate limit exceeded" })], ["rate_limit", "rate_limit", "rate_limit", "rate_limit", "rate_limit"]);
check("an invalid email address", [kind({ code: "email_address_invalid" }), kind({ message: 'Email address "a@b" is invalid' })], ["bad_email", "bad_email"]);
check("a network problem", [kind({ name: "AuthRetryableFetchError", message: "x" }), kind({ message: "Failed to fetch" })], ["network", "network"]);
check("anything else keeps the original text in brackets for support, and never prints 'undefined'", [d({ message: "Something odd" }).message, d({}).message.includes("undefined"), d({}).message.includes("(")], ["Terjadi kesalahan. Coba lagi sebentar lagi. (Something odd)", false, false]);
const samples = [{ code: "email_not_confirmed" }, { code: "invalid_credentials" }, { code: "user_already_exists" }, { code: "weak_password" }, { status: 429 }, { code: "email_address_invalid" }, { message: "Failed to fetch" }];
check("every known problem is explained in Indonesian, with no raw English left", samples.map((e) => /Invalid|not confirmed|already registered|rate limit|Failed to fetch/i.test(d(e).message)), samples.map(() => false));
check("an unconfirmed email tells the learner what to DO (open the PyMula email and click the link)", /email dari PyMula/.test(d({ code: "email_not_confirmed" }).message) && /klik tautan/.test(d({ code: "email_not_confirmed" }).message), true);
check("wrong credentials also points a new learner at the confirmation email", /sudah mengklik tautan di email konfirmasi/.test(d({ code: "invalid_credentials" }).message), true);

// ---------- the pause before 'send again' ----------
check("the pause is 60 seconds", RESEND_COOLDOWN_SECONDS, 60);
check("cooldownLeft counts down and stops at 0", [cooldownLeft(0, 0), cooldownLeft(0, 1000), cooldownLeft(0, 59000), cooldownLeft(0, 59001), cooldownLeft(0, 60000), cooldownLeft(0, 90000)], [60, 59, 1, 1, 0, 0]);
check("a clock sampled slightly BEFORE the send never shows more than the full pause", [cooldownLeft(5000, 4500), cooldownLeft(5000, 0)], [60, 60]);
check("a custom pause works", [cooldownLeft(0, 0, 5), cooldownLeft(0, 5000, 5)], [5, 0]);

// ---------- wiring ----------
const forms = ["components/auth/RegisterForm.tsx", "components/auth/LoginForm.tsx", "components/auth/ResendConfirmation.tsx"];
// A raw Supabase error object is named signUpError / signInError / error in these files; its text is English.
// (problem?.message is fine: that is the translated text from describeAuthError.)
check("no sign-up/sign-in screen reads the raw Supabase error text", forms.filter((f) => /\b(signUpError|signInError|error)\??\.message\b/.test(read(f))), []);
check("they all go through describeAuthError", forms.every((f) => /describeAuthError\(/.test(read(f))), true);
check("both screens that send a confirmation email use the allowed callback redirect, and the same pause", [forms[0], forms[2]].every((f) => /buildSignupRedirect\(window\.location\.origin\)/.test(read(f))), true);
check("registering shows the 'check your email' page instead of redirecting to the login form", /<CheckEmailNotice/.test(read("components/auth/RegisterForm.tsx")) && !/\/login\?registered/.test(read("components/auth/RegisterForm.tsx")), true);
check("the callback route passes Supabase's ?error= on", /error: url\.searchParams\.get\("error"\)/.test(read("app/auth/callback/route.ts")), true);
check("the signed-in home shows a welcome notice only when asked to, and the page passes the flag from the URL", [/justConfirmed/.test(read("components/home/DashboardHome.tsx")), /role="status"/.test(read("components/home/DashboardHome.tsx")), /justConfirmed=\{searchParams\?\.confirmed === "1"\}/.test(read("app/page.tsx"))], [true, true, true]);
check("the home page canonical link does not depend on the ?confirmed parameter", /canonical: "\/"/.test(read("app/layout.tsx") + read("app/page.tsx")), true);

console.log(`\n${count - failures}/${count} auth-message checks passed.`);
if (failures) { console.log(`${failures} FAILED`); process.exit(1); }
console.log("All auth-message checks passed.");
