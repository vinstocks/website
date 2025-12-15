import { TrendingUp, TrendingDown } from "lucide-react";

const topGainers = [
  { symbol: "RELIANCE", price: "2,845.50", change: "+3.25%" },
  { symbol: "TCS", price: "3,567.80", change: "+2.89%" },
  { symbol: "HDFC BANK", price: "1,654.30", change: "+2.54%" },
  { symbol: "INFY", price: "1,432.60", change: "+2.12%" },
  { symbol: "ICICI BANK", price: "987.40", change: "+1.98%" },
  { symbol: "WIPRO", price: "445.20", change: "+1.76%" },
  { symbol: "BHARTI", price: "876.90", change: "+1.65%" },
  { symbol: "ITC", price: "456.80", change: "+1.54%" },
];

const topLosers = [
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
  return (
    <div className="fixed top-16 md:top-20 left-0 right-0 z-40 w-full bg-background/80 backdrop-blur-sm border-b border-border/50 shadow-sm">
      <div className="relative overflow-hidden py-2.5">
        <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center gap-2 px-4 bg-background border-r border-border/30">
          <TrendingUp className="w-4 h-4 text-success" />
        </div>
        <div className="flex items-center">
          <div className="flex animate-scroll-left" style={{ paddingLeft: '140px' }}>
            {[...topGainers, ...topGainers].map((stock, index) => (
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
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 w-full bg-background/80 backdrop-blur-sm border-t border-border/50 shadow-sm">
      <div className="relative overflow-hidden py-2.5">
        <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center gap-2 px-4 bg-background border-r border-border/30">
          <TrendingDown className="w-4 h-4 text-destructive" />
        </div>
        <div className="flex items-center">
          <div className="flex animate-scroll-right" style={{ paddingLeft: '140px' }}>
            {[...topLosers, ...topLosers].map((stock, index) => (
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
