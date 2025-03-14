
import { Proposal, ClientReport } from "@/types/client";
import { v4 as uuidv4 } from "uuid";
import { getSeoPack } from "./packService";
import { getReport, shareReport } from "./clientService";
import { generatePublicProposalUrl } from "./reportSharingService";
import { supabase } from "@/integrations/supabase/client";

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
  
  return data || [];
};

export const getAllProposals = async (): Promise<Proposal[]> => {
  const { data, error } = await supabase
    .from('proposals')
    .select('*');
  
  if (error) {
    console.error("Error fetching all proposals:", error);
    return [];
  }
  
  return data || [];
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
  
  return data || undefined;
};

export const addProposal = async (proposal: Omit<Proposal, "id" | "createdAt" | "updatedAt">): Promise<Proposal> => {
  const now = new Date().toISOString();
  const newProposal = {
    ...proposal,
    created_at: now,
    updated_at: now
  };
  
  const { data, error } = await supabase
    .from('proposals')
    .insert([newProposal])
    .select()
    .single();
  
  if (error) {
    console.error("Error adding proposal:", error);
    throw error;
  }
  
  return data;
};

export const updateProposal = async (proposal: Proposal): Promise<Proposal> => {
  const updatedProposal = {
    ...proposal,
    updated_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('proposals')
    .update(updatedProposal)
    .eq('id', proposal.id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating proposal:", error);
    throw error;
  }
  
  return data;
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
  
  return data;
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
  
  return data;
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
  
  return data;
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
  
  return data;
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
  
  return data;
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
