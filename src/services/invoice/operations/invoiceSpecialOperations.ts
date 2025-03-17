
import { Invoice } from "@/types/invoice";
import { getInvoice } from "./invoiceQueries";
import { updateInvoice, createInvoice } from "./invoiceMutations";
import { generateInvoiceNumber } from "../invoiceNumberGenerator";

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
    
    // If there's no custom price, use the pack price
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
    
    // Calculate amounts
    const taxRate = 21; // Standard VAT in Spain
    const taxAmount = (baseAmount * taxRate) / 100;
    const totalAmount = baseAmount + taxAmount;
    
    // Generate an invoice number for this new invoice
    const invoiceNumber = await generateInvoiceNumber();
    
    // Create invoice data
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
      issueDate: new Date().toISOString(),
      invoiceNumber
    };
    
    return createInvoice(invoiceData);
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
