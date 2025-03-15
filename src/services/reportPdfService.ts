
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ClientReport } from "@/types/client";
import { getClient } from "./clientService";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const generateReportPdf = async (report: ClientReport): Promise<Blob> => {
  try {
    // Obtener datos del cliente
    const client = await getClient(report.clientId);
    
    // Crear documento PDF
    const doc = new jsPDF();
    
    // Agregar título
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("INFORME", 105, 20, { align: "center" });
    
    // Agregar información del informe
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(report.title, 105, 30, { align: "center" });
    
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
    
    // Datos del informe
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Detalles del Informe", 14, 80);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    const formattedDate = format(new Date(report.date), "dd/MM/yyyy", { locale: es });
    
    const reportData = [
      ["Tipo:", report.type],
      ["Fecha:", formattedDate],
      ["URL:", report.url || ""],
    ];
    
    autoTable(doc, {
      startY: 85,
      head: [],
      body: reportData,
      theme: "plain",
      styles: { fontSize: 10 },
      columnStyles: { 0: { fontStyle: "bold", cellWidth: 40 } }
    });
    
    // Notas
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Notas", 14, 115);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    const splitNotes = doc.splitTextToSize(report.notes || "No hay notas disponibles", 180);
    doc.text(splitNotes, 14, 125);
    
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
