
import { useState } from "react";
import { AuditResult } from "@/services/pdfAnalyzer";
import { AIReport, generateAIReport } from "@/services/aiReportService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Brain, Share2, Download, Printer } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            Informe Explicativo con IA
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-gray-600 mb-6">
            Genera un informe detallado con explicaciones personalizadas para tu cliente sobre los resultados del análisis y las medidas a implementar.
          </p>
          <Button 
            onClick={handleGenerateReport} 
            className="bg-purple-600 hover:bg-purple-700"
          >
            Generar Informe Explicativo
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="mt-8">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 text-purple-500 animate-spin mb-4" />
          <p className="text-lg font-medium">Generando informe personalizado...</p>
          <p className="text-gray-500 mt-2">Analizando datos y creando recomendaciones específicas</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8 print:mt-4 print:shadow-none">
      <CardHeader className="border-b pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            Informe Explicativo para el Cliente
          </CardTitle>
          <div className="flex gap-2 print:hidden">
            <Button variant="outline" size="sm" onClick={handleShareReport}>
              <Share2 className="w-4 h-4 mr-1" /> Compartir
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadReport}>
              <Download className="w-4 h-4 mr-1" /> Descargar
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrintReport}>
              <Printer className="w-4 h-4 mr-1" /> Imprimir
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs defaultValue="client" className="w-full">
          <TabsList className="w-full mb-4 print:hidden">
            <TabsTrigger value="client" className="flex-1">Explicación para Cliente</TabsTrigger>
            <TabsTrigger value="technical" className="flex-1">Detalles Técnicos</TabsTrigger>
            <TabsTrigger value="actionable" className="flex-1">Plan de Acción</TabsTrigger>
          </TabsList>
          
          <TabsContent value="client" className="space-y-4">
            <div className="prose max-w-none">
              {report?.clientExplanation.split('\n\n').map((paragraph, index) => (
                <p key={index} className={paragraph.trim().startsWith('-') ? "ml-4" : ""}>
                  {paragraph}
                </p>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="technical" className="space-y-4">
            <div className="prose max-w-none">
              {report?.technicalExplanation.split('\n\n').map((paragraph, index) => (
                <div key={index}>
                  {paragraph.includes(':') ? (
                    <>
                      <h3 className="text-lg font-semibold mt-4 mb-2">{paragraph.split(':')[0]}:</h3>
                      <p>{paragraph.split(':').slice(1).join(':')}</p>
                    </>
                  ) : (
                    <p>{paragraph}</p>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="actionable" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Resumen del Análisis</h3>
              <p className="text-gray-700 mb-4">{report?.summary}</p>
              
              <h3 className="text-lg font-semibold mb-3">Puntos Fuertes</h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                {report?.strengths.map((strength, index) => (
                  <li key={index} className="text-gray-700">{strength}</li>
                ))}
              </ul>
              
              <h3 className="text-lg font-semibold mb-3">Áreas de Mejora</h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                {report?.weaknesses.map((weakness, index) => (
                  <li key={index} className="text-gray-700">{weakness}</li>
                ))}
              </ul>
              
              <h3 className="text-lg font-semibold mb-3">Recomendaciones Prioritarias</h3>
              <ol className="list-decimal pl-5 space-y-2">
                {report?.recommendations.map((recommendation, index) => (
                  <li key={index} className="text-gray-700">
                    <div className="font-medium">{recommendation}</div>
                  </li>
                ))}
              </ol>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
