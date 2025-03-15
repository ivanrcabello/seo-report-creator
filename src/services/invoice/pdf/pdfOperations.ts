
/**
 * Invoice PDF operations (download, email, etc.)
 */

import { getInvoice } from "../invoiceCrud";
import { generateInvoicePdf } from "./pdfGenerator";
import { Invoice } from "@/types/invoice";
import { getClient } from "@/services/clientService";
import { toast } from "sonner";

/**
 * Downloads the invoice as a PDF file
 */
export const downloadInvoicePdf = async (invoiceId: string): Promise<boolean> => {
  try {
    // Get the invoice
    const invoice = await getInvoice(invoiceId);
    
    if (!invoice) {
      throw new Error("Invoice not found");
    }
    
    // Generate the PDF
    const pdfBlob = await generateInvoicePdf(invoice as Invoice);
    
    // Create a download link
    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Factura_${invoice.invoiceNumber}.pdf`;
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error("Error downloading invoice PDF:", error);
    return false;
  }
};

/**
 * Sends the invoice by email
 */
export const sendInvoiceByEmail = async (invoiceId: string): Promise<boolean> => {
  try {
    // Get the invoice
    const invoice = await getInvoice(invoiceId);
    
    if (!invoice) {
      throw new Error("Invoice not found");
    }
    
    // Get the client
    const client = await getClient(invoice.clientId);
    
    if (!client) {
      throw new Error("Client not found");
    }
    
    // Generate the PDF
    const pdfBlob = await generateInvoicePdf(invoice as Invoice);
    
    // Create a file object from the blob
    const file = new File([pdfBlob], `Factura_${invoice.invoiceNumber}.pdf`, { type: 'application/pdf' });
    
    // In a real app, you would upload the file to a server and send the email from there
    // For now, we'll simulate a successful email send
    
    // Simulate API call to send email with attachment
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Display success toast
    toast.success(`Factura enviada a ${client.email}`);
    
    return true;
  } catch (error) {
    console.error("Error sending invoice email:", error);
    return false;
  }
};
