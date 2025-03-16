
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
import { addDocument } from "@/services/documentService";

interface PageSpeedSectionProps {
  clientId: string;
  clientName: string;
}

export const PageSpeedSection = ({ clientId, clientName }: PageSpeedSectionProps) => {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSpeedReport, setPageSpeedReport] = useState<PageSpeedReport | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isGeneratingAIReport, setIsGeneratingAIReport] = useState(false);
  
  // Load saved report on component mount
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
      // Generate report content based on PageSpeed data
      const reportContent = generateReportContent(pageSpeedReport, clientName, url);
      
      // Create a document in the client's documents
      const newDocument = {
        clientId: clientId,
        name: `Informe PageSpeed AI - ${new Date().toLocaleDateString('es-ES')}`,
        type: "text" as "pdf" | "image" | "doc" | "text",
        url: "",
        uploadDate: new Date().toISOString(),
        analyzedStatus: "analyzed" as "pending" | "analyzed" | "processed" | "failed" | "error",
        content: reportContent
      };

      await addDocument(newDocument);
      
      toast.success("Informe AI generado y guardado en documentos");
    } catch (error) {
      console.error("Error generating AI report:", error);
      toast.error("Error al generar el informe AI");
    } finally {
      setIsGeneratingAIReport(false);
    }
  };

  // Helper function to generate report content
  const generateReportContent = (report: PageSpeedReport, clientName: string, url: string): string => {
    const { metrics, audits } = report;
    
    // Get top issues (audits with low scores)
    const topIssues = audits
      .filter(audit => audit.score < 0.7)
      .sort((a, b) => a.score - b.score)
      .slice(0, 5);
    
    // Format performance metrics
    const formatTime = (ms: number): string => {
      return ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(1)}s`;
    };
    
    // Generate the report
    return `# Informe de Rendimiento Web para ${clientName}

## Resumen Ejecutivo
Análisis realizado en: ${url}
Fecha: ${new Date().toLocaleDateString('es-ES')}

### Puntuaciones Generales
- Rendimiento: ${metrics.performance_score}/100
- Accesibilidad: ${metrics.accessibility_score}/100
- Mejores Prácticas: ${metrics.best_practices_score}/100
- SEO: ${metrics.seo_score}/100

## Métricas Clave de Rendimiento
- First Contentful Paint: ${formatTime(metrics.first_contentful_paint)}
- Largest Contentful Paint: ${formatTime(metrics.largest_contentful_paint)}
- Time to Interactive: ${formatTime(metrics.time_to_interactive)}
- Total Blocking Time: ${formatTime(metrics.total_blocking_time)}
- Cumulative Layout Shift: ${metrics.cumulative_layout_shift.toFixed(3)}

## Principales Problemas Identificados
${topIssues.map(issue => `### ${issue.title}\n${issue.description}\n${issue.display_value ? `Valor actual: ${issue.display_value}` : ''}`).join('\n\n')}

## Recomendaciones
${generateRecommendations(report)}

## Conclusión
Este informe identifica las principales áreas de mejora para optimizar el rendimiento y experiencia de usuario del sitio web. Implementar estas recomendaciones ayudará a mejorar las puntuaciones y proporcionar una experiencia más rápida y accesible para los usuarios.`;
  };

  // Generate recommendations based on the report data
  const generateRecommendations = (report: PageSpeedReport): string => {
    const { metrics, audits } = report;
    let recommendations = '';
    
    // Performance recommendations
    if (metrics.performance_score < 90) {
      const performanceIssues = audits
        .filter(audit => audit.score < 0.8 && audit.category === 'performance')
        .slice(0, 3);
      
      if (performanceIssues.length > 0) {
        recommendations += "### Mejoras de Rendimiento\n";
        performanceIssues.forEach(issue => {
          recommendations += `- **${issue.title}**: ${getRecommendation(issue.id)}\n`;
        });
        recommendations += "\n";
      }
    }
    
    // Accessibility recommendations
    if (metrics.accessibility_score < 90) {
      const accessibilityIssues = audits
        .filter(audit => audit.score < 0.8 && audit.category === 'accessibility')
        .slice(0, 3);
      
      if (accessibilityIssues.length > 0) {
        recommendations += "### Mejoras de Accesibilidad\n";
        accessibilityIssues.forEach(issue => {
          recommendations += `- **${issue.title}**: ${getRecommendation(issue.id)}\n`;
        });
        recommendations += "\n";
      }
    }
    
    // SEO recommendations
    if (metrics.seo_score < 90) {
      const seoIssues = audits
        .filter(audit => audit.score < 0.8 && audit.category === 'seo')
        .slice(0, 3);
      
      if (seoIssues.length > 0) {
        recommendations += "### Mejoras de SEO\n";
        seoIssues.forEach(issue => {
          recommendations += `- **${issue.title}**: ${getRecommendation(issue.id)}\n`;
        });
        recommendations += "\n";
      }
    }
    
    return recommendations || "No se han identificado recomendaciones específicas para este sitio.";
  };

  // Get recommendation based on audit ID
  const getRecommendation = (auditId: string): string => {
    const recommendations: Record<string, string> = {
      'render-blocking-resources': 'Eliminar o diferir los recursos que bloquean el renderizado, como scripts y hojas de estilo innecesarios.',
      'uses-optimized-images': 'Optimizar las imágenes para reducir su tamaño sin sacrificar calidad visual.',
      'uses-webp-images': 'Convertir imágenes a formatos modernos como WebP para mejor compresión.',
      'uses-text-compression': 'Habilitar la compresión GZIP o Brotli para reducir el tamaño de transferencia.',
      'uses-responsive-images': 'Implementar imágenes responsivas para diferentes tamaños de pantalla.',
      'first-contentful-paint': 'Optimizar el First Contentful Paint reduciendo el tiempo de carga inicial.',
      'largest-contentful-paint': 'Optimizar el Largest Contentful Paint priorizando la carga de contenido importante.',
      'total-blocking-time': 'Reducir el tiempo que la página está bloqueada para interacciones del usuario.',
      'color-contrast': 'Mejorar el contraste de color para una mejor legibilidad.',
      'document-title': 'Asegurar que el documento tiene un título descriptivo y único.',
      'html-has-lang': 'Añadir un atributo lang al elemento HTML para especificar el idioma.',
      'image-alt': 'Añadir texto alternativo a todas las imágenes para accesibilidad.',
      'meta-viewport': 'Configurar correctamente la etiqueta viewport para dispositivos móviles.',
      'viewport': 'Asegurar que la página tiene una etiqueta viewport configurada correctamente.',
      'meta-description': 'Añadir una meta descripción única y descriptiva.',
      'link-text': 'Usar texto de enlace descriptivo en lugar de textos genéricos.',
      'robots-txt': 'Verificar y optimizar el archivo robots.txt.',
      'canonical': 'Implementar etiquetas canónicas para evitar contenido duplicado.',
    };
    
    return recommendations[auditId] || 'Revisar y optimizar este aspecto según las mejores prácticas.';
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
                  <>Generando Informe...</>
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
