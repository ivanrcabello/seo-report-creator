
import { useAuth } from "@/contexts/AuthContext";
import { ClientDashboard } from "@/components/dashboard/ClientDashboard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";

export default function Dashboard() {
  const { userRole, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Cargando...</div>;
  }

  return (
    <div>
      {userRole === "admin" ? (
        <AdminDashboard />
      ) : (
        <ClientDashboard />
      )}
    </div>
  );
}
