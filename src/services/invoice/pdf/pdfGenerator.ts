
/**
 * Core PDF generation functionality
 */

import jsPDF from "jspdf";
// Import jsPDF-autotable properly and ensure it's correctly initialized
import autoTable from "jspdf-autotable";
import { Invoice } from "@/types/invoice";
import { getClient } from "@/services/clientService";
import { 
  addCompanyHeader,
  addInvoiceInfo,
  addClientInfo,
  addInvoiceItems,
  addInvoiceTotals,
  addFooterWithPaymentInfo
} from "./pdfSections";

/**
 * Generates a PDF document for an invoice
 */
export const generateInvoicePdf = async (invoice: Invoice): Promise<Blob> => {
  // Create new document with proper initialization of autoTable plugin
  const doc = new jsPDF();
  
  // Ensure jsPDF-autotable is properly initialized
  if (typeof doc.autoTable !== 'function') {
    // @ts-ignore - Apply autoTable to doc object if needed
    autoTable(doc);
  }
  
  const client = await getClient(invoice.clientId);

  if (!client) {
    throw new Error("Client not found");
  }

  // Set document properties
  doc.setProperties({
    title: `Factura ${invoice.invoiceNumber}`,
    subject: `Factura para ${client.name}`,
    author: "SEO Dashboard",
    creator: "SEO Dashboard",
  });

  // Add company logo and header
  addCompanyHeader(doc);
  
  // Add invoice information
  addInvoiceInfo(doc, invoice);
  
  // Add client information
  addClientInfo(doc, client);
  
  // Add invoice items
  addInvoiceItems(doc, invoice);
  
  // Add invoice totals
  addInvoiceTotals(doc, invoice);
  
  // Add footer with payment information
  addFooterWithPaymentInfo(doc, invoice);

  // Generate the PDF as a blob
  const pdfBlob = doc.output("blob");
  return pdfBlob;
};
