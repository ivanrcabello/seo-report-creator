
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { AIReport } from "@/services/aiReportService";
import { AuditResult } from "@/services/pdfAnalyzer";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  addIntroductionSection,
  addAnalysisSection,
  addPriorityKeywordsSection,
  addCompetitorsSection,
  addStrategySection,
  addPackagesSection,
  addConclusionSection,
  addContactSection,
  addFooters
} from "./seoReportPdfSections";

/**
 * Core function to generate a SEO report PDF
 * @param report The AI report data
 * @param auditData The audit result data
 * @returns A Promise that resolves to a Blob containing the PDF
 */
export const generateSeoReportPdf = async (report: AIReport, auditData: AuditResult): Promise<Blob> => {
  try {
    // Create document PDF
    const doc = new jsPDF();
    
    // Configure fonts
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    
    // Add title with improved style
    doc.setTextColor(44, 62, 80); // Dark color for title
    doc.text("INFORME DE AUDITORÍA SEO", 105, 20, { align: "center" });
    
    // Add subtitle
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(52, 152, 219); // Blue color for subtitle
    doc.text(auditData.domain || "Análisis SEO", 105, 30, { align: "center" });
    
    // Add decorative line
    doc.setDrawColor(52, 152, 219);
    doc.setLineWidth(0.5);
    doc.line(14, 35, 196, 35);
    
    // Current vertical position tracker
    let yPos = 35;
    
    // Add each section
    yPos = addIntroductionSection(doc, report, yPos);
    yPos = addAnalysisSection(doc, report, yPos);
    
    // Add keywords section if available
    if (report.priorityKeywords && report.priorityKeywords.length > 0) {
      yPos = addPriorityKeywordsSection(doc, report, yPos);
    }
    
    // Add competitors section if available
    if (report.competitors && report.competitors.length > 0) {
      yPos = addCompetitorsSection(doc, report, yPos);
    }
    
    // Add strategy section
    yPos = addStrategySection(doc, report, yPos);
    
    // Add packages section
    yPos = addPackagesSection(doc, report, yPos);
    
    // Add conclusion section
    yPos = addConclusionSection(doc, report, yPos);
    
    // Add contact section
    addContactSection(doc, report, yPos);
    
    // Add footers to all pages
    addFooters(doc);
    
    // Generate the Blob
    const pdfBlob = doc.output("blob");
    return pdfBlob;
  } catch (error) {
    console.error("Error generating SEO report PDF:", error);
    throw new Error("Could not generate SEO report PDF");
  }
};
