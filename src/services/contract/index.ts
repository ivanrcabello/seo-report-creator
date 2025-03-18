
import { supabase } from "@/integrations/supabase/client";
import { SeoContract } from "@/types/client";
import { contractCrud } from './contractCrud';
import { contractMappers } from './contractMappers';
import { contractPdf } from './contractPdf';
import { contractSections } from './contractSections';
import { contractSharing } from './contractSharing';

// Export all modules to use them individually
export * from './contractCrud';
export * from './contractMappers';
export * from './contractPdf';
export * from './contractSections';
export * from './contractSharing';

// Get all contracts
export const getContracts = async (): Promise<SeoContract[]> => {
  try {
    console.log("Fetching all contracts from Supabase");
    const { data, error } = await supabase
      .from('seo_contracts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error getting contracts:", error);
      throw error;
    }
    
    console.log(`Retrieved ${data?.length || 0} contracts`);
    
    return data?.map(contract => ({
      id: contract.id,
      title: contract.title,
      status: contract.status,
      clientId: contract.client_id,
      startDate: contract.start_date,
      endDate: contract.end_date,
      monthlyFee: contract.monthly_fee,
      phase1Fee: contract.phase1_fee,
      content: contract.content || {},
      pdfUrl: contract.pdf_url,
      shareToken: contract.share_token,
      sharedAt: contract.shared_at,
      signedByClient: contract.signed_by_client,
      signedByProfessional: contract.signed_by_professional,
      signedAt: contract.signed_at,
      createdAt: contract.created_at,
      updatedAt: contract.updated_at
    })) || [];
  } catch (error) {
    console.error("Error in getContracts:", error);
    return [];
  }
};

// Get a specific contract
export const getContract = async (id: string): Promise<SeoContract | null> => {
  try {
    console.log("Fetching contract with ID:", id);
    const { data, error } = await supabase
      .from('seo_contracts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error getting contract:", error);
      return null;
    }
    
    return {
      id: data.id,
      title: data.title,
      status: data.status,
      clientId: data.client_id,
      startDate: data.start_date,
      endDate: data.end_date,
      monthlyFee: data.monthly_fee,
      phase1Fee: data.phase1_fee,
      content: data.content || {},
      pdfUrl: data.pdf_url,
      shareToken: data.share_token,
      sharedAt: data.shared_at,
      signedByClient: data.signed_by_client,
      signedByProfessional: data.signed_by_professional,
      signedAt: data.signed_at,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error("Error in getContract:", error);
    return null;
  }
};

// Delete a contract
export const deleteContract = async (id: string): Promise<boolean> => {
  try {
    console.log("Deleting contract with ID:", id);
    const { error } = await supabase
      .from('seo_contracts')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting contract:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteContract:", error);
    return false;
  }
};
