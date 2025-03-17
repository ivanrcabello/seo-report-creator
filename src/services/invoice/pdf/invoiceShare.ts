
/**
 * Invoice sharing functionality
 */
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { InvoiceShareResponse, ShareInvoiceResult } from "@/types/invoiceTypes";
import { mapInvoiceFromDB } from "../invoiceMappers";

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
      bankAccount: companyData.bank_account ?? '',
      createdAt: companyData.created_at,
      updatedAt: companyData.updated_at
    };
    
    return { invoice, client, company };
  } catch (error) {
    console.error("Error in getInvoiceByShareToken:", error);
    return { invoice: null, client: null, company: null };
  }
};
