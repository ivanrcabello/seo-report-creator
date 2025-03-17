
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { Invoice, CompanySettings } from "@/types/invoice";
import { Client } from "@/types/client";
import { mapInvoiceFromDB } from "../invoiceMappers";

/**
 * Share an invoice using a unique token
 */
export const shareInvoice = async (invoiceId: string): Promise<{ url: string } | null> => {
  try {
    const shareToken = uuidv4();
    
    // Update invoice with share token and timestamp
    const { data, error } = await supabase
      .from('invoices')
      .update({
        shared_at: new Date().toISOString(),
        share_token: shareToken
      } as {
        shared_at: string;
        share_token: string;
      })
      .eq('id', invoiceId)
      .select();
    
    if (error) {
      console.error('Error sharing invoice:', error);
      return null;
    }

    // Use window.location.origin to get the base URL
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/invoice-share/${shareToken}`;

    return { url: shareUrl };
  } catch (error) {
    console.error('Error in shareInvoice:', error);
    return null;
  }
};

/**
 * Get an invoice using its share token
 */
export const getInvoiceByShareToken = async (shareToken: string): Promise<{ invoice: Invoice; client: Client; company: CompanySettings } | null> => {
  try {
    // First get the invoice by share token
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('share_token', shareToken)
      .single();

    if (error || !data) {
      console.error('Error getting invoice by share token:', error);
      return null;
    }

    // Map database response to Invoice type
    const invoice = mapInvoiceFromDB(data);

    // Then get the client
    const clientResponse = await supabase
      .from('clients')
      .select('*')
      .eq('id', invoice.clientId)
      .single();

    if (clientResponse.error || !clientResponse.data) {
      console.error('Error getting client:', clientResponse.error);
      return null;
    }

    // Map the client data - only include fields that exist in the Client type
    const client: Client = {
      id: clientResponse.data.id,
      name: clientResponse.data.name,
      email: clientResponse.data.email,
      phone: clientResponse.data.phone || undefined,
      company: clientResponse.data.company || undefined,
      createdAt: clientResponse.data.created_at,
      // Optional fields
      lastReport: clientResponse.data.last_report || undefined,
      notes: clientResponse.data.notes || undefined,
      isActive: clientResponse.data.is_active,
      website: clientResponse.data.website || undefined,
      sector: clientResponse.data.sector || undefined,
      analyticsConnected: clientResponse.data.analytics_connected,
      searchConsoleConnected: clientResponse.data.search_console_connected,
    };

    // Get company settings
    const companyResponse = await supabase
      .from('company_settings')
      .select('*')
      .single();

    if (companyResponse.error || !companyResponse.data) {
      console.error('Error getting company settings:', companyResponse.error);
      return null;
    }

    // Create a type-safe version of company settings
    const dbCompanyData = companyResponse.data;
    
    // Map company settings with defined properties
    const company: CompanySettings = {
      id: dbCompanyData.id,
      companyName: dbCompanyData.company_name,
      taxId: dbCompanyData.tax_id,
      address: dbCompanyData.address,
      phone: dbCompanyData.phone || undefined,
      email: dbCompanyData.email || undefined,
      logoUrl: dbCompanyData.logo_url || undefined,
      // Handle fields that might not exist in the database
      primaryColor: undefined,
      secondaryColor: undefined,
      accentColor: undefined,
      bankAccount: dbCompanyData.bank_account || undefined,
      createdAt: dbCompanyData.created_at,
      updatedAt: dbCompanyData.updated_at
    };

    return { invoice, client, company };
  } catch (error) {
    console.error('Error in getInvoiceByShareToken:', error);
    return null;
  }
};
