import { useState, useEffect } from "react";
import { Loader2, Trash2, Banknote } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import PortfolioSummary from "./PortfolioSummary";
import RecordSaleDialog, { SaleTarget } from "./RecordSaleDialog";
import RealizedPnlTable from "./RealizedPnlTable";
import { formatCurrency, formatNumber } from "@/lib/utils/format";
import { supabase } from "@/lib/supabase";
import { refreshLivePrices } from "@/lib/prices";
import { useAuth } from "@/lib/auth";
import type { LiveDashboardRow, Sale } from "@/lib/types";

const LiveDashboard = ({ clientId, onStockRemoved }: { clientId?: string; onStockRemoved?: () => void }) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const targetId = clientId || user?.id;
  const isAdmin = !!clientId && profile?.role === "admin";
  const [rows, setRows] = useState<LiveDashboardRow[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [saleTarget, setSaleTarget] = useState<SaleTarget | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!targetId) return;
    const fetch = async () => {
      await refreshLivePrices(targetId);

      const { data: salesData } = await supabase
        .from("sales")
        .select("*, master_stocks(symbol, company_name)")
        .eq("client_id", targetId)
        .eq("plan_type", "elite_prime")
        .order("sell_date", { ascending: false });
      setSales(
        (salesData || []).map((s: any) => ({
          ...s,
          symbol: s.master_stocks?.symbol || "",
          company_name: s.master_stocks?.company_name || "",
          pnl: Number(s.pnl),
        }))
      );

      const { data: psData } = await supabase
        .from("portfolio_stocks")
        .select("id, stock_id, current_price, previous_price, plan_type, master_stocks(symbol, company_name)")
        .eq("client_id", targetId)
        .eq("plan_type", "elite_prime");

      if (!psData || psData.length === 0) {
        setRows([]);
        setLoading(false);
        return;
      }

      const psIds = psData.map((ps: any) => ps.id);
      const { data: holdingsData } = await supabase
        .from("holdings")
        .select("portfolio_stock_id, quantity, avg_buy_price")
        .in("portfolio_stock_id", psIds);

      const holdingsMap: Record<string, { totalQty: number; totalInvested: number }> = {};
      (holdingsData || []).forEach((h: any) => {
        if (!holdingsMap[h.portfolio_stock_id]) {
          holdingsMap[h.portfolio_stock_id] = { totalQty: 0, totalInvested: 0 };
        }
        holdingsMap[h.portfolio_stock_id].totalQty += h.quantity;
        holdingsMap[h.portfolio_stock_id].totalInvested += h.quantity * h.avg_buy_price;
      });

      const dashRows: LiveDashboardRow[] = psData.map((ps: any) => {
        const stock = ps.master_stocks;
        const agg = holdingsMap[ps.id] || { totalQty: 0, totalInvested: 0 };
        const avgBuy = agg.totalQty > 0 ? agg.totalInvested / agg.totalQty : 0;
        const currentValue = agg.totalQty * ps.current_price;
        const pnl = currentValue - agg.totalInvested;
        const pnlPct = agg.totalInvested > 0 ? (pnl / agg.totalInvested) * 100 : 0;
        return {
          portfolio_stock_id: ps.id,
          stock_id: ps.stock_id,
          symbol: stock.symbol,
          company_name: stock.company_name,
          total_qty: agg.totalQty,
          avg_buy_price: avgBuy,
          invested_value: agg.totalInvested,
          current_value: currentValue,
          closing_price: ps.current_price,
          total_pnl: pnl,
          pnl_pct: pnlPct,
        };
      });

      setRows(dashRows);
      setLoading(false);
    };
    fetch();
  }, [targetId, reloadKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const handleRemoveStock = async (row: LiveDashboardRow) => {
    if (!window.confirm(`Remove ${row.symbol} from portfolio? This deletes all holdings across tranches and recommendation history.`)) return;
    await supabase.from("recommendation_log").delete().eq("client_id", targetId).eq("stock_id", row.stock_id);
    const { error } = await supabase.from("portfolio_stocks").delete().eq("id", row.portfolio_stock_id);
    if (error) {
      toast({ title: "Failed to remove", description: error.message, variant: "destructive" });
    } else {
      setRows((prev) => prev.filter((r) => r.portfolio_stock_id !== row.portfolio_stock_id));
      toast({ title: `${row.symbol} removed from portfolio` });
      onStockRemoved?.();
    }
  };

  const totalInvestment = rows.reduce((s, r) => s + r.invested_value, 0);
  const currentValue = rows.reduce((s, r) => s + r.current_value, 0);
  const totalPnl = currentValue - totalInvestment;
  const pnlPct = totalInvestment > 0 ? (totalPnl / totalInvestment) * 100 : 0;
  const realizedPnl = sales.reduce((s, x) => s + x.pnl, 0);

  return (
    <div className="space-y-6">
      <PortfolioSummary
        totalInvestment={totalInvestment}
        currentValue={currentValue}
        totalPnl={totalPnl}
        pnlPct={pnlPct}
        realizedPnl={realizedPnl}
      />

      {targetId && (
        <RecordSaleDialog
          clientId={targetId}
          target={saleTarget}
          onOpenChange={(open) => !open && setSaleTarget(null)}
          onRecorded={() => setReloadKey((k) => k + 1)}
        />
      )}

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Portfolio Holdings</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Aggregated across all tranches</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold text-xs">SYMBOL</TableHead>
                <TableHead className="font-semibold text-xs hidden lg:table-cell">COMPANY</TableHead>
                <TableHead className="font-semibold text-xs text-right">QTY</TableHead>
                <TableHead className="font-semibold text-xs text-right">AVG BUY</TableHead>
                <TableHead className="font-semibold text-xs text-right hidden md:table-cell">INVESTED</TableHead>
                <TableHead className="font-semibold text-xs text-right hidden md:table-cell">CURRENT</TableHead>
                <TableHead className="font-semibold text-xs text-right">CMP</TableHead>
                <TableHead className="font-semibold text-xs text-right">P&L</TableHead>
                <TableHead className="font-semibold text-xs text-right">P&L %</TableHead>
                <TableHead className="font-semibold text-xs w-10" />
                {isAdmin && <TableHead className="font-semibold text-xs w-10" />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 11 : 10} className="text-center py-8 text-muted-foreground text-sm">
                    No stocks in your portfolio yet
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => {
                  const isProfit = row.total_pnl >= 0;
                  return (
                    <TableRow key={row.symbol} className="hover:bg-muted/30">
                      <TableCell className="font-semibold text-sm">{row.symbol}</TableCell>
                      <TableCell className="text-xs text-muted-foreground hidden lg:table-cell max-w-[200px] truncate">
                        {row.company_name}
                      </TableCell>
                      <TableCell className="text-right text-sm">{row.total_qty}</TableCell>
                      <TableCell className="text-right text-sm">₹{formatNumber(row.avg_buy_price)}</TableCell>
                      <TableCell className="text-right text-sm hidden md:table-cell">
                        {formatCurrency(row.invested_value)}
                      </TableCell>
                      <TableCell className="text-right text-sm hidden md:table-cell">
                        {formatCurrency(row.current_value)}
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium">
                        ₹{formatNumber(row.closing_price)}
                      </TableCell>
                      <TableCell className={`text-right text-sm font-medium ${isProfit ? "text-success" : "text-destructive"}`}>
                        {isProfit ? "+" : ""}{formatCurrency(row.total_pnl)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded ${
                            isProfit ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {isProfit ? "+" : ""}{row.pnl_pct.toFixed(2)}%
                        </span>
                      </TableCell>
                      <TableCell>
                        {row.total_qty > 0 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-primary"
                            title="Record sale"
                            onClick={() =>
                              setSaleTarget({
                                portfolio_stock_id: row.portfolio_stock_id,
                                stock_id: row.stock_id,
                                symbol: row.symbol,
                                plan_type: "elite_prime",
                                total_qty: row.total_qty,
                                avg_buy_price: row.avg_buy_price,
                              })
                            }
                          >
                            <Banknote className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </TableCell>
                      {isAdmin && (
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveStock(row)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <RealizedPnlTable sales={sales} />
    </div>
  );
};

export default LiveDashboard;
