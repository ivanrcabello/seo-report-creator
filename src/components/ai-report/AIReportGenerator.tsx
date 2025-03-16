
import { useState } from "react";
import { AIReport, generateAIReport } from "@/services/aiReportService";
import { AuditResult } from "@/services/pdfAnalyzer";
import { ClientReport } from "@/types/client";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import { downloadSeoReportPdf } from "@/services/seoReportPdfService";
import { saveReportWithAIData } from "@/services/reportService";
import { generateSEOReport } from "@/services/openai";
import { EditableReportForm } from "@/components/seo-report/EditableReportForm";
import { ReportHeader } from "./ReportHeader";
import { ReportContent } from "./ReportContent";

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
  const { toast: uiToast } = useToast();

  // Load report data from currentReport if it exists
  useState(() => {
    if (currentReport?.analyticsData?.aiReport) {
      setReport(currentReport.analyticsData.aiReport);
    }
  });

  const generateReport = async () => {
    setIsLoading(true);
    try {
      const data = await generateAIReport(auditResult);
      setReport(data);
    } catch (error) {
      console.error("Error generando el informe:", error);
      uiToast({
        description: "No se pudo generar el informe. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateAdvancedReport = async () => {
    setIsGeneratingOpenAI(true);
    toast.loading("Generando informe avanzado...");
    
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
        
        toast.success("El informe avanzado se ha generado con éxito");
      } else {
        toast.error("No se pudo generar el informe avanzado");
      }
    } catch (error) {
      console.error("Error generando informe avanzado:", error);
      toast.error("Hubo un problema al generar el informe avanzado");
    } finally {
      setIsGeneratingOpenAI(false);
    }
  };

  const handleSaveReport = async () => {
    if (!report || !currentReport) return;
    
    setIsSaving(true);
    try {
      await saveReportWithAIData(currentReport, report);
      toast.success("El informe se ha guardado correctamente.");
    } catch (error) {
      console.error("Error saving report:", error);
      toast.error("No se pudo guardar el informe. Inténtalo de nuevo.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!report || !report.id) return;
    
    try {
      const success = await downloadSeoReportPdf(report.id);
      if (success) {
        toast.success("El informe se ha descargado correctamente.");
      } else {
        throw new Error("Error al descargar el PDF");
      }
    } catch (error) {
      console.error("Error descargando PDF:", error);
      toast.error("No se pudo descargar el PDF. Inténtalo de nuevo.");
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
      <ReportHeader 
        report={report}
        isLoading={isLoading}
        isGeneratingOpenAI={isGeneratingOpenAI}
        isSaving={isSaving}
        currentReportExists={!!currentReport}
        onRegenerate={generateReport}
        onEdit={() => setIsEditMode(true)}
        onDownloadPdf={handleDownloadPdf}
        onGenerateAdvancedReport={generateAdvancedReport}
        onSaveReport={handleSaveReport}
      />

      {report && !isLoading && (
        <div className="space-y-8 print:space-y-6">
          <ReportContent report={report} />
        </div>
      )}
    </div>
  );
};
