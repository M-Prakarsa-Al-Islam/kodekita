# PyMula - Project Courses Design (Phase 5)

Design doc for the "Projek" part of PyMula, starting with **Build a Word
Counter**. Written 2026-10-16 after a planning discussion with the owner.
`PROGRESS.md` is the source of truth for *status*; this file is the source of
truth for *how project courses work and why*. If the two disagree about a
decision, fix whichever is stale and say so in the session log.

Status of everything below: **designed, not built.** Items marked
`DRAFT` / `TENTATIVE` are proposals to be finalized when that step is built.

---

## 1. Context and goal

- PyMula is an Indonesian-language, self-paced programming platform. The
  main course (Python Dasar, 13 chapters) is fully written (see
  `PROGRESS.md`). Project courses are the second product: *"Learn Python ->
  use Python to build something."*
- Business goal (from `master_builder_prompt.md`): validate the idea with at
  least one real paying customer in roughly three months. A working, small
  thing beats an impressive, large thing. Project courses are cheaper than the
  main course (target about **Rp10.000**, price must be configurable via
  `content/pricing.ts`, not hardcoded).
- Project courses are **guided**, not unguided: each project is split into
  chapters, each chapter builds one part of the final program, the learner
  writes a meaningful share of the code, and the platform provides
  instructions, examples, hints, debugging guidance and an optional solution.
  The full project code must never be handed over up front.
- What the learner is buying: **hands-on experience building a complete Python
  program**, and something of their own they can take home.

### Honest positioning (important for copy and marketing)

A Word Counter is a small beginner project. As a CV item it is worth *modest*
value. Do **not** sell it as "portfolio-ready". Sell it as: *"your first
complete Python program, from zero to running on your own computer."* The CV
value comes from (a) a public repo with a README, (b) being able to explain
the code, and (c) the learner's own extension of it (see the extension
challenge in section 5/9).

## 2. Constraints that shape every decision

| Constraint | Consequence |
|---|---|
| No backend code execution (Pyodide in the browser, `lib/pyodide.ts`) | All running/checking is client-side. No server cost for execution. |
| Free tiers (Supabase Free, Vercel) | Keep DB writes small and infrequent; generate downloads in the browser; no server-side zip. |
| Vercel **Hobby is non-commercial only** | Must move to Vercel Pro ($20/mo) or another host **before accepting real payments**. Owner is aware. Re-verify on vercel.com. |
| Supabase Free **pauses after 7 days idle** | A dead site for a paying customer is the real risk. Owner pings manually for now; scheduled ping or Pro ($25/mo) later. |
| Desktop **and** mobile users | Editor and layout must work on a ~380px phone. See section 10. |
| MVP exclusions (master prompt section 30) | No certificates, leaderboards, public profiles, etc. A public "share my project" page is *deferred*. |
| Python Dasar does **not** teach file I/O (`open`, `with`, `.read()`), `import`, or `input()` (verified by grep over all 13 chapters) | The project must teach these three itself, each in its own chapter. Prerequisite copy should say "Python Dasar" but expect these to be new. |

Hosting numbers (checked 2026-10-16, third-party summaries of vendor docs; re-check
before launch): Supabase Free = 500 MB DB, 5 GB egress, 50,000 MAU, API request
count not capped, 2 projects, 7-day idle pause. Pyodide loads from jsDelivr, so it
does **not** use Vercel bandwidth.

## 3. Product definition (Word Counter)

- **Title:** Build a Word Counter. **Prerequisite:** Python Dasar (or equivalent).
- **Final program:** the user gives a text file name; the program reads it and
  prints how many words it contains, with friendly handling of a missing file.
- **Introduces:** project setup, files, reading text, strings, lists,
  functions, user input, error handling, combining pieces into one program,
  plus **two-file structure** (`main.py` + `fungsi.py`) and `import`.
- Add a **project catalog / detail page** (master prompt pages #4 and #5) and
  gate purchase exactly like the main course (`purchases` table, admin QRIS
  verification already exist).
- Design the system so **more projects can be added later** by writing content
  files, not code.

## 4. Learning format

Same skeleton as the course: **story -> instructions -> code in the browser ->
check**. Three deliberate differences from course lessons:

1. **One program that grows (cumulative workspace).** In the course every
   exercise stands alone. In a project, the learner's code from chapter N is the
   starting point of chapter N+1, stored on their account. The end result is one
   real set of files that they built.
2. **Looser instructions.** Course lessons give exact steps. Project chapters
   give a *goal and requirements*, plus progressive hints and an optional
   solution. The learner decides how to write it.
3. **Behavioral checking** instead of exact stdout matching (section 7).

Each chapter opens with a short **story** (e.g. "a client wants the word count
of their article") so it feels like a project, not another drill.

## 5. Word Counter outline (PROPOSED - author to confirm or rewrite)

Matches the chapter list in the master prompt. New-to-the-learner concepts are
bold. Files: `main.py` (the program), `fungsi.py` (functions).

| # | Chapter | Learner does | New concept |
|---|---|---|---|
| 1 | Set up the project | Tour of the workspace (two tabs), run `main.py` to print a banner | **running a script**, what a project/file is |
| 2 | Read a file | Open the provided `contoh-artikel.txt`, read it, print the start | **`open()`, `with`, `.read()`** |
| 3 | Count words | `.split()` + `len()` on the text | (strings/lists already known) |
| 4 | Make it a function | Move logic into `hitung_kata(teks)` in `fungsi.py`, import it in `main.py` | **`import` / `from fungsi import ...`** |
| 5 | Combine the pieces | `main.py` reads file -> calls function -> prints "Jumlah kata: N" | wiring modules together |
| 6 | Add user input | Ask for the file name | **`input()`** |
| 7 | Handle missing files | `try/except FileNotFoundError`, friendly message | (try/except already known, ch. 12) |
| 8 | Finish and take it home | Clean up, README, download, run locally, upload to GitHub, extension challenge | see section 9 |

The extension challenge (e.g. top-10 most frequent words, ignore punctuation)
is **open-ended and not auto-checked**, so every learner's repo differs.

## 6. Workspace and data model

### 6.1 Workspace (UI)

- A **tab bar above the code editor** (like VS Code) switching between the
  project's files: `main.py` and `fungsi.py`.
- The set of files is **fixed by the project**. The learner cannot create,
  delete or rename files (no file manager).
- Edits to each file are saved to `localStorage` as the learner types
  (debounced), keyed by **user id + project slug + file name**.

### 6.2 Persistence rules

- **No version history. UPDATE, not INSERT.** One row per (user, project).
  Never one row per lesson, never one row per save.
- `localStorage` is a *draft cache*: written while typing. Supabase is written
  only when the learner **passes a lesson or presses "Lanjut"** (not on every
  failed "Cek Jawaban").
- On load, use whichever of local draft / server copy has the **newer
  timestamp**. Store a timestamp with each local draft.
- **Shared computers (warnet) are real:** key drafts by user id and clear them
  on logout.
- Safari on iPhone can evict `localStorage` for sites not visited for about a
  week, so the server copy written at each pass is the safety net. Show
  "Draf tersimpan di perangkat ini".
- When the learner enters the next lesson, load `files` from Supabase and put
  them in the editor as the starter. If a lesson needs new scaffolding, see
  6.4.
- Progress is self-reported (checks run client-side, same as the course). Do
  not try to enforce it server-side. Access to paid content *is* enforced
  server-side via `purchases`, as for the course.

### 6.3 Table (DRAFT - finalize in build step 2)

```sql
create table public.project_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  project_slug text not null,
  files jsonb not null default '{}'::jsonb,        -- {"main.py": "...", "fungsi.py": "..."}
  current_lesson text,
  completed_lessons text[] not null default '{}',
  help_used jsonb not null default '{}'::jsonb,    -- {"L3": "spoiler"}
  updated_at timestamptz not null default now(),
  primary key (user_id, project_slug),
  constraint project_files_size check (octet_length(files::text) < 100000),
  constraint project_help_size check (octet_length(help_used::text) < 5000)
);
```

- RLS: a user can select/insert/update **only their own row**. Include the
  explicit Data API grants (see the Oct 2026 note in `supabase/schema.sql`).
- The size `CHECK`s stop anyone using the column as free storage.
- Consider also requiring an approved purchase for `project_slug` on
  insert/update (look at how `purchases` identifies the product first).
- Estimated cost: about 6 KB per row; 1,000 learners opening it 50 times a month
  is roughly 300 MB egress (my estimate; limit is 5 GB).

### 6.4 Lesson starter and scaffolding (TENTATIVE)

Starter = the learner's saved files. A lesson that needs new scaffolding (e.g.
an empty function stub) may define a `scaffold` that is **appended once** on
first entry, marked with a comment such as `# --- Chapter 3 ---` so entering the
lesson twice never duplicates it.

### 6.5 Help: spoiler, copy, `help_used`

- **Spoiler** shows the lesson's full solution **read-only**, for *every* file
  of the lesson (not just the new lines), with a **Copy** button per file. It
  never overwrites the learner's code.
- A learner who is stuck copies the solution into the editor, runs it, passes,
  continues. This replaces a "Lewati / use example code" button.
- **No "Lewati" button in the MVP.** Add it later only if data shows learners
  quit because copying is annoying. If added: needs a confirmation and a
  local-only backup with "Urungkan".
- `help_used` records, per lesson, that the spoiler was opened. It is for the
  **owner**, not the learner: lessons where many learners open the spoiler are
  too hard or badly worded, and together with `current_lesson` it shows where
  learners stop. Read it with SQL in the Supabase dashboard (no admin page
  needed). Drop the column if nobody will look at it.

## 7. Checking: behavioral tests

Existing checkers (`lib/checker.ts`, client-side): `stdout_exact`, with optional
`sourceRequirements` (regexes on the learner's code, added in chapter 13 for
type-hint lessons). Keep both.

For lessons where the learner **writes functions**, add a new checker
(TENTATIVE name `behavior_tests`):

1. Run the learner's files in Pyodide (section 8).
2. Run a hidden **test script** in the same session. Helper
   `cek(aktual, harapan, pesan)` records failures instead of raising, e.g.
   `cek(hitung_kata("satu dua  tiga"), 3, "Spasi ganda harus dihitung satu pemisah")`.
3. Pass if there are no failures; show the first failing `pesan`.
4. For `input()`, tests run the program with **scripted input** (a helper that
   patches `input` with a fixed list of answers).

Why: accepts any correct style of solution, and failure messages can be
specific. Cost: tests must be written per lesson. The test text ships to the
browser like `expected` does today (accepted for a Rp10.000 product).

Use `stdout_exact` for lessons whose goal is just printing; use
`behavior_tests` for function/program lessons.

## 8. Runner requirements (build step 1)

> **Status (2026-10-20): step 1 is mostly built.** Done: multi-file virtual
> disk with a clean slate per run, module-cache reset, seed (read-only) files,
> scripted `input()` that echoes like a terminal, errors with file and line,
> `__main__` entry, per-file editor state, file tabs, per-file saved code, an
> Input box, per-file `sourceRequirements`, and `npm test` running every lesson
> in the real Pyodide. First used by the new Chapter 3 lessons L9-L16 (see
> `PROGRESS.md`). **Not built yet:** the `behavior_tests` checker (hidden test
> script calling the learner's functions), a Web Worker timeout for runaway
> loops, and file upload into the virtual disk. Chapter 3 needed none of them
> (output + per-file source rules were enough).



Current runner (`lib/pyodide.ts`): Pyodide 0.26.2 (Python 3.12) from jsDelivr,
loaded once, each run uses fresh globals, captures stdout, **no stdin support**,
and (as far as read) no Web Worker, so it runs on the page's main thread.

Required for projects:

- **Multi-file:** write every project file to Pyodide's virtual filesystem
  before each run, so `from fungsi import ...` works. Run `main.py` as
  `__main__` and keep file names in tracebacks.
- **Trap 1 - module cache:** Python caches imported modules for the life of the
  page. Without resetting, editing `fungsi.py` and pressing Run again still uses
  the old version. **Before every run, remove the learner's modules from
  `sys.modules` and invalidate import caches.**
- **Trap 2 - the virtual disk persists between runs:** if learner code edits or
  deletes `contoh-artikel.txt`, the next run (and our tests) would see the
  changed file. **Before every run, rewrite all files from scratch**: the
  learner's files from the editor plus the seed files in their original state.
- **Seed files:** each project declares files (like `contoh-artikel.txt`) that
  are written into the working directory so `open("contoh-artikel.txt")` works.
- **`input()`:** add a small "Input program" box under the editor, one line per
  `input()` call, fed through Pyodide's stdin hook; tests use scripted input.
- **Hangs:** an infinite loop freezes the tab (main thread). MVP: show "jika
  macet, muat ulang - kodemu aman karena draf tersimpan". Later: Web Worker with
  a timeout.
- None of the above touches Supabase or Vercel; it all happens in the learner's
  browser memory.

## 9. Take-home (the CV part)

Done in the browser, **no server cost**:

- **Download** a zip built client-side (use `fflate` or JSZip, via Blob and an
  `<a download>`): `main.py`, `fungsi.py`, a generated `README.md` (what it does,
  how to run it, what was learned) and `contoh-artikel.txt`.
- **Run it locally:** one lesson on installing Python and running
  `python main.py` on their own machine. This proves the program is theirs and
  covers the file/input parts that the browser only simulates.
- **GitHub guide:** five steps using GitHub's web upload (no git needed). The
  repo link is what goes on a CV.
- **Extension challenge** (open-ended, not auto-checked).
- On phones the zip downloads fine but Python cannot be run, so this chapter is
  **desktop-oriented and must never block finishing the coding chapters**.

## 10. Mobile and desktop requirements

- Editor must set `autocapitalize="off"`, `autocorrect="off"`,
  `spellcheck="false"` (smart quotes break Python).
- Mobile has no Tab key: provide an **indent button** (and Tab / Shift+Tab on
  desktop).
- Tab bar sticky; instructions panel collapsible on small screens.
- Show progress while Pyodide first loads (a few MB, slow on mobile data).

## 11. Platform improvements to do BEFORE project work (owner-driven, "Phase 5-pre")

The owner wants these first. They interact with the project design, so decide
with that in mind:

- **Editor rework - DONE (code), awaiting manual device testing.** Decided
  2026-10-16: **CodeMirror 6**, lazy-loaded. Reasons: a plain `<textarea>`
  needs Tab handling *plus* undo-preserving edits, auto-indent, dedent-on-
  backspace, line numbers, highlighting, per-file state and a read-only
  solution view - all hand-built and bug-prone; CodeMirror has them. Measured
  cost: about **131 KB gzip** of lazy chunks (`next/dynamic`, loaded only on
  lessons with a code editor; lesson route First Load JS 168 -> 169 kB).
  Implementation: `lib/editor-extensions.ts` (React-free config: 4-space
  indent unit, Tab = `insertIndentAtCursor` (spaces **at the cursor**, up to
  the next 4-column stop; with a selection it indents the selected lines) and
  Shift-Tab = `indentLess`, Python auto-indent, Backspace over indentation,
  line numbers, Python highlighting on the dark `ink` theme, **no line
  wrapping (a long line stays one line and the editor scrolls horizontally)**,
  `autocapitalize/autocorrect/autocomplete=off`,
  `spellcheck=false`, `aria-label`, visible focus ring, optional `readOnly`);
  `components/learn/CodeEditor.tsx` (reusable component: `value`, `onChange`,
  `readOnly`; on touch devices shows **Indent / Outdent buttons** because
  phones have no Tab key; on mouse devices shows a keyboard hint);
  `CodeRunner` now renders it instead of the `<textarea>`.
  Keyboard trap: Tab indenting would trap keyboard-only users, so we rely on
  CodeMirror's **built-in tab-focus mode** (Esc, then Tab within 2 seconds,
  moves focus out; any other key cancels). Needs `@codemirror/view` >= 6.37
  (6.43 installed). An earlier hand-written escape hatch was removed because
  it duplicated the built-in one with different timing.
  Verified automatically: `node scripts/test-editor.mjs` (33 cases: Tab at
  line start / mid-line / end of line / on a tab stop, cursor position after
  Tab, multi-line and single-line selections, multiple cursors, read-only,
  never inserts a tab character, Shift-Tab, Enter auto-indent, Backspace over
  indentation, no line-wrapping, config), plus an ad-hoc jsdom check of the
  real keydown wiring (Tab inserts at the cursor, Shift-Tab, Esc-then-Tab not
  prevented, 2-second window expiry, attributes, no `cm-lineWrapping` class) -
  the jsdom check is not committed (it needs `jsdom`). **Not visually
  verified:** the horizontal scrollbar for long lines (no real browser in the
  build sandbox) - checklist items 2 and 8.
  History: the first version used CodeMirror's `indentWithTab`, whose Tab
  indents the *whole line* (wrong for typing mid-line) and enabled line
  wrapping; both were changed on the owner's report. **NOT verifiable without real devices** - run
  the manual checklist below, especially on Android.
  Not yet done: the spoiler/`answerHint` display is still a plain `<pre>`
  (use `<CodeEditor readOnly>` when building the project spoiler); multi-file
  tabs.
  **Remembering the learner's code - DONE for course lessons (2026-10-19):**
  `lib/code-drafts.ts` (pure, storage-injected: save / load / resolve / clear;
  tolerant of corrupt data, quota errors and blocked storage) and
  `lib/use-code-draft.ts` (hook used by `CodeRunner`). Local only - nothing goes
  to Supabase for lessons, so a draft does not follow the learner to another
  device. Key = `pymula:draft:v1:<userId>:<chapter>:<lesson>` (the user id comes
  from the local session, no network call); saved 400 ms after typing stops and
  flushed on `pagehide` / tab hidden; code equal to the starter is not stored;
  drafts are cleared on sign-out (only our keys); if the author later changes a
  lesson's starter, a learner who never edited sees the new starter, one who
  did keeps their code. `CodeRunner` shows "tersimpan di perangkat ini" /
  "Kode terakhirmu dipulihkan" and a **Reset kode** button (with a confirm).
  The project workspace should reuse this layer: add the file name to the key
  and, per section 6.2, sync to Supabase on pass / "Lanjut".
- **Progress UI - DONE (2026-10-18), needs a visual check.** Progress bars on
  the dashboard and course page, per-chapter bars and "Selesai" badges, a
  segmented chapter bar on every lesson page, ticks in the lesson nav, and a
  paywall-aware "Lanjutkan" (free learners get progress over free chapters and a
  "buy to continue" button instead of a redirecting link). The pure logic in
  `lib/progress-summary.ts` is reusable for project courses (their progress is
  `completed_lessons` in `project_progress`, so feed the same function a
  different completed set). Details in `PROGRESS.md`.
- **Lesson typography - DONE (2026-10-19), needs a visual check.** Prose was
  14px with no paragraph spacing, raw `- ` / `1. ` text, and no code styling.
  Now: 17px / 1.75 line height prose in a ~70-character column (`max-w-2xl`),
  `text-pretty` paragraphs, a `text-balance` 3xl title, Fraunces section
  headings, real bulleted / numbered lists, highlighted `Penting:` /
  `Peringatan:` / `Catatan:` call-outs, bold term lead-ins on list items, and
  code-like words inside sentences styled as inline code. All of it is inferred
  from how the existing plain text is written (`lib/lesson-text.ts`), so no
  lesson content had to change; conventions for authors are in
  `content/AUTHORING_TEMPLATE.md`. Components: `LessonText` / `InlineText`,
  `CodeBlock` (one look for every code sample, keyboard-focusable). Used for
  theory, section text, example captions, instructions, hints, success
  messages, quiz questions / options / explanations and the spoiler. Tests
  prove nothing is lost: `scripts/test-lesson-text.mjs` renders all 689 real
  lesson texts and checks every character is still there. The checker's failure
  messages (which may contain the learner's output) are deliberately NOT
  restyled.
- **Account / settings page** (master prompt page #13, not built): view account
  info, rename (`profiles.name`; an update RLS policy already exists), change
  password, **delete account**. Deleting an auth user needs the Supabase
  **service-role key in a server action** (env var, never `NEXT_PUBLIC_`, never
  in client code). Before building, verify the foreign-key behavior of
  `lesson_progress` and `purchases`, and remove the user's `payment-proofs`
  storage objects. **Decision needed:** purchases are financial records - what
  happens to them on account deletion (retain anonymized, block deletion while a
  purchase is pending, etc.)?

### Editor manual test checklist (run before calling the editor done)

Desktop (Chrome, Firefox, Safari):
1. Click in the middle of a line (e.g. between `x` and `=` in `x = 1`), press
   **Tab**: spaces appear **at the cursor** (up to the next 4-column stop) and
   only the text to the right moves; the rest of the line stays; focus stays.
   At the very start of a line, Tab moves the whole line right by 4.
2. Select several lines; **Tab** / **Shift+Tab** indent / dedent all of them.
   Shift+Tab with no selection dedents the current line.
3. Type `if x:` then Enter: the next line is indented; **Backspace** removes
   4 spaces at once.
4. **Ctrl/Cmd+Z** undoes typing and indentation; redo works.
5. **Esc, then Tab** (within 2 seconds): focus moves to the next button
   ("Jalankan"); Shift+Tab goes back. Pressing another key first re-arms Tab.
6. Paste multi-line code: indentation is preserved.
7. Type `"`: a straight quote appears (never a curly one).
8. A very long line does **not** wrap: it stays one line and a horizontal
   scrollbar appears *inside the editor* (the page itself must not scroll
   sideways); line numbers and colours show.
9. "Jalankan" and "Cek Jawaban" work with typed code. Moving to the next
   lesson shows that lesson's starter code, not the previous code.
10. On a quiz-only or theory-only lesson, the browser's network tab does **not**
    request the CodeMirror chunks.

Mobile (real Android phone with Gboard; real iPhone with Safari), about 380px:
11. Tap the editor: keyboard opens. No auto-capitalisation, no autocorrect,
    no smart quotes, the suggestion bar does not rewrite code.
12. **Indent / Outdent buttons** are visible (touch only) and tapping them
    keeps the keyboard open. The keyboard hint text is hidden on touch.
13. Select with the handles, cut / copy / paste; a long line scrolls sideways
    inside the editor (swipe) without making the page wider; the page layout
    is not broken. **Indent** inserts at the cursor like Tab.
14. Enter after a line ending in `:` auto-indents; Backspace behaves normally.
If Android has a serious keyboard problem, fall back to a plain `<textarea>` on
touch devices only (keep `CodeEditor` for desktop).

Remembering code (desktop and phone):
15. Type code in a code lesson, wait one second, refresh: the code is back and
    the line "Kode terakhirmu dipulihkan · tersimpan di perangkat ini" shows.
16. Type, then immediately close the tab / switch app, reopen: the last
    characters are there.
17. **Reset kode** asks for confirmation, then restores the starter; a refresh
    afterwards shows the starter.
18. Sign out, then check the browser's storage (devtools, Application): no
    `pymula:draft:` keys remain. Sign in as a *different* account: the first
    account's code is not shown.
19. Private / incognito window: lessons still work (the code just isn't kept).
20. A different lesson has its own, separate code. Passing a lesson does not
    erase the saved code.

## 12. Build order

0. **Phase 5-pre** (section 11), owner-driven.
1. **Runner:** multi-file filesystem, module-cache and file reset before every
   run, seed files, scripted `input()` + input box, `behavior_tests` harness.
   Testable without any project content. *Stop and report after this step.*
2. **Project route and workspace:** generalize the routes that are hard-coded to
   `python-dasar` (`app/kursus/python-dasar/...`), tab bar, localStorage drafts,
   `project_progress` table + upsert, spoiler + Copy, `help_used`, project
   catalog/detail pages, purchase gate.
3. **Content:** Word Counter chapters and the take-home chapter (zip, README).
   Extend `content/AUTHORING_TEMPLATE.md` for projects (story, per-lesson
   `scaffold`, `solutionFiles`, tests, seed files, README template).
4. **Later:** Web Worker with timeout, optional file upload into the virtual FS,
   public share page, "Lewati" button if data supports it.

### Tentative content shape (for step 3; not yet in `content/types.ts`)

```ts
type ProjectContent = {
  slug: string; title: string;
  files: string[];                           // fixed, e.g. ["main.py", "fungsi.py"]
  seedFiles: Record<string, string>;         // e.g. "contoh-artikel.txt"
  readmeTemplate: string;
  chapters: { id: string; title: string; lessons: ProjectLesson[] }[];
};
type ProjectLesson = {
  id: string; slug: string; title: string;
  story: string; instructions: string; hints: string[];
  scaffold?: Record<string, string>;         // appended once, marker-commented
  solutionFiles: Record<string, string>;     // spoiler: read-only + Copy
  checker: { type: "behavior_tests"; tests: string } | { type: "stdout_exact"; expected: string };
  successFeedback: string;
};
```

## 13. Decisions log

**Decided:** hybrid format (browser coding + take-home); cumulative two-file
workspace; one `project_progress` row per user per project, upsert on pass /
"Lanjut"; localStorage draft cache; behavioral tests for function lessons;
spoiler read-only + Copy (no overwrite, no "Lewati" in MVP); `help_used` for
owner analytics; downloads generated in the browser; desktop + mobile support;
editor = CodeMirror 6 lazy-loaded (section 11); build order in section 12.

**Deferred:** Web Worker timeout, file upload, public share page, "Lewati"
button, certificates (excluded by master prompt).

**Open:** who writes the Word Counter outline (author, or Claude drafts for
review); final price; README template wording; account-deletion policy for
purchases.

## 14. Verification checklist (before calling a step done)

Step 1 (runner):
- Edit `fungsi.py`, run twice: the second run uses the edited code.
- Learner code deletes/edits `contoh-artikel.txt`: the next run sees the
  original again.
- `from fungsi import hitung_kata` works from `main.py`; tracebacks name the
  right file.
- `input()` receives the box lines in order; with no input it fails clearly.
- `behavior_tests`: correct solution passes, unchanged starter fails, a
  half-correct one fails with the right `pesan`; a solution in another valid
  style also passes.
- Existing course lessons (chapters 1-13) and `node scripts/test-checker.mjs`
  still pass; `npx tsc --noEmit` and `npm run build` clean; grep `.next/static`
  for answer/test strings finds nothing.

Step 2 (workspace):
- Reload mid-lesson: draft restored. Second account on the same browser sees
  none of the first account's drafts. Local newer than server wins, and the
  reverse.
- Cross-device: pass a lesson on one device, open on another, files carry over.
- RLS: user A cannot read or write user B's row; oversize `files` is rejected.
- Mobile (about 380px): tabs, indent button, collapsible instructions, no smart
  quotes.

Step 3 (content): every `solutionFiles` passes its own checker through the real
runner; every starter fails; the full chain chapter 1 -> 8 works using only
solutions copied from the spoiler.
