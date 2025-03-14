
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import ReportDetail from "./pages/ReportDetail";
import ReportForm from "./pages/ReportForm";
import NotFound from "./pages/NotFound";
import SeoReport from "./pages/SeoReport";
import AllReports from "./pages/AllReports";
import Packages from "./pages/Packages";
import Proposals from "./pages/Proposals";
import ProposalForm from "./pages/ProposalForm";
import ProposalDetail from "./pages/ProposalDetail";
import ReportShare from "./pages/ReportShare";
import ProposalShare from "./pages/ProposalShare";
import Invoices from "./pages/Invoices";
import InvoiceDetail from "./pages/InvoiceDetail";
import CompanySettings from "./pages/CompanySettings";
import { Toaster } from "./components/ui/sonner";
import { AppLayout } from "./components/AppLayout";
import "./App.css";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public routes without sidebar */}
          <Route path="/report-share/:token" element={<ReportShare />} />
          <Route path="/proposal-share/:token" element={<ProposalShare />} />
          
          {/* Protected routes with sidebar */}
          <Route path="/" element={<AppLayout><Index /></AppLayout>} />
          <Route path="/clients" element={<AppLayout><Clients /></AppLayout>} />
          <Route path="/clients/:id" element={<AppLayout><ClientDetail /></AppLayout>} />
          <Route path="/reports/:id" element={<AppLayout><ReportDetail /></AppLayout>} />
          <Route path="/reports/edit/:id" element={<AppLayout><ReportForm /></AppLayout>} />
          <Route path="/reports/new" element={<AppLayout><ReportForm /></AppLayout>} />
          <Route path="/reports/new/:clientId" element={<AppLayout><ReportForm /></AppLayout>} />
          <Route path="/report" element={<AppLayout><SeoReport /></AppLayout>} />
          <Route path="/reports" element={<AppLayout><AllReports /></AppLayout>} />
          <Route path="/packages" element={<AppLayout><Packages /></AppLayout>} />
          <Route path="/proposals" element={<AppLayout><Proposals /></AppLayout>} />
          <Route path="/proposals/new" element={<AppLayout><ProposalForm /></AppLayout>} />
          <Route path="/proposals/new/:clientId/:packId" element={<AppLayout><ProposalForm /></AppLayout>} />
          <Route path="/proposals/edit/:id" element={<AppLayout><ProposalForm /></AppLayout>} />
          <Route path="/proposals/:id" element={<AppLayout><ProposalDetail /></AppLayout>} />
          
          {/* New invoice routes */}
          <Route path="/invoices" element={<AppLayout><Invoices /></AppLayout>} />
          <Route path="/invoices/:id" element={<AppLayout><InvoiceDetail /></AppLayout>} />
          <Route path="/invoices/new" element={<AppLayout><InvoiceDetail /></AppLayout>} />
          <Route path="/invoices/edit/:id" element={<AppLayout><InvoiceDetail /></AppLayout>} />
          
          {/* Company settings */}
          <Route path="/settings" element={<AppLayout><CompanySettings /></AppLayout>} />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
