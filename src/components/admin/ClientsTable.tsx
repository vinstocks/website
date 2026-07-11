import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Star, UserX, UserCheck, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/utils/format";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/lib/types";
import CreateClientDialog from "./CreateClientDialog";

const ClientsTable = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [clients, setClients] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggleTarget, setToggleTarget] = useState<Profile | null>(null);

  const fetchClients = useCallback(async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "client")
      .order("created_at", { ascending: false });
    if (!error && data) setClients(data as Profile[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const filtered = clients.filter((c) => {
    const matchesSearch =
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesPlan = planFilter === "all" || c.plan === planFilter;
    return matchesSearch && matchesPlan;
  });

  const handleToggleActive = async () => {
    if (!toggleTarget) return;
    const newStatus = !toggleTarget.is_active;
    const { error } = await supabase
      .from("profiles")
      .update({ is_active: newStatus })
      .eq("id", toggleTarget.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setClients((prev) =>
        prev.map((c) => c.id === toggleTarget.id ? { ...c, is_active: newStatus } : c)
      );
      toast({
        title: newStatus ? "Client reactivated" : "Client deactivated",
        description: `${toggleTarget.full_name} has been ${newStatus ? "reactivated" : "deactivated"}.`,
      });
    }
    setToggleTarget(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">All Clients</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{clients.filter((c) => c.is_active).length} active · {clients.length} total clients</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Client
        </Button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1.5">
          {["all", "elite", "prime", "checkup"].map((plan) => (
            <Button
              key={plan}
              variant={planFilter === plan ? "default" : "outline"}
              size="sm"
              onClick={() => setPlanFilter(plan)}
              className="text-xs capitalize"
            >
              {plan === "all" ? "All" : plan}
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold text-xs">NAME</TableHead>
                <TableHead className="font-semibold text-xs hidden md:table-cell">EMAIL</TableHead>
                <TableHead className="font-semibold text-xs hidden lg:table-cell">PHONE</TableHead>
                <TableHead className="font-semibold text-xs">PLAN</TableHead>
                <TableHead className="font-semibold text-xs text-right">ALLOCATED</TableHead>
                <TableHead className="font-semibold text-xs text-center hidden md:table-cell">STATUS</TableHead>
                <TableHead className="font-semibold text-xs text-right">SINCE</TableHead>
                <TableHead className="font-semibold text-xs text-center w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((client) => (
                <TableRow
                  key={client.id}
                  className="hover:bg-muted/30 cursor-pointer"
                  onClick={() => navigate(`/admin/clients/${client.id}`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                        {client.full_name.charAt(0)}
                      </div>
                      <span className="font-medium text-sm">{client.full_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{client.email}</TableCell>
                  <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">{client.phone}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Badge variant="secondary" className="text-[10px] capitalize">{client.plan}</Badge>
                      {client.has_stars && (
                        <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-300">
                          <Star className="w-2.5 h-2.5 mr-0.5 fill-amber-500" />
                          Stars
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium">
                    {formatCurrency(client.allocated_amount + (client.stars_allocated_amount || 0))}
                  </TableCell>
                  <TableCell className="text-center hidden md:table-cell">
                    <Badge
                      variant={client.is_active ? "default" : "destructive"}
                      className="text-[10px]"
                    >
                      {client.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {new Date(client.plan_start_date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-7 w-7 ${client.is_active ? "text-muted-foreground hover:text-destructive" : "text-muted-foreground hover:text-green-600"}`}
                      title={client.is_active ? "Deactivate client" : "Reactivate client"}
                      onClick={(e) => {
                        e.stopPropagation();
                        setToggleTarget(client);
                      }}
                    >
                      {client.is_active ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground text-sm">
                    No clients found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <CreateClientDialog open={createOpen} onOpenChange={setCreateOpen} onClientCreated={fetchClients} />

      <AlertDialog open={!!toggleTarget} onOpenChange={(open) => !open && setToggleTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {toggleTarget?.is_active ? "Deactivate" : "Reactivate"} {toggleTarget?.full_name}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {toggleTarget?.is_active
                ? "This will mark the client as inactive. Their portfolio data will be preserved and they can be reactivated later."
                : "This will reactivate the client's account and restore their dashboard access."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={toggleTarget?.is_active ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
              onClick={handleToggleActive}
            >
              {toggleTarget?.is_active ? "Deactivate" : "Reactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientsTable;
