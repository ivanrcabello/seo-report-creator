
import { SeoContract } from "@/types/client";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Generate a PDF for a contract
export const generateContractPDF = async (contract: SeoContract): Promise<Blob> => {
  // This is a simplified implementation
  // In a real application, you would use a PDF library like jsPDF
  console.log("Generating PDF for contract:", contract.id);
  
  // Create a mock PDF blob
  const mockPdfContent = `
    Contract: ${contract.title}
    Client ID: ${contract.clientId}
    Start Date: ${contract.startDate}
    End Date: ${contract.endDate || 'N/A'}
    Status: ${contract.status}
  `;
  
  // Convert the string to a Blob
  const blob = new Blob([mockPdfContent], { type: 'application/pdf' });
  return blob;
};

// Save the PDF to storage and update the contract with the PDF URL
export const saveContractPDF = async (contractId: string, pdfBlob: Blob): Promise<string | null> => {
  try {
    // Generate a unique filename
    const filename = `contract_${contractId}_${Date.now()}.pdf`;
    const filePath = `contracts/${contractId}/${filename}`;
    
    // Upload the PDF to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, pdfBlob, {
        contentType: 'application/pdf',
        upsert: true
      });
    
    if (uploadError) {
      console.error("Error uploading PDF:", uploadError);
      toast.error("Error al subir el PDF");
      return null;
    }
    
    // Get the public URL
    const { data: urlData } = await supabase.storage
      .from('documents')
      .getPublicUrl(filePath);
    
    const pdfUrl = urlData?.publicUrl;
    
    if (pdfUrl) {
      // Update the contract with the PDF URL
      const { error: updateError } = await supabase
        .from('seo_contracts')
        .update({ pdf_url: pdfUrl })
        .eq('id', contractId);
      
      if (updateError) {
        console.error("Error updating contract with PDF URL:", updateError);
        toast.error("Error al actualizar el contrato con la URL del PDF");
      }
    }
    
    return pdfUrl || null;
  } catch (error) {
    console.error("Error in saveContractPDF:", error);
    return null;
  }
};
