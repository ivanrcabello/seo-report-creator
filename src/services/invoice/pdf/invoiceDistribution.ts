
import { supabase } from "@/integrations/supabase/client";

/**
 * Downloads an invoice PDF
 */
export const downloadInvoicePdf = async (invoiceId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('pdf_url')
      .eq('id', invoiceId)
      .single();
    
    if (error) {
      console.error("Error fetching PDF URL:", error);
      return false;
    }
    
    const pdfUrl = data?.pdf_url;
    
    if (!pdfUrl) {
      console.error("PDF URL not found for invoice:", invoiceId);
      return false;
    }
    
    // Trigger the download by creating a temporary link
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `invoice-${invoiceId}.pdf`; // Suggest a filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up
    
    return true;
    
  } catch (error) {
    console.error("Error downloading PDF:", error);
    return false;
  }
};

/**
 * Sends an invoice by email
 */
export const sendInvoiceByEmail = async (invoiceId: string): Promise<boolean> => {
  try {
    // Simulate sending the invoice by email
    console.log(`Simulating sending invoice ${invoiceId} by email`);
    
    // Fetch the invoice details (including client email)
    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .select('*, clients (email)')
      .eq('id', invoiceId)
      .single();
    
    if (invoiceError) {
      console.error("Error fetching invoice data:", invoiceError);
      return false;
    }
    
    const invoice = invoiceData as any; // Adjust type if necessary
    const clientEmail = invoice?.clients?.email;
    
    if (!clientEmail) {
      console.error("Client email not found for invoice:", invoiceId);
      return false;
    }
    
    // Here you would integrate with an email service provider
    // to actually send the email with the PDF attachment.
    console.log(`Sending invoice ${invoiceId} to ${clientEmail}`);
    
    // Placeholder for email sending logic
    // await sendEmail(clientEmail, `Invoice ${invoiceId}`, "Please find attached your invoice.");
    
    return true;
    
  } catch (error) {
    console.error("Error sending invoice by email:", error);
    return false;
  }
};
