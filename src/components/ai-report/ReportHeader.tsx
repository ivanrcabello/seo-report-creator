
import { AIReport } from "@/services/aiReportService";
import { Button } from "@/components/ui/button";
import {
  FileText,
  RefreshCcw,
  Edit,
  Download,
  ArrowRight,
  Save
} from "lucide-react";

interface ReportHeaderProps {
  report: AIReport | null;
  isLoading: boolean;
  isGeneratingOpenAI: boolean;
  isSaving: boolean;
  currentReportExists: boolean;
  onRegenerate: () => void;
  onEdit: () => void;
  onDownloadPdf: () => void;
  onGenerateAdvancedReport: () => void;
  onSaveReport: () => void;
}

export const ReportHeader = ({
  report,
  isLoading,
  isGeneratingOpenAI,
  isSaving,
  currentReportExists,
  onRegenerate,
  onEdit,
  onDownloadPdf,
  onGenerateAdvancedReport,
  onSaveReport
}: ReportHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-indigo-900 mb-3">Análisis Inteligente SEO</h2>
      <p className="text-gray-700 mb-4">
        Genera un informe SEO profesional con recomendaciones personalizadas basadas en el análisis de esta página web. Podrás editarlo y descargarlo en PDF para enviar a tus clientes.
      </p>
      <div className="flex flex-wrap gap-3">
        {!report && (
          <Button 
            onClick={onRegenerate} 
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
              onClick={onRegenerate} 
              disabled={isLoading} 
              className="gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Regenerar
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onEdit} 
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Editar Informe
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onDownloadPdf} 
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Descargar PDF
            </Button>

            <Button 
              variant="outline" 
              onClick={onGenerateAdvancedReport} 
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

            {currentReportExists && (
              <Button 
                variant="default" 
                onClick={onSaveReport} 
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
  );
};
