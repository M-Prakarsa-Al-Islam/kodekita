# PyMula — Progress Log

Upload this file (plus the repo, plus `master_builder_prompt.md`, plus
`PROJECT_DESIGN.md` for any project-course or Phase 5 work) at the
start of a new chat and say "continue PyMula from Phase X" — or, for a
content-only session, "write chapters N-M" — to resume.

To hand me new chapter content, use the format in
`content/AUTHORING_TEMPLATE.md` — paste it in chat or upload as a file.

## Key decisions so far

- **Stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + Supabase
  (auth + Postgres). Deploy target: Vercel. Pinned to `next@14.2.35` (patched
  against the Dec 2025 Next.js DoS advisory - don't downgrade below 14.2.34).
- **Code execution:** Pyodide, client-side, in-browser (`lib/pyodide.ts`).
  NOT a server-side sandbox. (Piston's public API stopped being free as of
  Feb 2026; self-hosting a sandbox was judged unnecessary complexity for a
  Python-only course.)
- **Content structure: chapters contain lessons.** Each chapter (e.g.
  "Pengenalan") has 2+ lessons (L1, L2, ...), each with its own title. A
  lesson = Theory (short explanation + optional example) -> Practice, where
  Practice is either a `quiz` (multiple choice) or `code` (Pyodide + a
  deterministic checker). No separate standalone "Try" step anymore - it
  was folded into the theory example / practice.
- **Content model:** chapter/lesson text lives as code in
  `content/chapters/*.ts`, NOT in the database. The database only tracks
  which *lessons* a user has completed (`lesson_progress` table, replaced
  the earlier chapter-level `chapter_progress` in schema_phase2b.sql) and,
  from Phase 4, purchases.
- **Auto-grading rule (important for every future lesson):** every `code`
  practice must be **deterministic** (fixed starter values, one correct
  output, checked via `lib/checker.ts` `stdout_exact`). Every `quiz` needs
  exactly one correct option. Open-ended prompts can't be auto-graded.
- **Access model:**
  - `/` (homepage) is now auth-aware: logged-out visitors see the
    marketing homepage with a *gated* preview of the 5 free chapter
    titles (locked, "masuk untuk mencoba"); logged-in visitors see a
    dashboard (progress summary + "continue where you left off").
    `/dashboard` still exists as a redirect to `/` for old links.
  - `/kursus/python-dasar` (the chapter LIST) is public - anyone can see
    what's there. Clicking into an actual chapter/lesson
    (`/kursus/python-dasar/<slug>/...`) requires login - enforced in
    `middleware.ts`, with `?next=` redirect-back after login.
  - Free vs. paid (chapters 1-5 vs 6-13) is a separate axis from
    logged-in-or-not: right now, once logged in, paid chapters are still
    viewable with a "will lock after payment" badge - Phase 4 will add
    the real purchase gate.
- **Pricing:** Python Dasar Rp25.000 (cap: <=Rp30.000). Free: ch1-5. Paid:
  ch6-13. Project courses cheaper, e.g. Rp10.000.
- **Payment:** manual QRIS, admin-verified. No payment gateway integration.
  Proof is an uploaded screenshot (not WhatsApp-only) so there's a real
  `purchases` row to gate on - a WhatsApp link is shown as a fallback
  next to the pending-status screen, not the primary channel.
- **Design tokens:** paper `#F3F5F5`, ink `#171B24`, sun (CTA) `#F2A93B`,
  code/success `#0F8A6B`. Fonts: Fraunces (display), Inter (body), JetBrains
  Mono (code).

- **Product name: PyMula** (renamed from KodeKita on 2026-10-18; all code, docs
  and SQL comments updated). Things that may still say "KodeKita" and are
  *not* in this repo: the GitHub repository URL/name, the Vercel project and
  its domain, the Supabase project name, and the owner's copy of
  `master_builder_prompt.md` (a renamed copy was provided in chat). No
  storage keys, bucket names or env vars used the old name, so no user data
  was affected. The old tagline in `app/layout.tsx` ("Belajar Coding. Praktik.
  Bangun Sesuatu.") was kept - revisit it, since "PyMula" suggests Python.
- **Brand wordmark (2026-10-19):** "Py" in `#29235c` and "Mula" in `#f2ad3d`
  (Tailwind tokens `brand-py` / `brand-mula`, component `components/site/Logo.tsx`,
  used in the header on every page). The amber is only 1.8:1 against the light
  page background; WCAG exempts logotypes and it is large and semibold, but
  don't use it for small text on a light background. The footer still writes
  "PyMula" as plain text inside a sentence.
- **Hosting constraints (checked 2026-10-16):** Vercel Hobby is
  personal/non-commercial only, so PyMula must move to Vercel Pro ($20/mo)
  or another host **before accepting real payments** (owner is aware).
  Supabase Free pauses a project after 7 days idle - owner pings it
  manually for now (scheduled ping or Pro $25/mo later). Supabase Free:
  500 MB DB, 5 GB egress, 50k MAU, API requests not capped. Pyodide loads
  from jsDelivr, so it doesn't use Vercel bandwidth. Numbers come from
  third-party summaries of vendor docs - re-verify before launch.
- **Project courses (decided 2026-10-16, full detail in
  `PROJECT_DESIGN.md`):** hybrid - learners code in the browser (story ->
  instructions -> code -> check), then "take it home". A cumulative
  two-file workspace (`main.py` + `fungsi.py`, tab bar, files fixed by the
  project) where each lesson starts from the learner's saved code. One
  `project_progress` row per user per project, **UPDATE not INSERT**, no
  history; localStorage is the typing-time draft cache, Supabase is written
  only on pass / "Lanjut". Checks use **behavioral tests** (hidden test
  script calling the learner's functions) for function lessons,
  `stdout_exact` for print-only lessons. Spoiler shows the full solution
  read-only with a Copy button (never overwrites the learner's code); **no
  "Lewati" button in the MVP**. `help_used` (spoiler opened per lesson) is
  owner analytics. The zip (`main.py`, `fungsi.py`, README, sample article)
  is generated in the browser; chapter 8 guides running locally and
  uploading to GitHub. Must work on desktop and mobile. Python Dasar does
  not teach file I/O, `import` or `input()`, so the project teaches them.
  Word Counter is a small beginner project - market it as "your first
  complete Python program", not "portfolio-ready".

## Phase status (code / infrastructure)

- [x] **Phase 1 - Foundation.** Scaffold, design system, landing page,
      header/footer, auth (register/login/logout via Supabase),
      `profiles` table + signup trigger.
- [x] **Phase 2 - Course system + lesson infra.** Lesson-based content
      model (`content/types.ts`), course catalog (`/kursus`), Python
      Dasar chapter list with free/paid + published/todo + per-chapter
      progress badges, chapter route that redirects into the first
      incomplete lesson, lesson reader page
      (`/kursus/python-dasar/[slug]/[lessonId]`) rendering
      Theory -> Practice, Pyodide-based `CodeRunner`/`Challenge` (code
      practice) and `QuizRunner` (quiz practice), `checker.ts` (tested -
      `scripts/test-checker.mjs`, 18/18 passing, output + quiz logic),
      `lesson_progress` table, auth-aware `Header` and homepage
      (`MarketingHome` vs `DashboardHome`), login/chapter-list gating via
      `middleware.ts`.
      **Chapter content itself is tracked separately below.**
- [ ] Phase 3 - effectively absorbed into Phase 2 (Pyodide runner + both
      checker types already exist and are proven on chapters 1-2). Only
      polish left here (e.g. a "reset code" button), otherwise treat
      remaining chapters as content sessions.
- [x] **Phase 4 - Commerce.** `purchases` table + `profiles.is_admin`
      flag + private `payment-proofs` storage bucket
      (`supabase/schema_phase4.sql`, includes Data API grants per the
      Oct 2026 Supabase policy - see the note under "Key decisions"
      below). Purchase flow: `/kursus/python-dasar/beli` shows a
      placeholder QRIS + upload form
      (`components/purchase/PurchaseForm.tsx`), client-side compresses
      the screenshot (`lib/image-compress.ts` - downscale to 1600px,
      re-encode JPEG q0.7) before uploading to the user's own storage
      folder and inserting a `pending` row (`lib/purchase.ts`). Page
      shows pending/approved/rejected state
      (`lib/purchase-server.ts`). Admin review at `/admin/purchases`
      (404s for non-admins, gated by `profiles.is_admin`) lists pending
      purchases with a signed proof-image URL; Approve/Reject are
      server actions (`app/admin/purchases/actions.ts`) that update via
      the admin's own authenticated session - RLS's `is_admin()` check
      is the real enforcement, not the page-level check. **Real
      server-side gating added** to the chapter entry page and lesson
      page (previously just a decorative "will lock" badge) - a
      logged-in non-purchaser hitting a paid chapter/lesson URL
      directly now redirects to `/beli`, not just UI-hidden.
      `npx tsc --noEmit`, `npm run build`, and
      `node scripts/test-checker.mjs` (18/18) all pass.
- [ ] **Phase 5-pre - Platform improvements before projects** (owner-driven,
      details given per session; context in `PROJECT_DESIGN.md` section 11):
      - [x] Editor rework (code done 2026-10-16, **needs manual device test**):
            CodeMirror 6, lazy-loaded (~131 KB gzip, only on code lessons).
            Tab inserts 4-column-stop spaces AT THE CURSOR (selected lines are
            indented), Shift+Tab dedents, Python auto-indent, Backspace over
            indentation, line numbers, highlighting, **no line wrapping
            (long lines scroll horizontally)**,
            mobile-safe attributes, Indent/Outdent buttons on touch devices,
            Esc-then-Tab focus escape (CodeMirror built-in). Reusable
            `components/learn/CodeEditor.tsx` (+ `readOnly`) for the project
            workspace; config in `lib/editor-extensions.ts`; tests in
            `scripts/test-editor.mjs` (33/33). Checklist:
            `PROJECT_DESIGN.md` section 11. Learner's code is now remembered
            and there is a "Reset kode" button (2026-10-19, below). Still open:
            spoiler display as read-only `CodeEditor`.
      - [x] Progress UI (done 2026-10-18, **needs a visual check in a browser**):
            progress bars + per-lesson indicators; see the session log. Still
            open: lock icons for paid chapters in the lesson nav, progress in the
            header course menu.
      - [x] Lesson typography (done 2026-10-19, **needs a visual check in a
            browser**): see the session log and `PROJECT_DESIGN.md` section 11.
      - [ ] Account / settings page (master prompt page #13): view account,
            rename, change password, delete account. Deletion needs the Supabase
            service-role key **server-side only** (server action, env var without
            `NEXT_PUBLIC_`) and cleanup of `payment-proofs` objects; **decision
            needed** on what happens to `purchases` (financial records) when an
            account is deleted; verify FK behavior of `lesson_progress` /
            `purchases` first.
- [ ] **Phase 5 - Project courses** (starting with "Build a Word Counter"; design
      in `PROJECT_DESIGN.md`). Build order:
      1. Runner: multi-file virtual FS, module-cache reset + file reset before
         every run, seed files, scripted `input()` + input box, `behavior_tests`
         harness. **Stop and report after this step.**
      2. Project route + workspace: generalize routes hard-coded to
         `python-dasar`, tab bar, localStorage drafts, `project_progress` table +
         upsert, spoiler + Copy, `help_used`, project catalog/detail pages,
         purchase gate.
      3. Content: Word Counter chapters + take-home chapter; extend
         `content/AUTHORING_TEMPLATE.md` for projects.
      4. Later: Web Worker timeout, file upload, public share page, "Lewati".
- [ ] Phase 6 - Polish & launch

## Chapter content status (Python Dasar, 13 chapters)

Check this first before writing new content.

| # | Slug | Title | Free? | Lessons | Status |
|---|------|-------|-------|---------|--------|
| 1 | `1-pengenalan` | Pengenalan Python | Yes | L1-L5 (code x5: run-first, print, angka, multi-print, tantangan) | **Published** (revised) |
| 2 | `2-variabel` | Variabel dan Tipe Data | Yes | L1-L8 (quiz x2, code x6: buat/print, komentar, tipe data, concat, f-string, tantangan) | **Published** (revised) |
| 3 | `3-fungsi` | Fungsi | Yes | L1-L7 (quiz x3, code x4: call-a-function, return+params, main(), tantangan) | **Published** |
| 4 | `4-scope` | Ruang Lingkup Variabel (Scope) | Yes | L1-L5 (quiz x2, code x3: local scope fix, global scope, tantangan) | **Published** |
| 5 | `5-testing-debugging` | Testing dan Debugging | Yes | L1-L7 (quiz x3, code x4: fix syntax error, fix logic error, print debugging, multi-bug tantangan) | **Published** |
| 6 | `6-computing` | Komputasi dan Logika Mesin | No | L1-L8 (quiz x2, code x6: pangkat/floor-div, modulo, PEMDAS fix, assignment operators, boolean/not, tantangan kasir) | **Published** |
| 7 | `7-perbandingan` | Perbandingan | No | L1-L8 (quiz x2, code x6: ==/!= type-sensitivity, relational ops, chained comparison, if, if-else, if-elif-else tantangan) | **Published** |
| 8 | `8-loop` | Loop | No | L1-L7 (quiz x2, code x5: for+range accumulator, while, break, continue, savings tantangan) | **Published** |
| 9 | `9-list` | List | No | L1-L15 (quiz x3, code x12: indexing, len, negative index+slicing, mutate/append, concat, del, in/not in quiz, .index, for loop quiz, range(len), even filter, max via -inf, tuple quiz, split/join, ERROR-filter tantangan) | **Published** |
| 10 | `10-dictionary` | Dictionary | No | L1-L9 (quiz x2, code x7: key access, mutate/add, duplicate-key quiz, empty dict, `in`/`del` quiz, basic iteration, `.values()` accumulator, nested dict, nested-dict recap tantangan) | **Published** |
| 11 | `11-set` | Set | No | L1-L7 (quiz x2, code x5: uniqueness quiz, `.add()`/`.remove()` + `sorted()`, intersection `&`, union `\|`, difference quiz, list->set dedupe with `len()`, seminar-attendance tantangan) | **Published** |
| 12 | `12-error` | Error dan Exception Handling | No | L1-L7 (quiz x2, code x5: bug-vs-exception quiz, `try`/`except`, specific `except` types, `raise`, guard-clauses quiz, `finally`, ATM-withdrawal tantangan) | **Published** |
| 13 | `13-type-hints` | Type Hints | No | L1-L6 (quiz x2, code x4: variable hints quiz, function hints, `list[str]`/`dict` hints, union `\|` quiz, fix a wrong return hint, nested-grouping tantangan) | **Published** |

**2026-09-22 revision:** Chapters 1-2 were rewritten from scratch using
`content/AUTHORING_TEMPLATE.md` (author-provided `.md` files), replacing
the earlier 2-lesson versions. Chapter 1 grew 2 -> 5 lessons (all `code`
practice - it's the very first chapter, so quizzes were dropped in favor
of more hands-on `print()` reps) and chapter titles changed slightly
("Pengenalan" -> "Pengenalan Python", "Variabel" -> "Variabel dan Tipe
Data"). Chapter 2 grew 2 -> 8 lessons, now covering naming rules,
comments, int/float/bool, string concatenation, and f-strings, ending
in a multi-step "Tantangan" lesson. Every `code` practice's expected
output was re-verified against real Python (`python3 verify.py`, all
11 passed) and both quizzes (ch2 L1, ch2 L3) confirmed to have exactly
one correct option. `npx tsc --noEmit` and `npm run build` both pass.
No hardcoded chapter titles/slugs exist elsewhere in the codebase, so
the title changes are safe.

**2026-09-22 bugfix:** `Latihan` (code practice) only ever had one button
("Cek Jawaban") that ran the code AND graded it in the same click -
there was no way to just test/run code without it being treated as a
submission. Fixed in `components/learn/CodeRunner.tsx` /
`Challenge.tsx`: `CodeRunner` now takes `onCheck`/`checkLabel` (renamed
from `onResult`/`runLabel`) and, when `checkLabel` is passed, renders
two buttons - "Jalankan" (secondary, run only, shows output, does not
grade) and "Cek Jawaban" (primary, run + grade, same as before). This
was a pre-existing app-code gap, not something introduced by the
chapter-1/2 content rewrite - it just became visible once Ch1 L1's
instructions explicitly said "jalankan (Run) kode di bawah ini." `Teori`
example code blocks remain static/read-only by design (per the
Theory -> Practice lesson loop) - only `Latihan` needed the split.
`npx tsc --noEmit` and `npm run build` both pass.

**2026-09-22 chapter 3 + spoiler-answer feature:** Wrote
`content/chapters/chapter-3.ts` ("Fungsi") from the author's `.md` -
7 lessons (3 quiz: def keyword, parameter-vs-argumen definition,
identify-the-argument; 4 code: call an existing function, return with
multiple parameters, `main()` entry point, a multi-function
"Tantangan"). All 4 code answers re-verified against real Python
(`verify_ch3.py`, all passed); all 3 quizzes confirmed single-correct.
Also added the `answerHint` feature requested for chapter 3 onward:
`content/types.ts` `CodePractice` now has an optional `answerHint`
field, kept separate from `hints` so the full solution can never be
stumbled into by clicking through the numbered hints. Rendered in
`Challenge.tsx` behind its own amber-flagged "⚠️ Lihat Jawaban Lengkap
(Spoiler!)" button, collapsed by default. Chapters 1-2 have no
`answerHint` (their `.md` never had a spoiler-answer field) so nothing
renders there - unaffected. `content/AUTHORING_TEMPLATE.md` updated
with an `answer (spoiler)` field for future chapters. `npx tsc --noEmit`
and `npm run build` both pass.

**2026-09-23 chapter 4 + course nav menu:** Wrote
`content/chapters/chapter-4.ts` ("Ruang Lingkup Variabel (Scope)") -
5 lessons (2 quiz: what-is-scope, shadowing; 3 code: fix a local-scope
bug, write a global variable, a global+local "Tantangan"). All 3 code
answers re-verified against real Python (`verify_ch4.py`, all passed);
both quizzes confirmed single-correct. Uses the `answerHint` spoiler
pattern from chapter 3.

Also added the requested chapter/lesson nav menu to the site header:
- `content/chapters/index.ts` gains `getNavChapters()` / `NavChapter` -
  a trimmed {slug, order, title, isFree, status, lessons:{id,title}}
  view of `chapters`, deliberately stripped of theory/practice/
  starterCode/hints/answerHint.
- `components/site/CourseNavMenu.tsx` (new, client component) - a
  dropdown in the header. Only renders on an actual lesson page
  (`/kursus/python-dasar/[slug]/[lessonId]`, detected via
  `usePathname()`, since the header lives in the root layout and gets
  no page params). Lists every chapter with its lessons always
  visible (no accordion - simplest thing that satisfies "pick any
  lesson within a chapter" without an ambiguous expand/collapse
  interaction). Clicking a chapter's own row navigates to that
  chapter's first lesson; clicking a lesson navigates straight to it.
  Current chapter and current lesson are highlighted
  (`bg-sun/10` / `bg-sun/20`), auto-scrolls the current lesson into
  view on open, closes on outside-click/Escape/selection. Todo
  chapters show as disabled "Segera hadir" rows, matching the existing
  `/kursus/python-dasar` list page convention.
- `components/site/Header.tsx` calls `getNavChapters()` (server-side)
  and passes the trimmed array as a prop into `<CourseNavMenu>`.

**Why the indirection through `getNavChapters()` matters:** the first
version of this feature had `CourseNavMenu` import the full `chapters`
array directly. Since it's a client component mounted in the global
header, that would have shipped every lesson's full content - theory,
starter code, hints, and **every `answerHint` spoiler solution and
`checker.expected` exact-match string** - into client-side JS on every
page, trivially visible via devtools/view-source. That would have
defeated both the spoiler-answer feature and the auto-grader in one
shot. Fixed by computing the trimmed nav list server-side in
`Header.tsx` (a Server Component) and passing only that down as
props - confirmed by grepping the production build's `.next/static`
output for known answer strings (e.g. `def hitung_luas(panjang,
lebar)`, `bonus_poin = 500`) and finding zero matches, while chapter
titles do appear (expected/safe - those are meant to be public). Any
future chapter's `answerHint` should stay safe by construction as long
as new client components keep importing `getNavChapters()` (or other
trimmed views) instead of the raw `chapters`/`chapter-N.ts` data.

`npx tsc --noEmit`, `npm run build`, and `node scripts/test-checker.mjs`
(18/18) all pass.

**2026-09-23 chapter 5:** Wrote `content/chapters/chapter-5.ts`
("Testing dan Debugging") - 7 lessons (3 quiz: what-is-debugging,
run-vs-check-button, avoid-write-everything-then-test-once; 4 code:
fix a SyntaxError, fix a logical/operator error, print-debugging, a
multi-bug "Tantangan"). This is the last of the 5 free chapters per
the spec - `todo.ts` already had chapters 6+ marked `isFree: false`,
confirmed still correct.

**Bug caught in the source `.md` (L6, "Print Debugging"):** the
instructions only ask the learner to *add* a `print()` - nothing about
fixing logic - but the starter code used `awal + terjual` while the
expected output (`80` for `kalkulasi_stok(100, 20)`) is only reachable
with `awal - terjual`. Verified by actually running both versions
through Python (`verify_ch5.py`): `+` gives `120`, `-` gives `80`.
Fixed by changing the starter code's operator to `-` (matches the
lesson's own semantics - remaining stock = starting stock minus sold -
and keeps the instructions accurate: add a print, nothing else to
fix). Flagged to the user in-chat; not silently buried.

All 4 code answers re-verified against real Python; all 3 quizzes
confirmed single-correct. `npx tsc --noEmit`, `npm run build`, and
`node scripts/test-checker.mjs` (18/18) all pass. Also re-confirmed
via `grep`-ing `.next/static` that none of chapter 5's `answerHint`
text or `checker.expected` strings leak into client JS (see the
2026-09-23 nav-menu entry above for why that check matters).

**2026-09-23 chapter 6 (first paid chapter):** Wrote
`content/chapters/chapter-6.ts` ("Komputasi dan Logika Mesin") - 8
lessons (2 quiz: CPU/RAM, Python-as-translator; 6 code: pangkat `**` +
floor division `//` word problem, modulo `%` clock-wrap problem, fix a
missing-parens PEMDAS bug, `+=`/`*=`/`/=` assignment-operator shortcuts,
boolean + `not` with nesting, a cashier-change "Tantangan" combining
`//` and `%`). `isFree: false` - this is the first paid chapter, matches
the master spec (chapters 1-5 free, 6-13 paid). Not listed in
`todo.ts` to begin with (only chapters 7+ were), so no removal needed
there.

All 6 code answers re-verified against real Python (`verify_ch6.py`,
all passed - including the `40.0` float-formatting and `250.0` from
`/=` cases); both quizzes confirmed single-correct. `npx tsc --noEmit`,
`npm run build`, and `node scripts/test-checker.mjs` (18/18) all pass.
Re-confirmed via `grep`-ing `.next/static` that none of chapter 6's
`answerHint` text or `checker.expected` strings leak into client JS.

**2026-09-23 chapter 7:** Wrote `content/chapters/chapter-7.ts`
("Perbandingan") - 8 lessons (2 quiz: string lexicographic ordering,
elif-vs-else; 6 code: ==/!= and int-vs-string type sensitivity,
relational operators with a strict-greater-than edge case, chained
comparison `a <= b <= c`, a basic `if`, `if-else`, and an `if-elif-else`
grading "Tantangan" that combines a percentage calculation with
branching). All 6 code answers re-verified against real Python
(`verify_ch7.py`, all passed - including the `80.0 > 80` and
`82.0 >= 85.0` boundary cases); both quizzes confirmed single-correct.
`npx tsc --noEmit`, `npm run build`, and `node scripts/test-checker.mjs`
(18/18) all pass. Re-confirmed via `grep`-ing `.next/static` that none
of chapter 7's `answerHint` text or `checker.expected` strings leak
into client JS.

**2026-09-23 chapter 8:** Wrote `content/chapters/chapter-8.ts`
("Loop") - 7 lessons (2 quiz: `range()` step/negative-step reasoning,
iterating over a string's characters; 5 code: `for` + `range` with an
accumulator, `while` with a decrementing battery, `break` on an
overheat condition, `continue` to skip a value, a savings-accumulator
"Tantangan" combining `for`/`range`/`def`/`return`). All 5 code answers
plus both quiz scenarios re-verified against real Python
(`verify_ch8.py`, all passed - including the `range(5, 1, -1)` step
case and the 4-character string-iteration count). `npx tsc --noEmit`,
`npm run build`, and `node scripts/test-checker.mjs` (18/18) all pass.
Re-confirmed via `grep`-ing `.next/static` that none of chapter 8's
`answerHint` text or `checker.expected` strings leak into client JS.

**2026-09-23 bugfix: quiz code snippets weren't rendering.** Chapter 8
L3's quiz question embedded a multi-line code block directly inside
the `question` string (with `\n` and leading spaces for indentation).
`QuizRunner.tsx` rendered `question` in a plain `<p>` with no
`whitespace-pre-line`, so both the newlines and the indentation
collapsed - the whole thing showed as one mashed line. Fixed properly
rather than just adding `whitespace-pre-line` (which would still have
eaten the 4-space indentation): added an optional `codeSnippet` field
to `QuizPractice` in `content/types.ts`, rendered in `QuizRunner.tsx`
as a real monospace `<pre><code>` block - the same treatment
`theory.example.code` already gets on the lesson page - kept separate
from the prose `question`. Updated chapter 8 L3 to use it. Checked
every other quiz across chapters 1-8 for the same pattern; L3 was the
only one embedding code in its question text, so no other chapter
needed migrating. `npx tsc --noEmit`, `npm run build`, and
`node scripts/test-checker.mjs` (18/18) all pass; re-confirmed no
answer/snippet leakage into `.next/static`.

**2026-10-11 chapter 9 (List):** Wrote `content/chapters/chapter-9.ts`
("List") - 15 lessons (3 quiz: `in`/`not in`, why-for-loop, why-tuple;
12 code: indexing, `len()`, negative index + slicing, `[]=`/`.append()`,
list `+`, `del`, `.index()`, `range(len())`, even filter with `%`, max via
`float("-inf")`, `.split()`/`.join()`, and an "ERROR"-filter "Tantangan").
Largest chapter so far. All 12 code answers re-verified by actually
running each `answerHint` through real Python and diffing against
`checker.expected` (all passed), each starter code confirmed NOT to pass
on its own, and all 3 quizzes confirmed single-correct. `npx tsc
--noEmit`, `npm run build`, and `node scripts/test-checker.mjs` (18/18)
all pass; grep of `.next/static` found none of the chapter's
`answerHint`/`expected` strings.

**App change: optional `Theory.sections`.** Theory is rendered as plain
text (`whitespace-pre-line`, no markdown) and `Theory` only allowed one
`example`. Chapter 9 L3 (negative indices + slicing) has ~12 code
snippets and a table, which can't be expressed that way. Added an
optional `sections?: {heading?, text?, code?}[]` to `Theory`
(`content/types.ts`), rendered in order between `explanation` and
`example` in the lesson page (`app/kursus/python-dasar/[slug]/[lessonId]/page.tsx`)
with the same dark monospace block as `example.code`. Purely additive -
chapters 1-8 don't use it and render unchanged. Use it for any future
long theory instead of putting fenced code or tables inside
`explanation`. The index/negative-index table in L3 is a monospace
block for the same reason.

**Fixes made to the source `.md` (flagged in chat):**
- L3 theory: the paragraph after the `huruf[1:5]` example said "stops
  before index 4 ("E"), result `['B','C','D']"` - contradicts the
  example directly above it (`[1:5]` = `['B','C','D','E']`, verified).
  Rewrote it to match the example.
- L3 theory: the step example's comment said "Mulai indeks 1" but the
  code was `huruf[0:5:2]`. Code and output (`['A','C','E']`) were
  already consistent with each other, so only the comment was changed
  to "Mulai indeks 0". Also fixed output spacing (`['B','C','D','E']`
  -> `['B', 'C', 'D', 'E']`, matching real Python), a stray `***`, and
  a capitalization typo.
- L6 example: output comments showed `"Truk"` and `["Mobil", "Sepeda"]`;
  real Python prints `Truk` and `['Mobil', 'Sepeda']`. Comments fixed.
- L7 quiz: the code expression was inline in the question; moved to
  `codeSnippet` (per the template's rule) so it renders as a code block.
- Markdown (`**bold**`, backticks) stripped from all text, since theory,
  instructions, hints and feedback are plain text (same as chapters 1-8).
  "SPOILER JAWABAN" hint entries moved into `answerHint`.

**2026-10-11 security fix: `LessonNav` was leaking all lesson content.**
While grepping `.next/static` after chapter 9, answer strings from
*other* chapters (e.g. ch4 `bonus_poin = 500`, ch8 `total += i`) turned
up in the lesson route's client chunk. Cause: `components/learn/LessonNav.tsx`
("use client", added with chapter 4) imported the full `chapters` array,
so every lesson page shipped every chapter's theory, `answerHint`
solutions and `checker.expected` strings - **including paid chapters** -
to any logged-in user, even one who hasn't purchased (readable via
devtools from a free lesson page). This bypassed the server-side paywall
for content, and the earlier "grep found no leaks" checks missed it
(they covered the header nav menu only). Fixed: `LessonNav` now takes a
`navChapters: NavChapter[]` prop (type-only import), computed
server-side with `getNavChapters()` in the lesson page. Lesson route
bundle went 39.2 kB -> 3.65 kB. Re-grepped `.next/static` for answer
strings from chapters 1-9: zero matches. **Rule going forward: no client
component may import `chapters` or any `chapter-N.ts`; pass
`getNavChapters()` output down as props.** Note: because the old
bundles were public, solutions for already-deployed chapters were
exposed until this fix ships - nothing to rotate (they're just lesson
answers), but worth deploying promptly.

**2026-10-12 chapter 10 (Dictionary):** Wrote `content/chapters/chapter-10.ts`
- 9 lessons (2 quiz: duplicate keys, `in` checks keys; 7 code: key
access, mutate/add, empty dict, basic iteration, `.values()`
accumulator, nested dict, and a nested-dict "Tantangan"). Every
`answerHint` was run through real Python and diffed against
`checker.expected` (all pass); each starter confirmed not to pass on
its own; every non-comment starter line was checked to also appear in
its full-program `answerHint` (new check, added because of the L2 bug
below); all theory examples run and match their `# Output:` comments.
`tsc`, `npm run build`, `test-checker.mjs` (18/18) pass; `.next/static`
grep for answer strings from chapters 1-10 found zero matches.
No app/type changes this session.

**Fixes made to the source `.md` (flagged in chat):**
- L2 spoiler answer used `"judul": "Zelda"` while the starter and the
  expected output use `"Persona"` - the solution as written would print
  `{'judul': 'Zelda', ...}` and fail its own checker. Changed to
  "Persona".
- L3 and L5 quizzes: code was inline in the question; moved to
  `codeSnippet` per the template.
- Numbered steps in instructions (L2, L8, L9) are separated with `\n`
  (instructions render with `whitespace-pre-line`; joining them with `+`
  alone produces one long paragraph - this was the ch9 L14/L15 bug).
- Markdown (`**bold**`, `*italic*`, backticks) stripped, "SPOILER
  JAWABAN" hint entries moved to `answerHint`, as in earlier chapters.

**Notes for the author (not changed):** L5 is titled "Menghapus Data dan
Cek Keanggotaan" but its only practice is the `in` quiz (nothing
practices `del`). L6's starter is a `for` whose body is only a comment,
which is a SyntaxError if run unmodified - fine for a starter (learner
must add the body), just don't be surprised by that error text.

**2026-10-13 chapter 11 (Set):** Wrote `content/chapters/chapter-11.ts`
- 7 lessons (2 quiz: duplicates ignored, `A - B`; 5 code: `.add()`/
`.remove()` with `sorted()`, `&`, `|`, `set(list)` + `len()`, and a
two-day attendance "Tantangan"). All 5 `answerHint`s run through real
Python and match `checker.expected`; starters don't pass alone; starter
lines consistent with full-program answers; all theory examples run;
numbered instruction steps are on separate lines. `tsc`,
`npm run build`, `test-checker.mjs` (18/18) pass; `.next/static` grep for
answer strings from chapters 1-11: zero matches. No app/type changes.
Every code lesson prints through `sorted()` (or `len()`), so output is
deterministic - set print order is not, which is why the author's
`sorted()` rule matters for the exact-match checker.

**Fixes made to the source `.md` (flagged in chat):**
- L2 instructions said "Lakukan dua hal" but list three steps; changed
  to "tiga hal ... secara berurutan".
- L5 quiz: the code was inline in the question text; moved to
  `codeSnippet` (also split into 3 lines so `kurang` is defined), and
  the question wording adjusted to refer to "kode di bawah ini".
- L1 theory: "Set ini sama seperti list, Bedanya" -> two sentences. L4
  theory: added the missing period after the `|` sentence.
- Markdown stripped, spoiler hints moved to `answerHint`, numbered
  steps on separate lines (same conventions as ch9/ch10).

**Note for the author (not changed):** L1 says sets are created with
`{}`, but ch10 L4 teaches that `{}` is an *empty dictionary*. An empty
set must be written `set()`. Nothing in ch11 breaks on this, but a
learner may try `x = {}` and get a dict. Worth one sentence in L1 or L6.

**2026-10-13 chapter 12 (Error dan Exception Handling):** Wrote
`content/chapters/chapter-12.ts` - 7 lessons (2 quiz: bug vs exception,
why guard clauses; 5 code: `try`/`except`, multiple specific `except`,
`raise ValueError` inside a function, `finally`, and an ATM-withdrawal
"Tantangan" combining `for` + guard clauses + `try`/`except ... as e`).
All 5 `answerHint`s run through real Python and match
`checker.expected`; starters don't pass alone (L2-L4 starters raise an
uncaught error if run unmodified - expected, the learner adds the
`try`); starter lines consistent with full-program answers; the two
theory examples that intentionally raise (L1 `10 / 0`, L4 `raise
ValueError`) confirmed to raise exactly the error their text names, all
other examples run. `tsc`, `npm run build`, `test-checker.mjs` (18/18)
pass; `.next/static` grep for answer strings from chapters 1-12: zero
matches. No app/type changes.

**Chapter title changed:** the chapter title is now "Error dan Exception
Handling" (from the author's `.md`); `todo.ts` and the status table
previously said just "Error". The slug stays `12-error` so URLs and
existing progress rows are unaffected. Title is not hardcoded anywhere
else (grepped `app/`, `components/`, `lib/`).

**Conversions (flagged in chat):** markdown stripped, spoiler hints moved
to `answerHint`, numbered steps on separate lines (L3 and L7 - L7's two
`-` sub-bullets stay on their own lines), and trailing-whitespace-only
lines removed from code blocks. No content corrections were needed this
chapter: every expected output matched real Python on the first run.

**Notes for the author (not changed):**
- L4's theory example shows `# Output: ValueError: Umur tidak mungkin
  minus!` - the real output is a multi-line traceback ending in that
  line. Fine as shorthand, but a learner who copies it will see more.
- L4 success message calls `as` a "parameter opsional"; it is part of
  the `except` syntax (a keyword), not a parameter.
- L1's practice and L5's practice are quizzes only, so `raise` inside a
  fixed `try` (L4) and `finally` (L6) are the only hands-on code for
  those concepts - consistent with the plan, just noting L5 (guard
  clauses) has no coding exercise before the L7 tantangan.

**2026-10-13 chapter 13 (Type Hints) - Python Dasar content is now
complete (13/13 chapters).** Wrote `content/chapters/chapter-13.ts` - 6
lessons (2 quiz: type hints don't enforce at runtime, what `int | str`
means; 4 code: function hints, `list[str]`/`dict` hints, fixing a wrong
return hint, and a nested-grouping "Tantangan" with
`dict[str, list[str]]`). All 4 `answerHint`s run through real Python and
match `checker.expected`; theory examples all run (Pyodide 0.26.2 =
Python 3.12, so `list[str]` and `int | float` are valid). `todo.ts` is
now an empty array (kept, since `index.ts` spreads it).

**App change - optional `Checker.sourceRequirements` (needed for this
chapter).** Type hints never change a program's output, so in L2, L3 and
L5 the *unchanged starter already printed the expected output* - with a
stdout-only checker a learner could click "Cek Jawaban" without writing
anything and pass. Added to `Checker` (`content/types.ts`) an optional
`sourceRequirements: {pattern, message}[]`: JS RegExp source strings that
must match the learner's code (with `#` comments stripped, so a correct
signature hidden in a comment doesn't count). They are checked only
AFTER stdout matches, and the first unmet one's message is shown
("Outputnya sudah benar, tapi parameter harga belum dilabeli int.").
It fails closed (no source passed, or an invalid regex -> not correct).
`lib/checker.ts` `checkOutput` takes an optional 4th arg `sourceCode`;
`CodeRunner` now passes the learner's code as a 2nd arg to `onCheck`;
`Challenge` forwards it. Backward compatible: lessons without
`sourceRequirements` behave exactly as before (chapters 1-12 untouched;
the existing 18 checker tests still pass). `scripts/test-checker.mjs`
mirrors the logic (as before) and gained 11 cases (29/29 pass): unchanged
starter fails, partial hints fail with the right message, whitespace
variants pass, comment-only signature fails, no-source and invalid-regex
fail closed. **Rule: only use `sourceRequirements` when output cannot
distinguish right from wrong; do not use it for ordinary lessons.**
Verified end-to-end against the real `lib/checker.ts` with 14 simulated
learner submissions (unchanged starter, only-params, only-return, odd
spacing, wrong inner type, bare `list`, etc.).

`tsc`, `npm run build`, `test-checker.mjs` (29/29) pass; `.next/static`
grep for answer strings from chapters 1-13: zero matches.

**Conversions (flagged in chat):** L1 quiz code moved to `codeSnippet`;
L4 quiz's inline `def` kept in the question text (a bodiless `def` isn't
a runnable snippet) but quoted; markdown stripped, spoiler hints moved to
`answerHint`, numbered steps on separate lines, whitespace-only lines
removed from code. No content corrections were needed.

**Notes for the author (not changed):**
- L5's example redefines `bagi_angka` twice (wrong version, then right
  version) in one block; it runs fine but isn't something to copy.
- L1 theory's second paragraph is one very long sentence ("...dikarenakan
  seiring waktu program yang dibuat akan bertambah besar, yang
  mengakibatkan..."); worth a split if you polish copy later.
- `-> int | float` in L4's example needs Python 3.10+; fine on the
  current Pyodide, but the course should keep Pyodide >= 0.23 / Python
  >= 3.10.

**2026-10-16 project-course planning session (docs only, no code
changes).** Agreed the project-course approach with the owner and wrote
`PROJECT_DESIGN.md` (context, format, Word Counter outline, data model,
checking, runner requirements, take-home, build order, verification
checklist). Findings worth remembering: (a) Python Dasar teaches no file I/O,
`import` or `input()` (grep over all 13 chapters), so the project must teach
all three; (b) Vercel Hobby forbids commercial use and Supabase Free pauses
after 7 days idle (see Key decisions); (c) the "unchanged starter already
passes" problem seen in chapter 13 will recur in projects, hence behavioral
tests; (d) the owner wants editor/progress/typography/account improvements
first (Phase 5-pre). Two technical traps to handle in the runner are
documented in `PROJECT_DESIGN.md` section 8 (module cache and persistent
virtual disk between runs).

**2026-10-16 editor rework (CodeMirror 6).** Replaced the `<textarea>` in
`CodeRunner` with a lazy-loaded CodeMirror 6 editor so learners can press Tab
to indent (previously Tab moved focus to the next control). New files:
`lib/editor-extensions.ts`, `components/learn/CodeEditor.tsx`,
`scripts/test-editor.mjs`; `CodeRunner.tsx` now renders `CodeEditor` through
`next/dynamic`. New dependencies in `package.json`: `@codemirror/state`,
`@codemirror/view`, `@codemirror/commands`, `@codemirror/language`,
`@codemirror/lang-python`, `@lezer/highlight` (**run `npm install`**).
Measured: lazy chunks total about 131 KB gzip; lesson route First Load JS
168 -> 169 kB, so CodeMirror is not in the initial load. `tsc`, `npm run
build`, `test-checker.mjs` (29/29), `test-editor.mjs` (21/21) pass; answer-
string grep of `.next/static` finds nothing. A throw-away jsdom run
confirmed the real keydown wiring (Tab prevented + indents, Esc-then-Tab not
prevented, expiry after 2 s, mobile attributes present). Lesson learned: the
first version had a hand-written Esc-release for the Tab keyboard trap; a
test exposed that CodeMirror >= 6.37 already ships one (Esc then Tab within
2 s), so ours was removed. **Not verified (needs real devices):** Android /
iPhone keyboards, touch selection, focus behaviour in real browsers - run the
checklist in `PROJECT_DESIGN.md` section 11. Mobile fallback if Android is
bad: plain `<textarea>` on touch devices only.

**2026-10-18 editor fixes after the owner's first test.** Two reports:
(1) Tab indented the whole line instead of inserting at the cursor;
(2) a long line wasn't scrollable sideways. Causes - (1) I had bound Tab to
CodeMirror's `indentMore` (via `indentWithTab`), which always indents the whole
line; (2) I had enabled `EditorView.lineWrapping` (thinking it friendlier on
phones) so long lines wrapped instead of scrolling. Fixes in
`lib/editor-extensions.ts`: new `insertIndentAtCursor` command (spaces at the
cursor up to the next 4-column stop, selected lines indented when there is a
selection, refused when read-only) bound to Tab and used by the touch "Indent"
button; line wrapping removed and `.cm-scroller` set to `overflow-x: auto`;
`CodeEditor` wrapper got `min-w-0` so a long line can't widen the page.
`scripts/test-editor.mjs` rewritten for cursor-position behaviour (33/33; one
of my own tests had a wrong cursor position and was fixed - the code was right).
Re-verified the real keydown wiring in a throw-away jsdom run. `tsc`, build,
`test-checker.mjs` (29/29) pass; lazy chunks still ~131 KB gzip; no answer
strings in `.next/static`. **Still not visually verified** (no browser in the
sandbox): that the horizontal scrollbar appears inside the editor and the page
doesn't scroll sideways - checklist items 2, 8, 13 in `PROJECT_DESIGN.md`
section 11. Interpretation note: I read "baris panjang disatukan (tidak ada
scroll)" as "wants one line + horizontal scroll"; ask the owner if that is
wrong.

**2026-10-18 rename to PyMula + progress UI.** (1) Renamed KodeKita ->
PyMula across 14 files (UI text in Header/Footer/layout/QRIS alt text,
`package.json` + lockfile name, SQL comments, README, docs). Grep for any
spelling variant now returns nothing; the only "kodekita" left in `.next` is
the sandbox folder path. (2) **Progress UI.** Before: only the text "x/y lesson
selesai"; the lesson page fetched no progress at all; the dashboard "Lanjutkan"
button could point at a paid chapter and bounce a free learner to the purchase
page. Now:
- `components/ui/ProgressBar.tsx`: accessible bar (`role=progressbar`, aria
  values, clamped, `motion-reduce` aware).
- `components/learn/ChapterProgress.tsx`: on every lesson page, "Lesson N/M - x
  selesai" plus one segment per lesson (green = done, amber ring = current).
- `components/learn/LessonNav.tsx`: new optional `completedKeys` prop (the
  signed-in learner's own `${chapter}:${lesson}` keys; no lesson content) ->
  tick on finished lessons and "x/y" or tick per chapter in the dropdowns.
- Course page (`/kursus/python-dasar`): "Progres kamu" card (bar, percent,
  Lanjutkan / Mulai button) plus a bar and a "Selesai" badge per chapter.
- Dashboard: same card; **paywall-aware**: a learner who hasn't purchased gets
  progress over the FREE chapters only and, once those are done, a "Semua chapter
  gratis sudah kamu selesaikan" message with a "Buka chapter berikutnya" button to
  `/kursus/python-dasar/beli` instead of a link that redirects.
- `Challenge` and `QuizRunner` call `router.refresh()` right after a lesson is
  marked complete, so the bar, segments and ticks update immediately (client
  state such as the typed code is preserved).
- Logic lives in pure `lib/progress-summary.ts` (+ `lib/progress-keys.ts`;
  `progress-server.ts` re-exports `lessonKey`). Only lessons that exist are
  counted, so stale DB rows (renamed/removed lessons) can't produce >100%.
Tests: `scripts/test-progress.mjs` (24/24: next-lesson rules, free-only scope,
paywall state, stale rows, rounding, empty course, plus the markup of both
components). `tsc`, `npm run build`, `test-checker.mjs` (29/29),
`test-editor.mjs` (33/33) pass; no answer strings in `.next/static`. **Not
verified (no browser in the sandbox, and no Supabase to sign in):** how the new
bars look and whether the immediate refresh feels right on a real device - open
the dashboard, course page and a lesson while signed in and pass a lesson.

**2026-10-19 the editor remembers the learner's code.** Problem: refreshing
or closing the tab threw the code away (it lived only in React state). Now
`lib/code-drafts.ts` + `lib/use-code-draft.ts` keep it in `localStorage`
(local only - nothing is sent to Supabase for lessons; a draft doesn't follow
the learner to another device). Behaviour: saved 400 ms after typing stops and
flushed on `pagehide` / tab hidden (so the last keystrokes survive a refresh or
a phone killing the tab); key includes the user id (`pymula:draft:v1:<user>:
<chapter>:<lesson>`, user id read from the local session - no extra network
call) so two accounts on one computer don't see each other's code; code equal to
the starter is not stored; cleared on sign-out (both `SignOutButton`s) removing
only our keys; if the author later edits a lesson's starter, a learner who never
edited sees the new one, one who did keeps their code. `CodeRunner` got a
`draft` prop (passed by `Challenge`), a "tersimpan di perangkat ini" /
"Kode terakhirmu dipulihkan" line and a **Reset kode** button with a confirm (a
reset is now the only way back to the starter). Fails soft everywhere: blocked
storage (private mode), full storage or corrupt data just mean "no draft".
Tests: `scripts/test-drafts.mjs` (32/32: round trip, one entry not history,
oversize, quota/blocked storage, corrupt/odd JSON, starter-changed cases, clear
only touches our keys, two users). Also verified in a throw-away jsdom run
(not committed) with a fake Supabase session: first visit, debounce, refresh
restores, pagehide and tab-hidden flush, reset, refresh after reset, other
account, other lesson, starter changed, typing before the lookup finishes is
not clobbered, signed-out, no scope, blocked localStorage (19/19). `tsc`,
`npm run build`, `test-checker` (29/29), `test-editor` (33/33),
`test-progress` (24/24), `test-drafts` (32/32) pass; no answer strings in
`.next/static`; lesson route 5.98 kB (First Load 171 kB). **Not verified:**
real browsers/phones (esp. Safari, which can evict localStorage for sites not
visited for about a week) - checklist items 15-20 in `PROJECT_DESIGN.md`
section 11. Known limits: single-device; clearing site data or a Safari
eviction loses drafts; the project workspace will add server sync (design doc
6.2).

**2026-10-19 lesson typography + PyMula logo.** (1) Logo: `Logo` component,
"Py" `#29235c` + "Mula" `#f2ad3d` via new Tailwind tokens, used in `Header`
(top-left of every page); the built CSS contains the exact values
(`rgb(41 35 92)` / `rgb(242 173 61)`). (2) Typography for ALL lessons. Before:
every text block was `text-sm` (14px) with `whitespace-pre-line` (no paragraph
spacing, lists shown as raw "- " / "1. ", no code styling, `<pre>` blocks
re-declared with slightly different classes in four places). Because chapter
content is plain text with no markdown/backticks (stripped on purpose from
chapter 9 on), `lib/lesson-text.ts` infers structure from how the text is
written: paragraphs on blank lines; `- ` and `N. ` lists (numbering resumes via
`start` when an indented bullet list interrupts); `Penting:` / `Peringatan:` /
`Catatan:` call-outs; short bold term lead-ins on list items (<= 4 words, no
comma, starts with a capital or a dot); and code-like words inside sentences
(calls, indexing/type hints, snake_case, True/False/None). New components
`LessonText` / `InlineText` and `CodeBlock`; applied in the lesson page
(theory, sections, captions, headings, title), `Challenge` (instructions,
hints, success message, spoiler) and `QuizRunner` (question, options,
explanation, snippet). Scale: prose 17px/1.75 (small 15px), `max-w-2xl` column,
3xl balanced title, Fraunces xl section headings, mono labels with wider
tracking, `pre:focus-visible` ring for the now-focusable code blocks. Failure
messages from the checker (can contain the learner's output) are intentionally
left as plain text. Tests: `scripts/test-lesson-text.mjs` (49/49: inline code
true/false cases, lead-ins, blocks, markup, XSS-escaping, a pathological-input
speed check, and **lossless over all 689 real lesson texts in both sizes**; with
`--report` it lists everything that got styled - reviewed: 213 distinct code
tokens, 21 bold lead-ins, 3 call-outs, no false positives found) and
`scripts/test-logo.mjs` (8/8). Also checked that every Tailwind class the new
UI needs (arbitrary sizes, `text-pretty`/`text-balance`, `marker:`, opacity
colours, the first-child override) exists in the built CSS. All suites pass:
checker 29, editor 33, progress 24, drafts 32, lesson-text 49, logo 8; `tsc` and
`npm run build` clean; lesson route 7.22 kB (First Load 172 kB); no answer
strings in `.next/static`. **Not verified (no browser in the sandbox):** how it
actually looks - check a theory-heavy lesson (e.g. chapter 9 L3, chapter 12 L7),
a quiz, and the header on desktop and a phone. Known limits: plain words such as
`if` / `for` / `%` can't be detected as code; a bold lead-in is a heuristic
(e.g. step titles like "Hitung nilai_akhir dengan formula:" are bolded); the
logo's amber is low-contrast on the light header.

### How to write the next batch (2-3 chapters)

1. Fill in `content/AUTHORING_TEMPLATE.md`'s template for each chapter and
   send it back (chat or file upload).
2. I'll convert it into `content/chapters/chapter-N.ts` following the
   `chapter-1.ts`/`chapter-2.ts` pattern, verify every code practice's
   expected output against real Python and every quiz has one correct
   answer, add it to `index.ts`, remove it from `todo.ts`, and update the
   table above.

## Next steps

1. Run `supabase/schema_phase4.sql` (after the existing
   `schema.sql`/`schema_phase2.sql`/`schema_phase2b.sql`, which should
   already be live) in the real Supabase project.
2. Flip on your own admin access:
   `update public.profiles set is_admin = true where id = '<your-user-id>';`
   (find your user id in Supabase Auth > Users).
3. Swap the placeholder QRIS: replace `public/qris-placeholder.svg` with
   your real static QRIS image (keep the filename, or update the one
   `<img src="...">` in `app/kursus/python-dasar/beli/page.tsx` if you
   rename it).
4. Swap the placeholder WhatsApp number: `WHATSAPP_URL` near the top of
   `app/kursus/python-dasar/beli/page.tsx`.
5. Test the full purchase loop end-to-end on a real deploy: hit a paid
   chapter while logged in and unpurchased -> redirected to `/beli` ->
   upload a screenshot -> see "Menunggu verifikasi" -> approve it from
   `/admin/purchases` on your admin account -> paid chapters unlock.
   Also confirm a *rejected* purchase lets the user resubmit.
6. Python Dasar content is complete (chapters 1-13). Do an end-to-end pass on
   a real deploy of chapters 9-13 (especially the type-hint lessons' source
   check: unchanged starter must NOT pass, correct answer must).
7. **Phase 5-pre** (owner-driven): editor rework, progress UI, lesson
   typography, account/settings page - see Phase status above and
   `PROJECT_DESIGN.md` section 11.
8. Then **Phase 5 step 1** (runner) per `PROJECT_DESIGN.md` section 12.
9. Before accepting real payments: move off Vercel Hobby (Pro or another
   host) and decide how to keep Supabase from pausing (manual ping for now).

## Open questions for the team

- Real QRIS image and business WhatsApp number - both currently
  placeholders (see "Next steps" above).
- Word Counter outline: author writes it, or Claude drafts the 8-chapter
  outline in `PROJECT_DESIGN.md` section 5 for review? Final project price
  (target ~Rp10.000, configurable in `content/pricing.ts`).
- Account deletion: what happens to `purchases` rows (retain anonymized /
  block while pending / other)?
- Editor: decided (CodeMirror 6); waiting on the owner's manual test on real
  Android / iPhone devices (checklist in `PROJECT_DESIGN.md` section 11).
