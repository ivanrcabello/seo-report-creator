
/**
 * PDF Generation for invoices
 */
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Invoice } from '@/types/invoice';
import { getClient } from '@/services/clientService';
import { getCompanySettings } from '@/services/settingsService';
import { mapInvoiceFromDB } from '../invoiceMappers';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

// Utility functions for PDF generation
import { 
  PDFHeaderSection, 
  PDFClientSection, 
  PDFInvoiceDetailsSection,
  PDFItemsSection,
  PDFTotalsSection,
  PDFFooterSection
} from './pdfSections';

// PDF styling
import { getBaseStyles, getPDFColors } from './pdfStyles';

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
    
    // Set PDF styles
    const styles = getBaseStyles();
    const colors = getPDFColors(companySettings);
    
    // Add company header
    PDFHeaderSection(doc, companySettings, colors, styles);
    
    // Add client details
    PDFClientSection(doc, client, styles);
    
    // Add invoice details (invoice number, date, etc.)
    PDFInvoiceDetailsSection(doc, invoice, styles);
    
    // Add invoice items (if any)
    PDFItemsSection(doc, invoice, colors, styles);
    
    // Add invoice totals
    PDFTotalsSection(doc, invoice, styles);
    
    // Add footer
    PDFFooterSection(doc, companySettings, styles);
    
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
