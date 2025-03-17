
import { supabase } from "@/integrations/supabase/client";
import { SeoContract } from "@/types/client";
import { getContract } from "./contractCrud";
import { mapContractFromDB } from "./contractMappers";

// Fetch a shared contract using its token
export const getContractByShareToken = async (token: string): Promise<SeoContract | null> => {
  try {
    // Query for contracts with the provided share token
    const { data, error } = await supabase
      .from("seo_contracts")
      .select("*")
      .eq("share_token", token)
      .limit(1);
    
    if (error) {
      console.error("Error fetching contract by share token:", error);
      return null;
    }

    if (!data || data.length === 0) {
      console.log("No contract found with token:", token);
      return null;
    }

    // Map from database format to application format
    return mapContractFromDB(data[0]);
  } catch (error) {
    console.error("Error in getContractByShareToken:", error);
    return null;
  }
};

// Generate and save a share token for a contract
export const generateContractShareToken = async (contractId: string): Promise<string | null> => {
  try {
    // Generate a random token
    const token = Math.random().toString(36).substring(2, 15) + 
                 Math.random().toString(36).substring(2, 15);
    
    // Save the token to the database
    const { error } = await supabase
      .from("seo_contracts")
      .update({ 
        share_token: token,
        shared_at: new Date().toISOString()
      })
      .eq("id", contractId);

    if (error) {
      console.error("Error generating share token:", error);
      return null;
    }

    return token;
  } catch (error) {
    console.error("Error in generateContractShareToken:", error);
    return null;
  }
};

// Get the share URL for a contract
export const getContractShareUrl = (token: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/share/contract/${token}`;
};

// Generate and get the share URL for a contract
export const generateShareableContractUrl = async (contractId: string): Promise<string | null> => {
  const token = await generateContractShareToken(contractId);
  if (!token) return null;
  
  return getContractShareUrl(token);
};
