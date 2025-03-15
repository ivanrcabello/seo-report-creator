
import { supabase } from "@/integrations/supabase/client";
import { Proposal } from "@/types/client";
import { mapProposalFromDB } from "./proposal/proposalMappers";

// Define a simple type for the raw database proposal to help TypeScript
type RawProposal = {
  id: string;
  client_id: string;
  pack_id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  sent_at?: string;
  expires_at?: string;
  custom_price?: number;
  custom_features?: string[];
  report_ids?: string[];
  public_url?: string;
  share_token?: string;
};

// Fetch a shared proposal using its token
export const getProposalByShareToken = async (token: string): Promise<Proposal | null> => {
  try {
    // Use explicit typing to avoid excessive type inference
    const { data, error } = await supabase
      .from("proposals")
      .select("*")
      .eq("share_token", token)
      .limit(1) as { data: RawProposal[] | null, error: any };
    
    if (error) {
      console.error("Error fetching proposal by share token:", error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    // Map from database format to application format using the existing mapper
    return mapProposalFromDB(data[0]);
  } catch (error) {
    console.error("Error in getProposalByShareToken:", error);
    return null;
  }
};

// Generate and save a share token for a proposal
export const generateProposalShareToken = async (proposalId: string): Promise<string | null> => {
  try {
    // Generate a random token
    const token = Math.random().toString(36).substring(2, 15) + 
                 Math.random().toString(36).substring(2, 15);
    
    // Save the token to the database
    const { error } = await supabase
      .from("proposals")
      .update({ 
        share_token: token,
        sent_at: new Date().toISOString()
      })
      .eq("id", proposalId);

    if (error) {
      console.error("Error generating share token:", error);
      return null;
    }

    return token;
  } catch (error) {
    console.error("Error in generateProposalShareToken:", error);
    return null;
  }
};

// Get the share URL for a proposal
export const getProposalShareUrl = (token: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/proposal-share/${token}`;
};
