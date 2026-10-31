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
| **Corrected 2026-10-28.** Python Dasar Chapter 3 (L8-L15) **does** teach `input()`, `open()`/`.read()`, `with`, writing files, `import` and splitting code into modules (see "Gabungkan: Input, File, dan Modul"). It does **not** teach `.lower()`, `.strip()`, `sorted(key=, reverse=)`, f-string alignment (`:<10`, `:>4`), `"=" * 34` or `.center()` (verified by grep over chapters 1-13) | File/`import`/`input()` chapters of the project are **review**, kept short. The new teaching time goes to text cleaning, counting, sorting and formatting (section 5.4). |

Hosting numbers (checked 2026-10-16, third-party summaries of vendor docs; re-check
before launch): Supabase Free = 500 MB DB, 5 GB egress, 50,000 MAU, API request
count not capped, 2 projects, 7-day idle pause. Pyodide loads from jsDelivr, so it
does **not** use Vercel bandwidth.

## 3. Product definition (Word Counter)

- **Title:** Build a Word Counter. **Prerequisite:** Python Dasar (or equivalent).
- **Final program:** the user gives a text file name; the program reads it,
  cleans the words, and prints the word count, the number of unique words and
  the 5 most frequent words, with friendly handling of a missing file. The
  exact output is specified in section 5.1.
- **Introduces (new):** text cleaning (`.lower()`, `.strip()`), counting
  frequencies, `sorted` with `key=`/`reverse=`, f-string alignment, `"=" * n`
  and `.center()`. **Reviews:** files, `import`, `input()`, `try/except`,
  dict, set, slicing, two-file structure (`main.py` + `fungsi.py`).
- **Price and access:** Rp10.000 (`word-counter` in `content/pricing.ts`).
  **Chapters 1 and 2 are free**; Chapter 3 onward requires the purchase.
- Add a **project catalog / detail page** (master prompt pages #4 and #5) and
  gate purchase exactly like the main course (`purchases` table, admin QRIS
  verification already exist).
- Design the system so **more projects can be added later** by writing content
  files, not code.

## 4. Learning format

Same skeleton as the course: **story -> instructions -> code in the browser ->
check**. Three deliberate differences from course lessons:

1. **One program that grows (authored cumulative starters).** In the course
   every exercise stands alone. In a project, the starter of each lesson is the
   previous lesson's *model* answer plus the new part, so the learner always
   works on the same growing program. **The learner's own code is not carried
   over between lessons** (decision 2026-10-28, see 15.2 and 15.3).
2. **Looser instructions.** Course lessons give exact steps. Project chapters
   give a *goal and requirements*, plus progressive hints and an optional
   solution. The learner decides how to write it.
3. **Behavioral checking** instead of exact stdout matching (section 7).

Each chapter opens with a short **story** (e.g. "a client wants the word count
of their article") so it feels like a project, not another drill.

## 5. Word Counter specification (DECIDED 2026-10-28)

### 5.1 Target output

For input `artikel-kopi.txt` (the seed file, section 5.3):

```
==================================
           WORD COUNTER
==================================
Nama file: artikel-kopi.txt

Membaca file: artikel-kopi.txt

--- Ringkasan ---
Jumlah kata      : 92
Kata unik        : 59

--- 5 kata yang paling sering muncul ---
1. kopi        12
2. di           7
3. yang         5
4. banyak       4
5. orang        3
```

### 5.2 Rules (every lesson's expected output must follow these)

- **Banner:** `"=" * 34`, then `"WORD COUNTER".center(34)`, then `"=" * 34`.
  (The checker trims trailing spaces per line, so `.center` is safe.)
- **Prompt:** `input("Nama file: ")`; the echoed line is part of the output.
  A blank line follows it.
- **Status line:** `Membaca file: <nama>` (one colon style, no space before
  it), followed by a blank line. It is printed only after the file opened
  successfully.
- **Summary block:** `Jumlah kata      : N` and `Kata unik        : N`
  (colons aligned), blank line after.
- **Top-5 rows:** `f"{no}. {kata:<10}{jumlah:>4}"`. A word longer than 10
  characters pushes the number right; that is accepted and documented in the
  lesson.
- **What counts as a word:** lowercase the text, split on whitespace, strip
  punctuation from **both ends** of each piece (`string.punctuation`),
  and discard pieces that become empty. Hyphenated words (`sehari-hari`) stay
  one word. Numbers count as words.
- **Tie rule:** equal counts keep **first appearance in the text**. This is
  what a stable `sorted(..., reverse=True)` gives, so no `lambda` or tuple
  key is needed.
- **Missing file:** after the `Nama file:` line and a blank line print
  `File '<nama>' tidak ditemukan. Periksa kembali nama file.` and stop (no
  summary).
- **Empty file:** `Jumlah kata      : 0`, `Kata unik        : 0`, and the top-5
  section shows `(belum ada kata)`.
- **Fewer than 5 unique words:** show as many rows as exist.

### 5.3 Seed file `artikel-kopi.txt`

Written and verified with Python on 2026-10-28 (file kept in this repo's
content assets):

| Measure | Value |
|---|---|
| Pieces from raw `.split()` | 93 (one is a stand-alone `-`) |
| Words after cleaning | **92** |
| Unique, raw pieces (with punctuation and capitals) | 70 |
| Unique after cleaning | **59** |
| Top 5 | kopi 12, di 7, yang 5, banyak 4, orang 3 |
| Tie at count 3 | `orang`, `dan`, `biji` (first appearance picks `orang`; alphabetical order would pick `biji`) |

The differences 93 vs 92 and 70 vs 59 are used on purpose in Chapters 3 and 4
to show why cleaning is needed. Changing the article means re-verifying every
number above and every lesson that prints them.

### 5.4 Prerequisite audit (grep over Python Dasar chapters 1-13)

| Needed by the project | Status |
|---|---|
| `.split(" ")` (explicit separator), `len()`, slicing of **lists**, list loops | Taught (Ch. 9) |
| `.split()` with **no argument** (splits on spaces, double spaces and newlines) | **New nuance** (Bab 3 L1) |
| `"\n"` as a character, `.split("\n")` | Known (`\n` from Ch. 3 writing files, separator form from Ch. 9) |
| dict, `.items()` | Taught (Ch. 10) |
| `set` | Taught (Ch. 11) |
| `input()`, `open()`/`.read()`, `with`, `import`, modules, `main()` | Taught (Ch. 3) |
| `try/except FileNotFoundError` | Taught (Ch. 3, Ch. 12) |
| `.lower()`, `.strip()`, `string.punctuation` (a module, `import` is known) | **New** |
| `sorted(..., key=, reverse=True)` | **New** (`sorted` only appears on sets) |
| f-string alignment (`:<10`, `:>4`) | **New** |
| Row numbering | A plain counter variable (`nomor = nomor + 1`); `enumerate` is not used, its tuple-in-tuple unpacking is too heavy for one lesson |
| `"=" * 34`, `.center()` | **New** |

### 5.5 Chapter outline

Bab 1 and 2 are **free**; price of the rest is Rp10.000 for the whole project.
Chapters may be added later (see `AUTHORING_TEMPLATE_PROYEK.md` for how
to add one without breaking progress).

| # | Chapter | Lessons | New concept |
|---|---|---|---|
| 1 (free) | Menyiapkan Proyek | 1 Apa yang Akan Kita Bangun - 2 Mengenal Workspace Proyek - 3 Membuat Banner Program | `*`, `.center()` |
| 2 (free) | Membaca File Artikel | 1 Mengenal artikel-kopi.txt - 2 Membuka dan Membaca File - 3 Menampilkan Pesan "Membaca file" | review |
| 3 | Memecah Teks Menjadi Kata | 1 Memecah dengan .split() - 2 Menghitung dengan len() - 3 Masalah: "Kopi" dan "kopi," | `.split()` without argument; motivation (93 vs 92, 70 vs 59) |
| 4 | Membersihkan Kata | 1 Huruf Kecil dengan .lower() - 2 Menghapus Tanda Baca dengan .strip() - 3 Membuang Kata Kosong - 4 Fungsi bersihkan_kata() | `.lower()`, `.strip()` |
| 5 | Fungsi dan Modul | 1 Satu Fungsi untuk Semua Kata - 2 Memindahkan Fungsi ke fungsi.py - 3 Kata Unik dengan Fungsi | review (titles changed while writing: the program never needed a separate `hitung_kata()`, `len()` is enough) |
| 6 | Menghitung Frekuensi | 1 Dictionary Penghitung - 2 Fungsi hitung_frekuensi() - 3 Mengintip Isi dengan .items() | counting pattern |
| 7 | Mengurutkan 5 Teratas | 1 sorted() pada Pasangan - 2 key dan reverse - 3 Aturan Seri - 4 Fungsi urutkan_frekuensi() dan 5 Teratas | `sorted(key=, reverse=)` with a named helper function, no `lambda`; stability gives the tie rule |
| 8 | Merapikan Tampilan | 1 Rata Kiri dan Kanan di f-string - 2 Nomor Urut - 3 Merakit Laporan Lengkap | f-string format; counter variable |
| 9 | Input dan File Hilang | 1 Menanyakan Nama File - 2 Membungkus Alur dalam main() - 3 Pesan Ramah dengan try/except - 4 File Kosong dan Kata Sedikit | review (`main()` moved here from Bab 10: `return` inside it is what stops the program on a missing file) |
| 10 | Selesai dan Bawa Pulang | 1 Merapikan Kode dengan Komentar - 2 README dan Unduh Zip - 3 Menjalankan di Komputer Sendiri - 4 Unggah ke GitHub - 5 Tantangan Perluasan | take-home |

The extension challenge (e.g. ignore stopwords such as "di" and "yang",
top-10 instead of top-5) is **open-ended and not auto-checked**.

## 6. Workspace and data model

### 6.1 Workspace (UI)

- A **tab bar above the code editor** (like VS Code) switching between the
  project's files: `main.py` and `fungsi.py`.
- The set of files is **fixed by the project**. The learner cannot create,
  delete or rename files (no file manager).
- Edits to each file are saved to `localStorage` as the learner types
  (debounced), keyed by **user id + project slug + lesson id + file name**
  (each lesson has its own draft; decision 2026-10-28, see 15.2).

### 6.2 Persistence rules

> **Phase 2 (2026-10-28) - what is really built:** a project lesson's progress
> is stored in the existing `lesson_progress` table under a namespaced
> `chapter_slug` of the form `<project>/<chapter>` (for example
> `word-counter/menyiapkan-proyek`). There is **no `project_progress` table and
> no SQL to run**. The bullets below that mention that table are the original
> draft; read them together with 15.5.

- **No version history. UPDATE, not INSERT.** One row per (user, project).
  Never one row per lesson, never one row per save.
- `localStorage` is a *draft cache*: written while typing. Supabase is written
  only when the learner **passes a lesson or presses "Lanjut"** (not on every
  failed "Cek Jawaban").
- **Superseded (15.2):** the MVP stores no learner code on the server, so
  there is no server copy to compare. On load, use the local draft of that
  lesson if it exists, otherwise the authored starter.
- **Shared computers (warnet) are real:** key drafts by user id and clear them
  on logout.
- Safari on iPhone can evict `localStorage` for sites not visited for about a
  week. Accepted: the learner then gets the authored starter again, which
  already contains the previous result. Show "Draf tersimpan di perangkat ini".
- **No carry-over of the learner's code between lessons (decided
  2026-10-28).** Entering a lesson loads that lesson's authored starter (plus
  the learner's own draft for the same lesson, if any). See 15.2 and 15.3.
- Progress is self-reported (checks run client-side, same as the course). Do
  not try to enforce it server-side. Access to paid content *is* enforced
  server-side via `purchases`, as for the course.

### 6.3 Table (SUPERSEDED in Phase 2: not built, see 15.5; kept for reference)

```sql
create table public.project_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  project_slug text not null,
  -- no `files` column in the MVP (decision 2026-10-28, see 15.2)
  current_lesson text,
  completed_lessons text[] not null default '{}',
  help_used jsonb not null default '{}'::jsonb,    -- {"L3": "spoiler"}
  updated_at timestamptz not null default now(),
  primary key (user_id, project_slug),
  constraint project_help_size check (octet_length(help_used::text) < 5000)
);
```

- RLS: a user can select/insert/update **only their own row**. Include the
  explicit Data API grants (see the Oct 2026 note in `supabase/schema.sql`).
- The size `CHECK`s stop anyone using the column as free storage.
- Consider also requiring an approved purchase for `project_slug` on
  insert/update (look at how `purchases` identifies the product first).
- Without the `files` column a row is only a few hundred bytes, so the earlier
  egress estimate (about 6 KB per row) no longer applies.

### 6.4 Lesson starter (DECIDED 2026-10-28: full starters, no scaffold)

Every lesson ships its **complete starter files**: the previous lesson's model
answer plus the new `# TODO` part. There is no `scaffold` and no server-side
copy of the learner's code. The learner is told about this (15.3).

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
> `PROGRESS.md`). **Runaway-program safeguard built 2026-10-21** (Web Worker +
> timeout + Stop button + output cap, see the "Hangs" bullet below).
> **Not built yet:** the `behavior_tests` checker (hidden test
> script calling the learner's functions) and file upload into the virtual disk. Chapter 3 needed none of them
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
  deletes `artikel-kopi.txt`, the next run (and our tests) would see the
  changed file. **Before every run, rewrite all files from scratch**: the
  learner's files from the editor plus the seed files in their original state.
- **Seed files:** each project declares files (like `artikel-kopi.txt`) that
  are written into the working directory so `open("artikel-kopi.txt")` works.
- **`input()`:** add a small "Input program" box under the editor, one line per
  `input()` call, fed through Pyodide's stdin hook; tests use scripted input.
- **Hangs - DONE (2026-10-21).** An infinite loop used to freeze the tab
  (Pyodide on the main thread). Now the program runs in a Web Worker
  (`public/pyodide-worker.js`, a plain classic worker; the Python harness is
  sent to it in the `init` message so there is one source of truth). In
  `lib/pyodide.ts`: after `RUN_TIMEOUT_MS` (8 s, not counting Pyodide's load
  time) or when the learner presses **Hentikan** (`stopRun()`), or if the
  worker crashes (e.g. out of memory), the page calls `worker.terminate()`,
  starts a fresh worker in the background and shows a clear Indonesian message
  (`RunResult.stopped = true`; the checker treats it as an error, so "Cek
  Jawaban" can never pass on it). Learner `try/except` cannot swallow it. The
  harness also caps captured output at 100,000 characters (`_PymulaOut`) so an
  endless `print` fails fast with a message instead of eating memory. Runs are
  queued one at a time. No `SharedArrayBuffer` / COOP-COEP headers are needed
  (that is why we terminate instead of using Pyodide's interrupt buffer). If a
  browser has no `Worker`, it falls back to the main thread (works, but without
  the safeguard). Trade-off: after a stop, the next run waits for Pyodide to
  re-initialise (a few seconds; files come from the browser cache).
- None of the above touches Supabase or Vercel; it all happens in the learner's
  browser memory.

## 9. Take-home (the CV part)

Done in the browser, **no server cost**:

- **Download** a zip built client-side (use `fflate` or JSZip, via Blob and an
  `<a download>`): `main.py`, `fungsi.py`, a generated `README.md` (what it does,
  how to run it, what was learned) and `artikel-kopi.txt`.
- **Run it locally:** one lesson on installing Python and running
  `python main.py` on their own machine. This proves the program is theirs and
  covers the file/input parts that the browser only simulates.
- **GitHub guide:** five steps using GitHub's web upload (no git needed). The
  repo link is what goes on a CV.
- **Extension challenge** (open-ended, not auto-checked).
- **Honesty note (15.2):** because the learner's code is not carried between
  lessons, the zip holds the code of the last lesson, which started from the
  authored model. The README and the page copy must say so and must not claim
  the whole program was written from scratch by the learner.
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
- **Account / settings page - DONE (2026-10-21), needs real-project testing.**
  Route `/akun` (protected in `middleware.ts`, linked as "Akun" in the header):
  change name, change password, delete account. Decisions (owner, 2026-10-21):
  payment-proof screenshots are saved on the owner's own device and deleted from
  Supabase **by hand** (no automatic delete on approve/reject); after deleting an
  account the same email can register again but starts from scratch (progress and
  paid access do NOT come back). `purchases` is kept as an **anonymous**
  transaction record: `supabase/schema_phase5_account.sql` makes `user_id` and
  `proof_path` nullable and the user FK `ON DELETE SET NULL` (before this, the
  cascade silently erased the sales ledger). Delete flow
  (`lib/account.ts` `deleteAccountFlow`, wired in `app/akun/actions.ts`): password
  re-check -> migration check (`purchases_survive_user_deletion()`; refuses if
  the migration was not run) -> admins cannot delete themselves -> a `pending`
  payment blocks deletion -> remove the user's files in `payment-proofs/<id>/` ->
  null `note` / `proof_path` -> delete the auth user LAST (hard delete, email
  freed). Every step before the last is harmless if a later one fails, so the
  button can be pressed again. Needs `SUPABASE_SERVICE_ROLE_KEY` (server only,
  `lib/supabase/admin.ts` imports `server-only`). Rename updates BOTH
  `profiles.name` and the auth metadata (the greeting reads the metadata).
  Password change re-checks the current password on a stateless client, then
  signs out the other sessions. Email cannot be changed (out of MVP scope).
  Legal note (information, not advice; the owner is not a lawyer either): UU PDP
  Art. 43 requires deletion on request, with exceptions for legal obligations;
  keeping an anonymous ledger is the cautious middle path. Say so in the
  terms/privacy text ("bukti pembayaran dihapus setelah diverifikasi; catatan
  transaksi disimpan tanpa identitas").

- **Account page follow-ups - DONE (2026-10-21).** (1) "Keluar" moved from the
  header to `/akun` (own section; the header now shows Dashboard + Akun).
  (2) Every password field uses `components/ui/PasswordInput.tsx`: hidden by
  default, eye toggle (a plain `type="button"` with `aria-pressed`), phone
  autocorrect/capitalise off; a test fails if a raw `type="password"` is added
  anywhere else. (3) **Forgot password**: "Lupa password?" on `/login`, plus links
  in the change-password and delete-account forms, all to `/lupa-password`
  (email -> `resetPasswordForEmail`, always the same neutral answer so accounts
  cannot be probed, 60 s resend cooldown, rate-limit message). The email link opens
  `/auth/callback` (`code` exchange, or `token_hash` + `type=recovery`), which sets
  a 15-minute httpOnly cookie `pymula_recovery` and redirects to `/reset-password`.
  That page and its action REQUIRE the cookie: a recovery session is an ordinary
  signed-in session, and this page changes the password without the old one, so an
  ordinary (possibly stolen) session must not be able to use it. After a reset the
  other sessions are signed out. The callback only redirects to an allow-list
  (`/reset-password`, else `/`), so it cannot be an open redirect. Logic is in
  `lib/password-reset.ts` (tested). Needs the dashboard setup in the README.

- **Service life, About page, FAQ, pop-up - DONE (2026-10-22).** Owner
  decisions: the owner may stop maintaining the site at any time and plans at most
  until October 2027; no permanent countdown banner; a pop-up at least 30 days
  before the end; after the end the domain, Supabase and anything else paid are
  NOT renewed; the domain `pymula.live` expires 17 Oktober 2027; full refund for
  purchases in the last 45 days before the end; contact by the `pymula.live` email
  and WhatsApp. Design: `lib/site-config.ts` holds every number and the pure
  functions `serviceState / salesOpen / daysLeft / formatDateId`. The default end
  is **1 Oktober 2027 23:59 WIB** (16 days before the domain expires; a test
  enforces at least 14). States: `active` -> `notice` (from 45 days before:
  pop-up once a day, paid chapters not sold, "Penjualan sudah ditutup" on the
  purchase page) -> `ended` (after the end: the middleware REWRITES every request
  to `/selesai` before the real page runs, because Next.js would otherwise still
  execute pages and call the deleted Supabase; the layout draws `Farewell`, which
  imports no Supabase code; static assets are excluded from the matcher). The
  middleware matcher now covers all pages but returns immediately for pages that
  do not need a session (`needsSession`), so there is no extra Supabase call per
  page view. The notice appears automatically for the planned end date even if the
  owner never touches the site; stopping earlier = edit `SERVICE_END_ISO` (at
  least 30 days ahead), see `SHUTDOWN.md`. The old "Sekali bayar, akses
  selamanya" wording was replaced by an upfront disclosure (what is bought, the
  planned maximum end date, may end earlier, 30-day notice, refund rule) on the
  purchase page, the course page and the course list, and a full `/tentang` page
  (what it is, who runs it, status, price, refund, data and privacy, closing
  timeline, contact, 17-question FAQ). Downloads are mentioned only when
  `DOWNLOADS_AVAILABLE` is true (not built yet). Known limit: the sales cut-off
  is enforced in the UI and the purchase page, not in the database.

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

> Partly superseded by section 15 (phases and decisions of 2026-10-28).

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
   `starterFiles`, `solutionFiles`, tests, seed files, README template). The
   extension is `content/AUTHORING_TEMPLATE_PROYEK.md` (written 2026-10-28).
4. **Later:** optional file upload into the virtual FS,
   public share page, "Lewati" button if data supports it.

### Tentative content shape (for step 3; not yet in `content/types.ts`)

```ts
type ProjectContent = {
  slug: string; title: string;
  files: string[];                           // fixed, e.g. ["main.py", "fungsi.py"]
  seedFiles: Record<string, string>;         // e.g. "artikel-kopi.txt"
  readmeTemplate: string;
  chapters: { id: string; title: string; lessons: ProjectLesson[] }[];
};
type ProjectLesson = {
  id: string; slug: string; title: string;
  story: string; instructions: string; hints: string[];
  starterFiles: Record<string, string>;      // full authored starter per lesson (no scaffold in the MVP)
  solutionFiles: Record<string, string>;     // spoiler: read-only + Copy
  checker: { type: "behavior_tests"; tests: string } | { type: "stdout_exact"; expected: string };
  successFeedback: string;
};
```

## 13. Decisions log

**Decided:** hybrid format (browser coding + take-home); two-file workspace
with authored cumulative starters (the learner's code is not carried over, see
15.2); one `project_progress` row per user per project, upsert on pass /
"Lanjut"; localStorage draft cache; behavioral tests for function lessons
(deferred, see 15.2);
spoiler read-only + Copy (no overwrite, no "Lewati" in MVP); `help_used` for
owner analytics; downloads generated in the browser; desktop + mobile support;
editor = CodeMirror 6 lazy-loaded (section 11); build order in section 12.

**Deferred:** Web Worker timeout, file upload, public share page, "Lewati"
button, certificates (excluded by master prompt).

**Decided 2026-10-28:** Word Counter output and rules (section 5.1-5.2); seed
file `artikel-kopi.txt` (section 5.3); 10-chapter outline (section 5.5); price
Rp10.000; **Bab 1 and 2 free**; chapter slugs of project courses carry no
number so chapters can be added later; files written in the course template
format plus `AUTHORING_TEMPLATE_PROYEK.md`.

**Decided 2026-10-28 (planning):** phases in 15.1; the learner's code is NOT
carried between lessons (full authored starters, no `project_progress.files`);
the learner is told in Bab 1 L2 and on the project pages (15.3); Bab 10
non-gradable lessons end in a short quiz; `behavior_tests` deferred;
Bab 1-2 free.

**Open:** README template wording; revisit code carry-over after launch if
learner data shows a need; account-deletion policy for purchases (see
`PROGRESS.md`).

## 14. Verification checklist (before calling a step done)

Step 1 (runner):
- Edit `fungsi.py`, run twice: the second run uses the edited code.
- Learner code deletes/edits `artikel-kopi.txt`: the next run sees the
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

## 15. Work plan: phases and decisions (DECIDED 2026-10-28)

### 15.1 Phases

Not "all content first" and not "one chapter at a time": build a **vertical
slice** first, then add chapters in batches of 2-3 (the same rhythm as Python
Dasar).

| Phase | Work | Done when | Status |
|---|---|---|---|
| 1. Slice content | Write Bab 1, 2, 3 in template format; fix the spec and seed file | Bab 1-3 verified with real Python (answers pass, starters fail) | **Done 2026-10-28** (owner review pending) |
| 2. Minimal platform | Define `ProjectContent`; project routes under `/proyek/[project]/...`; purchase gate for `word-counter`; convert Bab 1-3 to `.ts`; extend the tests; confirm `npm test` runs in the sandbox | Learner can study Bab 1-3 on a real device and Bab 3 is locked until purchase | **Built and tested in the sandbox 2026-10-28.** Still needs the owner's manual test with the real Supabase and a phone (15.5) |
| 3. Remaining chapters | Batches: Bab 4-6, Bab 7-9, Bab 10. Each batch: write, convert, test, fix. Bab 10 adds zip download and README generator | Each batch passes tests before the next starts | **Batch 1 (Bab 4-6) written and tested 2026-10-28.** **Batch 2 (Bab 7-9) written and tested 2026-10-28.** Batch 3 (Bab 10) not started |
| 4. Polish and release | `/proyek` catalog page, SEO and robots, QRIS test, mobile test | Ready to take payment | Not started |

### 15.2 Decisions

1. **No carry-over of the learner's code between lessons.** Each lesson
   loads its authored starter (previous model answer + new `# TODO`). The
   learner's draft is kept only for the same lesson (localStorage, per lesson).
   Consequences:
   - `project_progress.files` and its size check are dropped (6.3); `scaffold`
     is dropped (6.4).
   - The take-home zip (Bab 10) contains the code of the last lesson, which
     started from the authored model. It must be described honestly, not as
     "the whole program you wrote yourself from scratch" (see section 1,
     honest positioning).
   - Revisit after launch if learner data shows a need.
2. **Bab 10 lessons that cannot be auto-checked** (run it on your own
   computer, upload to GitHub) end with a short comprehension quiz, because
   every lesson must end in a quiz or code practice.
3. **`behavior_tests` is deferred.** `stdout_exact` plus `source requirements`
   are enough for Bab 1-9.
4. **Features arrive with the chapter that needs them:**

| Feature | Needed from | Status |
|---|---|---|
| Multi-file, read-only files, `stdin`, `source requirements` | Bab 1 | Exists |
| Purchase gate + progress per project | Bab 3 | Phase 2 |
| Zip download, README generator | Bab 10 | Phase 3 |
| `behavior_tests` | not needed | Deferred |

5. **Delivery format:** content is delivered as a zip whose paths mirror the
   repo, so it can be extracted at the repo root.

### 15.3 Telling the learner about decision 1

The learner must not discover this by surprise. Required copy:

- **Bab 1 L2** (done): a "Penting" box says each lesson has its own starter
  and that the learner's earlier code is not carried over automatically.
- **Project detail page** (Phase 2/4): one FAQ line saying the same.
- **Workspace hint** (Phase 2): a small line near the editor, for example
  "Kode awal setiap lesson sudah disiapkan. Kodemu dari lesson sebelumnya
  tidak dibawa otomatis."
- **Authoring rule:** never write "kodemu tersimpan" or "lanjutkan kodemu"
  in lesson theory.

### 15.4 Division of work

Claude writes the content, converts it to `.ts`, builds the platform in a copy
of the repo, and runs `npm test` (the test script uses the `pyodide` npm
package, which should run in the sandbox; to be confirmed at the start of
Phase 2). The owner runs the Supabase SQL, tests on a real phone, and commits.

### 15.5 Phase 2: what was built, deviations, and what is still open

**Built (2026-10-28).**

- `ProjectContent` in `content/types.ts`. A project's chapters reuse
  `ChapterContent`, so the existing lesson UI works unchanged: `Challenge`
  (hints, spoiler, `answerFiles`), `QuizRunner`, multi-file `CodeRunner` with tabs
  and read-only files, and `sourceRequirements` per file. The workspace did not
  need to be built.
- Content: `content/projects/word-counter/` (`bab-N-*.md` are the source,
  `chapter-N.ts` are **generated**, `todo.ts` lists Bab 4-10, `index.ts`) and
  the registry `content/projects/index.ts`.
- Converter `scripts/convert-project-md.mjs <project>` (strict: unknown input is
  an error). `--check` runs inside `npm test`, so a `.ts` that differs from its
  `.md` fails the tests. Never edit `chapter-N.ts` by hand.
- Routes: `/proyek` (catalog), `/proyek/[project]` (project page, public),
  `/proyek/[project]/[slug]` (chapter entry), `.../[lessonId]` (lesson),
  `/proyek/[project]/beli` (purchase). Everything below `/proyek/<slug>/` needs
  an account (`lib/route-guard.ts`); free/paid is enforced on the server per chapter.
- **Fenced code blocks in lesson text** (added after the first review found that
  the UI collapsed the spaces of an exact output line): a block between two
  lines holding only three backticks is rendered monospace with every space
  kept (`lib/lesson-text.ts`, `LessonText.tsx`). Python Dasar lessons never used
  backticks, so nothing there changes. The lossless text test now also runs over
  project chapters.
- **Authoring guards in `scripts/test-projects.mjs`:** no prose relies on runs of
  spaces, no hint contains a copyable answer line, and every line shown in an
  instructions code block is a line of the checked output. Hints are nudges, not
  answers (template rule 5).
- Existing code touched: `LessonNav` (optional `basePath` and `keyPrefix`
  props, defaults unchanged), `route-guard.ts`, `pricing.ts`, `content/types.ts`,
  `app/proyek/page.tsx` (placeholder replaced by the catalog), and the Pyodide
  test script. Python Dasar pages are untouched.
- Tests: `scripts/test-projects.mjs` (the number of checks grows with every batch) and the Pyodide test now runs the
  project lessons too (answer passes, starter fails, examples run, in the real
  Pyodide). `npm test` = all green, `tsc` clean, `next build` succeeds.

**Deviations from the draft design (decided while building).**

1. **No `project_progress` table, no new SQL.** Progress reuses `lesson_progress`
   with the chapter slug `<project>/<chapter>`. Reason: with no code carry-over
   (15.2) the only thing the table would hold is "which lessons are done", which
   `lesson_progress` already stores. The namespace cannot collide with a
   Python Dasar slug and the Python Dasar progress maths ignores project rows
   (tested). Consequence: `help_used` (6.5) is **not recorded yet**. If you want
   it, add a column or table later.
2. **Purchases need no SQL either.** `purchases.course_slug` is free text; the
   project's slug (`word-counter`) is the key, the price comes from `pricing.ts`.
3. **Examples that are not Python** (program output, article text) are marked
   `run: no` in the `.md` and are published as a plain code section, because the
   test suite runs every `example` as Python.
4. **Duplication on purpose:** `content/projects/index.ts` repeats a few helpers of
   `content/chapters/index.ts` instead of refactoring them, to leave the working
   Python Dasar code alone. Merge them later if it becomes a burden.

**Not done yet (deliberately out of the slice).**

- Pages are `noindex`; sitemap and `INDEXABLE_PATHS` come in Phase 4.
- Dashboard (`DashboardHome`) and `/akun` still know only Python Dasar: no
  "continue the project" card, and `/akun` shows only that purchase.
- The admin purchases list was not checked for how it labels a non-Python-Dasar
  `course_slug`.
- `LessonNav` labels chapters "Ch3"; the project text says "Bab 3".
- Bab 10's zip download (`DOWNLOADS_AVAILABLE` stays `false` until it exists).
- **Sales window:** `site-config.ts` closes paid sales 45 days before
  `SERVICE_END_ISO` (1 Oktober 2027). The project can therefore be sold for about
  nine and a half months at most, and a buyer's access ends with the service.
  The purchase page repeats the same warnings as Python Dasar.

**Manual test checklist for the owner** (needs the real Supabase and a phone; none
of this can be exercised in the sandbox). Run `npm run build && npm start`, or
use the deployed preview.

1. Logged out: `/proyek` and `/proyek/word-counter` open; a lesson URL redirects to
   login and returns to the lesson after login.
2. Logged in, not purchased: Bab 1 L1 (quiz) passes; after passing, the page shows
   the tick and the progress bar moves (the page calls `router.refresh()`).
3. Bab 1 L2 and L3 (code): the three tabs appear, `artikel-kopi.txt` is read-only,
   "Cek Jawaban" passes with the answer, hints appear one by one, the spoiler
   shows `main.py`.
4. Type something in L3, leave, come back: the draft is still there. Open another
   lesson: it starts from its own starter (by design).
5. Reload the project page: progress persisted (`lesson_progress` has rows with
   `chapter_slug = word-counter/...`).
6. Bab 3 L1 URL while not purchased: redirected to `/proyek/word-counter/beli`.
7. Purchase flow: upload a proof, status "Menunggu verifikasi"; approve it in
   `/admin/purchases` (check how the project row is labelled); Bab 3 opens.
8. Phone (Safari and Chrome): editor tabs usable, keyboard does not hide the
   Run button, the project page is readable.
9. Python Dasar still works end to end (progress, purchase page).

### 15.6 Phase 3, batch 1 (Bab 4-6): what was written and what the next batch starts from

**Numbers each lesson promises** (the tests recompute them independently from
`artikel-kopi.txt`): raw 93 words / 70 unique -> lowercase 64 unique -> strip
punctuation 60 unique (one empty "word" still counts) -> drop empty words 92 / 59.

| Bab | Lessons | Where the code lives at the end |
|---|---|---|
| 4 Membersihkan Kata | `.lower()`, `.strip(string.punctuation)`, drop empty words, `bersihkan_kata()` | all in `main.py` |
| 5 Fungsi dan Modul | `daftar_kata(teks)`, move `import string` and both functions to `fungsi.py`, `hitung_unik(daftar)` | `fungsi.py`: `bersihkan_kata`, `daftar_kata`, `hitung_unik`; `main.py`: banner, status line, summary |
| 6 Menghitung Frekuensi | dict counter in `main.py`, `hitung_frekuensi(daftar)` in `fungsi.py`, `.items()` | adds `hitung_frekuensi` to `fungsi.py` |

**Temporary output, to be replaced in Bab 7.** The end of Bab 6 prints, after the
summary, a blank line, `Kata yang muncul 3 kali atau lebih:` and the words with
3 or more occurrences in dict order (`kopi: 12`, `yang: 5`, `banyak: 4`,
`orang: 3`, `di: 7`, `dan: 3`, `biji: 3`). Bab 7 replaces this with the sorted
top-5 block of section 5.1. The dict order shown here is the first-appearance
order that the tie rule relies on (`orang` before `dan` before `biji`).

**Writing notes learned in this batch.**

- Refactor lessons (output unchanged) can only fail their starter through
  `source requirements`. Each one therefore requires the new `def`, a use of it,
  and for module moves a check per file (`fungsi.py must contain: ...`).
- A requirement must not forbid valid solutions: Bab 6 L1 only asks for an empty
  dictionary (`{}`), because `.get()` or `in` are both fine.
- The loop variable in the Bab 6 counter is called `kata`, which no longer clashes
  with anything in `main.py` after Bab 5 removed the raw `kata` list.
- Examples that show two files use `run: no` (Bab 5 L2).

### 15.7 Phase 3, batch 2 (Bab 7-9): what was written and what Bab 10 starts from

After Bab 9 the program prints **exactly** the target output of section 5.1. The
test suite compares Bab 9 L1 against that text written out literally (not
computed), and it also checks the missing-file and empty-file outputs.

| Bab | Lessons | New in the code |
|---|---|---|
| 7 Mengurutkan 5 Teratas | `sorted()` on pairs (alphabetical by default), `key=ambil_jumlah` + `reverse=True`, the tie rule (ranks 4-7 show orang, dan, biji), `urutkan_frekuensi()` + `[:5]` | `fungsi.py` gains `ambil_jumlah` and `urutkan_frekuensi` |
| 8 Merapikan Tampilan | `{kata:<10}{jumlah:>4}`, a counter variable for the row number, the exact section heading | formatting only, in `main.py` |
| 9 Input dan File Hilang | `input("Nama file: ")`, whole flow wrapped in `main()`, `try/except FileNotFoundError` with `return`, empty file prints `(belum ada kata)` | `main.py` is now `def main(): ...` + `main()` |

**Where the code stands at the end of Bab 9.**

- `fungsi.py`: `import string`, `bersihkan_kata`, `daftar_kata`, `hitung_unik`,
  `hitung_frekuensi`, `ambil_jumlah`, `urutkan_frekuensi`.
- `main.py`: one import line, `def main():` (banner, `input`, `try/except` around
  the read, summary, top-5 loop with a counter, the empty-list check), then `main()`.
- The learner's last lesson (Bab 9 L4) therefore holds the finished program: this
  is what Bab 10's README and zip must contain (see the honesty note in section 9).

**Decisions made while writing.**

- **`main()` moved from Bab 10 to Bab 9 L2.** A friendly error has to stop the
  program before the summary, and `return` inside a function is the clean way.
  Bab 10 L1 becomes "Merapikan Kode dengan Komentar".
- **Row numbers use a counter variable, not `enumerate`** (see 5.4).
- **Sorting uses a named helper (`ambil_jumlah`) instead of `lambda`**, and the tie
  rule comes from the stability of `sorted()`; there is no tuple key.
- **Converter:** `scripts/convert-project-md.mjs` now supports `stdin:` (one line
  per `input()` call, between the files and `hints:`) and the tests check that
  every stdin line is echoed like a terminal. Extra read-only data files are
  allowed (`kosong.txt` in Bab 9 L4).
- **Bab 9 L4 teaches two cases but practises one.** "Fewer than five words" needs
  no code (slicing already copes), so it is explained and shown in the example;
  only the empty file is practised, because that one needs an `if`.

**Bab 10 (batch 3) must do:** README and zip are the platform work that was
deferred: a client-side zip of the learner's `main.py` and `fungsi.py`, a README
generator, and flipping `DOWNLOADS_AVAILABLE` in `lib/site-config.ts` to `true`
only once the download really works. Lessons that cannot be auto-checked (running
it on your own computer, uploading to GitHub) end with a short quiz (15.2). The copy
must say that the zip holds the code of the last lesson, which started from the
authored model (15.2). Plan the extension challenge (for example ignoring words
such as "di" and "yang", or top 10) as open-ended and not auto-checked.
