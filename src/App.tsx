
import { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import { AppLayout } from "@/components/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Lazy loaded components for better performance
const Register = lazy(() => import("@/pages/Register"));
const Login = lazy(() => import("@/pages/Login"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Clients = lazy(() => import("@/pages/Clients"));
const ClientDetail = lazy(() => import("@/pages/ClientDetail"));
const Invoices = lazy(() => import("@/pages/Invoices"));
const ReportDetail = lazy(() => import("@/pages/ReportDetail"));
const TicketDetail = lazy(() => import("@/pages/TicketDetail"));
const NotFound = lazy(() => import("@/pages/NotFound"));

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
  const { user, isLoading } = useAuth();
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        setShowWelcomeMessage(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [user]);
  
  if (isLoading) {
    return <PageLoader />;
  }
  
  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout>
              <Outlet />
            </AppLayout>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/clients/:clientId" element={<ClientDetail />} />
              <Route path="/reports/:reportId" element={<ReportDetail />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/invoices/:id" element={<ClientDetail />} />
              
              {/* Ticket routes */}
              <Route path="/tickets" element={<Dashboard activeTab="tickets" />} />
              <Route path="/tickets/:ticketId" element={<TicketDetail />} />
            </Route>
          </Route>
          
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;
