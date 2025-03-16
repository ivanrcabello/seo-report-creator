import { supabase } from "@/integrations/supabase/client";
import { ClientReport } from "@/types/client";
import { v4 as uuidv4 } from "uuid";
import { mapDbReportToClientReport } from "./reportMappers";

/**
 * Function to get a list of reports for a client
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

    // Map the database result to ClientReport format
    return data.map(mapDbReportToClientReport);
  } catch (error) {
    console.error("Error getting client reports:", error);
    throw error;
  }
};

/**
 * Function to get a single report by ID
 */
export const getReport = async (reportId: string): Promise<ClientReport | null> => {
  try {
    if (!reportId || reportId === 'undefined' || reportId === 'null') {
      console.error("Invalid report ID provided:", reportId);
      return null;
    }

    console.log("Fetching report with ID:", reportId);
    
    const { data, error } = await supabase
      .from('client_reports')
      .select('*')
      .eq('id', reportId)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching report:", error);
      throw error;
    }

    if (!data) {
      console.warn("No report found with ID:", reportId);
      return null;
    }

    console.log("Report found:", data.id, data.title);
    return mapDbReportToClientReport(data);
  } catch (error) {
    console.error("Error getting report:", error);
    throw error;
  }
};

/**
 * Function to get all reports
 */
export const getAllReports = async (): Promise<ClientReport[]> => {
  try {
    console.log("Getting all reports");
    const { data, error } = await supabase
      .from('client_reports')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error("Supabase error getting all reports:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.log("No reports found");
      return [];
    }

    console.log(`Found ${data.length} reports`);

    // Map the database result to ClientReport format
    return data.map(mapDbReportToClientReport);
  } catch (error) {
    console.error("Error getting all reports:", error);
    throw error;
  }
};

/**
 * Function to add a new report
 */
export const addReport = async (report: Omit<ClientReport, "id">): Promise<ClientReport> => {
  try {
    const { data, error } = await supabase
      .from('client_reports')
      .insert({
        client_id: report.clientId,
        title: report.title,
        date: report.date,
        type: report.type,
        content: report.content || "",
        url: report.url,
        notes: report.notes,
        document_ids: report.documentIds,
        share_token: report.shareToken || uuidv4(),
        include_in_proposal: report.includeInProposal || false,
        analytics_data: report.analyticsData || {},
        status: report.status || 'draft'
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapDbReportToClientReport(data);
  } catch (error) {
    console.error("Error adding report:", error);
    throw error;
  }
};

/**
 * Function to update an existing report
 */
export const updateReport = async (report: ClientReport): Promise<ClientReport> => {
  try {
    if (!report.id) {
      throw new Error("Report ID is required for update");
    }

    const { data, error } = await supabase
      .from('client_reports')
      .update({
        title: report.title,
        content: report.content,
        url: report.url,
        notes: report.notes,
        document_ids: report.documentIds,
        include_in_proposal: report.includeInProposal,
        status: report.status || 'draft',
        analytics_data: report.analyticsData || {}
      })
      .eq('id', report.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapDbReportToClientReport(data);
  } catch (error) {
    console.error("Error updating report:", error);
    throw error;
  }
};

/**
 * Function to delete a report
 */
export const deleteReport = async (reportId: string): Promise<void> => {
  try {
    if (!reportId) {
      throw new Error("Report ID is required for deletion");
    }
    
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
