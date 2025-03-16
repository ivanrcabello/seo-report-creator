import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { AIReport } from "@/services/aiReportService";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Client } from "@/types/client";
import { CompanySettings } from "@/types/settings";
import { AuditResult } from "@/services/pdfAnalyzer";

// Colores corporativos
const COLORS = {
  primary: [41, 98, 255],    // Azul principal
  secondary: [98, 0, 238],   // Púrpura
  accent: [255, 64, 129],    // Rosa
  textDark: [33, 33, 33],    // Casi negro
  textLight: [250, 250, 250], // Casi blanco
  lightBg: [245, 247, 250],  // Fondo claro
  success: [76, 175, 80],    // Verde
  warning: [255, 152, 0],    // Naranja
  error: [244, 67, 54],      // Rojo
  lightGrey: [224, 224, 224], // Gris claro
};

// Estilos de texto
const TEXT_STYLES = {
  title: {
    fontSize: 24,
    fontStyle: 'bold',
    color: COLORS.primary,
  },
  heading1: {
    fontSize: 18,
    fontStyle: 'bold',
    color: COLORS.primary,
  },
  heading2: {
    fontSize: 14,
    fontStyle: 'bold',
    color: COLORS.primary,
  },
  heading3: {
    fontSize: 12,
    fontStyle: 'bold',
    color: COLORS.secondary,
  },
  normal: {
    fontSize: 10,
    fontStyle: 'normal',
    color: COLORS.textDark,
  },
  small: {
    fontSize: 8,
    fontStyle: 'normal',
    color: COLORS.textDark,
  },
};

/**
 * Creates a visually appealing cover page for the report
 */
export const createCoverPage = (
  doc: jsPDF, 
  report: any, 
  client: Client, 
  companySettings?: CompanySettings
) => {
  // Fondo degradado en la parte superior
  doc.setFillColor(41, 98, 255); // Azul principal
  doc.rect(0, 0, doc.internal.pageSize.width, 100, 'F');
  
  // Degradado del fondo (simulado con franjas)
  for (let i = 0; i < 40; i++) {
    const alpha = 1 - (i / 40);
    doc.setFillColor(41, 98, 255, alpha);
    doc.rect(0, 100 + i, doc.internal.pageSize.width, 1, 'F');
  }
  
  // Añadir logo de la empresa si está disponible
  if (companySettings?.logoUrl) {
    try {
      doc.addImage(
        companySettings.logoUrl, 
        'PNG', 
        doc.internal.pageSize.width / 2 - 25, 
        20, 
        50, 
        30, 
        '', 
        'FAST'
      );
    } catch (err) {
      console.error("Error al añadir el logo:", err);
    }
  }
  
  // Título del informe
  doc.setTextColor(255, 255, 255); // Blanco
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  const title = report.title || "Informe de Análisis SEO";
  doc.text(title, doc.internal.pageSize.width / 2, 80, { align: "center" });
  
  // Subtítulo
  doc.setFontSize(14);
  const reportType = report.type || "Análisis completo";
  doc.text(reportType, doc.internal.pageSize.width / 2, 90, { align: "center" });
  
  // Información del cliente
  doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
  doc.setFontSize(16);
  doc.text("Preparado para:", doc.internal.pageSize.width / 2, 130, { align: "center" });
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text(client.name, doc.internal.pageSize.width / 2, 145, { align: "center" });
  
  // Web analizada si existe
  if (report.url) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(12);
    doc.text(`URL: ${report.url}`, doc.internal.pageSize.width / 2, 160, { align: "center" });
  }
  
  // Fecha del informe
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  const reportDate = report.date 
    ? format(new Date(report.date), "d 'de' MMMM, yyyy", { locale: es })
    : format(new Date(), "d 'de' MMMM, yyyy", { locale: es });
  doc.text(`Fecha: ${reportDate}`, doc.internal.pageSize.width / 2, 175, { align: "center" });
  
  // Información de la empresa
  if (companySettings) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    const companyInfo = [
      companySettings.companyName || "Tu Empresa de SEO",
      companySettings.address || "",
      companySettings.email || "",
      companySettings.phone || "",
    ].filter(Boolean).join(" | ");
    
    doc.text(companyInfo, doc.internal.pageSize.width / 2, 270, { align: "center" });
  }
  
  // Decoración visual (línea en la parte inferior)
  doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setLineWidth(3);
  doc.line(40, 260, doc.internal.pageSize.width - 40, 260);
};

/**
 * Adds a header to each page of the document
 */
export const addHeader = (doc: jsPDF, title: string, companySettings?: CompanySettings) => {
  const pageWidth = doc.internal.pageSize.width;
  
  // Background strip
  doc.setFillColor(COLORS.lightBg[0], COLORS.lightBg[1], COLORS.lightBg[2]);
  doc.rect(0, 0, pageWidth, 15, 'F');
  
  // Add logo if available
  if (companySettings?.logoUrl) {
    try {
      doc.addImage(companySettings.logoUrl, 'PNG', 10, 2, 24, 10, '', 'FAST');
    } catch (err) {
      console.error("Error al añadir el logo en el encabezado:", err);
    }
  }
  
  // Add title
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  const displayTitle = title.length > 50 ? title.substring(0, 47) + "..." : title;
  doc.text(displayTitle, pageWidth - 15, 8, { align: "right" });
  
  // Divider line
  doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setLineWidth(0.5);
  doc.line(0, 15, pageWidth, 15);
};

/**
 * Adds a footer to each page of the document
 */
export const addFooter = (doc: jsPDF, pageNumber: number, totalPages?: number, companySettings?: CompanySettings) => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Background
  doc.setFillColor(COLORS.lightBg[0], COLORS.lightBg[1], COLORS.lightBg[2]);
  doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
  
  // Company name or website
  if (companySettings) {
    doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(companySettings.companyName || "", 10, pageHeight - 6);
  }
  
  // Page numbers
  doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const pageText = totalPages 
    ? `Página ${pageNumber} de ${totalPages}` 
    : `Página ${pageNumber}`;
  doc.text(pageText, pageWidth - 15, pageHeight - 6, { align: "right" });
  
  // Divider line
  doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setLineWidth(0.5);
  doc.line(0, pageHeight - 15, pageWidth, pageHeight - 15);
};

/**
 * Adds a table of contents to the document
 */
export const addTableOfContents = (doc: jsPDF) => {
  doc.addPage();
  
  // Title
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Índice de Contenidos", 20, 30);
  
  // Divider
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);
  
  // Table of contents items with page numbers
  const sections = [
    { title: "1. Introducción", page: 3 },
    { title: "2. Análisis del Sitio Web", page: 4 },
    { title: "3. Palabras Clave Prioritarias", page: 5 },
    { title: "4. Análisis Técnico SEO", page: 6 },
    { title: "5. Recomendaciones y Estrategia", page: 7 },
    { title: "6. Análisis de Competidores", page: 8 },
    { title: "7. Conclusiones", page: 9 }
  ];
  
  let yPos = 45;
  doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
  
  sections.forEach((section) => {
    // Section title
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(section.title, 25, yPos);
    
    // Dotted line
    const titleWidth = doc.getTextWidth(section.title);
    const startX = 25 + titleWidth + 5;
    const endX = 185;
    
    doc.setLineDashPattern([1, 1], 0);
    doc.line(startX, yPos - 2, endX, yPos - 2);
    
    // Page number
    doc.setFont("helvetica", "bold");
    doc.text(section.page.toString(), 190, yPos, { align: "right" });
    
    yPos += 12;
  });
  
  // Reset line dash
  doc.setLineDashPattern([], 0);
};

/**
 * Adds the introduction section to the PDF
 */
export const addIntroductionSection = (doc: jsPDF, report: any, client: Client, startY: number): number => {
  // Add section title
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("1. Introducción", 20, startY);
  
  // Add divider
  doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setLineWidth(0.5);
  doc.line(20, startY + 4, 190, startY + 4);
  
  let yPos = startY + 15;
  
  // Add introduction text
  doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  
  const introText = report.analyticsData?.aiReport?.introduction || 
    `Este informe proporciona un análisis detallado del posicionamiento actual del sitio web de ${client.name} en los motores de búsqueda, identificando fortalezas, debilidades y oportunidades de mejora. A través de este análisis, se presentan recomendaciones estratégicas para mejorar la visibilidad online y aumentar el tráfico orgánico.`;
  
  const splitIntro = doc.splitTextToSize(introText, 170);
  doc.text(splitIntro, 20, yPos);
  
  yPos += splitIntro.length * 6 + 10;
  
  // Add project scope if available
  if (report.analyticsData?.aiReport?.scope) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Alcance del Proyecto", 20, yPos);
    yPos += 8;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const scopeText = report.analyticsData.aiReport.scope;
    const splitScope = doc.splitTextToSize(scopeText, 170);
    doc.text(splitScope, 20, yPos);
    
    yPos += splitScope.length * 6 + 10;
  }
  
  // Add objectives section with bullet points
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Objetivos del Análisis", 20, yPos);
  yPos += 8;
  
  const objectives = [
    "Evaluar el posicionamiento actual del sitio web en los motores de búsqueda",
    "Identificar oportunidades de mejora en el contenido y estructura del sitio",
    "Proporcionar recomendaciones estratégicas para aumentar la visibilidad online",
    "Definir palabras clave prioritarias para optimizar el contenido",
    "Analizar la competencia y establecer ventajas competitivas"
  ];
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  
  objectives.forEach((objective) => {
    doc.circle(25, yPos - 2, 1, 'F');
    const splitObjective = doc.splitTextToSize(objective, 165);
    doc.text(splitObjective, 30, yPos);
    yPos += splitObjective.length * 5 + 5;
  });
  
  return yPos;
};

/**
 * Adds the website analysis section to the PDF
 */
export const addWebsiteAnalysisSection = (doc: jsPDF, auditResult: AuditResult, startY: number): number => {
  // Add section title
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("2. Análisis del Sitio Web", 20, startY);
  
  // Add divider
  doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setLineWidth(0.5);
  doc.line(20, startY + 4, 190, startY + 4);
  
  let yPos = startY + 15;
  
  // Performance metrics - create scorecard style boxes
  const scores = [
    { title: "Puntuación SEO", value: auditResult.seoScore || 0, color: getScoreColor(auditResult.seoScore) },
    { title: "Rendimiento", value: auditResult.performance || 0, color: getScoreColor(auditResult.performance) },
    { title: "Visibilidad", value: auditResult.webVisibility || 0, color: getScoreColor(auditResult.webVisibility) },
    { title: "Palabras Clave", value: auditResult.keywordsCount || 0, color: getScoreColor(75) } // Default score color
  ];
  
  // Create score cards in a 2x2 grid
  const cardWidth = 80;
  const cardHeight = 40;
  const margin = 10;
  
  for (let i = 0; i < scores.length; i++) {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const x = 20 + col * (cardWidth + margin);
    const y = yPos + row * (cardHeight + margin);
    
    // Card background with rounded corners
    doc.setFillColor(scores[i].color[0], scores[i].color[1], scores[i].color[2], 0.1);
    doc.roundedRect(x, y, cardWidth, cardHeight, 5, 5, 'F');
    
    // Card title
    doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(scores[i].title, x + 5, y + 10);
    
    // Score value
    doc.setTextColor(scores[i].color[0], scores[i].color[1], scores[i].color[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(`${scores[i].value}%`, x + 5, y + 30);
  }
  
  yPos += 110;
  
  // Website metrics table
  const metricsData = [];
  
  if (auditResult.metrics) {
    for (const [key, value] of Object.entries(auditResult.metrics)) {
      // Format metric name from camelCase to readable text
      const metricName = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase());
      
      metricsData.push([metricName, value.toString()]);
    }
    
    if (metricsData.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
      doc.text("Métricas Clave", 20, yPos);
      
      yPos += 8;
      
      autoTable(doc, {
        startY: yPos,
        head: [['Métrica', 'Valor']],
        body: metricsData,
        theme: 'grid',
        headStyles: {
          fillColor: [COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        styles: {
          fontSize: 10,
          cellPadding: 5,
        },
        columnStyles: {
          0: { fontStyle: 'bold' },
        },
        margin: { left: 20, right: 20 },
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 15;
    }
  }
  
  return yPos;
};

/**
 * Adds the keywords section to the PDF
 */
export const addKeywordsSection = (doc: jsPDF, aiReport: any, startY: number): number => {
  // Add section title
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("3. Palabras Clave Prioritarias", 20, startY);
  
  // Add divider
  doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setLineWidth(0.5);
  doc.line(20, startY + 4, 190, startY + 4);
  
  let yPos = startY + 15;
  
  // Add explanatory text
  doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  
  const keywordsIntro = "Tras un análisis detallado, hemos identificado las siguientes palabras clave que son estratégicas para mejorar la visibilidad de su sitio web. Estas palabras clave están seleccionadas en base a su relevancia para el negocio, volumen de búsqueda y dificultad de posicionamiento.";
  
  const splitIntro = doc.splitTextToSize(keywordsIntro, 170);
  doc.text(splitIntro, 20, yPos);
  
  yPos += splitIntro.length * 6 + 10;
  
  // Create keywords table
  if (aiReport.priorityKeywords && aiReport.priorityKeywords.length > 0) {
    const keywordsData = aiReport.priorityKeywords.map((kw: any) => [
      kw.keyword || "N/A",
      kw.position?.toString() || "N/A",
      kw.volume?.toString() || "N/A",
      kw.difficulty?.toString() || "N/A",
      kw.recommendation || ""
    ]);
    
    autoTable(doc, {
      startY: yPos,
      head: [['Palabra Clave', 'Posición', 'Volumen', 'Dificultad', 'Recomendación']],
      body: keywordsData,
      theme: 'grid',
      headStyles: {
        fillColor: [COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 9,
        cellPadding: 5,
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 40 },
        4: { cellWidth: 60 }
      },
      margin: { left: 20, right: 20 },
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 15;
  } else {
    doc.setFont("helvetica", "italic");
    doc.text("No hay palabras clave prioritarias definidas en este informe.", 20, yPos);
    yPos += 15;
  }
  
  // Opportunity keywords visualization (if available)
  if (aiReport.opportunityKeywords) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.text("Oportunidades de Palabras Clave", 20, yPos);
    
    yPos += 8;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
    
    const opportunityText = "Estas palabras clave representan oportunidades para ganar visibilidad con un esfuerzo optimizado.";
    doc.text(opportunityText, 20, yPos);
    
    yPos += 10;
    
    // Create opportunity keywords visualization
    const opportunityKeywords = aiReport.opportunityKeywords.slice(0, 8); // Limit to 8
    
    if (opportunityKeywords.length > 0) {
      const boxWidth = 80;
      const boxHeight = 30;
      const margin = 10;
      
      for (let i = 0; i < opportunityKeywords.length; i++) {
        const row = Math.floor(i / 2);
        const col = i % 2;
        const x = 20 + col * (boxWidth + margin);
        const y = yPos + row * (boxHeight + margin);
        
        // Box with light background
        doc.setFillColor(COLORS.lightBg[0], COLORS.lightBg[1], COLORS.lightBg[2]);
        doc.roundedRect(x, y, boxWidth, boxHeight, 3, 3, 'F');
        
        // Keyword text
        doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        
        const keyword = opportunityKeywords[i].keyword || "Palabra clave";
        doc.text(keyword, x + 5, y + 10);
        
        // Volume and difficulty if available
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        let details = "";
        
        if (opportunityKeywords[i].volume) {
          details += `Vol: ${opportunityKeywords[i].volume}`;
        }
        
        if (opportunityKeywords[i].difficulty) {
          details += details ? ` | Dif: ${opportunityKeywords[i].difficulty}` : `Dif: ${opportunityKeywords[i].difficulty}`;
        }
        
        if (details) {
          doc.text(details, x + 5, y + 20);
        }
      }
      
      yPos += (Math.ceil(opportunityKeywords.length / 2) * (boxHeight + margin)) + 10;
    }
  }
  
  return yPos;
};

/**
 * Adds the technical SEO section to the PDF
 */
export const addTechnicalSEOSection = (doc: jsPDF, auditResult: AuditResult, startY: number): number => {
  // Add section title
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("4. Análisis Técnico SEO", 20, startY);
  
  // Add divider
  doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setLineWidth(0.5);
  doc.line(20, startY + 4, 190, startY + 4);
  
  let yPos = startY + 15;
  
  // Add explanatory text
  doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  
  const technicalIntro = "El análisis técnico SEO identifica factores clave que afectan al rendimiento de su sitio web en los motores de búsqueda. A continuación se presentan los principales hallazgos y recomendaciones técnicas.";
  
  const splitIntro = doc.splitTextToSize(technicalIntro, 170);
  doc.text(splitIntro, 20, yPos);
  
  yPos += splitIntro.length * 6 + 10;
  
  // Create technical issues table
  if (auditResult.technicalIssues && auditResult.technicalIssues.length > 0) {
    const issuesData = auditResult.technicalIssues.map(issue => [
      issue.name || "Error desconocido",
      issue.severity || "Media",
      issue.description || ""
    ]);
    
    autoTable(doc, {
      startY: yPos,
      head: [['Problema', 'Severidad', 'Descripción']],
      body: issuesData,
      theme: 'grid',
      headStyles: {
        fillColor: [COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 9,
        cellPadding: 5,
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 50 },
        1: { cellWidth: 30 },
        2: { cellWidth: 100 }
      },
      margin: { left: 20, right: 20 },
      didDrawCell: (data) => {
        // Color severity cells based on value
        if (data.column.index === 1 && data.cell.section === 'body') {
          const severity = data.cell.raw?.toString().toLowerCase() || '';
          if (severity.includes('alta') || severity.includes('crítica')) {
            doc.setFillColor(244, 67, 54, 0.2);  // Red with transparency
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
          } else if (severity.includes('media')) {
            doc.setFillColor(255, 152, 0, 0.2);  // Orange with transparency
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
          } else if (severity.includes('baja')) {
            doc.setFillColor(76, 175, 80, 0.2);  // Green with transparency
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
          }
        }
      }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 15;
  } else {
    doc.setFont("helvetica", "italic");
    doc.text("No se han detectado problemas técnicos significativos.", 20, yPos);
    yPos += 15;
  }
  
  // Add PageSpeed metrics from AuditResult.pagespeed if available
  if (auditResult.pagespeed) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.text("Métricas de Rendimiento", 20, yPos);
    
    yPos += 10;
    
    const metrics = [
      { name: "First Contentful Paint", value: auditResult.pagespeed.fcp ? `${auditResult.pagespeed.fcp}s` : "N/A" },
      { name: "Largest Contentful Paint", value: auditResult.pagespeed.lcp ? `${auditResult.pagespeed.lcp}s` : "N/A" },
      { name: "Cumulative Layout Shift", value: auditResult.pagespeed.cls?.toString() || "N/A" },
      { name: "Total Blocking Time", value: auditResult.pagespeed.tbt ? `${auditResult.pagespeed.tbt}ms` : "N/A" },
      { name: "Performance", value: auditResult.pagespeed.performance ? `${auditResult.pagespeed.performance}%` : "N/A" },
      { name: "SEO", value: auditResult.pagespeed.seo ? `${auditResult.pagespeed.seo}%` : "N/A" }
    ];
    
    // Create horizontal bar chart
    const barMaxWidth = 140;
    const barHeight = 12;
    const barMargin = 8;
    
    metrics.forEach((metric, index) => {
      const y = yPos + (index * (barHeight + barMargin));
      
      // Metric name
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
      doc.text(metric.name, 20, y);
      
      // Value (either time or score)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      const value = metric.value?.toString() || "N/A";
      doc.text(value, 190, y, { align: "right" });
      
      // Background bar
      doc.setFillColor(COLORS.lightGrey[0], COLORS.lightGrey[1], COLORS.lightGrey[2]);
      doc.rect(20, y + 3, barMaxWidth, barHeight / 2, 'F');
      
      // Value bar (normalized between 0-1 where applicable)
      let barValue = 0.5; // Default middle value
      
      if (typeof metric.value === 'string') {
        // Extract numeric value from string (e.g. "80%" -> 80, "1.2s" -> 1.2)
        const numericMatch = metric.value.match(/^([\d.]+)/);
        if (numericMatch && numericMatch[1]) {
          const numericValue = parseFloat(numericMatch[1]);
          
          if (metric.name.includes("Performance") || metric.name.includes("SEO")) {
            // Score metrics (higher is better)
            barValue = Math.min(1, Math.max(0, numericValue / 100));
          } else if (metric.name.includes("Layout Shift")) {
            // CLS (lower is better, 0-0.1 is good, 0.1-0.25 is ok, >0.25 is poor)
            barValue = Math.min(1, Math.max(0, 1 - numericValue * 4));
          } else if (metric.name.includes("Paint") || metric.name.includes("Time")) {
            // Time metrics (lower is better)
            // Normalize approximately (this is simplified)
            barValue = Math.min(1, Math.max(0, 1 - (numericValue / 5)));
          }
        }
      }
      
      // Color based on value (green for good, red for poor)
      const barColor = getGradientColor(barValue);
      doc.setFillColor(barColor[0], barColor[1], barColor[2]);
      doc.rect(20, y + 3, barMaxWidth * barValue, barHeight / 2, 'F');
    });
    
    yPos += (metrics.length * (barHeight + barMargin)) + 15;
  }
  
  return yPos;
};

/**
 * Adds the recommendations section to the PDF
 */
export const addRecommendationsSection = (doc: jsPDF, aiReport: any, startY: number): number => {
  // Add section title
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("5. Recomendaciones y Estrategia", 20, startY);
  
  // Add divider
  doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setLineWidth(0.5);
  doc.line(20, startY + 4, 190, startY + 4);
  
  let yPos = startY + 15;
  
  // Add section introduction
  doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  
  const recommendationsIntro = "Basándonos en el análisis realizado, hemos desarrollado las siguientes recomendaciones estratégicas para mejorar el posicionamiento de su sitio web y aumentar su visibilidad online.";
  
  const splitIntro = doc.splitTextToSize(recommendationsIntro, 170);
  doc.text(splitIntro, 20, yPos);
  
  yPos += splitIntro.length * 6 + 10;
  
  if (aiReport.strategy) {
    // Technical optimization
    if (aiReport.strategy.technicalOptimization && aiReport.strategy.technicalOptimization.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
      doc.text("Optimización Técnica", 20, yPos);
      
      yPos += 8;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
      
      aiReport.strategy.technicalOptimization.forEach((item: string, index: number) => {
        const bulletPoint = `${index + 1}. ${item}`;
        const splitPoint = doc.splitTextToSize(bulletPoint, 165);
        doc.text(splitPoint, 20, yPos);
        yPos += splitPoint.length * 5 + 5;
      });
      
      yPos += 10;
    }
    
    // Content strategy
    if (aiReport.strategy.contentCreation && aiReport.strategy.contentCreation.length > 0) {
      // Check if we need a new page
      if (yPos > 240) {
        doc.addPage();
        yPos = 30;
      }
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
      doc.text("Estrategia de Contenidos", 20, yPos);
      
      yPos += 8;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
      
      aiReport.strategy.contentCreation.forEach((item: string, index: number) => {
        const bulletPoint = `${index + 1}. ${item}`;
        const splitPoint = doc.splitTextToSize(bulletPoint, 165);
        doc.text(splitPoint, 20, yPos);
        yPos += splitPoint.length * 5 + 5;
      });
      
      yPos += 10;
    }
    
    // Local SEO (if available)
    if (aiReport.strategy.localSeo && aiReport.strategy.localSeo.length > 0) {
      // Check if we need a new page
      if (yPos > 240) {
        doc.addPage();
        yPos = 30;
      }
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
      doc.text("SEO Local", 20, yPos);
      
      yPos += 8;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
      
      aiReport.strategy.localSeo.forEach((item: string, index: number) => {
        const bulletPoint = `${index + 1}. ${item}`;
        const splitPoint = doc.splitTextToSize(bulletPoint, 165);
        doc.text(splitPoint, 20, yPos);
        yPos += splitPoint.length * 5 + 5;
      });
      
      yPos += 10;
    }
  } else {
    doc.setFont("helvetica", "italic");
    doc.text("No hay recomendaciones estratégicas definidas en este informe.", 20, yPos);
    yPos += 15;
  }
  
  // Timeline for implementation
  // Check if we need a new page
  if (yPos > 220) {
    doc.addPage();
    yPos = 30;
  }
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text("Línea de Tiempo Recomendada", 20, yPos);
  
  yPos += 8;
  
  const timelineData = [
    ["Fase 1 (Mes 1)", "Optimización técnica y corrección de errores críticos"],
    ["Fase 2 (Mes 2-3)", "Optimización de contenido existente y creación de nuevos contenidos"],
    ["Fase 3 (Mes 4-5)", "Estrategia de link building y autoridad de dominio"],
    ["Fase 4 (Mes 6)", "Revisión de resultados y ajuste de estrategia"]
  ];
  
  autoTable(doc, {
    startY: yPos,
    head: [['Fase', 'Actividades']],
    body: timelineData,
    theme: 'grid',
    headStyles: {
      fillColor: [COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { cellWidth: 130 }
    },
    margin: { left: 20, right: 20 },
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 15;
  
  return yPos;
};

/**
 * Adds the competitors section to the PDF
 */
export const addCompetitorsSection = (doc: jsPDF, aiReport: any, startY: number): number => {
  // Add section title
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("6. Análisis de Competidores", 20, startY);
  
  // Add divider
  doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setLineWidth(0.5);
  doc.line(20, startY + 4, 190, startY + 4);
  
  let yPos = startY + 15;
  
  // Add section introduction
  doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  
  const competitorsIntro = "Hemos analizado los principales competidores en su sector para identificar sus estrategias de posicionamiento y encontrar oportunidades para superarlos.";
  
  const splitIntro = doc.splitTextToSize(competitorsIntro, 170);
  doc.text(splitIntro, 20, yPos);
  
  yPos += splitIntro.length * 6 + 10;
  
  if (aiReport.competitors && aiReport.competitors.length > 0) {
    const competitorsData = aiReport.competitors.map((comp: any) => [
      comp.name || "N/A",
      comp.trafficScore?.toString() || "N/A",
      comp.keywordsCount?.toString() || "N/A",
      comp.backlinksCount?.toString() || "N/A",
      comp.analysis || "Sin análisis disponible"
    ]);
    
    autoTable(doc, {
      startY: yPos,
      head: [['Competidor', 'Tráfico', 'Keywords', 'Backlinks', 'Análisis']],
      body: competitorsData,
      theme: 'grid',
      headStyles: {
        fillColor: [COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 9,
        cellPadding: 5,
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 30 },
        1: { cellWidth: 20 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 80 }
      },
      margin: { left: 20, right: 20 },
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 15;
    
    // Competitive advantage
    if (aiReport.competitiveAdvantage) {
      // Check if we need a new page
      if (yPos > 220) {
        doc.addPage();
        yPos = 30;
      }
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
      doc.text("Ventajas Competitivas", 20, yPos);
      
      yPos += 8;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
      
      const advantageText = aiReport.competitiveAdvantage;
      const splitAdvantage = doc.splitTextToSize(advantageText, 170);
      doc.text(splitAdvantage, 20, yPos);
      
      yPos += splitAdvantage.length * 5 + 15;
    }
  } else {
    doc.setFont("helvetica", "italic");
    doc.text("No hay análisis de competidores definido en este informe.", 20, yPos);
    yPos += 15;
  }
  
  return yPos;
};

/**
 * Adds the conclusion section to the PDF
 */
export const addConclusionSection = (doc: jsPDF, aiReport: any, startY: number): number => {
  // Add section title
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("7. Conclusiones", 20, startY);
  
  // Add divider
  doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setLineWidth(0.5);
  doc.line(20, startY + 4, 190, startY + 4);
  
  let yPos = startY + 15;
  
  // Add conclusion text
  doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  
  const conclusionText = aiReport.conclusion || 
    "Este análisis ha identificado las principales áreas de mejora y oportunidades para optimizar el posicionamiento de su sitio web. Implementando las recomendaciones propuestas de manera sistemática, se puede esperar un aumento significativo en la visibilidad online, tráfico orgánico y conversiones.\n\nRecuerde que el SEO es un proceso continuo que requiere tiempo y consistencia. Los primeros resultados suelen ser visibles a partir del tercer mes de implementación, con mejoras progresivas a medida que los motores de búsqueda reconocen los cambios realizados.";
  
  const splitConclusion = doc.splitTextToSize(conclusionText, 170);
  doc.text(splitConclusion, 20, yPos);
  
  yPos += splitConclusion.length * 6 + 15;
  
  // Packages section (if available)
  if (aiReport.packages && aiReport.packages.length > 0) {
    // Check if we need a new page
    if (yPos > 180) {
      doc.addPage();
      yPos = 30;
    }
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.text("Planes de Servicio Recomendados", 20, yPos);
    
    yPos += 10;
    
    // Create package cards
    const packageWidth = 170;
    const packageMargin = 15;
    
    aiReport.packages.forEach((pkg: any, index: number) => {
      // Check if we need a new page
      if (yPos > 230) {
        doc.addPage();
        yPos = 30;
      }
      
      // Calculate height based on features
      const featuresHeight = (pkg.features?.length || 0) * 6 + 10;
      const packageHeight = 50 + featuresHeight;
      
      // Background with gradient effect (lighter at top)
      for (let i = 0; i < packageHeight; i++) {
        const alpha = 0.1 - (i / packageHeight) * 0.05;
        doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2], alpha);
        doc.rect(20, yPos + i, packageWidth, 1, 'F');
      }
      
      // Package border
      doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
      doc.setLineWidth(0.5);
      doc.roundedRect(20, yPos, packageWidth, packageHeight, 3, 3, 'S');
      
      // Package name
      doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(pkg.name || `Plan ${index + 1}`, 30, yPos + 15);
      
      // Price
      doc.setTextColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]);
      doc.setFontSize(16);
      doc.text(`${pkg.price || "Consultar"} €/mes`, 170, yPos + 15, { align: "right" });
      
      // Divider line
      doc.setDrawColor(COLORS.lightGrey[0], COLORS.lightGrey[1], COLORS.lightGrey[2]);
      doc.setLineWidth(0.3);
      doc.line(25, yPos + 20, packageWidth - 5, yPos + 20);
      
      // Features
      if (pkg.features && pkg.features.length > 0) {
        doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        
        pkg.features.forEach((feature: string, featureIndex: number) => {
          doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
          doc.circle(28, yPos + 30 + (featureIndex * 6), 1, 'F');
          doc.text(feature, 35, yPos + 30 + (featureIndex * 6));
        });
      }
      
      yPos += packageHeight + packageMargin;
    });
  }
  
  return yPos;
};

/**
 * Adds the contact section to the PDF
 */
export const addContactSection = (doc: jsPDF, companySettings?: CompanySettings, startY?: number): number => {
  // Check if we need a new page
  let yPos = startY || 240;
  if (yPos > 240) {
    doc.addPage();
    yPos = 30;
  }
  
  // Background for contact section
  doc.setFillColor(COLORS.lightBg[0], COLORS.lightBg[1], COLORS.lightBg[2]);
  doc.rect(0, yPos, doc.internal.pageSize.width, 40, 'F');
  
  // Contact information
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Contacto", doc.internal.pageSize.width / 2, yPos + 10, { align: "center" });
  
  if (companySettings) {
    doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    const contactText = [
      companySettings.companyName || "Tu Empresa de SEO",
      companySettings.email ? `Email: ${companySettings.email}` : "",
      companySettings.phone ? `Teléfono: ${companySettings.phone}` : "",
    ].filter(Boolean).join(" | ");
    
    doc.text(contactText, doc.internal.pageSize.width / 2, yPos + 20, { align: "center" });
    
    if (companySettings.address) {
      doc.text(companySettings.address, doc.internal.pageSize.width / 2, yPos + 30, { align: "center" });
    }
  } else {
    doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Contacta con nosotros para más información", doc.internal.pageSize.width / 2, yPos + 20, { align: "center" });
  }
  
  return yPos + 40;
};

// Utility function to get color based on score
function getScoreColor(score?: number): number[] {
  if (!score) return COLORS.warning;
  
  if (score >= 90) return COLORS.success;
  if (score >= 50) return COLORS.warning;
  return COLORS.error;
}

// Utility function to get gradient color between red and green
function getGradientColor(value: number): number[] {
  // value should be between 0 and 1
  // 0 = red, 0.5 = yellow, 1 = green
  if (value <= 0.5) {
    // Red to Yellow
    const r = 255;
    const g = Math.round(255 * (value * 2));
    const b = 0;
    return [r, g, b];
  } else {
    // Yellow to Green
    const r = Math.round(255 * (1 - (value - 0.5) * 2));
    const g = 255;
    const b = 0;
    return [r, g, b];
  }
}
