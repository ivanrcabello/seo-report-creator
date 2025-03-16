import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, FileText, AlertCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { getPageSpeedReport } from "@/services/pageSpeedService";
import { getClientMetrics } from "@/services/clientMetricsService";
import { getLocalSeoReports } from "@/services/localSeoService";
import { getClientKeywords } from "@/services/clientKeywordsService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getClientDocuments } from "@/services/documentService";
import { generateAndSaveReport } from "@/services/geminiReportService";

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
      console.log("Fetching all metrics data in parallel");
      setProgress(20);
      const [pageSpeedData, metricsData, localSeoData, keywordsData, documentsData] = await Promise.allSettled([
        getPageSpeedReport(clientId),
        getClientMetrics(clientId),
        getLocalSeoReports(clientId),
        getClientKeywords(clientId),
        getClientDocuments(clientId)
      ]);
      
      setProgress(40);
      const pageSpeed = pageSpeedData.status === 'fulfilled' ? pageSpeedData.value : null;
      const metrics = metricsData.status === 'fulfilled' ? metricsData.value : [];
      const localSeo = localSeoData.status === 'fulfilled' ? 
        (localSeoData.value.length > 0 ? localSeoData.value[0] : null) : null;
      const keywords = keywordsData.status === 'fulfilled' ? keywordsData.value : [];
      const documents = documentsData.status === 'fulfilled' ? documentsData.value : [];
      
      console.log("Data collected:", { 
        pageSpeed: pageSpeed ? "Available" : "Not available", 
        metrics: metrics.length, 
        localSeo: localSeo ? "Available" : "Not available",
        keywords: keywords.length,
        documents: documents.length
      });
      
      if (!pageSpeed && metrics.length === 0 && !localSeo && keywords.length === 0 && documents.length === 0) {
        toast.dismiss(toastId);
        toast.error("No hay suficientes datos para generar un informe");
        setIsGenerating(false);
        return;
      }
      
      toast.dismiss(toastId);
      toast.loading("Generando informe con IA de Gemini...");
      setProgress(60);
      
      const auditResult = {
        url: pageSpeed?.metrics.url || "",
        companyName: clientName,
        companyType: "",
        location: localSeo?.location || "",
        seoScore: pageSpeed?.metrics.seo_score || 0,
        performance: pageSpeed?.metrics.performance_score || 0,
        webVisibility: 0,
        keywordsCount: keywords.length,
        technicalIssues: [],
        seoResults: {
          metaTitle: true,
          metaDescription: true,
          h1Tags: 2,
          canonicalTag: true,
          keywordDensity: 1.5,
          contentLength: 1000,
          internalLinks: 5,
          externalLinks: 3
        },
        technicalResults: {
          sslStatus: 'Válido' as "Válido" | "Inválido" | "No implementado",
          httpsRedirection: true,
          mobileOptimization: true,
          robotsTxt: true,
          sitemap: true,
          technologies: ['WordPress', 'PHP']
        },
        performanceResults: {
          pageSpeed: {
            desktop: pageSpeed?.metrics.performance_score || 0,
            mobile: pageSpeed?.metrics.performance_score || 0
          },
          loadTime: '2.5s',
          resourceCount: 35,
          imageOptimization: true,
          cacheImplementation: true
        },
        socialPresence: {
          facebook: true,
          twitter: true,
          instagram: false,
          linkedin: true,
          googleBusiness: localSeo ? true : false
        },
        keywords: keywords.map(kw => ({
          word: kw.keyword,
          position: kw.position,
          targetPosition: kw.target_position,
          difficulty: kw.keyword_difficulty || 0,
          searchVolume: kw.search_volume || 0,
          count: 1
        })),
        localData: localSeo ? {
          businessName: localSeo.businessName,
          address: localSeo.address,
          googleMapsRanking: localSeo.googleMapsRanking || 0,
          googleReviews: localSeo.googleReviewsCount || 0
        } : undefined,
        metrics: {
          visits: metrics.length > 0 ? metrics[0].web_visits : 0,
          keywordsTop10: metrics.length > 0 ? metrics[0].keywords_top10 : 0,
          conversions: metrics.length > 0 ? metrics[0].conversions : 0
        },
        pagespeed: pageSpeed ? {
          performance: pageSpeed.metrics.performance_score,
          accessibility: pageSpeed.metrics.accessibility_score,
          bestPractices: pageSpeed.metrics.best_practices_score,
          seo: pageSpeed.metrics.seo_score,
          fcp: pageSpeed.metrics.first_contentful_paint,
          lcp: pageSpeed.metrics.largest_contentful_paint,
          cls: pageSpeed.metrics.cumulative_layout_shift,
          tbt: pageSpeed.metrics.total_blocking_time
        } : undefined,
        documents: documents.map(doc => ({
          id: doc.id,
          name: doc.name,
          type: doc.type,
          content: doc.content || ""
        }))
      };
      
      setProgress(80);
      const report = await generateAndSaveReport(
        clientId,
        clientName,
        auditResult,
        documents.map(doc => doc.id)
      );
      
      setProgress(100);
      
      if (report && report.id) {
        console.log("Report generated successfully with ID:", report.id);
        toast.dismiss();
        toast.success("Informe generado correctamente con Gemini");
        
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
        <AlertTitle>Informe completo con IA Gemini</AlertTitle>
        <AlertDescription>
          Este informe combinará todos los datos de métricas, PageSpeed, SEO local, palabras clave y documentos subidos para generar
          un análisis comprensivo del rendimiento del cliente usando la IA de Google Gemini.
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
              Generando informe con Gemini...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <FileText className="h-5 w-5" />
              Generar Informe con Gemini
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
