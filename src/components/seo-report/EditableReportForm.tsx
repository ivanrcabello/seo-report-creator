
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ClientReport } from "@/types/client";
import { Save, X } from "lucide-react";

interface EditableReportFormProps {
  initialReport: ClientReport;
  onSave: (report: ClientReport) => void;
}

export const EditableReportForm = ({ initialReport, onSave }: EditableReportFormProps) => {
  const [report, setReport] = useState<ClientReport>(initialReport);
  const [content, setContent] = useState(initialReport.content || "");

  const handleSave = () => {
    const updatedReport = {
      ...report,
      content: content,
      analyticsData: {
        ...report.analyticsData,
        aiReport: {
          ...(report.analyticsData?.aiReport || {}),
          content: content,
          updated_at: new Date().toISOString(),
        }
      }
    };
    
    onSave(updatedReport);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border">
        <h2 className="text-xl font-semibold">Editar Informe</h2>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            onClick={() => onSave(initialReport)}
            className="gap-1"
          >
            <X className="h-4 w-4" />
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            className="gap-1"
          >
            <Save className="h-4 w-4" />
            Guardar Cambios
          </Button>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg border">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contenido del informe (formato Markdown)
          </label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[500px] font-mono"
          />
        </div>
        
        <div className="text-sm text-gray-500">
          <p>Usa sintaxis Markdown para formatear el texto:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><code className="bg-gray-100 px-1"># Título</code> - Encabezado nivel 1</li>
            <li><code className="bg-gray-100 px-1">## Subtítulo</code> - Encabezado nivel 2</li>
            <li><code className="bg-gray-100 px-1">**texto**</code> - Texto en negrita</li>
            <li><code className="bg-gray-100 px-1">- elemento</code> - Lista con viñetas</li>
            <li><code className="bg-gray-100 px-1">1. elemento</code> - Lista numerada</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
