
/**
 * Core PDF generation functionality
 */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 
import { Invoice } from "@/types/invoice";
import { getClient } from "@/services/clientService";

// Constants for PDF styling
const COLORS = {
  primary: {
    blue: [38, 78, 178],
    purple: [126, 34, 206],
  },
  text: {
    dark: [60, 60, 60],
    light: [100, 100, 100],
    white: [255, 255, 255],
  },
  background: {
    light: [240, 240, 250],
    white: [255, 255, 255],
  }
};

/**
 * Generates a PDF document for an invoice
 */
export const generateInvoicePdf = async (invoice: Invoice): Promise<Blob> => {
  try {
    console.log("Starting PDF generation for invoice:", invoice.invoiceNumber);
    
    // Create new document
    const doc = new jsPDF();
    
    console.log("Fetching client data for ID:", invoice.clientId);
    const client = await getClient(invoice.clientId);

    if (!client) {
      throw new Error(`Client not found for ID: ${invoice.clientId}`);
    }
    
    console.log("Client data loaded successfully:", client.name);

    // Set document properties
    doc.setProperties({
      title: `Factura ${invoice.invoiceNumber}`,
      subject: `Factura para ${client.name}`,
      author: "SEO Dashboard",
      creator: "SEO Dashboard",
    });

    // Add header
    doc.setFillColor(COLORS.primary.blue[0], COLORS.primary.blue[1], COLORS.primary.blue[2]);
    doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
    
    doc.setTextColor(COLORS.text.white[0], COLORS.text.white[1], COLORS.text.white[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("FACTURA", 105, 20, { align: "center" });
    
    // Invoice info
    doc.setTextColor(COLORS.text.dark[0], COLORS.text.dark[1], COLORS.text.dark[2]);
    doc.setFontSize(16);
    doc.text(`Factura: ${invoice.invoiceNumber}`, 15, 60);
    
    // Draw line
    doc.setDrawColor(COLORS.primary.blue[0], COLORS.primary.blue[1], COLORS.primary.blue[2]);
    doc.setLineWidth(0.5);
    doc.line(15, 65, 195, 65);
    
    // Date info
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text(`Fecha de emisión: ${new Date(invoice.issueDate).toLocaleDateString()}`, 15, 75);
    doc.text(`Fecha de vencimiento: ${new Date(invoice.dueDate).toLocaleDateString()}`, 15, 82);
    
    // Client info
    doc.setFontSize(14);
    doc.setTextColor(COLORS.primary.blue[0], COLORS.primary.blue[1], COLORS.primary.blue[2]);
    doc.text("Datos del Cliente", 15, 100);
    
    doc.setFillColor(COLORS.background.light[0], COLORS.background.light[1], COLORS.background.light[2]);
    doc.roundedRect(15, 105, 180, 40, 3, 3, 'F');
    
    doc.setFontSize(11);
    doc.setTextColor(COLORS.text.dark[0], COLORS.text.dark[1], COLORS.text.dark[2]);
    doc.text(`Cliente: ${client.name}`, 20, 115);
    doc.text(`Empresa: ${client.company || "N/A"}`, 20, 123);
    doc.text(`Email: ${client.email}`, 20, 131);
    doc.text(`Teléfono: ${client.phone || "N/A"}`, 20, 139);
    
    // Items section
    doc.setFontSize(14);
    doc.setTextColor(COLORS.primary.blue[0], COLORS.primary.blue[1], COLORS.primary.blue[2]);
    doc.text("Conceptos", 15, 160);
    
    // Create items table
    const tableColumn = ["Descripción", "Importe"];
    const tableRows = [
      [`Servicios SEO${invoice.notes ? ` - ${invoice.notes}` : ""}`, `${invoice.baseAmount.toFixed(2)} €`]
    ];
    
    autoTable(doc, {
      startY: 165,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: {
        fillColor: [COLORS.primary.blue[0], COLORS.primary.blue[1], COLORS.primary.blue[2]],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        halign: 'left',
        font: 'helvetica',
        fontSize: 11
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 40, halign: 'right' }
      }
    });
    
    // Add totals
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    const totalsTable = [
      ["Base imponible", `${invoice.baseAmount.toFixed(2)} €`],
      [`IVA (${invoice.taxRate}%)`, `${invoice.taxAmount.toFixed(2)} €`],
      ["TOTAL", `${invoice.totalAmount.toFixed(2)} €`]
    ];
    
    autoTable(doc, {
      startY: finalY,
      head: [],
      body: totalsTable,
      theme: 'plain',
      styles: {
        fontSize: 11
      },
      columnStyles: {
        0: { cellWidth: 'auto', halign: 'right', fontStyle: 'bold' },
        1: { cellWidth: 40, halign: 'right' }
      },
      didParseCell: function(data) {
        if (data.row.index === 2) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fontSize = 12;
        }
      }
    });
    
    // Add payment info
    const paymentY = (doc as any).lastAutoTable.finalY + 20;
    
    doc.setFontSize(12);
    doc.setTextColor(COLORS.primary.blue[0], COLORS.primary.blue[1], COLORS.primary.blue[2]);
    doc.setFont("helvetica", "bold");
    doc.text("Información de pago", 15, paymentY);
    
    doc.setFontSize(10);
    doc.setTextColor(COLORS.text.dark[0], COLORS.text.dark[1], COLORS.text.dark[2]);
    doc.setFont("helvetica", "normal");
    doc.text("Método de pago: Transferencia bancaria", 15, paymentY + 10);
    doc.text("Cuenta: ES12 3456 7890 1234 5678 9012", 15, paymentY + 18);
    doc.text("Titular: SEO Dashboard", 15, paymentY + 26);
    
    // Add footer
    doc.setFillColor(COLORS.primary.blue[0], COLORS.primary.blue[1], COLORS.primary.blue[2]);
    doc.rect(0, doc.internal.pageSize.height - 20, doc.internal.pageSize.width, 20, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text(
      `Factura generada el ${new Date().toLocaleDateString()} - SEO Dashboard`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );

    console.log("PDF generation completed, creating blob");
    // Generate the PDF as a blob
    const pdfBlob = doc.output("blob");
    return pdfBlob;
  } catch (error) {
    console.error("Error generating invoice PDF:", error);
    throw error;
  }
};
