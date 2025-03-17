
/**
 * Invoice email functionality
 */
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { generateInvoicePdf } from "@/services/invoiceService";
import { mapInvoiceFromDB } from "../invoiceMappers";

/**
 * Sends an invoice by email
 */
export const sendInvoiceByEmail = async (invoiceId: string): Promise<boolean> => {
  try {
    console.log("Sending invoice by email:", invoiceId);
    
    // Get invoice data
    const { data, error } = await supabase
      .from('invoices')
      .select('*, clients(name, email)')
      .eq('id', invoiceId)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching invoice for email:", error);
      toast.error("Error al obtener la factura para enviar por email");
      return false;
    }
    
    if (!data) {
      toast.error("Factura no encontrada");
      return false;
    }
    
    const invoice = mapInvoiceFromDB(data);
    
    // Check if client has an email
    if (!data.clients || !data.clients.email) {
      toast.error("El cliente no tiene un email asociado");
      return false;
    }
    
    // If invoice has no PDF URL, generate one
    if (!invoice.pdfUrl) {
      console.log("No PDF URL found. Generating PDF first...");
      const success = await generateInvoicePdf(invoiceId);
      
      if (!success) {
        console.error("Failed to generate PDF for email");
        toast.error("Error al generar el PDF para el email");
        return false;
      }
      
      // Fetch updated invoice with PDF URL
      const { data: updatedData, error: fetchError } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', invoiceId)
        .maybeSingle();
      
      if (fetchError || !updatedData) {
        console.error("Error fetching updated invoice:", fetchError);
        toast.error("Error al obtener la factura actualizada");
        return false;
      }
      
      invoice.pdfUrl = updatedData.pdf_url;
    }
    
    // Call an RPC function or API to send the email
    // TODO: Implement actual email sending functionality
    // For now, we'll just simulate it with a delay
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Log the email details and return success
    console.log("Email would be sent to:", data.clients.email);
    console.log("With PDF URL:", invoice.pdfUrl);
    
    return true;
  } catch (error) {
    console.error("Error in sendInvoiceByEmail:", error);
    toast.error("Error al enviar el email");
    return false;
  }
};
