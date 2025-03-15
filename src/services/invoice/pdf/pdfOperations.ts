
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
    console.log("Starting PDF download for invoice:", invoiceId);
    // Get the invoice
    const invoice = await getInvoice(invoiceId);
    
    if (!invoice) {
      console.error("Invoice not found for ID:", invoiceId);
      toast.error("No se pudo encontrar la factura");
      return false;
    }
    
    console.log("Invoice data loaded, generating PDF");
    
    try {
      // Generate the PDF
      const pdfBlob = await generateInvoicePdf(invoice as Invoice);
      
      console.log("PDF generated successfully, size:", pdfBlob.size, "bytes");
      console.log("Creating download link");
      
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
      
      console.log("PDF download complete");
      toast.success("Factura descargada correctamente");
      return true;
    } catch (error) {
      console.error("Error in PDF generation:", error);
      toast.error("Error al generar el PDF");
      return false;
    }
  } catch (error) {
    console.error("Error downloading invoice PDF:", error);
    toast.error("Error al descargar la factura");
    return false;
  }
};

/**
 * Sends the invoice by email
 */
export const sendInvoiceByEmail = async (invoiceId: string): Promise<boolean> => {
  try {
    console.log("Starting email process for invoice:", invoiceId);
    // Get the invoice
    const invoice = await getInvoice(invoiceId);
    
    if (!invoice) {
      console.error("Invoice not found for ID:", invoiceId);
      toast.error("No se pudo encontrar la factura");
      return false;
    }
    
    // Get the client
    const client = await getClient(invoice.clientId);
    
    if (!client) {
      console.error("Client not found for ID:", invoice.clientId);
      toast.error("No se pudo encontrar el cliente de la factura");
      return false;
    }
    
    console.log("Generating PDF for email attachment");
    
    try {
      // Generate the PDF
      const pdfBlob = await generateInvoicePdf(invoice as Invoice);
      
      console.log("PDF generated successfully, size:", pdfBlob.size, "bytes");
      
      // Create a file object from the blob
      const file = new File([pdfBlob], `Factura_${invoice.invoiceNumber}.pdf`, { type: 'application/pdf' });
      
      // In a real app, you would upload the file to a server and send the email from there
      // For now, we'll simulate a successful email send
      
      console.log("Simulating sending email to client:", client.email);
      // Simulate API call to send email with attachment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Display success toast
      toast.success(`Factura enviada a ${client.email}`);
      
      return true;
    } catch (error) {
      console.error("Error generating PDF for email:", error);
      toast.error("Error al generar el PDF para el email");
      return false;
    }
  } catch (error) {
    console.error("Error sending invoice email:", error);
    toast.error("Error al enviar la factura por email");
    return false;
  }
};
