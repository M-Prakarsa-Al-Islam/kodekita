-- PyMula — account deletion support ("Halaman akun")
-- Run this in the Supabase SQL editor AFTER schema_phase4.sql.
--
-- Goal: when a learner deletes their account, their `purchases` rows are KEPT
-- as an anonymous transaction record (course, amount, status, dates) instead of
-- being silently deleted by the cascade. The user link, the free-text note and
-- the proof path are removed.
--
-- Before this change purchases.user_id was NOT NULL with ON DELETE CASCADE
-- (via profiles), so deleting a user would have wiped the sales ledger.

alter table public.purchases alter column user_id drop not null;
alter table public.purchases alter column proof_path drop not null;

alter table public.purchases drop constraint if exists purchases_user_id_fkey;
alter table public.purchases
  add constraint purchases_user_id_fkey
  foreign key (user_id) references public.profiles(id) on delete set null;

-- Used by the delete-account server action as a safety check: it refuses to
-- delete anybody if this migration has not been applied (otherwise the
-- cascade would still erase the purchases). Callable by service_role only.
create or replace function public.purchases_survive_user_deletion()
returns boolean
language sql
stable
security definer
set search_path = public, pg_catalog
as $$
  select exists (
    select 1
    from pg_constraint
    where conname = 'purchases_user_id_fkey'
      and conrelid = 'public.purchases'::regclass
      and confdeltype = 'n'  -- n = ON DELETE SET NULL
  );
$$;

revoke all on function public.purchases_survive_user_deletion() from public, anon, authenticated;
grant execute on function public.purchases_survive_user_deletion() to service_role;
