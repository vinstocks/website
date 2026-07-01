import { TrendingUp, TrendingDown } from "lucide-react";

interface StockDisplay {
  symbol: string;
  price: string;
  change: string;
}

const topGainers: StockDisplay[] = [
  { symbol: "ETERNAL", price: "280.00", change: "+5.79%" },
  { symbol: "NESTLE", price: "1,453.00", change: "+3.40%" },
  { symbol: "ASIAN PAINTS", price: "2,715.00", change: "+3.01%" },
  { symbol: "HINDUNILVR", price: "2,181.50", change: "+2.99%" },
  { symbol: "M&M", price: "3,132.00", change: "+2.06%" },
];

const topLosers: StockDisplay[] = [
  { symbol: "HCL TECH", price: "1,035.40", change: "-3.40%" },
  { symbol: "TECHM", price: "1,360.00", change: "-3.19%" },
  { symbol: "TCS", price: "1,981.80", change: "-2.47%" },
  { symbol: "HINDALCO", price: "939.40", change: "-1.80%" },
  { symbol: "TATA STEEL", price: "185.00", change: "-1.63%" },
];

export const TopGainers = () => {
  const displayData = [...topGainers, ...topGainers];

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
  const displayData = [...topLosers, ...topLosers];

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
