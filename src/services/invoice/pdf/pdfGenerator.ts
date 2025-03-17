
/**
 * PDF generator for invoices
 */
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Invoice } from "@/types/invoiceTypes";
import { addCompanyInfo, addClientInfo, addInvoiceHeader, addInvoiceItems, addInvoiceFooter } from './pdfSections';
import { getCompanySettings } from "@/services/settingsService";

/**
 * Generate a PDF for an invoice
 */
export const generateInvoicePdf = async (invoice: Invoice): Promise<Blob | null> => {
  try {
    console.log("Generating PDF for invoice:", invoice.invoiceNumber);
    
    // Get company settings
    const companySettings = await getCompanySettings();
    if (!companySettings) {
      console.error("Company settings not found");
      return null;
    }
    
    // Create PDF document
    const doc = new jsPDF();
    
    // Add company info
    addCompanyInfo(doc, companySettings);
    
    // Add client info
    addClientInfo(doc, invoice);
    
    // Add invoice header
    addInvoiceHeader(doc, invoice);
    
    // Add invoice items
    addInvoiceItems(doc, invoice);
    
    // Add invoice footer
    addInvoiceFooter(doc, invoice, companySettings);
    
    // Return the PDF as blob
    return doc.output('blob');
  } catch (error) {
    console.error("Error generating PDF:", error);
    return null;
  }
};
