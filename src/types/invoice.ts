
export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  issueDate: string;
  dueDate?: string | null;
  packId?: string | null;
  proposalId?: string | null;
  baseAmount: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  status: "pending" | "paid" | "cancelled";
  paymentDate?: string | null;
  notes?: string | null;
  pdfUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CompanySettings {
  id: string;
  companyName: string;
  taxId: string;
  address: string;
  phone?: string | null;
  email?: string | null;
  logoUrl?: string | null;
  bankAccount?: string | null;
  createdAt: string;
  updatedAt: string;
}
