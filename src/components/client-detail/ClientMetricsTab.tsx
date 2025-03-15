
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MetricsCard } from "./metrics/MetricsCard";
import { MetricsForm } from "./metrics/MetricsForm";
import { LoadingState } from "./metrics/LoadingState";
import { ErrorAlert } from "./metrics/ErrorAlert";
import { useClientMetrics } from "./metrics/useClientMetrics";

interface ClientMetricsTabProps {
  clientId: string;
  clientName: string;
}

export const ClientMetricsTab = ({ clientId, clientName }: ClientMetricsTabProps) => {
  const { isAdmin, userRole } = useAuth();
  const { 
    currentMetric, 
    isLoading, 
    isSaving, 
    error, 
    handleSaveMetrics, 
    handleInputChange 
  } = useClientMetrics(clientId);
  
  useEffect(() => {
    console.log("ClientMetricsTab - Current user role:", userRole);
    console.log("ClientMetricsTab - Is admin:", isAdmin);
    console.log("ClientMetricsTab - Client ID:", clientId);
    console.log("ClientMetricsTab - Client Name:", clientName);
  }, [userRole, isAdmin, clientId, clientName]);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-8">
      {error && <ErrorAlert error={error} />}
      
      <MetricsCard title="Métricas de Rendimiento">
        <MetricsForm
          currentMetric={currentMetric}
          isSaving={isSaving}
          handleInputChange={handleInputChange}
          handleSaveMetrics={handleSaveMetrics}
          userRole={userRole}
          isAdmin={isAdmin}
        />
      </MetricsCard>
    </div>
  );
};
