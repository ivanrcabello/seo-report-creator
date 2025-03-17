/**
 * Invoice PDF download functionality
 */
import { saveAs } from 'file-saver';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { generateInvoicePdf } from "@/services/invoiceService";
import { mapInvoiceFromDB } from "../invoiceMappers";

/**
 * Downloads the PDF for an invoice
 */
export const downloadInvoicePdf = async (invoiceId: string): Promise<boolean> => {
  try {
    console.log("Downloading PDF for invoice:", invoiceId);
    
    // Get invoice data
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching invoice for download:", error);
      toast.error("Error al obtener la factura para descarga");
      return false;
    }
    
    if (!data) {
      toast.error("Factura no encontrada");
      return false;
    }
    
    const invoice = mapInvoiceFromDB(data);
    
    // If the invoice already has a PDF URL, download that instead of generating new
    if (invoice.pdfUrl) {
      console.log("Invoice already has PDF URL:", invoice.pdfUrl);
      try {
        // Fetch the PDF from the URL
        const response = await fetch(invoice.pdfUrl);
        const blob = await response.blob();
        const fileName = `Factura_${invoice.invoiceNumber}.pdf`;
        saveAs(blob, fileName);
        return true;
      } catch (fetchError) {
        console.error("Error fetching existing PDF:", fetchError);
        // Continue to generate a new PDF
      }
    }
    
    // Otherwise generate a new PDF
    console.log("No PDF URL found or fetch failed. Generating PDF first...");
    const success = await generateInvoicePdf(invoiceId);
    
    if (!success) {
      console.error("Failed to generate PDF for download");
      toast.error("Error al generar el PDF para descarga");
      return false;
    }
    
    // Fetch the invoice again to get the updated PDF URL
    const { data: updatedData, error: fetchError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .maybeSingle();
    
    if (fetchError || !updatedData) {
      console.error("Error fetching updated invoice:", fetchError);
      toast.error("Error al obtener la factura actualizada");
      return false;
    }
    
    const updatedInvoice = mapInvoiceFromDB(updatedData);
    
    if (!updatedInvoice.pdfUrl) {
      console.error("Updated invoice still doesn't have a PDF URL");
      toast.error("La factura no tiene una URL de PDF");
      return false;
    }
    
    try {
      // Fetch and download the PDF
      const response = await fetch(updatedInvoice.pdfUrl);
      const blob = await response.blob();
      const fileName = `Factura_${updatedInvoice.invoiceNumber}.pdf`;
      saveAs(blob, fileName);
      
      toast.success("PDF descargado correctamente");
      return true;
    } catch (downloadError) {
      console.error("Error downloading PDF:", downloadError);
      toast.error("Error al descargar el PDF");
      return false;
    }
  } catch (error) {
    console.error("Error in downloadInvoicePdf:", error);
    toast.error("Error al descargar el PDF");
    return false;
  }
};
