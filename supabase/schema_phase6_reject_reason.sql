-- Phase 6: let the admin say WHY a payment was rejected, so the learner can fix it.
--
-- Run this in the Supabase SQL Editor BEFORE deploying the code that uses it
-- (the admin "Tolak" form writes this column, and account deletion clears it).
-- Safe to run twice. It only ADDS a nullable column: no existing row or policy changes.
--
-- Why a new column and not `note`: `note` is what the LEARNER typed when paying.
-- Reusing it would overwrite their text.
--
-- Access is unchanged: the learner reads their own row (existing select policy), and only
-- an admin can update it (existing update policy). Table-level grants already cover it.

alter table public.purchases
  add column if not exists reject_reason text
  check (reject_reason is null or char_length(reject_reason) <= 300);
