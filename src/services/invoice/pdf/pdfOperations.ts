
import { toast } from "sonner";
import { Invoice } from "@/types/invoice";
import { getInvoice } from "../invoiceCrud";
import { generateInvoicePdf } from "./pdfGenerator";
import { supabase } from "@/integrations/supabase/client";

/**
 * Downloads an invoice as PDF
 */
export const downloadInvoicePdf = async (id: string): Promise<boolean> => {
  try {
    console.log("Downloading invoice PDF for:", id);
    const invoice = await getInvoice(id);
    if (!invoice) {
      toast.error("Factura no encontrada");
      return false;
    }
    
    // Generate PDF
    const pdfBlob = await generateInvoicePdf(invoice);
    if (!pdfBlob) {
      toast.error("Error al generar el PDF");
      return false;
    }
    
    // Create a download link
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `factura_${invoice.invoiceNumber}.pdf`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    
    toast.success("PDF descargado correctamente");
    return true;
  } catch (error) {
    console.error("Error downloading invoice PDF:", error);
    toast.error("Error al descargar el PDF");
    return false;
  }
};

/**
 * Sends an invoice via email
 */
export const sendInvoiceByEmail = async (id: string): Promise<boolean> => {
  try {
    console.log("Sending invoice by email:", id);
    const invoice = await getInvoice(id);
    if (!invoice) {
      toast.error("Factura no encontrada");
      return false;
    }
    
    // Generate PDF first if it doesn't exist
    if (!invoice.pdfUrl) {
      await generateInvoicePdf(invoice);
      // Fetch updated invoice with PDF URL
      const updatedInvoice = await getInvoice(id);
      if (!updatedInvoice || !updatedInvoice.pdfUrl) {
        toast.error("Error al generar el PDF");
        return false;
      }
    }
    
    // For now, this is just a mock implementation
    // In a real app, you would call a server function to send the email
    toast.success("Factura enviada por email correctamente");
    return true;
  } catch (error) {
    console.error("Error sending invoice email:", error);
    toast.error("Error al enviar el email");
    return false;
  }
};

/**
 * Generate and get the share URL for an invoice
 */
export const generateShareableInvoiceUrl = async (invoiceId: string): Promise<string | null> => {
  const token = await generateInvoiceShareToken(invoiceId);
  if (!token) return null;
  
  return getInvoiceShareUrl(token);
};

/**
 * Generate and save a share token for an invoice
 */
export const generateInvoiceShareToken = async (invoiceId: string): Promise<string | null> => {
  try {
    // Generate a random token
    const token = Math.random().toString(36).substring(2, 15) + 
                 Math.random().toString(36).substring(2, 15);
    
    // Save the token to the database
    const { error } = await supabase
      .from("invoices")
      .update({ 
        share_token: token,
        shared_at: new Date().toISOString()
      })
      .eq("id", invoiceId);

    if (error) {
      console.error("Error generating share token:", error);
      return null;
    }

    return token;
  } catch (error) {
    console.error("Error in generateInvoiceShareToken:", error);
    return null;
  }
};

/**
 * Get the share URL for an invoice
 */
export const getInvoiceShareUrl = (token: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/share/invoice/${token}`;
};

/**
 * Share an invoice (generate token and return URL)
 */
export const shareInvoice = async (invoiceId: string): Promise<{ url: string } | null> => {
  try {
    const token = await generateInvoiceShareToken(invoiceId);
    
    if (!token) {
      console.error("Failed to generate share token for invoice:", invoiceId);
      return null;
    }
    
    return { url: getInvoiceShareUrl(token) };
  } catch (error) {
    console.error("Error sharing invoice:", error);
    return null;
  }
};

/**
 * Fetch a shared invoice using its token
 */
export const getInvoiceByShareToken = async (token: string): Promise<Invoice | null> => {
  try {
    // Query for invoices with the provided share token
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("share_token", token)
      .limit(1);
    
    if (error) {
      console.error("Error fetching invoice by share token:", error);
      return null;
    }

    if (!data || data.length === 0) {
      console.log("No invoice found with token:", token);
      return null;
    }

    // Map the invoice from database format
    const invoice: Invoice = {
      id: data[0].id,
      invoiceNumber: data[0].invoice_number,
      clientId: data[0].client_id,
      issueDate: data[0].issue_date,
      dueDate: data[0].due_date,
      packId: data[0].pack_id,
      proposalId: data[0].proposal_id,
      baseAmount: data[0].base_amount,
      taxRate: data[0].tax_rate,
      taxAmount: data[0].tax_amount,
      totalAmount: data[0].total_amount,
      status: data[0].status,
      paymentDate: data[0].payment_date,
      notes: data[0].notes,
      pdfUrl: data[0].pdf_url,
      createdAt: data[0].created_at,
      updatedAt: data[0].updated_at
    };

    return invoice;
  } catch (error) {
    console.error("Error in getInvoiceByShareToken:", error);
    return null;
  }
};
