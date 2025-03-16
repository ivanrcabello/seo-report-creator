
import { useState, useEffect } from "react";
import { getClientMetrics } from "@/services/clientMetricsService";
import { getPageSpeedReport } from "@/services/pageSpeedService";
import { MetricsForm } from "./metrics/MetricsForm";
import { MetricsSummary } from "./metrics/MetricsSummary";
import { LoadingState } from "./metrics/LoadingState";
import { ErrorAlert } from "./metrics/ErrorAlert";
import { PageSpeedSection } from "./metrics/PageSpeedSection";
import { KeywordsSection } from "./metrics/KeywordsSection";
import { LocalSeoMetrics } from "./metrics/LocalSeoMetrics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { AIReportGenerator } from "@/components/unified-metrics/AIReportGenerator";

interface ClientMetricsTabProps {
  clientId: string;
  clientName: string;
}

export const ClientMetricsTab = ({ clientId, clientName }: ClientMetricsTabProps) => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const metricsData = await getClientMetrics(clientId);
        setMetrics(metricsData);
      } catch (err) {
        console.error("Error fetching metrics:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [clientId]);

  if (loading) return <LoadingState />;
  
  // Si hay un error, mostramos el componente de error
  if (error) return <ErrorAlert error={error} />;

  // Si no hay métricas, mostramos un mensaje informativo 
  // pero seguimos mostrando el formulario para que puedan crear métricas
  const noMetricsWarning = !metrics || (Array.isArray(metrics) && metrics.length === 0) ? (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <p className="text-amber-600">
          No hay datos de métricas disponibles para este cliente. 
          Por favor, utiliza el formulario a continuación para añadir la primera métrica.
        </p>
      </CardContent>
    </Card>
  ) : null;

  const currentMetric = metrics && Array.isArray(metrics) && metrics.length > 0 ? metrics[0] : null;

  return (
    <div className="space-y-6">
      {noMetricsWarning}
      
      <MetricsForm 
        currentMetric={currentMetric}
        isSaving={false}
        handleInputChange={() => {}}
        handleSaveMetrics={async () => {}}
      />
      
      {currentMetric && (
        <MetricsSummary 
          currentMetric={currentMetric} 
          clientId={clientId} 
        />
      )}
      
      <PageSpeedSection clientId={clientId} clientName={clientName} />
      <KeywordsSection clientId={clientId} />
      <LocalSeoMetrics clientId={clientId} clientName={clientName} />

      <div className="mt-8 border-t pt-6">
        <AIReportGenerator clientId={clientId} clientName={clientName} />
      </div>
    </div>
  );
};
