
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { Invoice, CompanySettings } from "@/types/invoice";
import { mapInvoiceFromDB } from "../invoiceMappers";
import { Client } from "@/types/client";

export const generateInvoicePdf = async (invoiceId: string): Promise<boolean> => {
  try {
    // Simulate PDF generation (replace with actual PDF generation logic)
    console.log(`Simulating PDF generation for invoice ${invoiceId}`);
    
    // For now, let's just update the invoice with a dummy PDF URL
    const dummyPdfUrl = `https://example.com/invoice-${invoiceId}.pdf`;
    
    const { data, error } = await supabase
      .from('invoices')
      .update({ pdf_url: dummyPdfUrl })
      .eq('id', invoiceId);
    
    if (error) {
      console.error("Error updating invoice with PDF URL:", error);
      return false;
    }
    
    console.log(`Invoice ${invoiceId} updated with PDF URL: ${dummyPdfUrl}`);
    return true;
    
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
};

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

export const shareInvoice = async (invoiceId: string): Promise<{ url: string } | null> => {
  try {
    const shareToken = uuidv4();
    
    // Update invoice with share token and timestamp
    // Use an explicit type cast to avoid TypeScript issues
    const { data, error } = await supabase
      .from('invoices')
      .update({
        shared_at: new Date().toISOString(),
        share_token: shareToken
      } as any)  // Use 'as any' to bypass TypeScript checking
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

export const markInvoiceAsPaid = async (invoiceId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .update({
        status: 'paid' as 'pending' | 'paid' | 'cancelled' | 'draft', // Fix the type issue by casting
        payment_date: new Date().toISOString(),
      })
      .eq('id', invoiceId);

    if (error) {
      console.error('Error marking invoice as paid:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in markInvoiceAsPaid:', error);
    return false;
  }
};
