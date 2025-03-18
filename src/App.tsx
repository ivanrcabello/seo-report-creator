import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Register } from "@/pages/Register";
import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { Clients } from "@/pages/Clients";
import { Reports } from "@/pages/Reports";
import { PublicSharing } from "@/pages/PublicSharing";
import { NotFound } from "@/pages/NotFound";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { Toaster } from "sonner";
import { Profile } from "@/pages/Profile";
import { Settings } from "@/pages/Settings";
import { PublicShareView } from "@/pages/PublicShareView";
import { Pricing } from "@/pages/Pricing";
import { Invoices } from "@/pages/Invoices";
import { NewClient } from "@/pages/NewClient";
import { EditClient } from "@/pages/EditClient";
import { NewReport } from "@/pages/NewReport";
import { EditReport } from "@/pages/EditReport";
import { ClientDetail } from "@/pages/ClientDetail";
import { ReportDetail } from "@/pages/ReportDetail";
import { SupportTickets } from "@/components/dashboard/SupportTickets";
import TicketDetail from "@/pages/TicketDetail";

function App() {
  const { isLoggedIn, loading } = useAuth();
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);

  useEffect(() => {
    if (isLoggedIn) {
      const timer = setTimeout(() => {
        setShowWelcomeMessage(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/new" element={<NewClient />} />
            <Route path="/clients/:clientId" element={<ClientDetail />} />
            <Route path="/clients/:clientId/edit" element={<EditClient />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/reports/new" element={<NewReport />} />
            <Route path="/reports/:reportId" element={<ReportDetail />} />
            <Route path="/reports/:reportId/edit" element={<EditReport />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/invoices" element={<Invoices />} />
            
            {/* Ticket routes */}
            <Route path="/tickets" element={<Dashboard activeTab="tickets" />} />
            <Route path="/tickets/:ticketId" element={<TicketDetail />} />
            
          </Route>
        </Route>
        
        <Route path="/public-sharing" element={<PublicSharing />} />
        <Route path="/share/:token" element={<PublicShareView />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
