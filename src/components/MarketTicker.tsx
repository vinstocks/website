import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface StockDisplay {
  symbol: string;
  price: string;
  change: string;
}

// Fallback shown until live data loads (or if the market-ticker function is unreachable)
const fallbackGainers: StockDisplay[] = [
  { symbol: "ETERNAL", price: "280.00", change: "+5.79%" },
  { symbol: "NESTLE", price: "1,453.00", change: "+3.40%" },
  { symbol: "ASIAN PAINTS", price: "2,715.00", change: "+3.01%" },
  { symbol: "HINDUNILVR", price: "2,181.50", change: "+2.99%" },
  { symbol: "M&M", price: "3,132.00", change: "+2.06%" },
];

const fallbackLosers: StockDisplay[] = [
  { symbol: "HCL TECH", price: "1,035.40", change: "-3.40%" },
  { symbol: "TECHM", price: "1,360.00", change: "-3.19%" },
  { symbol: "TCS", price: "1,981.80", change: "-2.47%" },
  { symbol: "HINDALCO", price: "939.40", change: "-1.80%" },
  { symbol: "TATA STEEL", price: "185.00", change: "-1.63%" },
];

interface TickerQuote {
  symbol: string;
  price: number;
  changePct: number;
}

const toDisplay = (q: TickerQuote): StockDisplay => ({
  symbol: q.symbol,
  price: q.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  change: `${q.changePct >= 0 ? "+" : ""}${q.changePct.toFixed(2)}%`,
});

// Shared across TopGainers/TopLosers so the function is invoked once per page load
let tickerPromise: Promise<{ gainers?: TickerQuote[]; losers?: TickerQuote[] } | null> | null = null;
const loadTicker = () => {
  if (!tickerPromise) {
    tickerPromise = supabase.functions
      .invoke("market-ticker")
      .then(({ data }) => data)
      .catch(() => null);
  }
  return tickerPromise;
};

const useTickerData = () => {
  const [gainers, setGainers] = useState<StockDisplay[]>(fallbackGainers);
  const [losers, setLosers] = useState<StockDisplay[]>(fallbackLosers);

  useEffect(() => {
    let mounted = true;
    loadTicker().then((data) => {
      if (!mounted || !data) return;
      if (data.gainers?.length) setGainers(data.gainers.map(toDisplay));
      if (data.losers?.length) setLosers(data.losers.map(toDisplay));
    });
    return () => { mounted = false; };
  }, []);

  return { gainers, losers };
};

export const TopGainers = () => {
  const { gainers } = useTickerData();
  const displayData = [...gainers, ...gainers];

  return (
    <div className="fixed top-14 md:top-16 left-0 right-0 z-40 w-full bg-background/80 backdrop-blur-sm border-b border-border/50 shadow-sm">
      <div className="relative overflow-hidden py-2.5">
        <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center gap-2 px-4 bg-background border-r border-border/30">
          <TrendingUp className="w-4 h-4 text-success" />
        </div>
        <div className="flex items-center">
          <div className="flex animate-scroll-left" style={{ paddingLeft: '140px' }}>
            {displayData.map((stock, index) => (
              <div
                key={`gainer-${index}`}
                className="flex items-center gap-2 px-6 py-1 whitespace-nowrap border-r border-border/30"
              >
                <span className="font-semibold text-foreground text-sm">
                  {stock.symbol}
                </span>
                <span className="text-muted-foreground text-xs">
                  ₹{stock.price}
                </span>
                <span className="text-success text-xs font-medium bg-success/10 px-2 py-0.5 rounded">
                  {stock.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const TopLosers = () => {
  const { losers } = useTickerData();
  const displayData = [...losers, ...losers];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 w-full bg-background/80 backdrop-blur-sm border-t border-border/50 shadow-sm">
      <div className="relative overflow-hidden py-2.5">
        <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center gap-2 px-4 bg-background border-r border-border/30">
          <TrendingDown className="w-4 h-4 text-destructive" />
        </div>
        <div className="flex items-center">
          <div className="flex animate-scroll-right" style={{ paddingLeft: '140px' }}>
            {displayData.map((stock, index) => (
              <div
                key={`loser-${index}`}
                className="flex items-center gap-2 px-6 py-1 whitespace-nowrap border-r border-border/30"
              >
                <span className="font-semibold text-foreground text-sm">
                  {stock.symbol}
                </span>
                <span className="text-muted-foreground text-xs">
                  ₹{stock.price}
                </span>
                <span className="text-destructive text-xs font-medium bg-destructive/10 px-2 py-0.5 rounded">
                  {stock.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MarketTicker = () => {
  return (
    <>
      <TopGainers />
      <TopLosers />
    </>
  );
};

export default MarketTicker;
