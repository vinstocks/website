import { TrendingUp, TrendingDown, IndianRupee, BarChart3, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/format";

interface SummaryCard {
  label: string;
  value: string;
  icon: React.ElementType;
  color?: string;
  subValue?: string;
}

interface PortfolioSummaryProps {
  totalInvestment: number;
  currentValue: number;
  totalPnl: number;
  pnlPct: number;
  cagr?: number;
  allocatedAmount?: number;
  realizedPnl?: number;
}

const PortfolioSummary = ({
  totalInvestment,
  currentValue,
  totalPnl,
  pnlPct,
  cagr,
  allocatedAmount,
  realizedPnl,
}: PortfolioSummaryProps) => {
  const isProfit = totalPnl >= 0;

  const cards: SummaryCard[] = [
    {
      label: "Total Investment",
      value: formatCurrency(totalInvestment),
      icon: Wallet,
    },
    {
      label: "Current Value",
      value: formatCurrency(currentValue),
      icon: IndianRupee,
    },
    {
      label: "Total P&L",
      value: `${isProfit ? "+" : ""}${formatCurrency(totalPnl)}`,
      icon: isProfit ? TrendingUp : TrendingDown,
      color: isProfit ? "text-success" : "text-destructive",
      subValue: `${isProfit ? "+" : ""}${pnlPct.toFixed(2)}%`,
    },
    ...(cagr !== undefined
      ? [
          {
            label: "CAGR",
            value: `${cagr.toFixed(2)}%`,
            icon: BarChart3,
            color: cagr >= 0 ? "text-success" : "text-destructive",
          },
        ]
      : []),
    ...(realizedPnl !== undefined && realizedPnl !== 0
      ? [
          {
            label: "Realized P&L",
            value: `${realizedPnl >= 0 ? "+" : ""}${formatCurrency(realizedPnl)}`,
            icon: realizedPnl >= 0 ? TrendingUp : TrendingDown,
            color: realizedPnl >= 0 ? "text-success" : "text-destructive",
          },
        ]
      : []),
    ...(allocatedAmount !== undefined
      ? [
          {
            label: "Allocated Amount",
            value: formatCurrency(allocatedAmount),
            icon: Wallet,
          },
        ]
      : []),
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
      {cards.map((card) => (
        <Card key={card.label} className="p-4 lg:p-5">
          <div className="flex items-center gap-2 mb-2">
            <card.icon className={`w-4 h-4 ${card.color || "text-muted-foreground"}`} />
            <span className="text-xs text-muted-foreground font-medium">{card.label}</span>
          </div>
          <p className={`text-lg lg:text-xl font-bold ${card.color || "text-foreground"}`}>
            {card.value}
          </p>
          {card.subValue && (
            <p className={`text-sm font-medium mt-0.5 ${card.color}`}>{card.subValue}</p>
          )}
        </Card>
      ))}
    </div>
  );
};

export default PortfolioSummary;
