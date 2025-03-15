
/**
 * Core PDF generation functionality
 */

import jsPDF from "jspdf";
import "jspdf-autotable"; // Import as a side effect to extend jsPDF
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

// Extend the jsPDF type to include autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable?: { finalY: number };
  }
}

/**
 * Generates a PDF document for an invoice
 */
export const generateInvoicePdf = async (invoice: Invoice): Promise<Blob> => {
  // Create new document
  const doc = new jsPDF();
  
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
