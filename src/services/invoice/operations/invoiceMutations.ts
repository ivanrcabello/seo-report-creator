
import { Invoice } from "@/types/invoice";
import { supabase } from "@/integrations/supabase/client";
import { mapInvoiceFromDB, mapInvoiceToDB } from "../invoiceMappers";
import { generateInvoiceNumber } from "../invoiceNumberGenerator";

// Create a new invoice
export const createInvoice = async (invoice: Omit<Invoice, "id" | "createdAt" | "updatedAt">): Promise<Invoice | undefined> => {
  try {
    console.log("Creating invoice with data:", invoice);
    
    // Generate invoice number if one is not provided
    let invoiceNumber = invoice.invoiceNumber || await generateInvoiceNumber();
    console.log("Generated invoice number:", invoiceNumber);
    
    const now = new Date().toISOString();
    
    // Create a new invoice object with processed data
    const newInvoiceData = {
      ...invoice,
      invoiceNumber,
      createdAt: now,
      updatedAt: now
    };
    
    // Map the invoice data for DB, which will include the generated UUID
    const dbInvoice = mapInvoiceToDB(newInvoiceData);
    
    console.log("Mapped invoice data for DB:", dbInvoice);
    
    const { data, error } = await supabase
      .from('invoices')
      .insert([dbInvoice])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating invoice:", error);
      return undefined;
    }
    
    console.log("Invoice created successfully:", data);
    return mapInvoiceFromDB(data);
  } catch (error) {
    console.error("Error in createInvoice:", error);
    return undefined;
  }
};

// Update an existing invoice
export const updateInvoice = async (invoice: Invoice): Promise<Invoice | undefined> => {
  try {
    // Ensure we have an id
    if (!invoice.id) {
      console.error("Error updating invoice: No ID provided");
      return undefined;
    }
    
    console.log("Updating invoice with ID:", invoice.id);
    console.log("Invoice data for update:", invoice);
    
    // Create updated invoice with current timestamp
    const dbInvoice = mapInvoiceToDB({
      ...invoice,
      updatedAt: new Date().toISOString()
    });
    
    console.log("Mapped invoice data for DB update:", dbInvoice);
    
    const { data, error } = await supabase
      .from('invoices')
      .update(dbInvoice)
      .eq('id', invoice.id)
      .select()
      .single();
    
    if (error) {
      console.error("Supabase error updating invoice:", error);
      return undefined;
    }
    
    console.log("Update successful, returned data:", data);
    return mapInvoiceFromDB(data);
  } catch (error) {
    console.error("Error in updateInvoice:", error);
    return undefined;
  }
};

// Delete an invoice
export const deleteInvoice = async (id: string): Promise<boolean> => {
  try {
    // First delete any related invoice shares
    const { error: shareError } = await supabase
      .from('invoice_shares')
      .delete()
      .eq('invoice_id', id);
    
    if (shareError) {
      console.error("Error deleting invoice shares:", shareError);
      // Continue with deletion of the invoice itself
    }
    
    // Delete the invoice
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting invoice:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteInvoice:", error);
    return false;
  }
};
