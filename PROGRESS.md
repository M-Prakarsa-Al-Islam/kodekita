# KodeKita — Progress Log

Upload this file (plus the repo, plus `master_builder_prompt.md`) at the
start of a new chat and say "continue KodeKita from Phase X" to resume.

## Key decisions so far

- **Stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + Supabase
  (auth + Postgres). Deploy target: Vercel.
- **Code execution:** Pyodide, client-side, in-browser. NOT a server-side
  sandbox. (Piston's public API stopped being free as of Feb 15, 2026;
  self-hosting a sandbox was judged unnecessary complexity for a Python-only
  course. This removes the backend execution layer from the architecture
  entirely — no execution API, no isolate/Docker sandbox to run or secure.)
- **Pricing:** Python Dasar Rp25.000 (cap: ≤Rp30.000). Free: ch1–5. Paid:
  ch6–13. Project courses cheaper, e.g. Rp10.000, price configurable not
  hardcoded.
- **Payment:** manual QRIS, admin-verified. No payment gateway integration.
- **Design tokens:** paper `#F3F5F5`, ink `#171B24`, sun (CTA) `#F2A93B`,
  code/success `#0F8A6B`. Fonts: Fraunces (display), Inter (body), JetBrains
  Mono (code).

## Phase status

- [x] **Phase 1 — Foundation.** Project scaffold, design system, landing
      page, header/footer, auth (register/login/logout via Supabase),
      protected `/dashboard` placeholder, `profiles` table + signup trigger.
- [ ] Phase 2 — Course system (courses/chapters/lessons schema, catalog,
      course detail page, free/locked indicators, progress tracking)
- [ ] Phase 3 — Interactive learning (Pyodide-based in-browser editor,
      deterministic challenge checking, hints)
- [ ] Phase 4 — Commerce (QRIS payment page, proof upload, admin
      verification, course unlocking)
- [ ] Phase 5 — Project courses (starting with "Build a Word Counter")
- [ ] Phase 6 — Polish & launch

## Next steps (start of next session)

1. Run `supabase/schema.sql` in a real Supabase project; set env vars locally
   and in Vercel; confirm register/login/dashboard work end-to-end on a real
   deploy.
2. Start Phase 2: design the `courses` / `chapters` / `lessons` / `progress`
   tables, build the course catalog page and the Python Dasar course detail
   page with free (ch1–5) vs. locked (ch6–13) indicators.

## Open questions for the team

- Exact final price (Rp25.000 assumed) and QRIS account to use — needs a
  real bank/e-wallet static QRIS before Phase 4.
- Who is writing the Indonesian lesson content for chapters 6–13 and the
  Word Counter project — this can start in parallel with Phase 2/3 dev.
