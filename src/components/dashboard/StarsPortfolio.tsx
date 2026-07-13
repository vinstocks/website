import { useState, useEffect } from "react";
import { ExternalLink, Loader2, Trash2, Banknote } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import PortfolioSummary from "./PortfolioSummary";
import RecordSaleDialog, { SaleTarget } from "./RecordSaleDialog";
import RealizedPnlTable from "./RealizedPnlTable";
import EditableCell from "./EditableCell";
import { formatCurrency, formatNumber } from "@/lib/utils/format";
import { supabase } from "@/lib/supabase";
import { refreshLivePrices } from "@/lib/prices";
import { useAuth } from "@/lib/auth";
import type { StarsHolding, Sale } from "@/lib/types";

const statusColors: Record<string, string> = {
  BUY: "bg-success/10 text-success border-success/30",
  HOLD: "bg-primary/10 text-primary border-primary/30",
  SELL: "bg-destructive/10 text-destructive border-destructive/30",
};

const StarsPortfolio = ({ clientId, onStockRemoved }: { clientId?: string; onStockRemoved?: () => void }) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const targetId = clientId || user?.id;
  const isAdmin = !!clientId && profile?.role === "admin";
  const [holdings, setHoldings] = useState<StarsHolding[]>([]);
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
        .eq("plan_type", "stars")
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
        .select("id, stock_id, current_price, buying_range, allocation_pct, suggested_amount, duration, upside_potential, status, report_url, created_at, master_stocks(symbol, company_name)")
        .eq("client_id", targetId)
        .eq("plan_type", "stars");

      if (!psData || psData.length === 0) {
        setHoldings([]);
        setLoading(false);
        return;
      }

      const psIds = psData.map((ps: any) => ps.id);
      const stockIds = psData.map((ps: any) => ps.stock_id);
      const [{ data: holdingsData }, { data: recData }] = await Promise.all([
        supabase
          .from("holdings")
          .select("id, portfolio_stock_id, quantity, avg_buy_price")
          .in("portfolio_stock_id", psIds),
        supabase
          .from("recommendation_log")
          .select("stock_id, recommendation_date")
          .eq("client_id", targetId)
          .eq("plan_type", "stars")
          .eq("type", "buy")
          .in("stock_id", stockIds),
      ]);

      const hMap: Record<string, any> = {};
      (holdingsData || []).forEach((h: any) => { hMap[h.portfolio_stock_id] = h; });

      const recDateMap: Record<number, string> = {};
      (recData || []).forEach((r: any) => { recDateMap[r.stock_id] = r.recommendation_date; });

      const rows: StarsHolding[] = psData.map((ps: any) => {
        const h = hMap[ps.id] || { id: "", quantity: 0, avg_buy_price: 0 };
        const invested = h.quantity * h.avg_buy_price;
        const current = h.quantity * ps.current_price;
        const pnl = current - invested;
        return {
          portfolio_stock_id: ps.id,
          stock_id: ps.stock_id,
          recommendation_date: recDateMap[ps.stock_id] || ps.created_at?.split("T")[0] || "",
          symbol: ps.master_stocks.symbol,
          company_name: ps.master_stocks.company_name,
          buying_range: ps.buying_range || "",
          allocation_pct: ps.allocation_pct || 0,
          suggested_amount: ps.suggested_amount || 0,
          quantity: h.quantity,
          avg_buy_price: h.avg_buy_price,
          invested_value: invested,
          current_value: current,
          closing_price: ps.current_price,
          total_pnl: pnl,
          pnl_pct: invested > 0 ? (pnl / invested) * 100 : 0,
          duration: ps.duration || "",
          upside_potential: ps.upside_potential || "",
          report_url: ps.report_url,
          status: ps.status || "BUY",
          holding_id: h.id,
        };
      });

      setHoldings(rows);
      setLoading(false);
    };
    fetch();
  }, [targetId, reloadKey]);

  const handleQuantityChange = async (holdingId: string, value: number) => {
    await supabase.from("holdings").update({ quantity: value }).eq("id", holdingId);
    setHoldings((prev) =>
      prev.map((h) =>
        h.holding_id === holdingId
          ? { ...h, quantity: value, invested_value: value * h.avg_buy_price, current_value: value * h.closing_price, total_pnl: value * h.closing_price - value * h.avg_buy_price, pnl_pct: h.avg_buy_price > 0 ? ((h.closing_price - h.avg_buy_price) / h.avg_buy_price) * 100 : 0 }
          : h
      )
    );
  };

  const handlePriceChange = async (holdingId: string, value: number) => {
    await supabase.from("holdings").update({ avg_buy_price: value }).eq("id", holdingId);
    setHoldings((prev) =>
      prev.map((h) =>
        h.holding_id === holdingId
          ? { ...h, avg_buy_price: value, invested_value: h.quantity * value, total_pnl: h.quantity * h.closing_price - h.quantity * value, pnl_pct: value > 0 ? ((h.closing_price - value) / value) * 100 : 0 }
          : h
      )
    );
  };

  const handleRemoveStock = async (row: StarsHolding) => {
    if (!window.confirm(`Remove ${row.symbol} from Stars portfolio? This deletes its holdings and recommendation history.`)) return;
    await supabase.from("recommendation_log").delete().eq("client_id", targetId).eq("stock_id", row.stock_id);
    const { error } = await supabase.from("portfolio_stocks").delete().eq("id", row.portfolio_stock_id);
    if (error) {
      toast({ title: "Failed to remove", description: error.message, variant: "destructive" });
    } else {
      setHoldings((prev) => prev.filter((h) => h.portfolio_stock_id !== row.portfolio_stock_id));
      toast({ title: `${row.symbol} removed from Stars portfolio` });
      onStockRemoved?.();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const totalInvestment = holdings.reduce((s, h) => s + h.invested_value, 0);
  const currentValue = holdings.reduce((s, h) => s + h.current_value, 0);
  const totalPnl = currentValue - totalInvestment;
  const pnlPct = totalInvestment > 0 ? (totalPnl / totalInvestment) * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Stars Portfolio</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Mid-term stock recommendations with allocation-based investing
        </p>
      </div>

      <PortfolioSummary
        totalInvestment={totalInvestment}
        currentValue={currentValue}
        totalPnl={totalPnl}
        pnlPct={pnlPct}
        allocatedAmount={profile?.stars_allocated_amount || undefined}
        realizedPnl={sales.reduce((s, x) => s + x.pnl, 0)}
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
          <h3 className="text-base font-semibold text-foreground">Stars Holdings</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Click Qty or Avg Price to update after purchasing
          </p>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold text-xs">DATE</TableHead>
                <TableHead className="font-semibold text-xs">SYMBOL</TableHead>
                <TableHead className="font-semibold text-xs hidden xl:table-cell">COMPANY</TableHead>
                <TableHead className="font-semibold text-xs hidden lg:table-cell">BUYING RANGE</TableHead>
                <TableHead className="font-semibold text-xs text-right hidden lg:table-cell">ALLOC %</TableHead>
                <TableHead className="font-semibold text-xs text-right">QTY ✏️</TableHead>
                <TableHead className="font-semibold text-xs text-right">AVG PRICE ✏️</TableHead>
                <TableHead className="font-semibold text-xs text-right hidden md:table-cell">INVESTED</TableHead>
                <TableHead className="font-semibold text-xs text-right hidden md:table-cell">CURRENT</TableHead>
                <TableHead className="font-semibold text-xs text-right">CMP</TableHead>
                <TableHead className="font-semibold text-xs text-right">P&L</TableHead>
                <TableHead className="font-semibold text-xs text-right">P&L %</TableHead>
                <TableHead className="font-semibold text-xs hidden lg:table-cell">DURATION</TableHead>
                <TableHead className="font-semibold text-xs hidden xl:table-cell">UPSIDE</TableHead>
                <TableHead className="font-semibold text-xs text-center">STATUS</TableHead>
                <TableHead className="font-semibold text-xs text-center hidden md:table-cell">REPORT</TableHead>
                <TableHead className="font-semibold text-xs w-10" />
                {isAdmin && <TableHead className="font-semibold text-xs w-10" />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 18 : 17} className="text-center py-8 text-muted-foreground text-sm">
                    No Stars recommendations yet
                  </TableCell>
                </TableRow>
              ) : (
                holdings.map((row) => {
                  const isProfit = row.total_pnl >= 0;
                  const isEmpty = row.quantity === 0;
                  return (
                    <TableRow key={row.holding_id} className={`hover:bg-muted/30 ${isEmpty ? "opacity-60" : ""}`}>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {row.recommendation_date ? new Date(row.recommendation_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "—"}
                      </TableCell>
                      <TableCell className="font-semibold text-sm">{row.symbol}</TableCell>
                      <TableCell className="text-xs text-muted-foreground hidden xl:table-cell max-w-[180px] truncate">
                        {row.company_name}
                      </TableCell>
                      <TableCell className="text-xs hidden lg:table-cell whitespace-nowrap">
                        {row.buying_range ? `₹${row.buying_range}` : "—"}
                      </TableCell>
                      <TableCell className="text-right text-sm hidden lg:table-cell">
                        {row.allocation_pct > 0 ? `${row.allocation_pct}%` : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <EditableCell
                          value={row.quantity}
                          onSave={(v) => handleQuantityChange(row.holding_id, v)}
                          placeholder="Add qty"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <EditableCell
                          value={row.avg_buy_price}
                          onSave={(v) => handlePriceChange(row.holding_id, v)}
                          prefix="₹"
                          placeholder="Add price"
                        />
                      </TableCell>
                      <TableCell className="text-right text-sm hidden md:table-cell">
                        {isEmpty ? "—" : formatCurrency(row.invested_value)}
                      </TableCell>
                      <TableCell className="text-right text-sm hidden md:table-cell">
                        {isEmpty ? "—" : formatCurrency(row.current_value)}
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium">
                        ₹{formatNumber(row.closing_price)}
                      </TableCell>
                      <TableCell className={`text-right text-sm font-medium ${isEmpty ? "" : isProfit ? "text-success" : "text-destructive"}`}>
                        {isEmpty ? "—" : `${isProfit ? "+" : ""}${formatCurrency(row.total_pnl)}`}
                      </TableCell>
                      <TableCell className="text-right">
                        {isEmpty ? (
                          <span className="text-xs text-muted-foreground">—</span>
                        ) : (
                          <span className={`text-xs font-medium px-2 py-1 rounded ${isProfit ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                            {isProfit ? "+" : ""}{row.pnl_pct.toFixed(2)}%
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground hidden lg:table-cell whitespace-nowrap">
                        {row.duration || "—"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground hidden xl:table-cell whitespace-nowrap">
                        {row.upside_potential || "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={`text-[10px] ${statusColors[row.status] || ""}`}>
                          {row.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center hidden md:table-cell">
                        {row.report_url ? (
                          <a
                            href={row.report_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {row.quantity > 0 && (
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
                                plan_type: "stars",
                                total_qty: row.quantity,
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

export default StarsPortfolio;
