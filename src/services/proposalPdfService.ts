
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Proposal } from "@/types/client";
import { getClient } from "./clientService";
import { getSeoPack } from "./packService";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getCompanySettings } from "./settingsService";

// Colores corporativos (asegurando que sean arrays con exactamente 3 elementos)
const COLORS = {
  primary: {
    blue: [30, 64, 175] as [number, number, number], // Color azul corporativo
    purple: [126, 34, 206] as [number, number, number], // Color morado corporativo
  },
  background: {
    light: [240, 240, 250] as [number, number, number], // Fondo claro
    white: [255, 255, 255] as [number, number, number], // Blanco
  },
  text: {
    dark: [0, 0, 0] as [number, number, number], // Negro
    white: [255, 255, 255] as [number, number, number], // Blanco
    blue: [30, 64, 175] as [number, number, number], // Azul para textos destacados
  }
};

export const generateProposalPdf = async (proposal: Proposal): Promise<Blob> => {
  try {
    // Obtener datos del cliente y paquete
    const client = await getClient(proposal.clientId);
    const pack = proposal.packId ? await getSeoPack(proposal.packId) : null;
    const company = await getCompanySettings();
    
    // Crear documento PDF
    const doc = new jsPDF();
    
    // Función para crear degradados
    const createGradient = (x: number, y: number, w: number, h: number) => {
      // En lugar de usar setLinearGradient que no existe en jsPDF v3
      // Usamos un rectángulo con color sólido
      doc.setFillColor(COLORS.primary.blue[0], COLORS.primary.blue[1], COLORS.primary.blue[2]);
      doc.rect(x, y, w, h, 'F');
    };
    
    // Cabecera con color corporativo
    createGradient(0, 0, doc.internal.pageSize.width, 40);
    
    // Añadir título en la cabecera
    doc.setTextColor(COLORS.text.white[0], COLORS.text.white[1], COLORS.text.white[2]);
    doc.setFont("Poppins", "bold");
    doc.setFontSize(22);
    doc.text("PROPUESTA COMERCIAL", 105, 20, { align: "center" });
    
    // Añadir logo de la empresa si está disponible
    if (company?.logoUrl) {
      try {
        // Convertir la URL de la imagen en un elemento de imagen
        const img = new Image();
        img.src = company.logoUrl;
        // Añadir la imagen cuando esté cargada
        doc.addImage(img, 'PNG', 10, 5, 30, 30);
      } catch (error) {
        console.error("Error al añadir el logo:", error);
      }
    }
    
    // Información de la propuesta
    doc.setTextColor(COLORS.text.dark[0], COLORS.text.dark[1], COLORS.text.dark[2]);
    doc.setFont("Poppins", "bold");
    doc.setFontSize(16);
    doc.text(proposal.title, 105, 55, { align: "center" });
    
    // Agregar línea decorativa
    doc.setDrawColor(COLORS.primary.blue[0], COLORS.primary.blue[1], COLORS.primary.blue[2]);
    doc.setLineWidth(1);
    doc.line(40, 60, 170, 60);
    
    // Datos del cliente con estilo mejorado
    doc.setFontSize(14);
    doc.setFont("Poppins", "bold");
    doc.setTextColor(COLORS.primary.blue[0], COLORS.primary.blue[1], COLORS.primary.blue[2]);
    doc.text("Datos del Cliente", 14, 75);
    
    // Rectángulo decorativo para la sección del cliente
    doc.setFillColor(COLORS.background.light[0], COLORS.background.light[1], COLORS.background.light[2]);
    doc.roundedRect(10, 80, 190, 30, 3, 3, 'F');
    
    doc.setFont("Poppins", "normal");
    doc.setFontSize(11);
    doc.setTextColor(COLORS.text.dark[0], COLORS.text.dark[1], COLORS.text.dark[2]);
    
    const clientData = [
      ["Cliente:", client?.name || ""],
      ["Email:", client?.email || ""],
      ["Teléfono:", client?.phone || ""],
    ];
    
    autoTable(doc, {
      startY: 83,
      head: [],
      body: clientData,
      theme: "plain",
      styles: { 
        fontSize: 11,
        fontStyle: "normal",
        font: "Poppins",
        cellPadding: 2,
      },
      columnStyles: { 
        0: { 
          fontStyle: "bold",
          font: "Poppins", 
          cellWidth: 40,
          textColor: COLORS.primary.blue
        } 
      }
    });
    
    // Detalles de la propuesta con estilo mejorado
    doc.setFontSize(14);
    doc.setFont("Poppins", "bold");
    doc.setTextColor(COLORS.primary.blue[0], COLORS.primary.blue[1], COLORS.primary.blue[2]);
    doc.text("Detalles de la Propuesta", 14, 120);
    
    // Rectángulo decorativo para la sección de la propuesta
    doc.setFillColor(COLORS.background.light[0], COLORS.background.light[1], COLORS.background.light[2]);
    doc.roundedRect(10, 125, 190, 30, 3, 3, 'F');
    
    const formattedCreatedAt = format(new Date(proposal.createdAt), "dd/MM/yyyy", { locale: es });
    const formattedExpiresAt = proposal.expiresAt 
      ? format(new Date(proposal.expiresAt), "dd/MM/yyyy", { locale: es })
      : "No expira";
    
    const proposalData = [
      ["Fecha de creación:", formattedCreatedAt],
      ["Válida hasta:", formattedExpiresAt],
      ["Estado:", proposal.status],
    ];
    
    autoTable(doc, {
      startY: 128,
      head: [],
      body: proposalData,
      theme: "plain",
      styles: { 
        fontSize: 11,
        fontStyle: "normal",
        font: "Poppins",
        cellPadding: 2,
      },
      columnStyles: { 
        0: { 
          fontStyle: "bold",
          font: "Poppins", 
          cellWidth: 40,
          textColor: COLORS.primary.blue
        } 
      }
    });
    
    // Datos del paquete con estilo mejorado
    if (pack) {
      doc.setFontSize(14);
      doc.setFont("Poppins", "bold");
      doc.setTextColor(COLORS.primary.blue[0], COLORS.primary.blue[1], COLORS.primary.blue[2]);
      doc.text("Paquete Seleccionado", 14, 165);
      
      // Rectángulo decorativo para el paquete
      doc.setFillColor(COLORS.background.light[0], COLORS.background.light[1], COLORS.background.light[2]);
      doc.roundedRect(10, 170, 190, 50, 3, 3, 'F');
      
      // Encabezado del paquete
      doc.setFillColor(COLORS.primary.purple[0], COLORS.primary.purple[1], COLORS.primary.purple[2]);
      doc.roundedRect(15, 175, 180, 10, 2, 2, 'F');
      doc.setTextColor(COLORS.text.white[0], COLORS.text.white[1], COLORS.text.white[2]);
      doc.setFontSize(12);
      doc.text(pack.name, 105, 182, { align: "center" });
      
      const price = proposal.customPrice || pack.price;
      doc.setFontSize(14);
      doc.setTextColor(COLORS.primary.purple[0], COLORS.primary.purple[1], COLORS.primary.purple[2]);
      doc.setFont("Poppins", "bold");
      doc.text(`${price} €`, 105, 197, { align: "center" });
      
      // Características del paquete en formato de lista
      doc.setFontSize(11);
      doc.setTextColor(COLORS.text.dark[0], COLORS.text.dark[1], COLORS.text.dark[2]);
      doc.setFont("Poppins", "normal");
      
      const packageData = [
        ["Descripción:", pack.description]
      ];
      
      autoTable(doc, {
        startY: 202,
        head: [],
        body: packageData,
        theme: "plain",
        styles: { 
          fontSize: 11,
          fontStyle: "normal",
          font: "Poppins",
          cellPadding: 2,
        },
        columnStyles: { 
          0: { 
            fontStyle: "bold",
            font: "Poppins", 
            cellWidth: 40,
            textColor: COLORS.primary.blue
          } 
        }
      });
    }
    
    // Descripción con estilo mejorado
    let lastY = 230;
    
    doc.setFontSize(14);
    doc.setFont("Poppins", "bold");
    doc.setTextColor(COLORS.primary.blue[0], COLORS.primary.blue[1], COLORS.primary.blue[2]);
    doc.text("Descripción", 14, lastY);
    
    // Rectángulo decorativo para la descripción
    doc.setFillColor(COLORS.background.light[0], COLORS.background.light[1], COLORS.background.light[2]);
    doc.roundedRect(10, lastY + 5, 190, 30, 3, 3, 'F');
    
    doc.setFont("Poppins", "normal");
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    
    const splitDescription = doc.splitTextToSize(proposal.description || "", 180);
    doc.text(splitDescription, 15, lastY + 15);
    
    lastY += 40;
    
    // Notas adicionales si están presentes
    if (proposal.additionalNotes) {
      doc.setFontSize(14);
      doc.setFont("Poppins", "bold");
      doc.setTextColor(COLORS.primary.blue[0], COLORS.primary.blue[1], COLORS.primary.blue[2]);
      doc.text("Notas Adicionales", 14, lastY);
      
      // Rectángulo decorativo para las notas
      doc.setFillColor(COLORS.background.light[0], COLORS.background.light[1], COLORS.background.light[2]);
      doc.roundedRect(10, lastY + 5, 190, 30, 3, 3, 'F');
      
      doc.setFont("Poppins", "normal");
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      
      const splitNotes = doc.splitTextToSize(proposal.additionalNotes || "", 180);
      doc.text(splitNotes, 15, lastY + 15);
      
      lastY += 40;
    }
    
    // Características personalizadas
    if (proposal.customFeatures && proposal.customFeatures.length > 0) {
      doc.setFontSize(14);
      doc.setFont("Poppins", "bold");
      doc.setTextColor(COLORS.primary.blue[0], COLORS.primary.blue[1], COLORS.primary.blue[2]);
      doc.text("Características Personalizadas", 14, lastY);
      
      // Rectángulo decorativo para las características
      doc.setFillColor(COLORS.background.light[0], COLORS.background.light[1], COLORS.background.light[2]);
      doc.roundedRect(10, lastY + 5, 190, 10 + (proposal.customFeatures.length * 8), 3, 3, 'F');
      
      // Listar características con check marks
      doc.setFont("Poppins", "normal");
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      
      proposal.customFeatures.forEach((feature, index) => {
        const y = lastY + 15 + (index * 8);
        
        // Check mark circle
        doc.setDrawColor(COLORS.primary.purple[0], COLORS.primary.purple[1], COLORS.primary.purple[2]);
        doc.setFillColor(COLORS.primary.purple[0], COLORS.primary.purple[1], COLORS.primary.purple[2]);
        doc.circle(20, y - 2, 1.5, 'FD');
        
        doc.text(feature, 25, y);
      });
      
      lastY += 15 + (proposal.customFeatures.length * 8);
    }
    
    // Contenido AI si está disponible
    if (proposal.aiContent) {
      doc.addPage();
      
      // Cabecera con color corporativo para la página de contenido
      createGradient(0, 0, doc.internal.pageSize.width, 40);
      
      // Añadir título en la cabecera
      doc.setTextColor(COLORS.text.white[0], COLORS.text.white[1], COLORS.text.white[2]);
      doc.setFont("Poppins", "bold");
      doc.setFontSize(22);
      doc.text("CONTENIDO DETALLADO", 105, 20, { align: "center" });
      
      // Título de sección
      doc.setTextColor(COLORS.text.dark[0], COLORS.text.dark[1], COLORS.text.dark[2]);
      doc.setFont("Poppins", "bold");
      doc.setFontSize(16);
      doc.text(proposal.title, 105, 50, { align: "center" });
      
      // Agregar línea decorativa
      doc.setDrawColor(COLORS.primary.blue[0], COLORS.primary.blue[1], COLORS.primary.blue[2]);
      doc.setLineWidth(1);
      doc.line(40, 55, 170, 55);
      
      // Convertir markdown a texto plano para PDF (versión simplificada)
      const markdownToPlainText = (markdown: string) => {
        return markdown
          .replace(/#{1,6}\s(.*)/g, "$1") // Eliminar encabezados
          .replace(/\*\*(.*?)\*\*/g, "$1") // Eliminar negrita
          .replace(/\*(.*?)\*/g, "$1")     // Eliminar cursiva
          .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Eliminar enlaces, conservar el texto
          .replace(/^\s*[\*\-]\s+(.*)/gm, "• $1"); // Convertir listas a puntos
      };
      
      // Texto del contenido
      doc.setFont("Poppins", "normal");
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      
      // Procesar el texto markdown
      const plainTextContent = markdownToPlainText(proposal.aiContent);
      const splitContent = doc.splitTextToSize(plainTextContent, 180);
      
      // Si el contenido es muy largo, se ajustará a múltiples páginas automáticamente
      autoTable(doc, {
        startY: 60,
        head: [],
        body: [[splitContent]],
        theme: "plain",
        styles: { 
          fontSize: 10,
          fontStyle: "normal",
          font: "Poppins",
          cellPadding: 4,
          overflow: 'linebreak',
          minCellHeight: 8
        },
        margin: { left: 15, right: 15 }
      });
    }
    
    // Footer con color corporativo en cada página
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Agregar color en el pie de página
      createGradient(0, doc.internal.pageSize.height - 20, doc.internal.pageSize.width, 20);
      
      // Texto en el pie de página
      doc.setTextColor(COLORS.text.white[0], COLORS.text.white[1], COLORS.text.white[2]);
      doc.setFontSize(9);
      doc.text(
        `Página ${i} de ${pageCount} - ${company?.companyName || 'SoySeoLocal'} - Generado el ${format(new Date(), "dd/MM/yyyy", { locale: es })}`,
        105,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
    }
    
    // Generar el Blob
    const pdfBlob = doc.output("blob");
    return pdfBlob;
  } catch (error) {
    console.error("Error al generar el PDF de la propuesta:", error);
    throw new Error("No se pudo generar el PDF de la propuesta");
  }
};

export const downloadProposalPdf = async (proposalId: string): Promise<boolean> => {
  try {
    // Importar dinámicamente para evitar problemas con SSR
    const { getProposal } = await import("./proposal/proposalCrud");
    
    // Obtener datos de la propuesta
    const proposal = await getProposal(proposalId);
    if (!proposal) {
      throw new Error("Propuesta no encontrada");
    }
    
    // Generar el PDF
    const pdfBlob = await generateProposalPdf(proposal);
    
    // Crear URL para el blob
    const blobUrl = URL.createObjectURL(pdfBlob);
    
    // Crear elemento a para descargar
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `propuesta-${proposal.title.replace(/\s+/g, '_')}-${proposal.id.slice(0, 6)}.pdf`;
    document.body.appendChild(a);
    a.click();
    
    // Limpiar
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
    
    return true;
  } catch (error) {
    console.error("Error al descargar el PDF de la propuesta:", error);
    return false;
  }
};
