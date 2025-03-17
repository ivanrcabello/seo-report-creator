
import { jsPDF } from "jspdf";
import 'jspdf-autotable'; // Importación crucial para habilitar el plugin autoTable
import { Invoice } from "@/types/invoiceTypes";
import { 
  addCompanyHeader,
  addInvoiceHeader,
  addClientInfo,
  addInvoiceItems,
  addInvoiceTotals,
  addInvoiceNotes,
  addInvoiceFooter
} from "./pdfSections";

/**
 * Generates a PDF for the specified invoice and returns it as a Blob
 */
export const generateInvoicePdf = async (
  invoice: Invoice
): Promise<Blob | null> => {
  try {
    console.log("Generating PDF for invoice:", invoice.id);
    
    // Create a new PDF document
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });
    
    // Add sections to the PDF document
    addCompanyHeader(doc);
    addInvoiceHeader(doc, invoice);
    addClientInfo(doc, invoice);
    addInvoiceItems(doc, invoice);
    addInvoiceTotals(doc, invoice);
    
    if (invoice.notes) {
      addInvoiceNotes(doc, invoice.notes);
    }
    
    addInvoiceFooter(doc);
    
    // Return the PDF as a Blob
    const pdfBlob = doc.output('blob');
    return pdfBlob;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return null;
  }
};
