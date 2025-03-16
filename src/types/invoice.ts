
export interface Invoice {
  id: string;
  invoiceNumber: string;
  number?: string; // Added for compatibility with mappers
  clientId: string;
  clientName?: string; // Added for display purposes
  issueDate: string;
  date?: string; // Added for compatibility with forms
  dueDate?: string;
  packId?: string;
  proposalId?: string;
  baseAmount: number;
  subtotal?: number; // Added for compatibility with forms
  taxRate: number;
  tax?: number; // Added for compatibility with forms
  taxAmount: number;
  totalAmount: number;
  total?: number; // Added for compatibility with forms
  status: "pending" | "paid" | "cancelled" | "draft";
  paymentDate?: string;
  paidAt?: string; // Added for compatibility with forms
  notes?: string;
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
  items?: any[]; // Added for invoice items support
}

export interface CompanySettings {
  id: string;
  companyName: string;
  taxId: string;
  address: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  bankAccount?: string;
  createdAt: string;
  updatedAt: string;
}
