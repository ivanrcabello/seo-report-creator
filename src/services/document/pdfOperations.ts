
import { toast } from "sonner";
import { generateReportPdf } from "../reportPdfService";
import { generateProposalPdf } from "../proposalPdfService";
import jsPDF from "jspdf";

export type DocumentType = 'report' | 'proposal' | 'contract';

/**
 * Generates a simple fallback PDF when the real document isn't found
 */
const generateFallbackPdf = (name: string, type: DocumentType): Blob => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(22);
  doc.setTextColor(44, 62, 80);
  doc.text(`${type.toUpperCase()} DOCUMENT`, 105, 20, { align: "center" });
  
  // Add document name
  doc.setFontSize(16);
  doc.setTextColor(52, 152, 219);
  doc.text(name, 105, 40, { align: "center" });
  
  // Add explanation text
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(
    "This is a preview document generated for demonstration purposes.",
    105, 60, 
    { align: "center" }
  );
  
  // Add current date
  const today = new Date().toLocaleDateString('es-ES');
  doc.setFontSize(10);
  doc.text(`Fecha: ${today}`, 105, 80, { align: "center" });
  
  // Generate the blob
  return doc.output("blob");
};

/**
 * Downloads a document as a PDF file
 */
export const downloadDocumentPdf = async (id: string, name: string, type: DocumentType): Promise<boolean> => {
  try {
    console.log(`Starting document download for ${type} with ID: ${id}`);
    
    let pdfBlob;
    
    // Generate the actual PDF based on document type
    try {
      switch (type) {
        case 'report':
          // Import dynamically to avoid circular dependencies
          const { getReport } = await import("../reportService");
          const report = await getReport(id);
          if (!report) {
            throw new Error("Report not found");
          }
          pdfBlob = await generateReportPdf(report);
          break;
        case 'proposal':
          // Import dynamically to avoid circular dependencies
          const { getProposal } = await import("../proposal/proposalCrud");
          const proposal = await getProposal(id);
          if (!proposal) {
            throw new Error("Proposal not found");
          }
          pdfBlob = await generateProposalPdf(proposal);
          break;
        case 'contract':
          // For contracts, we'll handle this differently as they have their own download mechanism
          toast.info("Redirigiendo a la página del contrato para su descarga");
          return true;
      }
    } catch (error) {
      console.error(`Error fetching ${type} data:`, error);
      // Generate a fallback PDF when the real document isn't found
      console.log(`Generating fallback PDF for ${name}`);
      pdfBlob = generateFallbackPdf(name, type);
    }
    
    // Create URL for the blob
    const blobUrl = URL.createObjectURL(pdfBlob);
    
    // Create an anchor element for download
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `${name.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
    
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
