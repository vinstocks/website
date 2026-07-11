import { useState, useEffect, useCallback } from "react";
import { Plus, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import type { Tranche } from "@/lib/types";

const ManageTranches = ({ clientId }: { clientId: string }) => {
  const { toast } = useToast();
  const [tranches, setTranches] = useState<Tranche[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newDate, setNewDate] = useState("");
  const [isAddition, setIsAddition] = useState(false);

  const fetchTranches = useCallback(async () => {
    const { data } = await supabase
      .from("tranches")
      .select("*")
      .eq("client_id", clientId)
      .order("tranche_number");
    if (data) setTranches(data as Tranche[]);
    setLoading(false);
  }, [clientId]);

  useEffect(() => {
    fetchTranches();
  }, [fetchTranches]);

  const handleAdd = async () => {
    if (!newLabel.trim()) return;
    setAdding(true);

    const nextNumber = tranches.length > 0
      ? Math.max(...tranches.map((t) => t.tranche_number)) + 1
      : 1;

    const { error } = await supabase.from("tranches").insert({
      client_id: clientId,
      tranche_number: nextNumber,
      label: newLabel.trim(),
      date: newDate || null,
      is_addition: isAddition,
    });

    if (error) {
      toast({ title: "Failed to create tranche", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Tranche created", description: `${newLabel} added successfully` });
      setNewLabel("");
      setNewDate("");
      setIsAddition(false);

      const { data: newTranche } = await supabase
        .from("tranches")
        .select("id")
        .eq("client_id", clientId)
        .eq("tranche_number", nextNumber)
        .single();

      if (newTranche) {
        const { data: psData } = await supabase
          .from("portfolio_stocks")
          .select("id")
          .eq("client_id", clientId)
          .eq("plan_type", "elite_prime");

        if (psData && psData.length > 0) {
          await supabase.from("holdings").insert(
            psData.map((ps: any) => ({
              portfolio_stock_id: ps.id,
              tranche_id: newTranche.id,
              quantity: 0,
              avg_buy_price: 0,
            }))
          );
        }
      }

      fetchTranches();
    }
    setAdding(false);
  };

  const handleDelete = async (tranche: Tranche) => {
    if (!window.confirm(`Delete "${tranche.label}" and all its holdings? This cannot be undone.`)) {
      return;
    }

    await supabase.from("holdings").delete().eq("tranche_id", tranche.id);
    await supabase.from("tranches").delete().eq("id", tranche.id);
    toast({ title: "Tranche deleted", description: `${tranche.label} and its holdings removed` });
    fetchTranches();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-foreground">Manage Tranches</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Create investment tranches for this client. Each tranche gets its own copy of portfolio stocks.
        </p>
      </div>

      {tranches.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">No tranches yet</p>
          <p className="text-xs text-muted-foreground">
            Create a tranche before pushing Elite/Prime recommendations
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tranches.map((t) => (
            <Card key={t.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{t.label}</p>
                  {t.is_addition && (
                    <Badge variant="outline" className="text-[10px]">Addition</Badge>
                  )}
                </div>
                {t.date && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(t.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => handleDelete(t)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}

      <Card className="p-4 space-y-3">
        <p className="text-sm font-medium text-foreground">Add New Tranche</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Label</Label>
            <Input
              placeholder="e.g. Tranche 1"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Investment Date</Label>
            <Input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
          </div>
          <div className="flex items-end gap-3">
            <div className="flex items-center gap-2 pb-2">
              <Switch checked={isAddition} onCheckedChange={setIsAddition} />
              <Label className="text-xs">Addition</Label>
            </div>
            <Button onClick={handleAdd} disabled={!newLabel.trim() || adding} size="sm" className="mb-0.5">
              {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-1" />}
              Add
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ManageTranches;
