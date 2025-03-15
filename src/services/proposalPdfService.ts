
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
    
    // Agregar título
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("PROPUESTA COMERCIAL", 105, 20, { align: "center" });
    
    // Agregar información de la propuesta
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(proposal.title, 105, 30, { align: "center" });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    // Datos del cliente
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Datos del Cliente", 14, 45);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    const clientData = [
      ["Cliente:", client?.name || ""],
      ["Email:", client?.email || ""],
      ["Teléfono:", client?.phone || ""],
    ];
    
    autoTable(doc, {
      startY: 50,
      head: [],
      body: clientData,
      theme: "plain",
      styles: { fontSize: 10 },
      columnStyles: { 0: { fontStyle: "bold", cellWidth: 40 } }
    });
    
    // Datos de la propuesta
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Detalles de la Propuesta", 14, 80);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
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
      startY: 85,
      head: [],
      body: proposalData,
      theme: "plain",
      styles: { fontSize: 10 },
      columnStyles: { 0: { fontStyle: "bold", cellWidth: 40 } }
    });
    
    // Datos del paquete
    if (pack) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Paquete Seleccionado", 14, 115);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      
      const packageData = [
        ["Nombre:", pack.name],
        ["Precio:", `${proposal.customPrice || pack.price} €`],
        ["Descripción:", pack.description],
      ];
      
      autoTable(doc, {
        startY: 120,
        head: [],
        body: packageData,
        theme: "plain",
        styles: { fontSize: 10 },
        columnStyles: { 0: { fontStyle: "bold", cellWidth: 40 } }
      });
    }
    
    // Descripción
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Descripción", 14, 150);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    const splitDescription = doc.splitTextToSize(proposal.description || "", 180);
    doc.text(splitDescription, 14, 160);
    
    // Características personalizadas
    if (proposal.customFeatures && proposal.customFeatures.length > 0) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Características Personalizadas", 14, 190);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      
      const customFeaturesData = proposal.customFeatures.map(feature => [feature]);
      
      autoTable(doc, {
        startY: 195,
        head: [],
        body: customFeaturesData,
        theme: "plain",
        styles: { fontSize: 10 }
      });
    }
    
    // Pie de página
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
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
    a.download = `propuesta-${proposal.id}.pdf`;
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
