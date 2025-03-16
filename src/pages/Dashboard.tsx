
import { useAuth } from "@/contexts/AuthContext";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import { ClientDashboard } from "@/components/dashboard/ClientDashboard";
import { Suspense } from "react";

export default function Dashboard() {
  const { isAdmin } = useAuth();

  console.log("Dashboard - Is admin:", isAdmin);

  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<div>Cargando...</div>}>
        {isAdmin ? <AdminDashboard /> : <ClientDashboard />}
      </Suspense>
    </div>
  );
}
