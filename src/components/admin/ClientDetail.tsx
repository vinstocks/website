import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Star, Mail, Phone, Calendar, Loader2, Pencil } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import LiveDashboard from "@/components/dashboard/LiveDashboard";
import TrancheView from "@/components/dashboard/TrancheView";
import StarsPortfolio from "@/components/dashboard/StarsPortfolio";
import RecommendationLog from "@/components/dashboard/RecommendationLog";
import ManageTranches from "@/components/admin/ManageTranches";
import ManageReports from "@/components/admin/ManageReports";
import EditClientDialog from "@/components/admin/EditClientDialog";
import { formatCurrency } from "@/lib/utils/format";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/lib/types";

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const handleStockRemoved = () => setRefreshKey((k) => k + 1);

  const fetchClient = useCallback(async () => {
    if (!id) return;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
    if (data) setClient(data as Profile);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Client not found</p>
        <Button variant="link" onClick={() => navigate("/admin/clients")}>Back to clients</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/clients")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-semibold text-foreground">{client.full_name}</h2>
            <Badge variant="secondary" className="text-xs capitalize">{client.plan}</Badge>
            {client.has_stars && (
              <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                <Star className="w-3 h-3 mr-0.5 fill-amber-500" />
                Stars
              </Badge>
            )}
            <Badge variant={client.is_active ? "default" : "destructive"} className="text-xs">
              {client.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">Client portfolio and management</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
          <Pencil className="w-3.5 h-3.5 mr-1.5" />
          Edit Details
        </Button>
      </div>

      <EditClientDialog
        client={client}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSaved={fetchClient}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-3 flex items-center gap-3">
          <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] text-muted-foreground">Email</p>
            <p className="text-xs font-medium truncate">{client.email}</p>
          </div>
        </Card>
        <Card className="p-3 flex items-center gap-3">
          <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] text-muted-foreground">Phone</p>
            <p className="text-xs font-medium">{client.phone}</p>
          </div>
        </Card>
        <Card className="p-3 flex items-center gap-3">
          <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] text-muted-foreground">Plan Start</p>
            <p className="text-xs font-medium">
              {new Date(client.plan_start_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
            </p>
          </div>
        </Card>
        <Card className="p-3 flex items-center gap-3">
          <div className="w-4 h-4 text-muted-foreground shrink-0 flex items-center justify-center text-xs font-bold">₹</div>
          <div className="min-w-0">
            <p className="text-[10px] text-muted-foreground">Total Allocated</p>
            <p className="text-xs font-medium">
              {formatCurrency(client.allocated_amount + (client.stars_allocated_amount || 0))}
            </p>
          </div>
        </Card>
      </div>

      <Tabs defaultValue={client.plan === "stars" ? "stars" : "live"}>
        <TabsList className="flex-wrap h-auto gap-1">
          {client.plan !== "stars" && (
            <>
              <TabsTrigger value="live" className="text-xs">Live Dashboard</TabsTrigger>
              <TabsTrigger value="tranches" className="text-xs">Tranches</TabsTrigger>
            </>
          )}
          {client.has_stars && (
            <TabsTrigger value="stars" className="text-xs">Stars</TabsTrigger>
          )}
          <TabsTrigger value="recommendations" className="text-xs">Recommendations</TabsTrigger>
          {client.plan !== "stars" && (
            <TabsTrigger value="manage-tranches" className="text-xs">Manage Tranches</TabsTrigger>
          )}
          <TabsTrigger value="reports" className="text-xs">Reports</TabsTrigger>
        </TabsList>

        {client.plan !== "stars" && (
          <>
            <TabsContent value="live" className="mt-4">
              <LiveDashboard clientId={client.id} onStockRemoved={handleStockRemoved} />
            </TabsContent>

            <TabsContent value="tranches" className="mt-4">
              <TrancheView clientId={client.id} onStockRemoved={handleStockRemoved} />
            </TabsContent>
          </>
        )}

        {client.has_stars && (
          <TabsContent value="stars" className="mt-4">
            <StarsPortfolio clientId={client.id} onStockRemoved={handleStockRemoved} />
          </TabsContent>
        )}

        <TabsContent value="recommendations" className="mt-4">
          <RecommendationLog key={refreshKey} clientId={client.id} plan={client.plan} hasStars={client.has_stars} />
        </TabsContent>

        {client.plan !== "stars" && (
          <TabsContent value="manage-tranches" className="mt-4">
            <ManageTranches clientId={client.id} />
          </TabsContent>
        )}

        <TabsContent value="reports" className="mt-4">
          <ManageReports clientId={client.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDetail;
