
import { useState, useEffect } from "react";
import { getClientMetrics, updateClientMetrics, ClientMetric } from "@/services/clientMetricsService";
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
import { toast } from "sonner";
import { AIReportGenerator } from "@/components/unified-metrics/AIReportGenerator";

interface ClientMetricsTabProps {
  clientId: string;
  clientName: string;
}

export const ClientMetricsTab = ({ clientId, clientName }: ClientMetricsTabProps) => {
  const [metrics, setMetrics] = useState<ClientMetric | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching metrics for client:", clientId);
        const metricsData = await getClientMetrics(clientId);
        console.log("Metrics data received:", metricsData);
        
        if (metricsData && metricsData.length > 0) {
          setMetrics(metricsData[0]);
        } else {
          // Create default metrics object if no metrics exist
          setMetrics({
            id: "",
            month: new Date().toISOString().substring(0, 7),
            web_visits: 0,
            keywords_top10: 0,
            conversions: 0,
            conversion_goal: 30
          });
        }
      } catch (err) {
        console.error("Error fetching metrics:", err);
        setError(err instanceof Error ? err : new Error("Error desconocido al cargar métricas"));
        toast.error("No se pudieron cargar las métricas. Por favor, intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      fetchMetrics();
    }
  }, [clientId]);

  const handleInputChange = (field: keyof ClientMetric, value: any) => {
    if (!metrics) return;
    
    setMetrics(prev => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  };

  const handleSaveMetrics = async () => {
    if (!metrics) return;
    
    try {
      setIsSaving(true);
      setError(null);
      
      console.log("Saving metrics:", metrics);
      const updatedMetrics = await updateClientMetrics(clientId, metrics);
      
      setMetrics(updatedMetrics);
      toast.success("Métricas guardadas correctamente");
    } catch (err) {
      console.error("Error saving metrics:", err);
      setError(err instanceof Error ? err : new Error("Error desconocido al guardar métricas"));
      toast.error("No se pudieron guardar las métricas. Por favor, intente nuevamente.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <LoadingState />;
  
  if (error) return <ErrorAlert error={error} />;

  // Si no hay métricas, mostramos un mensaje informativo 
  // pero seguimos mostrando el formulario para que puedan crear métricas
  const noMetricsWarning = !metrics ? (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <p className="text-amber-600">
          No hay datos de métricas disponibles para este cliente. 
          Por favor, utiliza el formulario a continuación para añadir la primera métrica.
        </p>
      </CardContent>
    </Card>
  ) : null;

  return (
    <div className="space-y-6">
      {noMetricsWarning}
      
      <MetricsForm 
        currentMetric={metrics}
        isSaving={isSaving}
        handleInputChange={handleInputChange}
        handleSaveMetrics={handleSaveMetrics}
      />
      
      {metrics && (
        <MetricsSummary 
          currentMetric={metrics} 
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
