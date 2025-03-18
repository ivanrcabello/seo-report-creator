
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
import { AppLayout } from "@/components/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "@/pages/Index";
import logger from "@/services/advancedLogService";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import ErrorBoundary from "@/components/ErrorBoundary";
import TicketDetail from "@/pages/TicketDetail";
import Contracts from "@/pages/Contracts";
import ApiSettings from "@/pages/ApiSettings";
import TemplateSettings from "@/pages/TemplateSettings";
import CompanySettings from "@/pages/CompanySettings";
import AllReports from "@/pages/AllReports";
import Packages from "@/pages/Packages";
import Proposals from "@/pages/Proposals";

// Create a QueryClient instance for the entire application
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Logger for App
const appLogger = logger.getLogger('App');

// Component to handle authentication redirect
function AuthCallback() {
  const { isLoading } = useAuth();
  
  useEffect(() => {
    appLogger.info("Processing authentication callback");
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

// Internal component to handle application logic after AuthProvider
function AppRoutes() {
  const { user, isLoading } = useAuth();
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);

  useEffect(() => {
    // Log initial render and authentication state
    appLogger.info("AppRoutes rendered", { 
      isAuthenticated: !!user, 
      isLoading, 
      userId: user?.id 
    });
    
    if (user) {
      appLogger.debug("User authenticated, setting welcome timer");
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
          
          {/* Rutas que antes estaban definidas como activeTab */}
          <Route path="/reports" element={<AllReports />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/proposals" element={<Proposals />} />
          
          {/* Settings routes */}
          <Route path="/settings" element={<CompanySettings />} />
          <Route path="/settings/templates" element={<TemplateSettings />} />
          <Route path="/settings/api" element={<ApiSettings />} />
          
          {/* Contracts routes */}
          <Route path="/contracts" element={<Contracts />} />
          
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
    appLogger.info("Application initialized", {
      version: import.meta.env.VITE_APP_VERSION || '1.0.0',
      environment: import.meta.env.MODE,
      buildDate: import.meta.env.VITE_APP_BUILD_DATE || new Date().toISOString()
    });
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
