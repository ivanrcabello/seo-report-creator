import { supabase } from "@/integrations/supabase/client";
import { ClientReport } from "@/types/client";
import { v4 as uuidv4 } from "uuid";

// Function to get a list of reports for a client
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

    // Map the database result to ClientReport format
    return data.map((item): ClientReport => ({
      id: item.id,
      clientId: item.client_id,
      title: item.title,
      date: item.date,
      type: item.type,
      content: item.content,
      url: item.url,
      notes: item.notes,
      documentIds: item.document_ids || [],
      shareToken: item.share_token,
      sharedAt: item.shared_at,
      includeInProposal: item.include_in_proposal || false,
      analyticsData: item.analytics_data || {}
    }));
  } catch (error) {
    console.error("Error getting client reports:", error);
    throw error;
  }
};

// Function to get a single report by ID
export const getReport = async (reportId: string): Promise<ClientReport | null> => {
  try {
    const { data, error } = await supabase
      .from('client_reports')
      .select('*')
      .eq('id', reportId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // Record not found
        return null;
      }
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
      url: data.url,
      notes: data.notes,
      documentIds: data.document_ids || [],
      shareToken: data.share_token,
      sharedAt: data.shared_at,
      includeInProposal: data.include_in_proposal || false,
      analyticsData: data.analytics_data || {}
    };
  } catch (error) {
    console.error("Error getting report:", error);
    throw error;
  }
};

// Function to get all reports
export const getAllReports = async (): Promise<ClientReport[]> => {
  try {
    const { data, error } = await supabase
      .from('client_reports')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      throw error;
    }

    // Map the database result to ClientReport format
    return data.map((item): ClientReport => ({
      id: item.id,
      clientId: item.client_id,
      title: item.title,
      date: item.date,
      type: item.type,
      content: item.content,
      url: item.url,
      notes: item.notes,
      documentIds: item.document_ids || [],
      shareToken: item.share_token,
      sharedAt: item.shared_at,
      includeInProposal: item.include_in_proposal || false,
      analyticsData: item.analytics_data || {}
    }));
  } catch (error) {
    console.error("Error getting all reports:", error);
    throw error;
  }
};

// Function to add a new report
export const addReport = async (report: Omit<ClientReport, "id">): Promise<ClientReport> => {
  try {
    const { data, error } = await supabase
      .from('client_reports')
      .insert({
        client_id: report.clientId,
        title: report.title,
        date: report.date,
        type: report.type,
        content: report.content,
        url: report.url,
        notes: report.notes,
        document_ids: report.documentIds,
        share_token: report.shareToken || uuidv4(),
        include_in_proposal: report.includeInProposal || false,
        analytics_data: report.analyticsData || {}
      })
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
      url: data.url || "",
      notes: data.notes || "",
      documentIds: data.document_ids || [],
      shareToken: data.share_token,
      sharedAt: data.shared_at,
      includeInProposal: data.include_in_proposal || false,
      analyticsData: data.analytics_data || {}
    };
  } catch (error) {
    console.error("Error adding report:", error);
    throw error;
  }
};

// Function to update an existing report
export const updateReport = async (report: ClientReport): Promise<ClientReport> => {
  try {
    const { data, error } = await supabase
      .from('client_reports')
      .update({
        title: report.title,
        content: report.content,
        url: report.url,
        notes: report.notes,
        document_ids: report.documentIds,
        include_in_proposal: report.includeInProposal
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
      url: data.url || "",
      notes: data.notes || "",
      documentIds: data.document_ids || [],
      shareToken: data.share_token,
      sharedAt: data.shared_at,
      includeInProposal: data.include_in_proposal || false,
      analyticsData: data.analytics_data || {}
    };
  } catch (error) {
    console.error("Error updating report:", error);
    throw error;
  }
};

// Function to delete a report
export const deleteReport = async (reportId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('client_reports')
      .delete()
      .eq('id', reportId);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error deleting report:", error);
    throw error;
  }
};

// Function to share a report (generate shareToken if needed and mark as shared)
export const shareReport = async (reportId: string): Promise<ClientReport> => {
  try {
    const { data, error } = await supabase
      .from('client_reports')
      .update({
        shared_at: new Date().toISOString(),
        share_token: uuidv4() // Generate a new UUID for sharing
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
      url: data.url || "",
      notes: data.notes || "",
      documentIds: data.document_ids || [],
      shareToken: data.share_token,
      sharedAt: data.shared_at,
      includeInProposal: data.include_in_proposal || false,
      analyticsData: data.analytics_data || {}
    };
  } catch (error) {
    console.error("Error sharing report:", error);
    throw error;
  }
};

// Function to save report with AI generated data
export const saveReportWithAIData = async (currentReport: ClientReport, aiReport: any): Promise<ClientReport> => {
  try {
    // Create the updated report object with AI data
    const updatedReport = {
      ...currentReport,
      content: aiReport.content || currentReport.content,
      analyticsData: {
        ...currentReport.analyticsData,
        aiReport: aiReport
      }
    };
    
    // Update the report in the database
    const { data, error } = await supabase
      .from('client_reports')
      .update({
        content: updatedReport.content,
        analytics_data: updatedReport.analyticsData
      })
      .eq('id', currentReport.id)
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
      url: data.url || "",
      notes: data.notes || "",
      documentIds: data.document_ids || [],
      shareToken: data.share_token,
      sharedAt: data.shared_at,
      includeInProposal: data.include_in_proposal || false,
      analyticsData: data.analytics_data || {}
    };
  } catch (error) {
    console.error("Error saving report with AI data:", error);
    throw error;
  }
};
