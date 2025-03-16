
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
import { Card } from "@/components/ui/card";
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
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [clientId]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorAlert error={error} />;

  return (
    <div className="space-y-6">
      <MetricsForm 
        currentMetric={metrics && metrics.length > 0 ? metrics[0] : null}
        isSaving={false}
        handleInputChange={() => {}}
        handleSaveMetrics={async () => {}}
      />
      <MetricsSummary 
        currentMetric={metrics && metrics.length > 0 ? metrics[0] : null} 
        clientId={clientId} 
      />
      <PageSpeedSection clientId={clientId} clientName={clientName} />
      <KeywordsSection clientId={clientId} />
      <LocalSeoMetrics clientId={clientId} clientName={clientName} />

      <div className="mt-8 border-t pt-6">
        <AIReportGenerator clientId={clientId} clientName={clientName} />
      </div>
    </div>
  );
};
