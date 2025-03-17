
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ClientReport } from "@/types/client";
import { getClient } from '@/services/clientService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CompanySettings } from '@/types/settings';
import { getDefaultTemplate } from '@/services/templateService';

// Función auxiliar para reemplazar variables en el HTML
const replaceTemplateVariables = (html: string, data: any) => {
  return html
    .replace(/{{companyName}}/g, data.companyName || '')
    .replace(/{{companyLogo}}/g, data.companyLogo || '')
    .replace(/{{reportTitle}}/g, data.reportTitle || '')
    .replace(/{{clientName}}/g, data.clientName || '')
    .replace(/{{reportDate}}/g, data.reportDate || '')
    .replace(/{{currentPage}}/g, data.currentPage?.toString() || '')
    .replace(/{{totalPages}}/g, data.totalPages?.toString() || '');
};

/**
 * Genera un PDF a partir de un informe SEO utilizando la plantilla seleccionada
 */
export const generateSeoReportPdf = async (
  report: ClientReport, 
  companySettings?: CompanySettings
): Promise<Blob> => {
  try {
    // Obtener datos del cliente
    const client = await getClient(report.clientId);
    if (!client) {
      throw new Error("Cliente no encontrado");
    }
    
    // Obtener la plantilla por defecto para informes SEO
    const template = await getDefaultTemplate('seo-report');
    
    // Crear un nuevo documento PDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    // Variables para reemplazar en la plantilla
    const templateData = {
      companyName: companySettings?.companyName || 'Empresa',
      companyLogo: companySettings?.logoUrl || '',
      reportTitle: report.title || 'Informe SEO',
      clientName: client.name,
      reportDate: format(new Date(report.date || new Date()), "d 'de' MMMM, yyyy", { locale: es }),
      currentPage: 1,
      totalPages: 1 // Se actualizará después
    };
    
    // Añadir portada
    doc.setFontSize(24);
    doc.text(report.title || "Informe SEO", 20, 40);
    doc.setFontSize(14);
    doc.text(`Cliente: ${client.name}`, 20, 60);
    doc.text(templateData.reportDate, 20, 70);
    
    // Añadir contenido del informe
    doc.addPage();
    
    // Si hay contenido en el informe, añadirlo
    if (report.content) {
      doc.setFontSize(12);
      
      // Definir márgenes y área de contenido
      const margin = 20;
      const pageWidth = doc.internal.pageSize.getWidth() - (margin * 2);
      
      // Dividir el contenido por secciones (títulos H2)
      const sections = report.content.split(/^#{2}\s+(.*)$/gm);
      
      let yPos = 30;
      let currentPage = 2;
      
      // Añadir título principal
      doc.setFontSize(18);
      doc.text("Contenido del informe", margin, yPos);
      yPos += 10;
      
      // Procesar el contenido
      doc.setFontSize(10);
      const contentLines = report.content
        .replace(/^#{2,3}\s+(.*)$/gm, '--TITLE--$1')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .split('\n');
      
      for (const line of contentLines) {
        if (line.trim() === '') {
          yPos += 5;
          continue;
        }
        
        if (line.startsWith('--TITLE--')) {
          // Si es un título, aumentar espacio antes y usar fuente más grande
          yPos += 10;
          doc.setFontSize(14);
          doc.setTextColor(0, 51, 102); // Azul oscuro para títulos
          const title = line.replace('--TITLE--', '');
          doc.text(title, margin, yPos);
          yPos += 8;
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0); // Volver a color negro
        } else if (line.startsWith('- ')) {
          // Si es un elemento de lista
          const bulletText = line.substring(2);
          doc.text('• ' + bulletText, margin + 5, yPos);
          yPos += 6;
        } else {
          // Texto normal
          const textLines = doc.splitTextToSize(line, pageWidth);
          for (const textLine of textLines) {
            doc.text(textLine, margin, yPos);
            yPos += 6;
            
            // Si llegamos al final de la página, añadir una nueva
            if (yPos > doc.internal.pageSize.getHeight() - 20) {
              doc.addPage();
              currentPage++;
              yPos = 30;
            }
          }
        }
      }
      
      // Actualizar número total de páginas
      templateData.totalPages = currentPage;
    } else if (report.analyticsData?.auditResult) {
      // Si hay datos de auditoría pero no contenido formateado
      const auditResult = report.analyticsData.auditResult;
      
      doc.setFontSize(14);
      doc.text("Resultados de la auditoría SEO", 20, 30);
      
      // Añadir puntuaciones
      if (auditResult.scores) {
        doc.setFontSize(12);
        doc.text("Puntuaciones", 20, 50);
        
        const scoresData = [
          ['Métrica', 'Puntuación'],
          ...Object.entries(auditResult.scores).map(([key, value]) => [
            key.charAt(0).toUpperCase() + key.slice(1), 
            typeof value === 'number' ? value.toString() : 'N/A'
          ])
        ];
        
        autoTable(doc, {
          startY: 55,
          head: [scoresData[0]],
          body: scoresData.slice(1),
          theme: 'grid',
          styles: {
            fontSize: 10
          }
        });
      }
      
      // Añadir problemas técnicos si existen
      if (auditResult.technicalIssues && auditResult.technicalIssues.length > 0) {
        const lastTableY = (doc as any).lastAutoTable.finalY + 15;
        
        doc.setFontSize(12);
        doc.text("Problemas técnicos detectados", 20, lastTableY);
        
        const issuesData = [
          ['Tipo', 'Descripción', 'Impacto'],
          ...auditResult.technicalIssues.map(issue => [
            issue.type || 'No especificado',
            issue.description || 'No especificado',
            issue.impact || 'Medio'
          ])
        ];
        
        autoTable(doc, {
          startY: lastTableY + 5,
          head: [issuesData[0]],
          body: issuesData.slice(1),
          theme: 'grid',
          styles: {
            fontSize: 10
          }
        });
      }
    }
    
    // Añadir numeración de páginas en cada página
    for (let i = 1; i <= doc.getNumberOfPages(); i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Página ${i} de ${doc.getNumberOfPages()}`,
        doc.internal.pageSize.getWidth() - 40,
        doc.internal.pageSize.getHeight() - 10
      );
    }
    
    // Devolver el PDF como blob
    return doc.output('blob');
  } catch (error) {
    console.error("Error generating SEO report PDF:", error);
    throw new Error("Error generating SEO report PDF");
  }
};
