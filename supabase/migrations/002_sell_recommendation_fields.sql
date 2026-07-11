-- Sell recommendations carry a selling range and % allocation to sell.
-- Run this in the Supabase SQL editor.

alter table public.recommendation_log add column if not exists sell_range text;
alter table public.recommendation_log add column if not exists sell_allocation_pct numeric(5,2);
