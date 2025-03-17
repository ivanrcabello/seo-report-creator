
import { Invoice } from "@/types/invoice";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { mapInvoiceFromDB } from "./invoice/invoiceMappers";
import { generateInvoiceNumber } from "./invoice/invoiceNumberGenerator";
import { generateInvoicePdf as generatePdf } from "./invoice/pdf/pdfGenerator";
import {
  downloadInvoicePdf,
  sendInvoiceByEmail,
  shareInvoice,
  getInvoiceByShareToken
} from "./invoice/pdf/pdfOperations";

// Re-export invoice CRUD operations
export { 
  getInvoices,
  getInvoice,
  getClientInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  markInvoiceAsPaid,
  createInvoiceFromProposal
} from "./invoice/invoiceCrud";

// Re-export PDF operations
export { 
  downloadInvoicePdf,
  sendInvoiceByEmail, 
  shareInvoice,
  getInvoiceByShareToken
};

// Generate PDF wrapper that first gets the invoice, then generates PDF
export const generateInvoicePdf = async (invoiceId: string): Promise<boolean> => {
  try {
    console.log("Starting PDF generation for invoice ID:", invoiceId);
    
    // Get the invoice data first
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching invoice for PDF generation:", error);
      return false;
    }

    if (!data) {
      console.error("Invoice not found for PDF generation");
      return false;
    }

    const invoice = mapInvoiceFromDB(data);
    console.log("Invoice data retrieved:", invoice);
    
    // Generate PDF and get blob
    const pdfBlob = await generatePdf(invoice);
    
    if (!pdfBlob) {
      console.error("Failed to generate PDF");
      return false;
    }
    
    console.log("PDF blob generated successfully");
    
    // Upload the PDF to storage and get URL
    const fileName = `invoice_${invoice.invoiceNumber}_${Date.now()}.pdf`;
    const filePath = `invoices/${invoiceId}/${fileName}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, pdfBlob, {
        contentType: 'application/pdf',
        upsert: true
      });
    
    if (uploadError) {
      console.error("Error uploading invoice PDF:", uploadError);
      return false;
    }
    
    console.log("PDF uploaded successfully");
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);
    
    console.log("PDF URL:", urlData.publicUrl);
    
    // Update the invoice with the PDF URL
    const { error: updateError } = await supabase
      .from('invoices')
      .update({ pdf_url: urlData.publicUrl })
      .eq('id', invoiceId);
    
    if (updateError) {
      console.error("Error updating invoice with PDF URL:", updateError);
      return false;
    }
    
    console.log("Invoice updated with PDF URL successfully");
    return true;
  } catch (error) {
    console.error("Error in generateInvoicePdf:", error);
    return false;
  }
};
