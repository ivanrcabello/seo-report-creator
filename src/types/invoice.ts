

export type InvoiceStatus = "pending" | "paid" | "cancelled" | "draft";

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  tax: number;
}

export interface Invoice {
  id: string;
  number: string;
  invoiceNumber: string;  // For backward compatibility
  clientId: string;
  clientName: string;
  date: string;
  issueDate: string;      // For backward compatibility
  dueDate: string;
  packId?: string;
  proposalId?: string;
  status: InvoiceStatus;
  items?: InvoiceItem[];
  subtotal: number;
  baseAmount: number;      // For backward compatibility
  tax: number;
  taxRate: number;         // For backward compatibility
  taxAmount: number;       // For backward compatibility
  total: number;
  totalAmount: number;     // For backward compatibility
  notes?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string | null;
  paymentDate?: string;     // For backward compatibility
  pdfUrl?: string;
}

export interface CompanySettings {
  id: string;
  companyName: string;
  taxId: string;
  address: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  bankAccount?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  createdAt: string;
  updatedAt: string;
}

