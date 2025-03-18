
import { supabase } from "@/integrations/supabase/client";
import { Invoice } from "@/types/invoice";

/**
 * Get all invoices with pagination support
 */
export const getInvoices = async (offset = 0, limit = 10): Promise<{ invoices: Invoice[], total: number }> => {
  try {
    console.log(`Fetching invoices with offset: ${offset}, limit: ${limit}`);
    
    // First, get the total count
    const { count, error: countError } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error("Error counting invoices:", countError);
      throw countError;
    }
    
    // Then get the actual data with pagination
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('issue_date', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error("Error fetching invoices:", error);
      throw error;
    }
    
    // Map the database fields to our Invoice type
    const invoices = data.map(item => ({
      id: item.id,
      invoiceNumber: item.invoice_number,
      clientId: item.client_id,
      issueDate: item.issue_date,
      dueDate: item.due_date,
      packId: item.pack_id,
      proposalId: item.proposal_id,
      baseAmount: item.base_amount,
      taxRate: item.tax_rate,
      taxAmount: item.tax_amount,
      totalAmount: item.total_amount,
      paymentDate: item.payment_date,
      status: item.status,
      notes: item.notes,
      pdfUrl: item.pdf_url
    }));
    
    console.log(`Fetched ${invoices.length} invoices out of ${count} total`);
    
    return { 
      invoices, 
      total: count || 0 
    };
  } catch (error) {
    console.error("Error in getInvoices:", error);
    throw error;
  }
};

/**
 * Get a single invoice by ID
 */
export const getInvoice = async (id: string): Promise<Invoice | null> => {
  try {
    if (!id) {
      console.error("Invoice ID is required");
      return null;
    }
    
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching invoice:", error);
      return null;
    }
    
    if (!data) {
      console.warn("No invoice found with ID:", id);
      return null;
    }
    
    return {
      id: data.id,
      invoiceNumber: data.invoice_number,
      clientId: data.client_id,
      issueDate: data.issue_date,
      dueDate: data.due_date,
      packId: data.pack_id,
      proposalId: data.proposal_id,
      baseAmount: data.base_amount,
      taxRate: data.tax_rate,
      taxAmount: data.tax_amount,
      totalAmount: data.total_amount,
      paymentDate: data.payment_date,
      status: data.status,
      notes: data.notes,
      pdfUrl: data.pdf_url
    };
  } catch (error) {
    console.error("Error getting invoice:", error);
    return null;
  }
};

/**
 * Get all invoices for a specific client
 */
export const getClientInvoices = async (clientId: string): Promise<Invoice[]> => {
  try {
    if (!clientId) {
      console.error("Client ID is required");
      return [];
    }
    
    console.log("Fetching invoices for client:", clientId);
    
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('client_id', clientId)
      .order('issue_date', { ascending: false });
    
    if (error) {
      console.error("Error fetching client invoices:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log(`No invoices found for client: ${clientId}`);
      return [];
    }
    
    console.log(`Found ${data.length} invoices for client: ${clientId}`);
    
    return data.map(item => ({
      id: item.id,
      invoiceNumber: item.invoice_number,
      clientId: item.client_id,
      issueDate: item.issue_date,
      dueDate: item.due_date,
      packId: item.pack_id,
      proposalId: item.proposal_id,
      baseAmount: item.base_amount,
      taxRate: item.tax_rate,
      taxAmount: item.tax_amount,
      totalAmount: item.total_amount,
      paymentDate: item.payment_date,
      status: item.status,
      notes: item.notes,
      pdfUrl: item.pdf_url
    }));
  } catch (error) {
    console.error("Error in getClientInvoices:", error);
    throw error;
  }
};
