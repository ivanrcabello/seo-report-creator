
import { Proposal } from "@/types/client";
import { supabase } from "@/integrations/supabase/client";
import { mapProposalFromDB, mapProposalToDB } from "./proposalMappers";

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
