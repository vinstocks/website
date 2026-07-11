# Vinstocks Client Dashboard

## Website Overview

**Vinstocks Wealth** — SEBI-registered investment advisory (INA000021766, BASL 2429) targeting Indian retail investors.

### Tech Stack
- React 18 + TypeScript + Vite (port 8080)
- Tailwind CSS + shadcn/ui (Radix primitives)
- React Router v6, react-hook-form + zod, @tanstack/react-query
- Hosted on Vercel free tier with SPA rewrite

### Existing Pages
| Route | Description |
|-------|-------------|
| `/` | Landing page (Hero, About, Features, Services, Pricing, Footer) |
| `/pre-ipo` | Pre-IPO investment offerings |
| `/sip-calculator` | SIP calculator tool |
| `/login` | Client login (NEW) |
| `/dashboard` | Client dashboard (NEW) |

---

## Dashboard Plan

### Why
Replace per-client Excel workbooks with a web dashboard. Currently each client has an .xlsx file with ~12 sheets covering portfolio holdings, tranches, buy/sell logs, and Stars portfolio. Admin manually updates these sheets and shares via Google Sheets.

### Core Workflow
1. Admin creates client → assigns plan (Elite/Prime) and optionally Stars add-on
2. Admin pushes stock recommendations → stocks appear as empty rows in client's dashboard
3. Client purchases stock → logs in, fills qty and avg buy price
4. Dashboard auto-calculates → Invested Value, Current Value, P&L, P&L%, CAGR
5. Admin pushes sell recommendation → client updates sell price

### Plans & Permissions
- **Elite**: capital ≥ ₹25 Lacs — tranche-based portfolio (same dashboard as Prime)
- **Prime**: capital < ₹25 Lacs — tranche-based portfolio
- **Stars**: ADD-ON subscription for mid-term stocks (allocation-based model)
- **Client can ONLY edit**: quantity and avg_buy_price
- **Everything else is admin-only**: stock selection, buying range, CMP, reports, recommendations

### Two Dashboard Models

**Elite/Prime (Tranche-Based)**:
- ~15 stocks invested in batches (Tranche 1, 2, 3, 4 + Addition)
- Each tranche has same stock list but different qty/prices
- LIVE DASHBOARD aggregates all tranches

**Stars (Allocation-Based)**:
- Each stock recommended independently with: Buying Range, Allocation %, Suggested Amount, Duration, Upside Potential, Status (BUY/HOLD/SELL)
- Has its own summary with Allocated Amount

---

## Implementation Status

### Part A: UI First — COMPLETE

| Phase | Status | Description |
|-------|--------|-------------|
| A1. Client Dashboard UI | DONE | LiveDashboard, TrancheView, StarsPortfolio, RecommendationLog, ReportsGrid |
| A2. Admin Panel UI | DONE | AdminOverview, ClientsTable, ClientDetail, CreateClient, PushRecommendation, ManageTranches, ManageReports |
| A3. Login Page UI | DONE | Email/password form wired to Supabase auth |
| A4. Review & Confirm | DONE | Reviewed and iterated with live testing |

### Part B: Backend Integration (Supabase) — COMPLETE (except send-alert)

| Phase | Status | Description |
|-------|--------|-------------|
| B1. Foundation | DONE | Supabase project, schema.sql (7 tables + RLS + triggers), 2,220 master stocks seeded |
| B2. Auth | DONE | Login via Supabase, ProtectedRoute + AdminRoute, AuthProvider |
| B3. Data Wiring | DONE | All components on live Supabase data; clients edit qty/price inline |
| B4. Edge Functions | DONE | `create-client` deployed (send-alert email deferred) |
| B5. Live Prices | DONE | `update-prices` function — Yahoo Finance NSE quotes, 5-min cache |
| B6. Polish | DONE | Multi-client WhatsApp alerts, new-recommendation badge, responsive tables |

### Additional Features (beyond original plan)
- **Market ticker**: `market-ticker` edge function — daily NIFTY 50 top gainers/losers on public pages (cached per IST day in `ticker_cache`)
- **Stars-only plan**: clients can subscribe to Stars without Elite/Prime (`plan='stars'`)
- **Sell recommendations**: update stock status to SELL, carry selling range + % allocation to sell
- **Multi-client push**: checkbox selection of any client combination
- **Recommendation history**: separate Elite/Prime and Stars sections, each with All Buy / All Sell tabs
- **Admin stock removal**: trash buttons across Live Dashboard/Tranches/Stars, cascades to holdings + recommendation log

### Migrations (run in Supabase SQL editor — all applied)
```
supabase/migrations/001_stars_only_plan.sql          — allow plan='stars'
supabase/migrations/002_sell_recommendation_fields.sql — sell_range, sell_allocation_pct
supabase/migrations/003_price_updated_at.sql         — price cache timestamp
supabase/migrations/004_ticker_cache.sql             — market ticker daily cache
```

### Deployed Edge Functions
```
create-client   — admin creates client accounts (service role)
update-prices   — live CMPs for a client's portfolio, 5-min cache
market-ticker   — public daily NIFTY 50 top gainers/losers
```

---

## Files Added/Modified (Branch: `feature/client-dashboard`)

### New Files
```
src/lib/types.ts                          — TypeScript interfaces for all data structures
src/lib/supabase.ts                       — Supabase client
src/lib/auth.tsx                          — AuthProvider context + useAuth()
src/lib/prices.ts                         — refreshLivePrices() helper (update-prices function)
src/pages/Login.tsx                       — Login page with email/password form
src/components/dashboard/
  DashboardLayout.tsx                     — Sidebar + Outlet layout
  LiveDashboard.tsx                       — Summary cards + aggregated stock table
  PortfolioSummary.tsx                    — Reusable summary cards component
  TrancheView.tsx                         — Tranche tabs + editable stock table
  StarsPortfolio.tsx                      — Stars allocation-based table
  RecommendationLog.tsx                   — Buy/Sell recommendation history
  ReportsGrid.tsx                         — Research report cards with Drive links
  EditableCell.tsx                        — Inline-editable cell for qty/price
```

### Modified Files
```
src/App.tsx                               — Added dashboard routes, PublicLayout wrapper
src/components/Navbar.tsx                 — Added "Client Login" nav link
```

### Dashboard Routes
```
/login                      → Login page
/dashboard                  → LIVE DASHBOARD (aggregated portfolio)
/dashboard/tranches         → Tranche-by-tranche view (editable qty/price)
/dashboard/stars            → Stars portfolio (visible if has_stars=true)
/dashboard/recommendations  → Buy/Sell recommendation history
/dashboard/reports          → Research report cards
```

---

## Database Schema (For Supabase — Part B)

### Tables
- **profiles** — user accounts (role, plan, has_stars, allocated_amount)
- **master_stocks** — 2,221 stock lookup (symbol, company, ISIN, sector)
- **portfolio_stocks** — stocks assigned to client (includes Stars-specific fields)
- **tranches** — tranche definitions per client (1-4 + Addition)
- **holdings** — qty/price per stock per tranche (client-editable)
- **recommendation_log** — historical buy/sell calls
- **alerts** — notification log (email, WhatsApp, in-app)

### Key Constraints
- Row Level Security: clients see only own data, can only UPDATE qty/price
- Admin has full CRUD on everything
- Stars is a boolean add-on flag, not a separate plan

---

## Live Prices (Phase B5)
Supabase Edge Function fetching NSE prices from Yahoo Finance (free, `.NS` suffix). 5-minute cache. Falls back to manual CMP update by admin.
