-- KodeKita — Phase 2b schema addition
-- Run this in the Supabase SQL editor, after schema.sql and schema_phase2.sql.
--
-- Chapters now contain multiple lessons, so progress needs to be tracked
-- per lesson, not per chapter. Safe to drop chapter_progress outright: no
-- real users/purchases exist yet at this stage of the project.

drop table if exists public.chapter_progress;

create table if not exists public.lesson_progress (
  user_id uuid references public.profiles(id) on delete cascade,
  chapter_slug text not null,
  lesson_id text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, chapter_slug, lesson_id)
);

alter table public.lesson_progress enable row level security;

create policy "Users can view their own lesson progress"
  on public.lesson_progress for select
  using (auth.uid() = user_id);

create policy "Users can upsert their own lesson progress"
  on public.lesson_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own lesson progress"
  on public.lesson_progress for update
  using (auth.uid() = user_id);

-- Explicit Data API grants (see the matching note in schema.sql).
-- Not granting `anon`: guests never have progress to read or write.
grant select, insert, update on public.lesson_progress to authenticated;
grant select, insert, update, delete on public.lesson_progress to service_role;

-- Phase 4 will add: purchases, payment_proofs, and will use chapter
-- metadata (isFree) to gate access to chapters 6-13 server-side.
