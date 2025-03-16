import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ClientsPage from './pages/ClientsPage';
import ClientDetailsPage from './pages/ClientDetailsPage';
import ReportsPage from './pages/ReportsPage';
import ReportPage from './pages/ReportPage';
import PackagesPage from './pages/PackagesPage';
import ProposalsPage from './pages/ProposalsPage';
import InvoicesPage from './pages/InvoicesPage';
import SettingsPage from './pages/SettingsPage';
import ContractsPage from './pages/ContractsPage';
import CompanySettings from './pages/CompanySettings';
import TemplateSettings from './pages/TemplateSettings';

// Componente para proteger rutas que requieren autenticación
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Cargando...</div>; // Puedes reemplazar esto con un spinner
  }

  if (!user) {
    // Redirige al usuario a la página de inicio de sesión y guarda la ubicación actual
    return <Navigate to="/login" replace state={{ path: location.pathname }} />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<AppRoutes />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

function AppRoutes() {
  return (
    <ProtectedRoute>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/clients/:clientId" element={<ClientDetailsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/report/:reportId" element={<ReportPage />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/proposals" element={<ProposalsPage />} />
        <Route path="/invoices" element={<InvoicesPage />} />
        <Route path="/settings" element={<CompanySettings />} />
		<Route path="/settings/templates" element={<TemplateSettings />} />
        <Route path="/contracts" element={<ContractsPage />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </ProtectedRoute>
  );
}

export default App;
