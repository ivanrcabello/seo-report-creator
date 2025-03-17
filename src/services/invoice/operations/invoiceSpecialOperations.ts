
import { Invoice } from "@/types/invoice";
import { supabase } from "@/integrations/supabase/client";
import { mapInvoiceFromDB, mapInvoiceToDB } from "../invoiceMappers";
import { generateInvoiceNumber } from "../invoiceNumberGenerator";

// Create an invoice from a proposal
export const createInvoiceFromProposal = async (proposalId: string): Promise<Invoice | undefined> => {
  try {
    // First get the proposal data
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .select('client_id, pack_id, custom_price')
      .eq('id', proposalId)
      .single();
    
    if (proposalError || !proposal) {
      console.error("Error fetching proposal for invoice creation:", proposalError);
      return undefined;
    }
    
    // Get pack price if a pack is associated
    let baseAmount = 0;
    
    if (proposal.custom_price) {
      baseAmount = proposal.custom_price;
    } else if (proposal.pack_id) {
      const { data: pack, error: packError } = await supabase
        .from('seo_packs')
        .select('price')
        .eq('id', proposal.pack_id)
        .single();
      
      if (packError) {
        console.error("Error fetching pack for invoice creation:", packError);
        // Continue with 0 as fallback
      } else {
        baseAmount = pack?.price || 0;
      }
    }
    
    // Generate a new invoice number
    const invoiceNumber = await generateInvoiceNumber();
    
    const taxRate = 21; // Default IVA in Spain
    const taxAmount = (baseAmount * taxRate) / 100;
    const totalAmount = baseAmount + taxAmount;
    const now = new Date().toISOString();
    
    // Create the invoice object
    const newInvoice = {
      clientId: proposal.client_id,
      packId: proposal.pack_id,
      proposalId: proposalId,
      baseAmount: baseAmount,
      taxRate: taxRate,
      taxAmount: taxAmount,
      totalAmount: totalAmount,
      status: "pending" as const, // Explicitly typed as "pending"
      issueDate: now,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
      notes: "Generado desde propuesta",
      invoiceNumber: invoiceNumber,
      createdAt: now,
      updatedAt: now
    };
    
    // Map to DB format
    const dbInvoice = mapInvoiceToDB(newInvoice);
    
    // Insert the invoice
    const { data, error } = await supabase
      .from('invoices')
      .insert([dbInvoice])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating invoice from proposal:", error);
      return undefined;
    }
    
    // Update the proposal to indicate an invoice has been created
    await supabase
      .from('proposals')
      .update({ status: 'invoiced' })
      .eq('id', proposalId);
    
    return mapInvoiceFromDB(data);
  } catch (error) {
    console.error("Error in createInvoiceFromProposal:", error);
    return undefined;
  }
};

// Mark an invoice as paid
export const markInvoiceAsPaid = async (id: string): Promise<boolean> => {
  try {
    console.log("Marking invoice as paid:", id);
    
    const now = new Date().toISOString();
    
    const { error } = await supabase
      .from('invoices')
      .update({
        status: 'paid',
        payment_date: now,
        updated_at: now
      })
      .eq('id', id);
    
    if (error) {
      console.error("Error marking invoice as paid:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in markInvoiceAsPaid:", error);
    return false;
  }
};
