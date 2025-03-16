
import { useAuth } from "@/contexts/AuthContext";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import { ClientDashboard } from "@/components/dashboard/ClientDashboard";

export default function Dashboard() {
  const { isAdmin } = useAuth();

  console.log("Dashboard - Is admin:", isAdmin);

  return (
    <div className="container mx-auto py-6">
      {isAdmin ? <AdminDashboard /> : <ClientDashboard />}
    </div>
  );
}
