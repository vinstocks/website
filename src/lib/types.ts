export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: "admin" | "client";
  plan: "elite" | "prime" | "checkup" | "stars";
  has_stars: boolean;
  allocated_amount: number;
  stars_allocated_amount: number | null;
  plan_start_date: string;
  plan_end_date: string | null;
  is_active: boolean;
}

export interface MasterStock {
  id: number;
  symbol: string;
  company_name: string;
  isin: string;
  sector: string;
}

export interface PortfolioStock {
  id: string;
  client_id: string;
  stock_id: number;
  symbol: string;
  company_name: string;
  isin: string;
  sector: string;
  plan_type: "elite_prime" | "stars";
  market_cap: number;
  market_cap_category: "LargeCap" | "MidCap" | "SmallCap";
  current_price: number;
  previous_price: number;
  daily_change_pct: number;
  report_url: string | null;
  // Stars-specific fields
  buying_range: string | null;
  allocation_pct: number | null;
  suggested_amount: number | null;
  duration: string | null;
  upside_potential: string | null;
  status: "BUY" | "HOLD" | "SELL" | null;
  recommendation_date: string | null;
}

export interface Tranche {
  id: string;
  client_id: string;
  tranche_number: number;
  label: string;
  date: string | null;
  is_addition: boolean;
}

export interface Holding {
  id: string;
  portfolio_stock_id: string;
  tranche_id: string | null;
  quantity: number;
  avg_buy_price: number;
  sell_price: number | null;
  sell_date: string | null;
}

export interface RecommendationLogEntry {
  id: string;
  client_id: string;
  type: "buy" | "sell";
  symbol: string;
  company_name: string;
  isin: string;
  sector: string;
  market_cap: number;
  market_cap_category: string;
  recommendation_date: string;
  recommendation_price: number;
  sell_price: number | null;
  sell_range: string | null;
  sell_allocation_pct: number | null;
  result: "Loss" | "Partial Booking" | "Full Exit" | null;
  pnl_amount: number | null;
  plan_type: "elite_prime" | "stars";
}

export interface LiveDashboardRow {
  portfolio_stock_id: string;
  stock_id: number;
  symbol: string;
  company_name: string;
  total_qty: number;
  avg_buy_price: number;
  invested_value: number;
  current_value: number;
  closing_price: number;
  total_pnl: number;
  pnl_pct: number;
}

export interface LiveDashboardSummary {
  total_investment: number;
  current_value: number;
  total_pnl: number;
  pnl_pct: number;
  cagr: number;
}

export interface TrancheHolding {
  portfolio_stock_id: string;
  stock_id: number;
  symbol: string;
  company_name: string;
  quantity: number;
  avg_buy_price: number;
  invested_value: number;
  current_value: number;
  closing_price: number;
  total_pnl: number;
  pnl_pct: number;
  holding_id: string;
}

export interface StarsHolding {
  portfolio_stock_id: string;
  stock_id: number;
  recommendation_date: string;
  symbol: string;
  company_name: string;
  buying_range: string;
  allocation_pct: number;
  suggested_amount: number;
  quantity: number;
  avg_buy_price: number;
  invested_value: number;
  current_value: number;
  closing_price: number;
  total_pnl: number;
  pnl_pct: number;
  duration: string;
  upside_potential: string;
  report_url: string | null;
  status: "BUY" | "HOLD" | "SELL";
  holding_id: string;
}

export interface Alert {
  id: string;
  client_id: string;
  type: "recommendation" | "general";
  title: string;
  message: string;
  channel: "email" | "whatsapp" | "in_app";
  status: "pending" | "sent" | "read";
  sent_at: string | null;
  created_at: string;
}
