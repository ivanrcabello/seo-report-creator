
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientDetail from './pages/ClientDetail';
import AllReports from './pages/AllReports';
import ReportDetail from './pages/ReportDetail';
import Packages from './pages/Packages';
import Proposals from './pages/Proposals';
import Invoices from './pages/Invoices';
import CompanySettings from './pages/CompanySettings';
import TemplateSettings from './pages/TemplateSettings';
import Contracts from './pages/Contracts';

// Componente para proteger rutas que requieren autenticación
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const location = useLocation();

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
          <Route path="/login" element={<Login />} />
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
        <Route path="/clients" element={<Clients />} />
        <Route path="/clients/:clientId" element={<ClientDetail />} />
        <Route path="/reports" element={<AllReports />} />
        <Route path="/report/:reportId" element={<ReportDetail />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/proposals" element={<Proposals />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/settings" element={<CompanySettings />} />
        <Route path="/settings/templates" element={<TemplateSettings />} />
        <Route path="/contracts" element={<Contracts />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </ProtectedRoute>
  );
}

export default App;
