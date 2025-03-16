
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, FileText, AlertCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { getPageSpeedReport } from "@/services/pageSpeedService";
import { getClientMetrics } from "@/services/clientMetricsService";
import { getLocalSeoReports } from "@/services/localSeoService";
import { getClientKeywords } from "@/services/clientKeywordsService";
import { generateUnifiedReport } from "@/services/unifiedReportService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AIReportGeneratorProps {
  clientId: string;
  clientName: string;
}

export const AIReportGenerator = ({ clientId, clientName }: AIReportGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const generateComprehensiveReport = async () => {
    console.log("Starting comprehensive report generation for client:", clientId, clientName);
    setIsGenerating(true);
    setProgress(10);
    const toastId = toast.loading("Preparando datos para generar informe...");
    
    try {
      // Recopilar todos los datos de métricas en paralelo
      console.log("Fetching all metrics data in parallel");
      setProgress(20);
      const [pageSpeedData, metricsData, localSeoData, keywordsData] = await Promise.allSettled([
        getPageSpeedReport(clientId),
        getClientMetrics(clientId),
        getLocalSeoReports(clientId),
        getClientKeywords(clientId)
      ]);
      
      // Extraer resultados manejando posibles rechazos
      setProgress(40);
      const pageSpeed = pageSpeedData.status === 'fulfilled' ? pageSpeedData.value : null;
      const metrics = metricsData.status === 'fulfilled' ? metricsData.value : [];
      const localSeo = localSeoData.status === 'fulfilled' ? 
        (localSeoData.value.length > 0 ? localSeoData.value[0] : null) : null;
      const keywords = keywordsData.status === 'fulfilled' ? keywordsData.value : [];
      
      console.log("Data collected:", { 
        pageSpeed: pageSpeed ? "Available" : "Not available", 
        metrics: metrics.length, 
        localSeo: localSeo ? "Available" : "Not available",
        keywords: keywords.length 
      });
      
      // Comprobar si hay suficientes datos para generar un informe
      if (!pageSpeed && metrics.length === 0 && !localSeo && keywords.length === 0) {
        toast.dismiss(toastId);
        toast.error("No hay suficientes datos para generar un informe");
        setIsGenerating(false);
        return;
      }
      
      toast.dismiss(toastId);
      toast.loading("Generando informe completo...");
      setProgress(60);
      
      // Generar el informe unificado
      console.log("Generating unified report with available data");
      const report = await generateUnifiedReport({
        clientId,
        clientName,
        pageSpeedData: pageSpeed,
        metricsData: metrics.length > 0 ? metrics[0] : null,
        localSeoData: localSeo,
        keywordsData: keywords
      });
      
      setProgress(90);
      
      if (report && report.id) {
        console.log("Report generated successfully with ID:", report.id);
        toast.dismiss();
        toast.success("Informe generado correctamente");
        setProgress(100);
        
        // Navegar a la vista del informe
        setTimeout(() => {
          console.log("Navigating to report view:", `/reports/${report.id}`);
          navigate(`/reports/${report.id}`);
        }, 1000);
      } else {
        throw new Error("No se pudo crear el informe");
      }
    } catch (error) {
      console.error("Error generando informe completo:", error);
      toast.dismiss(toastId);
      toast.error(`Error al generar el informe: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <Alert variant="default" className="bg-blue-50">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Informe completo con IA</AlertTitle>
        <AlertDescription>
          Este informe combinará todos los datos de métricas, PageSpeed, SEO local y palabras clave para generar
          un análisis comprensivo del rendimiento del cliente.
        </AlertDescription>
      </Alert>
      
      {isGenerating && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          <p className="text-xs text-gray-500 mt-1 text-center">
            {progress < 50 ? "Recopilando datos..." : progress < 80 ? "Generando informe..." : "Finalizando..."}
          </p>
        </div>
      )}
      
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={generateComprehensiveReport}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isGenerating ? (
            <>
              <Clock className="h-5 w-5 animate-spin" />
              Generando informe completo...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <FileText className="h-5 w-5" />
              Generar Informe Completo IA
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
