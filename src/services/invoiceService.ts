
import { Invoice } from "@/types/invoice";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { mapInvoiceFromDB, mapInvoiceToDB } from "./invoice/invoiceMappers";
import { generateInvoiceNumber } from "./invoice/invoiceNumberGenerator";
import { generateInvoicePdf } from "./invoice/pdf/pdfGenerator";

/**
 * Fetches all invoices
 */
export const getInvoices = async (): Promise<Invoice[]> => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }
  
  return data.map(mapInvoiceFromDB);
};

/**
 * Fetches an invoice by ID
 */
export const getInvoice = async (id: string): Promise<Invoice | null> => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error("Error fetching invoice:", error);
    return null;
  }
  
  return mapInvoiceFromDB(data);
};

/**
 * Fetches invoices for a specific client
 */
export const getClientInvoices = async (clientId: string): Promise<Invoice[]> => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching client invoices:", error);
    return [];
  }
  
  return data.map(mapInvoiceFromDB);
};

/**
 * Creates a new invoice
 */
export const createInvoice = async (invoice: Partial<Invoice>): Promise<Invoice | null> => {
  // Generate a unique invoice number if not provided
  if (!invoice.invoiceNumber && !invoice.number) {
    invoice.invoiceNumber = await generateInvoiceNumber();
  }
  
  const newInvoice = mapInvoiceToDB(invoice);
  
  const { data, error } = await supabase
    .from('invoices')
    .insert(newInvoice)
    .select()
    .single();
  
  if (error) {
    console.error("Error creating invoice:", error);
    return null;
  }
  
  return mapInvoiceFromDB(data);
};

/**
 * Updates an existing invoice
 */
export const updateInvoice = async (invoice: Partial<Invoice>): Promise<Invoice | null> => {
  if (!invoice.id) {
    console.error("Cannot update invoice without ID");
    return null;
  }
  
  const updatedInvoice = mapInvoiceToDB(invoice);
  
  const { data, error } = await supabase
    .from('invoices')
    .update(updatedInvoice)
    .eq('id', invoice.id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating invoice:", error);
    return null;
  }
  
  return mapInvoiceFromDB(data);
};

/**
 * Deletes an invoice
 */
export const deleteInvoice = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting invoice:", error);
    return false;
  }
  
  return true;
};

/**
 * Marks an invoice as paid
 */
export const markInvoiceAsPaid = async (id: string): Promise<Invoice | null> => {
  const paymentDate = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('invoices')
    .update({
      status: 'paid',
      payment_date: paymentDate
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error marking invoice as paid:", error);
    return null;
  }
  
  return mapInvoiceFromDB(data);
};

/**
 * Downloads an invoice as PDF
 */
export const downloadInvoicePdf = async (id: string): Promise<boolean> => {
  try {
    const invoice = await getInvoice(id);
    if (!invoice) {
      throw new Error("Invoice not found");
    }
    
    // Generate and download the PDF
    const result = await generateInvoicePdf(invoice);
    return result;
  } catch (error) {
    console.error("Error downloading invoice PDF:", error);
    return false;
  }
};

/**
 * Sends an invoice via email
 */
export const sendInvoiceByEmail = async (id: string): Promise<boolean> => {
  try {
    const invoice = await getInvoice(id);
    if (!invoice) {
      throw new Error("Invoice not found");
    }
    
    // Generate PDF first if it doesn't exist
    if (!invoice.pdfUrl) {
      await generateInvoicePdf(invoice);
      // Fetch updated invoice with PDF URL
      const updatedInvoice = await getInvoice(id);
      if (!updatedInvoice || !updatedInvoice.pdfUrl) {
        throw new Error("Failed to generate invoice PDF");
      }
    }
    
    // For now, this is just a mock implementation
    // In a real app, you would call a server function to send the email
    setTimeout(() => {
      toast.success("Factura enviada por email correctamente");
    }, 1500);
    
    return true;
  } catch (error) {
    console.error("Error sending invoice email:", error);
    return false;
  }
};
