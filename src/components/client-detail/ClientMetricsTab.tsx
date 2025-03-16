
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MetricsCard } from "./metrics/MetricsCard";
import { MetricsForm } from "./metrics/MetricsForm";
import { LoadingState } from "./metrics/LoadingState";
import { ErrorAlert } from "./metrics/ErrorAlert";
import { useClientMetrics } from "./metrics/useClientMetrics";
import { TrendingUp, BarChart2, MousePointer, Share2, Award, Search, Gauge, FileText, MapPin } from "lucide-react";
import { MetricsSummary } from "./metrics/MetricsSummary";
import { KeywordsSection } from "./metrics/KeywordsSection";
import { PageSpeedSection } from "./metrics/PageSpeedSection";
import { PageSpeedTrends } from "./metrics/PageSpeedTrends";
import { ClientDocuments } from "@/components/client-documents";
import { LocalSeoMetrics } from "./metrics/LocalSeoMetrics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIReportGenerator } from "@/components/unified-metrics/AIReportGenerator";

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
    handleInputChange,
    metrics,
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
      
      {currentMetric && (
        <MetricsSummary currentMetric={currentMetric} clientId={clientId} />
      )}
      
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="performance">Métricas</TabsTrigger>
          <TabsTrigger value="pagespeed">PageSpeed</TabsTrigger>
          <TabsTrigger value="seolocal">SEO Local</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-6">
          <MetricsCard 
            title="Métricas de Rendimiento" 
            icon={<TrendingUp className="h-5 w-5 text-seo-blue" />}
          >
            <MetricsForm
              currentMetric={currentMetric}
              isSaving={isSaving}
              handleInputChange={handleInputChange}
              handleSaveMetrics={handleSaveMetrics}
              userRole={userRole}
              isAdmin={isAdmin}
            />
          </MetricsCard>
          
          <KeywordsSection clientId={clientId} />
          
          {metrics && metrics.length > 0 && (
            <MetricsCard 
              title="Histórico de Métricas" 
              icon={<BarChart2 className="h-5 w-5 text-seo-purple" />}
            >
              <div className="text-center text-sm text-gray-500 italic">
                Próximamente: Gráfica de tendencias históricas de las métricas
              </div>
            </MetricsCard>
          )}
        </TabsContent>
        
        <TabsContent value="pagespeed" className="space-y-6">
          <MetricsCard 
            title="Rendimiento Web (PageSpeed)" 
            icon={<Gauge className="h-5 w-5 text-seo-blue" />}
          >
            <PageSpeedTrends clientId={clientId} />
          </MetricsCard>
          
          <PageSpeedSection clientId={clientId} clientName={clientName} />
        </TabsContent>
        
        <TabsContent value="seolocal" className="space-y-6">
          <LocalSeoMetrics clientId={clientId} clientName={clientName} />
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-6">
          <MetricsCard 
            title="Documentos del Cliente" 
            icon={<FileText className="h-5 w-5 text-seo-blue" />}
          >
            <ClientDocuments clientId={clientId} onGenerateReport={() => {}} />
          </MetricsCard>
        </TabsContent>
      </Tabs>
      
      <MetricsCard 
        title="Generar Informe Completo con IA" 
        icon={<Award className="h-5 w-5 text-seo-green" />}
      >
        <AIReportGenerator clientId={clientId} clientName={clientName} />
      </MetricsCard>
    </div>
  );
};
