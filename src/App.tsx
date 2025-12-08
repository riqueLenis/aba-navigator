import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ABAProvider } from "@/contexts/ABAContext";
import Dashboard from "./pages/Dashboard";
import TherapistsPage from "./pages/TherapistsPage";
import PatientsPage from "./pages/PatientsPage";
import ProgramsPage from "./pages/ProgramsPage";
import PerformancePage from "./pages/PerformancePage";
import EvolutionPage from "./pages/EvolutionPage";
import TherapeuticPlansPage from "./pages/TherapeuticPlansPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ABAProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/therapists" element={<TherapistsPage />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/performance" element={<PerformancePage />} />
            <Route path="/evolution" element={<EvolutionPage />} />
            <Route path="/therapeutic-plans" element={<TherapeuticPlansPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ABAProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;