-- Allow clients to be on a Stars-only plan (no Elite/Prime portfolio).
-- Run this in the Supabase SQL editor.

alter table public.profiles drop constraint if exists profiles_plan_check;
alter table public.profiles add constraint profiles_plan_check
  check (plan in ('elite', 'prime', 'checkup', 'stars'));
