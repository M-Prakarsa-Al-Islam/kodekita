# KodeKita

Indonesian-language, hands-on Python learning platform. Entrepreneurship MVP —
see `PROGRESS.md` for current phase and decisions, and `master_builder_prompt.md`
(kept alongside this repo, not inside it) for the full build spec.

## Stack

Next.js 14 (App Router) + TypeScript + Tailwind CSS + Supabase (auth + database).
Code execution will run client-side via Pyodide (Phase 3) — no server-side
sandbox.

## Local setup

1. Create a free project at https://supabase.com.
2. In the Supabase SQL editor, run `supabase/schema.sql`.
3. Copy `.env.example` to `.env.local` and fill in your project's URL and anon
   key (Supabase dashboard → Project Settings → API).
4. Install and run:

   ```bash
   npm install
   npm run dev
   ```

5. Open http://localhost:3000 — try registering an account and confirm it
   reaches `/dashboard`.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel.
3. Add the same two env vars from `.env.local` in the Vercel project settings
   (Environment Variables).
4. Deploy. Confirm register/login works against the *same* Supabase project
   you set up locally.

## What's built (Phase 1)

- Landing page, header, footer
- Register / login / logout (Supabase auth)
- Protected `/dashboard` (redirects to `/login` if not signed in)
- `profiles` table with a trigger that creates a row on signup

## What's next (Phase 2)

Courses, chapters, lessons data model; course catalog page; course detail
page with free/locked chapter indicators. See `PROGRESS.md`.
