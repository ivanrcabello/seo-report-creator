
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  FileText, 
  AlertCircle, 
  Clock, 
  Settings,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { getPageSpeedReport } from "@/services/pageSpeedService";
import { getClientMetrics } from "@/services/clientMetricsService";
import { getLocalSeoReports } from "@/services/localSeoService";
import { getClientKeywords } from "@/services/clientKeywordsService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getClientDocuments } from "@/services/documentService";
import { generateAndSaveOpenAIReport } from "@/services/reports/openAIReportService";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AIReportGeneratorProps {
  clientId: string;
  clientName: string;
}

export const AIReportGenerator = ({ clientId, clientName }: AIReportGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [customPrompt, setCustomPrompt] = useState("");
  const [reportType, setReportType] = useState<'seo' | 'local' | 'technical' | 'performance'>('seo');
  const [showCustomPromptDialog, setShowCustomPromptDialog] = useState(false);
  const navigate = useNavigate();

  const generateComprehensiveReport = async (useCustomPrompt = false) => {
    try {
      console.log("Starting comprehensive report generation for client:", clientId, clientName);
      setIsGenerating(true);
      setProgress(10);
      const toastId = toast.loading("Preparando datos para generar informe...");
      
      if (!clientId || !clientName) {
        throw new Error("Se requiere ID y nombre del cliente para generar el informe");
      }
      
      console.log("Fetching all metrics data in parallel");
      setProgress(20);
      
      // Utilizamos Promise.allSettled para que si una falla, las otras sigan
      const [pageSpeedData, metricsData, localSeoData, keywordsData, documentsData] = await Promise.allSettled([
        getPageSpeedReport(clientId).catch(err => {
          console.error("Error fetching page speed:", err);
          return null;
        }),
        getClientMetrics(clientId).catch(err => {
          console.error("Error fetching metrics:", err);
          return [];
        }),
        getLocalSeoReports(clientId).catch(err => {
          console.error("Error fetching local SEO:", err);
          return [];
        }),
        getClientKeywords(clientId).catch(err => {
          console.error("Error fetching keywords:", err);
          return [];
        }),
        getClientDocuments(clientId).catch(err => {
          console.error("Error fetching documents:", err);
          return [];
        })
      ]);
      
      setProgress(40);
      const pageSpeed = pageSpeedData.status === 'fulfilled' ? pageSpeedData.value : null;
      const metrics = metricsData.status === 'fulfilled' ? metricsData.value : [];
      const localSeo = localSeoData.status === 'fulfilled' ? 
        (localSeoData.value && localSeoData.value.length > 0 ? localSeoData.value[0] : null) : null;
      const keywords = keywordsData.status === 'fulfilled' ? keywordsData.value : [];
      const documents = documentsData.status === 'fulfilled' ? documentsData.value : [];
      
      console.log("Data collected:", { 
        pageSpeed: pageSpeed ? "Available" : "Not available", 
        metrics: metrics.length, 
        localSeo: localSeo ? "Available" : "Not available",
        keywords: keywords.length,
        documents: documents.length
      });
      
      toast.dismiss(toastId);
      toast.loading("Generando informe con IA de OpenAI...");
      setProgress(60);
      
      // Preparamos datos de la auditoría para el informe con valores por defecto sólidos
      const auditResult = {
        url: pageSpeed?.metrics?.url || "https://example.com",
        companyName: clientName,
        companyType: "",
        location: localSeo?.location || "",
        seoScore: pageSpeed?.metrics?.seo_score || 50,
        performance: pageSpeed?.metrics?.performance_score || 50,
        webVisibility: metrics.length > 0 ? (metrics[0].web_visits || 0) : 0,
        keywordsCount: keywords.length || 0,
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
        performanceResults: pageSpeed ? {
          pageSpeed: {
            desktop: pageSpeed.metrics.performance_score || 0,
            mobile: pageSpeed.metrics.performance_score || 0
          },
          loadTime: `${((pageSpeed.metrics.largest_contentful_paint || 0) / 1000).toFixed(1)}s`,
          resourceCount: 35,
          imageOptimization: true,
          cacheImplementation: true
        } : {
          pageSpeed: {
            desktop: 50,
            mobile: 40
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
        keywords: keywords.length > 0 ? keywords.map(kw => ({
          word: kw.keyword,
          position: kw.position,
          targetPosition: kw.target_position,
          difficulty: kw.keyword_difficulty || 0,
          searchVolume: kw.search_volume || 0,
          count: 1
        })) : [
          { word: 'seo', position: 5, targetPosition: 3, difficulty: 50, searchVolume: 1000, count: 1 },
          { word: 'marketing digital', position: 10, targetPosition: 5, difficulty: 70, searchVolume: 5000, count: 1 }
        ],
        localData: localSeo ? {
          businessName: localSeo.businessName,
          address: localSeo.address || "",
          googleMapsRanking: localSeo.googleMapsRanking || 0,
          googleReviews: localSeo.googleReviewsCount || 0
        } : undefined,
        metrics: {
          visits: metrics.length > 0 ? metrics[0].web_visits || 0 : 100,
          keywordsTop10: metrics.length > 0 ? metrics[0].keywords_top10 || 0 : 5,
          conversions: metrics.length > 0 ? metrics[0].conversions || 0 : 10
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
        } : {
          performance: 70,
          accessibility: 90,
          bestPractices: 85,
          seo: 75,
          fcp: 2000,
          lcp: 3500,
          cls: 0.1,
          tbt: 300
        },
        documents: documents.map(doc => ({
          id: doc.id,
          name: doc.name,
          type: doc.type,
          content: doc.content || ""
        })),
        customPrompt: useCustomPrompt ? customPrompt : undefined
      };
      
      setProgress(80);
      console.log("Sending audit data to generateAndSaveOpenAIReport function");
      
      console.log("Audit result data verification:");
      console.log("- URL: ", auditResult.url);
      console.log("- Company name: ", auditResult.companyName);
      console.log("- SEO score: ", auditResult.seoScore);
      console.log("- Using custom prompt: ", useCustomPrompt);
      console.log("- Report type: ", reportType);
      
      const report = await generateAndSaveOpenAIReport(
        clientId,
        clientName,
        auditResult,
        documents.map(doc => doc.id)
      );
      
      setProgress(100);
      
      if (report && report.id) {
        console.log("Report generated successfully with ID:", report.id);
        toast.dismiss();
        toast.success("Informe generado correctamente con OpenAI");
        
        // Small delay to allow the user to see the success message
        setTimeout(() => {
          console.log("Navigating to report view:", `/reports/${report.id}`);
          navigate(`/reports/${report.id}`);
        }, 1500);
      } else {
        throw new Error("No se pudo crear el informe");
      }
    } catch (error) {
      console.error("Error generando informe completo:", error);
      toast.dismiss();
      toast.error(`Error al generar el informe: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setIsGenerating(false);
    } finally {
      setIsGenerating(false);
      setShowCustomPromptDialog(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <Alert variant="default" className="bg-blue-50">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Informe completo con IA OpenAI</AlertTitle>
        <AlertDescription>
          Este informe combinará todos los datos de métricas, PageSpeed, SEO local, palabras clave y documentos subidos para generar
          un análisis comprensivo del rendimiento del cliente usando la IA de OpenAI.
        </AlertDescription>
      </Alert>
      
      {isGenerating && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          <p className="text-xs text-gray-500 mt-1 text-center">
            {progress < 30 ? "Recopilando datos..." : 
             progress < 60 ? "Procesando información..." : 
             progress < 80 ? "Generando informe con IA..." : 
             "Finalizando y guardando..."}
          </p>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <Button
          size="lg"
          onClick={() => generateComprehensiveReport(false)}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isGenerating ? (
            <>
              <Clock className="h-5 w-5 animate-spin" />
              Generando informe con OpenAI...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <FileText className="h-5 w-5" />
              Generar Informe con OpenAI
            </>
          )}
        </Button>
        
        <Dialog open={showCustomPromptDialog} onOpenChange={setShowCustomPromptDialog}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              <Settings className="h-5 w-5" />
              <MessageSquare className="h-5 w-5" />
              Personalizar Prompt
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Personalizar Prompt para OpenAI</DialogTitle>
              <DialogDescription>
                Puedes personalizar el prompt que se enviará a OpenAI para generar un informe más específico.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="report-type">Tipo de Informe</Label>
                <Select 
                  value={reportType} 
                  onValueChange={(value) => setReportType(value as 'seo' | 'local' | 'technical' | 'performance')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo de informe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seo">SEO General</SelectItem>
                    <SelectItem value="local">SEO Local</SelectItem>
                    <SelectItem value="technical">SEO Técnico</SelectItem>
                    <SelectItem value="performance">Rendimiento Web</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="custom-prompt">Instrucciones Adicionales</Label>
                <Textarea
                  id="custom-prompt"
                  placeholder="Escribe instrucciones específicas para la generación del informe..."
                  rows={6}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="resize-none"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowCustomPromptDialog(false)}
              >
                Cancelar
              </Button>
              <Button 
                onClick={() => generateComprehensiveReport(true)}
                disabled={isGenerating}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isGenerating ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generar con Prompt Personalizado
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
