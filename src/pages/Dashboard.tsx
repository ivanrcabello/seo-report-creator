
import { useAuth } from "@/contexts/AuthContext";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { ClientDashboard } from "@/components/dashboard/ClientDashboard";
import { TestUserCreator } from "@/components/TestUserCreator";

export default function Dashboard() {
  const { isAdmin, userRole } = useAuth();

  // Create the test user automatically on first load of the dashboard by admin
  const shouldCreateTestUser = isAdmin;

  return (
    <div className="container mx-auto py-6">
      {shouldCreateTestUser && (
        <TestUserCreator
          email="ivan@repararelpc.es"
          password="6126219271"
          name="Cliente de Prueba"
          role="client"
          autoCreate={true}
        />
      )}
      
      {isAdmin ? <AdminDashboard /> : <ClientDashboard />}
    </div>
  );
}
