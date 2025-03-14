
import { Proposal } from "@/types/client";
import { supabase } from "@/integrations/supabase/client";
import { mapProposalFromDB } from "./proposalMappers";

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
