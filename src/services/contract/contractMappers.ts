
import { SeoContract } from '@/types/client';

// Export the contractMappers object
export const contractMappers = {
  mapContractFromDB
};

// Map contract from database format to application format
export function mapContractFromDB(contract: any): SeoContract {
  // Handle the content field properly to ensure it matches the expected structure
  let parsedContent = contract.content;
  
  // If content is a string, try to parse it as JSON
  if (typeof contract.content === 'string') {
    try {
      parsedContent = JSON.parse(contract.content);
    } catch (e) {
      console.error("Failed to parse contract content:", e);
      // Fallback to default content structure
      parsedContent = {
        sections: [],
        clientInfo: {
          name: "",
          company: "",
          address: "",
          taxId: ""
        },
        professionalInfo: {
          name: "",
          company: "",
          address: "",
          taxId: ""
        }
      };
    }
  }
  
  // Ensure content has the correct structure with default values for missing fields
  if (!parsedContent || typeof parsedContent !== 'object') {
    parsedContent = {
      sections: [],
      clientInfo: {
        name: "",
        company: "",
        address: "",
        taxId: ""
      },
      professionalInfo: {
        name: "",
        company: "",
        address: "",
        taxId: ""
      }
    };
  }
  
  // Ensure sections exists
  if (!parsedContent.sections) {
    parsedContent.sections = [];
  }
  
  // Ensure clientInfo exists
  if (!parsedContent.clientInfo) {
    parsedContent.clientInfo = {
      name: "",
      company: "",
      address: "",
      taxId: ""
    };
  }
  
  // Ensure professionalInfo exists
  if (!parsedContent.professionalInfo) {
    parsedContent.professionalInfo = {
      name: "",
      company: "",
      address: "",
      taxId: ""
    };
  }
  
  return {
    id: contract.id,
    clientId: contract.client_id,
    title: contract.title,
    startDate: contract.start_date,
    endDate: contract.end_date,
    phase1Fee: contract.phase1_fee,
    monthlyFee: contract.monthly_fee,
    status: contract.status as "draft" | "active" | "completed" | "cancelled",
    content: parsedContent,
    createdAt: contract.created_at,
    updatedAt: contract.updated_at,
    signedAt: contract.signed_at,
    signedByClient: contract.signed_by_client,
    signedByProfessional: contract.signed_by_professional,
    pdfUrl: contract.pdf_url,
    shareToken: contract.share_token,
    sharedAt: contract.shared_at
  };
}
