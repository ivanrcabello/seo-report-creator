
import { useState } from "react";
import { AuditResult } from "@/services/pdfAnalyzer";
import { AIReport, generateAIReport } from "@/services/aiReportService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Loader2, Brain, Share2, Download, Printer, Check, AlertTriangle, Info, FileText, List, ClipboardList } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface AIReportGeneratorProps {
  auditResult: AuditResult;
}

export const AIReportGenerator = ({ auditResult }: AIReportGeneratorProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<AIReport | null>(null);

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
        <Tabs defaultValue="client" className="w-full">
          <TabsList className="w-full mb-6 grid grid-cols-3 print:hidden">
            <TabsTrigger value="client" className="flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> Explicación Cliente
            </TabsTrigger>
            <TabsTrigger value="technical" className="flex items-center gap-1.5">
              <Info className="w-4 h-4" /> Detalles Técnicos
            </TabsTrigger>
            <TabsTrigger value="actionable" className="flex items-center gap-1.5">
              <ClipboardList className="w-4 h-4" /> Plan de Acción
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="client" className="space-y-4 animate-fadeIn">
            <div className="prose max-w-none">
              <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 mb-6">
                <h3 className="text-xl font-semibold text-purple-700 mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5" /> Resumen para el Cliente
                </h3>
                <p className="text-gray-700 text-lg">{report?.summary}</p>
              </div>
              
              <div className="space-y-6">
                {report?.clientExplanation.split('\n\n').map((paragraph, index) => (
                  <p key={index} className={`text-gray-700 ${paragraph.trim().startsWith('-') ? "ml-4 pl-4 border-l-4 border-purple-200" : ""}`}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="technical" className="space-y-4 animate-fadeIn">
            <div className="prose max-w-none">
              <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 mb-6">
                <h3 className="text-xl font-semibold text-blue-700 mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5" /> Análisis Técnico
                </h3>
                <p className="text-gray-700 leading-relaxed">{report?.summary}</p>
              </div>
              
              <div className="space-y-8">
                {report?.technicalExplanation.split('\n\n').map((paragraph, index) => (
                  <div key={index} className="group">
                    {paragraph.includes(':') ? (
                      <div className="p-5 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-lg font-semibold mb-3 text-blue-700">{paragraph.split(':')[0]}</h3>
                        <p className="text-gray-700">{paragraph.split(':').slice(1).join(':')}</p>
                      </div>
                    ) : (
                      <p className="text-gray-700">{paragraph}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="actionable" className="space-y-6 animate-fadeIn">
            <div>
              <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-white border border-green-100 mb-6">
                <h3 className="text-xl font-semibold text-green-700 mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5" /> Puntos Fuertes
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {report?.strengths.map((strength, index) => (
                    <Badge 
                      key={index} 
                      className={`px-3 py-1.5 text-sm font-medium border ${strengthsColors[index % strengthsColors.length]}`}
                    >
                      {strength}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="p-6 rounded-xl bg-gradient-to-br from-amber-50 to-white border border-amber-100 mb-6">
                <h3 className="text-xl font-semibold text-amber-700 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> Áreas de Mejora
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {report?.weaknesses.map((weakness, index) => (
                    <Badge 
                      key={index} 
                      className={`px-3 py-1.5 text-sm font-medium border ${weaknessesColors[index % weaknessesColors.length]}`}
                    >
                      {weakness}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="p-6 rounded-xl bg-white border border-indigo-100">
                <h3 className="text-xl font-semibold text-indigo-700 mb-4 flex items-center gap-2">
                  <List className="w-5 h-5" /> Recomendaciones Prioritarias
                </h3>
                <ol className="list-decimal space-y-5 pl-5">
                  {report?.recommendations.map((recommendation, index) => (
                    <li key={index} className="text-gray-700 pl-2">
                      <div className="font-medium text-lg text-indigo-700">
                        Acción {index + 1}: {recommendation.split(':')[0]}
                      </div>
                      <div className="mt-1 text-gray-600">
                        {recommendation.includes(':') ? recommendation.split(':').slice(1).join(':') : ''}
                      </div>
                    </li>
                  ))}
                </ol>
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
