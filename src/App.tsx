
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
import Contracts from "./pages/Contracts";
import ContractForm from "./pages/ContractForm";
import ContractDetail from "./pages/ContractDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "./components/ui/sonner";
import { AppLayout } from "./components/AppLayout";
import { InvoiceForm } from "./components/InvoiceForm";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
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
        <AuthProvider>
          <Routes>
            {/* Public auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Public share routes (no sidebar) */}
            <Route path="/report-share/:token" element={<ReportShare />} />
            <Route path="/proposal-share/:token" element={<ProposalShare />} />
            
            {/* Route for the landing page */}
            <Route path="/" element={<Index />} />
            
            {/* Protected routes with role-based access */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
              
              {/* Admin-only routes */}
              <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route path="/clients" element={<AppLayout><Clients /></AppLayout>} />
                <Route path="/clients/new" element={<AppLayout><Clients /></AppLayout>} />
                <Route path="/clients/:id" element={<AppLayout><ClientDetail /></AppLayout>} />
                <Route path="/reports/:id" element={<AppLayout><ReportDetail /></AppLayout>} />
                <Route path="/reports/edit/:id" element={<AppLayout><ReportForm /></AppLayout>} />
                <Route path="/reports/new" element={<AppLayout><ReportForm /></AppLayout>} />
                <Route path="/reports/new/:clientId" element={<AppLayout><ReportForm /></AppLayout>} />
                <Route path="/report" element={<AppLayout><SeoReport /></AppLayout>} />
                <Route path="/reports" element={<AppLayout><AllReports /></AppLayout>} />
                <Route path="/packages" element={<AppLayout><Packages /></AppLayout>} />
                
                {/* Proposals routes */}
                <Route path="/proposals" element={<AppLayout><Proposals /></AppLayout>} />
                <Route path="/proposals/new" element={<AppLayout><ProposalForm /></AppLayout>} />
                <Route path="/proposals/new/:clientId/:packId" element={<AppLayout><ProposalForm /></AppLayout>} />
                <Route path="/proposals/edit/:id" element={<AppLayout><ProposalForm /></AppLayout>} />
                <Route path="/proposals/:id" element={<AppLayout><ProposalDetail /></AppLayout>} />
                
                {/* Contracts routes */}
                <Route path="/contracts" element={<AppLayout><Contracts /></AppLayout>} />
                <Route path="/contracts/new" element={<AppLayout><ContractForm /></AppLayout>} />
                <Route path="/contracts/new/:clientId" element={<AppLayout><ContractForm /></AppLayout>} />
                <Route path="/contracts/edit/:id" element={<AppLayout><ContractForm /></AppLayout>} />
                <Route path="/contracts/:id" element={<AppLayout><ContractDetail /></AppLayout>} />
                
                {/* Invoice routes */}
                <Route path="/invoices" element={<AppLayout><Invoices /></AppLayout>} />
                <Route path="/invoices/new" element={<AppLayout><InvoiceForm /></AppLayout>} />
                <Route path="/invoices/edit/:id" element={<AppLayout><InvoiceForm /></AppLayout>} />
                <Route path="/invoices/:id" element={<AppLayout><InvoiceDetail /></AppLayout>} />
                
                {/* Company settings */}
                <Route path="/settings" element={<AppLayout><CompanySettings /></AppLayout>} />
              </Route>
            </Route>
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
