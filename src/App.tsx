
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Clients from "@/pages/Clients";
import Invoices from "@/pages/Invoices";
import NotFound from "@/pages/NotFound";
import { useAuth } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import ClientDetail from "@/pages/ClientDetail";
import ReportDetail from "@/pages/ReportDetail";
import { SupportTickets } from "@/components/dashboard/SupportTickets";
import TicketDetail from "@/pages/TicketDetail";
import { AppLayout } from "@/components/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

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
  
  return (
    <BrowserRouter>
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
            
            {/* Ticket routes */}
            <Route path="/tickets" element={<Dashboard activeTab="tickets" />} />
            <Route path="/tickets/:ticketId" element={<TicketDetail />} />
          </Route>
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
