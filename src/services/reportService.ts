import { supabase } from "@/integrations/supabase/client";
import { ClientReport } from "@/types/client";
import { AIReport } from "@/services/aiReportService";
import { toast } from "sonner";

/**
 * Get a list of reports for a specific client
 * @param clientId Client ID to fetch reports for
 * @returns Array of client reports
 */
export const getClientReports = async (clientId: string): Promise<ClientReport[]> => {
  try {
    const { data, error } = await supabase
      .from('client_reports')
      .select('*')
      .eq('client_id', clientId)
      .order('date', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data.map((report) => ({
      id: report.id,
      clientId: report.client_id,
      title: report.title,
      date: report.date,
      type: report.type,
      content: report.content,
      analyticsData: report.analytics_data,
      url: report.url,
      documentIds: report.document_ids || [],
      shareToken: report.share_token,
      sharedAt: report.shared_at,
      includeInProposal: report.include_in_proposal,
      notes: report.notes
    }));
  } catch (error) {
    console.error("Error fetching client reports:", error);
    throw error;
  }
};

/**
 * Get all reports
 * @returns Array of all client reports
 */
export const getAllReports = async (): Promise<ClientReport[]> => {
  try {
    const { data, error } = await supabase
      .from('client_reports')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data.map((report) => ({
      id: report.id,
      clientId: report.client_id,
      title: report.title,
      date: report.date,
      type: report.type,
      content: report.content,
      analyticsData: report.analytics_data,
      url: report.url,
      documentIds: report.document_ids || [],
      shareToken: report.share_token,
      sharedAt: report.shared_at,
      includeInProposal: report.include_in_proposal,
      notes: report.notes
    }));
  } catch (error) {
    console.error("Error fetching all reports:", error);
    throw error;
  }
};

/**
 * Get a specific report by ID
 * @param reportId Report ID to fetch
 * @returns Client report or null if not found
 */
export const getReport = async (reportId: string): Promise<ClientReport | null> => {
  try {
    const { data, error } = await supabase
      .from('client_reports')
      .select('*')
      .eq('id', reportId)
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    return {
      id: data.id,
      clientId: data.client_id,
      title: data.title,
      date: data.date,
      type: data.type,
      content: data.content,
      analyticsData: data.analytics_data,
      url: data.url,
      documentIds: data.document_ids || [],
      shareToken: data.share_token,
      sharedAt: data.shared_at,
      includeInProposal: data.include_in_proposal,
      notes: data.notes
    };
  } catch (error) {
    console.error("Error fetching report:", error);
    throw error;
  }
};

/**
 * Add a new report
 * @param report Report data to add
 * @returns The newly created report
 */
export const addReport = async (report: Omit<ClientReport, 'id'>): Promise<ClientReport> => {
  try {
    const { data, error } = await supabase
      .from('client_reports')
      .insert([{
        client_id: report.clientId,
        title: report.title,
        date: report.date,
        type: report.type,
        content: report.content || '',
        analytics_data: report.analyticsData || {},
        url: report.url,
        document_ids: report.documentIds || [],
        include_in_proposal: report.includeInProposal,
        notes: report.notes
      }])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      id: data.id,
      clientId: data.client_id,
      title: data.title,
      date: data.date,
      type: data.type,
      content: data.content,
      analyticsData: data.analytics_data,
      url: data.url,
      documentIds: data.document_ids || [],
      shareToken: data.share_token,
      sharedAt: data.shared_at,
      includeInProposal: data.include_in_proposal,
      notes: data.notes
    };
  } catch (error) {
    console.error("Error adding report:", error);
    throw error;
  }
};

/**
 * Update an existing report
 * @param report Report data to update
 * @returns The updated report
 */
export const updateReport = async (report: ClientReport): Promise<ClientReport> => {
  try {
    const { data, error } = await supabase
      .from('client_reports')
      .update({
        client_id: report.clientId,
        title: report.title,
        date: report.date,
        type: report.type,
        content: report.content,
        analytics_data: report.analyticsData,
        url: report.url,
        document_ids: report.documentIds || [],
        include_in_proposal: report.includeInProposal,
        notes: report.notes
      })
      .eq('id', report.id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      id: data.id,
      clientId: data.client_id,
      title: data.title,
      date: data.date,
      type: data.type,
      content: data.content,
      analyticsData: data.analytics_data,
      url: data.url,
      documentIds: data.document_ids || [],
      shareToken: data.share_token,
      sharedAt: data.shared_at,
      includeInProposal: data.include_in_proposal,
      notes: data.notes
    };
  } catch (error) {
    console.error("Error updating report:", error);
    throw error;
  }
};

/**
 * Share a report by generating a share token
 * @param reportId Report ID to share
 * @returns The updated report with share token
 */
export const shareReport = async (reportId: string): Promise<ClientReport> => {
  try {
    const shareToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const sharedAt = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('client_reports')
      .update({
        share_token: shareToken,
        shared_at: sharedAt
      })
      .eq('id', reportId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      id: data.id,
      clientId: data.client_id,
      title: data.title,
      date: data.date,
      type: data.type,
      content: data.content,
      analyticsData: data.analytics_data,
      url: data.url,
      documentIds: data.document_ids || [],
      shareToken: data.share_token,
      sharedAt: data.shared_at,
      includeInProposal: data.include_in_proposal,
      notes: data.notes
    };
  } catch (error) {
    console.error("Error sharing report:", error);
    throw error;
  }
};

/**
 * Delete a report by ID
 * @param reportId Report ID to delete
 * @returns True if deletion was successful
 */
export const deleteReport = async (reportId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('client_reports')
      .delete()
      .eq('id', reportId);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting report:", error);
    throw error;
  }
};

/**
 * Update the report with AI generated data
 * @param report Report to update
 * @param aiReport AI generated report data
 * @returns Updated report
 */
export const saveReportWithAIData = async (
  report: ClientReport, 
  aiReport: any
): Promise<ClientReport> => {
  try {
    const updatedReport = {
      ...report,
      content: aiReport.content || aiReport.content,
      analyticsData: {
        ...report.analyticsData,
        aiReport: aiReport.analyticsData?.aiReport || {
          id: aiReport.id,
          content: aiReport.content,
          generated_at: new Date().toISOString(),
          generatedBy: aiReport.analyticsData?.generatedBy || 'gemini'
        }
      }
    };
    
    const { data, error } = await supabase
      .from('client_reports')
      .update({
        content: updatedReport.content,
        analytics_data: updatedReport.analyticsData
      })
      .eq('id', report.id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      id: data.id,
      clientId: data.client_id,
      title: data.title,
      date: data.date,
      type: data.type,
      content: data.content,
      analyticsData: data.analytics_data,
      url: data.url,
      documentIds: data.document_ids || [],
      shareToken: data.share_token,
      sharedAt: data.shared_at,
      includeInProposal: data.include_in_proposal,
      notes: data.notes
    };
  } catch (error) {
    console.error("Error saving report with AI data:", error);
    throw error;
  }
};
