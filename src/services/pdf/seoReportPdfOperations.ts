
import { AIReport } from "@/services/aiReportService";
import { AuditResult } from "@/services/pdfAnalyzer";
import { generateSeoReportPdf } from "./seoReportPdfCore";

/**
 * Downloads the SEO report as a PDF file
 * @param report The AI report data
 * @param auditData The audit result data
 * @returns A Promise that resolves to a boolean indicating success or failure
 */
export const downloadSeoReportPdf = async (report: AIReport, auditData: AuditResult): Promise<boolean> => {
  try {
    // Generate the PDF
    const pdfBlob = await generateSeoReportPdf(report, auditData);
    
    // Create URL for the blob
    const blobUrl = URL.createObjectURL(pdfBlob);
    
    // Create a element for download
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `informe-seo-${auditData.domain || "sitio"}.pdf`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
    
    return true;
  } catch (error) {
    console.error("Error downloading SEO report PDF:", error);
    return false;
  }
};
