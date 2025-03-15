
import { toast } from "sonner";
import { generateReportPdf } from "../reportPdfService";
import { generateProposalPdf } from "../proposalPdfService";

export type DocumentType = 'report' | 'proposal' | 'contract';

/**
 * Downloads a document as a PDF file
 */
export const downloadDocumentPdf = async (id: string, name: string, type: DocumentType): Promise<boolean> => {
  try {
    console.log(`Starting document download for ${type} with ID: ${id}`);
    
    // Para la demostración, simulamos la descarga
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // En una app real, esto llamaría a los servicios específicos basados en el tipo
    // let pdfBlob;
    
    // switch (type) {
    //   case 'report':
    //     pdfBlob = await generateReportPdf(report);
    //     break;
    //   case 'proposal':
    //     pdfBlob = await generateProposalPdf(proposal);
    //     break;
    //   case 'contract':
    //     // Lógica para documentos de contrato
    //     break;
    // }
    
    // Crear URL para el blob
    // const blobUrl = URL.createObjectURL(pdfBlob);
    
    // Crear elemento a para descargar
    // const a = document.createElement("a");
    // a.href = blobUrl;
    // a.download = `${name}.pdf`;
    // document.body.appendChild(a);
    // a.click();
    
    // Limpiar
    // document.body.removeChild(a);
    // URL.revokeObjectURL(blobUrl);
    
    console.log(`Document download completed for: ${name}`);
    toast.success(`Documento '${name}' descargado correctamente`);
    return true;
  } catch (error) {
    console.error(`Error downloading ${type} document:`, error);
    toast.error("Error al descargar el documento");
    return false;
  }
};

/**
 * Opens a document for viewing
 */
export const viewDocument = (id: string, name: string, type: DocumentType): void => {
  console.log(`Viewing document: ${id}, ${type}, ${name}`);
  toast.info(`Visualizando documento: ${name}`);
  
  // En una aplicación real, aquí se navegaría a la página de visualización
  // o se abriría un visor de PDF
};
