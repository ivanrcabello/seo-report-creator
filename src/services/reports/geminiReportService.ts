
import { AuditResult } from "@/services/pdfAnalyzer";
import { ClientReport } from "@/types/client";
import { toast } from "sonner";
import { generateGeminiReport } from "./reportGeneration";
import { saveGeminiReport } from "./reportStorage";

/**
 * Generate a report using Gemini and save it to the database
 * @param clientId The client ID
 * @param clientName The client name
 * @param auditData The audit data to use for generation
 * @param documentIds Optional array of document IDs used in the report
 * @returns The saved report object
 */
export const generateAndSaveReport = async (
  clientId: string,
  clientName: string,
  auditData: AuditResult,
  documentIds: string[] = []
): Promise<ClientReport | null> => {
  try {
    console.log("Starting generateAndSaveReport for client:", clientId, clientName);
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
    
    console.log(`Using report type: ${reportType}`);
    
    // Generate the report content
    const reportContent = await generateGeminiReport(enhancedAuditData, reportType);
    
    if (!reportContent) {
      toast.dismiss();
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
    
    toast.dismiss();
    
    if (savedReport) {
      toast.success("Informe generado y guardado correctamente");
      return savedReport;
    } else {
      toast.error("Error guardando el informe");
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

// Re-export all functions for backward compatibility
export { generateGeminiReport } from "./reportGeneration";
export { saveGeminiReport } from "./reportStorage";
