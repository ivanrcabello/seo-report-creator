
import { supabase } from "@/integrations/supabase/client";
import { Proposal } from "@/types/client";
import { mapProposalFromDB } from "./proposal/proposalMappers";

// Fetch a shared proposal using its token
export const getProposalByShareToken = async (token: string): Promise<Proposal | null> => {
  try {
    // Using a simpler approach with explicit query structure
    const { data, error } = await supabase
      .from("proposals")
      .select("*")
      .eq("public_url", token)
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
    
    // Save the token to the database using the public_url field
    const { error } = await supabase
      .from("proposals")
      .update({ 
        public_url: token,
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

// Generate and get the public URL for a proposal
export const generatePublicProposalUrl = async (proposalId: string): Promise<string | null> => {
  const token = await generateProposalShareToken(proposalId);
  if (!token) return null;
  return getProposalShareUrl(token);
};
