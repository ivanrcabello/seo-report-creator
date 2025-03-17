
import { Invoice } from "@/types/invoice";
import { supabase } from "@/integrations/supabase/client";
import { mapInvoiceFromDB } from "../invoiceMappers";

// Get all invoices
export const getInvoices = async (): Promise<Invoice[]> => {
  try {
    console.log("Fetching all invoices");
    
    const { data, error } = await supabase
      .from('invoices')
      .select('*, clients(name)')
      .order('issue_date', { ascending: false });
    
    if (error) {
      console.error("Error fetching invoices:", error);
      return [];
    }
    
    console.log("Invoices data retrieved:", data);
    
    return (data || []).map(item => {
      const invoice = mapInvoiceFromDB(item);
      
      // Add client name for display purposes if available
      if (item.clients) {
        invoice.clientName = item.clients.name;
      }
      
      return invoice;
    });
  } catch (error) {
    console.error("Error in getInvoices:", error);
    return [];
  }
};

// Get invoices for a specific client
export const getClientInvoices = async (clientId: string): Promise<Invoice[]> => {
  try {
    console.log("Fetching invoices for client:", clientId);
    
    const { data, error } = await supabase
      .from('invoices')
      .select('*, clients(name)')
      .eq('client_id', clientId)
      .order('issue_date', { ascending: false });
    
    if (error) {
      console.error("Error fetching client invoices:", error);
      return [];
    }
    
    console.log("Client invoices data retrieved:", data);
    
    return (data || []).map(item => {
      const invoice = mapInvoiceFromDB(item);
      
      // Add client name for display purposes if available
      if (item.clients) {
        invoice.clientName = item.clients.name;
      }
      
      return invoice;
    });
  } catch (error) {
    console.error("Error in getClientInvoices:", error);
    return [];
  }
};

// Get a single invoice by ID
export const getInvoice = async (id: string): Promise<Invoice | undefined> => {
  try {
    console.log("Fetching invoice with ID:", id);
    
    const { data, error } = await supabase
      .from('invoices')
      .select('*, clients(name)')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching invoice:", error);
      return undefined;
    }
    
    if (!data) {
      console.error("Invoice not found with ID:", id);
      return undefined;
    }
    
    console.log("Invoice data retrieved:", data);
    
    const invoice = mapInvoiceFromDB(data);
    
    // Add client name for display purposes if available
    if (data.clients) {
      invoice.clientName = data.clients.name;
    }
    
    return invoice;
  } catch (error) {
    console.error("Error in getInvoice:", error);
    return undefined;
  }
};
