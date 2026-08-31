import { useState, useEffect } from "react";
import { Loader2, Trash2, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import PortfolioSummary from "./PortfolioSummary";
import EditableCell from "./EditableCell";
import AddStockDialog from "@/components/admin/AddStockDialog";
import { formatCurrency, formatNumber } from "@/lib/utils/format";
import { supabase } from "@/lib/supabase";
import { refreshLivePrices } from "@/lib/prices";
import { useAuth } from "@/lib/auth";
import type { Tranche, TrancheHolding } from "@/lib/types";

const TrancheView = ({ clientId, onStockRemoved }: { clientId?: string; onStockRemoved?: () => void }) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const targetId = clientId || user?.id;
  const isAdmin = !!clientId && profile?.role === "admin";
  const [tranches, setTranches] = useState<Tranche[]>([]);
  const [holdingsMap, setHoldingsMap] = useState<Record<string, TrancheHolding[]>>({});
  const [activeTranche, setActiveTranche] = useState("");
  const [loading, setLoading] = useState(true);
  const [addStockOpen, setAddStockOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [removeTarget, setRemoveTarget] = useState<TrancheHolding | null>(null);

  useEffect(() => {
    if (!targetId) return;
    const fetch = async () => {
      await refreshLivePrices(targetId);
      const { data: trancheData } = await supabase
        .from("tranches")
        .select("*")
        .eq("client_id", targetId)
        .order("tranche_number");

      if (!trancheData || trancheData.length === 0) {
        setTranches([]);
        setLoading(false);
        return;
      }

      setTranches(trancheData as Tranche[]);
      setActiveTranche(trancheData[0].id);

      const { data: psData } = await supabase
        .from("portfolio_stocks")
        .select("id, stock_id, current_price, master_stocks(symbol, company_name)")
        .eq("client_id", targetId)
        .eq("plan_type", "elite_prime");

      const psIds = (psData || []).map((ps: any) => ps.id);
      if (psIds.length === 0) {
        setLoading(false);
        return;
      }

      const { data: holdingsData } = await supabase
        .from("holdings")
        .select("id, portfolio_stock_id, tranche_id, quantity, avg_buy_price")
        .in("portfolio_stock_id", psIds);

      const psMap: Record<string, any> = {};
      (psData || []).forEach((ps: any) => { psMap[ps.id] = ps; });

      const map: Record<string, TrancheHolding[]> = {};
      trancheData.forEach((t: any) => { map[t.id] = []; });

      (holdingsData || []).forEach((h: any) => {
        if (!h.tranche_id || !map[h.tranche_id]) return;
        const ps = psMap[h.portfolio_stock_id];
        if (!ps) return;
        const invested = h.quantity * h.avg_buy_price;
        const current = h.quantity * ps.current_price;
        const pnl = current - invested;
        map[h.tranche_id].push({
          portfolio_stock_id: h.portfolio_stock_id,
          stock_id: ps.stock_id,
          symbol: ps.master_stocks.symbol,
          company_name: ps.master_stocks.company_name,
          quantity: h.quantity,
          avg_buy_price: h.avg_buy_price,
          invested_value: invested,
          current_value: current,
          closing_price: ps.current_price,
          total_pnl: pnl,
          pnl_pct: invested > 0 ? (pnl / invested) * 100 : 0,
          holding_id: h.id,
        });
      });

      setHoldingsMap(map);
      setLoading(false);
    };
    fetch();
  }, [targetId, reloadKey]);

  const handleQuantityChange = async (holdingId: string, value: number) => {
    await supabase.from("holdings").update({ quantity: value }).eq("id", holdingId);
    setHoldingsMap((prev) => {
      const updated = { ...prev };
      for (const tid of Object.keys(updated)) {
        updated[tid] = updated[tid].map((h) =>
          h.holding_id === holdingId ? { ...h, quantity: value, invested_value: value * h.avg_buy_price, current_value: value * h.closing_price, total_pnl: value * h.closing_price - value * h.avg_buy_price, pnl_pct: h.avg_buy_price > 0 ? ((h.closing_price - h.avg_buy_price) / h.avg_buy_price) * 100 : 0 } : h
        );
      }
      return updated;
    });
  };

  const handlePriceChange = async (holdingId: string, value: number) => {
    await supabase.from("holdings").update({ avg_buy_price: value }).eq("id", holdingId);
    setHoldingsMap((prev) => {
      const updated = { ...prev };
      for (const tid of Object.keys(updated)) {
        updated[tid] = updated[tid].map((h) =>
          h.holding_id === holdingId ? { ...h, avg_buy_price: value, invested_value: h.quantity * value, total_pnl: h.quantity * h.closing_price - h.quantity * value, pnl_pct: value > 0 ? ((h.closing_price - value) / value) * 100 : 0 } : h
        );
      }
      return updated;
    });
  };

  const handleRemoveStock = async () => {
    if (!removeTarget) return;
    await supabase.from("recommendation_log").delete().eq("client_id", targetId).eq("stock_id", removeTarget.stock_id);
    const { error } = await supabase.from("portfolio_stocks").delete().eq("id", removeTarget.portfolio_stock_id);
    if (error) {
      toast({ title: "Failed to remove", description: error.message, variant: "destructive" });
    } else {
      setHoldingsMap((prev) => {
        const updated: Record<string, TrancheHolding[]> = {};
        for (const tid of Object.keys(prev)) {
          updated[tid] = prev[tid].filter((h) => h.portfolio_stock_id !== removeTarget.portfolio_stock_id);
        }
        return updated;
      });
      toast({ title: `${removeTarget.symbol} removed from portfolio` });
      onStockRemoved?.();
    }
    setRemoveTarget(null);
  };

  const handleTrancheDateChange = async (trancheId: string, value: string) => {
    await supabase.from("tranches").update({ date: value }).eq("id", trancheId);
    setTranches((prev) => prev.map((t) => t.id === trancheId ? { ...t, date: value } : t));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (tranches.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Tranche View</h2>
          <p className="text-sm text-muted-foreground mt-0.5">No tranches set up yet</p>
        </div>
      </div>
    );
  }

  const holdings = holdingsMap[activeTranche] || [];
  const totalInvested = holdings.reduce((sum, h) => sum + h.invested_value, 0);
  const totalCurrent = holdings.reduce((sum, h) => sum + h.current_value, 0);
  const totalPnl = totalCurrent - totalInvested;
  const pnlPct = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Tranche View</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          View and update your holdings per investment tranche
        </p>
      </div>

      {isAdmin && (
        <>
          <Button size="sm" variant="outline" onClick={() => setAddStockOpen(true)}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Stock
          </Button>
          <AddStockDialog
            clientId={targetId!}
            planType="elite_prime"
            open={addStockOpen}
            onOpenChange={setAddStockOpen}
            onAdded={() => setReloadKey((k) => k + 1)}
          />
        </>
      )}

      <Tabs value={activeTranche} onValueChange={setActiveTranche}>
        <TabsList className="flex-wrap h-auto gap-1">
          {tranches.map((t) => (
            <TabsTrigger key={t.id} value={t.id} className="text-xs">
              {t.label}
              {t.date && (
                <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5 py-0">
                  {new Date(t.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {tranches.map((t) => {
          const tHoldings = holdingsMap[t.id] || [];
          const tInvested = tHoldings.reduce((sum, h) => sum + h.invested_value, 0);
          const tCurrent = tHoldings.reduce((sum, h) => sum + h.current_value, 0);
          const tPnl = tCurrent - tInvested;
          const tPnlPct = tInvested > 0 ? (tPnl / tInvested) * 100 : 0;

          return (
            <TabsContent key={t.id} value={t.id} className="space-y-4 mt-4">
              {tInvested > 0 && (
                <PortfolioSummary
                  totalInvestment={tInvested}
                  currentValue={tCurrent}
                  totalPnl={tPnl}
                  pnlPct={tPnlPct}
                />
              )}

              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{t.label}</h3>
                    {isAdmin ? (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span>Invested on</span>
                        <EditableCell
                          value={t.date || ""}
                          onSave={(v) => handleTrancheDateChange(t.id, v)}
                          type="date"
                          placeholder="Set date"
                        />
                      </div>
                    ) : t.date ? (
                      <p className="text-xs text-muted-foreground">
                        Invested on {new Date(t.date).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
                      </p>
                    ) : null}
                  </div>
                  {tHoldings.length > 0 && tHoldings.every((h) => h.quantity === 0) && (
                    <Badge variant="outline" className="text-xs">
                      Pending — Fill Qty & Price after purchase
                    </Badge>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold text-xs">SYMBOL</TableHead>
                        <TableHead className="font-semibold text-xs hidden lg:table-cell">COMPANY</TableHead>
                        <TableHead className="font-semibold text-xs text-right">QTY ✏️</TableHead>
                        <TableHead className="font-semibold text-xs text-right">AVG BUY ✏️</TableHead>
                        <TableHead className="font-semibold text-xs text-right hidden md:table-cell">INVESTED</TableHead>
                        <TableHead className="font-semibold text-xs text-right hidden md:table-cell">CURRENT</TableHead>
                        <TableHead className="font-semibold text-xs text-right">CMP</TableHead>
                        <TableHead className="font-semibold text-xs text-right">P&L</TableHead>
                        <TableHead className="font-semibold text-xs text-right">P&L %</TableHead>
                        {isAdmin && <TableHead className="font-semibold text-xs w-10" />}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tHoldings.map((row) => {
                        const isProfit = row.total_pnl >= 0;
                        const isEmpty = row.quantity === 0;
                        return (
                          <TableRow key={row.holding_id} className={`hover:bg-muted/30 ${isEmpty ? "opacity-60" : ""}`}>
                            <TableCell className="font-semibold text-sm">{row.symbol}</TableCell>
                            <TableCell className="text-xs text-muted-foreground hidden lg:table-cell max-w-[200px] truncate">
                              {row.company_name}
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
                                <span
                                  className={`text-xs font-medium px-2 py-1 rounded ${
                                    isProfit ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                                  }`}
                                >
                                  {isProfit ? "+" : ""}{row.pnl_pct.toFixed(2)}%
                                </span>
                              )}
                            </TableCell>
                            {isAdmin && (
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                  onClick={() => setRemoveTarget(row)}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </TableCell>
                            )}
                          </TableRow>
                        );
                      })}
                      {tHoldings.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={isAdmin ? 10 : 9} className="text-center py-8 text-muted-foreground text-sm">
                            No stocks added to this tranche yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>

      <Dialog open={!!removeTarget} onOpenChange={(open) => !open && setRemoveTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-destructive">Remove Stock</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Remove <span className="font-semibold text-foreground">{removeTarget?.symbol}</span> from portfolio?
            This deletes all holdings across all tranches and recommendation history.
          </p>
          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1" onClick={() => setRemoveTarget(null)}>Cancel</Button>
            <Button variant="destructive" className="flex-1" onClick={handleRemoveStock}>Remove</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrancheView;
