
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ClientReport } from "@/types/client";
import { getClient } from '@/services/clientService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CompanySettings } from '@/types/settings';
import { getDefaultTemplate } from '@/services/templateService';
import { DocumentTemplate } from '@/types/templates';

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
    if (!template) {
      throw new Error("No se encontró una plantilla para informes SEO");
    }
    
    // Crear un nuevo documento PDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    // Aplicar estilos CSS personalizados si existen
    if (template.css) {
      // Aquí iría la lógica para convertir CSS a estilos de jsPDF
      // Por ahora usamos estilos básicos predefinidos
    }
    
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
    
    // Añadir portada si existe
    if (template.coverPageHtml) {
      const coverHtml = replaceTemplateVariables(template.coverPageHtml, templateData);
      // Aquí iría la lógica para convertir HTML a contenido PDF
      // Por ahora usamos un formato básico
      doc.setFontSize(24);
      doc.text(report.title || "Informe SEO", 20, 40);
      doc.setFontSize(14);
      doc.text(`Cliente: ${client.name}`, 20, 60);
      doc.text(templateData.reportDate, 20, 70);
    }
    
    // Añadir secciones del informe
    template.sections
      ?.filter(section => section.isEnabled)
      .sort((a, b) => a.order - b.order)
      .forEach(section => {
        doc.addPage();
        const content = replaceTemplateVariables(section.content, templateData);
        // Aquí iría la lógica para convertir HTML a contenido PDF
        // Por ahora usamos un formato básico
        doc.setFontSize(16);
        doc.text(section.name, 20, 20);
        doc.setFontSize(12);
        // Simulamos el contenido HTML como texto plano
        doc.text(content.replace(/<[^>]*>/g, ''), 20, 40);
      });
    
    // Actualizar número total de páginas
    templateData.totalPages = doc.getNumberOfPages();
    
    // Añadir encabezado y pie de página a todas las páginas
    for (let i = 1; i <= templateData.totalPages; i++) {
      doc.setPage(i);
      templateData.currentPage = i;
      
      if (template.headerHtml && i > 1) { // No añadimos encabezado en la portada
        const headerHtml = replaceTemplateVariables(template.headerHtml, templateData);
        // Aquí iría la lógica para convertir HTML a contenido PDF
        doc.setFontSize(10);
        doc.text(templateData.companyName, 20, 10);
      }
      
      if (template.footerHtml) {
        const footerHtml = replaceTemplateVariables(template.footerHtml, templateData);
        // Aquí iría la lógica para convertir HTML a contenido PDF
        doc.setFontSize(8);
        doc.text(`Página ${i} de ${templateData.totalPages}`, 20, doc.internal.pageSize.height - 10);
      }
    }
    
    // Devolver el PDF como blob
    return doc.output('blob');
  } catch (error) {
    console.error("Error generating SEO report PDF:", error);
    throw new Error("Error generating SEO report PDF");
  }
};
