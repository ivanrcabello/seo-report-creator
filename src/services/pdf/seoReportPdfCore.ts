
/**
 * Core functionality for generating SEO report PDFs
 */
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ClientReport } from "@/types/client";
import { getClient } from '@/services/clientService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getInitials } from '@/lib/utils';

/**
 * Generates a PDF from a SEO report
 */
export const generateSeoReportPdf = async (report: ClientReport): Promise<Blob> => {
  try {
    // Fetch client data
    const client = await getClient(report.clientId);
    
    // Create a new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    // Add header with report title
    doc.setFillColor(41, 98, 255); // SEO blue
    doc.rect(0, 0, doc.internal.pageSize.width, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(report.title || "Informe SEO", 105, 15, { align: "center" });
    
    // Add client info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text("Cliente:", 20, 40);
    doc.setFont("helvetica", "normal");
    doc.text(client?.name || "N/A", 50, 40);
    
    doc.setFont("helvetica", "bold");
    doc.text("Fecha:", 20, 50);
    doc.setFont("helvetica", "normal");
    doc.text(format(new Date(report.date), "d 'de' MMMM, yyyy", { locale: es }), 50, 50);
    
    if (report.url) {
      doc.setFont("helvetica", "bold");
      doc.text("URL analizada:", 20, 60);
      doc.setFont("helvetica", "normal");
      doc.text(report.url, 50, 60);
    }
    
    // Add content separator
    doc.setDrawColor(41, 98, 255); // SEO blue
    doc.setLineWidth(0.5);
    doc.line(20, 70, 190, 70);
    
    // Add report content - using formatted markdown-like content
    if (report.content) {
      // Split the content by sections
      const sections = report.content.split('## ').filter(Boolean);
      
      let yPosition = 80;
      
      // Process each section
      for (const section of sections) {
        const lines = section.split('\n');
        const sectionTitle = lines[0];
        
        // Add section title
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(41, 98, 255); // SEO blue
        doc.text(`${sectionTitle}`, 20, yPosition);
        
        yPosition += 10;
        
        // Process the content of each section
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        
        // Skip the title
        const contentLines = lines.slice(1).join('\n');
        
        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        // Split text to fit page width
        const splitText = doc.splitTextToSize(contentLines, 170);
        doc.text(splitText, 20, yPosition);
        
        yPosition += splitText.length * 7 + 10;
        
        // Add a separator between sections
        if (yPosition < 270) {
          doc.setDrawColor(200, 200, 200);
          doc.setLineWidth(0.2);
          doc.line(20, yPosition - 5, 190, yPosition - 5);
        }
        
        // Check if we need a new page for the next section
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
      }
    } else {
      // If no content, add a message
      doc.setFont("helvetica", "italic");
      doc.setFontSize(12);
      doc.text("Este informe no contiene contenido detallado.", 105, 100, { align: "center" });
    }
    
    // Add footer with page numbers
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(`Página ${i} de ${pageCount}`, 105, 285, { align: "center" });
    }
    
    // Return the PDF as a blob
    return doc.output('blob');
  } catch (error) {
    console.error("Error generating SEO report PDF:", error);
    throw new Error("Error generating SEO report PDF");
  }
};
