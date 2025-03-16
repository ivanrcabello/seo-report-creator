import { useState, useEffect } from "react";
import { 
  PageSpeedReport, 
  analyzeWebsite, 
  getPageSpeedReport, 
  savePageSpeedReport 
} from "@/services/pageSpeedService";
import { MetricsCard } from "./MetricsCard";
import { Gauge, Search, Zap, CircleCheck, CircleX, Info, FileText, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PageSpeedScoreCards } from "./PageSpeedScoreCards";
import { PageSpeedPerformanceMetrics } from "./PageSpeedPerformanceMetrics";
import { PageSpeedAuditList } from "./PageSpeedAuditList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { generatePageSpeedReport } from "@/services/pageSpeedReportService";
import { useNavigate } from "react-router-dom";

interface PageSpeedSectionProps {
  clientId: string;
  clientName: string;
}

export const PageSpeedSection = ({ clientId, clientName }: PageSpeedSectionProps) => {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSpeedReport, setPageSpeedReport] = useState<PageSpeedReport | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isGeneratingAIReport, setIsGeneratingAIReport] = useState(false);
  
  useEffect(() => {
    const loadSavedReport = async () => {
      setIsLoading(true);
      try {
        const savedReport = await getPageSpeedReport(clientId);
        if (savedReport) {
          setPageSpeedReport(savedReport);
          // If there's a saved URL, populate the input field
          if (savedReport.metrics.url) {
            setUrl(savedReport.metrics.url);
          }
        }
      } catch (error) {
        console.error("Error loading saved report:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSavedReport();
  }, [clientId]);
  
  const handleAnalyze = async () => {
    if (!url) {
      toast.error("Por favor, introduce una URL válida");
      return;
    }
    
    setIsAnalyzing(true);
    try {
      const report = await analyzeWebsite(url);
      
      if (report) {
        setPageSpeedReport(report);
        
        // Save the report
        await savePageSpeedReport(clientId, report);
        toast.success("Informe guardado correctamente");
      }
    } catch (error) {
      console.error("Error in handleAnalyze:", error);
      toast.error("Ha ocurrido un error al analizar la web");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateAIReport = async () => {
    if (!pageSpeedReport) {
      toast.error("No hay datos de PageSpeed disponibles para generar un informe");
      return;
    }

    setIsGeneratingAIReport(true);
    try {
      // Generate a professional report using our new service
      const report = await generatePageSpeedReport(pageSpeedReport, clientId, clientName);
      
      toast.success("Informe generado correctamente y guardado en documentos");
      
      // Navigate to the report view after a short delay
      setTimeout(() => {
        navigate(`/reports/${report.id}`);
      }, 1500);
      
    } catch (error) {
      console.error("Error generating AI report:", error);
      toast.error("Error al generar el informe AI");
    } finally {
      setIsGeneratingAIReport(false);
    }
  };
  
  
  return (
    <MetricsCard 
      title="PageSpeed Insights" 
      icon={<Gauge className="h-5 w-5 text-seo-blue" />}
    >
      <div className="space-y-6">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label htmlFor="website-url" className="block text-sm font-medium text-gray-700 mb-1">
              URL del Sitio Web
            </label>
            <Input
              id="website-url"
              placeholder="https://ejemplo.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full"
            />
          </div>
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing}
            className="flex items-center gap-2"
          >
            {isAnalyzing ? (
              <>Analizando<span className="ml-1 animate-pulse">...</span></>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Analizar
              </>
            )}
          </Button>
        </div>
        
        {(isAnalyzing || isLoading) && (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        )}
        
        {!isAnalyzing && !isLoading && pageSpeedReport && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="bg-gray-50 border rounded-md p-4 text-sm flex-1">
                <p className="font-medium flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  Última actualización: {new Date(pageSpeedReport.metrics.last_analyzed).toLocaleString()}
                </p>
                {pageSpeedReport.metrics.url && (
                  <p className="mt-1 text-gray-600">URL analizada: {pageSpeedReport.metrics.url}</p>
                )}
              </div>
              
              <Button
                variant="outline"
                onClick={generateAIReport}
                disabled={isGeneratingAIReport}
                className="ml-4 flex items-center gap-2"
              >
                {isGeneratingAIReport ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-spin" />
                    Generando Informe...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <FileText className="h-4 w-4" />
                    Generar Informe AI
                  </>
                )}
              </Button>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Resumen</TabsTrigger>
                <TabsTrigger value="performance">Rendimiento</TabsTrigger>
                <TabsTrigger value="audits">Auditorías</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="space-y-6">
                  <PageSpeedScoreCards metrics={pageSpeedReport.metrics} />
                  
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <h3 className="text-lg font-medium mb-3">Recomendaciones Principales</h3>
                    <ul className="space-y-2">
                      {pageSpeedReport.audits
                        .filter(audit => audit.score < 0.9 && audit.category === 'performance')
                        .slice(0, 5)
                        .map(audit => (
                          <li key={audit.id} className="flex items-start gap-2">
                            {audit.score < 0.5 ? (
                              <CircleX className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                            ) : (
                              <CircleCheck className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <p className="font-medium">{audit.title}</p>
                              {audit.display_value && (
                                <p className="text-sm text-gray-600">{audit.display_value}</p>
                              )}
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="performance">
                <PageSpeedPerformanceMetrics metrics={pageSpeedReport.metrics} />
              </TabsContent>
              
              <TabsContent value="audits">
                <PageSpeedAuditList audits={pageSpeedReport.audits} />
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        {!isAnalyzing && !isLoading && !pageSpeedReport && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Zap className="h-8 w-8 text-seo-blue" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Analiza el rendimiento web</h3>
            <p className="text-gray-600 mb-4">
              Ingresa la URL del sitio web del cliente para obtener un análisis detallado de su rendimiento y optimización.
            </p>
          </div>
        )}
      </div>
    </MetricsCard>
  );
};
