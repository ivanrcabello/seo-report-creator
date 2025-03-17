/**
 * PDF sections for invoices
 */
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Invoice } from "@/types/invoiceTypes";
import { CompanySettings } from "@/types/settings";
import { format } from "date-fns";

/**
 * Add company info to the PDF
 */
export const addCompanyInfo = (doc: jsPDF, company: CompanySettings) => {
  const startY = 10;
  
  // Company name
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(company.companyName, 10, startY);
  
  // Company info
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  
  const companyInfo = [
    `CIF/NIF: ${company.taxId || 'N/A'}`,
    company.address,
    `Tel: ${company.phone || 'N/A'}`,
    `Email: ${company.email || 'N/A'}`
  ];
  
  companyInfo.forEach((line, index) => {
    doc.text(line, 10, startY + 6 + (index * 3.5));
  });
  
  // Add logo if available
  if (company.logoUrl) {
    try {
      // Placeholder for logo
      // In a real implementation, you would load the image and add it
      // doc.addImage(company.logoUrl, 'JPEG', 150, 10, 40, 20);
    } catch (e) {
      console.error("Could not add logo:", e);
    }
  }
};

/**
 * Add client info to the PDF
 */
export const addClientInfo = (doc: jsPDF, invoice: Invoice) => {
  const startY = 35;
  
  // Client section title
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text("DATOS DEL CLIENTE", 10, startY);
  doc.setDrawColor(200, 200, 200);
  doc.line(10, startY + 2, 70, startY + 2);
  
  // Client info
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  
  // Fix: Get client info from invoice proper fields or from empty string fallbacks
  const clientInfo = [
    invoice.clientName || 'N/A',
    // The Invoice type doesn't have clientEmail or clientPhone properties
    // We'll use appropriate fallbacks instead
    '',  // Empty placeholder for email
    ''   // Empty placeholder for phone
  ].filter(Boolean);
  
  clientInfo.forEach((line, index) => {
    doc.text(line, 10, startY + 7 + (index * 3.5));
  });
};

/**
 * Add invoice header to the PDF
 */
export const addInvoiceHeader = (doc: jsPDF, invoice: Invoice) => {
  const startY = 35;
  
  // Invoice number and info on the right side
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`FACTURA: ${invoice.invoiceNumber}`, 120, startY);
  
  // Other invoice details
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  
  const issueDate = invoice.issueDate 
    ? format(new Date(invoice.issueDate), 'dd/MM/yyyy')
    : 'N/A';
    
  const dueDate = invoice.dueDate 
    ? format(new Date(invoice.dueDate), 'dd/MM/yyyy') 
    : 'N/A';
    
  const invoiceInfo = [
    `Fecha de emisión: ${issueDate}`,
    `Fecha de vencimiento: ${dueDate}`,
    `Estado: ${getStatusText(invoice.status)}`
  ];
  
  invoiceInfo.forEach((line, index) => {
    doc.text(line, 120, startY + 7 + (index * 3.5));
  });
};

/**
 * Add invoice items to the PDF
 */
export const addInvoiceItems = (doc: jsPDF, invoice: Invoice) => {
  const startY = 65;
  
  // Set up the table headers
  const headers = [
    ['Concepto', 'Cantidad', 'Precio Unitario', 'Importe']
  ];
  
  // Set up the table data - Since we don't have line items in our current model,
  // we're adding a single row for the service
  const data = [
    ['Servicios Profesionales', '1', invoice.baseAmount.toFixed(2) + ' €', invoice.baseAmount.toFixed(2) + ' €']
  ];
  
  // Add the table to the document
  (doc as any).autoTable({
    startY: startY,
    head: headers,
    body: data,
    theme: 'plain',
    styles: {
      fontSize: 8,
      cellPadding: 3
    },
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 30, halign: 'right' },
      3: { cellWidth: 30, halign: 'right' }
    }
  });
  
  // Add tax and total after the table
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  // Base amount
  doc.text('Base imponible:', 130, finalY);
  doc.text(`${invoice.baseAmount.toFixed(2)} €`, 180, finalY, { align: 'right' });
  
  // Tax
  doc.text(`IVA (${invoice.taxRate}%):`, 130, finalY + 5);
  doc.text(`${invoice.taxAmount.toFixed(2)} €`, 180, finalY + 5, { align: 'right' });
  
  // Draw a line before the total
  doc.setDrawColor(200, 200, 200);
  doc.line(130, finalY + 7, 180, finalY + 7);
  
  // Total
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL:', 130, finalY + 12);
  doc.text(`${invoice.totalAmount.toFixed(2)} €`, 180, finalY + 12, { align: 'right' });
};

/**
 * Add invoice footer to the PDF
 */
export const addInvoiceFooter = (doc: jsPDF, invoice: Invoice, company: CompanySettings) => {
  const pageHeight = doc.internal.pageSize.height;
  
  // Notes
  if (invoice.notes) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Notas:', 10, pageHeight - 45);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.notes, 10, pageHeight - 40, {
      maxWidth: 180
    });
  }
  
  // Payment information
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Información de pago:', 10, pageHeight - 30);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  
  const bankAccount = company.bankAccount || 'No especificado';
  doc.text(`Cuenta bancaria: ${bankAccount}`, 10, pageHeight - 25);
  
  // Footer with company info
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(`${company.companyName} - CIF/NIF: ${company.taxId} - ${company.address}`, 10, pageHeight - 10);
  doc.text(`Teléfono: ${company.phone} - Email: ${company.email}`, 10, pageHeight - 7);
  
  // Page numbers
  doc.text(`Página 1 de 1`, 180, pageHeight - 7, { align: 'right' });
};

/**
 * Helper function to get the status text
 */
const getStatusText = (status: string): string => {
  switch (status) {
    case 'draft':
      return 'Borrador';
    case 'pending':
      return 'Pendiente';
    case 'paid':
      return 'Pagada';
    case 'overdue':
      return 'Vencida';
    default:
      return status;
  }
};
