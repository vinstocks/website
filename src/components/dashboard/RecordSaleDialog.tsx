import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/utils/format";
import { supabase } from "@/lib/supabase";

export interface SaleTarget {
  portfolio_stock_id: string;
  stock_id: number;
  symbol: string;
  plan_type: "elite_prime" | "stars";
  total_qty: number;
  avg_buy_price: number;
}

interface RecordSaleDialogProps {
  clientId: string;
  target: SaleTarget | null;
  onOpenChange: (open: boolean) => void;
  onRecorded?: () => void;
}

const localDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

const RecordSaleDialog = ({ clientId, target, onOpenChange, onRecorded }: RecordSaleDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState(localDate());

  useEffect(() => {
    if (target) {
      setQty(String(target.total_qty));
      setPrice("");
      setDate(localDate());
    }
  }, [target]);

  if (!target) return null;

  const qtyNum = Number(qty) || 0;
  const priceNum = Number(price) || 0;
  const pnl = (priceNum - target.avg_buy_price) * qtyNum;
  const isFullExit = qtyNum >= target.total_qty;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (qtyNum <= 0 || qtyNum > target.total_qty) {
      toast({ title: "Invalid quantity", description: `You hold ${target.total_qty} shares.`, variant: "destructive" });
      return;
    }
    if (priceNum <= 0) {
      toast({ title: "Enter the sell price", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error: saleError } = await supabase.from("sales").insert({
        client_id: clientId,
        stock_id: target.stock_id,
        plan_type: target.plan_type,
        quantity: qtyNum,
        buy_price: target.avg_buy_price,
        sell_price: priceNum,
        sell_date: date,
        pnl,
      });
      if (saleError) throw new Error(saleError.message);

      // Reduce holdings, oldest tranche first (Stars has a single tranche-less holding)
      const { data: holdings } = await supabase
        .from("holdings")
        .select("id, quantity, tranches(tranche_number)")
        .eq("portfolio_stock_id", target.portfolio_stock_id)
        .gt("quantity", 0);

      const sorted = (holdings || []).sort(
        (a: any, b: any) => (a.tranches?.tranche_number ?? 0) - (b.tranches?.tranche_number ?? 0)
      );
      let remaining = qtyNum;
      for (const h of sorted) {
        if (remaining <= 0) break;
        const take = Math.min(h.quantity, remaining);
        await supabase.from("holdings").update({ quantity: h.quantity - take }).eq("id", h.id);
        remaining -= take;
      }

      // Fill result + running P&L on the latest sell recommendation, if any.
      // Clients lack update rights on recommendation_log — ignore failures.
      const { data: sellRec } = await supabase
        .from("recommendation_log")
        .select("id, pnl_amount")
        .eq("client_id", clientId)
        .eq("stock_id", target.stock_id)
        .eq("type", "sell")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (sellRec) {
        const result = isFullExit ? (pnl < 0 ? "Loss" : "Full Exit") : "Partial Booking";
        await supabase
          .from("recommendation_log")
          .update({ result, pnl_amount: (sellRec.pnl_amount || 0) + pnl, sell_price: priceNum })
          .eq("id", sellRec.id);
      }

      toast({
        title: `Sale recorded: ${target.symbol}`,
        description: `${qtyNum} shares at ₹${priceNum} — realized P&L ${pnl >= 0 ? "+" : ""}${formatCurrency(pnl)}`,
      });
      onOpenChange(false);
      onRecorded?.();
    } catch (err: any) {
      toast({ title: "Failed to record sale", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={!!target} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Record Sale — {target.symbol}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <p className="text-xs text-muted-foreground -mt-2">
            Holding {target.total_qty} shares at avg ₹{target.avg_buy_price.toFixed(2)}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sale-qty">Quantity Sold</Label>
              <Input id="sale-qty" type="number" min={1} max={target.total_qty} value={qty} onChange={(e) => setQty(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sale-price">Sell Price (₹)</Label>
              <Input id="sale-price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sale-date">Sell Date</Label>
            <Input id="sale-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          {priceNum > 0 && qtyNum > 0 && (
            <div className={`rounded-lg border p-3 text-sm font-medium ${pnl >= 0 ? "border-success/30 bg-success/5 text-success" : "border-destructive/30 bg-destructive/5 text-destructive"}`}>
              Realized P&L: {pnl >= 0 ? "+" : ""}{formatCurrency(pnl)}
              <span className="block text-xs font-normal text-muted-foreground mt-0.5">
                {isFullExit ? "Full exit — stock will show 0 qty" : `Partial — ${target.total_qty - qtyNum} shares remain`}
              </span>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Recording..." : "Record Sale"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RecordSaleDialog;
