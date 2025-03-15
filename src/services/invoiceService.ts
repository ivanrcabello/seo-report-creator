import { Invoice, CompanySettings } from "@/types/invoice";
import { Client } from "@/types/client";
import { supabase } from "@/integrations/supabase/client";
import { getSeoPack } from "./packService";
import { getProposal } from "./proposal/proposalCrud";
import { getClient } from "./clientService";
import { getCompanySettings } from "./settingsService";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
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

// Función para generar un número de factura secuencial
export const generateInvoiceNumber = async (): Promise<string> => {
  const currentYear = new Date().getFullYear().toString();
  
  // Obtener la última factura creada para determinar el siguiente número
  const { data, error } = await supabase
    .from('invoices')
    .select('invoice_number')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  
  if (error) {
    console.error("Error getting last invoice number:", error);
    return `${currentYear}-0001`;
  }
  
  if (!data) {
    return `${currentYear}-0001`;
  }
  
  // Extraer el año y el número de la última factura
  const parts = data.invoice_number.split('-');
  const lastYear = parts[0];
  const lastNumber = parseInt(parts[1], 10);
  
  // Si es un nuevo año, comenzar desde 0001, sino incrementar el último número
  if (lastYear !== currentYear) {
    return `${currentYear}-0001`;
  } else {
    const nextNumber = (lastNumber + 1).toString().padStart(4, '0');
    return `${currentYear}-${nextNumber}`;
  }
};

// Función para convertir datos de Supabase al formato de la aplicación
const mapInvoiceFromDB = (invoice: any): Invoice => ({
  id: invoice.id,
  invoiceNumber: invoice.invoice_number,
  clientId: invoice.client_id,
  issueDate: invoice.issue_date,
  dueDate: invoice.due_date,
  packId: invoice.pack_id,
  proposalId: invoice.proposal_id,
  baseAmount: invoice.base_amount,
  taxRate: invoice.tax_rate,
  taxAmount: invoice.tax_amount,
  totalAmount: invoice.total_amount,
  status: invoice.status,
  paymentDate: invoice.payment_date,
  notes: invoice.notes,
  pdfUrl: invoice.pdf_url,
  createdAt: invoice.created_at,
  updatedAt: invoice.updated_at
});

// Función para convertir datos de la aplicación al formato de Supabase
const mapInvoiceToDB = (invoice: Partial<Invoice>) => ({
  invoice_number: invoice.invoiceNumber,
  client_id: invoice.clientId,
  issue_date: invoice.issueDate,
  due_date: invoice.dueDate,
  pack_id: invoice.packId,
  proposal_id: invoice.proposalId,
  base_amount: invoice.baseAmount,
  tax_rate: invoice.taxRate,
  tax_amount: invoice.taxAmount,
  total_amount: invoice.totalAmount,
  status: invoice.status,
  payment_date: invoice.paymentDate,
  notes: invoice.notes,
  pdf_url: invoice.pdfUrl,
  updated_at: new Date().toISOString()
});

// Operaciones CRUD para facturas
export const getInvoices = async (): Promise<Invoice[]> => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .order('issue_date', { ascending: false });
  
  if (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }
  
  return (data || []).map(mapInvoiceFromDB);
};

export const getClientInvoices = async (clientId: string): Promise<Invoice[]> => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('client_id', clientId)
    .order('issue_date', { ascending: false });
  
  if (error) {
    console.error("Error fetching client invoices:", error);
    return [];
  }
  
  return (data || []).map(mapInvoiceFromDB);
};

export const getInvoice = async (id: string): Promise<Invoice | undefined> => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) {
    console.error("Error fetching invoice:", error);
    return undefined;
  }
  
  return data ? mapInvoiceFromDB(data) : undefined;
};

export const createInvoice = async (invoice: Omit<Invoice, "id" | "createdAt" | "updatedAt" | "invoiceNumber">): Promise<Invoice | undefined> => {
  try {
    // Generar número de factura si no se proporciona uno
    let invoiceNumber = (invoice as any).invoiceNumber;
    if (!invoiceNumber) {
      invoiceNumber = await generateInvoiceNumber();
    }
    
    const now = new Date().toISOString();
    const newInvoice = {
      ...mapInvoiceToDB(invoice),
      invoice_number: invoiceNumber,
      created_at: now,
      updated_at: now
    };
    
    const { data, error } = await supabase
      .from('invoices')
      .insert([newInvoice])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating invoice:", error);
      return undefined;
    }
    
    return mapInvoiceFromDB(data);
  } catch (error) {
    console.error("Error in createInvoice:", error);
    return undefined;
  }
};

export const updateInvoice = async (invoice: Invoice): Promise<Invoice | undefined> => {
  const { data, error } = await supabase
    .from('invoices')
    .update(mapInvoiceToDB(invoice))
    .eq('id', invoice.id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating invoice:", error);
    return undefined;
  }
  
  return mapInvoiceFromDB(data);
};

export const deleteInvoice = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting invoice:", error);
    return false;
  }
  
  return true;
};

// Funciones de facturación desde propuestas y packs
export const createInvoiceFromProposal = async (
  proposalId: string,
  dueDate?: string
): Promise<Invoice | undefined> => {
  try {
    const proposal = await getProposal(proposalId);
    if (!proposal) return undefined;
    
    let baseAmount = proposal.customPrice;
    
    // Si no hay precio personalizado, usar el del pack
    if (!baseAmount && proposal.packId) {
      const pack = await getSeoPack(proposal.packId);
      if (pack) {
        baseAmount = pack.price;
      }
    }
    
    if (!baseAmount) {
      console.error("No price found for invoice creation");
      return undefined;
    }
    
    // Calcular importes
    const taxRate = 21; // IVA estándar en España
    const taxAmount = (baseAmount * taxRate) / 100;
    const totalAmount = baseAmount + taxAmount;
    
    // Crear datos de factura
    const invoiceData = {
      clientId: proposal.clientId,
      proposalId: proposal.id,
      packId: proposal.packId,
      baseAmount,
      taxRate,
      taxAmount,
      totalAmount,
      status: "pending" as const,
      dueDate: dueDate || null
    };
    
    return createInvoice(invoiceData as any);
  } catch (error) {
    console.error("Error creating invoice from proposal:", error);
    return undefined;
  }
};

// Función para actualizar el estado de pago de una factura
export const markInvoiceAsPaid = async (invoiceId: string): Promise<Invoice | undefined> => {
  try {
    const invoice = await getInvoice(invoiceId);
    if (!invoice) return undefined;
    
    const updatedInvoice = {
      ...invoice,
      status: "paid" as const,
      paymentDate: new Date().toISOString()
    };
    
    return updateInvoice(updatedInvoice);
  } catch (error) {
    console.error("Error marking invoice as paid:", error);
    return undefined;
  }
};

// Funciones para generar y descargar PDF de factura
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
    
    // Fix for the error - the setFillColor method requires RGB components (and optional alpha)
    // Make sure we're passing all required parameters
    doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
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

// Función para descargar el PDF
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

// Función para enviar la factura por email al cliente
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

// Funciones de utilidad para formateo
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};
