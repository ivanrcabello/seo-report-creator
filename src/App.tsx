import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppLayout } from './components/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientDetail from './pages/ClientDetail';
import ClientForm from './pages/ClientForm';
import AllReports from './pages/AllReports';
import ReportDetail from './pages/ReportDetail';
import Packages from './pages/Packages';
import Proposals from './pages/Proposals';
import Invoices from './pages/Invoices';
import InvoiceForm from './pages/InvoiceForm';
import CompanySettings from './pages/CompanySettings';
import TemplateSettings from './pages/TemplateSettings';
import Contracts from './pages/Contracts';

// Crear una instancia de QueryClient
const queryClient = new QueryClient();

// Componente para proteger rutas que requieren autenticación
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirige al usuario a la página de inicio de sesión y guarda la ubicación actual
    return <Navigate to="/login" replace state={{ path: location.pathname }} />;
  }

  return <AppLayout>{children}</AppLayout>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<AppRoutes />} />
          </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

function AppRoutes() {
  return (
    <ProtectedRoute>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/clients/new" element={<ClientForm />} />
        <Route path="/clients/edit/:clientId" element={<ClientForm />} />
        <Route path="/clients/:clientId" element={<ClientDetail />} />
        <Route path="/reports" element={<AllReports />} />
        <Route path="/reports/:reportId" element={<ReportDetail />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/proposals" element={<Proposals />} />
        <Route path="/proposals/new" element={<ProposalForm />} />
        <Route path="/proposals/:proposalId" element={<ProposalDetail />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/invoices/new" element={<InvoiceForm />} />
        <Route path="/invoices/:id" element={<InvoiceDetail />} />
        <Route path="/settings" element={<CompanySettings />} />
        <Route path="/settings/templates" element={<TemplateSettings />} />
        <Route path="/contracts" element={<Contracts />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </ProtectedRoute>
  );
}

export default App;
