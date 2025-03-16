import { useState, useEffect } from "react";
import { AIReport, generateAIReport } from "@/services/aiReportService";
import { AuditResult } from "@/services/pdfAnalyzer";
import { Button } from "@/components/ui/button";
import {
  FileText,
  BarChart,
  Globe,
  Settings,
  FileCode,
  Link,
  Edit,
  Download,
  Clock,
  ArrowRight,
  RefreshCcw,
  CheckCircle,
  Phone,
  Mail,
  Save,
} from "lucide-react";
import { ReportSection } from "@/components/seo-report/ReportSection";
import { Accordion } from "@/components/ui/accordion";
import { StrategySection } from "@/components/seo-report/StrategySection";
import { EditableReportForm } from "@/components/seo-report/EditableReportForm";
import { downloadSeoReportPdf } from "@/services/seoReportPdfService";
import { useToast } from "@/components/ui/use-toast";
import { saveReportWithAIData } from "@/services/reportService";
import { ClientReport } from "@/types/client";
import { generateSEOReport } from "@/services/openaiService";
import { toast } from "sonner";

interface AIReportGeneratorProps {
  auditResult: AuditResult;
  currentReport?: ClientReport | null;
}

export const AIReportGenerator = ({ auditResult, currentReport }: AIReportGeneratorProps) => {
  const [report, setReport] = useState<AIReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isGeneratingOpenAI, setIsGeneratingOpenAI] = useState(false);
  const { toast } = useToast();

  // Load report data from currentReport if it exists
  useEffect(() => {
    if (currentReport?.analyticsData?.aiReport) {
      setReport(currentReport.analyticsData.aiReport);
    }
  }, [currentReport]);

  const generateReport = async () => {
    setIsLoading(true);
    try {
      const data = await generateAIReport(auditResult);
      setReport(data);
    } catch (error) {
      console.error("Error generando el informe:", error);
      toast({
        title: "Error",
        description: "No se pudo generar el informe. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateAdvancedReport = async () => {
    setIsGeneratingOpenAI(true);
    toast({
      title: "Generando informe avanzado",
      description: "Creando informe detallado con IA avanzada...",
    });
    
    try {
      const content = await generateSEOReport(auditResult);
      if (content && report) {
        // Update the report content
        const updatedReport = {
          ...report,
          content: content
        };
        setReport(updatedReport);
        
        // If we have a current report, save the content to it
        if (currentReport) {
          await saveReportWithAIData(currentReport, updatedReport);
        }
        
        toast({
          title: "Informe generado",
          description: "El informe avanzado se ha generado con éxito",
        });
      } else {
        toast({
          title: "Error",
          description: "No se pudo generar el informe avanzado",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generando informe avanzado:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al generar el informe avanzado",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingOpenAI(false);
    }
  };

  const handleSaveReport = async () => {
    if (!report || !currentReport) return;
    
    setIsSaving(true);
    try {
      await saveReportWithAIData(currentReport, report);
      toast({
        title: "Informe guardado",
        description: "El informe se ha guardado correctamente.",
      });
    } catch (error) {
      console.error("Error saving report:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar el informe. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!report || !report.id) return;
    
    try {
      const success = await downloadSeoReportPdf(report.id);
      if (success) {
        toast({
          title: "PDF generado",
          description: "El informe se ha descargado correctamente.",
        });
      } else {
        throw new Error("Error al descargar el PDF");
      }
    } catch (error) {
      console.error("Error descargando PDF:", error);
      toast({
        title: "Error",
        description: "No se pudo descargar el PDF. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleSaveEdits = (updatedReport: AIReport) => {
    setReport(updatedReport);
    setIsEditMode(false);
  };

  if (isEditMode && report) {
    return (
      <EditableReportForm 
        initialReport={report} 
        onSave={handleSaveEdits} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-indigo-900 mb-3">Análisis Inteligente SEO</h2>
        <p className="text-gray-700 mb-4">
          Genera un informe SEO profesional con recomendaciones personalizadas basadas en el análisis de esta página web. Podrás editarlo y descargarlo en PDF para enviar a tus clientes.
        </p>
        <div className="flex flex-wrap gap-3">
          {!report && (
            <Button 
              onClick={generateReport} 
              disabled={isLoading} 
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCcw className="h-4 w-4 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Generar Informe SEO
                </>
              )}
            </Button>
          )}
          
          {report && (
            <>
              <Button 
                variant="outline" 
                onClick={generateReport} 
                disabled={isLoading} 
                className="gap-2"
              >
                <RefreshCcw className="h-4 w-4" />
                Regenerar
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setIsEditMode(true)} 
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                Editar Informe
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleDownloadPdf} 
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Descargar PDF
              </Button>

              <Button 
                variant="outline" 
                onClick={generateAdvancedReport} 
                disabled={isGeneratingOpenAI} 
                className="gap-2"
              >
                {isGeneratingOpenAI ? (
                  <>
                    <RefreshCcw className="h-4 w-4 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-4 w-4" />
                    Informe Avanzado con IA
                  </>
                )}
              </Button>

              {currentReport && (
                <Button 
                  variant="default" 
                  onClick={handleSaveReport} 
                  disabled={isSaving}
                  className="gap-2"
                >
                  {isSaving ? (
                    <>
                      <RefreshCcw className="h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Guardar en Informe
                    </>
                  )}
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {report && !isLoading && (
        <div className="space-y-8 print:space-y-6">
          {report.content ? (
            <div className="prose max-w-none">
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: report.content
                    .replace(/^#{2} (.*?)$/gm, '<h2 class="text-2xl font-bold text-seo-blue mt-6 mb-4">$1</h2>')
                    .replace(/^#{3} (.*?)$/gm, '<h3 class="text-xl font-semibold text-seo-purple mt-5 mb-3">$1</h3>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
                    .replace(/\n\n/g, '</p><p class="my-3">')
                    .replace(/\n- (.*?)(?=\n|$)/g, '</p><ul class="list-disc pl-6 my-4"><li>$1</li></ul><p>')
                    .replace(/<\/ul><p><\/p><ul class="list-disc pl-6 my-4">/g, '')
                    .replace(/^<\/p>/, '')
                    .replace(/<p>$/, '')
                }} 
              />
            </div>
          ) : (
            <>
              {/* Introducción */}
              <ReportSection
                title="Introducción"
                icon={<FileText className="h-5 w-5 text-blue-600" />}
                gradientFrom="from-blue-50"
                gradientTo="to-blue-50/30"
                titleColor="text-blue-800"
                borderColor="border-blue-200"
              >
                <p className="text-gray-700 leading-relaxed">{report.introduction}</p>
              </ReportSection>

              {/* Análisis Actual */}
              <ReportSection
                title="Análisis Actual de la Web"
                icon={<BarChart className="h-5 w-5 text-purple-600" />}
                gradientFrom="from-purple-50"
                gradientTo="to-purple-50/30"
                titleColor="text-purple-800"
                borderColor="border-purple-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-3 w-3 bg-purple-500 rounded-full"></div>
                      <h3 className="font-medium text-purple-900">Authority Score</h3>
                    </div>
                    <p className="text-3xl font-bold text-purple-700">{report.authorityScore}<span className="text-sm text-gray-500">/100</span></p>
                    <p className="text-sm text-gray-600 mt-1">{report.authorityScoreComment}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                      <h3 className="font-medium text-blue-900">Tráfico Orgánico</h3>
                    </div>
                    <p className="text-3xl font-bold text-blue-700">{report.organicTraffic} <span className="text-sm text-gray-500">visitas/mes</span></p>
                    <p className="text-sm text-gray-600 mt-1">{report.organicTrafficComment}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-green-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                      <h3 className="font-medium text-green-900">Palabras Clave</h3>
                    </div>
                    <p className="text-3xl font-bold text-green-700">{report.keywordsPositioned}</p>
                    <p className="text-sm text-gray-600 mt-1">{report.keywordsComment}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-amber-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-3 w-3 bg-amber-500 rounded-full"></div>
                      <h3 className="font-medium text-amber-900">Backlinks</h3>
                    </div>
                    <p className="text-3xl font-bold text-amber-700">{report.backlinksCount}</p>
                    <p className="text-sm text-gray-600 mt-1">{report.backlinksComment}</p>
                  </div>
                </div>

                {report.priorityKeywords && report.priorityKeywords.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Palabras Clave Prioritarias</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-purple-50">
                            <th className="px-4 py-2 text-left text-purple-900 font-medium">Palabra Clave</th>
                            <th className="px-4 py-2 text-left text-purple-900 font-medium">Posición</th>
                            <th className="px-4 py-2 text-left text-purple-900 font-medium">Volumen</th>
                            <th className="px-4 py-2 text-left text-purple-900 font-medium">Dificultad</th>
                            <th className="px-4 py-2 text-left text-purple-900 font-medium">Recomendación</th>
                          </tr>
                        </thead>
                        <tbody>
                          {report.priorityKeywords.map((keyword, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <td className="border px-4 py-2 font-medium">{keyword.keyword}</td>
                              <td className="border px-4 py-2">{keyword.position}</td>
                              <td className="border px-4 py-2">{keyword.volume}</td>
                              <td className="border px-4 py-2">{keyword.difficulty}/100</td>
                              <td className="border px-4 py-2 text-sm">{keyword.recommendation}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {report.competitors && report.competitors.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Comparativa con Competidores</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-purple-50">
                            <th className="px-4 py-2 text-left text-purple-900 font-medium">Competidor</th>
                            <th className="px-4 py-2 text-left text-purple-900 font-medium">Tráfico</th>
                            <th className="px-4 py-2 text-left text-purple-900 font-medium">Keywords</th>
                            <th className="px-4 py-2 text-left text-purple-900 font-medium">Backlinks</th>
                            <th className="px-4 py-2 text-left text-purple-900 font-medium">Análisis</th>
                          </tr>
                        </thead>
                        <tbody>
                          {report.competitors.map((competitor, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <td className="border px-4 py-2 font-medium">{competitor.name}</td>
                              <td className="border px-4 py-2">{competitor.trafficScore}</td>
                              <td className="border px-4 py-2">{competitor.keywordsCount}</td>
                              <td className="border px-4 py-2">{competitor.backlinksCount}</td>
                              <td className="border px-4 py-2 text-sm">{competitor.analysis}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </ReportSection>

              {/* Estrategia Propuesta */}
              <ReportSection
                title="Estrategia Propuesta"
                icon={<Globe className="h-5 w-5 text-green-600" />}
                gradientFrom="from-green-50"
                gradientTo="to-green-50/30"
                titleColor="text-green-800"
                borderColor="border-green-200"
              >
                <Accordion type="multiple" className="w-full">
                  <StrategySection 
                    strategy={report.strategy} 
                    title="Optimización Técnica y On-Page" 
                    icon={<Settings className="h-5 w-5 text-blue-600" />}
                    strategyType="technicalOptimization"
                    iconColor="text-blue-500"
                  />
                  
                  <StrategySection 
                    strategy={report.strategy} 
                    title="SEO Local y Geolocalización" 
                    icon={<Globe className="h-5 w-5 text-green-600" />}
                    strategyType="localSeo"
                    iconColor="text-green-500"
                  />
                  
                  <StrategySection 
                    strategy={report.strategy} 
                    title="Creación de Contenido y Blog" 
                    icon={<FileCode className="h-5 w-5 text-purple-600" />}
                    strategyType="contentCreation"
                    iconColor="text-purple-500"
                  />
                  
                  <StrategySection 
                    strategy={report.strategy} 
                    title="Estrategia de Linkbuilding" 
                    icon={<Link className="h-5 w-5 text-amber-600" />}
                    strategyType="linkBuilding"
                    iconColor="text-amber-500"
                  />
                </Accordion>
              </ReportSection>

              {/* Planes de Tarifas */}
              <ReportSection
                title="Planes de Tarifas"
                icon={<FileText className="h-5 w-5 text-indigo-600" />}
                gradientFrom="from-indigo-50"
                gradientTo="to-indigo-50/30"
                titleColor="text-indigo-800"
                borderColor="border-indigo-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {report.packages && report.packages.map((pack, idx) => (
                    <div key={idx} className="bg-white rounded-lg border border-indigo-100 shadow-sm overflow-hidden">
                      <div className="bg-indigo-50 p-4 border-b border-indigo-100">
                        <h3 className="text-xl font-semibold text-indigo-900">{pack.name}</h3>
                        <p className="text-3xl font-bold text-indigo-700 mt-2">{pack.price}€<span className="text-sm font-normal text-gray-500">/mes</span></p>
                      </div>
                      <div className="p-4">
                        <ul className="space-y-2">
                          {pack.features.map((feature, fidx) => (
                            <li key={fidx} className="flex items-start gap-2">
                              <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                              <span className="text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </ReportSection>

              {/* Conclusión y Cronograma */}
              <ReportSection
                title="Conclusión y Siguientes Pasos"
                icon={<Clock className="h-5 w-5 text-amber-600" />}
                gradientFrom="from-amber-50"
                gradientTo="to-amber-50/30"
                titleColor="text-amber-800"
                borderColor="border-amber-200"
              >
                <p className="text-gray-700 leading-relaxed mb-6">{report.conclusion}</p>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Cronograma Estimado</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 text-amber-800 font-medium px-3 py-2 rounded-md text-sm w-24 text-center shrink-0">Mes 1</div>
                    <div className="bg-white border border-gray-200 rounded-md p-3 flex-1">
                      <p className="text-gray-700">Auditoría completa e implementación de cambios técnicos iniciales.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 text-amber-800 font-medium px-3 py-2 rounded-md text-sm w-24 text-center shrink-0">Mes 2-3</div>
                    <div className="bg-white border border-gray-200 rounded-md p-3 flex-1">
                      <p className="text-gray-700">Optimización de contenido existente y creación de nuevo contenido optimizado.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 text-amber-800 font-medium px-3 py-2 rounded-md text-sm w-24 text-center shrink-0">Mes 4-6</div>
                    <div className="bg-white border border-gray-200 rounded-md p-3 flex-1">
                      <p className="text-gray-700">Primeros resultados visibles. Implementación de estrategias de linkbuilding.</p>
                    </div>
                  </div>
                </div>
              </ReportSection>

              {/* Contacto */}
              <ReportSection
                title="Contacto"
                icon={<Phone className="h-5 w-5 text-gray-600" />}
                gradientFrom="from-gray-50"
                gradientTo="to-gray-50/30"
                titleColor="text-gray-800"
                borderColor="border-gray-200"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-indigo-600" />
                    <a href={`mailto:${report.contactEmail}`} className="text-indigo-600 hover:underline">
                      {report.contactEmail || "info@empresa.com"}
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-indigo-600" />
                    <a href={`tel:${report.contactPhone}`} className="text-indigo-600 hover:underline">
                      {report.contactPhone || "+34 123 456 789"}
                    </a>
                  </div>
                </div>
              </ReportSection>
            </>
          )}
        </div>
      )}
    </div>
  );
};
