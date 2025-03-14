
import { Client, SeoPack } from "@/types/client";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  issueDate: string;
  dueDate?: string;
  packId?: string;
  proposalId?: string;
  baseAmount: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  status: "pending" | "paid" | "cancelled";
  paymentDate?: string;
  notes?: string;
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanySettings {
  id: string;
  companyName: string;
  taxId: string; // CIF/NIF
  address: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceDetailProps {
  invoice: Invoice;
  client: Client | null;
  company: CompanySettings | null;
  packName: string | null;
  onDelete: () => Promise<void>;
  onMarkAsPaid: () => Promise<void>;
}
