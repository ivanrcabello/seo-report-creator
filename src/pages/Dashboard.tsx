
import { useAuth } from "@/contexts/auth";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import { ClientDashboard } from "@/components/dashboard/ClientDashboard";
import { Suspense, lazy, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Use lazy loading for the TicketsTab to improve performance
const TicketsTab = lazy(() => import("@/components/dashboard/tabs/TicketsTab"));

interface DashboardProps {
  activeTab?: string;
}

export default function Dashboard({ activeTab }: DashboardProps) {
  const { isAdmin, userRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  console.log("Dashboard - Is admin:", isAdmin, "Active tab:", activeTab, "UserRole:", userRole);
  
  // Parse the tab from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get("tab");
  
  // Use tab from URL or passed prop
  const currentTab = tabFromUrl || activeTab;
  
  // Enforce permissions for specific tabs
  useEffect(() => {
    if (userRole === "client" && tabFromUrl === "clients") {
      // Clients can't access the clients tab, redirect to dashboard
      navigate("/dashboard");
    }
  }, [tabFromUrl, userRole, navigate]);

  // If activeTab is "tickets", render the TicketsTab component directly
  if (currentTab === "tickets") {
    return (
      <div className="container mx-auto py-6">
        <Suspense fallback={<div>Cargando tickets...</div>}>
          <TicketsTab />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<div>Cargando dashboard...</div>}>
        {isAdmin ? 
          <AdminDashboard activeTab={currentTab} /> : 
          <ClientDashboard activeTab={currentTab} />
        }
      </Suspense>
    </div>
  );
}
