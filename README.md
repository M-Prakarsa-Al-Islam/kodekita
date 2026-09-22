# KodeKita

Indonesian-language, hands-on Python learning platform. Entrepreneurship MVP —
see `PROGRESS.md` for current phase, decisions, and chapter-by-chapter content
status. `master_builder_prompt.md` and the original concept spec are kept
alongside this repo (not inside it) as the stable original vision; both now
have "Implementation note" callouts wherever the build diverged from them.

## Stack

Next.js 14 (App Router, pinned to `14.2.35`) + TypeScript + Tailwind CSS +
Supabase (auth + database). Code execution runs entirely client-side via
Pyodide (`lib/pyodide.ts`) — no server-side sandbox.

## Content model

Chapter/lesson content (theory, examples, quizzes, code challenges) lives as
code in `content/chapters/*.ts`, not in the database — see
`content/AUTHORING_TEMPLATE.md` for the plain-text format used to write new
chapters. The database only tracks accounts and per-user lesson progress
(`lesson_progress`), plus purchases from Phase 4 onward.

## Local setup

1. Create a free project at https://supabase.com.
2. In the Supabase SQL editor, run these in order:
   - `supabase/schema.sql`
   - `supabase/schema_phase2.sql`
   - `supabase/schema_phase2b.sql`
3. Copy `.env.example` to `.env.local` and fill in your project's URL and anon
   key (Supabase dashboard → Project Settings → API).
4. Install and run:

   ```bash
   npm install
   npm run dev
   ```

5. Open http://localhost:3000. Register an account and confirm the homepage
   switches to the dashboard view; visit `/kursus/python-dasar` and complete
   Chapter 1's two lessons (one quiz, one code challenge).

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel.
3. Add the same two env vars from `.env.local` in the Vercel project settings
   (Environment Variables).
4. Deploy. Confirm register/login and the chapter/lesson flow work against
   the *same* Supabase project you set up locally.

## What's built

- Landing page (logged-out) / dashboard (logged-in) at `/`, header, footer
- Register / login / logout (Supabase auth), with redirect-back after login
- `/kursus` catalog, `/kursus/python-dasar` chapter list (public, shows
  progress when logged in), chapter/lesson pages (require login)
- Pyodide-based code runner + quiz runner, with a tested checker
  (`scripts/test-checker.mjs`)
- Chapters 1–2 written for real (2 lessons each); chapters 3–13 stubbed as
  `todo` — see `PROGRESS.md` for the full table

## What's next

Write chapters 3–5 (finishes the free tier) using
`content/AUTHORING_TEMPLATE.md`, and/or start Phase 4 (QRIS commerce). See
`PROGRESS.md` for details.
