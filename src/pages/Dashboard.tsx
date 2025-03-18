
import { useEffect } from "react";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { ClientDashboard } from "@/components/dashboard/ClientDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { useLogger } from "@/hooks/useLogger";
import { OverviewTab } from "@/components/dashboard/tabs/OverviewTab";
import { ClientsTab } from "@/components/dashboard/tabs/ClientsTab";
import { InvoicesTab } from "@/components/dashboard/tabs/InvoicesTab";
import { TicketsTab } from "@/components/dashboard/tabs/TicketsTab";
import { SettingsNavigation } from "@/components/settings/SettingsNavigation";

interface DashboardProps {
  activeTab?: string;
}

const Dashboard = ({ activeTab = "overview" }: DashboardProps) => {
  const { user, isLoading, userRole } = useAuth();
  const logger = useLogger("Dashboard");

  useEffect(() => {
    logger.info("Dashboard page loaded", { activeTab });
  }, [logger, activeTab]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Si la pestaña activa es 'settings', mostramos la navegación de configuración
  if (activeTab === "settings") {
    return (
      <div className="container mx-auto py-6">
        <SettingsNavigation />
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Configuración General</h2>
          <p className="text-gray-600">
            Configura los ajustes generales de tu cuenta y aplicación.
          </p>
        </div>
      </div>
    );
  }

  // Si la pestaña activa es 'packages'
  if (activeTab === "packages") {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Paquetes de Servicio</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-4">
            Gestiona los paquetes de servicio disponibles para tus clientes.
          </p>
          {/* Aquí iría el contenido de la página de paquetes */}
          <div className="p-8 text-center">
            <p className="text-gray-500">La gestión de paquetes estará disponible próximamente.</p>
          </div>
        </div>
      </div>
    );
  }

  // Si la pestaña activa es 'proposals'
  if (activeTab === "proposals") {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Propuestas</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-4">
            Gestiona las propuestas enviadas a tus clientes.
          </p>
          {/* Aquí iría el contenido de la página de propuestas */}
          <div className="p-8 text-center">
            <p className="text-gray-500">La gestión de propuestas estará disponible próximamente.</p>
          </div>
        </div>
      </div>
    );
  }

  // Si la pestaña activa es 'reports'
  if (activeTab === "reports") {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Informes</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-4">
            Accede a todos los informes generados para tus clientes.
          </p>
          {/* Aquí iría el contenido de la página de informes */}
          <div className="p-8 text-center">
            <p className="text-gray-500">La gestión de informes estará disponible próximamente.</p>
          </div>
        </div>
      </div>
    );
  }

  // Para las pestañas específicas del dashboard
  if (activeTab === "tickets") {
    return <TicketsTab />;
  } else if (activeTab === "clients") {
    return <ClientsTab />;
  } else if (activeTab === "invoices") {
    return <InvoicesTab />;
  }

  // Dashboard estándar basado en rol
  return userRole === "admin" ? (
    <AdminDashboard />
  ) : (
    <ClientDashboard />
  );
};

export default Dashboard;
