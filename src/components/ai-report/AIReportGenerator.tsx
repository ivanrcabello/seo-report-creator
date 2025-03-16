
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AuditResult } from "@/services/pdfAnalyzer";
import { ClientReport } from "@/types/client";
import { saveReportWithAIData } from "@/services/reportService";
import { Cog, Save, FileText } from "lucide-react";
import { toast } from "sonner";

interface AIReportGeneratorProps {
  auditResult: AuditResult;
  currentReport: ClientReport | null;
}

export const AIReportGenerator = ({ auditResult, currentReport }: AIReportGeneratorProps) => {
  const [aiPrompt, setAiPrompt] = useState<string>("");
  const [generatedReport, setGeneratedReport] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerateReport = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Por favor escribe un prompt para generar el informe");
      return;
    }

    try {
      setIsGenerating(true);
      toast.loading("Generando informe con IA...");

      // Simulamos una generación de IA para este ejemplo
      // En un entorno real, esto sería una llamada a una API de IA como OpenAI
      setTimeout(() => {
        const demoReport = `# Informe de Análisis SEO generado por IA

## Resumen ejecutivo
Basado en el análisis realizado, el sitio web presenta varias oportunidades de mejora en términos de SEO y rendimiento.

## Hallazgos principales
- La puntuación de rendimiento es ${auditResult.scores?.performance || "baja"} y necesita mejoras
- Se encontraron ${auditResult.metaData?.totalIssues || "varios"} problemas técnicos que afectan el posicionamiento
- Las palabras clave principales no están bien optimizadas en el contenido

## Recomendaciones
- Mejorar la velocidad de carga optimizando imágenes y reduciendo JavaScript no utilizado
- Implementar metadatos adecuados en todas las páginas importantes
- Crear contenido más relevante enfocado en palabras clave objetivo
- Optimizar la experiencia móvil para mejorar la interacción del usuario
        
## Conclusión
Con estas mejoras implementadas, esperamos ver un incremento significativo en el tráfico orgánico y las conversiones en los próximos 3 meses.`;

        setGeneratedReport(demoReport);
        toast.dismiss();
        toast.success("Informe generado correctamente");
        setIsGenerating(false);
      }, 2000);
    } catch (error) {
      console.error("Error generating report:", error);
      toast.dismiss();
      toast.error("Error al generar el informe");
      setIsGenerating(false);
    }
  };

  const handleSaveReport = async () => {
    if (!currentReport) {
      toast.error("No hay un informe actual para guardar");
      return;
    }

    if (!generatedReport) {
      toast.error("No hay contenido generado para guardar");
      return;
    }

    try {
      setIsSaving(true);
      toast.loading("Guardando informe...");

      const aiReportData = {
        content: generatedReport,
        generatedAt: new Date().toISOString(),
        prompt: aiPrompt
      };

      const updatedReport = await saveReportWithAIData(currentReport, aiReportData);
      
      toast.dismiss();
      toast.success("Informe guardado correctamente");
      
      // Redireccionar o actualizar vista según sea necesario
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error saving report:", error);
      toast.dismiss();
      toast.error("Error al guardar el informe");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 border rounded-lg p-6 bg-white">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Editor de IA</h3>
        <p className="text-sm text-gray-500">
          Solicita a la IA generar un informe personalizado basado en los datos de análisis.
        </p>
      </div>

      <div className="space-y-4">
        <Textarea 
          placeholder="Escribe un prompt para la IA. Ej: 'Genera un informe SEO destacando los principales problemas y oportunidades de mejora.'"
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          className="min-h-[100px]"
        />
        
        <Button 
          onClick={handleGenerateReport}
          disabled={isGenerating || !aiPrompt.trim()}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Cog className="h-4 w-4 mr-2 animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <FileText className="h-4 w-4 mr-2" />
              Generar Informe
            </>
          )}
        </Button>
      </div>

      {generatedReport && (
        <div className="space-y-4 mt-6">
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-2">Informe Generado</h3>
            <div className="bg-gray-50 p-4 rounded border min-h-[200px] max-h-[400px] overflow-y-auto">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {generatedReport}
              </ReactMarkdown>
            </div>
          </div>
          
          <Button 
            onClick={handleSaveReport}
            disabled={isSaving}
            variant="outline"
            className="w-full"
          >
            {isSaving ? (
              <>
                <Cog className="h-4 w-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Guardar en el Informe Actual
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
