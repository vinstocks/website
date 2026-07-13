import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatNumber } from "@/lib/utils/format";
import type { Sale } from "@/lib/types";

const RealizedPnlTable = ({ sales }: { sales: Sale[] }) => {
  if (sales.length === 0) return null;

  const totalPnl = sales.reduce((s, x) => s + x.pnl, 0);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">Realized P&L</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Booked profits and losses from sold stocks</p>
        </div>
        <span className={`text-sm font-semibold ${totalPnl >= 0 ? "text-success" : "text-destructive"}`}>
          {totalPnl >= 0 ? "+" : ""}{formatCurrency(totalPnl)}
        </span>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold text-xs">DATE</TableHead>
              <TableHead className="font-semibold text-xs">SYMBOL</TableHead>
              <TableHead className="font-semibold text-xs hidden md:table-cell">COMPANY</TableHead>
              <TableHead className="font-semibold text-xs text-right">QTY</TableHead>
              <TableHead className="font-semibold text-xs text-right">AVG BUY</TableHead>
              <TableHead className="font-semibold text-xs text-right">SELL PRICE</TableHead>
              <TableHead className="font-semibold text-xs text-right">REALIZED P&L</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((s) => {
              const isProfit = s.pnl >= 0;
              return (
                <TableRow key={s.id} className="hover:bg-muted/30">
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(s.sell_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </TableCell>
                  <TableCell className="font-semibold text-sm">{s.symbol}</TableCell>
                  <TableCell className="text-xs text-muted-foreground hidden md:table-cell max-w-[200px] truncate">
                    {s.company_name}
                  </TableCell>
                  <TableCell className="text-right text-sm">{s.quantity}</TableCell>
                  <TableCell className="text-right text-sm">₹{formatNumber(s.buy_price)}</TableCell>
                  <TableCell className="text-right text-sm">₹{formatNumber(s.sell_price)}</TableCell>
                  <TableCell className={`text-right text-sm font-medium ${isProfit ? "text-success" : "text-destructive"}`}>
                    {isProfit ? "+" : ""}{formatCurrency(s.pnl)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RealizedPnlTable;
