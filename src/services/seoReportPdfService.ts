
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { AIReport } from "@/services/aiReportService";
import { getClient } from "./clientService";
import { getSeoPack } from "./packService";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AuditResult } from "./pdfAnalyzer";

export const generateSeoReportPdf = async (report: AIReport, auditData: AuditResult): Promise<Blob> => {
  try {
    // Crear documento PDF
    const doc = new jsPDF();
    
    // Configurar fuentes
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    
    // Agregar título con estilo mejorado
    doc.setTextColor(44, 62, 80); // Color oscuro para el título
    doc.text("INFORME DE AUDITORÍA SEO", 105, 20, { align: "center" });
    
    // Agregar subtítulo
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(52, 152, 219); // Color azul para el subtítulo
    doc.text(auditData.domain || "Análisis SEO", 105, 30, { align: "center" });
    
    // Agregar línea decorativa
    doc.setDrawColor(52, 152, 219);
    doc.setLineWidth(0.5);
    doc.line(14, 35, 196, 35);
    
    // Introducción
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text("Introducción", 14, 45);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    const introText = report.introduction || "Este informe presenta un análisis detallado del estado actual del sitio web y propone estrategias para mejorar su posicionamiento en buscadores.";
    const splitIntro = doc.splitTextToSize(introText, 180);
    doc.text(splitIntro, 14, 55);
    
    let yPos = 55 + (splitIntro.length * 5);
    
    // Análisis actual
    yPos += 15;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text("Análisis Actual del Sitio Web", 14, yPos);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    yPos += 10;
    
    // Métricas clave
    const metricsData = [
      ["Authority Score:", `${report.authorityScore}/100`, report.authorityScoreComment || ""],
      ["Tráfico Orgánico Mensual:", `${report.organicTraffic || "N/A"} visitas`, report.organicTrafficComment || ""],
      ["Palabras Clave Posicionadas:", report.keywordsPositioned || "N/A", report.keywordsComment || ""],
      ["Backlinks:", report.backlinksCount || "N/A", report.backlinksComment || ""]
    ];
    
    autoTable(doc, {
      startY: yPos,
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
    
    yPos = (doc as any).lastAutoTable.finalY + 10;
    
    // Palabras clave prioritarias
    if (report.priorityKeywords && report.priorityKeywords.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(44, 62, 80);
      doc.text("Palabras Clave Prioritarias", 14, yPos);
      
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
      
      yPos = (doc as any).lastAutoTable.finalY + 10;
    }
    
    // Comparativa con competidores
    if (report.competitors && report.competitors.length > 0) {
      // Verificar si necesitamos una nueva página
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(44, 62, 80);
      doc.text("Comparativa con Competidores", 14, yPos);
      
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
      
      yPos = (doc as any).lastAutoTable.finalY + 10;
    }
    
    // Estrategia propuesta
    // Verificar si necesitamos una nueva página
    if (yPos > 240) {
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
    
    // Optimización técnica
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
    
    // SEO Local
    if (report.strategy && report.strategy.localSeo) {
      // Verificar si necesitamos una nueva página
      if (yPos > 240) {
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
    
    // Creación de contenido
    if (report.strategy && report.strategy.contentCreation) {
      // Verificar si necesitamos una nueva página
      if (yPos > 240) {
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
    
    // Planes de tarifas
    // Verificar si necesitamos una nueva página
    if (yPos > 180) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text("Planes de Tarifas", 14, yPos);
    
    yPos += 10;
    
    // Aquí se podrían incluir los paquetes disponibles
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
    
    // Conclusión
    // Verificar si necesitamos una nueva página
    if (yPos > 230) {
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
    
    yPos += splitConclusion.length * 5 + 15;
    
    // Datos de contacto
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
    
    // Pie de página
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
    
    // Generar el Blob
    const pdfBlob = doc.output("blob");
    return pdfBlob;
  } catch (error) {
    console.error("Error al generar el PDF del informe SEO:", error);
    throw new Error("No se pudo generar el PDF del informe SEO");
  }
};

export const downloadSeoReportPdf = async (report: AIReport, auditData: AuditResult): Promise<boolean> => {
  try {
    // Generar el PDF
    const pdfBlob = await generateSeoReportPdf(report, auditData);
    
    // Crear URL para el blob
    const blobUrl = URL.createObjectURL(pdfBlob);
    
    // Crear elemento a para descargar
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `informe-seo-${auditData.domain || "sitio"}.pdf`;
    document.body.appendChild(a);
    a.click();
    
    // Limpiar
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
    
    return true;
  } catch (error) {
    console.error("Error al descargar el PDF del informe SEO:", error);
    return false;
  }
};

