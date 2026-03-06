import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AuthProvider } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import PasswordGate from "@/components/PasswordGate";
import Index from "./pages/Index";
import Locations from "./pages/Locations";
import LocationDetail from "./pages/LocationDetail";
import Auth from "./pages/Auth";
import BecomePartner from "./pages/BecomePartner";
import PartnerDashboard from "./pages/PartnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/locations/:id" element={<LocationDetail />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/become-partner" element={<BecomePartner />} />
              <Route path="/partner" element={<PasswordGate key="partner"><PartnerDashboard /></PasswordGate>} />
              <Route path="/admin" element={<PasswordGate key="admin" correctPassword="456"><AdminDashboard /></PasswordGate>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
