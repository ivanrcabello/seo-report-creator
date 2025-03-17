
import { toast } from "sonner";
import { Invoice } from "@/types/invoice";
import { getInvoice } from "../invoiceCrud";
import { generateInvoicePdf } from "./pdfGenerator";

/**
 * Downloads an invoice as PDF
 */
export const downloadInvoicePdf = async (id: string): Promise<boolean> => {
  try {
    const invoice = await getInvoice(id);
    if (!invoice) {
      toast.error("Factura no encontrada");
      return false;
    }
    
    // Generate PDF
    const pdfBlob = await generateInvoicePdf(invoice);
    if (!pdfBlob) {
      toast.error("Error al generar el PDF");
      return false;
    }
    
    // Create a download link
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `factura_${invoice.invoiceNumber}.pdf`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    
    toast.success("PDF descargado correctamente");
    return true;
  } catch (error) {
    console.error("Error downloading invoice PDF:", error);
    toast.error("Error al descargar el PDF");
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
      toast.error("Factura no encontrada");
      return false;
    }
    
    // Generate PDF first if it doesn't exist
    if (!invoice.pdfUrl) {
      await generateInvoicePdf(invoice);
      // Fetch updated invoice with PDF URL
      const updatedInvoice = await getInvoice(id);
      if (!updatedInvoice || !updatedInvoice.pdfUrl) {
        toast.error("Error al generar el PDF");
        return false;
      }
    }
    
    // For now, this is just a mock implementation
    // In a real app, you would call a server function to send the email
    toast.success("Factura enviada por email correctamente");
    return true;
  } catch (error) {
    console.error("Error sending invoice email:", error);
    toast.error("Error al enviar el email");
    return false;
  }
};
