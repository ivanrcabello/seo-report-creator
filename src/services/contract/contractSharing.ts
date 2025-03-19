
import { supabase } from "@/integrations/supabase/client";
import { SeoContract } from "@/types/client";
import { mapContractFromDB } from "./contractMappers";
import { v4 as uuidv4 } from "uuid";

/**
 * Get a contract by its share token
 */
export async function getContractByShareToken(token: string): Promise<SeoContract | null> {
  try {
    const { data, error } = await supabase
      .from('seo_contracts')
      .select('*')
      .eq('share_token', token)
      .single();

    if (error) {
      console.error("Error fetching contract by share token:", error);
      return null;
    }

    if (!data) {
      return null;
    }

    return mapContractFromDB(data);
  } catch (error) {
    console.error("Error in getContractByShareToken:", error);
    return null;
  }
}

/**
 * Sign a contract by client
 */
export async function signContractByClient(contractId: string, clientName: string): Promise<boolean> {
  try {
    const now = new Date().toISOString();
    
    const { error } = await supabase
      .from('seo_contracts')
      .update({
        signed_by_client: true,
        signed_at: now
      })
      .eq('id', contractId);

    if (error) {
      console.error("Error signing contract by client:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in signContractByClient:", error);
    return false;
  }
}

/**
 * Generate and save a share token for a contract
 */
export async function createContractShareToken(contractId: string): Promise<string | null> {
  try {
    const shareToken = uuidv4();
    const now = new Date().toISOString();
    
    const { error } = await supabase
      .from('seo_contracts')
      .update({
        share_token: shareToken,
        shared_at: now
      })
      .eq('id', contractId);

    if (error) {
      console.error("Error creating contract share token:", error);
      return null;
    }

    return shareToken;
  } catch (error) {
    console.error("Error in createContractShareToken:", error);
    return null;
  }
}
