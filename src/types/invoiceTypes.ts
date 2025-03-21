
/**
 * Common invoice types shared between components and services
 */

/**
 * Invoice status options
 */
export type InvoiceStatus = "draft" | "pending" | "paid" | "cancelled";

/**
 * Base Invoice interface containing all properties
 */
export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName?: string;
  issueDate: string;
  dueDate?: string;
  packId?: string;
  proposalId?: string;
  baseAmount: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  status: InvoiceStatus;
  paymentDate?: string;
  notes?: string;
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
  shareToken?: string;  // Added for invoice sharing
  sharedAt?: string;    // Added for invoice sharing
  // Campos opcionales para visualización
  items?: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
}

/**
 * Invoice form values used in forms and submissions
 */
export interface InvoiceFormValues {
  clientId: string;
  packId?: string;
  proposalId?: string;
  baseAmount: number;
  taxRate: number;
  status: InvoiceStatus;
  issueDate: string;
  dueDate?: string;
  notes?: string;
  invoiceNumber?: string;
}

/**
 * Company settings used in invoice displays and PDF generation
 */
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

/**
 * Invoice share response 
 */
export interface InvoiceShareResponse {
  url: string;
}

/**
 * Share invoice result containing all needed entities
 */
export interface ShareInvoiceResult {
  invoice: Invoice | null;
  client: any | null;  // Using any for now, should be updated to use Client type
  company: CompanySettings | null;
}
