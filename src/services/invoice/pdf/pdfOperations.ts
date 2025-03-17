
/**
 * PDF Operations for invoices (download, email, share, etc.)
 */
import { saveAs } from 'file-saver';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { generateInvoicePdf } from "@/services/invoiceService";
import { mapInvoiceFromDB, mapInvoiceToDB } from "../invoiceMappers";
import { Invoice, InvoiceShareResponse, ShareInvoiceResult } from "@/types/invoiceTypes";
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
export const shareInvoice = async (invoiceId: string): Promise<InvoiceShareResponse | null> => {
  try {
    console.log("Sharing invoice:", invoiceId);
    
    // Generate a share token
    const shareToken = uuidv4();
    const now = new Date().toISOString();
    
    // First, check if we need to create an invoice_shares entry
    const { data: sharesData, error: sharesError } = await supabase
      .from('invoice_shares')
      .select('*')
      .eq('invoice_id', invoiceId)
      .maybeSingle();
    
    if (sharesError) {
      console.error("Error checking for existing share:", sharesError);
      // Continue anyway to try the direct update
    }
    
    if (!sharesData) {
      // Create a new entry in invoice_shares
      const { error: insertError } = await supabase
        .from('invoice_shares')
        .insert({
          invoice_id: invoiceId,
          share_token: shareToken
        });
      
      if (insertError) {
        console.error("Error creating invoice share:", insertError);
        return null;
      }
    } else {
      // Update existing share token
      const { error: updateShareError } = await supabase
        .from('invoice_shares')
        .update({
          share_token: shareToken
        })
        .eq('invoice_id', invoiceId);
      
      if (updateShareError) {
        console.error("Error updating invoice share:", updateShareError);
        return null;
      }
    }
    
    // Return the share URL
    const baseUrl = window.location.origin;
    return {
      url: `${baseUrl}/invoices/share/${shareToken}`
    };
  } catch (error) {
    console.error("Error in shareInvoice:", error);
    return null;
  }
};

/**
 * Get invoice by share token
 */
export const getInvoiceByShareToken = async (shareToken: string): Promise<ShareInvoiceResult> => {
  try {
    // First, get the invoice_id from the invoice_shares table
    const { data: shareData, error: shareError } = await supabase
      .from('invoice_shares')
      .select('invoice_id')
      .eq('share_token', shareToken)
      .maybeSingle();
    
    if (shareError || !shareData) {
      console.error("Error fetching invoice share:", shareError || "No data returned");
      return { invoice: null, client: null, company: null };
    }
    
    // Now get the invoice with that ID
    const { data, error } = await supabase
      .from('invoices')
      .select('*, clients(*)')
      .eq('id', shareData.invoice_id)
      .maybeSingle();
    
    if (error || !data) {
      console.error("Error fetching invoice by share token:", error || "No data returned");
      return { invoice: null, client: null, company: null };
    }
    
    const invoice = mapInvoiceFromDB(data);
    
    // Extract client data
    const client = data.clients ? {
      id: data.clients.id,
      name: data.clients.name,
      company: data.clients.company,
      email: data.clients.email,
      phone: data.clients.phone
    } : null;
    
    // Get company settings
    const { data: companyData, error: companyError } = await supabase
      .from('company_settings')
      .select('*')
      .single();
      
    const company = companyError || !companyData ? null : {
      id: companyData.id,
      companyName: companyData.company_name,
      taxId: companyData.tax_id,
      address: companyData.address,
      phone: companyData.phone,
      email: companyData.email,
      logoUrl: companyData.logo_url,
      bankAccount: companyData.bank_account || '',
      createdAt: companyData.created_at,
      updatedAt: companyData.updated_at
    };
    
    return { invoice, client, company };
  } catch (error) {
    console.error("Error in getInvoiceByShareToken:", error);
    return { invoice: null, client: null, company: null };
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
