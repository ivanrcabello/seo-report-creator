
import { useState, useEffect } from "react";
import { getClientMetrics, updateClientMetrics, ClientMetric } from "@/services/clientMetricsService";
import { getPageSpeedReport } from "@/services/pageSpeedService";
import { MetricsForm } from "./metrics/MetricsForm";
import { MetricsSummary } from "./metrics/MetricsSummary";
import { LoadingState } from "./metrics/LoadingState";
import { ErrorAlert } from "./metrics/ErrorAlert";
import { PageSpeedSection } from "./metrics/PageSpeedSection";
import { KeywordsSection } from "./metrics/KeywordsSection";
import { LocalSeoMetrics } from "./metrics/local-seo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { AIReportGenerator } from "@/components/unified-metrics/AIReportGenerator";
import { ClientDocument } from "@/types/client";
import { DocumentUploadSection } from "@/components/client-documents/DocumentUploadSection";
import { getClientDocuments } from "@/services/documentService";
import { FileText } from "lucide-react";

interface ClientMetricsTabProps {
  clientId: string;
  clientName: string;
}

export const ClientMetricsTab = ({ clientId, clientName }: ClientMetricsTabProps) => {
  const [metrics, setMetrics] = useState<ClientMetric | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeMetricsTab, setActiveMetricsTab] = useState<string>("general");
  const { user } = useAuth();
  
  // Document related states
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

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

    const fetchDocuments = async () => {
      try {
        setLoadingDocuments(true);
        const fetchedDocuments = await getClientDocuments(clientId);
        setDocuments(fetchedDocuments);
      } catch (err) {
        console.error("Error fetching documents:", err);
        toast.error("No se pudieron cargar los documentos del cliente");
      } finally {
        setLoadingDocuments(false);
      }
    };

    if (clientId) {
      fetchMetrics();
      fetchDocuments();
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

  const handleGenerateReport = (documentIds: string[]) => {
    if (documentIds.length === 0) {
      toast.error("Selecciona al menos un documento para generar un informe");
      return;
    }
    
    toast.success("Generando informe con los documentos seleccionados...");
    // Aquí se implementaría la lógica para generar el informe
    // Por ahora solo mostramos una notificación
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
      
      <Tabs defaultValue={activeMetricsTab} value={activeMetricsTab} onValueChange={setActiveMetricsTab} className="w-full">
        <TabsList>
          <TabsTrigger value="general">Métricas Generales</TabsTrigger>
          <TabsTrigger value="pagespeed">Rendimiento Web</TabsTrigger>
          <TabsTrigger value="keywords">Palabras Clave</TabsTrigger>
          <TabsTrigger value="local-seo">SEO Local</TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            Documentos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
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
        </TabsContent>
        
        <TabsContent value="pagespeed">
          <PageSpeedSection clientId={clientId} clientName={clientName} />
        </TabsContent>
        
        <TabsContent value="keywords">
          <KeywordsSection clientId={clientId} />
        </TabsContent>
        
        <TabsContent value="local-seo">
          <LocalSeoMetrics clientId={clientId} clientName={clientName} />
        </TabsContent>

        <TabsContent value="documents">
          <div className="space-y-6">
            <DocumentUploadSection
              clientId={clientId}
              isUploading={isUploading}
              documents={documents}
              setDocuments={setDocuments}
              setIsUploading={setIsUploading}
            />
            
            {documents.length > 0 && (
              <div className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Documentos subidos ({documents.length})</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {documents.map(doc => (
                        <Card key={doc.id} className="p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-3">
                            <FileText className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium truncate">{doc.name}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(doc.uploadDate).toLocaleDateString('es-ES')}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 border-t pt-6">
        <AIReportGenerator clientId={clientId} clientName={clientName} />
      </div>
    </div>
  );
};
