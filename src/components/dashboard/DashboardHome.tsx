import { useAuth } from "@/lib/auth";
import LiveDashboard from "./LiveDashboard";
import StarsPortfolio from "./StarsPortfolio";

const DashboardHome = () => {
  const { profile } = useAuth();
  if (profile?.plan === "stars") return <StarsPortfolio />;
  return <LiveDashboard />;
};

export default DashboardHome;
