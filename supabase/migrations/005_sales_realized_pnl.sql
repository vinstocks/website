-- Realized P&L: each row records one actual sale (partial or full exit).
-- Run this in the Supabase SQL editor.

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  stock_id integer not null references public.master_stocks(id),
  plan_type text not null default 'elite_prime' check (plan_type in ('elite_prime', 'stars')),
  quantity integer not null check (quantity > 0),
  buy_price numeric(12,2) not null,
  sell_price numeric(12,2) not null,
  sell_date date default current_date,
  pnl numeric(14,2) not null,
  created_at timestamptz default now()
);

alter table public.sales enable row level security;

create policy "Users can read own sales"
  on public.sales for select
  using (client_id = auth.uid() or public.is_admin());

create policy "Clients can record own sales"
  on public.sales for insert
  with check (client_id = auth.uid() or public.is_admin());

create policy "Admins can manage sales"
  on public.sales for all
  using (public.is_admin());
