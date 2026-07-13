import { useState, useEffect } from "react";
import { Search, Send, Loader2, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import type { MasterStock, Profile } from "@/lib/types";

const PushRecommendationForm = () => {
  const { toast } = useToast();
  const [stockSearch, setStockSearch] = useState("");
  const [filteredStocks, setFilteredStocks] = useState<MasterStock[]>([]);
  const [selectedStock, setSelectedStock] = useState<MasterStock | null>(null);
  const [recType, setRecType] = useState<"buy" | "sell">("buy");
  const [recPrice, setRecPrice] = useState("");
  const [targetType, setTargetType] = useState<"client" | "plan">("client");
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
  const [clientFilter, setClientFilter] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [isStars, setIsStars] = useState(false);
  const [buyingRange, setBuyingRange] = useState("");
  const [allocationPct, setAllocationPct] = useState("");
  const [sellRange, setSellRange] = useState("");
  const [sellAllocationPct, setSellAllocationPct] = useState("");
  const [duration, setDuration] = useState("");
  const [upside, setUpside] = useState("");
  const [suggestedAmount, setSuggestedAmount] = useState("");
  const [rationale, setRationale] = useState("");
  const [sendWhatsApp, setSendWhatsApp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Profile[]>([]);
  const [waQueue, setWaQueue] = useState<{ name: string; url: string }[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "client")
        .eq("is_active", true)
        .order("full_name");
      if (data) setClients(data as Profile[]);
    };
    fetchClients();
  }, []);

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

  const getTargetClients = (): Profile[] => {
    let list: Profile[];
    if (targetType === "client") {
      list = clients.filter((cl) => selectedClientIds.includes(cl.id));
    } else if (selectedPlan === "all") {
      list = clients;
    } else {
      list = clients.filter((c) => c.plan === selectedPlan);
    }
    // Stars recs only reach Stars subscribers; Elite/Prime recs never reach stars-only clients
    return list.filter((c) => (isStars ? c.has_stars : c.plan !== "stars"));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStock) return;

    const targets = getTargetClients();
    if (targets.length === 0) {
      toast({ title: "No clients selected", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      for (const client of targets) {
        const planType = isStars ? "stars" : "elite_prime";

        if (recType === "sell") {
          const { data: existing } = await supabase
            .from("portfolio_stocks")
            .select("id")
            .eq("client_id", client.id)
            .eq("stock_id", selectedStock.id)
            .eq("plan_type", planType)
            .maybeSingle();

          if (existing && isStars) {
            const { error: updErr } = await supabase
              .from("portfolio_stocks")
              .update({ status: "SELL" })
              .eq("id", existing.id);
            if (updErr) throw new Error(`Portfolio stock: ${updErr.message}`);
          }
        } else {
          const { data: ps, error: psErr } = await supabase
            .from("portfolio_stocks")
            .insert({
              client_id: client.id,
              stock_id: selectedStock.id,
              plan_type: planType,
              current_price: recPrice ? Number(recPrice) : 0,
              previous_price: 0,
              daily_change_pct: 0,
              ...(isStars
                ? {
                    buying_range: buyingRange || null,
                    allocation_pct: allocationPct ? Number(allocationPct) : null,
                    suggested_amount: suggestedAmount ? Number(suggestedAmount) : null,
                    duration: duration || null,
                    upside_potential: upside || null,
                    status: "BUY",
                  }
                : {}),
            })
            .select()
            .single();

          if (psErr) throw new Error(`Portfolio stock: ${psErr.message}`);

          if (isStars) {
            await supabase.from("holdings").insert({
              portfolio_stock_id: ps.id,
              tranche_id: null,
              quantity: 0,
              avg_buy_price: 0,
            });
          } else {
            const { data: tranches } = await supabase
              .from("tranches")
              .select("id")
              .eq("client_id", client.id);

            if (tranches && tranches.length > 0) {
              await supabase.from("holdings").insert(
                tranches.map((t) => ({
                  portfolio_stock_id: ps.id,
                  tranche_id: t.id,
                  quantity: 0,
                  avg_buy_price: 0,
                }))
              );
            }
          }
        }

        const now = new Date();
        const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
        await supabase.from("recommendation_log").insert({
          client_id: client.id,
          type: recType,
          stock_id: selectedStock.id,
          recommendation_date: localDate,
          recommendation_price: recPrice ? Number(recPrice) : 0,
          ...(recType === "sell"
            ? {
                sell_price: recPrice ? Number(recPrice) : 0,
                sell_range: sellRange || null,
                sell_allocation_pct: sellAllocationPct ? Number(sellAllocationPct) : null,
              }
            : {}),
          plan_type: planType,
          created_by: user.id,
        });
      }

      toast({
        title: "Recommendation pushed",
        description: `${recType.toUpperCase()} recommendation for ${selectedStock.symbol} sent to ${targets.length} client(s).`,
      });

      if (sendWhatsApp && targets.length > 0) {
        const detail = recType === "sell"
          ? sellRange ? ` (selling range ₹${sellRange})` : ""
          : rationale ? `. Rationale: ${rationale}` : "";
        setWaQueue(
          targets.map((client) => ({
            name: client.full_name,
            url: `https://wa.me/${client.phone?.replace(/\D/g, "")}?text=${encodeURIComponent(
              `Hi ${client.full_name}, new ${recType.toUpperCase()} recommendation: ${selectedStock.symbol} at ₹${recPrice}${detail} – Vinstocks`
            )}`,
          }))
        );
      }

      setSelectedStock(null);
      setStockSearch("");
      setRecPrice("");
      setBuyingRange("");
      setAllocationPct("");
      setSellRange("");
      setSellAllocationPct("");
      setDuration("");
      setUpside("");
      setSuggestedAmount("");
      setRationale("");
    } catch (err: any) {
      toast({
        title: "Failed to push recommendation",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Push Recommendation</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Send a buy or sell recommendation to clients
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">1. Select Stock</h3>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by symbol or company name..."
              value={stockSearch}
              onChange={(e) => {
                setStockSearch(e.target.value);
                if (selectedStock) setSelectedStock(null);
              }}
              className="pl-9"
            />
            {filteredStocks.length > 0 && !selectedStock && (
              <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-card border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto">
                {filteredStocks.map((stock) => (
                  <button
                    key={stock.id}
                    type="button"
                    onClick={() => {
                      setSelectedStock(stock);
                      setStockSearch(stock.symbol);
                      setFilteredStocks([]);
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-muted/50 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-sm">{stock.symbol}</span>
                      <span className="text-xs text-muted-foreground ml-2">{stock.company_name}</span>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">{stock.sector}</Badge>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedStock && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="flex-1">
                <p className="font-semibold text-sm">{selectedStock.symbol}</p>
                <p className="text-xs text-muted-foreground">{selectedStock.company_name}</p>
              </div>
              <Badge variant="secondary" className="text-xs">{selectedStock.sector}</Badge>
              <p className="text-xs text-muted-foreground">{selectedStock.isin}</p>
            </div>
          )}
        </Card>

        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">2. Recommendation Details</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={recType} onValueChange={(v: "buy" | "sell") => setRecType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rec-price">{recType === "sell" ? "Selling Price (₹)" : "Recommendation Price (₹)"}</Label>
              <Input id="rec-price" type="number" placeholder="1500" value={recPrice} onChange={(e) => setRecPrice(e.target.value)} />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <Label className="text-sm font-medium">Stars Recommendation</Label>
              <p className="text-xs text-muted-foreground">Push to Stars portfolio instead of Elite/Prime</p>
            </div>
            <Switch checked={isStars} onCheckedChange={setIsStars} />
          </div>

          {isStars && recType === "buy" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buying-range">Buying Range</Label>
                <Input id="buying-range" placeholder="630 to 670" value={buyingRange} onChange={(e) => setBuyingRange(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="allocation">Allocation %</Label>
                <Input id="allocation" type="number" placeholder="8" value={allocationPct} onChange={(e) => setAllocationPct(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="suggested-amount">Suggested Amount (₹)</Label>
                <Input id="suggested-amount" type="number" placeholder="80000" value={suggestedAmount} onChange={(e) => setSuggestedAmount(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input id="duration" placeholder="3 to 8 months" value={duration} onChange={(e) => setDuration(e.target.value)} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="upside">Upside Potential</Label>
                <Input id="upside" placeholder="18% to 20%" value={upside} onChange={(e) => setUpside(e.target.value)} />
              </div>
            </div>
          )}

          {recType === "sell" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sell-range">Selling Range</Label>
                <Input id="sell-range" placeholder="720 to 750" value={sellRange} onChange={(e) => setSellRange(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sell-allocation">% Allocation to Sell</Label>
                <Input id="sell-allocation" type="number" placeholder="50" value={sellAllocationPct} onChange={(e) => setSellAllocationPct(e.target.value)} />
              </div>
            </div>
          )}

          {recType === "buy" && (
            <div className="space-y-2">
              <Label htmlFor="rationale">Rationale (optional)</Label>
              <Textarea id="rationale" placeholder="Brief reasoning for this recommendation..." rows={2} value={rationale} onChange={(e) => setRationale(e.target.value)} />
            </div>
          )}
        </Card>

        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">3. Target Clients</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Send To</Label>
              <Select value={targetType} onValueChange={(v: "client" | "plan") => setTargetType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Specific Client</SelectItem>
                  <SelectItem value="plan">All Clients on Plan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {targetType === "client" ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Clients ({selectedClientIds.length} selected)</Label>
                  {selectedClientIds.length > 0 && (
                    <button
                      type="button"
                      className="text-xs text-muted-foreground hover:text-foreground underline"
                      onClick={() => setSelectedClientIds([])}
                    >
                      Clear
                    </button>
                  )}
                </div>
                <Input
                  placeholder="Search clients by name or email..."
                  value={clientFilter}
                  onChange={(e) => setClientFilter(e.target.value)}
                />
                {(() => {
                  const filtered = clients.filter(
                    (c) =>
                      !clientFilter ||
                      c.full_name.toLowerCase().includes(clientFilter.toLowerCase()) ||
                      c.email.toLowerCase().includes(clientFilter.toLowerCase())
                  );
                  const allFilteredSelected =
                    filtered.length > 0 && filtered.every((c) => selectedClientIds.includes(c.id));
                  return (
                    <div className="border border-border rounded-lg max-h-56 overflow-y-auto divide-y divide-border">
                      {filtered.length > 1 && (
                        <label className="flex items-center gap-2.5 px-3 py-2 cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors">
                          <Checkbox
                            checked={allFilteredSelected}
                            onCheckedChange={(checked) =>
                              setSelectedClientIds((prev) =>
                                checked
                                  ? [...new Set([...prev, ...filtered.map((c) => c.id)])]
                                  : prev.filter((id) => !filtered.some((c) => c.id === id))
                              )
                            }
                          />
                          <span className="text-sm font-medium">
                            Select all{clientFilter ? " matching" : ""} ({filtered.length})
                          </span>
                        </label>
                      )}
                      {filtered.map((c) => (
                        <label
                          key={c.id}
                          className="flex items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          <Checkbox
                            checked={selectedClientIds.includes(c.id)}
                            onCheckedChange={(checked) =>
                              setSelectedClientIds((prev) =>
                                checked ? [...prev, c.id] : prev.filter((id) => id !== c.id)
                              )
                            }
                          />
                          <span className="text-sm">
                            {c.full_name} <span className="text-xs text-muted-foreground capitalize">({c.plan}{c.has_stars && c.plan !== "stars" ? " + stars" : ""})</span>
                          </span>
                        </label>
                      ))}
                      {filtered.length === 0 && (
                        <p className="px-3 py-4 text-sm text-muted-foreground text-center">No clients match</p>
                      )}
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Plan</Label>
                <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="elite">Elite</SelectItem>
                    <SelectItem value="prime">Prime</SelectItem>
                    <SelectItem value="stars">Stars Only</SelectItem>
                    <SelectItem value="all">All Plans</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <Label className="text-sm font-medium">Send WhatsApp Alert</Label>
              <p className="text-xs text-muted-foreground">Opens pre-filled WhatsApp message</p>
            </div>
            <Switch checked={sendWhatsApp} onCheckedChange={setSendWhatsApp} />
          </div>
        </Card>

        <Dialog open={waQueue.length > 0} onOpenChange={(open) => !open && setWaQueue([])}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Send WhatsApp Alerts</DialogTitle>
            </DialogHeader>
            <p className="text-xs text-muted-foreground -mt-2">
              Browsers only allow one popup at a time — click each client to open their pre-filled message.
            </p>
            <div className="space-y-2">
              {waQueue.map((t) => (
                <Button
                  key={t.url}
                  type="button"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.open(t.url, "_blank")}
                >
                  <MessageCircle className="w-4 h-4 mr-2 text-success" />
                  WhatsApp {t.name}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <Button type="submit" className="w-full" disabled={!selectedStock || loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Pushing recommendation...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Push Recommendation
            </span>
          )}
        </Button>
      </form>
    </div>
  );
};

export default PushRecommendationForm;
