
import { supabase } from "@/integrations/supabase/client";
import { AuditResult } from "@/services/pdfAnalyzer";
import { ClientReport } from "@/types/client";
import { toast } from "sonner";

/**
 * Save a report generated by Gemini to the database
 * @param clientId The client ID
 * @param clientName The client name
 * @param reportContent The generated report content
 * @param auditData The audit data used to generate the report
 * @param documentIds Optional array of document IDs used in the report
 * @returns The saved report object
 */
export const saveGeminiReport = async (
  clientId: string,
  clientName: string,
  reportContent: string,
  auditData: AuditResult,
  documentIds: string[] = []
): Promise<ClientReport | null> => {
  try {
    console.log("Saving Gemini report to database for client:", clientId);
    
    // Create a serializable version of auditData for storage
    let serializableAuditData;
    try {
      serializableAuditData = JSON.parse(JSON.stringify(auditData));
    } catch (err) {
      console.error("Error serializing audit data:", err);
      serializableAuditData = { error: "Data could not be serialized" };
    }
    
    // Determine report type based on the audit data
    let reportType: 'seo' | 'local' | 'technical' | 'performance' = 'seo';
    if (auditData.localData && auditData.localData.businessName) {
      reportType = 'local';
    } else if (auditData.technicalResults && Object.keys(auditData.technicalResults).length > 0) {
      reportType = 'technical';
    } else if (auditData.performanceResults && Object.keys(auditData.performanceResults).length > 0) {
      reportType = 'performance';
    }
    
    // Define the status explicitly with the correct type
    const reportStatus: 'draft' | 'published' | 'shared' = 'draft';
    
    const reportData = {
      client_id: clientId,
      title: `Informe ${reportType.toUpperCase()} - ${clientName} - ${new Date().toLocaleDateString('es-ES')}`,
      date: new Date().toISOString(),
      type: reportType,
      content: reportContent,
      analytics_data: {
        auditResult: serializableAuditData,
        generatedAt: new Date().toISOString(),
        generatedBy: "gemini"
      },
      document_ids: documentIds,
      status: reportStatus
    };
    
    console.log("Inserting report into database", reportData);
    
    // Save to database
    const { data, error } = await supabase
      .from('client_reports')
      .insert(reportData)
      .select()
      .single();
    
    if (error) {
      console.error("Error saving report to database:", error);
      throw new Error(`Error guardando el informe: ${error.message}`);
    }
    
    console.log("Report saved successfully with ID:", data.id);
    
    // Map database response to ClientReport type
    return {
      id: data.id,
      clientId: data.client_id,
      title: data.title,
      date: data.date,
      type: data.type,
      content: data.content,
      analyticsData: data.analytics_data,
      documentIds: data.document_ids || [],
      url: data.url,
      notes: data.notes,
      shareToken: data.share_token,
      sharedAt: data.shared_at,
      includeInProposal: data.include_in_proposal || false,
      status: data.status || 'draft'
    };
  } catch (error) {
    console.error("Error in saveGeminiReport:", error);
    toast.error("Error guardando el informe: " + 
      (error instanceof Error ? error.message : "Error desconocido"));
    return null;
  }
};
