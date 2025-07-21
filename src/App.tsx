
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PlanProvider } from "./contexts/PlanContext";
import { CookieProvider } from "./contexts/CookieContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import CookieBanner from "./components/CookieBanner";
import LandingPage from "./pages/LandingPage";
import Index from "./pages/Index";
import EnterpriseApp from "./pages/EnterpriseApp";
import NotFound from "./pages/NotFound";
import Datenschutz from "./pages/Datenschutz";
import Impressum from "./pages/Impressum";
import AGB from "./pages/AGB";
import CookieEinstellungen from "./pages/CookieEinstellungen";
import Imprint from "./pages/Imprint";
import Privacy from "./pages/Privacy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CookieProvider>
      <PlanProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <LanguageProvider>
              <Routes>
                {/* Redirect root to German */}
                <Route path="/" element={<LandingPage />} />
                
                {/* Language-based routes */}
                <Route path="/:lang" element={<LandingPage />} />
                <Route path="/:lang/app" element={<Index />} />
                <Route path="/:lang/enterprise" element={<EnterpriseApp />} />
                
                {/* Legacy routes without language prefix */}
                <Route path="/app" element={<Index />} />
                <Route path="/enterprise" element={<EnterpriseApp />} />
                
                {/* German legal pages (existing) */}
                <Route path="/datenschutz" element={<Datenschutz />} />
                <Route path="/de/datenschutz" element={<Datenschutz />} />
                <Route path="/impressum" element={<Impressum />} />
                <Route path="/de/impressum" element={<Impressum />} />
                <Route path="/agb" element={<AGB />} />
                <Route path="/de/agb" element={<AGB />} />
                <Route path="/cookie-einstellungen" element={<CookieEinstellungen />} />
                <Route path="/de/cookie-einstellungen" element={<CookieEinstellungen />} />
                
                {/* English legal pages */}
                <Route path="/en/privacy" element={<Privacy />} />
                <Route path="/en/imprint" element={<Imprint />} />
                <Route path="/en/terms" element={<AGB />} />
                <Route path="/en/cookie-settings" element={<CookieEinstellungen />} />
                
                {/* Spanish legal pages */}
                <Route path="/es/privacidad" element={<Privacy />} />
                <Route path="/es/aviso-legal" element={<Imprint />} />
                <Route path="/es/terminos" element={<AGB />} />
                <Route path="/es/configuracion-cookies" element={<CookieEinstellungen />} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <CookieBanner />
            </LanguageProvider>
          </BrowserRouter>
        </TooltipProvider>
      </PlanProvider>
    </CookieProvider>
  </QueryClientProvider>
);

export default App;
