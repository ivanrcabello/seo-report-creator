
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import { PageSpeedReport } from "@/services/pagespeed";
import { generatePageSpeedReport } from "@/services/pageSpeedReportService";

interface PageSpeedReportGeneratorProps {
  pageSpeedReport: PageSpeedReport;
  clientId: string;
  clientName: string;
}

export const PageSpeedReportGenerator = ({ 
  pageSpeedReport, 
  clientId, 
  clientName 
}: PageSpeedReportGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      await generatePageSpeedReport(pageSpeedReport, clientId, clientName);
      toast.success("Informe de PageSpeed generado y guardado correctamente");
    } catch (err) {
      console.error("Error generating report:", err);
      toast.error("Error al generar el informe. Por favor, inténtalo de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      size="sm" 
      variant="outline" 
      onClick={handleGenerateReport}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Generando...
        </>
      ) : (
        <>
          <FileText className="h-4 w-4 mr-2" />
          Generar Informe
        </>
      )}
    </Button>
  );
};
