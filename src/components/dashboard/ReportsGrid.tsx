import { useState, useEffect } from "react";
import { ExternalLink, FileText, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

interface ReportStock {
  symbol: string;
  company_name: string;
  sector: string;
  report_url: string;
}

const ReportsGrid = ({ clientId }: { clientId?: string }) => {
  const { user } = useAuth();
  const targetId = clientId || user?.id;
  const [reports, setReports] = useState<ReportStock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!targetId) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("portfolio_stocks")
        .select("report_url, master_stocks(symbol, company_name, sector)")
        .eq("client_id", targetId)
        .not("report_url", "is", null);

      if (data) {
        setReports(
          data
            .filter((d: any) => d.report_url)
            .map((d: any) => ({
              symbol: d.master_stocks.symbol,
              company_name: d.master_stocks.company_name,
              sector: d.master_stocks.sector,
              report_url: d.report_url,
            }))
        );
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Research Reports</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Detailed research reports for your portfolio stocks
        </p>
      </div>

      {reports.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-sm text-muted-foreground">No research reports available yet</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {reports.map((stock) => (
            <Card key={stock.symbol} className="p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{stock.symbol}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[140px]">
                      {stock.company_name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px]">{stock.sector}</Badge>
              </div>

              <Button variant="outline" size="sm" className="w-full mt-auto" asChild>
                <a href={stock.report_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3.5 h-3.5 mr-2" />
                  View Report
                </a>
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportsGrid;
