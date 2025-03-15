
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Proposal } from "@/types/client";
import { getClient } from "./clientService";
import { getSeoPack } from "./packService";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const generateProposalPdf = async (proposal: Proposal): Promise<Blob> => {
  try {
    // Obtener datos del cliente y paquete
    const client = await getClient(proposal.clientId);
    const pack = proposal.packId ? await getSeoPack(proposal.packId) : null;
    
    // Crear documento PDF
    const doc = new jsPDF();
    
    // Función para crear gradientes
    const createGradient = (x: number, y: number, w: number, h: number) => {
      const gradient = doc.setLinearGradient(x, y, x + w, y, [0, 1], [0, 1], [['#1e40af', 0], ['#7e22ce', 1]]);
      doc.setFillStyle(gradient);
      doc.rect(x, y, w, h, 'F');
    };
    
    // Cabecera con gradiente
    createGradient(0, 0, doc.internal.pageSize.width, 40);
    
    // Añadir título en la cabecera
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("PROPUESTA COMERCIAL", 105, 20, { align: "center" });
    
    // Información de la propuesta
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(proposal.title, 105, 55, { align: "center" });
    
    // Agregar línea decorativa
    doc.setDrawColor(30, 64, 175); // Color azul corporativo
    doc.setLineWidth(1);
    doc.line(40, 60, 170, 60);
    
    // Datos del cliente con estilo mejorado
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 64, 175); // Color azul corporativo
    doc.text("Datos del Cliente", 14, 75);
    
    // Rectángulo decorativo para la sección del cliente
    doc.setFillColor(240, 240, 250);
    doc.roundedRect(10, 80, 190, 30, 3, 3, 'F');
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    
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
        cellPadding: 2,
      },
      columnStyles: { 
        0: { 
          fontStyle: "bold", 
          cellWidth: 40,
          textColor: [30, 64, 175]
        } 
      }
    });
    
    // Detalles de la propuesta con estilo mejorado
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 64, 175);
    doc.text("Detalles de la Propuesta", 14, 120);
    
    // Rectángulo decorativo para la sección de la propuesta
    doc.setFillColor(240, 240, 250);
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
        cellPadding: 2,
      },
      columnStyles: { 
        0: { 
          fontStyle: "bold", 
          cellWidth: 40,
          textColor: [30, 64, 175]
        } 
      }
    });
    
    // Datos del paquete con estilo mejorado
    if (pack) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 64, 175);
      doc.text("Paquete Seleccionado", 14, 165);
      
      // Rectángulo decorativo para el paquete
      doc.setFillColor(240, 245, 255);
      doc.roundedRect(10, 170, 190, 50, 3, 3, 'F');
      
      // Encabezado del paquete
      doc.setFillColor(126, 34, 206); // Purple color
      doc.roundedRect(15, 175, 180, 10, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.text(pack.name, 105, 182, { align: "center" });
      
      const price = proposal.customPrice || pack.price;
      doc.setFontSize(14);
      doc.setTextColor(126, 34, 206); // Purple color
      doc.setFont("helvetica", "bold");
      doc.text(`${price} €`, 105, 197, { align: "center" });
      
      // Características del paquete en formato de lista
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      
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
          cellPadding: 2,
        },
        columnStyles: { 
          0: { 
            fontStyle: "bold", 
            cellWidth: 40,
            textColor: [30, 64, 175]
          } 
        }
      });
    }
    
    // Descripción con estilo mejorado
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 64, 175);
    doc.text("Descripción", 14, 230);
    
    // Rectángulo decorativo para la descripción
    doc.setFillColor(240, 240, 250);
    doc.roundedRect(10, 235, 190, 30, 3, 3, 'F');
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    
    const splitDescription = doc.splitTextToSize(proposal.description || "", 180);
    doc.text(splitDescription, 15, 245);
    
    // Características personalizadas
    if (proposal.customFeatures && proposal.customFeatures.length > 0) {
      const startY = 275;
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 64, 175);
      doc.text("Características Personalizadas", 14, startY);
      
      // Rectángulo decorativo para las características
      doc.setFillColor(240, 240, 250);
      doc.roundedRect(10, startY + 5, 190, 10 + (proposal.customFeatures.length * 8), 3, 3, 'F');
      
      // Listar características con check marks
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      
      proposal.customFeatures.forEach((feature, index) => {
        const y = startY + 15 + (index * 8);
        
        // Check mark circle
        doc.setDrawColor(126, 34, 206);
        doc.setFillColor(126, 34, 206);
        doc.circle(20, y - 2, 1.5, 'FD');
        
        doc.text(feature, 25, y);
      });
    }
    
    // Footer con gradiente en cada página
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Agregar gradiente en el pie de página
      createGradient(0, doc.internal.pageSize.height - 20, doc.internal.pageSize.width, 20);
      
      // Texto en el pie de página
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.text(
        `Página ${i} de ${pageCount} - SoySeoLocal - Generado el ${format(new Date(), "dd/MM/yyyy", { locale: es })}`,
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

