
import { Proposal, ClientReport } from "@/types/client";
import { v4 as uuidv4 } from "uuid";
import { getSeoPack } from "./packService";
import { getReport, shareReport } from "./reportService";
import { generatePublicProposalUrl } from "./reportSharingService";
import { supabase } from "@/integrations/supabase/client";

// Función para convertir datos de Supabase al formato de la aplicación
const mapProposalFromDB = (proposal: any): Proposal => ({
  id: proposal.id,
  clientId: proposal.client_id,
  packId: proposal.pack_id,
  title: proposal.title,
  description: proposal.description,
  status: proposal.status,
  createdAt: proposal.created_at,
  updatedAt: proposal.updated_at,
  sentAt: proposal.sent_at,
  expiresAt: proposal.expires_at,
  customPrice: proposal.custom_price,
  customFeatures: proposal.custom_features,
  reportIds: proposal.report_ids,
  publicUrl: proposal.public_url,
});

// Función para convertir datos de la aplicación al formato de Supabase
const mapProposalToDB = (proposal: Partial<Proposal>) => ({
  client_id: proposal.clientId,
  pack_id: proposal.packId,
  title: proposal.title,
  description: proposal.description,
  status: proposal.status,
  sent_at: proposal.sentAt,
  expires_at: proposal.expiresAt,
  custom_price: proposal.customPrice,
  custom_features: proposal.customFeatures,
  report_ids: proposal.reportIds,
  public_url: proposal.publicUrl,
});

// Operaciones CRUD para propuestas usando Supabase
export const getClientProposals = async (clientId: string): Promise<Proposal[]> => {
  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .eq('client_id', clientId);
  
  if (error) {
    console.error("Error fetching client proposals:", error);
    return [];
  }
  
  return (data || []).map(mapProposalFromDB);
};

export const getAllProposals = async (): Promise<Proposal[]> => {
  const { data, error } = await supabase
    .from('proposals')
    .select('*');
  
  if (error) {
    console.error("Error fetching all proposals:", error);
    return [];
  }
  
  return (data || []).map(mapProposalFromDB);
};

export const getProposal = async (id: string): Promise<Proposal | undefined> => {
  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) {
    console.error("Error fetching proposal:", error);
    return undefined;
  }
  
  return data ? mapProposalFromDB(data) : undefined;
};

export const addProposal = async (proposal: Omit<Proposal, "id" | "createdAt" | "updatedAt">): Promise<Proposal> => {
  const now = new Date().toISOString();
  const dbProposal = {
    ...mapProposalToDB(proposal),
    created_at: now,
    updated_at: now
  };
  
  const { data, error } = await supabase
    .from('proposals')
    .insert([dbProposal])
    .select()
    .single();
  
  if (error) {
    console.error("Error adding proposal:", error);
    throw error;
  }
  
  return mapProposalFromDB(data);
};

export const updateProposal = async (proposal: Proposal): Promise<Proposal> => {
  const dbProposal = {
    ...mapProposalToDB(proposal),
    updated_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('proposals')
    .update(dbProposal)
    .eq('id', proposal.id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating proposal:", error);
    throw error;
  }
  
  return mapProposalFromDB(data);
};

export const sendProposal = async (id: string): Promise<Proposal | undefined> => {
  const now = new Date();
  const expiresAt = new Date();
  expiresAt.setDate(now.getDate() + 30); // Expira en 30 días
  
  const { data, error } = await supabase
    .from('proposals')
    .update({
      status: 'sent',
      sent_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      updated_at: now.toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error sending proposal:", error);
    throw error;
  }
  
  return mapProposalFromDB(data);
};

export const acceptProposal = async (id: string): Promise<Proposal | undefined> => {
  const { data, error } = await supabase
    .from('proposals')
    .update({
      status: 'accepted',
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error accepting proposal:", error);
    throw error;
  }
  
  return mapProposalFromDB(data);
};

export const rejectProposal = async (id: string): Promise<Proposal | undefined> => {
  const { data, error } = await supabase
    .from('proposals')
    .update({
      status: 'rejected',
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error rejecting proposal:", error);
    throw error;
  }
  
  return mapProposalFromDB(data);
};

export const deleteProposal = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('proposals')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting proposal:", error);
    throw error;
  }
};

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

// Función para crear una propuesta basada en un paquete
export const createProposalFromPack = async (
  clientId: string,
  packId: string,
  title: string,
  description: string,
  customPrice?: number,
  customFeatures?: string[]
): Promise<Proposal | undefined> => {
  try {
    const pack = await getSeoPack(packId);
    
    if (pack) {
      const proposal: Omit<Proposal, "id" | "createdAt" | "updatedAt"> = {
        clientId,
        packId,
        title,
        description,
        status: 'draft',
        customPrice,
        customFeatures
      };
      
      return addProposal(proposal);
    }
    
    return undefined;
  } catch (error) {
    console.error("Error creating proposal from pack:", error);
    throw error;
  }
};
