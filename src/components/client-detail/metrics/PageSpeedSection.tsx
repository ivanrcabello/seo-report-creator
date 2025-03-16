
import { useState, useEffect } from "react";
import { getPageSpeedReport, PageSpeedReport, analyzeWebsite, savePageSpeedReport } from "@/services/pageSpeedService";
import { generatePageSpeedReport } from "@/services/pageSpeedReportService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageSpeedMetricCards } from "./PageSpeedMetricCards";
import { PageSpeedScoreCards } from "./PageSpeedScoreCards";
import { PageSpeedPerformanceMetrics } from "./PageSpeedPerformanceMetrics";
import { PageSpeedAuditList } from "./PageSpeedAuditList";
import { Gauge, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageSpeedIndicator } from "./PageSpeedIndicator";
import { ErrorAlert } from "./ErrorAlert";

interface PageSpeedSectionProps {
  clientId: string;
  clientName: string;
}

export const PageSpeedSection = ({ clientId, clientName }: PageSpeedSectionProps) => {
  const [url, setUrl] = useState("");
  const [pageSpeedReport, setPageSpeedReport] = useState<PageSpeedReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingReport, setLoadingReport] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the most recent PageSpeed report on component mount
  useEffect(() => {
    const fetchLatestReport = async () => {
      try {
        setLoadingReport(true);
        console.log("Getting latest PageSpeed report for client:", clientId);
        const report = await getPageSpeedReport(clientId);
        setPageSpeedReport(report);
        
        if (report?.metrics?.url) {
          setUrl(report.metrics.url);
        }
      } catch (err) {
        console.log("No PageSpeed report found for client:", clientId);
        // Not setting error here, as it's normal for new clients to not have reports
      } finally {
        setLoadingReport(false);
      }
    };

    if (clientId) {
      fetchLatestReport();
    }
  }, [clientId]);

  const handleAnalyzeUrl = async () => {
    if (!url.trim()) {
      toast.error("Por favor, introduce una URL válida");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Add https:// if missing
      let formattedUrl = url;
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = 'https://' + formattedUrl;
        setUrl(formattedUrl);
      }
      
      // Analyze the URL
      const report = await analyzeWebsite(formattedUrl);
      
      if (report) {
        console.log("PageSpeed analysis completed:", report);
        setPageSpeedReport(report);
        
        // Save the report for this client
        try {
          const saved = await savePageSpeedReport(clientId, report);
          if (saved) {
            console.log("PageSpeed report saved successfully");
            toast.success("Análisis de PageSpeed completado y guardado");
          } else {
            console.error("Failed to save PageSpeed report");
            toast.error("Análisis completado, pero no se pudo guardar el informe");
          }
        } catch (saveError) {
          console.error("Error saving PageSpeed report:", saveError);
          toast.error("Análisis completado, pero no se pudo guardar el informe");
        }
      } else {
        throw new Error("No se pudo obtener un informe válido");
      }
    } catch (err) {
      console.error("Error analyzing URL:", err);
      setError("No se pudo analizar la URL. Por favor, inténtalo de nuevo más tarde.");
      toast.error("Error al analizar la URL. Por favor, inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!pageSpeedReport) {
      toast.error("No hay datos de PageSpeed para generar un informe");
      return;
    }

    try {
      setIsGenerating(true);
      await generatePageSpeedReport(pageSpeedReport, clientId, clientName);
      toast.success("Informe de PageSpeed generado y guardado correctamente");
    } catch (err) {
      console.error("Error generating report:", err);
      toast.error("Error al generar el informe. Por favor, inténtalo de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-blue-500" />
              Análisis de Rendimiento Web
            </CardTitle>
            <CardDescription>Métricas de Google PageSpeed Insights</CardDescription>
          </div>
          
          {pageSpeedReport && pageSpeedReport.metrics && (
            <div className="flex items-center gap-4">
              <PageSpeedIndicator 
                score={pageSpeedReport.metrics.performance_score} 
                showLabel 
              />
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleGenerateReport}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Generar Informe
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="pageSpeedUrl">URL del sitio web</Label>
              <div className="flex mt-1">
                <Input
                  id="pageSpeedUrl"
                  placeholder="https://www.ejemplo.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 rounded-r-none"
                />
                <Button
                  onClick={handleAnalyzeUrl}
                  disabled={isLoading || !url.trim()}
                  className="rounded-l-none"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analizando...
                    </>
                  ) : (
                    'Analizar'
                  )}
                </Button>
              </div>
            </div>
          </div>

          {loadingReport ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              <p className="ml-2 text-gray-500">Cargando informe de PageSpeed...</p>
            </div>
          ) : error ? (
            <ErrorAlert error={{ message: error }} />
          ) : !pageSpeedReport ? (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
              <p>No hay datos de PageSpeed para este cliente.</p>
              <p className="text-sm text-gray-500 mt-1">
                Introduce una URL y haz clic en "Analizar" para obtener métricas de rendimiento.
              </p>
            </div>
          ) : (
            <Tabs defaultValue="scores" className="mt-6">
              <TabsList>
                <TabsTrigger value="scores">Puntuaciones</TabsTrigger>
                <TabsTrigger value="metrics">Métricas</TabsTrigger>
                <TabsTrigger value="audits">Auditorías</TabsTrigger>
              </TabsList>
              
              <TabsContent value="scores">
                <PageSpeedScoreCards metrics={pageSpeedReport.metrics} />
              </TabsContent>
              
              <TabsContent value="metrics">
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <PageSpeedMetricCards metrics={pageSpeedReport.metrics} />
                  </div>
                  <PageSpeedPerformanceMetrics metrics={pageSpeedReport.metrics} />
                </div>
              </TabsContent>
              
              <TabsContent value="audits">
                <PageSpeedAuditList audits={pageSpeedReport.audits} />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
