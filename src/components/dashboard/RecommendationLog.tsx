import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils/format";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import type { RecommendationLogEntry } from "@/lib/types";

const resultColors: Record<string, string> = {
  Loss: "bg-destructive/10 text-destructive",
  "Partial Booking": "bg-primary/10 text-primary",
  "Full Exit": "bg-success/10 text-success",
};

const BuyTable = ({ recs }: { recs: RecommendationLogEntry[] }) => (
  <div className="bg-card rounded-xl border border-border overflow-hidden">
    <div className="p-4 border-b border-border">
      <h3 className="text-base font-semibold text-foreground">Buy Recommendations</h3>
      <p className="text-xs text-muted-foreground mt-0.5">All buy calls till date</p>
    </div>
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold text-xs">DATE</TableHead>
            <TableHead className="font-semibold text-xs">SYMBOL</TableHead>
            <TableHead className="font-semibold text-xs hidden md:table-cell">COMPANY</TableHead>
            <TableHead className="font-semibold text-xs hidden lg:table-cell">SECTOR</TableHead>
            <TableHead className="font-semibold text-xs text-right">REC. PRICE</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-sm">
                No buy recommendations yet
              </TableCell>
            </TableRow>
          ) : (
            recs.map((rec) => (
              <TableRow key={rec.id} className="hover:bg-muted/30">
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(rec.recommendation_date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="font-semibold text-sm">{rec.symbol}</TableCell>
                <TableCell className="text-xs text-muted-foreground hidden md:table-cell max-w-[200px] truncate">
                  {rec.company_name}
                </TableCell>
                <TableCell className="text-xs hidden lg:table-cell">
                  <Badge variant="secondary" className="text-[10px]">
                    {rec.sector}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-sm font-medium">
                  ₹{formatNumber(rec.recommendation_price)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  </div>
);

const SellTable = ({ recs }: { recs: RecommendationLogEntry[] }) => (
  <div className="bg-card rounded-xl border border-border overflow-hidden">
    <div className="p-4 border-b border-border">
      <h3 className="text-base font-semibold text-foreground">Sell Recommendations</h3>
      <p className="text-xs text-muted-foreground mt-0.5">All sell calls till date</p>
    </div>
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold text-xs">DATE</TableHead>
            <TableHead className="font-semibold text-xs">SYMBOL</TableHead>
            <TableHead className="font-semibold text-xs hidden md:table-cell">COMPANY</TableHead>
            <TableHead className="font-semibold text-xs">SELL RANGE</TableHead>
            <TableHead className="font-semibold text-xs text-right">SELL ALLOC %</TableHead>
            <TableHead className="font-semibold text-xs text-right">SELL PRICE</TableHead>
            <TableHead className="font-semibold text-xs text-center">RESULT</TableHead>
            <TableHead className="font-semibold text-xs text-right">P&L</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground text-sm">
                No sell recommendations yet
              </TableCell>
            </TableRow>
          ) : (
            recs.map((rec) => {
              const isProfit = (rec.pnl_amount ?? 0) >= 0;
              return (
                <TableRow key={rec.id} className="hover:bg-muted/30">
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(rec.recommendation_date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="font-semibold text-sm">{rec.symbol}</TableCell>
                  <TableCell className="text-xs text-muted-foreground hidden md:table-cell max-w-[200px] truncate">
                    {rec.company_name}
                  </TableCell>
                  <TableCell className="text-xs whitespace-nowrap">
                    {rec.sell_range ? `₹${rec.sell_range}` : "—"}
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {rec.sell_allocation_pct ? `${rec.sell_allocation_pct}%` : "—"}
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium">
                    {rec.sell_price ? `₹${formatNumber(rec.sell_price)}` : "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    {rec.result ? (
                      <Badge variant="secondary" className={`text-[10px] ${resultColors[rec.result]}`}>
                        {rec.result}
                      </Badge>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className={`text-right text-sm font-medium ${isProfit ? "text-success" : "text-destructive"}`}>
                    {rec.pnl_amount !== null
                      ? `${isProfit ? "+" : ""}₹${formatNumber(Math.abs(rec.pnl_amount))}`
                      : "—"}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  </div>
);

const BuySellTabs = ({ recs }: { recs: RecommendationLogEntry[] }) => {
  const buys = recs.filter((r) => r.type === "buy");
  const sells = recs.filter((r) => r.type === "sell");
  return (
    <Tabs defaultValue="buy">
      <TabsList>
        <TabsTrigger value="buy" className="text-xs">
          All Buy ({buys.length})
        </TabsTrigger>
        <TabsTrigger value="sell" className="text-xs">
          All Sell ({sells.length})
        </TabsTrigger>
      </TabsList>
      <TabsContent value="buy" className="mt-4">
        <BuyTable recs={buys} />
      </TabsContent>
      <TabsContent value="sell" className="mt-4">
        <SellTable recs={sells} />
      </TabsContent>
    </Tabs>
  );
};

const RecommendationLog = ({
  clientId,
  plan,
  hasStars,
}: {
  clientId?: string;
  plan?: string;
  hasStars?: boolean;
}) => {
  const { user, profile } = useAuth();
  const targetId = clientId || user?.id;
  const effectivePlan = plan ?? profile?.plan;
  const effectiveHasStars = hasStars ?? profile?.has_stars;
  const [recs, setRecs] = useState<RecommendationLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!targetId) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("recommendation_log")
        .select("*, master_stocks(symbol, company_name, isin, sector)")
        .eq("client_id", targetId)
        .order("recommendation_date", { ascending: false });

      if (data) {
        const mapped: RecommendationLogEntry[] = data.map((r: any) => ({
          id: r.id,
          client_id: r.client_id,
          type: r.type,
          symbol: r.master_stocks?.symbol || "",
          company_name: r.master_stocks?.company_name || "",
          isin: r.master_stocks?.isin || "",
          sector: r.master_stocks?.sector || "",
          market_cap: 0,
          market_cap_category: "",
          recommendation_date: r.recommendation_date,
          recommendation_price: r.recommendation_price,
          sell_price: r.sell_price,
          sell_range: r.sell_range ?? null,
          sell_allocation_pct: r.sell_allocation_pct ?? null,
          result: r.result,
          pnl_amount: r.pnl_amount,
          plan_type: r.plan_type,
        }));
        setRecs(mapped);
      }
      setLoading(false);
    };
    fetch();
  }, [targetId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const epRecs = recs.filter((r) => r.plan_type === "elite_prime");
  const starsRecs = recs.filter((r) => r.plan_type === "stars");
  const showElitePrime = effectivePlan === "elite" || effectivePlan === "prime" || epRecs.length > 0;
  const showStars = !!effectiveHasStars || starsRecs.length > 0;
  const epLabel = effectivePlan === "elite" ? "Elite" : effectivePlan === "prime" ? "Prime" : "Elite / Prime";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Recommendation History</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          All buy and sell recommendations from your advisor
        </p>
      </div>

      {showElitePrime && showStars ? (
        <Tabs defaultValue="elite_prime">
          <TabsList>
            <TabsTrigger value="elite_prime" className="text-xs">{epLabel}</TabsTrigger>
            <TabsTrigger value="stars" className="text-xs">Stars</TabsTrigger>
          </TabsList>
          <TabsContent value="elite_prime" className="mt-4">
            <BuySellTabs recs={epRecs} />
          </TabsContent>
          <TabsContent value="stars" className="mt-4">
            <BuySellTabs recs={starsRecs} />
          </TabsContent>
        </Tabs>
      ) : showStars ? (
        <BuySellTabs recs={starsRecs} />
      ) : (
        <BuySellTabs recs={epRecs} />
      )}
    </div>
  );
};

export default RecommendationLog;
