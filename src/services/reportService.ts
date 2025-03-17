
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
    console.log("getFilteredReports called with clientId:", clientId, "isAdmin:", isAdmin);
    
    if (isAdmin) {
      // Admins can see all reports or filter by clientId if provided
      if (clientId) {
        console.log("Admin filtering reports for specific client:", clientId);
        const reports = await getClientReports(clientId);
        console.log("Admin: Got reports for client", clientId, "reports count:", reports.length);
        return reports;
      } else {
        console.log("Admin getting all reports");
        const reports = await getAllReports();
        console.log("Admin: Got all reports, count:", reports.length);
        return reports;
      }
    } else {
      // Regular users can only see their own reports
      if (!clientId) {
        console.error("ClientId is required for non-admin users");
        return [];
      }
      console.log("Regular user getting own reports:", clientId);
      const reports = await getClientReports(clientId);
      console.log("User: Got reports, count:", reports.length);
      return reports;
    }
  } catch (error) {
    console.error("Error getting filtered reports:", error);
    throw error;
  }
};
