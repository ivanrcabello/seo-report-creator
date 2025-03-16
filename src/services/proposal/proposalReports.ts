import { supabase } from "@/integrations/supabase/client";
import { ClientReport } from "@/types/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { shareReport } from "../reportService";

// Función para incluir un informe en una propuesta
export const includeReportInProposal = async (proposalId: string, reportId: string): Promise<Proposal | undefined> => {
  // Obtener propuesta actual
  const { data: proposal } = await supabase
    .from('proposals')
    .select('report_ids')
    .eq('id', proposalId)
    .maybeSingle();
  
  if (!proposal) return undefined;
  
  // Preparar array de reportIds
  const reportIds = proposal.report_ids || [];
  if (!reportIds.includes(reportId)) {
    reportIds.push(reportId);
  }
  
  // Actualizar propuesta
  const { data, error } = await supabase
    .from('proposals')
    .update({
      report_ids: reportIds,
      updated_at: new Date().toISOString()
    })
    .eq('id', proposalId)
    .select()
    .single();
  
  if (error) {
    console.error("Error including report in proposal:", error);
    throw error;
  }
  
  // Compartir el informe si no está compartido
  const report = await getReport(reportId);
  if (report && !report.sharedAt) {
    await shareReport(report);
  }
  
  return mapProposalFromDB(data);
};

// Función para eliminar un informe de una propuesta
export const removeReportFromProposal = async (proposalId: string, reportId: string): Promise<Proposal | undefined> => {
  // Obtener propuesta actual
  const { data: proposal } = await supabase
    .from('proposals')
    .select('report_ids')
    .eq('id', proposalId)
    .maybeSingle();
  
  if (!proposal || !proposal.report_ids) return undefined;
  
  // Filtrar reportIds
  const reportIds = proposal.report_ids.filter(id => id !== reportId);
  
  // Actualizar propuesta
  const { data, error } = await supabase
    .from('proposals')
    .update({
      report_ids: reportIds,
      updated_at: new Date().toISOString()
    })
    .eq('id', proposalId)
    .select()
    .single();
  
  if (error) {
    console.error("Error removing report from proposal:", error);
    throw error;
  }
  
  return mapProposalFromDB(data);
};

// Función para obtener los informes de una propuesta
export const getProposalReports = async (proposalId: string): Promise<ClientReport[]> => {
  // Obtener propuesta con reportIds
  const { data: proposal } = await supabase
    .from('proposals')
    .select('report_ids')
    .eq('id', proposalId)
    .maybeSingle();
  
  if (!proposal || !proposal.report_ids || proposal.report_ids.length === 0) {
    return [];
  }
  
  // Obtener todos los informes mencionados
  const reports: ClientReport[] = [];
  for (const reportId of proposal.report_ids) {
    const report = await getReport(reportId);
    if (report) {
      reports.push(report);
    }
  }
  
  return reports;
};
