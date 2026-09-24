-- KodeKita — Phase 1 schema
-- Run this in the Supabase SQL editor of your project.

-- Profiles: one row per auth user, holds display name.
-- Supabase's built-in auth.users already stores email/password;
-- we only need to extend it with app-specific fields.
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Explicit Data API grants. Supabase now requires these on every new
-- table (their Oct 2026 policy change) — RLS alone no longer implies
-- API reachability. Not granting `anon`: profiles should never be
-- readable by a logged-out visitor, and RLS would return zero rows to
-- anon anyway, so there's nothing for that grant to expose.
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.profiles to service_role;

-- Auto-create a profile row whenever someone signs up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Phase 2 will add: courses, chapters, lessons, progress.
-- Phase 4 will add: purchases, payment_proofs.
