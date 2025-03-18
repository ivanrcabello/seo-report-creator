
import { useAuth } from "@/contexts/auth";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import { ClientDashboard } from "@/components/dashboard/ClientDashboard";
import { Suspense, lazy } from "react";

// Use lazy loading for the TicketsTab to improve performance
const TicketsTab = lazy(() => import("@/components/dashboard/tabs/TicketsTab"));

interface DashboardProps {
  activeTab?: string;
}

export default function Dashboard({ activeTab }: DashboardProps) {
  const { isAdmin } = useAuth();

  console.log("Dashboard - Is admin:", isAdmin);

  // If activeTab is "tickets", render the TicketsTab component directly
  if (activeTab === "tickets") {
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
        {isAdmin ? <AdminDashboard /> : <ClientDashboard />}
      </Suspense>
    </div>
  );
}
