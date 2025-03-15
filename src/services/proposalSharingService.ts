
import { supabase } from "@/integrations/supabase/client";
import { Proposal } from "@/types/client";
import { mapProposalFromDB } from "./proposal/proposalMappers";

// Fetch a shared proposal using its token
export const getProposalByShareToken = async (token: string): Promise<Proposal | null> => {
  try {
    // Use a simpler approach with .single() and handle potential errors
    const { data, error } = await supabase
      .from("proposals")
      .select()
      .eq("share_token", token)
      .limit(1);
    
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
