
import { Invoice } from "@/types/invoice";
import { supabase } from "@/integrations/supabase/client";
import { mapInvoiceFromDB, mapInvoiceToDB } from "./invoiceMappers";
import { generateInvoiceNumber } from "./invoiceNumberGenerator";

// Get all invoices
export const getInvoices = async (): Promise<Invoice[]> => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .order('issue_date', { ascending: false });
  
  if (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }
  
  return (data || []).map(mapInvoiceFromDB);
};

// Get invoices for a specific client
export const getClientInvoices = async (clientId: string): Promise<Invoice[]> => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('client_id', clientId)
    .order('issue_date', { ascending: false });
  
  if (error) {
    console.error("Error fetching client invoices:", error);
    return [];
  }
  
  return (data || []).map(mapInvoiceFromDB);
};

// Get a single invoice by ID
export const getInvoice = async (id: string): Promise<Invoice | undefined> => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) {
    console.error("Error fetching invoice:", error);
    return undefined;
  }
  
  return data ? mapInvoiceFromDB(data) : undefined;
};

// Create a new invoice
export const createInvoice = async (invoice: Omit<Invoice, "id" | "createdAt" | "updatedAt" | "invoiceNumber">): Promise<Invoice | undefined> => {
  try {
    // Generar número de factura si no se proporciona uno
    let invoiceNumber = (invoice as any).invoiceNumber;
    if (!invoiceNumber) {
      invoiceNumber = await generateInvoiceNumber();
    }
    
    const now = new Date().toISOString();
    const newInvoice = {
      ...mapInvoiceToDB(invoice),
      invoice_number: invoiceNumber,
      created_at: now,
      updated_at: now
    };
    
    const { data, error } = await supabase
      .from('invoices')
      .insert([newInvoice])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating invoice:", error);
      return undefined;
    }
    
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
    console.log("Invoice data:", invoice);
    
    // Create updated invoice with current timestamp
    const updatedInvoice = {
      ...mapInvoiceToDB(invoice),
      updated_at: new Date().toISOString()
    };
    
    console.log("Mapped invoice data for DB:", updatedInvoice);
    
    const { data, error } = await supabase
      .from('invoices')
      .update(updatedInvoice)
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

// Create invoice from a proposal
export const createInvoiceFromProposal = async (
  proposalId: string,
  dueDate?: string
): Promise<Invoice | undefined> => {
  try {
    const { getProposal } = await import("@/services/proposal/proposalCrud");
    const { getSeoPack } = await import("@/services/packService");
    
    const proposal = await getProposal(proposalId);
    if (!proposal) return undefined;
    
    let baseAmount = proposal.customPrice;
    
    // Si no hay precio personalizado, usar el del pack
    if (!baseAmount && proposal.packId) {
      const pack = await getSeoPack(proposal.packId);
      if (pack) {
        baseAmount = pack.price;
      }
    }
    
    if (!baseAmount) {
      console.error("No price found for invoice creation");
      return undefined;
    }
    
    // Calcular importes
    const taxRate = 21; // IVA estándar en España
    const taxAmount = (baseAmount * taxRate) / 100;
    const totalAmount = baseAmount + taxAmount;
    
    // Crear datos de factura
    const invoiceData = {
      clientId: proposal.clientId,
      proposalId: proposal.id,
      packId: proposal.packId,
      baseAmount,
      taxRate,
      taxAmount,
      totalAmount,
      status: "pending" as const,
      dueDate: dueDate || null,
      issueDate: new Date().toISOString()
    };
    
    return createInvoice(invoiceData as any);
  } catch (error) {
    console.error("Error creating invoice from proposal:", error);
    return undefined;
  }
};

// Mark invoice as paid
export const markInvoiceAsPaid = async (invoiceId: string): Promise<Invoice | undefined> => {
  try {
    const invoice = await getInvoice(invoiceId);
    if (!invoice) return undefined;
    
    const updatedInvoice = {
      ...invoice,
      status: "paid" as const,
      paymentDate: new Date().toISOString()
    };
    
    return updateInvoice(updatedInvoice);
  } catch (error) {
    console.error("Error marking invoice as paid:", error);
    return undefined;
  }
};
