
import { Invoice } from "@/types/invoice";
import { supabase } from "@/integrations/supabase/client";
import { mapInvoiceFromDB } from "../invoiceMappers";

// Get all invoices with pagination support
export const getInvoices = async (page = 0, limit = 20): Promise<{ data: Invoice[], total: number }> => {
  try {
    console.log(`Fetching invoices with pagination: page ${page}, limit ${limit}`);
    
    // First get the total count for pagination
    const { count, error: countError } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true });
      
    if (countError) {
      console.error("Error counting invoices:", countError);
      return { data: [], total: 0 };
    }
    
    // Then get the actual data with pagination
    const { data, error } = await supabase
      .from('invoices')
      .select('*, clients(name)')
      .range(page * limit, (page * limit) + limit - 1)
      .order('issue_date', { ascending: false });
    
    if (error) {
      console.error("Error fetching invoices:", error);
      return { data: [], total: count || 0 };
    }
    
    console.log(`Retrieved ${data?.length || 0}/${count || 0} invoice records`);
    
    return { 
      data: (data || []).map(item => {
        const invoice = mapInvoiceFromDB(item);
        
        // Add client name for display purposes if available
        if (item.clients) {
          invoice.clientName = item.clients.name;
        }
        
        return invoice;
      }),
      total: count || 0
    };
  } catch (error) {
    console.error("Exception in getInvoices:", error);
    return { data: [], total: 0 };
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
    
    console.log("Client invoices data retrieved:", data?.length || 0, "records");
    
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
      console.log("Invoice not found with ID:", id);
      return undefined;
    }
    
    console.log("Invoice data retrieved successfully");
    
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
