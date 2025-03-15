
import { Invoice } from "@/types/invoice";
import { v4 as uuidv4 } from "uuid";

/**
 * Converts database invoice data to application format
 */
export const mapInvoiceFromDB = (invoice: any): Invoice => ({
  id: invoice.id,
  number: invoice.invoice_number || '',  // Ensure number is always set
  invoiceNumber: invoice.invoice_number,
  clientId: invoice.client_id,
  clientName: invoice.client_name || 'Unknown Client',
  date: invoice.issue_date || invoice.created_at,
  issueDate: invoice.issue_date,
  dueDate: invoice.due_date || '',
  packId: invoice.pack_id,
  proposalId: invoice.proposal_id,
  baseAmount: invoice.base_amount,
  subtotal: invoice.base_amount || 0,
  taxRate: invoice.tax_rate || 21,
  tax: invoice.tax_rate || 21,
  taxAmount: invoice.tax_amount,
  totalAmount: invoice.total_amount,
  total: invoice.total_amount || 0,
  status: invoice.status,
  paymentDate: invoice.payment_date,
  notes: invoice.notes,
  pdfUrl: invoice.pdf_url,
  createdAt: invoice.created_at,
  updatedAt: invoice.updated_at,
  items: invoice.items || [],
  paidAt: invoice.payment_date
});

/**
 * Converts application invoice data to database format
 */
export const mapInvoiceToDB = (invoice: Partial<Invoice>) => {
  // For new invoices without an ID, generate one
  const id = invoice.id || uuidv4();
  
  return {
    id,
    invoice_number: invoice.invoiceNumber || invoice.number,
    client_id: invoice.clientId,
    client_name: invoice.clientName || 'Unknown Client',
    issue_date: invoice.issueDate || invoice.date,
    due_date: invoice.dueDate,
    pack_id: invoice.packId,
    proposal_id: invoice.proposalId,
    base_amount: invoice.baseAmount || invoice.subtotal,
    tax_rate: invoice.taxRate || invoice.tax,
    tax_amount: invoice.taxAmount,
    total_amount: invoice.totalAmount || invoice.total,
    status: invoice.status,
    payment_date: invoice.paymentDate || invoice.paidAt,
    notes: invoice.notes,
    pdf_url: invoice.pdfUrl,
    updated_at: invoice.updatedAt,
    created_at: invoice.createdAt
  };
};
