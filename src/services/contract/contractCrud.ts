
import { supabase } from "@/integrations/supabase/client";
import { SeoContract, ContractSection } from "@/types/client";
import { mapContractFromDB } from "./contractMappers";

// Export contract CRUD operations
export {
  createContract,
  updateContract,
  getClientContracts
};

// Create a new contract
export async function createContract(contractData: Omit<SeoContract, "id" | "createdAt" | "updatedAt">): Promise<SeoContract> {
  try {
    // Map SeoContract to DB schema
    const dbData = {
      client_id: contractData.clientId,
      title: contractData.title,
      start_date: contractData.startDate,
      end_date: contractData.endDate,
      phase1_fee: contractData.phase1Fee,
      monthly_fee: contractData.monthlyFee,
      status: contractData.status || 'draft',
      content: contractData.content,
      signed_by_client: contractData.signedByClient || false,
      signed_by_professional: contractData.signedByProfessional || false
    };

    const { data, error } = await supabase
      .from("seo_contracts")
      .insert(dbData)
      .select()
      .single();

    if (error) {
      console.error("Error creating contract:", error);
      throw new Error(`Failed to create contract: ${error.message}`);
    }

    if (!data) {
      throw new Error("No data returned after contract creation");
    }

    return mapContractFromDB(data);
  } catch (error) {
    console.error("Error in createContract:", error);
    throw error;
  }
}

// Update an existing contract
export async function updateContract(contract: SeoContract): Promise<SeoContract> {
  try {
    // Map SeoContract to DB schema
    const dbData = {
      client_id: contract.clientId,
      title: contract.title,
      start_date: contract.startDate,
      end_date: contract.endDate,
      phase1_fee: contract.phase1Fee,
      monthly_fee: contract.monthlyFee,
      status: contract.status,
      content: contract.content,
      signed_by_client: contract.signedByClient,
      signed_by_professional: contract.signedByProfessional,
      pdf_url: contract.pdfUrl,
      share_token: contract.shareToken,
      shared_at: contract.sharedAt,
      signed_at: contract.signedAt
    };

    const { data, error } = await supabase
      .from("seo_contracts")
      .update(dbData)
      .eq("id", contract.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating contract:", error);
      throw new Error(`Failed to update contract: ${error.message}`);
    }

    if (!data) {
      throw new Error("No data returned after contract update");
    }

    return mapContractFromDB(data);
  } catch (error) {
    console.error("Error in updateContract:", error);
    throw error;
  }
}

// Get all contracts for a specific client
export async function getClientContracts(clientId: string): Promise<SeoContract[]> {
  try {
    const { data, error } = await supabase
      .from("seo_contracts")
      .select("*")
      .eq("client_id", clientId);

    if (error) {
      console.error("Error fetching client contracts:", error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log("No contracts found for client:", clientId);
      return [];
    }

    return data.map(contract => mapContractFromDB(contract));
  } catch (error) {
    console.error("Error in getClientContracts:", error);
    return [];
  }
}
