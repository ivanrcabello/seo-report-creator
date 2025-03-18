
import { supabase } from "@/integrations/supabase/client";
import { SeoContract } from "@/types/client";
import { mapContractFromDB } from "./contractMappers";

export const contractCrud = {
  createContract,
  updateContract,
  getClientContracts
};

// Create a new contract
export const createContract = async (contractData: Partial<SeoContract>): Promise<SeoContract | null> => {
  try {
    const { data, error } = await supabase
      .from("seo_contracts")
      .insert([
        {
          client_id: contractData.clientId,
          title: contractData.title,
          start_date: contractData.startDate,
          end_date: contractData.endDate,
          phase1_fee: contractData.phase1Fee,
          monthly_fee: contractData.monthlyFee,
          status: contractData.status || 'draft',
          content: contractData.content || { 
            sections: [],
            clientInfo: { name: "", company: "", address: "", taxId: "" },
            professionalInfo: { 
              name: "", 
              company: "", 
              address: "", 
              taxId: "" 
            }
          }
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating contract:", error);
      return null;
    }

    if (!data) {
      console.log("No data returned after contract creation");
      return null;
    }

    return mapContractFromDB(data);
  } catch (error) {
    console.error("Error in createContract:", error);
    return null;
  }
};

// Update an existing contract
export const updateContract = async (contractId: string, updates: Partial<SeoContract>): Promise<SeoContract | null> => {
  try {
    const updateData: any = {};
    
    // Map fields from application format to DB format
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.clientId !== undefined) updateData.client_id = updates.clientId;
    if (updates.startDate !== undefined) updateData.start_date = updates.startDate;
    if (updates.endDate !== undefined) updateData.end_date = updates.endDate;
    if (updates.phase1Fee !== undefined) updateData.phase1_fee = updates.phase1Fee;
    if (updates.monthlyFee !== undefined) updateData.monthly_fee = updates.monthlyFee;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.content !== undefined) updateData.content = updates.content;
    
    const { data, error } = await supabase
      .from("seo_contracts")
      .update(updateData)
      .eq("id", contractId)
      .select()
      .single();

    if (error) {
      console.error("Error updating contract:", error);
      return null;
    }

    if (!data) {
      console.log("No data returned after contract update");
      return null;
    }

    return mapContractFromDB(data);
  } catch (error) {
    console.error("Error in updateContract:", error);
    return null;
  }
};

// Get all contracts for a specific client
export const getClientContracts = async (clientId: string): Promise<SeoContract[]> => {
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
};
