
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { ClientMetric } from "@/services/clientMetricsService";
import { ClientDashboardTabs } from "./ClientDashboardTabs";
import { ClientMetricsCards } from "./ClientMetricsCards";
import { ClientDashboardContent } from "./ClientDashboardContent";
import { useClientDashboardData } from "./hooks/useClientDashboardData";
import logger from "@/services/logService";

// Logger específico para ClientDashboard
const clientLogger = logger.getLogger('ClientDashboard');

export function ClientDashboard() {
  clientLogger.info("Inicializando ClientDashboard");
  
  const { user } = useAuth();
  const { metrics, isLoading, companyName } = useClientDashboardData(user);

  if (isLoading) {
    clientLogger.debug("Renderizando estado de carga");
    return <div className="py-8 text-center">Cargando dashboard...</div>;
  }

  clientLogger.debug("Renderizando dashboard de cliente", { 
    company: companyName, 
    hasMetrics: !!metrics 
  });
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard del Cliente: {companyName}</h1>
        <p className="text-gray-500">Resumen de rendimiento SEO y actividades</p>
      </div>

      <ClientDashboardTabs>
        <ClientDashboardContent metrics={metrics} />
      </ClientDashboardTabs>
    </div>
  );
}
