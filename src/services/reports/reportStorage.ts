
// Fix the StatusType for the report
import { supabase } from "@/integrations/supabase/client";

type ReportStatus = "draft" | "published" | "archived";

const saveReport = async (reportContent: string, clientId: string, reportName: string): Promise<{ success: boolean; error?: string; reportId?: string }> => {
  try {
    console.log("Starting report saving process");
    console.log("Report content length:", reportContent.length);
    console.log("Client ID:", clientId);
    console.log("Report name:", reportName);
    
    if (!reportContent || !clientId || !reportName) {
      console.error("Missing data for report saving:", { 
        hasReportContent: !!reportContent, 
        hasClientId: !!clientId,
        hasReportName: !!reportName 
      });
      return { success: false, error: "Missing data for report" };
    }
    
    console.log("Preparing report data for storage");
    
    // Prepare report data
    const reportStatus: ReportStatus = "draft";
    
    const { data, error } = await supabase
      .from('client_reports')
      .insert({
        client_id: clientId,
        content: reportContent,
        title: reportName,
        type: 'seo', // Default to SEO report type
        status: reportStatus,
        date: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error saving report to database:", error);
      return { success: false, error: error.message };
    }
    
    if (!data) {
      console.error("No data returned after saving report");
      return { success: false, error: "Unknown error saving report" };
    }
    
    console.log("Report saved successfully with ID:", data.id);
    return { success: true, reportId: data.id };
    
  } catch (error: any) {
    console.error("Exception in saveReport:", error);
    return { success: false, error: error.message || "Unknown error saving report" };
  }
};

// Export as saveReport (no longer as both saveReport and saveGeminiReport to avoid conflicts)
export { saveReport };
