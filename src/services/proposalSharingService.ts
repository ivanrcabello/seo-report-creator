
import { supabase } from "@/integrations/supabase/client";
import { Proposal } from "@/types/client";

// Fetch a shared proposal using its token
export const getProposalByShareToken = async (token: string): Promise<Proposal | null> => {
  try {
    const { data, error } = await supabase
      .from("proposals")
      .select("*")
      .eq("share_token", token)
      .single();

    if (error) {
      console.error("Error fetching proposal by share token:", error);
      return null;
    }

    if (!data) {
      return null;
    }

    // Map from database format to application format
    const proposal: Proposal = {
      id: data.id,
      clientId: data.client_id,
      packId: data.pack_id,
      title: data.title,
      description: data.description,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      expiresAt: data.expires_at,
      status: data.status,
      customPrice: data.custom_price,
      customFeatures: data.custom_features,
      shareToken: data.share_token,
      sentAt: data.sent_at
    };

    return proposal;
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
