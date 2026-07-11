import { useState, useEffect } from "react";
import { ExternalLink, Loader2, Link2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

interface PortfolioStockRow {
  id: string;
  symbol: string;
  company_name: string;
  sector: string;
  plan_type: string;
  report_url: string | null;
}

const ManageReports = ({ clientId }: { clientId: string }) => {
  const { toast } = useToast();
  const [stocks, setStocks] = useState<PortfolioStockRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("portfolio_stocks")
        .select("id, plan_type, report_url, master_stocks(symbol, company_name, sector)")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      if (data) {
        setStocks(
          data.map((d: any) => ({
            id: d.id,
            symbol: d.master_stocks.symbol,
            company_name: d.master_stocks.company_name,
            sector: d.master_stocks.sector,
            plan_type: d.plan_type,
            report_url: d.report_url,
          }))
        );
      }
      setLoading(false);
    };
    fetch();
  }, [clientId]);

  const handleSave = async (stockId: string) => {
    setSaving(true);
    const url = editUrl.trim() || null;
    const { error } = await supabase
      .from("portfolio_stocks")
      .update({ report_url: url })
      .eq("id", stockId);

    if (error) {
      toast({ title: "Failed to save", description: error.message, variant: "destructive" });
    } else {
      setStocks((prev) =>
        prev.map((s) => (s.id === stockId ? { ...s, report_url: url } : s))
      );
      toast({ title: "Report link saved" });
      setEditingId(null);
      setEditUrl("");
    }
    setSaving(false);
  };

  const handleRemove = async (stockId: string) => {
    const { error } = await supabase
      .from("portfolio_stocks")
      .update({ report_url: null })
      .eq("id", stockId);

    if (!error) {
      setStocks((prev) =>
        prev.map((s) => (s.id === stockId ? { ...s, report_url: null } : s))
      );
      toast({ title: "Report link removed" });
    }
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
        <h3 className="text-base font-semibold text-foreground">Research Reports</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Add Google Drive or other links to research reports for each stock
        </p>
      </div>

      {stocks.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No portfolio stocks yet. Push a recommendation first.
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {stocks.map((stock) => (
            <Card key={stock.id} className="p-3">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 min-w-[180px]">
                  <div>
                    <span className="font-semibold text-sm">{stock.symbol}</span>
                    <span className="text-xs text-muted-foreground ml-2 hidden sm:inline">
                      {stock.company_name}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-[10px] capitalize">
                    {stock.plan_type === "elite_prime" ? "E/P" : "Stars"}
                  </Badge>
                </div>

                <div className="flex-1 min-w-[200px]">
                  {editingId === stock.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="https://drive.google.com/..."
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        className="text-xs h-8"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={() => handleSave(stock.id)}
                        disabled={saving}
                        className="h-8 px-3"
                      >
                        {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : "Save"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setEditingId(null); setEditUrl(""); }}
                        className="h-8 px-2"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : stock.report_url ? (
                    <div className="flex items-center gap-2">
                      <a
                        href={stock.report_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline truncate max-w-[300px] flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        {stock.report_url}
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => { setEditingId(stock.id); setEditUrl(stock.report_url || ""); }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                        onClick={() => handleRemove(stock.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => { setEditingId(stock.id); setEditUrl(""); }}
                    >
                      <Link2 className="w-3 h-3 mr-1" />
                      Add Report Link
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageReports;
