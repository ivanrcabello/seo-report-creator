
import { ClientReport } from "@/types/client";
import { getReport } from "@/services/reportService";
import { generateSeoReportPdf } from "@/services/pdf/seoReportPdfCore";
import { toast } from "sonner";

/**
 * Downloads a SEO report as PDF
 * @param reportId The ID of the report to download
 * @returns A promise that resolves to true if the download was successful
 */
export const downloadSeoReportPdf = async (reportId: string): Promise<boolean> => {
  try {
    // Get the report data
    const report = await getReport(reportId);
    
    if (!report) {
      toast.error("No se pudo obtener el informe para generar el PDF");
      return false;
    }
    
    // Generate the PDF
    const pdfBlob = await generateSeoReportPdf(report);
    
    // Create the download link
    const blobUrl = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `informe-seo-${report.id.slice(0, 8)}.pdf`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
    
    toast.success("PDF generado correctamente");
    return true;
  } catch (error) {
    console.error("Error descargando el PDF:", error);
    toast.error("Error al generar el PDF");
    return false;
  }
};
