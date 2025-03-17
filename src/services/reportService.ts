
import { supabase } from "@/integrations/supabase/client";
import { ClientReport } from "@/types/client";
import { v4 as uuidv4 } from "uuid";
import * as reportCrud from "./reports/reportCrud";
import { saveReportWithAIData } from "./reports/reportAI";
import { shareReport, getReportByShareToken } from "./reports/reportSharing";

export const getClientReports = reportCrud.getClientReports;
export const getReport = reportCrud.getReport;
export const getAllReports = reportCrud.getAllReports;
export const addReport = reportCrud.addReport;
export const updateReport = reportCrud.updateReport;
export const deleteReport = reportCrud.deleteReport;
export { saveReportWithAIData, shareReport, getReportByShareToken };

export const getFilteredReports = async (clientId?: string, isAdmin = false): Promise<ClientReport[]> => {
  try {
    if (isAdmin) {
      // Admins can see all reports or filter by clientId if provided
      if (clientId) {
        return await getClientReports(clientId);
      } else {
        return await getAllReports();
      }
    } else {
      // Regular users can only see their own reports
      if (!clientId) {
        console.error("ClientId is required for non-admin users");
        return [];
      }
      return await getClientReports(clientId);
    }
  } catch (error) {
    console.error("Error getting filtered reports:", error);
    throw error;
  }
};
