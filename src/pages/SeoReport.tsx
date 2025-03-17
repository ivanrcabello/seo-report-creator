import { useEffect, useState, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { AuditResult } from "@/services/pdfAnalyzer";
import { useToast } from "@/components/ui/use-toast";
import { AIReportGenerator } from "@/components/ai-report/AIReportGenerator";
import { ReportHeader } from "@/components/seo-report/ReportHeader";
import { ScoreCards } from "@/components/seo-report/ScoreCards";
import { MetricCards } from "@/components/seo-report/MetricCards";
import { SeoDetailsCard } from "@/components/seo-report/SeoDetailsCard";
import { Recommendations } from "@/components/seo-report/Recommendations";
import { NoDataCard } from "@/components/seo-report/NoDataCard";
import { getReport, deleteReport } from "@/services/reportService";
import { ClientReport } from "@/types/client";
import { generateGeminiReport } from "@/services/geminiReportService";
import { downloadSeoReportPdf } from "@/services/pdf/seoReportPdfService";
import { toast } from "sonner";
import "../styles/print.css";
import { Button } from "@/components/ui/button";
import { 
  Trash2, 
  AlertCircle, 
  Printer, 
  Download, 
  Gem,
  ArrowLeft,
  RefreshCw,
  Loader2
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const SeoReport = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [report, setReport] = useState<ClientReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const fetchReport = async () => {
    if (id) {
      setIsLoading(true);
      setError(null);
      try {
        console.log("Fetching SEO report with ID:", id);
        const reportData = await getReport(id);
        if (reportData) {
          console.log("SEO report loaded successfully:", reportData.id, reportData.title);
          setReport(reportData);
          
          if (reportData.analyticsData?.auditResult) {
            console.log("Report has audit results");
            setAuditResult(reportData.analyticsData.auditResult);
          } else {
            console.log("Report has no audit results");
          }
        } else {
          console.error("No SEO report found with ID:", id);
          setError("No se encontró el informe. Es posible que haya sido eliminado o que no exista.");
        }
      } catch (error) {
        console.error("Error fetching SEO report:", error);
        setError("Error al cargar el informe. Por favor, inténtalo de nuevo más tarde.");
        uiToast({
          title: "Error",
          description: "No se pudo cargar el informe",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (location.state?.auditResult) {
      console.log("Using audit result from location state");
      setAuditResult(location.state.auditResult);
    }
    
    fetchReport();
  }, [location, id]);

  const handleRetry = () => {
    fetchReport();
  };

  const handlePrint = () => {
    window.print();
    uiToast({
      title: "Imprimiendo informe",
      description: "El informe se está enviando a la impresora",
    });
  };

  const handleDownload = async () => {
    try {
      if (!id) return;
      await downloadSeoReportPdf(id);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Error al descargar el PDF");
    }
  };

  const handleGeminiGeneration = async () => {
    if (!auditResult || !report) return;
    
    setIsGeneratingAI(true);
    toast.loading("Generando informe con IA...");
    
    try {
      const content = await generateGeminiReport(auditResult);
      if (content && report) {
        const updatedReport = {
          ...report,
          content: content,
        };
        setReport(updatedReport);
        toast.success("Informe generado con éxito");
      } else {
        toast.error("No se pudo generar el informe con IA");
      }
    } catch (error) {
      console.error("Error generando informe con IA:", error);
      toast.error("Error al generar el informe con IA");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleDeleteReport = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    
    try {
      await deleteReport(id);
      toast.success("Informe eliminado correctamente");
      navigate(-1);
    } catch (error) {
      console.error("Error deleting report:", error);
      toast.error("No se pudo eliminar el informe");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-blue-600">Cargando informe...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col gap-3">
            <Button 
              variant="outline"
              className="w-full"
              onClick={handleRetry}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
            <Button 
              variant="default"
              className="w-full"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!auditResult && !report?.content) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
        <div className="container mx-auto max-w-5xl">
          <Button 
            variant="ghost" 
            className="gap-2 mb-6" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          
          <NoDataCard />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            className="gap-2" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
            
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
              Descargar PDF
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="gap-2"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. El informe será eliminado permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteReport}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="mb-6 flex justify-end">
          <Button 
            onClick={handleGeminiGeneration}
            disabled={isGeneratingAI}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            {isGeneratingAI ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                <span>Generando...</span>
              </>
            ) : (
              <>
                <Gem className="h-5 w-5 text-white" />
                <span>Generar con IA</span>
              </>
            )}
          </Button>
        </div>

        <div ref={reportRef} className="report-container space-y-8 bg-white rounded-xl shadow-lg p-8 print:shadow-none">
          <div className="text-center border-b pb-6">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">Informe de Análisis SEO</h1>
            <p className="text-gray-600">Generado el {new Date().toLocaleDateString('es-ES')}</p>
            
            {report?.analyticsData?.generatedBy === 'gemini' && (
              <div className="flex items-center justify-center mt-2 text-purple-600">
                <Gem className="h-4 w-4 mr-1" />
                <span className="text-sm">Generado con Google Gemini AI</span>
              </div>
            )}
          </div>

          {report?.content ? (
            <div className="prose max-w-none">
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: report.content
                    .replace(/^#{2} (.*?)$/gm, '<h2 class="text-2xl font-bold text-blue-600 mt-6 mb-4">$1</h2>')
                    .replace(/^#{3} (.*?)$/gm, '<h3 class="text-xl font-semibold text-purple-600 mt-5 mb-3">$1</h3>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
                    .replace(/\n\n/g, '</p><p class="my-3">')
                    .replace(/\n- (.*?)(?=\n|$)/g, '</p><ul class="list-disc pl-6 my-4"><li>$1</li></ul><p>')
                    .replace(/<\/ul><p><\/p><ul class="list-disc pl-6 my-4">/g, '')
                    .replace(/^<\/p>/, '')
                    .replace(/<p>$/, '')
                }} 
              />
            </div>
          ) : auditResult ? (
            <>
              <ScoreCards auditResult={auditResult} />
              <MetricCards auditResult={auditResult} />
              <SeoDetailsCard auditResult={auditResult} />
              <Recommendations auditResult={auditResult} />
            </>
          ) : (
            <div className="p-6 text-center">
              <AlertCircle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-2">No hay datos disponibles</h3>
              <p className="text-gray-600">No se encontraron datos de análisis para este informe.</p>
            </div>
          )}

          <div className="text-center pt-8 text-sm text-gray-500 print:hidden">
            <p>© {new Date().getFullYear()} SoySeoLocal - Servicio de Análisis SEO</p>
          </div>
        </div>

        {auditResult && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Editor de informe avanzado</h2>
            <AIReportGenerator auditResult={auditResult} currentReport={report} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SeoReport;
