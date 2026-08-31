import { useState, useEffect } from "react";
import { Search, Loader2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import type { MasterStock } from "@/lib/types";

interface AddStockDialogProps {
  clientId: string;
  planType: "elite_prime" | "stars";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdded: () => void;
}

const AddStockDialog = ({ clientId, planType, open, onOpenChange, onAdded }: AddStockDialogProps) => {
  const { toast } = useToast();
  const [stockSearch, setStockSearch] = useState("");
  const [filteredStocks, setFilteredStocks] = useState<MasterStock[]>([]);
  const [selectedStock, setSelectedStock] = useState<MasterStock | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setStockSearch("");
      setFilteredStocks([]);
      setSelectedStock(null);
    }
  }, [open]);

  useEffect(() => {
    if (stockSearch.length < 2 || selectedStock) {
      setFilteredStocks([]);
      return;
    }
    const debounce = setTimeout(async () => {
      const { data } = await supabase
        .from("master_stocks")
        .select("*")
        .or(`symbol.ilike.%${stockSearch}%,company_name.ilike.%${stockSearch}%`)
        .limit(8);
      if (data) setFilteredStocks(data as MasterStock[]);
    }, 300);
    return () => clearTimeout(debounce);
  }, [stockSearch, selectedStock]);

  const handleAdd = async () => {
    if (!selectedStock) return;
    setLoading(true);

    try {
      const { data: existing } = await supabase
        .from("portfolio_stocks")
        .select("id")
        .eq("client_id", clientId)
        .eq("stock_id", selectedStock.id)
        .eq("plan_type", planType)
        .maybeSingle();

      if (existing) {
        toast({ title: "Stock already in portfolio", description: `${selectedStock.symbol} is already added.`, variant: "destructive" });
        setLoading(false);
        return;
      }

      const { data: ps, error: psErr } = await supabase
        .from("portfolio_stocks")
        .insert({
          client_id: clientId,
          stock_id: selectedStock.id,
          plan_type: planType,
          status: "BUY",
        })
        .select("id")
        .single();

      if (psErr) throw psErr;

      await supabase.from("recommendation_log").insert({
        client_id: clientId,
        stock_id: selectedStock.id,
        plan_type: planType,
        type: "buy",
        recommendation_date: new Date().toISOString().split("T")[0],
      });

      if (planType === "elite_prime") {
        const { data: tranches } = await supabase
          .from("tranches")
          .select("id")
          .eq("client_id", clientId);

        if (tranches && tranches.length > 0) {
          const holdingRows = tranches.map((t: any) => ({
            portfolio_stock_id: ps.id,
            tranche_id: t.id,
            quantity: 0,
            avg_buy_price: 0,
          }));
          await supabase.from("holdings").insert(holdingRows);
        }
      } else {
        await supabase.from("holdings").insert({
          portfolio_stock_id: ps.id,
          quantity: 0,
          avg_buy_price: 0,
        });
      }

      toast({ title: `${selectedStock.symbol} added to portfolio` });
      onOpenChange(false);
      onAdded();
    } catch (err: any) {
      toast({ title: "Failed to add stock", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Stock to {planType === "stars" ? "Stars" : "Elite/Prime"} Portfolio</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Search Stock</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Type symbol or company name..."
                value={selectedStock ? `${selectedStock.symbol} — ${selectedStock.company_name}` : stockSearch}
                onChange={(e) => {
                  if (selectedStock) {
                    setSelectedStock(null);
                    setStockSearch(e.target.value);
                  } else {
                    setStockSearch(e.target.value);
                  }
                }}
                className="pl-9"
                autoFocus
              />
            </div>
            {filteredStocks.length > 0 && (
              <div className="border border-border rounded-lg max-h-48 overflow-y-auto">
                {filteredStocks.map((stock) => (
                  <button
                    key={stock.id}
                    onClick={() => {
                      setSelectedStock(stock);
                      setFilteredStocks([]);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-muted transition-colors text-sm"
                  >
                    <span className="font-semibold">{stock.symbol}</span>
                    <span className="text-muted-foreground ml-2">{stock.company_name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              disabled={!selectedStock || loading}
              onClick={handleAdd}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Add Stock
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddStockDialog;
