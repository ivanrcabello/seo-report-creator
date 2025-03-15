
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { AuditResult } from "@/services/pdfAnalyzer";
import { AIReport } from "@/services/aiReportService";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getSeoPacks } from "./packService";

export const generateSeoReportPdf = async (auditResult: AuditResult, aiReport: AIReport): Promise<Blob> => {
  try {
    // Crear documento PDF
    const doc = new jsPDF();
    
    // Configurar fuentes y colores
    const primaryColor = [72, 44, 146]; // Morado como color primario
    const secondaryColor = [45, 117, 96]; // Verde como color secundario
    const darkColor = [30, 41, 59]; // Slate-800 como color oscuro
    
    // Configuración de la página
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;
    
    // PORTADA
    // Encabezado con fondo degradado (simulado con rectángulos)
    for (let i = 0; i < 15; i++) {
      const alpha = 1 - (i * 0.05);
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2], alpha);
      doc.rect(0, i * 2, pageWidth, 2, 'F');
    }
    
    // Título principal
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    doc.text("INFORME DE ANÁLISIS SEO", pageWidth / 2, 30, { align: "center" });
    
    // Subtítulo
    doc.setFontSize(16);
    doc.text("Estrategia para mejorar la presencia online", pageWidth / 2, 40, { align: "center" });
    
    // Fecha del informe
    doc.setFontSize(12);
    doc.text(`Generado el ${format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es })}`, pageWidth / 2, 50, { align: "center" });
    
    // Imagen central (círculo con icono o logo)
    doc.setFillColor(255, 255, 255);
    doc.circle(pageWidth / 2, 90, 25, 'F');
    
    // Información del dominio
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text(`${auditResult.domain}`, pageWidth / 2, 140, { align: "center" });
    
    // Información de la empresa
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text(`${auditResult.companyName || "Empresa"}`, pageWidth / 2, 150, { align: "center" });
    
    // Puntuación global
    doc.setFillColor(200, 200, 200, 0.5);
    doc.roundedRect(pageWidth / 2 - 40, 170, 80, 40, 5, 5, 'F');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("PUNTUACIÓN SEO", pageWidth / 2, 180, { align: "center" });
    
    doc.setFontSize(24);
    const scoreColor = auditResult.seoScore >= 80 ? [39, 174, 96] : 
                      auditResult.seoScore >= 60 ? [241, 196, 15] : 
                      [231, 76, 60];
    doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.text(`${auditResult.seoScore}/100`, pageWidth / 2, 195, { align: "center" });
    
    // Pie de página
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("© Confidencial - Todos los derechos reservados", pageWidth / 2, pageHeight - 15, { align: "center" });
    
    // ÍNDICE DE CONTENIDOS
    doc.addPage();
    
    // Título de la página
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("ÍNDICE DE CONTENIDOS", margin, 30);
    
    // Línea decorativa
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, 35, pageWidth - margin, 35);
    
    // Elementos del índice
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    
    let yPos = 50;
    const indexItems = [
      { title: "1. Introducción", page: 3 },
      { title: "2. Análisis Actual de la Web", page: 4 },
      { title: "   2.1. Métricas Principales", page: 4 },
      { title: "   2.2. Palabras Clave Prioritarias", page: 5 },
      { title: "   2.3. Análisis de Competidores", page: 6 },
      { title: "3. Estrategia Propuesta", page: 7 },
      { title: "   3.1. Optimización Técnica y On-Page", page: 7 },
      { title: "   3.2. SEO Local y Geolocalización", page: 8 },
      { title: "   3.3. Creación de Contenido y Blog", page: 9 },
      { title: "4. Planes de Tarifas", page: 10 },
      { title: "5. Conclusión y Siguientes Pasos", page: 11 }
    ];
    
    indexItems.forEach(item => {
      doc.text(item.title, margin, yPos);
      doc.text(item.page.toString(), pageWidth - margin, yPos, { align: "right" });
      yPos += 12;
    });
    
    // INTRODUCCIÓN
    doc.addPage();
    
    // Título de sección
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("1. INTRODUCCIÓN", margin, 30);
    
    // Línea decorativa
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, 35, pageWidth - margin, 35);
    
    // Contenido de la introducción
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    
    const introText = doc.splitTextToSize(aiReport.companyIntroduction, pageWidth - (margin * 2));
    doc.text(introText, margin, 50);
    
    // ANÁLISIS ACTUAL DE LA WEB
    doc.addPage();
    
    // Título de sección
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("2. ANÁLISIS ACTUAL DE LA WEB", margin, 30);
    
    // Línea decorativa
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, 35, pageWidth - margin, 35);
    
    // Subtítulo
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text("2.1. Métricas Principales", margin, 50);
    
    // Tabla de métricas principales
    const metricsData = [
      ["Authority Score", `${aiReport.webAnalysis.authorityScore}/100`, aiReport.webAnalysis.authorityScore > 70 ? "Excelente autoridad de dominio" : aiReport.webAnalysis.authorityScore > 50 ? "Buena autoridad, con potencial de mejora" : "Necesita mejorar la autoridad de dominio"],
      ["Tráfico Orgánico", `${aiReport.webAnalysis.organicTraffic} visitas/mes`, "Tráfico mensual estimado en base al posicionamiento actual"],
      ["Keywords Posicionadas", `${aiReport.webAnalysis.keywordsRanked}`, "Palabras clave en las 100 primeras posiciones de Google"],
      ["Backlinks", `${aiReport.webAnalysis.backlinks}`, `Calidad: ${aiReport.webAnalysis.qualityScore}/100`]
    ];
    
    autoTable(doc, {
      startY: 60,
      head: [["Métrica", "Valor", "Observaciones"]],
      body: metricsData,
      theme: "grid",
      headStyles: {
        fillColor: [primaryColor[0], primaryColor[1], primaryColor[2]],
        textColor: [255, 255, 255],
        fontStyle: "bold"
      },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 50 },
        1: { cellWidth: 40, halign: "center" },
        2: { cellWidth: 80 }
      }
    });
    
    // PALABRAS CLAVE PRIORITARIAS
    // Ajustar la posición Y según donde terminó la tabla anterior
    let finalY = (doc as any).lastAutoTable.finalY + 20;
    
    // Si no hay suficiente espacio, añadir una nueva página
    if (finalY > pageHeight - 50) {
      doc.addPage();
      finalY = 30;
    }
    
    // Subtítulo
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text("2.2. Palabras Clave Prioritarias", margin, finalY);
    
    // Tabla de palabras clave
    const keywordsData = aiReport.webAnalysis.priorityKeywords.map(keyword => [
      keyword.keyword,
      keyword.position,
      `${keyword.volume}/mes`,
      keyword.difficulty,
      keyword.recommendation
    ]);
    
    autoTable(doc, {
      startY: finalY + 10,
      head: [["Palabra Clave", "Posición", "Volumen", "Dificultad", "Recomendación"]],
      body: keywordsData,
      theme: "grid",
      headStyles: {
        fillColor: [secondaryColor[0], secondaryColor[1], secondaryColor[2]],
        textColor: [255, 255, 255],
        fontStyle: "bold"
      },
      columnStyles: {
        0: { fontStyle: "bold" },
        1: { halign: "center" },
        2: { halign: "center" },
        3: { halign: "center" }
      }
    });
    
    // ANÁLISIS DE COMPETIDORES
    doc.addPage();
    
    // Subtítulo
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text("2.3. Análisis de Competidores", margin, 30);
    
    // Tabla de competidores
    const competitorsData = aiReport.webAnalysis.competitors.map(competitor => [
      competitor.name,
      competitor.score,
      competitor.traffic,
      competitor.keywords,
      competitor.comparison
    ]);
    
    // Añadir nuestra web a la comparativa
    competitorsData.push([
      auditResult.domain,
      aiReport.webAnalysis.authorityScore,
      aiReport.webAnalysis.organicTraffic,
      aiReport.webAnalysis.keywordsRanked,
      "Su sitio web actual"
    ]);
    
    autoTable(doc, {
      startY: 40,
      head: [["Dominio", "Authority", "Tráfico", "Keywords", "Observaciones"]],
      body: competitorsData,
      theme: "grid",
      headStyles: {
        fillColor: [secondaryColor[0], secondaryColor[1], secondaryColor[2]],
        textColor: [255, 255, 255],
        fontStyle: "bold"
      },
      columnStyles: {
        0: { fontStyle: "bold" },
        1: { halign: "center" },
        2: { halign: "center" },
        3: { halign: "center" }
      },
      bodyStyles: (row) => {
        // Destacar la fila de nuestro sitio web
        if (row.index === competitorsData.length - 1) {
          return {
            fillColor: [240, 240, 250]
          };
        }
        return {};
      }
    });
    
    // Gráfica comparativa (simulada con texto por simplicidad)
    finalY = (doc as any).lastAutoTable.finalY + 20;
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Análisis Comparativo", margin, finalY);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const comparativeText = "El análisis comparativo muestra oportunidades de mejora frente a sus competidores directos. La implementación de la estrategia propuesta permitirá reducir esta brecha y eventualmente superar a la competencia en visibilidad online y captación de clientes.";
    const compTextLines = doc.splitTextToSize(comparativeText, pageWidth - (margin * 2));
    doc.text(compTextLines, margin, finalY + 10);
    
    // ESTRATEGIA PROPUESTA
    doc.addPage();
    
    // Título de sección
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("3. ESTRATEGIA PROPUESTA", margin, 30);
    
    // Línea decorativa
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, 35, pageWidth - margin, 35);
    
    // Subtítulo
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text("3.1. Optimización Técnica y On-Page", margin, 50);
    
    // Lista de estrategias técnicas
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    
    let technicalY = 60;
    aiReport.strategy.technicalOptimization.forEach((item, index) => {
      doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.circle(margin + 3, technicalY + 3, 1.5, 'F');
      
      const itemText = doc.splitTextToSize(item, pageWidth - (margin * 2) - 12);
      doc.text(itemText, margin + 10, technicalY);
      
      // Calcular la siguiente posición Y
      technicalY += (itemText.length * 6) + 6;
      
      // Si no hay suficiente espacio, añadir una nueva página
      if (technicalY > pageHeight - 50 && index < aiReport.strategy.technicalOptimization.length - 1) {
        doc.addPage();
        technicalY = 30;
      }
    });
    
    // SEO LOCAL Y GEOLOCALIZACIÓN
    doc.addPage();
    
    // Subtítulo
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text("3.2. SEO Local y Geolocalización", margin, 30);
    
    // Lista de estrategias locales
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    
    let localY = 40;
    aiReport.strategy.localSeo.forEach((item, index) => {
      doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.circle(margin + 3, localY + 3, 1.5, 'F');
      
      const itemText = doc.splitTextToSize(item, pageWidth - (margin * 2) - 12);
      doc.text(itemText, margin + 10, localY);
      
      // Calcular la siguiente posición Y
      localY += (itemText.length * 6) + 6;
      
      // Si no hay suficiente espacio, añadir una nueva página
      if (localY > pageHeight - 50 && index < aiReport.strategy.localSeo.length - 1) {
        doc.addPage();
        localY = 30;
      }
    });
    
    // Mapa visual de presencia local (simulado con texto)
    localY += 10;
    
    if (localY > pageHeight - 70) {
      doc.addPage();
      localY = 30;
    }
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Áreas geográficas prioritarias", margin, localY);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`• ${auditResult.location} (principal)`, margin + 10, localY + 10);
    doc.text(`• Áreas circundantes (radio de 30 km)`, margin + 10, localY + 20);
    doc.text(`• Principales ciudades de la provincia`, margin + 10, localY + 30);
    
    // CREACIÓN DE CONTENIDO Y BLOG
    doc.addPage();
    
    // Subtítulo
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text("3.3. Creación de Contenido y Blog", margin, 30);
    
    // Lista de estrategias de contenido
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    
    let contentY = 40;
    aiReport.strategy.contentCreation.forEach((item, index) => {
      doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.circle(margin + 3, contentY + 3, 1.5, 'F');
      
      const itemText = doc.splitTextToSize(item, pageWidth - (margin * 2) - 12);
      doc.text(itemText, margin + 10, contentY);
      
      // Calcular la siguiente posición Y
      contentY += (itemText.length * 6) + 6;
      
      // Si no hay suficiente espacio, añadir una nueva página
      if (contentY > pageHeight - 50 && index < aiReport.strategy.contentCreation.length - 1) {
        doc.addPage();
        contentY = 30;
      }
    });
    
    // Calendario editorial sugerido (tabla simple)
    contentY += 10;
    
    if (contentY > pageHeight - 80) {
      doc.addPage();
      contentY = 30;
    }
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Calendario Editorial Sugerido", margin, contentY);
    
    const calendarData = [
      ["Semana 1", "Artículo principal sobre servicios"],
      ["Semana 2", "Guía práctica para clientes"],
      ["Semana 3", "Caso de éxito / Testimonio"],
      ["Semana 4", "Noticia del sector / Tendencia"]
    ];
    
    autoTable(doc, {
      startY: contentY + 10,
      head: [["Planificación", "Tipo de Contenido"]],
      body: calendarData,
      theme: "grid",
      headStyles: {
        fillColor: [secondaryColor[0], secondaryColor[1], secondaryColor[2]],
        textColor: [255, 255, 255],
        fontStyle: "bold"
      }
    });
    
    // PLANES DE TARIFAS
    doc.addPage();
    
    // Título de sección
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("4. PLANES DE TARIFAS", margin, 30);
    
    // Línea decorativa
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, 35, pageWidth - margin, 35);
    
    // Obtener paquetes SEO disponibles
    const seoPacks = await getSeoPacks();
    
    if (!seoPacks || seoPacks.length === 0) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(12);
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text("No hay planes disponibles actualmente. Por favor, contacte con nosotros para obtener un presupuesto personalizado.", margin, 50);
    } else {
      // Tabla de planes
      const plansData = seoPacks.map(pack => [
        pack.name,
        `${pack.price}€/mes`,
        pack.description,
        pack.features.join(", ")
      ]);
      
      autoTable(doc, {
        startY: 50,
        head: [["Plan", "Precio", "Descripción", "Características"]],
        body: plansData,
        theme: "grid",
        headStyles: {
          fillColor: [primaryColor[0], primaryColor[1], primaryColor[2]],
          textColor: [255, 255, 255],
          fontStyle: "bold"
        },
        columnStyles: {
          0: { fontStyle: "bold", cellWidth: 40 },
          1: { cellWidth: 30, halign: "center" },
          2: { cellWidth: 40 },
          3: { cellWidth: 70 }
        }
      });
      
      // Recomendación personalizada
      finalY = (doc as any).lastAutoTable.finalY + 20;
      
      // Si no hay suficiente espacio, añadir una nueva página
      if (finalY > pageHeight - 60) {
        doc.addPage();
        finalY = 30;
      }
      
      doc.setFillColor(240, 240, 250);
      doc.roundedRect(margin, finalY, pageWidth - (margin * 2), 40, 3, 3, 'F');
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("Recomendación Personalizada", margin + 10, finalY + 15);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      const recText = auditResult.seoScore < 60 ? 
        "Para su sitio web, recomendamos el Plan Completo para abordar todas las áreas críticas identificadas." :
        auditResult.seoScore < 75 ?
        "Para su sitio web, recomendamos el Plan Avanzado que ofrece un buen equilibrio entre inversión y resultados." :
        "Para su sitio web, el Plan Estándar será suficiente para mantener y mejorar su posicionamiento actual.";
      
      doc.text(recText, margin + 10, finalY + 25);
    }
    
    // CONCLUSIÓN Y SIGUIENTES PASOS
    doc.addPage();
    
    // Título de sección
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("5. CONCLUSIÓN Y SIGUIENTES PASOS", margin, 30);
    
    // Línea decorativa
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, 35, pageWidth - margin, 35);
    
    // Contenido de la conclusión
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    
    const conclusionText = doc.splitTextToSize(aiReport.conclusion, pageWidth - (margin * 2));
    doc.text(conclusionText, margin, 50);
    
    // Resultados esperados
    let resultY = 50 + (conclusionText.length * 7);
    
    doc.setFillColor(245, 245, 220); // Beige claro
    doc.roundedRect(margin, resultY, pageWidth - (margin * 2), 40, 3, 3, 'F');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text("Resultados Esperados", margin + 10, resultY + 15);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const timelineText = `• Mes 1-2: Implementación de cambios técnicos y optimizaciones on-page\n• Mes ${aiReport.estimatedResultsTime}: Primeras mejoras visibles en rankings\n• Mes 4-6: Aumento significativo del tráfico y posicionamiento\n• Mes 6+: Consolidación de resultados y expansión a nuevas keywords`;
    
    const timelineLines = timelineText.split('\n');
    timelineLines.forEach((line, index) => {
      doc.text(line, margin + 10, resultY + 30 + (index * 8));
    });
    
    // Siguientes pasos
    let nextStepsY = resultY + 80;
    
    if (nextStepsY > pageHeight - 60) {
      doc.addPage();
      nextStepsY = 30;
    }
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text("Siguientes Pasos:", margin, nextStepsY);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text("1. Seleccionar el plan de servicios que mejor se adapte a sus necesidades", margin + 10, nextStepsY + 10);
    doc.text("2. Reunión inicial para establecer objetivos detallados y prioridades", margin + 10, nextStepsY + 20);
    doc.text("3. Implementación de la estrategia y monitorización continua", margin + 10, nextStepsY + 30);
    doc.text("4. Informes periódicos de seguimiento y ajuste de la estrategia", margin + 10, nextStepsY + 40);
    
    // CONTACTO (última página)
    doc.addPage();
    
    // Estilo moderno con banda de color
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 50, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("CONTACTO", pageWidth / 2, 30, { align: "center" });
    
    // Información de contacto
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("¿Listo para mejorar tu presencia online?", pageWidth / 2, 70, { align: "center" });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text("Contáctanos hoy mismo para comenzar con tu estrategia SEO personalizada", pageWidth / 2, 85, { align: "center" });
    
    // Datos de contacto en recuadros
    doc.setFillColor(245, 245, 250);
    doc.roundedRect(pageWidth / 2 - 80, 100, 160, 40, 3, 3, 'F');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("Email", pageWidth / 2, 115, { align: "center" });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text(aiReport.contactInfo.email, pageWidth / 2, 130, { align: "center" });
    
    doc.setFillColor(245, 245, 250);
    doc.roundedRect(pageWidth / 2 - 80, 150, 160, 40, 3, 3, 'F');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("Teléfono", pageWidth / 2, 165, { align: "center" });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text(aiReport.contactInfo.phone, pageWidth / 2, 180, { align: "center" });
    
    // Agradecimiento final
    doc.setFont("helvetica", "italic");
    doc.setFontSize(12);
    doc.text("Gracias por confiar en nuestros servicios profesionales de SEO", pageWidth / 2, 220, { align: "center" });
    
    // Generar el Blob
    const pdfBlob = doc.output("blob");
    return pdfBlob;
  } catch (error) {
    console.error("Error al generar el PDF del informe SEO:", error);
    throw new Error("No se pudo generar el PDF del informe SEO");
  }
};

export const downloadSeoReportPdf = async (auditResult: AuditResult, aiReport: AIReport): Promise<boolean> => {
  try {
    // Generar el PDF
    const pdfBlob = await generateSeoReportPdf(auditResult, aiReport);
    
    // Crear URL para el blob
    const blobUrl = URL.createObjectURL(pdfBlob);
    
    // Crear elemento a para descargar
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `informe-seo-${auditResult.domain || "sitio"}.pdf`;
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
