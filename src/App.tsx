import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AuthProvider } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Locations from "./pages/Locations";
import LocationDetail from "./pages/LocationDetail";
import Auth from "./pages/Auth";
import PartnerDashboard from "./pages/PartnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/locations/:id" element={<LocationDetail />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/partner" element={
                <ProtectedRoute requiredRole="partner">
                  <PartnerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin" redirectTo="/">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
