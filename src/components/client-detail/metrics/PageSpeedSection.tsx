
import { useState } from "react";
import { 
  PageSpeedReport, 
  analyzeWebsite, 
  getPageSpeedReport, 
  savePageSpeedReport 
} from "@/services/pageSpeedService";
import { MetricsCard } from "./MetricsCard";
import { Gauge, Search, Zap, CircleCheck, CircleX, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PageSpeedScoreCards } from "./PageSpeedScoreCards";
import { PageSpeedPerformanceMetrics } from "./PageSpeedPerformanceMetrics";
import { PageSpeedAuditList } from "./PageSpeedAuditList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

interface PageSpeedSectionProps {
  clientId: string;
  clientName: string;
}

export const PageSpeedSection = ({ clientId, clientName }: PageSpeedSectionProps) => {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pageSpeedReport, setPageSpeedReport] = useState<PageSpeedReport | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Load saved report on component mount
  useEffect(() => {
    const savedReport = getPageSpeedReport(clientId);
    if (savedReport) {
      setPageSpeedReport(savedReport);
      // If there's a saved URL, populate the input field
      if (savedReport.metrics.url) {
        setUrl(savedReport.metrics.url);
      }
    }
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
      }
    } finally {
      setIsAnalyzing(false);
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
        
        {isAnalyzing && (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        )}
        
        {!isAnalyzing && pageSpeedReport && (
          <div className="space-y-6">
            <div className="bg-gray-50 border rounded-md p-4 text-sm">
              <p className="font-medium flex items-center gap-1">
                <Info className="h-4 w-4" />
                Última actualización: {new Date(pageSpeedReport.metrics.last_analyzed).toLocaleString()}
              </p>
              {pageSpeedReport.metrics.url && (
                <p className="mt-1 text-gray-600">URL analizada: {pageSpeedReport.metrics.url}</p>
              )}
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
        
        {!isAnalyzing && !pageSpeedReport && (
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
