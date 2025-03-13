
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SeoReport from "./pages/SeoReport";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import AllReports from "./pages/AllReports";
import ReportForm from "./pages/ReportForm";
import ReportDetail from "./pages/ReportDetail";
import MainNavigation from "./components/MainNavigation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MainNavigation />
        <main className="min-h-[calc(100vh-4rem)]">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/report" element={<SeoReport />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
            <Route path="/reports" element={<AllReports />} />
            <Route path="/reports/new" element={<ReportForm />} />
            <Route path="/reports/edit/:id" element={<ReportForm />} />
            <Route path="/reports/:id" element={<ReportDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
