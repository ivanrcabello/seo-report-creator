
/**
 * PDF section generators for invoice PDFs
 */

import jsPDF from "jspdf";
// Import jspdf-autotable correctly
import autoTable from "jspdf-autotable";
import { Invoice } from "@/types/invoice";
import { getStatusText, getStatusColor } from "./pdfStyles";
import { formatDate, formatCurrency } from "../invoiceFormatters";

/**
 * Adds company header with logo to the PDF
 */
export const addCompanyHeader = (doc: jsPDF) => {
  // Placeholder for logo (would use an actual logo image in production)
  doc.setFillColor(41, 63, 125); // RGB values for blue
  doc.rect(14, 15, 20, 20, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text("SEO", 19, 27);
  
  // Company name and info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("SEO Dashboard", 40, 25);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("123 SEO Street, Digital City", 40, 33);
  doc.text("contact@seodashboard.com | +34 123 456 789", 40, 38);
  
  // Divider line
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.line(14, 45, 196, 45);
};

/**
 * Adds invoice information to the PDF
 */
export const addInvoiceInfo = (doc: jsPDF, invoice: Invoice) => {
  // FACTURA heading
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(41, 63, 125);
  doc.text("FACTURA", 14, 60);
  
  // Invoice number and dates
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Número de Factura:", 14, 70);
  doc.text("Fecha de Emisión:", 14, 75);
  doc.text("Fecha de Vencimiento:", 14, 80);
  
  doc.setFont("helvetica", "normal");
  doc.text(invoice.invoiceNumber || "", 80, 70);
  doc.text(formatDate(invoice.issueDate), 80, 75);
  doc.text(invoice.dueDate ? formatDate(invoice.dueDate) : "N/A", 80, 80);
  
  // Status badge
  const statusText = getStatusText(invoice.status);
  const statusColor = getStatusColor(invoice.status);
  
  // Draw status badge
  doc.setFillColor(statusColor.r, statusColor.g, statusColor.b);
  doc.roundedRect(140, 57, 45, 12, 2, 2, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(statusText, 163, 65, { align: "center" });
};

/**
 * Adds client information to the PDF
 */
export const addClientInfo = (doc: jsPDF, client: any) => {
  // Client section
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(41, 63, 125);
  doc.text("CLIENTE", 14, 95);
  
  // Client details
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  
  doc.text(`${client.name}${client.company ? ` - ${client.company}` : ""}`, 14, 103);
  if (client.address) {
    doc.text(client.address, 14, 108);
  }
  
  if (client.city || client.postalCode) {
    const locationLine = [
      client.city || "",
      client.postalCode ? `CP: ${client.postalCode}` : "",
    ].filter(Boolean).join(", ");
    
    if (locationLine) {
      doc.text(locationLine, 14, 113);
    }
  }
  
  if (client.taxId) {
    doc.text(`NIF/CIF: ${client.taxId}`, 14, 118);
  }
  
  // Email and phone if available
  if (client.email) {
    doc.text(`Email: ${client.email}`, 14, 123);
  }
  
  if (client.phone) {
    doc.text(`Teléfono: ${client.phone}`, 14, 128);
  }
  
  // Description line before items table
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.text("Factura por servicios de marketing digital y SEO.", 14, 138);
};

/**
 * Adds invoice items to the PDF
 */
export const addInvoiceItems = (doc: jsPDF, invoice: Invoice) => {
  // Get table data - for now we'll just use a simple description row
  const tableColumn = ["Descripción", "Cantidad", "Precio", "IVA", "Total"];
  const tableRows = [
    [
      "Servicios de marketing digital y posicionamiento SEO",
      "1",
      formatCurrency(invoice.baseAmount),
      `${invoice.taxRate}%`,
      formatCurrency(invoice.baseAmount)
    ]
  ];
  
  // Add the items table using autoTable
  if (typeof doc.autoTable !== 'function') {
    // Apply autoTable function to doc if it's not already available
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 145,
      theme: "grid",
      styles: {
        fontSize: 9,
        lineColor: [220, 220, 220]
      },
      headStyles: {
        fillColor: [41, 63, 125],
        textColor: [255, 255, 255],
        lineColor: [220, 220, 220]
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 30, halign: 'right' },
        3: { cellWidth: 20, halign: 'center' },
        4: { cellWidth: 30, halign: 'right' }
      },
    });
  } else {
    // Use the standard method if autoTable is already on the doc object
    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 145,
      theme: "grid",
      styles: {
        fontSize: 9,
        lineColor: [220, 220, 220]
      },
      headStyles: {
        fillColor: [41, 63, 125],
        textColor: [255, 255, 255],
        lineColor: [220, 220, 220]
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 30, halign: 'right' },
        3: { cellWidth: 20, halign: 'center' },
        4: { cellWidth: 30, halign: 'right' }
      },
    });
  }
};

/**
 * Adds invoice totals to the PDF
 */
export const addInvoiceTotals = (doc: jsPDF, invoice: Invoice) => {
  // Get the final Y position from the previous table
  const finalY = (doc as any).lastAutoTable?.finalY + 10 || 180;
  
  // Draw the totals box on the right side
  doc.setFillColor(249, 250, 251); // Light gray background
  doc.rect(110, finalY, 85, 40, "F");
  
  // Add totals text
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  
  doc.text("Subtotal:", 115, finalY + 10);
  doc.text("IVA:", 115, finalY + 20);
  doc.text("TOTAL:", 115, finalY + 30);
  
  // Add totals values aligned to the right
  doc.setFont("helvetica", "bold");
  doc.text(formatCurrency(invoice.baseAmount), 190, finalY + 10, { align: "right" });
  doc.text(formatCurrency(invoice.taxAmount), 190, finalY + 20, { align: "right" });
  
  // Total amount with highlight
  doc.setFontSize(12);
  doc.setTextColor(41, 63, 125);
  doc.text(formatCurrency(invoice.totalAmount), 190, finalY + 30, { align: "right" });
  
  // Add notes if available
  if (invoice.notes) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 100, 100);
    doc.text("Notas:", 14, finalY + 10);
    
    const splitNotes = doc.splitTextToSize(invoice.notes, 90);
    doc.text(splitNotes, 14, finalY + 15);
  }
};

/**
 * Adds footer with payment information to the PDF
 */
export const addFooterWithPaymentInfo = (doc: jsPDF, invoice: Invoice) => {
  const pageHeight = doc.internal.pageSize.height;
  
  // Payment information
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(41, 63, 125);
  doc.text("INFORMACIÓN DE PAGO", 14, pageHeight - 40);
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text("Banco: BBVA", 14, pageHeight - 35);
  doc.text("IBAN: ES12 3456 7890 1234 5678 9012", 14, pageHeight - 30);
  doc.text("Referencia: Incluir el número de factura en el concepto", 14, pageHeight - 25);
  
  // Footer with legal text and page numbers
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("SEO Dashboard S.L. - CIF: B12345678 - Inscrita en el Registro Mercantil de Madrid", 14, pageHeight - 15);
  doc.text(`Página 1 de 1`, doc.internal.pageSize.width - 20, pageHeight - 15, { align: "right" });
};
