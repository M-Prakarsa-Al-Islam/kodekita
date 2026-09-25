-- KodeKita — Phase 4 schema addition (commerce)
-- Run this in the Supabase SQL editor, after schema.sql, schema_phase2.sql
-- and schema_phase2b.sql.

-- ── Admin flag ──────────────────────────────────────────────────────
-- Single manually-flagged admin for the MVP — no separate admin signup
-- flow. After running this, flip it on for your own account once via
-- the Supabase table editor:
--   update public.profiles set is_admin = true where id = '<your-user-id>';
alter table public.profiles
  add column if not exists is_admin boolean not null default false;

-- security definer so RLS on `profiles` (which only lets a user read
-- their own row) doesn't block this check from seeing OTHER users'
-- is_admin flag when it's called from a purchases/storage policy.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

grant execute on function public.is_admin() to authenticated;

-- ── Purchases ───────────────────────────────────────────────────────
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_slug text not null,
  amount integer not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  proof_path text not null, -- path inside the payment-proofs bucket
  note text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create index if not exists purchases_user_course_idx
  on public.purchases (user_id, course_slug, created_at desc);

alter table public.purchases enable row level security;

create policy "Users can view their own purchases"
  on public.purchases for select
  using (auth.uid() = user_id or public.is_admin());

create policy "Users can submit a purchase for themselves"
  on public.purchases for insert
  with check (auth.uid() = user_id and status = 'pending');

create policy "Only admin can update purchase status"
  on public.purchases for update
  using (public.is_admin())
  with check (public.is_admin());

-- Explicit Data API grants (see the matching note in schema.sql — this
-- is required on every new table since Supabase's Oct 2026 change, or
-- it 403s once the project crosses Oct 30, 2026). Not granting `anon`:
-- guests never have purchases to read or write.
grant select, insert, update on public.purchases to authenticated;
grant select, insert, update, delete on public.purchases to service_role;

-- ── Storage: payment proof screenshots ─────────────────────────────
-- Private bucket. Each file lives at `{user_id}/{filename}` so a
-- simple foldername check enforces "your own files only" for regular
-- users, with an is_admin() escape hatch for review.
insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', false)
on conflict (id) do nothing;

create policy "Users can upload their own payment proof"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'payment-proofs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users and admin can view payment proofs"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'payment-proofs'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
    )
  );

-- Storage API grants are managed separately by Supabase Storage, not
-- the public-schema Data API grant change above — no extra grant
-- needed here.
