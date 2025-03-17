
import { jsPDF } from "jspdf";
import { Invoice } from "@/types/invoiceTypes";
import { formatCurrency, formatDate } from "../invoiceFormatters";

// Configuración de estilos
const fontSizes = {
  title: 20,
  subtitle: 16,
  heading: 12,
  normal: 10,
  small: 8
};

const colors = {
  primary: [41, 128, 185], // RGB para azul
  secondary: [52, 73, 94], // RGB para gris oscuro
  accent: [26, 188, 156], // RGB para verde/turquesa
  lightGray: [189, 195, 199], // RGB para gris claro
  text: [44, 62, 80] // RGB para texto principal
};

/**
 * Adds the company header to the PDF
 */
export const addCompanyHeader = (doc: jsPDF) => {
  // Usamos la información de prueba hasta que tengamos la real
  // TODO: Obtener datos reales de la empresa desde la configuración
  
  doc.setFontSize(fontSizes.title);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text("Mi Empresa", 20, 20);
  
  doc.setFontSize(fontSizes.normal);
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  doc.text("CIF: B12345678", 20, 30);
  doc.text("Calle Principal 123", 20, 35);
  doc.text("28001 Madrid", 20, 40);
  doc.text("info@miempresa.com", 20, 45);
  doc.text("Tel: +34 91 123 45 67", 20, 50);
  
  // Línea divisoria
  doc.setDrawColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
  doc.line(20, 55, 190, 55);
};

/**
 * Adds the invoice header information to the PDF
 */
export const addInvoiceHeader = (doc: jsPDF, invoice: Invoice) => {
  doc.setFontSize(fontSizes.subtitle);
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.text(`FACTURA ${invoice.invoiceNumber}`, 140, 20);
  
  doc.setFontSize(fontSizes.normal);
  doc.text(`Fecha de emisión: ${formatDate(invoice.issueDate)}`, 140, 30);
  
  if (invoice.dueDate) {
    doc.text(`Fecha de vencimiento: ${formatDate(invoice.dueDate)}`, 140, 35);
  }
  
  doc.text(`Estado: ${translateStatus(invoice.status)}`, 140, 40);
  
  // Si la factura está pagada y tiene fecha de pago
  if (invoice.status === "paid" && invoice.paymentDate) {
    doc.text(`Fecha de pago: ${formatDate(invoice.paymentDate)}`, 140, 45);
  }
};

/**
 * Adds client information to the PDF
 */
export const addClientInfo = (doc: jsPDF, invoice: Invoice) => {
  doc.setFontSize(fontSizes.heading);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text("DATOS DEL CLIENTE", 20, 70);
  
  doc.setFontSize(fontSizes.normal);
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  // Usamos el nombre del cliente si está disponible, o el ID si no
  const clientName = invoice.clientName || `Cliente ID: ${invoice.clientId}`;
  doc.text(clientName, 20, 80);
  
  // TODO: Añadir más información del cliente (dirección, etc.) cuando esté disponible
};

/**
 * Adds invoice items to the PDF
 */
export const addInvoiceItems = (doc: jsPDF, invoice: Invoice) => {
  doc.setFontSize(fontSizes.heading);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text("CONCEPTOS", 20, 100);
  
  // Definir la tabla de conceptos
  const tableColumn = ["Concepto", "Cantidad", "Precio", "Importe"];
  const tableRows = [];
  
  // Si hay items específicos en la factura
  if (invoice.items && invoice.items.length > 0) {
    invoice.items.forEach(item => {
      const tableRow = [
        item.description,
        item.quantity.toString(),
        formatCurrency(item.unitPrice),
        formatCurrency(item.quantity * item.unitPrice)
      ];
      tableRows.push(tableRow);
    });
  } else {
    // Si no hay items, usamos el importe base como un solo concepto
    const tableRow = [
      "Servicios profesionales",
      "1",
      formatCurrency(invoice.baseAmount),
      formatCurrency(invoice.baseAmount)
    ];
    tableRows.push(tableRow);
  }
  
  // Añadir la tabla
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 105,
    styles: { fontSize: fontSizes.normal, cellPadding: 3 },
    headStyles: { 
      fillColor: [colors.primary[0], colors.primary[1], colors.primary[2]],
      textColor: [255, 255, 255],
      fontStyle: 'bold' 
    },
    margin: { top: 10, left: 20, right: 20 },
    theme: 'grid'
  });
};

/**
 * Adds invoice totals to the PDF
 */
export const addInvoiceTotals = (doc: jsPDF, invoice: Invoice) => {
  // Obtener la posición Y después de la tabla
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  const rightAlign = 170;
  
  doc.setFontSize(fontSizes.normal);
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  
  // Base imponible
  doc.text("Base imponible:", 110, finalY);
  doc.text(formatCurrency(invoice.baseAmount), rightAlign, finalY, { align: "right" });
  
  // IVA
  doc.text(`IVA (${invoice.taxRate}%):`, 110, finalY + 7);
  doc.text(formatCurrency(invoice.taxAmount), rightAlign, finalY + 7, { align: "right" });
  
  // Línea divisoria
  doc.setDrawColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
  doc.line(110, finalY + 10, 190, finalY + 10);
  
  // Total
  doc.setFontSize(fontSizes.heading);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text("TOTAL:", 110, finalY + 18);
  doc.text(formatCurrency(invoice.totalAmount), rightAlign, finalY + 18, { align: "right" });
};

/**
 * Adds notes to the PDF
 */
export const addInvoiceNotes = (doc: jsPDF, notes: string) => {
  // Obtener la posición Y de la última sección
  // Si el invoice tiene items, usamos la posición de la tabla, si no, es finalY + 30
  const finalY = (doc as any).lastAutoTable ? 
                (doc as any).lastAutoTable.finalY + 30 : 
                130;
  
  doc.setFontSize(fontSizes.heading);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text("NOTAS", 20, finalY);
  
  doc.setFontSize(fontSizes.normal);
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  
  // Formatear las notas para que quepa en la página
  const splitNotes = doc.splitTextToSize(notes, 170);
  doc.text(splitNotes, 20, finalY + 10);
};

/**
 * Adds footer information to the PDF
 */
export const addInvoiceFooter = (doc: jsPDF) => {
  const pageHeight = doc.internal.pageSize.height;
  
  doc.setFontSize(fontSizes.small);
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  
  // Añadir información de la cuenta bancaria
  doc.text("INFORMACIÓN DE PAGO", 20, pageHeight - 30);
  doc.text("Cuenta Bancaria: ES00 0000 0000 0000 0000 0000", 20, pageHeight - 25);
  
  // Línea divisoria
  doc.setDrawColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
  doc.line(20, pageHeight - 20, 190, pageHeight - 20);
  
  // Texto de pie de página
  doc.text("Documento generado electrónicamente. No requiere firma.", 20, pageHeight - 15);
  doc.text(`Generado el ${new Date().toLocaleDateString()}`, 20, pageHeight - 10);
};

// Función auxiliar para traducir el estado de la factura
const translateStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    draft: "Borrador",
    pending: "Pendiente",
    paid: "Pagada",
    cancelled: "Cancelada"
  };
  
  return statusMap[status] || status;
};
