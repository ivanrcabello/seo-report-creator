
import { useAuth } from "@/contexts/AuthContext";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import { ClientDashboard } from "@/components/dashboard/ClientDashboard";
import { Suspense, useEffect } from "react";
import { TicketsTab } from "@/components/dashboard/tabs/TicketsTab";
import logger from "@/services/logService";

// Logger específico para el Dashboard
const dashLogger = logger.getLogger('Dashboard');

interface DashboardProps {
  activeTab?: string;
}

export default function Dashboard({ activeTab }: DashboardProps) {
  const { isAdmin, userRole, user } = useAuth();

  useEffect(() => {
    dashLogger.info("Dashboard montado", { 
      isAdmin, 
      userRole, 
      userId: user?.id, 
      activeTab 
    });
    
    return () => {
      dashLogger.debug("Dashboard desmontado");
    };
  }, [isAdmin, userRole, user, activeTab]);

  // Si activeTab es "tickets", renderizar el TicketsTab directamente
  if (activeTab === "tickets") {
    dashLogger.debug("Renderizando pestaña de tickets");
    return (
      <div className="container mx-auto py-6">
        <TicketsTab />
      </div>
    );
  }

  // Envolvemos el renderizado en un try-catch para detectar errores
  try {
    dashLogger.debug("Preparando renderizado de dashboard", { isAdmin });
    
    return (
      <div className="container mx-auto py-6">
        <Suspense fallback={
          <div className="animate-pulse p-6 text-center">
            <p className="text-lg text-gray-600">Cargando...</p>
          </div>
        }>
          {isAdmin ? (
            <>
              {dashLogger.debug("Renderizando AdminDashboard")}
              <AdminDashboard />
            </>
          ) : (
            <>
              {dashLogger.debug("Renderizando ClientDashboard")}
              <ClientDashboard />
            </>
          )}
        </Suspense>
      </div>
    );
  } catch (error) {
    dashLogger.error("Error al renderizar el Dashboard:", error);
    return (
      <div className="container mx-auto py-6 text-center">
        <h2 className="text-xl text-red-600">Error al cargar el dashboard</h2>
        <p className="text-gray-600 mt-2">Por favor, intenta recargar la página</p>
      </div>
    );
  }
}
