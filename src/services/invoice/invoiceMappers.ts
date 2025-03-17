
import { Invoice } from "@/types/invoiceTypes";

export const mapInvoiceFromDB = (data: any): Invoice => {
  // Asegurarnos de que el nombre del cliente se extrae correctamente
  const clientName = data.clients?.name || null;

  return {
    id: data.id,
    invoiceNumber: data.invoice_number,
    clientId: data.client_id,
    // Añadimos el nombre del cliente si está disponible
    clientName: clientName,
    issueDate: data.issue_date,
    dueDate: data.due_date,
    packId: data.pack_id,
    proposalId: data.proposal_id,
    baseAmount: data.base_amount,
    taxRate: data.tax_rate,
    taxAmount: data.tax_amount,
    totalAmount: data.total_amount,
    status: data.status,
    paymentDate: data.payment_date,
    notes: data.notes,
    pdfUrl: data.pdf_url,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    shareToken: data.share_token,
    sharedAt: data.shared_at
  };
};

export const mapInvoiceToDB = (invoice: Partial<Invoice>): any => {
  return {
    id: invoice.id,
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
    pdf_url: invoice.pdfUrl,
    created_at: invoice.createdAt,
    updated_at: invoice.updatedAt,
    share_token: invoice.shareToken,
    shared_at: invoice.sharedAt
  };
};
