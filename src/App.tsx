
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
import logger from "@/services/advancedLogService";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import ErrorBoundary from "@/components/ErrorBoundary";

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

// Componente para manejar la redirección de autenticación
function AuthCallback() {
  const { isLoading } = useAuth();
  
  useEffect(() => {
    appLogger.info("Procesando callback de autenticación");
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <Spinner className="mx-auto mb-4" />
          <p className="text-gray-500">Procesando autenticación...</p>
        </div>
      </div>
    );
  }

  return <Navigate to="/dashboard" replace />;
}

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
    // Agregamos logs adicionales para depuración
    appLogger.debug("Estado de autenticación cambiado:", { 
      isAuthenticated: !!user, 
      isLoading
    });
    
    if (user) {
      appLogger.debug("Usuario autenticado, configurando temporizador de bienvenida");
      const timer = setTimeout(() => {
        setShowWelcomeMessage(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [user, isLoading]);
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      
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
  useEffect(() => {
    appLogger.info("Aplicación inicializada", {
      version: process.env.REACT_APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV,
      buildDate: process.env.REACT_APP_BUILD_DATE || new Date().toISOString()
    });
    
    // Registrar errores no controlados a nivel de ventana
    const handleGlobalError = (event: ErrorEvent) => {
      appLogger.error('Error global no controlado', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
      
      // Evitar que el navegador muestre su propio mensaje de error
      event.preventDefault();
      return true;
    };
    
    // Registrar promesas rechazadas no controladas
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      appLogger.error('Promesa rechazada no controlada', {
        reason: event.reason,
        promise: event.promise
      });
    };
    
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
  
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AppRoutes />
            <Toaster />
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
