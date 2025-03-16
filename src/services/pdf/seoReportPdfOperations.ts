
/**
 * PDF operations (download, share) for SEO reports
 */
import { generateSeoReportPdf } from './seoReportPdfCore';
import { getReport } from '@/services/reportService';
import { getCompanySettings } from '@/services/settingsService';
import { toast } from "sonner";

/**
 * Downloads a SEO report as PDF
 */
export const downloadSeoReportPdf = async (reportId: string): Promise<boolean> => {
  try {
    // Show loading toast
    const toastId = toast.loading("Generando PDF...");
    
    // Get report data
    const report = await getReport(reportId);
    
    if (!report) {
      toast.dismiss(toastId);
      toast.error("No se encontró el informe");
      return false;
    }
    
    // Get company settings for logo and branding
    const companySettings = await getCompanySettings();
    
    // Generate PDF with company branding
    const pdfBlob = await generateSeoReportPdf(report, companySettings);
    
    if (!pdfBlob) {
      toast.dismiss(toastId);
      toast.error("Error al generar el PDF");
      return false;
    }
    
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
    
    toast.dismiss(toastId);
    toast.success("Informe descargado correctamente");
    return true;
  } catch (error) {
    console.error("Error downloading report PDF:", error);
    toast.error("Error al descargar el informe");
    return false;
  }
};
