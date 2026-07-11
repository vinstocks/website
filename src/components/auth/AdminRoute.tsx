import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (profile?.role !== "admin") return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

export default AdminRoute;
