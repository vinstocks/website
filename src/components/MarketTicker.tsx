import { TrendingUp, TrendingDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface StockDisplay {
  symbol: string;
  price: string;
  change: string;
}

// Format number with Indian number system (commas)
const formatPrice = (price: number): string => {
  return price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Format percentage change
const formatChange = (change: number): string => {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(2)}%`;
};

// NSE API Base URL - In production, set up a backend proxy to avoid CORS issues
// For development, you can use a CORS proxy service
const NSE_API_BASE = import.meta.env.VITE_NSE_API_PROXY || "https://www.nseindia.com";

// Fetch top gainers from NSE API
const fetchTopGainers = async (): Promise<StockDisplay[]> => {
  try {
    // NSE API endpoint for top gainers
    // Note: Direct calls may fail due to CORS. Set up a backend proxy or use VITE_NSE_API_PROXY env variable
    const apiUrl = `${NSE_API_BASE}/api/live-analysis-variations?index=gainers`;
    
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Parse the response - NSE API returns data in different formats
    let gainers: StockDisplay[] = [];
    
    if (Array.isArray(data)) {
      gainers = data
        .filter((stock: any) => {
          const change = stock.netPrice || stock.change || stock.pChange || 0;
          return change > 0;
        })
        .sort((a: any, b: any) => {
          const changeA = a.netPrice || a.change || a.pChange || 0;
          const changeB = b.netPrice || b.change || b.pChange || 0;
          return changeB - changeA;
        })
        .slice(0, 10)
        .map((stock: any) => {
          const price = stock.ltp || stock.lastPrice || stock.price || 0;
          const change = stock.netPrice || stock.change || stock.pChange || 0;
          return {
            symbol: stock.symbol || stock.symbolName || "N/A",
            price: formatPrice(price),
            change: formatChange(change),
          };
        });
    } else if (data.data && Array.isArray(data.data)) {
      // Alternative response structure
      gainers = data.data
        .filter((stock: any) => {
          const change = stock.netPrice || stock.change || stock.pChange || 0;
          return change > 0;
        })
        .sort((a: any, b: any) => {
          const changeA = a.netPrice || a.change || a.pChange || 0;
          const changeB = b.netPrice || b.change || b.pChange || 0;
          return changeB - changeA;
        })
        .slice(0, 10)
        .map((stock: any) => {
          const price = stock.ltp || stock.lastPrice || stock.price || 0;
          const change = stock.netPrice || stock.change || stock.pChange || 0;
          return {
            symbol: stock.symbol || stock.symbolName || "N/A",
            price: formatPrice(price),
            change: formatChange(change),
          };
        });
    }

    return gainers.length > 0 ? gainers : getDefaultGainers();
  } catch (error) {
    console.error("Error fetching top gainers:", error);
    // Fallback to default data if API fails
    return getDefaultGainers();
  }
};

// Fetch top losers from NSE API
const fetchTopLosers = async (): Promise<StockDisplay[]> => {
  try {
    // NSE API endpoint for top losers
    const apiUrl = `${NSE_API_BASE}/api/live-analysis-variations?index=loosers`;
    
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    let losers: StockDisplay[] = [];
    
    if (Array.isArray(data)) {
      losers = data
        .filter((stock: any) => {
          const change = stock.netPrice || stock.change || stock.pChange || 0;
          return change < 0;
        })
        .sort((a: any, b: any) => {
          const changeA = a.netPrice || a.change || a.pChange || 0;
          const changeB = b.netPrice || b.change || b.pChange || 0;
          return changeA - changeB;
        })
        .slice(0, 10)
        .map((stock: any) => {
          const price = stock.ltp || stock.lastPrice || stock.price || 0;
          const change = stock.netPrice || stock.change || stock.pChange || 0;
          return {
            symbol: stock.symbol || stock.symbolName || "N/A",
            price: formatPrice(price),
            change: formatChange(change),
          };
        });
    } else if (data.data && Array.isArray(data.data)) {
      losers = data.data
        .filter((stock: any) => {
          const change = stock.netPrice || stock.change || stock.pChange || 0;
          return change < 0;
        })
        .sort((a: any, b: any) => {
          const changeA = a.netPrice || a.change || a.pChange || 0;
          const changeB = b.netPrice || b.change || b.pChange || 0;
          return changeA - changeB;
        })
        .slice(0, 10)
        .map((stock: any) => {
          const price = stock.ltp || stock.lastPrice || stock.price || 0;
          const change = stock.netPrice || stock.change || stock.pChange || 0;
          return {
            symbol: stock.symbol || stock.symbolName || "N/A",
            price: formatPrice(price),
            change: formatChange(change),
          };
        });
    }

    return losers.length > 0 ? losers : getDefaultLosers();
  } catch (error) {
    console.error("Error fetching top losers:", error);
    return getDefaultLosers();
  }
};

// Fallback static data
const getDefaultGainers = (): StockDisplay[] => [
  { symbol: "RELIANCE", price: "2,845.50", change: "+3.25%" },
  { symbol: "TCS", price: "3,567.80", change: "+2.89%" },
  { symbol: "HDFC BANK", price: "1,654.30", change: "+2.54%" },
  { symbol: "INFY", price: "1,432.60", change: "+2.12%" },
  { symbol: "ICICI BANK", price: "987.40", change: "+1.98%" },
  { symbol: "WIPRO", price: "445.20", change: "+1.76%" },
  { symbol: "BHARTI", price: "876.90", change: "+1.65%" },
  { symbol: "ITC", price: "456.80", change: "+1.54%" },
];

const getDefaultLosers = (): StockDisplay[] => [
  { symbol: "ADANI PORT", price: "1,234.50", change: "-2.85%" },
  { symbol: "COAL INDIA", price: "345.60", change: "-2.34%" },
  { symbol: "NTPC", price: "234.80", change: "-2.12%" },
  { symbol: "POWER GRID", price: "189.40", change: "-1.98%" },
  { symbol: "ONGC", price: "234.70", change: "-1.76%" },
  { symbol: "GAIL", price: "156.30", change: "-1.65%" },
  { symbol: "IOC", price: "123.90", change: "-1.54%" },
  { symbol: "BPCL", price: "567.20", change: "-1.43%" },
];

// Top Gainers - Sticks below header with scrolling
export const TopGainers = () => {
  const { data: topGainers = [], isLoading } = useQuery({
    queryKey: ["topGainers"],
    queryFn: fetchTopGainers,
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });

  // Duplicate data for seamless scrolling
  const displayData = topGainers.length > 0 ? [...topGainers, ...topGainers] : [];

  if (isLoading && topGainers.length === 0) {
    return (
      <div className="fixed top-14 md:top-16 left-0 right-0 z-40 w-full bg-background/80 backdrop-blur-sm border-b border-border/50 shadow-sm">
        <div className="relative overflow-hidden py-2.5">
          <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center gap-2 px-4 bg-background border-r border-border/30">
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <div className="flex items-center justify-center" style={{ paddingLeft: '140px' }}>
            <span className="text-muted-foreground text-sm">Loading market data...</span>
          </div>
        </div>
      </div>
    );
  }

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

// Top Losers - Sticks at bottom without scrolling
export const TopLosers = () => {
  const { data: topLosers = [], isLoading } = useQuery({
    queryKey: ["topLosers"],
    queryFn: fetchTopLosers,
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });

  // Duplicate data for seamless scrolling
  const displayData = topLosers.length > 0 ? [...topLosers, ...topLosers] : [];

  if (isLoading && topLosers.length === 0) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 w-full bg-background/80 backdrop-blur-sm border-t border-border/50 shadow-sm">
        <div className="relative overflow-hidden py-2.5">
          <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center gap-2 px-4 bg-background border-r border-border/30">
            <TrendingDown className="w-4 h-4 text-destructive" />
          </div>
          <div className="flex items-center justify-center" style={{ paddingLeft: '140px' }}>
            <span className="text-muted-foreground text-sm">Loading market data...</span>
          </div>
        </div>
      </div>
    );
  }

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

// Keep original export for backward compatibility
const MarketTicker = () => {
  return (
    <>
      <TopGainers />
      <TopLosers />
    </>
  );
};

export default MarketTicker;
