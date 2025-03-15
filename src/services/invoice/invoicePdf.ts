
import { Invoice } from "@/types/invoice";
import { Client } from "@/types/client";
import { CompanySettings } from "@/types/invoice";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import { formatDate, formatCurrency } from "./invoiceFormatters";
import { getInvoice } from "./invoiceCrud";
import { getClient } from "@/services/clientService";
import { getCompanySettings } from "@/services/settingsService";
import { getSeoPack } from "@/services/packService";
// Import jspdf-autotable default
import autoTable from 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable;
    lastAutoTable: {
      finalY: number;
    };
  }
}

// Generate PDF for an invoice
export const generateInvoicePdf = async (invoiceId: string): Promise<Blob | undefined> => {
  try {
    // Obtener datos necesarios
    const invoice = await getInvoice(invoiceId);
    if (!invoice) {
      toast.error("No se pudo encontrar la factura");
      return undefined;
    }

    const client = await getClient(invoice.clientId);
    if (!client) {
      toast.error("No se pudo encontrar el cliente");
      return undefined;
    }

    const company = await getCompanySettings();
    if (!company) {
      toast.error("No se han configurado los datos de la empresa");
      return undefined;
    }

    // Buscar nombre del pack si existe
    let packName = null;
    if (invoice.packId) {
      const pack = await getSeoPack(invoice.packId);
      if (pack) {
        packName = pack.name;
      }
    }

    // Crear documento PDF
    const doc = new jsPDF();
    
    // Configuración de la página
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;
    
    // Definir colores
    const primaryBlue = [32, 78, 207]; // color seo-blue
    const primaryPurple = [126, 34, 206]; // color seo-purple
    const pendingColor = [234, 179, 8]; // yellow-500
    const paidColor = [34, 197, 94]; // green-500
    const cancelledColor = [239, 68, 68]; // red-500
    
    // Obtener colores según el estado
    const statusColor = {
      pending: pendingColor,
      paid: paidColor,
      cancelled: cancelledColor
    }[invoice.status] || pendingColor;
    
    // ---- Cabecera con gradiente ----
    // Dibujar el fondo de la cabecera con un gradiente
    doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    doc.rect(margin, margin, pageWidth - margin * 2, 25, 'F');
    
    // Título y número de factura
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(`Factura ${invoice.invoiceNumber}`, margin + 5, margin + 16);
    
    // Badge de estado
    const statusText = {
      pending: "Pendiente",
      paid: "Pagada",
      cancelled: "Cancelada"
    }[invoice.status];
    
    // Dibujamos el badge de estado
    const statusX = pageWidth - margin - 50;
    const statusY = margin + 8;
    
    // Fix for the error - provide correct number of arguments for setFillColor
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(statusX, statusY, 40, 12, 6, 6, 'F');
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(statusText, statusX + 20, statusY + 8, { align: 'center' });
    
    // ---- Contenido principal en un grid ----
    const mainY = margin + 35;
    
    // Columna izquierda (2/3 del ancho)
    const leftColWidth = (pageWidth - margin * 2) * 0.65;
    const rightColWidth = (pageWidth - margin * 2) * 0.30;
    const rightColX = margin + leftColWidth + 10;
    
    // Recuadro principal para detalles
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(240, 240, 240);
    doc.roundedRect(margin, mainY, leftColWidth, 200, 3, 3, 'FD');
    
    // Sección 1: Título Detalles de la Factura
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text("Detalles de la Factura", margin + 10, mainY + 15);
    
    // Sección 2: Datos del Emisor y Cliente (en dos columnas)
    const datosY = mainY + 35;
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text("Datos del Emisor", margin + 10, datosY);
    
    // Datos del emisor
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    let emisorY = datosY + 10;
    
    doc.setFont('helvetica', 'bold');
    doc.text(company.companyName, margin + 10, emisorY);
    emisorY += 6;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`CIF/NIF: ${company.taxId}`, margin + 10, emisorY);
    emisorY += 6;
    
    doc.text(`${company.address}`, margin + 10, emisorY);
    emisorY += 6;
    
    if (company.phone) {
      doc.text(`Tel: ${company.phone}`, margin + 10, emisorY);
      emisorY += 6;
    }
    
    if (company.email) {
      doc.text(`Email: ${company.email}`, margin + 10, emisorY);
      emisorY += 6;
    }
    
    // Datos del cliente (segunda columna)
    const clienteX = margin + leftColWidth/2 + 5;
    
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text("Datos del Cliente", clienteX, datosY);
    
    doc.setFontSize(10);
    let clienteY = datosY + 10;
    
    doc.setFont('helvetica', 'bold');
    doc.text(client.name, clienteX, clienteY);
    clienteY += 6;
    
    doc.setFont('helvetica', 'normal');
    if (client.company) {
      doc.text(client.company, clienteX, clienteY);
      clienteY += 6;
    }
    
    doc.text(`Email: ${client.email}`, clienteX, clienteY);
    clienteY += 6;
    
    if (client.phone) {
      doc.text(`Tel: ${client.phone}`, clienteX, clienteY);
      clienteY += 6;
    }
    
    // Sección 3: Tabla de conceptos
    const conceptosY = Math.max(emisorY, clienteY) + 15;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Conceptos", margin + leftColWidth/2, conceptosY, { align: 'center' });
    
    // Tabla de conceptos
    doc.autoTable({
      startY: conceptosY + 10,
      head: [['Concepto', 'Importe']],
      body: [
        [
          {
            content: packName || "Servicios Profesionales", 
            styles: { fontStyle: 'bold' }
          },
          {
            content: formatCurrency(invoice.baseAmount),
            styles: { halign: 'right', fontStyle: 'bold' }
          }
        ],
        ...(invoice.notes ? [
          [
            {
              content: invoice.notes,
              styles: { fontStyle: 'normal', textColor: [100, 100, 100] }
            },
            { content: '' }
          ]
        ] : []),
        [
          { 
            content: 'Base Imponible',
            styles: { halign: 'right', fontStyle: 'bold' }
          },
          {
            content: formatCurrency(invoice.baseAmount),
            styles: { halign: 'right', fontStyle: 'bold' }
          }
        ],
        [
          {
            content: `IVA (${invoice.taxRate}%)`,
            styles: { halign: 'right', fontStyle: 'bold' }
          },
          {
            content: formatCurrency(invoice.taxAmount),
            styles: { halign: 'right', fontStyle: 'bold' }
          }
        ],
        [
          {
            content: 'Total',
            styles: { halign: 'right', fontStyle: 'bold' }
          },
          {
            content: formatCurrency(invoice.totalAmount),
            styles: { halign: 'right', fontStyle: 'bold', textColor: primaryBlue }
          }
        ]
      ],
      theme: 'plain',
      styles: {
        fontSize: 10,
        cellPadding: 6
      },
      columnStyles: {
        0: { cellWidth: leftColWidth * 0.6 },
        1: { cellWidth: leftColWidth * 0.4, halign: 'right' }
      },
      margin: { left: margin + 5 },
      tableWidth: leftColWidth - 10,
    });
    
    // Columna derecha (1/3 del ancho) - Información de pago
    doc.setFillColor(248, 250, 252); // bg-gray-50
    doc.roundedRect(rightColX, mainY, rightColWidth, 200, 3, 3, 'F');
    
    // Título de información de pago
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]); // text-seo-blue
    doc.text("Información de", rightColX + rightColWidth/2, mainY + 20, { align: 'center' });
    doc.text("Pago", rightColX + rightColWidth/2, mainY + 35, { align: 'center' });
    
    // Información de pago
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    let paymentY = mainY + 60;
    
    // Estado
    doc.setFont('helvetica', 'normal');
    doc.text("Estado:", rightColX + 10, paymentY);
    
    // Status badge
    const smallStatusX = rightColX + rightColWidth - 10 - 40;
    const smallStatusY = paymentY - 8;
    
    // Fix for the setFillColor error - pass R, G, B separately
    doc.setFillColor(statusColor[0], statusColor[1], statusColor[2], 0.2);
    doc.roundedRect(smallStatusX, smallStatusY, 40, 12, 6, 6, 'F');
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(statusText, smallStatusX + 20, smallStatusY + 8, { align: 'center' });
    
    // Resto de información
    paymentY += 20;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text("Nº Factura:", rightColX + 10, paymentY);
    doc.setFont('helvetica', 'bold');
    doc.text(invoice.invoiceNumber, rightColX + rightColWidth - 10, paymentY, { align: 'right' });
    
    paymentY += 20;
    doc.setFont('helvetica', 'normal');
    doc.text("Fecha Emisión:", rightColX + 10, paymentY);
    doc.setFont('helvetica', 'bold');
    doc.text(formatDate(invoice.issueDate), rightColX + rightColWidth - 10, paymentY, { align: 'right' });
    
    if (invoice.dueDate) {
      paymentY += 20;
      doc.setFont('helvetica', 'normal');
      doc.text("Fecha Vencimiento:", rightColX + 10, paymentY);
      doc.setFont('helvetica', 'bold');
      doc.text(formatDate(invoice.dueDate), rightColX + rightColWidth - 10, paymentY, { align: 'right' });
    }
    
    if (invoice.status === "paid" && invoice.paymentDate) {
      paymentY += 20;
      doc.setFont('helvetica', 'normal');
      doc.text("Fecha Pago:", rightColX + 10, paymentY);
      doc.setFont('helvetica', 'bold');
      doc.text(formatDate(invoice.paymentDate), rightColX + rightColWidth - 10, paymentY, { align: 'right' });
    }
    
    // Total a pagar destacado
    paymentY += 30;
    doc.setFont('helvetica', 'normal');
    doc.text("Total a Pagar:", rightColX + 10, paymentY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryPurple[0], primaryPurple[1], primaryPurple[2]); // text-seo-purple
    doc.setFontSize(12);
    doc.text(formatCurrency(invoice.totalAmount), rightColX + rightColWidth - 10, paymentY, { align: 'right' });
    
    // Información de cuenta bancaria si existe
    if (company.bankAccount) {
      paymentY += 25;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text("Cuenta bancaria:", rightColX + 10, paymentY);
      doc.setFont('helvetica', 'bold');
      doc.text(company.bankAccount, rightColX + rightColWidth - 10, paymentY, { align: 'right' });
    }
    
    // Devolver el blob del PDF
    return doc.output('blob');
  } catch (error) {
    console.error("Error generating invoice PDF:", error);
    toast.error("Error al generar el PDF de la factura");
    return undefined;
  }
};

// Download PDF file
export const downloadInvoicePdf = async (invoiceId: string): Promise<boolean> => {
  try {
    const pdfBlob = await generateInvoicePdf(invoiceId);
    if (!pdfBlob) return false;
    
    const invoice = await getInvoice(invoiceId);
    if (!invoice) return false;
    
    // Crear URL y enlace para descargar
    const blobUrl = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `Factura_${invoice.invoiceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Limpiar URL
    setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    
    return true;
  } catch (error) {
    console.error("Error downloading invoice PDF:", error);
    toast.error("Error al descargar el PDF de la factura");
    return false;
  }
};

// Send invoice by email
export const sendInvoiceByEmail = async (invoiceId: string): Promise<boolean> => {
  try {
    const invoice = await getInvoice(invoiceId);
    if (!invoice) {
      toast.error("No se pudo encontrar la factura");
      return false;
    }
    
    const client = await getClient(invoice.clientId);
    if (!client) {
      toast.error("No se pudo encontrar el cliente");
      return false;
    }
    
    // NOTA: Esta es una simulación del envío del email
    // Para implementar envío real de emails, necesitarías:
    // 1. Crear una función Edge en Supabase (o usar un servicio como Resend, SendGrid, etc.)
    // 2. Llamar a esa función desde aquí con los datos necesarios
    
    toast.success(`Simulación: Factura ${invoice.invoiceNumber} enviada a ${client.email}`);
    toast.info("Para implementar envío real de emails, contacta con el desarrollador");
    
    return true;
  } catch (error) {
    console.error("Error sending invoice by email:", error);
    toast.error("Error al enviar la factura por email");
    return false;
  }
};
