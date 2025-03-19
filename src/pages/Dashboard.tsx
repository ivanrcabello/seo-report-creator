
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { ClientDashboard } from "@/components/dashboard/ClientDashboard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { DashboardError } from "@/components/dashboard/DashboardError";
import { DashboardProps } from "@/components/dashboard/types/dashboardTypes";

// Map activeTab query parameter to dashboard tab
const mapQueryTabToDashboardTab = (tab: string | null): string => {
  const validTabs = [
    "dashboard", "reports", "proposals", "contracts", 
    "invoices", "documents", "tickets", "support", "profile"
  ];
  
  if (tab && validTabs.includes(tab)) {
    return tab;
  }
  
  return "dashboard";
};

const Dashboard = ({ activeTab, isNew, newContract, newProposal }: DashboardProps) => {
  const { user, userRole, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get("tab");
  
  // Determine which dashboard tab should be active
  const determinedActiveTab = activeTab || mapQueryTabToDashboardTab(tabParam);
  
  // Log details for debugging
  useEffect(() => {
    console.info("Dashboard - Is admin:", userRole === "admin", "Active tab:", activeTab, "UserRole:", userRole, "User ID:", user?.id);
    console.info("Dashboard props:", { isNew, newContract, newProposal });
  }, [userRole, activeTab, user?.id, isNew, newContract, newProposal]);
  
  if (isLoading) {
    return <DashboardSkeleton />;
  }
  
  if (error) {
    return <DashboardError errorMessage={error} error={error} onRetry={() => setError(null)} />;
  }
  
  if (!user) {
    return <DashboardError errorMessage="No has iniciado sesión" error="No user session found" onRetry={() => window.location.reload()} />;
  }
  
  console.info("Route accessed: /dashboard by user role:", userRole);
  
  return (
    <div className="container mx-auto">
      {userRole === "admin" ? (
        <AdminDashboard 
          activeTab={determinedActiveTab} 
          isNew={isNew || false}
          newContract={newContract || false}
          newProposal={newProposal || false}
        />
      ) : (
        <ClientDashboard activeTab={determinedActiveTab} />
      )}
    </div>
  );
};

export default Dashboard;
