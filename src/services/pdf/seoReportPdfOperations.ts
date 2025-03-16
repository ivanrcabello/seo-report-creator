
/**
 * PDF operations (download, share) for SEO reports
 */
import { generateSeoReportPdf } from './seoReportPdfCore';
import { getReport } from '@/services/reportService';
import { toast } from "sonner";

/**
 * Downloads a SEO report as PDF
 */
export const downloadSeoReportPdf = async (reportId: string): Promise<boolean> => {
  try {
    // Get report data
    const report = await getReport(reportId);
    
    if (!report) {
      toast.error("No se encontró el informe");
      return false;
    }
    
    // Generate PDF
    const pdfBlob = await generateSeoReportPdf(report);
    
    // Create a download link
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    
    // Set the filename
    const filename = `informe-seo-${report.id.slice(0, 8)}.pdf`;
    link.setAttribute('download', filename);
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("Informe descargado correctamente");
    return true;
  } catch (error) {
    console.error("Error downloading report PDF:", error);
    toast.error("Error al descargar el informe");
    return false;
  }
};
