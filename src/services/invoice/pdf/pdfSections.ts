
/**
 * PDF sections for invoice generation
 */

import jsPDF from "jspdf";
import { Invoice } from "@/types/invoice";
import { Client } from "@/types/client";
import { tableStyles, textStyles } from "./pdfStyles";
import { format } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Adds the company header to the PDF
 */
export const addCompanyHeader = (doc: jsPDF): void => {
  // In a real app, we would add the company logo here
  doc.setFont(textStyles.header.font, textStyles.header.style);
  doc.setFontSize(textStyles.header.size);
  doc.setTextColor(textStyles.header.color[0], textStyles.header.color[1], textStyles.header.color[2]);
  
  doc.text("SEO Dashboard", 20, 20);
  
  doc.setFont(textStyles.default.font, textStyles.default.style);
  doc.setFontSize(textStyles.default.size);
  doc.setTextColor(textStyles.default.color[0], textStyles.default.color[1], textStyles.default.color[2]);
  
  doc.text("CIF: 12345678Z", 20, 30);
  doc.text("Calle Principal 123", 20, 35);
  doc.text("28001 Madrid", 20, 40);
  doc.text("contact@seodashboard.com", 20, 45);
};

/**
 * Adds invoice information to the PDF
 */
export const addInvoiceInfo = (doc: jsPDF, invoice: Invoice): void => {
  const startY = 60;
  
  // Add invoice title
  doc.setFont(textStyles.subheader.font, textStyles.subheader.style);
  doc.setFontSize(textStyles.subheader.size);
  doc.setTextColor(textStyles.subheader.color[0], textStyles.subheader.color[1], textStyles.subheader.color[2]);
  
  doc.text("FACTURA", 140, startY);
  
  // Add invoice details
  doc.setFont(textStyles.default.font, textStyles.default.style);
  doc.setFontSize(textStyles.default.size);
  doc.setTextColor(textStyles.default.color[0], textStyles.default.color[1], textStyles.default.color[2]);
  
  doc.text(`Nº Factura: ${invoice.invoiceNumber}`, 140, startY + 10);
  doc.text(`Fecha: ${format(new Date(invoice.issueDate), "dd/MM/yyyy", { locale: es })}`, 140, startY + 15);
  
  if (invoice.dueDate) {
    doc.text(`Vencimiento: ${format(new Date(invoice.dueDate), "dd/MM/yyyy", { locale: es })}`, 140, startY + 20);
  }
  
  // Add status
  doc.setFont(textStyles.default.font, "bold");
  doc.text(`Estado: ${getInvoiceStatusText(invoice.status)}`, 140, startY + 30);
  doc.setFont(textStyles.default.font, textStyles.default.style);
};

/**
 * Adds client information to the PDF
 */
export const addClientInfo = (doc: jsPDF, client: Client): void => {
  const startY = 90;
  
  // Add client title
  doc.setFont(textStyles.subheader.font, textStyles.subheader.style);
  doc.setFontSize(textStyles.subheader.size);
  doc.setTextColor(textStyles.subheader.color[0], textStyles.subheader.color[1], textStyles.subheader.color[2]);
  
  doc.text("CLIENTE", 20, startY);
  
  // Add client details
  doc.setFont(textStyles.default.font, textStyles.default.style);
  doc.setFontSize(textStyles.default.size);
  doc.setTextColor(textStyles.default.color[0], textStyles.default.color[1], textStyles.default.color[2]);
  
  doc.text(client.name, 20, startY + 10);
  
  if (client.company) {
    doc.text(client.company, 20, startY + 15);
  }
  
  // Add client contact info
  doc.text(`Email: ${client.email}`, 20, startY + 25);
  
  if (client.phone) {
    doc.text(`Teléfono: ${client.phone}`, 20, startY + 30);
  }
};

/**
 * Adds invoice items to the PDF
 */
export const addInvoiceItems = (doc: jsPDF, invoice: Invoice): void => {
  const startY = 130;
  
  doc.setFont(textStyles.subheader.font, textStyles.subheader.style);
  doc.setFontSize(textStyles.subheader.size);
  doc.setTextColor(textStyles.subheader.color[0], textStyles.subheader.color[1], textStyles.subheader.color[2]);
  
  doc.text("CONCEPTOS", 20, startY);
  
  // Add items table
  // For now, we're just showing a single concept since our invoices are simple
  const tableData = [
    [
      "Servicios SEO",
      formatCurrency(invoice.baseAmount),
    ],
  ];
  
  if (invoice.notes) {
    tableData[0][0] = `Servicios SEO - ${invoice.notes}`;
  }
  
  // Using autoTable plugin
  doc.autoTable({
    startY: startY + 10,
    head: [["Concepto", "Importe"]],
    body: tableData,
    styles: tableStyles.styles,
    headStyles: {
      fillColor: [241, 245, 249] as [number, number, number],
      textColor: [31, 41, 55] as [number, number, number],
      fontStyle: 'bold'
    },
    bodyStyles: {
      textColor: [31, 41, 55] as [number, number, number]
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251] as [number, number, number]
    }
  });
};

/**
 * Adds invoice totals to the PDF
 */
export const addInvoiceTotals = (doc: jsPDF, invoice: Invoice): void => {
  const finalY = doc.lastAutoTable?.finalY || 150;
  
  // Add totals table
  const totalsData = [
    ["Base Imponible", formatCurrency(invoice.baseAmount)],
    [`IVA (${invoice.taxRate}%)`, formatCurrency(invoice.taxAmount)],
    ["TOTAL", formatCurrency(invoice.totalAmount)],
  ];
  
  doc.autoTable({
    startY: finalY + 10,
    body: totalsData,
    columns: [
      { header: "", dataKey: "0" },
      { header: "", dataKey: "1" },
    ],
    margin: { left: 100 },
    tableWidth: 100,
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    columnStyles: {
      0: { halign: "right", font: "helvetica", fontStyle: "bold" },
      1: { halign: "right", font: "helvetica" },
    },
    didParseCell: function(data: any) {
      // Make the total row bold
      if (data.row.index === 2) {
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.fontSize = 12;
      }
    },
  });
};

/**
 * Adds footer with payment information
 */
export const addFooterWithPaymentInfo = (doc: jsPDF, invoice: Invoice): void => {
  const finalY = doc.lastAutoTable?.finalY || 200;
  
  doc.setFont(textStyles.subheader.font, textStyles.subheader.style);
  doc.setFontSize(textStyles.subheader.size);
  doc.setTextColor(textStyles.subheader.color[0], textStyles.subheader.color[1], textStyles.subheader.color[2]);
  
  doc.text("INFORMACIÓN DE PAGO", 20, finalY + 30);
  
  doc.setFont(textStyles.default.font, textStyles.default.style);
  doc.setFontSize(textStyles.default.size);
  doc.setTextColor(textStyles.default.color[0], textStyles.default.color[1], textStyles.default.color[2]);
  
  doc.text("Por favor, realice el pago mediante transferencia bancaria a la siguiente cuenta:", 20, finalY + 40);
  doc.text("IBAN: ES12 3456 7890 1234 5678 9012", 20, finalY + 50);
  doc.text("Banco: Banco Ejemplo", 20, finalY + 55);
  doc.text("Titular: SEO Dashboard SL", 20, finalY + 60);
  
  // Add footer text
  const pageHeight = doc.internal.pageSize.height;
  
  doc.setFontSize(8);
  doc.text("Esta factura ha sido generada por SEO Dashboard.", 20, pageHeight - 20);
};

/**
 * Helper functions
 */
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

const getInvoiceStatusText = (status: string): string => {
  switch (status) {
    case "paid":
      return "Pagada";
    case "pending":
      return "Pendiente";
    case "cancelled":
      return "Cancelada";
    default:
      return status;
  }
};
