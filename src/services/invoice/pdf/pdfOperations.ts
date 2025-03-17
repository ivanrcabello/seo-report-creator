
/**
 * PDF Operations for invoices (download, email, share, etc.)
 */
import { Invoice, CompanySettings } from "@/types/invoice";
import { Client } from "@/types/client";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { generateInvoicePdf } from "@/services/invoiceService";
import { mapInvoiceFromDB } from "../invoiceMappers";

/**
 * Downloads an invoice PDF
 */
export const downloadInvoicePdf = async (invoiceId: string): Promise<boolean> => {
  try {
    console.log("Downloading PDF for invoice:", invoiceId);
    
    // First check if the invoice has a PDF URL
    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .select('pdf_url, invoice_number')
      .eq('id', invoiceId)
      .maybeSingle();
    
    if (invoiceError) {
      console.error("Error fetching invoice for PDF download:", invoiceError);
      return false;
    }
    
    if (!invoiceData) {
      console.error("Invoice not found for PDF download");
      return false;
    }
    
    // If there's no PDF URL, generate one first
    if (!invoiceData.pdf_url) {
      console.log("No PDF URL found. Generating PDF first...");
      const generated = await generateInvoicePdf(invoiceId);
      
      if (!generated) {
        console.error("Failed to generate PDF for download");
        return false;
      }
      
      // Fetch the updated invoice with the PDF URL
      const { data: updatedInvoice, error: updateFetchError } = await supabase
        .from('invoices')
        .select('pdf_url, invoice_number')
        .eq('id', invoiceId)
        .maybeSingle();
      
      if (updateFetchError || !updatedInvoice?.pdf_url) {
        console.error("Error fetching updated invoice with PDF URL:", updateFetchError);
        return false;
      }
      
      // Now we have a PDF URL to download
      const pdfUrl = updatedInvoice.pdf_url;
      const invoiceNumber = updatedInvoice.invoice_number;
      
      // Create a temporary anchor to download the file
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `Factura_${invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } else {
      // We already have a PDF URL, download it directly
      const pdfUrl = invoiceData.pdf_url;
      const invoiceNumber = invoiceData.invoice_number;
      
      // Create a temporary anchor to download the file
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `Factura_${invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    }
  } catch (error) {
    console.error("Error downloading invoice PDF:", error);
    return false;
  }
};

/**
 * Sends an invoice by email
 */
export const sendInvoiceByEmail = async (invoiceId: string): Promise<boolean> => {
  try {
    console.log("Sending invoice by email:", invoiceId);
    
    // First ensure the invoice has a PDF URL
    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .select('pdf_url, client_id')
      .eq('id', invoiceId)
      .maybeSingle();
    
    if (invoiceError) {
      console.error("Error fetching invoice for email:", invoiceError);
      return false;
    }
    
    if (!invoiceData) {
      console.error("Invoice not found for email");
      return false;
    }
    
    // If there's no PDF URL, generate one first
    if (!invoiceData.pdf_url) {
      console.log("No PDF URL found. Generating PDF first...");
      const generated = await generateInvoicePdf(invoiceId);
      
      if (!generated) {
        console.error("Failed to generate PDF for email");
        return false;
      }
    }
    
    // Get client email
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('email, name')
      .eq('id', invoiceData.client_id)
      .maybeSingle();
    
    if (clientError || !clientData) {
      console.error("Error fetching client for email:", clientError);
      return false;
    }
    
    // In a real application, you'd call an Email API here
    // For this demo, we'll just simulate success
    console.log(`Email would be sent to ${clientData.email} with invoice PDF`);
    
    // Set a timeout to simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  } catch (error) {
    console.error("Error sending invoice by email:", error);
    return false;
  }
};

/**
 * Shares an invoice by creating a unique share token
 */
export const shareInvoice = async (invoiceId: string): Promise<{ url: string } | null> => {
  try {
    console.log("Sharing invoice:", invoiceId);
    
    // First ensure the invoice has a PDF URL
    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .select('pdf_url')
      .eq('id', invoiceId)
      .maybeSingle();
    
    if (invoiceError) {
      console.error("Error fetching invoice for sharing:", invoiceError);
      return null;
    }
    
    if (!invoiceData) {
      console.error("Invoice not found for sharing");
      return null;
    }
    
    // If there's no PDF URL, generate one first
    if (!invoiceData.pdf_url) {
      console.log("No PDF URL found. Generating PDF first...");
      const generated = await generateInvoicePdf(invoiceId);
      
      if (!generated) {
        console.error("Failed to generate PDF for sharing");
        return null;
      }
    }
    
    // Generate a unique share token
    const shareToken = uuidv4();
    
    // Check if there's already a share token for this invoice
    const { data: existingShare, error: checkError } = await supabase
      .from('invoice_shares')
      .select('share_token')
      .eq('invoice_id', invoiceId)
      .maybeSingle();
    
    if (checkError) {
      console.error("Error checking existing shares:", checkError);
    }
    
    if (existingShare) {
      // Use the existing share token
      return {
        url: `${window.location.origin}/shared/invoice/${existingShare.share_token}`
      };
    }
    
    // Insert the share record
    const { error } = await supabase
      .from('invoice_shares')
      .insert({
        invoice_id: invoiceId,
        share_token: shareToken
      });
    
    if (error) {
      console.error("Error sharing invoice:", error);
      toast.error("Error al compartir la factura");
      return null;
    }
    
    // Return the URL that can be used to access the shared invoice
    return {
      url: `${window.location.origin}/shared/invoice/${shareToken}`
    };
  } catch (error) {
    console.error("Error sharing invoice:", error);
    toast.error("Error al compartir la factura");
    return null;
  }
};

/**
 * Gets an invoice by its share token
 */
export const getInvoiceByShareToken = async (shareToken: string): Promise<{
  invoice: Invoice | null;
  client: Client | null;
  company: CompanySettings | null;
}> => {
  try {
    console.log("Getting invoice by share token:", shareToken);
    
    // Get the invoice_id from the share token
    const { data: shareData, error: shareError } = await supabase
      .from('invoice_shares')
      .select('invoice_id')
      .eq('share_token', shareToken)
      .maybeSingle();
    
    if (shareError || !shareData) {
      console.error("Error getting shared invoice:", shareError);
      return { invoice: null, client: null, company: null };
    }
    
    // Get the invoice using the invoice_id
    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', shareData.invoice_id)
      .maybeSingle();
    
    if (invoiceError || !invoiceData) {
      console.error("Error getting invoice data:", invoiceError);
      return { invoice: null, client: null, company: null };
    }
    
    const invoice = mapInvoiceFromDB(invoiceData);
    
    // Get the client data
    let client: Client | null = null;
    if (invoice.clientId) {
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', invoice.clientId)
        .maybeSingle();
      
      if (!clientError && clientData) {
        client = {
          id: clientData.id,
          name: clientData.name,
          company: clientData.company,
          email: clientData.email,
          phone: clientData.phone,
          website: clientData.website,
          isActive: clientData.is_active,
          createdAt: clientData.created_at,
          notes: clientData.notes || []
        };
      }
    }
    
    // Get the company settings
    let company: CompanySettings | null = null;
    const { data: companyData, error: companyError } = await supabase
      .from('company_settings')
      .select('*')
      .maybeSingle();
    
    if (!companyError && companyData) {
      company = {
        id: companyData.id,
        companyName: companyData.company_name,
        taxId: companyData.tax_id,
        address: companyData.address,
        phone: companyData.phone,
        email: companyData.email,
        logoUrl: companyData.logo_url,
        createdAt: companyData.created_at,
        updatedAt: companyData.updated_at
      };
    }
    
    return { invoice, client, company };
  } catch (error) {
    console.error("Error getting invoice by share token:", error);
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
