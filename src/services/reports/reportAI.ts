
import { supabase } from "@/integrations/supabase/client";
import { ClientReport } from "@/types/client";
import { mapDbReportToClientReport } from "./reportMappers";

/**
 * Function to save report with AI generated data
 */
export const saveReportWithAIData = async (currentReport: ClientReport, aiReport: any): Promise<ClientReport> => {
  try {
    console.log("Saving report with AI data:", currentReport.id);
    console.log("AI report data:", aiReport);
    
    // Create the updated report object with AI data
    const updatedReport = {
      ...currentReport,
      content: aiReport.content || currentReport.content,
      analyticsData: {
        ...currentReport.analyticsData,
        aiReport: aiReport
      },
      status: 'draft' as const
    };
    
    // Update the report in the database
    const { data, error } = await supabase
      .from('client_reports')
      .update({
        content: updatedReport.content,
        analytics_data: updatedReport.analyticsData,
        status: updatedReport.status
      })
      .eq('id', currentReport.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating report with AI data:", error);
      throw error;
    }

    console.log("Report updated successfully:", data);

    return mapDbReportToClientReport(data);
  } catch (error) {
    console.error("Error saving report with AI data:", error);
    throw error;
  }
};
