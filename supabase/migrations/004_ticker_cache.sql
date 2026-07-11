-- Single-row cache for the public market ticker (top gainers/losers).
-- Only the market-ticker edge function (service role) reads/writes it.
-- Run this in the Supabase SQL editor.

create table if not exists public.ticker_cache (
  id integer primary key default 1 check (id = 1),
  data jsonb,
  updated_at timestamptz default now()
);

alter table public.ticker_cache enable row level security;
-- No policies on purpose: only the service role (edge function) can access it.
