import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Layers, Star, FileText, ScrollText, LogOut, Menu, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import logo from "@/assets/logo.png";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newRecs, setNewRecs] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, signOut } = useAuth();

  useEffect(() => {
    if (!profile?.id) return;
    const seenKey = `recs_seen_${profile.id}`;
    if (location.pathname === "/dashboard/recommendations") {
      localStorage.setItem(seenKey, new Date().toISOString());
      setNewRecs(0);
      return;
    }
    const fetchCount = async () => {
      const seen = localStorage.getItem(seenKey);
      let query = supabase
        .from("recommendation_log")
        .select("id", { count: "exact", head: true })
        .eq("client_id", profile.id);
      if (seen) query = query.gt("created_at", seen);
      const { count } = await query;
      setNewRecs(count || 0);
    };
    fetchCount();
  }, [profile?.id, location.pathname]);

  const starsOnly = profile?.plan === "stars";
  const navItems = [
    ...(starsOnly
      ? [{ to: "/dashboard", icon: Star, label: "Stars Portfolio", end: true }]
      : [
          { to: "/dashboard", icon: LayoutDashboard, label: "Live Dashboard", end: true },
          { to: "/dashboard/tranches", icon: Layers, label: "Tranches" },
          ...(profile?.has_stars
            ? [{ to: "/dashboard/stars", icon: Star, label: "Stars Portfolio" }]
            : []),
        ]),
    { to: "/dashboard/recommendations", icon: ScrollText, label: "Recommendations" },
    { to: "/dashboard/reports", icon: FileText, label: "Reports" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-card border-r border-border flex flex-col transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Vinstocks" className="w-10 h-10 rounded-lg" />
            <div>
              <span className="text-lg font-bold">
                <span className="text-primary">VIN</span>
                <span className="text-secondary">STOCKS</span>
              </span>
              <p className="text-xs text-muted-foreground">Client Dashboard</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-border">
          <p className="text-sm font-medium text-foreground">{profile?.full_name ?? "Client"}</p>
          <p className="text-xs text-muted-foreground capitalize">
            {profile?.plan ?? ""} Plan
            {profile?.has_stars && profile?.plan !== "stars" && " + Stars"}
          </p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
              {item.label === "Recommendations" && newRecs > 0 && (
                <span className="ml-auto min-w-5 h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex items-center justify-center">
                  {newRecs > 9 ? "9+" : newRecs}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-border space-y-1">
          {profile?.role === "admin" && (
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground w-full transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Panel
            </button>
          )}
          <button
            onClick={async () => { await signOut(); navigate("/login"); }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground w-full transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-sm border-b border-border px-4 py-3 lg:px-6 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">
            {profile?.full_name ?? "Client"}'s Portfolio
          </h1>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
