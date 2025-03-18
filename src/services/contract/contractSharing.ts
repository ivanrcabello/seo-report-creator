
import { supabase } from "@/integrations/supabase/client";
import { SeoContract } from "@/types/client";
import { mapContractFromDB } from "./contractMappers";
import { v4 as uuidv4 } from "uuid";

// Get contract by share token
export async function getContractByShareToken(token: string): Promise<SeoContract | null> {
  try {
    const { data, error } = await supabase
      .from("seo_contracts")
      .select("*")
      .eq("share_token", token)
      .single();

    if (error) {
      console.error("Error finding contract by share token:", error);
      return null;
    }

    return mapContractFromDB(data);
  } catch (error) {
    console.error("Error in getContractByShareToken:", error);
    return null;
  }
}

// Sign contract by client
export async function signContractByClient(contractId: string, clientName: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("seo_contracts")
      .update({
        signed_by_client: true,
        signed_at: new Date().toISOString()
      })
      .eq("id", contractId);

    if (error) {
      console.error("Error signing contract:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in signContractByClient:", error);
    return false;
  }
}

// Share contract (generate share token)
export async function shareContract(contractId: string): Promise<string | null> {
  try {
    const shareToken = uuidv4();
    
    const { error } = await supabase
      .from("seo_contracts")
      .update({
        share_token: shareToken,
        shared_at: new Date().toISOString()
      })
      .eq("id", contractId);

    if (error) {
      console.error("Error sharing contract:", error);
      return null;
    }

    return shareToken;
  } catch (error) {
    console.error("Error in shareContract:", error);
    return null;
  }
}
