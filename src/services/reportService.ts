
import { ClientReport } from "@/types/client";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

// Function to convert data from Supabase to app format
const mapReportFromDB = (report: any): ClientReport => ({
  id: report.id,
  clientId: report.client_id,
  title: report.title,
  date: report.date,
  type: report.type,
  url: report.url,
  notes: report.notes,
  documentIds: report.document_ids,
  shareToken: report.share_token,
  sharedAt: report.shared_at,
  includeInProposal: report.include_in_proposal,
  // Add the formatted content and additional data
  content: report.content,
  // Add analytics data (including AI reports)
  analyticsData: report.analytics_data,
  searchConsoleData: report.search_console_data,
  auditResult: report.audit_result
});

// Function to convert app data to Supabase format
const mapReportToDB = (report: Partial<ClientReport>) => ({
  client_id: report.clientId,
  title: report.title,
  date: report.date,
  type: report.type,
  url: report.url,
  notes: report.notes,
  document_ids: report.documentIds,
  share_token: report.shareToken,
  shared_at: report.sharedAt,
  include_in_proposal: report.includeInProposal,
  // Include content field for persistence
  content: report.content,
  // Include analytics data
  analytics_data: report.analyticsData,
  search_console_data: report.searchConsoleData,
  audit_result: report.auditResult
});

// Report CRUD operations
export const getClientReports = async (clientId: string): Promise<ClientReport[]> => {
  const { data, error } = await supabase
    .from('client_reports')
    .select('*')
    .eq('client_id', clientId);
  
  if (error) {
    console.error("Error fetching client reports:", error);
    return [];
  }
  
  return (data || []).map(mapReportFromDB);
};

export const getAllReports = async (): Promise<ClientReport[]> => {
  const { data, error } = await supabase
    .from('client_reports')
    .select('*');
  
  if (error) {
    console.error("Error fetching all reports:", error);
    return [];
  }
  
  return (data || []).map(mapReportFromDB);
};

export const getReport = async (id: string): Promise<ClientReport | undefined> => {
  // If the ID is invalid (like "new"), return undefined immediately
  if (!id || id === "new") {
    console.log("Invalid report ID:", id);
    return undefined;
  }

  try {
    const { data, error } = await supabase
      .from('client_reports')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching report:", error);
      return undefined;
    }
    
    return data ? mapReportFromDB(data) : undefined;
  } catch (error) {
    console.error("Error in getReport:", error);
    return undefined;
  }
};

export const addReport = async (report: Omit<ClientReport, "id">): Promise<ClientReport> => {
  const { data, error } = await supabase
    .from('client_reports')
    .insert([mapReportToDB(report)])
    .select()
    .single();
  
  if (error) {
    console.error("Error adding report:", error);
    throw error;
  }
  
  // Update client's lastReport date
  await supabase
    .from('clients')
    .update({ last_report: report.date })
    .eq('id', report.clientId);
  
  return mapReportFromDB(data);
};

export const updateReport = async (report: ClientReport): Promise<ClientReport> => {
  const { data, error } = await supabase
    .from('client_reports')
    .update(mapReportToDB(report))
    .eq('id', report.id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating report:", error);
    throw error;
  }
  
  return mapReportFromDB(data);
};

export const deleteReport = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('client_reports')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting report:", error);
    throw error;
  }
};

// Save report with AI data
export const saveReportWithAIData = async (report: ClientReport, aiReport: any): Promise<ClientReport> => {
  // Make sure we have an analytics_data object
  const analyticsData = report.analyticsData || {};
  
  // Add or update the aiReport property
  analyticsData.aiReport = aiReport;
  
  // Update the report content with the aiReport content if available
  const updatedReport = {
    ...report,
    analyticsData,
    content: aiReport.content || report.content
  };
  
  // Save to database
  return await updateReport(updatedReport);
};

// Share report function
export const shareReport = async (report: ClientReport): Promise<ClientReport> => {
  const shareToken = report.shareToken || uuidv4();
  const sharedAt = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('client_reports')
    .update({ 
      share_token: shareToken,
      shared_at: sharedAt
    })
    .eq('id', report.id)
    .select()
    .single();
  
  if (error) {
    console.error("Error sharing report:", error);
    throw error;
  }
  
  return mapReportFromDB(data);
};
