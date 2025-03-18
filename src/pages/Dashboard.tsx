
import { useAuth } from "@/contexts/AuthContext";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import { ClientDashboard } from "@/components/dashboard/ClientDashboard";
import { Suspense } from "react";
import { TicketsTab } from "@/components/dashboard/tabs/TicketsTab";

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
        <TicketsTab />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<div>Cargando...</div>}>
        {isAdmin ? <AdminDashboard /> : <ClientDashboard />}
      </Suspense>
    </div>
  );
}
