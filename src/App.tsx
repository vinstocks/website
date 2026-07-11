import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PreIPO from "./pages/PreIPO";
import SipCalculator from "./pages/SipCalculator";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import WhatsAppButton from "@/components/WhatsAppButton";
import LeadCapturePopup from "@/components/LeadCapturePopup";
import { AuthProvider } from "@/lib/auth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminRoute from "@/components/auth/AdminRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHome from "@/components/dashboard/DashboardHome";
import TrancheView from "@/components/dashboard/TrancheView";
import StarsPortfolio from "@/components/dashboard/StarsPortfolio";
import RecommendationLog from "@/components/dashboard/RecommendationLog";
import ReportsGrid from "@/components/dashboard/ReportsGrid";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminOverview from "@/components/admin/AdminOverview";
import ClientsTable from "@/components/admin/ClientsTable";
import ClientDetail from "@/components/admin/ClientDetail";
import PushRecommendationForm from "@/components/admin/PushRecommendationForm";
import MasterStocksPage from "@/components/admin/MasterStocksPage";

const queryClient = new QueryClient();

const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <WhatsAppButton />
    <LeadCapturePopup />
    {children}
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<PublicLayout><Index /></PublicLayout>} />
            <Route path="/pre-ipo" element={<PublicLayout><PreIPO /></PublicLayout>} />
            <Route path="/sip-calculator" element={<PublicLayout><SipCalculator /></PublicLayout>} />
            <Route path="/login" element={<Login />} />

            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<DashboardHome />} />
              <Route path="tranches" element={<TrancheView />} />
              <Route path="stars" element={<StarsPortfolio />} />
              <Route path="recommendations" element={<RecommendationLog />} />
              <Route path="reports" element={<ReportsGrid />} />
            </Route>

            <Route path="/admin" element={<ProtectedRoute><AdminRoute><AdminLayout /></AdminRoute></ProtectedRoute>}>
              <Route index element={<AdminOverview />} />
              <Route path="clients" element={<ClientsTable />} />
              <Route path="clients/:id" element={<ClientDetail />} />
              <Route path="recommendations" element={<PushRecommendationForm />} />
              <Route path="master-stocks" element={<MasterStocksPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
