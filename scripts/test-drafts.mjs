// Tests for lib/code-drafts.ts (remembering the learner's code in localStorage).
// Run: node scripts/test-drafts.mjs
// Uses a fake storage, so it proves the logic, not a real browser's storage.
import { createRequire } from "node:module";
import fs from "node:fs";
import ts from "typescript";

const require = createRequire(import.meta.url);
const src = fs.readFileSync(new URL("../lib/code-drafts.ts", import.meta.url), "utf8");
const js = ts.transpileModule(src, { compilerOptions: { module: "CommonJS", target: "ES2020" } }).outputText;
const mod = { exports: {} };
new Function("require", "module", "exports", js)(require, mod, mod.exports);
const D = mod.exports;

class FakeStorage {
  constructor() { this.map = new Map(); this.failSet = false; this.failGet = false; this.failRemove = false; }
  get length() { return this.map.size; }
  key(i) { return [...this.map.keys()][i] ?? null; }
  getItem(k) { if (this.failGet) throw new Error("blocked"); return this.map.has(k) ? this.map.get(k) : null; }
  setItem(k, v) { if (this.failSet) throw new DOMException("quota", "QuotaExceededError"); this.map.set(k, String(v)); }
  removeItem(k) { if (this.failRemove) throw new Error("blocked"); this.map.delete(k); }
}

let failures = 0, count = 0;
function check(name, actual, expected) {
  count++;
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"} - ${name}${ok ? "" : `\n      expected ${JSON.stringify(expected)}\n      got      ${JSON.stringify(actual)}`}`);
}

const S = 'print("halo")\n';
const key = D.draftKey("user-A", "9-list", "L3");

check("key includes prefix, user, chapter and lesson", key, "pymula:draft:v1:user-A:9-list:L3");
check("two users get different keys for the same lesson", D.draftKey("user-A", "c", "L1") !== D.draftKey("user-B", "c", "L1"), true);

// --- save / load ---
{
  const st = new FakeStorage();
  check("save returns 'saved' for edited code", D.saveDraft(st, key, S + "x = 1\n", S, 1000), "saved");
  check("load round-trips code, starter and time", D.loadDraft(st, key), { code: S + "x = 1\n", starter: S, savedAt: 1000 });
  check("a second save overwrites (one entry, not history)", (D.saveDraft(st, key, S + "x = 2\n", S, 2000), st.length), 1);
  check("...and holds the newest code", D.loadDraft(st, key).code, S + "x = 2\n");
  check("code equal to the starter removes the draft", [D.saveDraft(st, key, S, S), D.loadDraft(st, key)], ["removed", null]);
}
{
  const st = new FakeStorage();
  D.saveDraft(st, key, "keep", S);
  const huge = "a".repeat(D.MAX_DRAFT_CHARS + 1);
  check("oversized code is skipped", D.saveDraft(st, key, huge, S), "skipped");
  check("...and the previous draft is left alone", D.loadDraft(st, key).code, "keep");
  check("exactly at the limit is still saved", D.saveDraft(st, key, "a".repeat(D.MAX_DRAFT_CHARS), S), "saved");
}
{
  const st = new FakeStorage(); st.failSet = true;
  let threw = false, out;
  try { out = D.saveDraft(st, key, "x", S); } catch { threw = true; }
  check("storage full / blocked on write: no exception, reports 'failed'", [threw, out], [false, "failed"]);
  const st2 = new FakeStorage(); st2.failGet = true;
  check("storage blocked on read: loadDraft returns null, no exception", D.loadDraft(st2, key), null);
  const st3 = new FakeStorage(); st3.failRemove = true;
  check("storage blocked on remove: no exception (saveDraft 'failed')", D.saveDraft(st3, key, S, S), "failed");
}

// --- tolerant loading ---
{
  const st = new FakeStorage();
  const put = (v) => st.map.set(key, v);
  put("{not json"); check("corrupt JSON -> null", D.loadDraft(st, key), null);
  put('{"code":123,"starter":"s","savedAt":1}'); check("code of the wrong type -> null", D.loadDraft(st, key), null);
  put('{"starter":"s","savedAt":1}'); check("missing code -> null", D.loadDraft(st, key), null);
  put('{"code":"c","starter":"s"}'); check("missing savedAt -> null", D.loadDraft(st, key), null);
  put("null"); check("JSON null -> null", D.loadDraft(st, key), null);
  put('["c","s",1]'); check("JSON array -> null", D.loadDraft(st, key), null);
  put('"just a string"'); check("JSON string -> null", D.loadDraft(st, key), null);
  check("nothing stored -> null", D.loadDraft(new FakeStorage(), key), null);
}

// --- what the lesson opens with ---
{
  const draft = (code, starter) => ({ code, starter, savedAt: 1 });
  check("no draft -> starter, not restored", D.resolveInitialCode(null, S), { code: S, restored: false });
  check("learner's edited code is restored", D.resolveInitialCode(draft("mine", S), S), { code: "mine", restored: true });
  check("draft identical to the starter -> not 'restored'", D.resolveInitialCode(draft(S, S), S), { code: S, restored: false });
  check("author changed the starter, learner never edited -> NEW starter", D.resolveInitialCode(draft("old", "old"), "new"), { code: "new", restored: false });
  check("author changed the starter, learner HAD edited -> learner's code kept", D.resolveInitialCode(draft("mine", "old"), "new"), { code: "mine", restored: true });
}

// --- clearing on sign-out ---
{
  const st = new FakeStorage();
  D.saveDraft(st, D.draftKey("user-A", "c1", "L1"), "a", S);
  D.saveDraft(st, D.draftKey("user-A", "c2", "L4"), "b", S);
  D.saveDraft(st, D.draftKey("user-B", "c1", "L1"), "c", S);
  st.setItem("sb-abc-auth-token", "secret");
  st.setItem("pymula:other", "x");
  st.setItem("theme", "dark");
  check("clearAllDrafts reports how many drafts it removed", D.clearAllDrafts(st), 3);
  check("...and leaves every unrelated key untouched", [...st.map.keys()].sort(), ["pymula:other", "sb-abc-auth-token", "theme"]);
  check("clearAllDrafts on an empty storage is 0", D.clearAllDrafts(new FakeStorage()), 0);
  const bad = new FakeStorage(); bad.failRemove = true; D.saveDraft(bad, key, "x", S); bad.failRemove = true;
  check("clearAllDrafts with a blocked storage does not throw", (() => { try { D.clearAllDrafts(bad); return "ok"; } catch { return "threw"; } })(), "ok");
}

// --- two people, one computer ---
{
  const st = new FakeStorage();
  D.saveDraft(st, D.draftKey("user-A", "c", "L1"), "A's code", S);
  check("user B opening the same lesson does not see A's code", D.loadDraft(st, D.draftKey("user-B", "c", "L1")), null);
}

check("getBrowserStorage is null on the server (no window)", D.getBrowserStorage(), null);

console.log(`\n${count - failures}/${count} draft test-cases behaved as expected.`);
process.exit(failures ? 1 : 0);
