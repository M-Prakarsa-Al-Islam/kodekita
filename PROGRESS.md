# KodeKita — Progress Log

Upload this file (plus the repo, plus `master_builder_prompt.md`) at the
start of a new chat and say "continue KodeKita from Phase X" — or, for a
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
- **Design tokens:** paper `#F3F5F5`, ink `#171B24`, sun (CTA) `#F2A93B`,
  code/success `#0F8A6B`. Fonts: Fraunces (display), Inter (body), JetBrains
  Mono (code).

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
- [ ] Phase 4 - Commerce (QRIS payment page, proof upload, admin
      verification, real chapter-locking using `isFree` + purchase status)
- [ ] Phase 5 - Project courses (starting with "Build a Word Counter")
- [ ] Phase 6 - Polish & launch

## Chapter content status (Python Dasar, 13 chapters)

Check this first before writing new content.

| # | Slug | Title | Free? | Lessons | Status |
|---|------|-------|-------|---------|--------|
| 1 | `1-pengenalan` | Pengenalan Python | Yes | L1-L5 (code x5: run-first, print, angka, multi-print, tantangan) | **Published** (revised) |
| 2 | `2-variabel` | Variabel dan Tipe Data | Yes | L1-L8 (quiz x2, code x6: buat/print, komentar, tipe data, concat, f-string, tantangan) | **Published** (revised) |
| 3 | `3-fungsi` | Fungsi | Yes | L1-L7 (quiz x3, code x4: call-a-function, return+params, main(), tantangan) | **Published** |
| 4 | `4-scope` | Scope | Yes | - | Todo |
| 5 | `5-testing-debugging` | Testing & Debugging | Yes | - | Todo |
| 6 | `6-computing` | Computing | No | - | Todo |
| 7 | `7-perbandingan` | Perbandingan | No | - | Todo |
| 8 | `8-loop` | Loop | No | - | Todo |
| 9 | `9-list` | List | No | - | Todo |
| 10 | `10-dictionary` | Dictionary | No | - | Todo |
| 11 | `11-set` | Set | No | - | Todo |
| 12 | `12-error` | Error | No | - | Todo |
| 13 | `13-type-hints` | Type Hints | No | - | Todo |

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

### How to write the next batch (2-3 chapters)

1. Fill in `content/AUTHORING_TEMPLATE.md`'s template for each chapter and
   send it back (chat or file upload).
2. I'll convert it into `content/chapters/chapter-N.ts` following the
   `chapter-1.ts`/`chapter-2.ts` pattern, verify every code practice's
   expected output against real Python and every quiz has one correct
   answer, add it to `index.ts`, remove it from `todo.ts`, and update the
   table above.

## Next steps

1. Run, in order: `supabase/schema.sql`, `supabase/schema_phase2.sql`,
   `supabase/schema_phase2b.sql` in a real Supabase project (the last one
   drops the old `chapter_progress` table - fine, no real users yet). Set
   env vars locally and in Vercel.
2. Confirm end-to-end on a real deploy: register -> homepage shows
   dashboard -> `/kursus/python-dasar` shows progress badges -> Chapter 1
   L1 (quiz) -> L2 (code) -> completes -> Chapter 2 -> progress reflected
   on homepage "continue" link. Also confirm logged-out visitors see the
   gated marketing homepage and get redirected to login when clicking a
   chapter.
3. Next content session: write chapters 3-5 (finishes the free tier) using
   `content/AUTHORING_TEMPLATE.md`.
4. Once ch1-5 are solid, start Phase 4 (commerce) in parallel with writing
   ch6-13 - a real QRIS/payment flow matters more for the homework goal
   than having all 13 chapters done.

## Open questions for the team

- Exact final price (Rp25.000 assumed) and QRIS account to use - needs a
  real bank/e-wallet static QRIS before Phase 4.
- Who is writing chapters 3-13 and the Word Counter project - use the
  authoring template, can run in parallel with Phase 4 dev.
