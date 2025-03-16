
import { supabase } from "@/integrations/supabase/client";
import { getReportByShareToken } from "./reportService";

/**
 * Get the URL for a shared report
 */
export const getSharedReportUrl = async (reportId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('client_reports')
      .select('share_token')
      .eq('id', reportId)
      .maybeSingle();
    
    if (error) {
      console.error("Error getting share token:", error);
      throw error;
    }

    if (data && data.share_token) {
      return `/share/report/${data.share_token}`;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting shared report URL:", error);
    return null;
  }
};

/**
 * Get a report by its share token
 */
export const fetchReportByShareToken = async (token: string) => {
  try {
    console.log("Fetching report by share token:", token);
    const report = await getReportByShareToken(token);
    return report;
  } catch (error) {
    console.error("Error fetching report by token:", error);
    throw error;
  }
};
