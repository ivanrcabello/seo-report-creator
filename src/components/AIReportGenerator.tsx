
import { useState } from "react";
import { AuditResult } from "@/services/pdfAnalyzer";
import { AIReport, generateAIReport } from "@/services/aiReportService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion } from "@/components/ui/accordion";
import { 
  Loader2, Brain, Share2, Download, Printer, Check, AlertTriangle, Info, 
  FileText, List, ClipboardList, BarChart2, Globe, Target, TrendingUp, Users,
  MessageSquare, Building, Map, FileEdit, Award, BadgeCheck, Mail, Phone,
  Clock, Calendar, Link, FileSearch, Briefcase
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getSeoPacks } from "@/services/packService";
import { useQuery } from "@tanstack/react-query";
import { ReportSection } from "./seo-report/ReportSection";
import { StrategySection } from "./seo-report/StrategySection";

interface AIReportGeneratorProps {
  auditResult: AuditResult;
}

export const AIReportGenerator = ({ auditResult }: AIReportGeneratorProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<AIReport | null>(null);

  // Obtener los paquetes SEO disponibles
  const { data: seoPacks } = useQuery({
    queryKey: ['seoPacks'],
    queryFn: getSeoPacks
  });

  const handleGenerateReport = async () => {
    setIsLoading(true);
    try {
      const generatedReport = await generateAIReport(auditResult);
      setReport(generatedReport);
      toast({
        title: "Informe generado con éxito",
        description: "El informe explicativo ha sido creado basado en los datos del análisis SEO",
      });
    } catch (error) {
      console.error("Error al generar el informe:", error);
      toast({
        title: "Error",
        description: "No se pudo generar el informe. Por favor, inténtelo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareReport = () => {
    toast({
      title: "Compartir informe",
      description: "Función de compartir informe por implementar",
    });
  };

  const handleDownloadReport = () => {
    toast({
      title: "Descargar informe",
      description: "Función de descarga por implementar",
    });
  };

  const handlePrintReport = () => {
    window.print();
    toast({
      title: "Imprimiendo informe",
      description: "El informe se está enviando a la impresora",
    });
  };

  if (!report && !isLoading) {
    return (
      <Card className="mt-8 border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl flex items-center gap-2 text-purple-700">
            <Brain className="w-6 h-6 text-purple-600" />
            Informe Explicativo con IA
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="max-w-md mx-auto space-y-6">
            <div className="p-6 bg-purple-50 rounded-xl border border-purple-100">
              <FileText className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <p className="text-gray-700 mb-2 font-medium">
                Genera un informe detallado con explicaciones personalizadas para tu cliente
              </p>
              <p className="text-gray-600 text-sm mb-4">
                Basado en los resultados del análisis, la IA creará recomendaciones específicas y explicaciones claras.
              </p>
            </div>
            <Button 
              onClick={handleGenerateReport} 
              className="bg-purple-600 hover:bg-purple-700 py-6 px-8 gap-2 shadow-md"
              size="lg"
            >
              <Brain className="w-5 h-5" />
              Generar Informe Explicativo
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="mt-8 border-2 border-purple-100 bg-white">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <Loader2 className="h-14 w-14 text-purple-500 animate-spin mb-6" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="h-6 w-6 text-purple-700" />
            </div>
          </div>
          <p className="text-xl font-medium text-purple-700 mb-3">Generando informe personalizado...</p>
          <p className="text-gray-500 max-w-md text-center">
            Estamos analizando los datos, identificando puntos clave y creando recomendaciones específicas para tus clientes
          </p>
          <div className="w-full max-w-sm bg-gray-100 h-2 rounded-full mt-6 overflow-hidden">
            <div className="bg-purple-600 h-2 animate-pulse" style={{ width: "60%" }}></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Tags for strengths and weaknesses
  const strengthsColors = [
    "bg-green-100 text-green-800 border-green-200",
    "bg-emerald-100 text-emerald-800 border-emerald-200",
    "bg-teal-100 text-teal-800 border-teal-200"
  ];
  
  const weaknessesColors = [
    "bg-red-100 text-red-800 border-red-200",
    "bg-orange-100 text-orange-800 border-orange-200",
    "bg-amber-100 text-amber-800 border-amber-200"
  ];

  // Función para determinar el color según la puntuación
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <Card className="mt-8 print:mt-4 print:shadow-none border-2 border-purple-100">
      <CardHeader className="border-b pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2 text-purple-700">
            <Brain className="w-6 h-6 text-purple-600" />
            Informe Explicativo para el Cliente
          </CardTitle>
          <div className="flex gap-2 print:hidden">
            <Button variant="outline" size="sm" onClick={handleShareReport} className="gap-1">
              <Share2 className="w-4 h-4" /> Compartir
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadReport} className="gap-1">
              <Download className="w-4 h-4" /> Descargar
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrintReport} className="gap-1">
              <Printer className="w-4 h-4" /> Imprimir
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="complete" className="w-full">
          <TabsList className="w-full mb-6 grid grid-cols-5 print:hidden">
            <TabsTrigger value="complete" className="flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> Informe Completo
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4" /> Análisis Web
            </TabsTrigger>
            <TabsTrigger value="keywords" className="flex items-center gap-1.5">
              <FileSearch className="w-4 h-4" /> Palabras Clave
            </TabsTrigger>
            <TabsTrigger value="strategy" className="flex items-center gap-1.5">
              <Target className="w-4 h-4" /> Estrategia
            </TabsTrigger>
            <TabsTrigger value="plans" className="flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Planes y Tarifas
            </TabsTrigger>
          </TabsList>
          
          {/* INFORME COMPLETO */}
          <TabsContent value="complete" className="space-y-8 animate-fadeIn">
            {/* 1. INTRODUCCIÓN */}
            <ReportSection 
              title="Introducción" 
              icon={<Building className="w-6 h-6" />}
              gradientFrom="from-purple-50"
              gradientTo="to-white"
              borderColor="border-purple-100"
              titleColor="text-purple-700"
            >
              <div className="prose max-w-none text-gray-700">
                <p className="text-lg leading-relaxed">{report.companyIntroduction}</p>
              </div>
            </ReportSection>
            
            {/* 2. ANÁLISIS ACTUAL DE LA WEB */}
            <ReportSection
              title="Análisis Actual de la Web"
              icon={<BarChart2 className="w-6 h-6" />}
              gradientFrom="from-blue-50"
              gradientTo="to-white"
              borderColor="border-blue-100"
              titleColor="text-blue-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Authority Score</span>
                    <span className={`text-xl font-bold ${getScoreColor(report.webAnalysis.authorityScore)}`}>
                      {report.webAnalysis.authorityScore}/100
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {report.webAnalysis.authorityScore > 70 ? "Excelente autoridad de dominio" :
                      report.webAnalysis.authorityScore > 50 ? "Buena autoridad, con potencial de mejora" :
                      "Necesita mejorar la autoridad de dominio"}
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Tráfico Orgánico</span>
                    <span className="text-xl font-bold text-blue-600">
                      {report.webAnalysis.organicTraffic}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    visitas mensuales estimadas
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Keywords Posicionadas</span>
                    <span className="text-xl font-bold text-green-600">
                      {report.webAnalysis.keywordsRanked}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    con potencial para triplicar este número
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Backlinks</span>
                    <span className="text-xl font-bold text-indigo-600">
                      {report.webAnalysis.backlinks}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    calidad: {report.webAnalysis.qualityScore}/100
                  </p>
                </div>
              </div>
              
              {/* Tabla de palabras clave prioritarias */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Palabras Clave Prioritarias</h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Palabra Clave</TableHead>
                        <TableHead className="text-right">Posición</TableHead>
                        <TableHead className="text-right">Volumen</TableHead>
                        <TableHead className="text-right">Dificultad</TableHead>
                        <TableHead>Recomendación</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {report.webAnalysis.priorityKeywords.map((keyword, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{keyword.keyword}</TableCell>
                          <TableCell className="text-right">{keyword.position}</TableCell>
                          <TableCell className="text-right">{keyword.volume}/mes</TableCell>
                          <TableCell className="text-right">{keyword.difficulty}/100</TableCell>
                          <TableCell className="text-sm">{keyword.recommendation}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              {/* Comparativa con competidores */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">Comparativa con Competidores</h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Competidor</TableHead>
                        <TableHead className="text-right">Score</TableHead>
                        <TableHead className="text-right">Tráfico</TableHead>
                        <TableHead className="text-right">Keywords</TableHead>
                        <TableHead>Comparativa</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {report.webAnalysis.competitors.map((competitor, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{competitor.name}</TableCell>
                          <TableCell className="text-right">{competitor.score}</TableCell>
                          <TableCell className="text-right">{competitor.traffic}</TableCell>
                          <TableCell className="text-right">{competitor.keywords}</TableCell>
                          <TableCell className="text-sm">{competitor.comparison}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell className="font-medium">Su web</TableCell>
                        <TableCell className="text-right">{report.webAnalysis.authorityScore}</TableCell>
                        <TableCell className="text-right">{report.webAnalysis.organicTraffic}</TableCell>
                        <TableCell className="text-right">{report.webAnalysis.keywordsRanked}</TableCell>
                        <TableCell className="text-sm">-</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </ReportSection>
            
            {/* 3. ESTRATEGIA PROPUESTA */}
            <ReportSection
              title="Estrategia Propuesta"
              icon={<Target className="w-6 h-6" />}
              gradientFrom="from-green-50"
              gradientTo="to-white"
              borderColor="border-green-100"
              titleColor="text-green-700"
            >
              <Accordion type="single" collapsible className="w-full">
                <StrategySection
                  strategy={report.strategy}
                  title="Optimización Técnica y On-Page"
                  icon={<Info className="h-5 w-5 text-green-600" />}
                  strategyType="technicalOptimization"
                  iconColor="text-green-500"
                />
                
                <StrategySection
                  strategy={report.strategy}
                  title="SEO Local y Geolocalización"
                  icon={<Map className="h-5 w-5 text-green-600" />}
                  strategyType="localSeo"
                  iconColor="text-green-500"
                />
                
                <StrategySection
                  strategy={report.strategy}
                  title="Creación de Contenido y Blog"
                  icon={<FileEdit className="h-5 w-5 text-green-600" />}
                  strategyType="contentCreation"
                  iconColor="text-green-500"
                />
                
                <StrategySection
                  strategy={report.strategy}
                  title="Estrategia de Linkbuilding"
                  icon={<Link className="h-5 w-5 text-green-600" />}
                  strategyType="linkBuilding"
                  iconColor="text-green-500"
                />
              </Accordion>
            </ReportSection>
            
            {/* 4. MÉTRICAS Y KPIs */}
            <ReportSection
              title="Métricas y KPIs"
              icon={<TrendingUp className="w-6 h-6" />}
              gradientFrom="from-cyan-50"
              gradientTo="to-white"
              borderColor="border-cyan-100"
              titleColor="text-cyan-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="text-cyan-500 h-5 w-5" />
                    <h3 className="font-medium">Tráfico Orgánico</h3>
                  </div>
                  <p className="text-gray-700">{report.metrics.trafficIncrease}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="text-cyan-500 h-5 w-5" />
                    <h3 className="font-medium">Posicionamiento</h3>
                  </div>
                  <p className="text-gray-700">{report.metrics.positionImprovement}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="text-cyan-500 h-5 w-5" />
                    <h3 className="font-medium">Conversiones</h3>
                  </div>
                  <p className="text-gray-700">{report.metrics.conversionIncrease}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="text-cyan-500 h-5 w-5" />
                    <h3 className="font-medium">Cronograma</h3>
                  </div>
                  <p className="text-gray-700">{report.metrics.timeframe}</p>
                </div>
              </div>
            </ReportSection>
            
            {/* 5. CRONOGRAMA */}
            <ReportSection
              title="Cronograma y Próximos Pasos"
              icon={<Calendar className="w-6 h-6" />}
              gradientFrom="from-orange-50"
              gradientTo="to-white"
              borderColor="border-orange-100"
              titleColor="text-orange-700"
            >
              <div className="space-y-4">
                {report.cronogram && Object.entries(report.cronogram).map(([key, value], idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center mt-0.5">
                      <span className="text-orange-700 text-sm font-bold">{idx + 1}</span>
                    </div>
                    <div>
                      <p className="text-gray-700">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ReportSection>
            
            {/* 6. PLANES DE TARIFAS */}
            <ReportSection
              title="Planes de Tarifas"
              icon={<Award className="w-6 h-6" />}
              gradientFrom="from-indigo-50"
              gradientTo="to-white"
              borderColor="border-indigo-100"
              titleColor="text-indigo-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {seoPacks && seoPacks.map((pack, idx) => (
                  <div key={pack.id} className={`bg-white rounded-xl shadow-md border ${idx === 1 ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-gray-200'}`}>
                    <div className={`p-5 border-b ${idx === 1 ? 'bg-indigo-50' : ''}`}>
                      <h3 className="text-xl font-bold text-gray-800">{pack.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{pack.description}</p>
                    </div>
                    <div className="p-5">
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-indigo-600">{pack.price}€</span>
                        <span className="text-gray-500 text-sm">/mes</span>
                      </div>
                      <ul className="space-y-3 mb-6">
                        {pack.features.map((feature, fidx) => (
                          <li key={fidx} className="flex items-start gap-2 text-sm">
                            <BadgeCheck className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button className={`w-full ${idx === 1 ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-800 hover:bg-gray-900'}`}>
                        Seleccionar Plan
                      </Button>
                    </div>
                  </div>
                ))}
                
                {(!seoPacks || seoPacks.length === 0) && (
                  <div className="col-span-3 text-center p-10 bg-gray-50 rounded-lg border border-gray-200">
                    <p>No hay planes disponibles actualmente. Por favor, contacte con nosotros para obtener un presupuesto personalizado.</p>
                  </div>
                )}
              </div>
            </ReportSection>
            
            {/* 7. CONCLUSIÓN Y SIGUIENTES PASOS */}
            <ReportSection
              title="Conclusión y Siguientes Pasos"
              icon={<Briefcase className="w-6 h-6" />}
              gradientFrom="from-amber-50"
              gradientTo="to-white"
              borderColor="border-amber-100"
              titleColor="text-amber-700"
            >
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">{report.conclusion}</p>
                
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 mb-4">
                  <p className="flex items-center gap-2 text-amber-800 font-medium">
                    <Info className="h-5 w-5" />
                    Resultados estimados: a partir del {report.estimatedResultsTime}er mes
                  </p>
                </div>
              </div>
            </ReportSection>
            
            {/* DATOS DE CONTACTO */}
            <section className="bg-slate-800 text-white p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" /> Datos de Contacto
              </h2>
              <div className="space-y-3">
                {report.contactInfo.responsiblePerson && (
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-amber-400" />
                    <span>{report.contactInfo.responsiblePerson}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-amber-400" />
                  <span>{report.contactInfo.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-amber-400" />
                  <span>{report.contactInfo.phone}</span>
                </div>
              </div>
            </section>
          </TabsContent>
          
          {/* PESTAÑA ANÁLISIS WEB (Versión resumida) */}
          <TabsContent value="analysis" className="space-y-6 animate-fadeIn">
            <div className="p-6 rounded-xl bg-white border border-blue-100">
              <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center gap-2">
                <BarChart2 className="w-5 h-5" /> Resumen del Análisis
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">Fortalezas</h3>
                  <ul className="space-y-2">
                    {report.strengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-red-800 mb-2">Debilidades</h3>
                  <ul className="space-y-2">
                    {report.weaknesses.map((weakness, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Authority Score</span>
                    <span className={`text-xl font-bold ${getScoreColor(report.webAnalysis.authorityScore)}`}>
                      {report.webAnalysis.authorityScore}/100
                    </span>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Tráfico Orgánico</span>
                    <span className="text-xl font-bold text-blue-600">
                      {report.webAnalysis.organicTraffic}
                    </span>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Keywords</span>
                    <span className="text-xl font-bold text-green-600">
                      {report.webAnalysis.keywordsRanked}
                    </span>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Backlinks</span>
                    <span className="text-xl font-bold text-indigo-600">
                      {report.webAnalysis.backlinks}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Comparativa con competidores */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">Comparativa con Competidores</h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Competidor</TableHead>
                        <TableHead className="text-right">Score</TableHead>
                        <TableHead className="text-right">Tráfico</TableHead>
                        <TableHead className="text-right">Keywords</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {report.webAnalysis.competitors.map((competitor, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{competitor.name}</TableCell>
                          <TableCell className="text-right">{competitor.score}</TableCell>
                          <TableCell className="text-right">{competitor.traffic}</TableCell>
                          <TableCell className="text-right">{competitor.keywords}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-blue-50">
                        <TableCell className="font-medium">Su web</TableCell>
                        <TableCell className="text-right">{report.webAnalysis.authorityScore}</TableCell>
                        <TableCell className="text-right">{report.webAnalysis.organicTraffic}</TableCell>
                        <TableCell className="text-right">{report.webAnalysis.keywordsRanked}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* PESTAÑA PALABRAS CLAVE */}
          <TabsContent value="keywords" className="space-y-6 animate-fadeIn">
            <div className="p-6 rounded-xl bg-white border border-green-100">
              <h2 className="text-xl font-semibold text-green-700 mb-4 flex items-center gap-2">
                <FileSearch className="w-5 h-5" /> Análisis de Palabras Clave
              </h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Palabras Clave Prioritarias</h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Palabra Clave</TableHead>
                        <TableHead className="text-right">Posición</TableHead>
                        <TableHead className="text-right">Volumen</TableHead>
                        <TableHead className="text-right">Dificultad</TableHead>
                        <TableHead>Recomendación</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {report.webAnalysis.priorityKeywords.map((keyword, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{keyword.keyword}</TableCell>
                          <TableCell className="text-right">{keyword.position}</TableCell>
                          <TableCell className="text-right">{keyword.volume}/mes</TableCell>
                          <TableCell className="text-right">{keyword.difficulty}/100</TableCell>
                          <TableCell className="text-sm">{keyword.recommendation}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <h3 className="text-lg font-medium text-green-800 mb-3">Recomendaciones para Keywords</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span>Optimiza las páginas de servicios principales con keywords específicas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span>Crea contenido de blog orientado a keywords de cola larga con menor competencia</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span>Incluye keywords locales en todos los títulos y metadescripciones relevantes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span>Revisa y mejora el contenido existente para incluir variaciones de keywords</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                  <h3 className="text-lg font-medium text-amber-800 mb-3">Oportunidades de Keywords</h3>
                  <p className="mb-3">Además de las keywords principales, hemos identificado oportunidades en:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Target className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                      <span>Keywords de intención informativa para atraer tráfico en etapas iniciales</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Target className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                      <span>Keywords con modificadores locales para captar búsquedas geográficas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Target className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                      <span>Keywords de productos/servicios específicos con mayor intención de compra</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* PESTAÑA ESTRATEGIA */}
          <TabsContent value="strategy" className="space-y-6 animate-fadeIn">
            <div className="p-6 rounded-xl bg-white border border-green-100">
              <h2 className="text-xl font-semibold text-green-700 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" /> Estrategia Propuesta
              </h2>
              
              <div className="space-y-6">
                <div className="p-5 bg-green-50 rounded-lg border border-green-100">
                  <h3 className="text-lg font-medium text-green-800 mb-3 flex items-center gap-2">
                    <Info className="h-5 w-5" /> Optimización Técnica y On-Page
                  </h3>
                  <ul className="space-y-2">
                    {report.strategy.technicalOptimization.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-5 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="text-lg font-medium text-blue-800 mb-3 flex items-center gap-2">
                    <Map className="h-5 w-5" /> SEO Local y Geolocalización
                  </h3>
                  <ul className="space-y-2">
                    {report.strategy.localSeo.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-5 bg-purple-50 rounded-lg border border-purple-100">
                  <h3 className="text-lg font-medium text-purple-800 mb-3 flex items-center gap-2">
                    <FileEdit className="h-5 w-5" /> Creación de Contenido y Blog
                  </h3>
                  <ul className="space-y-2">
                    {report.strategy.contentCreation.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {report.strategy.linkBuilding && (
                  <div className="p-5 bg-indigo-50 rounded-lg border border-indigo-100">
                    <h3 className="text-lg font-medium text-indigo-800 mb-3 flex items-center gap-2">
                      <Link className="h-5 w-5" /> Estrategia de Linkbuilding
                    </h3>
                    <ul className="space-y-2">
                      {report.strategy.linkBuilding.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="p-5 bg-amber-50 rounded-lg border border-amber-100">
                  <h3 className="text-lg font-medium text-amber-800 mb-3 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" /> Resultados Esperados
                  </h3>
                  <p className="mb-3">{report.conclusion}</p>
                  <div className="flex items-center gap-2 text-amber-800 font-medium">
                    <Info className="h-5 w-5" />
                    Resultados visibles a partir del {report.estimatedResultsTime}er mes
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* PESTAÑA PLANES */}
          <TabsContent value="plans" className="space-y-6 animate-fadeIn">
            <div className="p-6 rounded-xl bg-white border border-indigo-100">
              <h2 className="text-xl font-semibold text-indigo-700 mb-6 flex items-center gap-2">
                <Award className="w-5 h-5" /> Planes de Tarifas Recomendados
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {seoPacks && seoPacks.map((pack, idx) => (
                  <div key={pack.id} className={`bg-white rounded-xl shadow-md border ${idx === 1 ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-gray-200'}`}>
                    <div className={`p-5 border-b ${idx === 1 ? 'bg-indigo-50' : ''}`}>
                      <h3 className="text-xl font-bold text-gray-800">{pack.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{pack.description}</p>
                    </div>
                    <div className="p-5">
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-indigo-600">{pack.price}€</span>
                        <span className="text-gray-500 text-sm">/mes</span>
                      </div>
                      <ul className="space-y-3 mb-6">
                        {pack.features.map((feature, fidx) => (
                          <li key={fidx} className="flex items-start gap-2 text-sm">
                            <BadgeCheck className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button className={`w-full ${idx === 1 ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-800 hover:bg-gray-900'}`}>
                        Seleccionar Plan
                      </Button>
                    </div>
                  </div>
                ))}
                
                {(!seoPacks || seoPacks.length === 0) && (
                  <div className="col-span-3 text-center p-10 bg-gray-50 rounded-lg border border-gray-200">
                    <p>No hay planes disponibles actualmente. Por favor, contacte con nosotros para obtener un presupuesto personalizado.</p>
                  </div>
                )}
              </div>
              
              <div className="mt-8 p-5 bg-indigo-50 rounded-lg border border-indigo-100">
                <h3 className="text-lg font-medium text-indigo-800 mb-3">Nuestra Recomendación</h3>
                <p className="mb-4">{report.conclusion}</p>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-indigo-600" />
                    <span>{report.contactInfo.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-indigo-600" />
                    <span>{report.contactInfo.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-4 print:hidden">
        <p className="text-sm text-gray-500 italic">
          Informe generado con asistencia de IA basado en el análisis SEO del sitio web.
        </p>
      </CardFooter>
    </Card>
  );
};
