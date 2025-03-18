
import { supabase } from '@/integrations/supabase/client';
import { SeoContract } from '@/types/client';
import { mapContractFromDB } from './contractMappers';

// Export the contractCrud object with all functions
export const contractCrud = {
  getContracts,
  getClientContracts,
  getContract,
  createContract,
  updateContract,
  deleteContract,
  signContract
};

// Get all contracts
async function getContracts(): Promise<SeoContract[]> {
  try {
    const { data, error } = await supabase
      .from('seo_contracts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching contracts:", error);
      throw error;
    }
    
    return (data || []).map(mapContractFromDB);
  } catch (error) {
    console.error("Unexpected error in getContracts:", error);
    return [];
  }
}

// Get contracts for a specific client
async function getClientContracts(clientId: string): Promise<SeoContract[]> {
  try {
    if (!clientId) {
      console.error("Invalid clientId provided to getClientContracts:", clientId);
      return [];
    }

    console.log("Fetching client contracts with clientId:", clientId);
    const { data, error } = await supabase
      .from('seo_contracts')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching client contracts:", error);
      throw error;
    }
    
    console.log("Client contracts query result:", data);
    return (data || []).map(mapContractFromDB);
  } catch (error) {
    console.error("Unexpected error in getClientContracts:", error);
    return [];
  }
}

// Get a single contract by ID
async function getContract(id: string): Promise<SeoContract | undefined> {
  try {
    if (!id) {
      console.error("Invalid contract ID provided to getContract:", id);
      return undefined;
    }

    console.log("Fetching contract with ID:", id);
    const { data, error } = await supabase
      .from('seo_contracts')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching contract:", error);
      throw error;
    }
    
    if (!data) {
      console.log("No contract found with ID:", id);
      return undefined;
    }
    
    console.log("Contract found:", data.title);
    return mapContractFromDB(data);
  } catch (error) {
    console.error("Unexpected error in getContract:", error);
    return undefined;
  }
}

// Create a new contract
async function createContract(contract: Omit<SeoContract, "id" | "createdAt" | "updatedAt">): Promise<SeoContract> {
  try {
    if (!contract.clientId) {
      throw new Error("Client ID is required for contract creation");
    }
    
    console.log("Creating contract for client:", contract.clientId);
    
    // Cast content to any to avoid TypeScript type issues with Supabase Json type
    const { data, error } = await supabase
      .from('seo_contracts')
      .insert({
        client_id: contract.clientId,
        title: contract.title,
        start_date: contract.startDate,
        end_date: contract.endDate,
        phase1_fee: contract.phase1Fee,
        monthly_fee: contract.monthlyFee,
        status: contract.status,
        content: contract.content as any,
        signed_by_client: contract.signedByClient,
        signed_by_professional: contract.signedByProfessional,
        pdf_url: contract.pdfUrl
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating contract:", error);
      throw error;
    }
    
    console.log("Contract created successfully, ID:", data.id);
    return mapContractFromDB(data);
  } catch (error) {
    console.error("Unexpected error in createContract:", error);
    throw error;
  }
}

// Update an existing contract
async function updateContract(contract: SeoContract): Promise<SeoContract> {
  try {
    if (!contract.id) {
      throw new Error("Contract ID is required for update");
    }
    
    console.log("Updating contract:", contract.id);
    
    // Cast content to any to avoid TypeScript type issues with Supabase Json type
    const { data, error } = await supabase
      .from('seo_contracts')
      .update({
        client_id: contract.clientId,
        title: contract.title,
        start_date: contract.startDate,
        end_date: contract.endDate,
        phase1_fee: contract.phase1Fee,
        monthly_fee: contract.monthlyFee,
        status: contract.status,
        content: contract.content as any,
        signed_by_client: contract.signedByClient,
        signed_by_professional: contract.signedByProfessional,
        signed_at: contract.signedAt,
        pdf_url: contract.pdfUrl
      })
      .eq('id', contract.id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating contract:", error);
      throw error;
    }
    
    console.log("Contract updated successfully");
    return mapContractFromDB(data);
  } catch (error) {
    console.error("Unexpected error in updateContract:", error);
    throw error;
  }
}

// Function to delete a contract
async function deleteContract(contractId: string): Promise<boolean> {
  try {
    if (!contractId) {
      throw new Error("Contract ID is required for deletion");
    }
    
    console.log("Deleting contract:", contractId);
    
    const { error } = await supabase
      .from('seo_contracts')
      .delete()
      .eq('id', contractId);
    
    if (error) {
      console.error("Error deleting contract:", error);
      throw error;
    }
    
    console.log("Contract deleted successfully");
    return true;
  } catch (error) {
    console.error("Error in deleteContract:", error);
    return false;
  }
}

// Sign a contract (client or professional)
async function signContract(
  contractId: string, 
  signedBy: 'client' | 'professional'
): Promise<SeoContract> {
  const now = new Date().toISOString();
  
  const updates: Record<string, any> = {
    signed_at: now
  };
  
  if (signedBy === 'client') {
    updates.signed_by_client = true;
  } else {
    updates.signed_by_professional = true;
  }
  
  const { data, error } = await supabase
    .from('seo_contracts')
    .update(updates)
    .eq('id', contractId)
    .select()
    .single();
  
  if (error) {
    console.error("Error signing contract:", error);
    throw error;
  }
  
  return mapContractFromDB(data);
}
