
import { Invoice } from "@/types/invoice";
import { v4 as uuidv4 } from "uuid";

/**
 * Converts database invoice data to application format
 */
export const mapInvoiceFromDB = (invoice: any): Invoice => ({
  id: invoice.id,
  number: invoice.invoice_number || '',  // Keep for compatibility
  invoiceNumber: invoice.invoice_number,
  clientId: invoice.client_id,
  clientName: invoice.client_name || 'Unknown Client',
  date: invoice.issue_date || invoice.created_at, // Keep for compatibility
  issueDate: invoice.issue_date,
  dueDate: invoice.due_date || '',
  packId: invoice.pack_id,
  proposalId: invoice.proposal_id,
  baseAmount: invoice.base_amount,
  subtotal: invoice.base_amount || 0, // Keep for compatibility
  taxRate: invoice.tax_rate || 21,
  tax: invoice.tax_rate || 21, // Keep for compatibility
  taxAmount: invoice.tax_amount,
  totalAmount: invoice.total_amount,
  total: invoice.total_amount || 0, // Keep for compatibility
  status: invoice.status,
  paymentDate: invoice.payment_date,
  notes: invoice.notes,
  pdfUrl: invoice.pdf_url,
  createdAt: invoice.created_at,
  updatedAt: invoice.updated_at,
  items: invoice.items || [],
  paidAt: invoice.payment_date // Keep for compatibility
});

/**
 * Converts application invoice data to database format
 */
export const mapInvoiceToDB = (invoice: Partial<Invoice>) => {
  // For new invoices without an ID, generate one
  const id = invoice.id || uuidv4();
  
  return {
    id,
    invoice_number: invoice.invoiceNumber || invoice.number, // Handle both property names
    client_id: invoice.clientId,
    client_name: invoice.clientName || 'Unknown Client',
    issue_date: invoice.issueDate || invoice.date, // Handle both property names
    due_date: invoice.dueDate,
    pack_id: invoice.packId,
    proposal_id: invoice.proposalId,
    base_amount: invoice.baseAmount || invoice.subtotal, // Handle both property names
    tax_rate: invoice.taxRate || invoice.tax, // Handle both property names
    tax_amount: invoice.taxAmount,
    total_amount: invoice.totalAmount || invoice.total, // Handle both property names
    status: invoice.status,
    payment_date: invoice.paymentDate || invoice.paidAt, // Handle both property names
    notes: invoice.notes,
    pdf_url: invoice.pdfUrl,
    updated_at: invoice.updatedAt,
    created_at: invoice.createdAt
  };
};
