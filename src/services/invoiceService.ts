
import { Invoice } from "@/types/invoice";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { mapInvoiceFromDB, mapInvoiceToDB } from "./invoice/invoiceMappers";
import { generateInvoiceNumber } from "./invoice/invoiceNumberGenerator";
import { generateInvoicePdf as generatePdf } from "./invoice/pdf/pdfGenerator";
import {
  downloadInvoicePdf,
  sendInvoiceByEmail,
  shareInvoice,
  getInvoiceByShareToken,
  markInvoiceAsPaid
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

// Generate PDF wrapper that first tries to get the invoice
export const generateInvoicePdf = async (invoiceId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single();
    
    if (error) {
      console.error("Error fetching invoice for PDF generation:", error);
      return false;
    }

    if (!data) {
      console.error("Invoice not found for PDF generation");
      return false;
    }

    const invoice = mapInvoiceFromDB(data);
    
    // Generate PDF and get blob
    const pdfBlob = await generatePdf(invoice);
    
    if (!pdfBlob) {
      console.error("Failed to generate PDF");
      return false;
    }
    
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
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);
    
    // Update the invoice with the PDF URL
    const { error: updateError } = await supabase
      .from('invoices')
      .update({ pdf_url: urlData.publicUrl })
      .eq('id', invoiceId);
    
    if (updateError) {
      console.error("Error updating invoice with PDF URL:", updateError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in generateInvoicePdf:", error);
    return false;
  }
};
