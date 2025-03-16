
/**
 * Core functionality for generating SEO report PDFs
 */
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ClientReport } from "@/types/client";
import { getClient } from '@/services/clientService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CompanySettings } from '@/types/settings';
import {
  createCoverPage,
  addHeader,
  addFooter,
  addTableOfContents,
  addIntroductionSection,
  addWebsiteAnalysisSection,
  addKeywordsSection,
  addTechnicalSEOSection,
  addRecommendationsSection,
  addCompetitorsSection,
  addConclusionSection,
  addContactSection
} from './seoReportPdfSections';

/**
 * Generates a PDF from a SEO report with improved styling
 */
export const generateSeoReportPdf = async (
  report: ClientReport, 
  companySettings?: CompanySettings
): Promise<Blob> => {
  try {
    // Fetch client data
    const client = await getClient(report.clientId);
    if (!client) {
      throw new Error("Cliente no encontrado");
    }
    
    // Create a new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    // Create cover page with company branding
    createCoverPage(doc, report, client, companySettings);
    
    // Add table of contents
    addTableOfContents(doc);
    
    // Add header and footer to all pages
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      if (i > 1) { // Skip header on cover page
        addHeader(doc, report.title || "Informe SEO", companySettings);
      }
      addFooter(doc, i, companySettings);
    }
    
    // Add Introduction section
    doc.addPage();
    let currentPage = doc.getNumberOfPages();
    let yPosition = 30;
    
    yPosition = addIntroductionSection(doc, report, client, yPosition);
    
    // Add website analysis section
    doc.addPage();
    currentPage = doc.getNumberOfPages();
    yPosition = 30;
    
    if (report.analyticsData?.auditResult) {
      yPosition = addWebsiteAnalysisSection(doc, report.analyticsData.auditResult, yPosition);
    }
    
    // Add keywords section
    doc.addPage();
    currentPage = doc.getNumberOfPages();
    yPosition = 30;
    
    if (report.analyticsData?.aiReport?.priorityKeywords) {
      yPosition = addKeywordsSection(doc, report.analyticsData.aiReport, yPosition);
    }
    
    // Add technical SEO section
    doc.addPage();
    currentPage = doc.getNumberOfPages();
    yPosition = 30;
    
    if (report.analyticsData?.auditResult) {
      yPosition = addTechnicalSEOSection(doc, report.analyticsData.auditResult, yPosition);
    }
    
    // Add recommendations section
    doc.addPage();
    currentPage = doc.getNumberOfPages();
    yPosition = 30;
    
    if (report.analyticsData?.aiReport?.strategy) {
      yPosition = addRecommendationsSection(doc, report.analyticsData.aiReport, yPosition);
    }
    
    // Add competitors section if available
    if (report.analyticsData?.aiReport?.competitors) {
      doc.addPage();
      currentPage = doc.getNumberOfPages();
      yPosition = 30;
      
      yPosition = addCompetitorsSection(doc, report.analyticsData.aiReport, yPosition);
    }
    
    // Add conclusion section
    doc.addPage();
    currentPage = doc.getNumberOfPages();
    yPosition = 30;
    
    if (report.analyticsData?.aiReport) {
      yPosition = addConclusionSection(doc, report.analyticsData.aiReport, yPosition);
    }
    
    // Add contact section
    yPosition = addContactSection(doc, companySettings, yPosition);
    
    // Update headers and footers for all pages
    const finalPageCount = doc.getNumberOfPages();
    for (let i = 1; i <= finalPageCount; i++) {
      doc.setPage(i);
      if (i > 1) { // Skip header on cover page
        addHeader(doc, report.title || "Informe SEO", companySettings);
      }
      addFooter(doc, i, finalPageCount, companySettings);
    }
    
    // Return the PDF as a blob
    return doc.output('blob');
  } catch (error) {
    console.error("Error generating SEO report PDF:", error);
    throw new Error("Error generating SEO report PDF");
  }
};
