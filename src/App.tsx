
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PlanProvider } from "./contexts/PlanContext";
import { CookieProvider } from "./contexts/CookieContext";
import CookieBanner from "./components/CookieBanner";
import LandingPage from "./pages/LandingPage";
import Index from "./pages/Index";
import EnterpriseApp from "./pages/EnterpriseApp";
import NotFound from "./pages/NotFound";
import Datenschutz from "./pages/Datenschutz";
import Impressum from "./pages/Impressum";
import AGB from "./pages/AGB";
import CookieEinstellungen from "./pages/CookieEinstellungen";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CookieProvider>
      <PlanProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/app" element={<Index />} />
              <Route path="/enterprise" element={<EnterpriseApp />} />
              <Route path="/enterprise-app" element={<EnterpriseApp />} />
              <Route path="/datenschutz" element={<Datenschutz />} />
              <Route path="/impressum" element={<Impressum />} />
              <Route path="/agb" element={<AGB />} />
              <Route path="/cookie-einstellungen" element={<CookieEinstellungen />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <CookieBanner />
          </BrowserRouter>
        </TooltipProvider>
      </PlanProvider>
    </CookieProvider>
  </QueryClientProvider>
);

export default App;
