
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { AIReport } from "@/services/aiReportService";
import { format } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Add the introduction section to the PDF
 */
export const addIntroductionSection = (doc: jsPDF, report: AIReport, startY: number): number => {
  // Introduction
  const yPos = startY + 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(44, 62, 80);
  doc.text("Introducción", 14, yPos);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  const introText = report.introduction || "Este informe presenta un análisis detallado del estado actual del sitio web y propone estrategias para mejorar su posicionamiento en buscadores.";
  const splitIntro = doc.splitTextToSize(introText, 180);
  doc.text(splitIntro, 14, yPos + 10);
  
  return yPos + 10 + (splitIntro.length * 5);
};

/**
 * Add the analysis section to the PDF
 */
export const addAnalysisSection = (doc: jsPDF, report: AIReport, startY: number): number => {
  // Current site analysis
  const yPos = startY + 15;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(44, 62, 80);
  doc.text("Análisis Actual del Sitio Web", 14, yPos);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  // Key metrics
  const metricsData = [
    ["Authority Score:", `${report.authorityScore}/100`, report.authorityScoreComment || ""],
    ["Tráfico Orgánico Mensual:", `${report.organicTraffic || "N/A"} visitas`, report.organicTrafficComment || ""],
    ["Palabras Clave Posicionadas:", report.keywordsPositioned || "N/A", report.keywordsComment || ""],
    ["Backlinks:", report.backlinksCount || "N/A", report.backlinksComment || ""]
  ];
  
  autoTable(doc, {
    startY: yPos + 10,
    head: [["Métrica", "Valor", "Análisis"]],
    body: metricsData,
    theme: "striped",
    headStyles: { 
      fillColor: [52, 152, 219],
      textColor: [255, 255, 255],
      fontStyle: "bold" 
    },
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: "bold" },
      2: { cellWidth: 80 }
    }
  });
  
  return (doc as any).lastAutoTable.finalY + 10;
};

/**
 * Add the priority keywords section to the PDF
 */
export const addPriorityKeywordsSection = (doc: jsPDF, report: AIReport, startY: number): number => {
  // Check if we need to add a new page
  let yPos = startY;
  if (yPos > 220) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(44, 62, 80);
  doc.text("Palabras Clave Prioritarias", 14, yPos);
  
  if (report.priorityKeywords && report.priorityKeywords.length > 0) {
    const keywordsData = report.priorityKeywords.map(kw => [
      kw.keyword,
      kw.position?.toString() || "N/A",
      kw.volume?.toString() || "N/A",
      kw.difficulty?.toString() || "N/A",
      kw.recommendation || ""
    ]);
    
    autoTable(doc, {
      startY: yPos + 5,
      head: [["Palabra Clave", "Posición", "Volumen", "Dificultad", "Recomendación"]],
      body: keywordsData,
      theme: "striped",
      headStyles: { 
        fillColor: [52, 152, 219],
        textColor: [255, 255, 255],
        fontStyle: "bold" 
      },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 40 },
        4: { cellWidth: 60 }
      }
    });
  }
  
  return (doc as any).lastAutoTable.finalY + 10;
};

/**
 * Add the competitors section to the PDF
 */
export const addCompetitorsSection = (doc: jsPDF, report: AIReport, startY: number): number => {
  // Check if we need to add a new page
  let yPos = startY;
  if (yPos > 220) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(44, 62, 80);
  doc.text("Comparativa con Competidores", 14, yPos);
  
  if (report.competitors && report.competitors.length > 0) {
    const competitorsData = report.competitors.map(comp => [
      comp.name,
      comp.trafficScore?.toString() || "N/A",
      comp.keywordsCount?.toString() || "N/A",
      comp.backlinksCount?.toString() || "N/A",
      comp.analysis || ""
    ]);
    
    autoTable(doc, {
      startY: yPos + 5,
      head: [["Competidor", "Tráfico", "Keywords", "Backlinks", "Análisis"]],
      body: competitorsData,
      theme: "striped",
      headStyles: { 
        fillColor: [52, 152, 219],
        textColor: [255, 255, 255],
        fontStyle: "bold" 
      },
      styles: { fontSize: 9 },
      columnStyles: {
        4: { cellWidth: 60 }
      }
    });
  }
  
  return (doc as any).lastAutoTable.finalY + 10;
};

/**
 * Add the strategy section to the PDF
 */
export const addStrategySection = (doc: jsPDF, report: AIReport, startY: number): number => {
  // Check if we need to add a new page
  let yPos = startY;
  if (yPos > 220) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(44, 62, 80);
  doc.text("Estrategia Propuesta", 14, yPos);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  
  yPos += 10;
  
  // Technical optimization
  if (report.strategy && report.strategy.technicalOptimization) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Optimización Técnica y On-Page", 14, yPos);
    
    const technicalData = report.strategy.technicalOptimization.map(item => [item]);
    
    autoTable(doc, {
      startY: yPos + 5,
      body: technicalData,
      theme: "striped",
      styles: { 
        fontSize: 10,
        cellPadding: 4
      }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 10;
  }
  
  // Local SEO
  if (report.strategy && report.strategy.localSeo) {
    // Check if we need to add a new page
    if (yPos > 220) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("SEO Local y Geolocalización", 14, yPos);
    
    const localSeoData = report.strategy.localSeo.map(item => [item]);
    
    autoTable(doc, {
      startY: yPos + 5,
      body: localSeoData,
      theme: "striped",
      styles: { 
        fontSize: 10,
        cellPadding: 4
      }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 10;
  }
  
  // Content creation
  if (report.strategy && report.strategy.contentCreation) {
    // Check if we need to add a new page
    if (yPos > 220) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Creación de Contenido y Blog", 14, yPos);
    
    const contentData = report.strategy.contentCreation.map(item => [item]);
    
    autoTable(doc, {
      startY: yPos + 5,
      body: contentData,
      theme: "striped",
      styles: { 
        fontSize: 10,
        cellPadding: 4
      }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 10;
  }
  
  return yPos;
};

/**
 * Add the packages section to the PDF
 */
export const addPackagesSection = (doc: jsPDF, report: AIReport, startY: number): number => {
  // Check if we need to add a new page
  let yPos = startY;
  if (yPos > 180) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(44, 62, 80);
  doc.text("Planes de Tarifas", 14, yPos);
  
  yPos += 10;
  
  // Include available packages
  if (report.packages && report.packages.length > 0) {
    const packagesData = report.packages.map(pack => [
      pack.name,
      `${pack.price} €/mes`,
      pack.features.join(", ")
    ]);
    
    autoTable(doc, {
      startY: yPos,
      head: [["Plan", "Precio", "Características"]],
      body: packagesData,
      theme: "striped",
      headStyles: { 
        fillColor: [52, 152, 219],
        textColor: [255, 255, 255],
        fontStyle: "bold" 
      },
      styles: { fontSize: 10 },
      columnStyles: {
        2: { cellWidth: 100 }
      }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 10;
  }
  
  return yPos;
};

/**
 * Add the conclusion section to the PDF
 */
export const addConclusionSection = (doc: jsPDF, report: AIReport, startY: number): number => {
  // Check if we need to add a new page
  let yPos = startY;
  if (yPos > 220) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(44, 62, 80);
  doc.text("Conclusión y Siguientes Pasos", 14, yPos);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  yPos += 10;
  
  const conclusionText = report.conclusion || "Recomendamos comenzar cuanto antes con la implementación de las estrategias propuestas. Los primeros resultados suelen ser visibles a partir del tercer mes de trabajo constante.";
  const splitConclusion = doc.splitTextToSize(conclusionText, 180);
  doc.text(splitConclusion, 14, yPos);
  
  return yPos + splitConclusion.length * 5 + 15;
};

/**
 * Add the contact section to the PDF
 */
export const addContactSection = (doc: jsPDF, report: AIReport, startY: number): number => {
  let yPos = startY;
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(44, 62, 80);
  doc.text("Contacto", 14, yPos);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  yPos += 10;
  
  const contactData = [
    ["Email:", report.contactEmail || "info@empresa.com"],
    ["Teléfono:", report.contactPhone || "+34 123 456 789"]
  ];
  
  autoTable(doc, {
    startY: yPos,
    body: contactData,
    theme: "plain",
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 30 }
    }
  });
  
  return (doc as any).lastAutoTable.finalY;
};

/**
 * Add footers to all pages of the document
 */
export const addFooters = (doc: jsPDF): void => {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Página ${i} de ${pageCount} - Generado el ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: es })}`,
      105,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }
};
