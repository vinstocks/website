import { useState, useEffect } from "react";
import { Users, IndianRupee, TrendingUp, Star, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/format";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/lib/types";

const AdminOverview = () => {
  const [clients, setClients] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "client")
        .order("created_at", { ascending: false });
      if (data) setClients(data as Profile[]);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const activeClients = clients.filter((c) => c.is_active);
  const totalAUM = clients.reduce((sum, c) => sum + c.allocated_amount + (c.stars_allocated_amount || 0), 0);
  const eliteCount = clients.filter((c) => c.plan === "elite").length;
  const primeCount = clients.filter((c) => c.plan === "prime").length;
  const checkupCount = clients.filter((c) => c.plan === "checkup").length;
  const starsCount = clients.filter((c) => c.has_stars).length;

  const statCards = [
    { label: "Total Clients", value: clients.length.toString(), sub: `${activeClients.length} active`, icon: Users, color: "text-blue-600" },
    { label: "Total AUM", value: formatCurrency(totalAUM), sub: "Across all clients", icon: IndianRupee, color: "text-success" },
    { label: "Elite Clients", value: eliteCount.toString(), sub: `≥ ₹25L capital`, icon: TrendingUp, color: "text-primary" },
    { label: "Stars Add-on", value: starsCount.toString(), sub: `${starsCount} of ${clients.length} clients`, icon: Star, color: "text-amber-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Dashboard Overview</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Summary of all client portfolios</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {statCards.map((card) => (
          <Card key={card.label} className="p-4 lg:p-5">
            <div className="flex items-center gap-2 mb-2">
              <card.icon className={`w-4 h-4 ${card.color}`} />
              <span className="text-xs text-muted-foreground font-medium">{card.label}</span>
            </div>
            <p className="text-xl lg:text-2xl font-bold text-foreground">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="text-base font-semibold mb-4">Plan Breakdown</h3>
          <div className="space-y-3">
            {[
              { plan: "Elite", count: eliteCount, color: "bg-primary", total: clients.length },
              { plan: "Prime", count: primeCount, color: "bg-secondary", total: clients.length },
              { plan: "Checkup", count: checkupCount, color: "bg-muted-foreground", total: clients.length },
            ].map((item) => (
              <div key={item.plan} className="flex items-center gap-3">
                <span className="text-sm font-medium w-16">{item.plan}</span>
                <div className="flex-1 bg-muted rounded-full h-2.5">
                  <div
                    className={`${item.color} h-2.5 rounded-full transition-all`}
                    style={{ width: `${item.total > 0 ? (item.count / item.total) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm font-semibold w-8 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-base font-semibold mb-4">Recent Clients</h3>
          {clients.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No clients yet</p>
          ) : (
            <div className="space-y-3">
              {clients.slice(0, 4).map((client) => (
                <div key={client.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                      {client.full_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{client.full_name}</p>
                      <p className="text-xs text-muted-foreground">{client.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px] capitalize">{client.plan}</Badge>
                    {client.has_stars && (
                      <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-300">Stars</Badge>
                    )}
                    {!client.is_active && (
                      <Badge variant="destructive" className="text-[10px]">Inactive</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
