
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Clients from "@/pages/Clients";
import Invoices from "@/pages/Invoices";
import NotFound from "@/pages/NotFound";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import ClientDetail from "@/pages/ClientDetail";
import ReportDetail from "@/pages/ReportDetail";
import { SupportTickets } from "@/components/dashboard/SupportTickets";
import TicketDetail from "@/pages/TicketDetail";
import { AppLayout } from "@/components/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "@/pages/Index";
import logger from "@/services/logService";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Crear una instancia de QueryClient para toda la aplicación
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Logger específico para App
const appLogger = logger.getLogger('App');

// Componente interno para manejar la lógica de la aplicación después del AuthProvider
function AppRoutes() {
  const { user, isLoading } = useAuth();
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);

  appLogger.info("AppRoutes renderizado", { 
    isAuthenticated: !!user, 
    isLoading, 
    userId: user?.id 
  });

  useEffect(() => {
    if (user) {
      appLogger.debug("Usuario autenticado, configurando temporizador de bienvenida");
      const timer = setTimeout(() => {
        setShowWelcomeMessage(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [user]);
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
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
          
          {/* Ticket routes */}
          <Route path="/tickets" element={<Dashboard activeTab="tickets" />} />
          <Route path="/tickets/:ticketId" element={<TicketDetail />} />
        </Route>
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  appLogger.info("Inicializando aplicación");
  
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppRoutes />
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
