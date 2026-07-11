import { useState, useEffect } from "react";
import { Search, Database, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import type { MasterStock } from "@/lib/types";

const MasterStocksPage = () => {
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState<string>("all");
  const [stocks, setStocks] = useState<MasterStock[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSectors = async () => {
      const { data } = await supabase
        .from("master_stocks")
        .select("sector");
      if (data) {
        const unique = [...new Set(data.map((d: { sector: string }) => d.sector).filter(Boolean))].sort() as string[];
        setSectors(unique);
      }
    };
    const fetchCount = async () => {
      const { count } = await supabase
        .from("master_stocks")
        .select("*", { count: "exact", head: true });
      if (count !== null) setTotalCount(count);
    };
    fetchSectors();
    fetchCount();
  }, []);

  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      let query = supabase
        .from("master_stocks")
        .select("*")
        .order("symbol", { ascending: true })
        .limit(100);

      if (search.length >= 2) {
        query = query.or(`symbol.ilike.%${search}%,company_name.ilike.%${search}%,isin.ilike.%${search}%`);
      }
      if (sectorFilter !== "all") {
        query = query.eq("sector", sectorFilter);
      }

      const { data } = await query;
      if (data) setStocks(data as MasterStock[]);
      setLoading(false);
    };

    const debounce = setTimeout(fetchStocks, 300);
    return () => clearTimeout(debounce);
  }, [search, sectorFilter]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Master Stock List</h2>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          {totalCount.toLocaleString("en-IN")} stocks available · showing {stocks.length} results
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by symbol, name, or ISIN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={sectorFilter}
          onChange={(e) => setSectorFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">All Sectors</option>
          {sectors.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold text-xs w-8">#</TableHead>
                  <TableHead className="font-semibold text-xs">SYMBOL</TableHead>
                  <TableHead className="font-semibold text-xs">COMPANY</TableHead>
                  <TableHead className="font-semibold text-xs hidden md:table-cell">ISIN</TableHead>
                  <TableHead className="font-semibold text-xs">SECTOR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stocks.map((stock, i) => (
                  <TableRow key={stock.id} className="hover:bg-muted/30">
                    <TableCell className="text-xs text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="font-semibold text-sm">{stock.symbol}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{stock.company_name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono hidden md:table-cell">
                      {stock.isin}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px]">{stock.sector}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {stocks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-sm">
                      No stocks found matching your search
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default MasterStocksPage;
