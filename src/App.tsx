import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Navbar from "@/components/Navbar";
import PasswordGate from "@/components/PasswordGate";
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
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/locations/:id" element={<LocationDetail />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/partner" element={<PasswordGate key="partner" correctPassword="123"><PartnerDashboard /></PasswordGate>} />
            <Route path="/admin" element={<PasswordGate key="admin" correctPassword="456"><AdminDashboard /></PasswordGate>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
