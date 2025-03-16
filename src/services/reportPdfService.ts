
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ClientReport } from "@/types/client";
import { getClient } from "./clientService";
import { getDocument } from "./documentService";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const generateReportPdf = async (report: ClientReport): Promise<Blob> => {
  try {
    // Obtener datos del cliente
    const client = await getClient(report.clientId);
    
    // Obtener documentos asociados
    const documentData = [];
    if (report.documentIds && report.documentIds.length > 0) {
      for (const docId of report.documentIds) {
        const doc = await getDocument(docId);
        if (doc) {
          documentData.push(doc);
        }
      }
    }
    
    // Crear documento PDF
    const doc = new jsPDF();
    
    // Configurar fuentes
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    
    // Agregar título con estilo mejorado
    doc.setTextColor(44, 62, 80); // Color oscuro para el título
    doc.text("INFORME PROFESIONAL", 105, 20, { align: "center" });
    
    // Agregar subtítulo
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(52, 152, 219); // Color azul para el subtítulo
    doc.text(report.title || "Informe SEO", 105, 30, { align: "center" });
    
    // Agregar línea decorativa
    doc.setDrawColor(52, 152, 219);
    doc.setLineWidth(0.5);
    doc.line(14, 35, 196, 35);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0); // Volver a color negro estándar
    
    // Datos del cliente con mejor formato
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(44, 62, 80);
    doc.text("Datos del Cliente", 14, 45);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    const clientData = [
      ["Cliente:", client?.name || ""],
      ["Email:", client?.email || ""],
      ["Teléfono:", client?.phone || ""],
      ["Empresa:", client?.company || ""]
    ];
    
    autoTable(doc, {
      startY: 50,
      head: [],
      body: clientData,
      theme: "plain",
      styles: { fontSize: 10 },
      columnStyles: { 
        0: { fontStyle: "bold", cellWidth: 40, textColor: [44, 62, 80] } 
      }
    });
    
    // Datos del informe
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(44, 62, 80);
    doc.text("Detalles del Informe", 14, 85);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    const formattedDate = report.date ? format(new Date(report.date), "dd/MM/yyyy", { locale: es }) : "";
    
    const reportData = [
      ["Tipo:", report.type || ""],
      ["Fecha:", formattedDate],
      ["URL:", report.url || ""]
    ];
    
    autoTable(doc, {
      startY: 90,
      head: [],
      body: reportData,
      theme: "plain",
      styles: { fontSize: 10 },
      columnStyles: { 
        0: { fontStyle: "bold", cellWidth: 40, textColor: [44, 62, 80] } 
      }
    });
    
    // Agregar documentos analizados si existen
    if (documentData.length > 0) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(44, 62, 80);
      doc.text("Documentos Analizados", 14, 120);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      const docsHeaders = [["Nombre", "Tipo", "Fecha"]];
      const docsData = documentData.map(doc => [
        doc.name,
        doc.type.toUpperCase(),
        format(new Date(doc.uploadDate), "dd/MM/yyyy", { locale: es })
      ]);
      
      autoTable(doc, {
        startY: 125,
        head: docsHeaders,
        body: docsData,
        theme: "striped",
        headStyles: { 
          fillColor: [52, 152, 219],
          textColor: [255, 255, 255],
          fontStyle: "bold" 
        },
        styles: { fontSize: 10 }
      });
    }
    
    // Agregar datos del informe analítico si existen
    if (report.analyticsData) {
      // Agregar una nueva página para los analytics
      doc.addPage();
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(44, 62, 80);
      doc.text("Datos Analíticos", 14, 20);
      
      // Agregar línea decorativa
      doc.setDrawColor(52, 152, 219);
      doc.setLineWidth(0.5);
      doc.line(14, 25, 196, 25);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      // Resumen de métricas - Agregamos verificación para evitar errores
      const sessionCount = report.analyticsData.sessionCount ?? 0;
      const userCount = report.analyticsData.userCount ?? 0;
      const bounceRate = report.analyticsData.bounceRate ?? 0;
      const avgSessionDuration = report.analyticsData.avgSessionDuration ?? 0;
      
      const analyticsData = [
        ["Sesiones:", sessionCount.toString()],
        ["Usuarios:", userCount.toString()],
        ["Tasa de rebote:", bounceRate.toFixed(1) + "%"],
        ["Tiempo medio de sesión:", (avgSessionDuration / 60).toFixed(1) + " min"]
      ];
      
      autoTable(doc, {
        startY: 35,
        head: [],
        body: analyticsData,
        theme: "plain",
        styles: { fontSize: 10 },
        columnStyles: { 
          0: { fontStyle: "bold", cellWidth: 60, textColor: [44, 62, 80] } 
        }
      });
      
      // Top páginas - Verificamos que existan y tengan datos
      if (report.analyticsData.topPages && report.analyticsData.topPages.length > 0) {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Páginas más visitadas", 14, 75);
        
        const pagesHeaders = [["Página", "Visitas", "Tiempo medio"]];
        const pagesData = report.analyticsData.topPages.map(page => [
          page.path || "",
          (page.views || 0).toString(),
          ((page.avgTimeOnPage || 0) / 60).toFixed(1) + " min"
        ]);
        
        autoTable(doc, {
          startY: 80,
          head: pagesHeaders,
          body: pagesData,
          theme: "striped",
          headStyles: { 
            fillColor: [52, 152, 219],
            textColor: [255, 255, 255],
            fontStyle: "bold" 
          },
          styles: { fontSize: 10 }
        });
      }
    }
    
    // Agregar datos de Search Console si existen
    if (report.searchConsoleData) {
      // Si ya tenemos analytics, usamos la misma página
      let startY = report.analyticsData ? 160 : 140;
      
      // Si no cabe en la página actual, agregar nueva página
      if (startY > 220 || !report.analyticsData) {
        doc.addPage();
        startY = 20;
      }
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(44, 62, 80);
      doc.text("Datos de Search Console", 14, startY);
      
      // Agregar línea decorativa
      doc.setDrawColor(52, 152, 219);
      doc.setLineWidth(0.5);
      doc.line(14, startY + 5, 196, startY + 5);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      // Agregamos verificación para evitar errores
      const totalClicks = report.searchConsoleData.totalClicks ?? 0;
      const totalImpressions = report.searchConsoleData.totalImpressions ?? 0;
      const avgPosition = report.searchConsoleData.avgPosition ?? 0;
      
      // Cálculo seguro del CTR para evitar división por cero
      const ctr = totalImpressions > 0 
        ? (totalClicks / totalImpressions * 100).toFixed(1) + "%" 
        : "0.0%";
      
      // Resumen de métricas
      const searchData = [
        ["Clics totales:", totalClicks.toString()],
        ["Impresiones:", totalImpressions.toString()],
        ["CTR promedio:", ctr],
        ["Posición media:", avgPosition.toFixed(1)]
      ];
      
      autoTable(doc, {
        startY: startY + 15,
        head: [],
        body: searchData,
        theme: "plain",
        styles: { fontSize: 10 },
        columnStyles: { 
          0: { fontStyle: "bold", cellWidth: 60, textColor: [44, 62, 80] } 
        }
      });
      
      // Top queries
      if (report.searchConsoleData.topQueries && report.searchConsoleData.topQueries.length > 0) {
        startY += 55;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Principales consultas de búsqueda", 14, startY);
        
        const queriesHeaders = [["Consulta", "Clics", "Impresiones", "CTR", "Posición"]];
        const queriesData = report.searchConsoleData.topQueries.map(query => [
          query.query || "",
          (query.clicks || 0).toString(),
          (query.impressions || 0).toString(),
          ((query.ctr || 0) * 100).toFixed(1) + "%",
          (query.position || 0).toFixed(1)
        ]);
        
        autoTable(doc, {
          startY: startY + 5,
          head: queriesHeaders,
          body: queriesData,
          theme: "striped",
          headStyles: { 
            fillColor: [52, 152, 219],
            textColor: [255, 255, 255],
            fontStyle: "bold" 
          },
          styles: { fontSize: 10 }
        });
      }
    }
    
    // Agregar contenido markdown si existe
    if (report.content) {
      doc.addPage();
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(44, 62, 80);
      doc.text("Informe SEO Detallado", 14, 20);
      
      // Agregar línea decorativa
      doc.setDrawColor(52, 152, 219);
      doc.setLineWidth(0.5);
      doc.line(14, 25, 196, 25);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      // Dividimos el contenido markdown por secciones
      const sections = report.content.split('## ').filter(Boolean);
      
      let yPosition = 35;
      
      // Para cada sección, añadimos el título y el contenido
      for (const section of sections) {
        const lines = section.split('\n');
        const sectionTitle = lines[0] || "Sección";
        
        // Si no hay espacio suficiente en la página, añadimos una nueva
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        // Agregamos el título de la sección
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(52, 152, 219);
        doc.text(`${sectionTitle}`, 14, yPosition);
        
        yPosition += 10;
        
        // Contenido de la sección
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        
        const contentLines = lines.slice(1).join('\n');
        const splitText = doc.splitTextToSize(contentLines, 180);
        
        doc.text(splitText, 14, yPosition);
        
        // Calculamos la nueva posición Y basada en el número de líneas
        yPosition += splitText.length * 7 + 15;
      }
    }
    
    // Agregar una nueva página para las notas y análisis
    doc.addPage();
    
    // Notas con formato mejorado
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(44, 62, 80);
    doc.text("Análisis y Recomendaciones", 14, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    // Agregar línea decorativa
    doc.setDrawColor(52, 152, 219);
    doc.setLineWidth(0.5);
    doc.line(14, 25, 196, 25);
    
    if (report.notes) {
      const splitNotes = doc.splitTextToSize(report.notes, 180);
      doc.text(splitNotes, 14, 35);
    } else {
      doc.text("No hay notas o análisis disponibles para este informe.", 14, 35);
    }
    
    // Agregar sección para notas del cliente si existen
    if (client?.notes && client.notes.length > 0) {
      // Determinar la posición Y después de las notas del informe
      let currentY = 35;
      if (report.notes) {
        const splitNotes = doc.splitTextToSize(report.notes, 180);
        currentY += splitNotes.length * 5;
      }
      
      currentY += 15; // Espacio adicional
      
      // Asegurarse de que hay espacio suficiente en la página
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(44, 62, 80);
      doc.text("Notas Adicionales", 14, currentY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      // Agregar línea decorativa
      doc.setDrawColor(52, 152, 219);
      doc.setLineWidth(0.5);
      doc.line(14, currentY + 5, 196, currentY + 5);
      
      currentY += 15;
      
      const notesTableData = client.notes.map((note, index) => [`Nota ${index+1}:`, note]);
      
      autoTable(doc, {
        startY: currentY,
        head: [],
        body: notesTableData,
        theme: "plain",
        styles: { fontSize: 10 },
        columnStyles: { 
          0: { fontStyle: "bold", cellWidth: 30, textColor: [44, 62, 80] } 
        }
      });
    }
    
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
      
      // Agregar marca de agua sutil
      doc.setFontSize(50);
      doc.setTextColor(245, 245, 245); // Color muy claro
      doc.text(
        "CONFIDENCIAL",
        105,
        doc.internal.pageSize.height / 2,
        { align: "center", angle: 45 }
      );
    }
    
    // Generar el Blob
    const pdfBlob = doc.output("blob");
    return pdfBlob;
  } catch (error) {
    console.error("Error al generar el PDF del informe:", error);
    throw new Error("No se pudo generar el PDF del informe");
  }
};

export const downloadReportPdf = async (reportId: string): Promise<boolean> => {
  try {
    // Importar dinámicamente para evitar problemas con SSR
    const { getReport } = await import("./reportService");
    
    // Obtener datos del informe
    const report = await getReport(reportId);
    if (!report) {
      throw new Error("Informe no encontrado");
    }
    
    // Generar el PDF
    const pdfBlob = await generateReportPdf(report);
    
    // Crear URL para el blob
    const blobUrl = URL.createObjectURL(pdfBlob);
    
    // Crear elemento a para descargar
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `informe-${report.id}.pdf`;
    document.body.appendChild(a);
    a.click();
    
    // Limpiar
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
    
    return true;
  } catch (error) {
    console.error("Error al descargar el PDF del informe:", error);
    return false;
  }
};
