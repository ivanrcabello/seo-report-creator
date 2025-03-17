
/**
 * PDF Generation for invoices
 */
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Invoice } from '@/types/invoice';
import { getClient } from '@/services/clientService';
import { getCompanySettings } from '@/services/settingsService';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

// Import functions from pdfSections.ts
import { 
  addCompanyHeader,
  addClientInfo,
  addInvoiceInfo,
  addInvoiceItems,
  addInvoiceTotals,
  addFooterWithPaymentInfo
} from './pdfSections';

// Import styles from pdfStyles.ts
import { textStyles, tableStyles, getStatusColor, getStatusText } from './pdfStyles';

// Add autoTable to jsPDF prototype
jsPDF.prototype.autoTable = autoTable;

/**
 * Generates an invoice PDF
 */
export const generateInvoicePdf = async (invoice: Invoice): Promise<Blob | null> => {
  try {
    console.log("Generating PDF for invoice:", invoice.id);
    
    // Fetch additional data needed for the PDF
    const client = await getClient(invoice.clientId);
    const companySettings = await getCompanySettings();
    
    if (!client) {
      console.error("Could not find client:", invoice.clientId);
      return null;
    }
    
    if (!companySettings) {
      console.error("Could not find company settings");
      return null;
    }
    
    // Create a new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    // Add company header
    addCompanyHeader(doc);
    
    // Add client details
    addClientInfo(doc, client);
    
    // Add invoice details (invoice number, date, etc.)
    addInvoiceInfo(doc, invoice);
    
    // Add invoice items (if any)
    addInvoiceItems(doc, invoice);
    
    // Add invoice totals
    addInvoiceTotals(doc, invoice);
    
    // Add footer
    addFooterWithPaymentInfo(doc, invoice);
    
    // Create a blob from the PDF
    const pdfBlob = doc.output('blob');
    
    // If the invoice is not a draft, upload the PDF to storage
    if (invoice.status !== 'draft') {
      try {
        // Upload the PDF to Supabase Storage
        const fileName = `invoice_${invoice.invoiceNumber}_${Date.now()}.pdf`;
        const filePath = `invoices/${invoice.id}/${fileName}`;
        
        const { data, error } = await supabase.storage
          .from('documents')
          .upload(filePath, pdfBlob, {
            contentType: 'application/pdf',
            upsert: true
          });
        
        if (error) {
          console.error("Error uploading PDF:", error);
        } else {
          // Get the public URL
          const { data: urlData } = supabase.storage
            .from('documents')
            .getPublicUrl(filePath);
          
          // Update the invoice with the PDF URL
          await supabase
            .from('invoices')
            .update({ pdf_url: urlData.publicUrl })
            .eq('id', invoice.id);
        }
      } catch (uploadError) {
        console.error("Error in PDF upload process:", uploadError);
      }
    }
    
    return pdfBlob;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return null;
  }
};
