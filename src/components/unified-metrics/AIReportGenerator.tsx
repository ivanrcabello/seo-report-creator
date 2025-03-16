
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, FileText, AlertCircle } from "lucide-react";
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
  const navigate = useNavigate();

  const generateComprehensiveReport = async () => {
    setIsGenerating(true);
    const toastId = toast.loading("Preparando datos para generar informe...");
    
    try {
      // Gather all metrics data
      const [pageSpeedData, metricsData, localSeoData, keywordsData] = await Promise.allSettled([
        getPageSpeedReport(clientId),
        getClientMetrics(clientId),
        getLocalSeoReports(clientId),
        getClientKeywords(clientId)
      ]);
      
      // Extract results handling potential rejections
      const pageSpeed = pageSpeedData.status === 'fulfilled' ? pageSpeedData.value : null;
      const metrics = metricsData.status === 'fulfilled' ? metricsData.value : [];
      const localSeo = localSeoData.status === 'fulfilled' ? 
        (localSeoData.value.length > 0 ? localSeoData.value[0] : null) : null;
      const keywords = keywordsData.status === 'fulfilled' ? keywordsData.value : [];
      
      // If no data available at all, show error
      if (!pageSpeed && metrics.length === 0 && !localSeo && keywords.length === 0) {
        toast.dismiss(toastId);
        toast.error("No hay suficientes datos para generar un informe");
        setIsGenerating(false);
        return;
      }
      
      toast.dismiss(toastId);
      toast.loading("Generando informe completo...");
      
      // Generate the unified report
      const report = await generateUnifiedReport({
        clientId,
        clientName,
        pageSpeedData: pageSpeed,
        metricsData: metrics.length > 0 ? metrics[0] : null,
        localSeoData: localSeo,
        keywordsData: keywords
      });
      
      if (report && report.id) {
        toast.dismiss();
        toast.success("Informe generado correctamente");
        
        // Navigate to the report view
        setTimeout(() => {
          navigate(`/reports/${report.id}`);
        }, 1000);
      } else {
        throw new Error("No se pudo crear el informe");
      }
    } catch (error) {
      console.error("Error generating comprehensive report:", error);
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
      
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={generateComprehensiveReport}
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <Sparkles className="h-5 w-5 animate-spin" />
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
