
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Invoice, CompanySettings } from "@/types/invoice"; 
import { Client } from "@/types/client";
import { mapInvoiceFromDB } from "../invoiceMappers";

/**
 * Shares an invoice by creating a unique share token
 */
export const shareInvoice = async (invoiceId: string): Promise<{ url: string } | null> => {
  try {
    // Generate a unique share token
    const shareToken = uuidv4();
    
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
    // Get the invoice_id from the share token
    const { data: shareData, error: shareError } = await supabase
      .from('invoice_shares')
      .select('invoice_id')
      .eq('share_token', shareToken)
      .single();
    
    if (shareError || !shareData) {
      console.error("Error getting shared invoice:", shareError);
      return { invoice: null, client: null, company: null };
    }
    
    // Get the invoice using the invoice_id
    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', shareData.invoice_id)
      .single();
    
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
        .single();
      
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
      .single();
    
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
