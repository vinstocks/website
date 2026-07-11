-- ============================================
-- Vinstocks Client Dashboard — Database Schema
-- Run this in Supabase SQL Editor (one-time setup)
-- ============================================

-- 1. Profiles (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  role text not null default 'client' check (role in ('admin', 'client')),
  plan text not null default 'prime' check (plan in ('elite', 'prime', 'checkup', 'stars')),
  has_stars boolean not null default false,
  allocated_amount numeric(14,2) default 0,
  stars_allocated_amount numeric(14,2),
  plan_start_date date default current_date,
  plan_end_date date,
  is_active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Master Stocks (2,221 NSE stocks — seeded separately)
create table public.master_stocks (
  id serial primary key,
  symbol text not null unique,
  company_name text not null,
  isin text,
  sector text,
  created_at timestamptz default now()
);

-- 3. Portfolio Stocks (stocks assigned to a client's portfolio)
create table public.portfolio_stocks (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  stock_id integer not null references public.master_stocks(id),
  plan_type text not null default 'elite_prime' check (plan_type in ('elite_prime', 'stars')),
  current_price numeric(12,2) default 0,
  previous_price numeric(12,2) default 0,
  daily_change_pct numeric(6,2) default 0,
  price_updated_at timestamptz,
  report_url text,
  buying_range text,
  allocation_pct numeric(5,2),
  suggested_amount numeric(12,2),
  duration text,
  upside_potential text,
  status text default 'BUY' check (status in ('BUY', 'HOLD', 'SELL')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. Tranches (Elite/Prime batch investments)
create table public.tranches (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  tranche_number integer not null,
  label text not null,
  date date,
  is_addition boolean not null default false,
  created_at timestamptz default now()
);

-- 5. Holdings (qty/price per stock per tranche)
create table public.holdings (
  id uuid primary key default gen_random_uuid(),
  portfolio_stock_id uuid not null references public.portfolio_stocks(id) on delete cascade,
  tranche_id uuid references public.tranches(id) on delete cascade,
  quantity integer default 0,
  avg_buy_price numeric(12,2) default 0,
  sell_price numeric(12,2),
  sell_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 6. Recommendation Log (buy/sell history)
create table public.recommendation_log (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('buy', 'sell')),
  stock_id integer not null references public.master_stocks(id),
  recommendation_date date default current_date,
  recommendation_price numeric(12,2),
  sell_price numeric(12,2),
  sell_range text,
  sell_allocation_pct numeric(5,2),
  result text check (result in ('Loss', 'Partial Booking', 'Full Exit')),
  pnl_amount numeric(12,2),
  plan_type text default 'elite_prime' check (plan_type in ('elite_prime', 'stars')),
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- 7. Alerts (notification log)
create table public.alerts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  type text default 'recommendation' check (type in ('recommendation', 'general')),
  title text not null,
  message text,
  channel text default 'in_app' check (channel in ('email', 'whatsapp', 'in_app')),
  status text default 'pending' check (status in ('pending', 'sent', 'read')),
  sent_at timestamptz,
  created_at timestamptz default now()
);

-- ============================================
-- Trigger: auto-create profile on sign-up
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role, plan)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'client'),
    coalesce(new.raw_user_meta_data->>'plan', 'prime')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- Row Level Security
-- ============================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.master_stocks enable row level security;
alter table public.portfolio_stocks enable row level security;
alter table public.tranches enable row level security;
alter table public.holdings enable row level security;
alter table public.recommendation_log enable row level security;
alter table public.alerts enable row level security;

-- Helper: check if current user is admin
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- PROFILES
create policy "Users can read own profile"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "Admins can insert profiles"
  on public.profiles for insert
  with check (public.is_admin());

create policy "Admins can update any profile"
  on public.profiles for update
  using (public.is_admin());

-- MASTER STOCKS (read-only for everyone)
create policy "Anyone authenticated can read master stocks"
  on public.master_stocks for select
  using (auth.uid() is not null);

create policy "Admins can manage master stocks"
  on public.master_stocks for all
  using (public.is_admin());

-- PORTFOLIO STOCKS
create policy "Users can read own portfolio stocks"
  on public.portfolio_stocks for select
  using (client_id = auth.uid() or public.is_admin());

create policy "Admins can manage portfolio stocks"
  on public.portfolio_stocks for all
  using (public.is_admin());

-- TRANCHES
create policy "Users can read own tranches"
  on public.tranches for select
  using (client_id = auth.uid() or public.is_admin());

create policy "Admins can manage tranches"
  on public.tranches for all
  using (public.is_admin());

-- HOLDINGS
create policy "Users can read own holdings"
  on public.holdings for select
  using (
    exists (
      select 1 from public.portfolio_stocks ps
      where ps.id = holdings.portfolio_stock_id
      and (ps.client_id = auth.uid() or public.is_admin())
    )
  );

create policy "Clients can update own holdings qty and price"
  on public.holdings for update
  using (
    exists (
      select 1 from public.portfolio_stocks ps
      where ps.id = holdings.portfolio_stock_id
      and ps.client_id = auth.uid()
    )
  );

create policy "Admins can manage holdings"
  on public.holdings for all
  using (public.is_admin());

-- RECOMMENDATION LOG
create policy "Users can read own recommendations"
  on public.recommendation_log for select
  using (client_id = auth.uid() or public.is_admin());

create policy "Admins can manage recommendations"
  on public.recommendation_log for all
  using (public.is_admin());

-- ALERTS
create policy "Users can read own alerts"
  on public.alerts for select
  using (client_id = auth.uid() or public.is_admin());

create policy "Users can update own alert status"
  on public.alerts for update
  using (client_id = auth.uid());

create policy "Admins can manage alerts"
  on public.alerts for all
  using (public.is_admin());

-- ============================================
-- Updated_at trigger (auto-update timestamp)
-- ============================================
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on public.profiles
  for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.portfolio_stocks
  for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.holdings
  for each row execute function public.update_updated_at();
