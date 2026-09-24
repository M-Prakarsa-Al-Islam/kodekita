-- KodeKita — Phase 2 schema addition
-- Run this in the Supabase SQL editor, after schema.sql.

create table if not exists public.chapter_progress (
  user_id uuid references public.profiles(id) on delete cascade,
  chapter_slug text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, chapter_slug)
);

alter table public.chapter_progress enable row level security;

create policy "Users can view their own progress"
  on public.chapter_progress for select
  using (auth.uid() = user_id);

create policy "Users can upsert their own progress"
  on public.chapter_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own progress"
  on public.chapter_progress for update
  using (auth.uid() = user_id);

-- Explicit Data API grants (see the matching note in schema.sql).
-- Not granting `anon`: guests never have progress to read or write.
grant select, insert, update on public.chapter_progress to authenticated;
grant select, insert, update, delete on public.chapter_progress to service_role;

-- Phase 4 will add: purchases, payment_proofs, and will use chapter
-- metadata (isFree) to gate access to chapters 6-13 server-side.
