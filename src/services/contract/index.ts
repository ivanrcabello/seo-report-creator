
import { SeoContract } from "@/types/client";
import { supabase } from "@/integrations/supabase/client";
import { mapContractFromDB } from "./contractMappers";

// Export contract service functions
export { 
  getContracts,
  getContract,
  deleteContract
};

// Re-export from separate modules
export { generateContractPDF, saveContractPDF } from "./contractPdf";
export { 
  createContract, 
  updateContract, 
  getClientContracts 
} from "./contractCrud";
export { 
  signContractByClient, 
  getContractByShareToken,
  shareContract 
} from "./contractSharing";
export { createDefaultContractSections } from "./contractSections";

// Get all contracts from database
async function getContracts(): Promise<SeoContract[]> {
  try {
    const { data, error } = await supabase
      .from("seo_contracts")
      .select("*");

    if (error) {
      console.error("Error fetching contracts:", error);
      return [];
    }

    if (!data) {
      console.log("No contracts found");
      return [];
    }

    // Map each contract from DB format to application format
    return data.map(contract => mapContractFromDB(contract));
  } catch (error) {
    console.error("Error in getContracts:", error);
    return [];
  }
}

// Get a single contract by ID
async function getContract(contractId: string): Promise<SeoContract | null> {
  try {
    const { data, error } = await supabase
      .from("seo_contracts")
      .select("*")
      .eq("id", contractId)
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching contract:", error);
      return null;
    }

    if (!data) {
      console.log("No contract found with ID:", contractId);
      return null;
    }

    // Map the contract from DB format to application format
    return mapContractFromDB(data);
  } catch (error) {
    console.error("Error in getContract:", error);
    return null;
  }
}

// Delete a contract by ID
async function deleteContract(contractId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("seo_contracts")
      .delete()
      .eq("id", contractId);

    if (error) {
      console.error("Error deleting contract:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteContract:", error);
    return false;
  }
}
