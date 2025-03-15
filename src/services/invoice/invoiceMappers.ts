
import { Invoice } from "@/types/invoice";

/**
 * Converts database invoice data to application format
 */
export const mapInvoiceFromDB = (invoice: any): Invoice => ({
  id: invoice.id,
  invoiceNumber: invoice.invoice_number,
  clientId: invoice.client_id,
  issueDate: invoice.issue_date,
  dueDate: invoice.due_date,
  packId: invoice.pack_id,
  proposalId: invoice.proposal_id,
  baseAmount: invoice.base_amount,
  taxRate: invoice.tax_rate,
  taxAmount: invoice.tax_amount,
  totalAmount: invoice.total_amount,
  status: invoice.status,
  paymentDate: invoice.payment_date,
  notes: invoice.notes,
  pdfUrl: invoice.pdf_url,
  createdAt: invoice.created_at,
  updatedAt: invoice.updated_at
});

/**
 * Converts application invoice data to database format
 */
export const mapInvoiceToDB = (invoice: Partial<Invoice>) => ({
  id: invoice.id, // Include ID for update operations
  invoice_number: invoice.invoiceNumber,
  client_id: invoice.clientId,
  issue_date: invoice.issueDate,
  due_date: invoice.dueDate,
  pack_id: invoice.packId,
  proposal_id: invoice.proposalId,
  base_amount: invoice.baseAmount,
  tax_rate: invoice.taxRate,
  tax_amount: invoice.taxAmount,
  total_amount: invoice.totalAmount,
  status: invoice.status,
  payment_date: invoice.paymentDate,
  notes: invoice.notes,
  pdf_url: invoice.pdfUrl
});
