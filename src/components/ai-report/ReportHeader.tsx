
import { ClientReport } from "@/types/client";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  RefreshCcw, 
  Edit, 
  Download, 
  Save, 
  Sparkles,
  Gem
} from "lucide-react";

interface ReportHeaderProps {
  report: ClientReport | null;
  isLoading: boolean;
  isGeneratingAI: boolean;
  isSaving: boolean;
  currentReportExists: boolean;
  onRegenerate: () => Promise<void>;
  onEdit: () => void;
  onDownloadPdf: () => Promise<void>;
  onGenerateAdvancedReport: () => Promise<void>;
  onSaveReport: () => Promise<void>;
  generatorType?: 'openai' | 'gemini';
}

export const ReportHeader = ({
  report,
  isLoading,
  isGeneratingAI,
  isSaving,
  currentReportExists,
  onRegenerate,
  onEdit,
  onDownloadPdf,
  onGenerateAdvancedReport,
  onSaveReport,
  generatorType = 'openai'
}: ReportHeaderProps) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold">
            {generatorType === 'gemini' ? 'Informe Generado con Gemini AI' : 'Informe SEO Inteligente'}
          </h2>
        </div>
        <div className="flex items-center">
          {generatorType === 'gemini' ? (
            <Gem className="h-5 w-5 text-purple-600 mr-2" />
          ) : (
            <Sparkles className="h-5 w-5 text-amber-500 mr-2" />
          )}
          <span className="text-sm text-gray-500">
            {generatorType === 'gemini' ? 'Potenciado por Google Gemini' : 'Potenciado por IA'}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {!report ? (
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
                Generar Informe
              </>
            )}
          </Button>
        ) : (
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
              Editar
            </Button>

            <Button
              variant="outline"
              onClick={onDownloadPdf}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Descargar PDF
            </Button>

            {currentReportExists && (
              <Button
                variant="outline"
                onClick={onGenerateAdvancedReport}
                disabled={isGeneratingAI}
                className="gap-2"
              >
                {isGeneratingAI ? (
                  <>
                    <RefreshCcw className="h-4 w-4 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    {generatorType === 'gemini' ? (
                      <Gem className="h-4 w-4" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    Generar Avanzado
                  </>
                )}
              </Button>
            )}

            {currentReportExists && (
              <Button
                onClick={onSaveReport}
                disabled={isSaving}
                className="gap-2 ml-auto"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Guardando..." : "Guardar Cambios"}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
