
import { AuditResult } from "@/services/pdfAnalyzer";
import { ClientReport } from "@/types/client";
import { toast } from "sonner";
import { generateOpenAIReport } from "./openAIReportGeneration";
import { saveGeminiReport } from "./reportStorage";

/**
 * Generate a report using OpenAI and save it to the database
 * @param clientId The client ID
 * @param clientName The client name
 * @param auditData The audit data to use for generation
 * @param documentIds Optional array of document IDs used in the report
 * @returns The saved report object
 */
export const generateAndSaveOpenAIReport = async (
  clientId: string,
  clientName: string,
  auditData: AuditResult,
  documentIds: string[] = []
): Promise<ClientReport | null> => {
  try {
    console.log("Starting generateAndSaveOpenAIReport for client:", clientId, clientName);
    console.log("Client name:", clientName);
    console.log("Document IDs:", documentIds);
    
    const toastId = toast.loading("Generando informe con OpenAI...");
    
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
    
    console.log(`Using report type: ${reportType}`);
    
    // Generate the report content
    const reportContent = await generateOpenAIReport(enhancedAuditData, reportType);
    
    if (!reportContent) {
      toast.dismiss(toastId);
      toast.error("No se pudo generar el contenido del informe");
      return null;
    }
    
    console.log("Report content generated, saving to database");
    console.log("Content preview:", reportContent.substring(0, 100) + "...");
    
    // Save the report
    const savedReport = await saveGeminiReport(
      clientId,
      clientName,
      reportContent,
      enhancedAuditData,
      documentIds
    );
    
    toast.dismiss(toastId);
    
    if (savedReport) {
      console.log("Report saved successfully:", savedReport.id);
      toast.success("Informe generado y guardado correctamente");
      return savedReport;
    } else {
      console.error("Failed to save report");
      toast.error("Error guardando el informe");
      return null;
    }
  } catch (error) {
    console.error("Error in generateAndSaveOpenAIReport:", error);
    toast.error("Error en el proceso de generación del informe: " + 
      (error instanceof Error ? error.message : "Error desconocido"));
    return null;
  }
};

// Re-export all functions
export { generateOpenAIReport } from "./openAIReportGeneration";
export { saveGeminiReport } from "./reportStorage";
