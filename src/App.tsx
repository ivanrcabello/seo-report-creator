
import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { Toaster } from "sonner";
import { AppLayout } from "@/components/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { verifyRoutes } from "@/utils/routesChecker";

// Lazy loaded components for better performance
const Register = lazy(() => import("@/pages/Register"));
const Login = lazy(() => import("@/pages/Login"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Clients = lazy(() => import("@/pages/Clients"));
const ClientDetail = lazy(() => import("@/pages/ClientDetail"));
const ClientForm = lazy(() => import("@/pages/ClientForm"));
const Invoices = lazy(() => import("@/pages/Invoices"));
const InvoiceForm = lazy(() => import("@/pages/InvoiceForm"));
const ReportDetail = lazy(() => import("@/pages/ReportDetail"));
const TicketDetail = lazy(() => import("@/pages/TicketDetail"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Settings = lazy(() => import("@/pages/Settings"));
const ApiSettings = lazy(() => import("@/pages/ApiSettings"));
const TemplateSettings = lazy(() => import("@/pages/TemplateSettings"));
const Packages = lazy(() => import("@/pages/Packages"));
const NewTicket = lazy(() => import("@/pages/NewTicket"));
const Contracts = lazy(() => import("@/pages/Contracts"));
const ContractForm = lazy(() => import("@/pages/ContractForm"));
const Proposals = lazy(() => import("@/pages/Proposals"));

// Create a client for React Query
const queryClient = new QueryClient();

// Loading component for suspense fallback
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
      <p className="text-lg">Cargando...</p>
    </div>
  </div>
);

function App() {
  const { user, isLoading, userRole } = useAuth();
  
  useEffect(() => {
    // Verify routes on app initialization (only in development mode)
    if (process.env.NODE_ENV === 'development') {
      verifyRoutes();
    }
  }, []);
  
  if (isLoading) {
    return <PageLoader />;
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          
          {/* Protected routes for both admin and client with different views based on role */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout><Outlet /></AppLayout>}>
              {/* Dashboard routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Reports routes */}
              <Route path="/reports" element={<Dashboard activeTab="reports" />} />
              <Route path="/reports/new" element={
                userRole === "admin" ? <ReportDetail isNew={true} /> : <Navigate to="/dashboard" replace />
              } />
              <Route path="/reports/:reportId" element={<ReportDetail />} />
              
              {/* Invoice routes */}
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/invoices/new" element={
                userRole === "admin" ? <InvoiceForm isNew={true} /> : <Navigate to="/dashboard" replace />
              } />
              <Route path="/invoices/:id" element={<Invoices />} />
              
              {/* Settings routes */}
              <Route path="/settings" element={<Settings />} />
              <Route path="/settings/api" element={<ApiSettings />} />
              <Route path="/settings/templates" element={<TemplateSettings />} />
              
              {/* Support tickets routes */}
              <Route path="/tickets" element={<Dashboard activeTab="tickets" />} />
              <Route path="/tickets/new" element={<NewTicket />} />
              <Route path="/tickets/:ticketId" element={<TicketDetail />} />
              
              {/* Contract routes */}
              <Route path="/contracts" element={<Dashboard activeTab="contracts" />} />
              <Route path="/contracts/new" element={
                userRole === "admin" ? <ContractForm isNew={true} /> : <Navigate to="/dashboard" replace />
              } />
              
              {/* Proposal routes */}
              <Route path="/proposals" element={<Dashboard activeTab="proposals" />} />
              <Route path="/proposals/new" element={
                userRole === "admin" ? <Dashboard activeTab="proposals" newProposal={true} /> : <Navigate to="/dashboard" replace />
              } />
              
              {/* Documents routes */}
              <Route path="/documents" element={<Dashboard activeTab="documents" />} />
              
              {/* Packages route */}
              <Route path="/packages" element={<Packages />} />
              
              {/* Admin only routes with explicit checks */}
              <Route path="/clients" element={
                userRole === "admin" ? <Clients /> : <Navigate to="/dashboard" replace />
              } />
              <Route path="/clients/new" element={
                userRole === "admin" ? <ClientForm /> : <Navigate to="/dashboard" replace />
              } />
              <Route path="/clients/edit/:id" element={
                userRole === "admin" ? <ClientForm /> : <Navigate to="/dashboard" replace />
              } />
              <Route path="/clients/:clientId" element={
                userRole === "admin" ? <ClientDetail /> : <Navigate to="/dashboard" replace />
              } />
            </Route>
          </Route>
          
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
