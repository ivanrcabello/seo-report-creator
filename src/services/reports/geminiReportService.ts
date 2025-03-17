
import { AuditResult } from "@/services/pdfAnalyzer";
import { ClientReport } from "@/types/client";
import { toast } from "sonner";
import { generateOpenAIReport } from "./openAIReportGeneration";
import { saveReport } from "./reportStorage";

/**
 * @deprecated Use generateAndSaveOpenAIReport from openAIReportService instead
 */
export const generateAndSaveReport = async (
  clientId: string,
  clientName: string,
  auditData: AuditResult,
  documentIds: string[] = []
): Promise<ClientReport | null> => {
  try {
    console.log("DEPRECATED: Using OpenAI service instead of Gemini");
    
    toast.loading("Generando informe con IA...");
    
    // Ensure auditData has the client name
    const enhancedAuditData = {
      ...auditData,
      companyName: clientName
    };
    
    // Determine the report type based on the audit data
    let reportType: 'seo' | 'local' | 'technical' | 'performance' = 'seo';
    if (enhancedAuditData.localData && enhancedAuditData.localData.businessName) {
      reportType = 'local';
    } else if (enhancedAuditData.technicalResults && Object.keys(enhancedAuditData.technicalResults).length > 0) {
      reportType = 'technical';
    } else if (enhancedAuditData.performanceResults && Object.keys(enhancedAuditData.performanceResults).length > 0) {
      reportType = 'performance';
    }
    
    // Generate the report using OpenAI instead of Gemini
    const reportContent = await generateOpenAIReport(enhancedAuditData, reportType);
    
    if (!reportContent) {
      toast.dismiss();
      toast.error("No se pudo generar el contenido del informe");
      return null;
    }
    
    // Save the report
    const { success, reportId, error } = await saveReport(
      reportContent,
      clientId,
      `Informe SEO - ${clientName}`
    );
    
    toast.dismiss();
    
    if (success && reportId) {
      toast.success("Informe generado y guardado correctamente");
      
      // Create a minimal ClientReport object to return
      const savedReport: ClientReport = {
        id: reportId,
        clientId,
        title: `Informe SEO - ${clientName}`,
        content: reportContent,
        date: new Date().toISOString(),
        status: 'draft',
        type: reportType,
        documentIds: documentIds,
        analyticsData: {}
      };
      
      return savedReport;
    } else {
      toast.error("Error guardando el informe: " + error);
      return null;
    }
  } catch (error) {
    toast.dismiss();
    console.error("Error in generateAndSaveReport:", error);
    toast.error("Error en el proceso de generación del informe: " + 
      (error instanceof Error ? error.message : "Error desconocido"));
    return null;
  }
};

// Re-export necessary functions for backward compatibility
export { generateOpenAIReport as generateGeminiReport } from "./openAIReportGeneration";
export { saveReport } from "./reportStorage";

