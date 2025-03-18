
import { useAuth } from "@/contexts/auth";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import { ClientDashboard } from "@/components/dashboard/ClientDashboard";
import { Suspense, lazy, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Use lazy loading for the TicketsTab to improve performance
const TicketsTab = lazy(() => import("@/components/dashboard/tabs/TicketsTab"));

export interface DashboardProps {
  activeTab?: string;
  isNew?: boolean;
  newContract?: boolean;
  newProposal?: boolean;
}

export default function Dashboard({ activeTab, isNew, newContract, newProposal }: DashboardProps) {
  const { isAdmin, userRole, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  console.log("Dashboard - Is admin:", isAdmin, "Active tab:", activeTab, "UserRole:", userRole, "User ID:", user?.id);
  console.log("Dashboard props:", { isNew, newContract, newProposal });
  
  // Parse the tab from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get("tab");
  
  // Use tab from URL or passed prop
  const currentTab = tabFromUrl || activeTab;
  
  // Enforce permissions for specific tabs
  useEffect(() => {
    // If no user or role, redirect to login
    if (!user || !userRole) {
      navigate("/login");
      return;
    }

    if (userRole === "client") {
      // Clients can't access admin-only tabs
      const adminOnlyTabs = ["clients", "packages"];
      if (adminOnlyTabs.includes(tabFromUrl || '')) {
        toast.error("No tienes permiso para acceder a esta sección");
        navigate("/dashboard");
      }
      
      // Check if we're trying to access creation paths
      const creationPaths = [
        "/invoices/new",
        "/contracts/new",
        "/proposals/new",
        "/reports/new"
      ];
      
      if (creationPaths.some(path => location.pathname === path)) {
        toast.error("No tienes permiso para crear este recurso");
        navigate("/dashboard");
      }
    }
  }, [tabFromUrl, userRole, navigate, user, location.pathname]);

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
          <AdminDashboard 
            activeTab={currentTab} 
            newContract={newContract} 
            newProposal={newProposal} 
            isNew={isNew}
          /> : 
          <ClientDashboard activeTab={currentTab} />
        }
      </Suspense>
    </div>
  );
}
