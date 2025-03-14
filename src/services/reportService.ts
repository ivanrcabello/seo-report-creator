
import { ClientReport } from "@/types/client";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

// Función para convertir datos de Supabase al formato de la aplicación
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
  includeInProposal: report.include_in_proposal
});

// Función para convertir datos de la aplicación al formato de Supabase
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
  include_in_proposal: report.includeInProposal
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
