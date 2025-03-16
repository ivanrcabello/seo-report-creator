
import { supabase } from "@/integrations/supabase/client";
import { ClientReport } from "@/types/client";
import { v4 as uuidv4 } from "uuid";
import { mapDbReportToClientReport } from "./reportMappers";

/**
 * Function to share a report (generate shareToken if needed and mark as shared)
 */
export const shareReport = async (reportId: string): Promise<ClientReport> => {
  try {
    const { data, error } = await supabase
      .from('client_reports')
      .update({
        shared_at: new Date().toISOString(),
        share_token: uuidv4(), // Generate a new UUID for sharing
        status: 'shared' as const
      })
      .eq('id', reportId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapDbReportToClientReport(data);
  } catch (error) {
    console.error("Error sharing report:", error);
    throw error;
  }
};

/**
 * Function to get a report by share token
 */
export const getReportByShareToken = async (shareToken: string): Promise<ClientReport | null> => {
  try {
    const { data, error } = await supabase
      .from('client_reports')
      .select('*')
      .eq('share_token', shareToken)
      .maybeSingle();
    
    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    return mapDbReportToClientReport(data);
  } catch (error) {
    console.error("Error getting report by share token:", error);
    throw error;
  }
};

/**
 * Function to publish a report
 */
export const publishReport = async (reportId: string): Promise<ClientReport> => {
  try {
    const { data, error } = await supabase
      .from('client_reports')
      .update({
        status: 'published' as const,
        updated_at: new Date().toISOString()
      })
      .eq('id', reportId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapDbReportToClientReport(data);
  } catch (error) {
    console.error("Error publishing report:", error);
    throw error;
  }
};
