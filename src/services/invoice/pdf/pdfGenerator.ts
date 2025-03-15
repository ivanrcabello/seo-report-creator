
/**
 * Core PDF generation functionality
 */

import jsPDF from "jspdf";
import 'jspdf-autotable'; // Import as a side effect to extend jsPDF
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
  try {
    console.log("Starting PDF generation for invoice:", invoice.invoiceNumber);
    
    // Create new document
    const doc = new jsPDF();
    
    console.log("Fetching client data for ID:", invoice.clientId);
    const client = await getClient(invoice.clientId);

    if (!client) {
      throw new Error(`Client not found for ID: ${invoice.clientId}`);
    }
    
    console.log("Client data loaded successfully:", client.name);

    // Set document properties
    doc.setProperties({
      title: `Factura ${invoice.invoiceNumber}`,
      subject: `Factura para ${client.name}`,
      author: "SEO Dashboard",
      creator: "SEO Dashboard",
    });

    console.log("Adding company header to PDF");
    // Add company logo and header
    addCompanyHeader(doc);
    
    console.log("Adding invoice information to PDF");
    // Add invoice information
    addInvoiceInfo(doc, invoice);
    
    console.log("Adding client information to PDF");
    // Add client information
    addClientInfo(doc, client);
    
    console.log("Adding invoice items to PDF");
    // Add invoice items
    addInvoiceItems(doc, invoice);
    
    console.log("Adding invoice totals to PDF");
    // Add invoice totals
    addInvoiceTotals(doc, invoice);
    
    console.log("Adding footer with payment information to PDF");
    // Add footer with payment information
    addFooterWithPaymentInfo(doc, invoice);

    console.log("PDF generation completed, creating blob");
    // Generate the PDF as a blob
    const pdfBlob = doc.output("blob");
    return pdfBlob;
  } catch (error) {
    console.error("Error generating invoice PDF:", error);
    throw error;
  }
};
