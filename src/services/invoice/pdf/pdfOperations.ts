/**
 * PDF Operations for invoices (download, email, share, etc.)
 */
import { saveAs } from 'file-saver';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { generateInvoicePdf } from "@/services/invoiceService";
import { mapInvoiceFromDB } from "../invoiceMappers";
import { Invoice } from "@/types/invoiceTypes";
import { v4 as uuidv4 } from 'uuid';

/**
 * Downloads the PDF for an invoice
 */
export const downloadInvoicePdf = async (invoiceId: string): Promise<boolean> => {
  try {
    console.log("Downloading PDF for invoice:", invoiceId);
    
    // Get invoice data
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching invoice for download:", error);
      toast.error("Error al obtener la factura para descarga");
      return false;
    }
    
    if (!data) {
      toast.error("Factura no encontrada");
      return false;
    }
    
    const invoice = mapInvoiceFromDB(data);
    
    // If the invoice already has a PDF URL, download that instead of generating new
    if (invoice.pdfUrl) {
      console.log("Invoice already has PDF URL:", invoice.pdfUrl);
      // Fetch the PDF from the URL
      const response = await fetch(invoice.pdfUrl);
      const blob = await response.blob();
      const fileName = `Factura_${invoice.invoiceNumber}.pdf`;
      saveAs(blob, fileName);
      return true;
    }
    
    // Otherwise generate a new PDF
    console.log("No PDF URL found. Generating PDF first...");
    const success = await generateInvoicePdf(invoiceId);
    
    if (!success) {
      console.error("Failed to generate PDF for download");
      toast.error("Error al generar el PDF para descarga");
      return false;
    }
    
    // Fetch the invoice again to get the updated PDF URL
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
    
    const updatedInvoice = mapInvoiceFromDB(updatedData);
    
    if (!updatedInvoice.pdfUrl) {
      console.error("Updated invoice still doesn't have a PDF URL");
      toast.error("La factura no tiene una URL de PDF");
      return false;
    }
    
    // Fetch and download the PDF
    const response = await fetch(updatedInvoice.pdfUrl);
    const blob = await response.blob();
    const fileName = `Factura_${updatedInvoice.invoiceNumber}.pdf`;
    saveAs(blob, fileName);
    
    return true;
  } catch (error) {
    console.error("Error in downloadInvoicePdf:", error);
    toast.error("Error al descargar el PDF");
    return false;
  }
};

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

/**
 * Share an invoice - creates a share token and returns share URL
 */
export const shareInvoice = async (invoiceId: string): Promise<string | null> => {
  try {
    console.log("Sharing invoice:", invoiceId);
    
    // Generate a share token
    const shareToken = uuidv4();
    
    // Update the invoice with the share token and timestamp
    const { error } = await supabase
      .from('invoices')
      .update({
        share_token: shareToken,
        shared_at: new Date().toISOString()
      })
      .eq('id', invoiceId);
    
    if (error) {
      console.error("Error updating invoice with share token:", error);
      return null;
    }
    
    // Return the share URL - adjust the URL format according to your app's routing
    const baseUrl = window.location.origin;
    return `${baseUrl}/invoices/share/${shareToken}`;
  } catch (error) {
    console.error("Error in shareInvoice:", error);
    return null;
  }
};

/**
 * Get invoice by share token
 */
export const getInvoiceByShareToken = async (shareToken: string): Promise<Invoice | null> => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*, clients(name, company, email, phone)')
      .eq('share_token', shareToken)
      .maybeSingle();
    
    if (error || !data) {
      console.error("Error fetching invoice by share token:", error || "No data returned");
      return null;
    }
    
    return mapInvoiceFromDB(data);
  } catch (error) {
    console.error("Error in getInvoiceByShareToken:", error);
    return null;
  }
};

/**
 * Mark an invoice as paid
 */
export const markInvoiceAsPaid = async (invoiceId: string): Promise<boolean> => {
  try {
    const now = new Date().toISOString();
    
    const { error } = await supabase
      .from('invoices')
      .update({
        status: 'paid',
        payment_date: now,
        updated_at: now
      })
      .eq('id', invoiceId);
    
    if (error) {
      console.error("Error marking invoice as paid:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error marking invoice as paid:", error);
    return false;
  }
};
