
import { SeoContract } from '@/types/client';

// Export the contractMappers object
export const contractMappers = {
  mapContractFromDB
};

// Map contract from database format to application format
export const mapContractFromDB = (contract: any): SeoContract => ({
  id: contract.id,
  clientId: contract.client_id,
  title: contract.title,
  startDate: contract.start_date,
  endDate: contract.end_date,
  phase1Fee: contract.phase1_fee,
  monthlyFee: contract.monthly_fee,
  status: contract.status as "draft" | "active" | "completed" | "cancelled",
  content: contract.content || {
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
  },
  createdAt: contract.created_at,
  updatedAt: contract.updated_at,
  signedAt: contract.signed_at,
  signedByClient: contract.signed_by_client,
  signedByProfessional: contract.signed_by_professional,
  pdfUrl: contract.pdf_url,
  shareToken: contract.share_token,
  sharedAt: contract.shared_at
});
