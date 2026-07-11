-- Track when live prices were last fetched, separate from updated_at
-- (which is bumped by any edit). Used for the 5-minute price cache.
-- Run this in the Supabase SQL editor.

alter table public.portfolio_stocks add column if not exists price_updated_at timestamptz;
