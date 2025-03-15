
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
    // Generar número de factura
    const invoiceNumber = await generateInvoiceNumber();
    
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

    // Crear documento PDF
    const doc = new jsPDF();
    
    // Colores personalizados
    const primaryColor: [number, number, number] = [41, 128, 114]; // Color verde azulado #298072
    const darkColor: [number, number, number] = [30, 33, 36]; // Color oscuro #1E2124
    const lightColor: [number, number, number] = [255, 255, 255]; // Blanco
    
    // Configuración de la página
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    
    // Cabecera con fondo oscuro
    doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.roundedRect(0, 0, pageWidth, 40, 0, 0, 'F');
    
    // Parte inferior redondeada
    doc.setDrawColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.roundedRect(0, 35, pageWidth, 20, 20, 20, 'F');
    
    // Logo de la empresa (si existe)
    if (company.logoUrl) {
      try {
        // Añadir logo si está disponible
        doc.addImage(company.logoUrl, 'JPEG', margin, 10, 40, 20, undefined, 'FAST');
      } catch (e) {
        console.error("Error al cargar el logo:", e);
        // Si falla, usar texto como respaldo
        doc.setTextColor(lightColor[0], lightColor[1], lightColor[2]);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text("LOGO", margin + 10, 22);
      }
    } else {
      // Logo de texto como respaldo
      doc.setTextColor(lightColor[0], lightColor[1], lightColor[2]);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text("LOGO", margin + 10, 22);
    }
    
    // Título de la factura en la cabecera
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text("FACTURA", pageWidth - margin - 40, 25);
    
    // Sección "Facturar a"
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text("Facturar a", margin, 70);
    
    // Datos del cliente
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(client.name, margin, 78);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Cargo o empresa del cliente
    if (client.company) {
      doc.text(`${client.company}`, margin, 85);
    }
    
    // Dirección y contacto
    let yPos = client.company ? 92 : 85;
    
    // Nota: El cliente no tiene dirección en el tipo Client, así que omitimos esa línea
    
    doc.setFont('helvetica', 'bold');
    doc.text("E :", margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(client.email, margin + 10, yPos);
    yPos += 7;
    
    if (client.phone) {
      doc.setFont('helvetica', 'bold');
      doc.text("T :", margin, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(client.phone, margin + 10, yPos);
    }
    
    // Bloque de información de la factura
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text("Factura ID", pageWidth - margin - 80, 70);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`#${invoice.invoiceNumber}`, pageWidth - margin - 80, 78);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text("Fecha de Vencimiento", pageWidth - margin - 80, 90);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    const dueDate = invoice.dueDate 
      ? formatDate(invoice.dueDate, false) 
      : formatDate(invoice.issueDate, false);
    doc.text(dueDate, pageWidth - margin - 80, 98);
    
    // Tabla de conceptos
    const tableHeaders = [
      { header: 'Descripción Item', dataKey: 'description' },
      { header: 'Precio', dataKey: 'price' },
      { header: 'Cant', dataKey: 'quantity' },
      { header: 'Importe', dataKey: 'amount' }
    ];
    
    // Preparar los datos para la tabla
    const tableData = [];
    
    // Si hay un pack asociado
    if (invoice.packId) {
      const pack = await getSeoPack(invoice.packId);
      if (pack) {
        tableData.push({
          description: pack.name,
          price: formatCurrency(invoice.baseAmount),
          quantity: '1',
          amount: formatCurrency(invoice.baseAmount)
        });
      }
    } else {
      // Si no hay pack, usar la descripción de las notas o texto por defecto
      tableData.push({
        description: invoice.notes || "Servicios profesionales",
        price: formatCurrency(invoice.baseAmount),
        quantity: '1',
        amount: formatCurrency(invoice.baseAmount)
      });
    }
    
    // Estilos de la tabla
    const tableBodyStyles = {
      fillColor: [245, 245, 245] as [number, number, number], // Color claro para filas alternadas
      textColor: [50, 50, 50] as [number, number, number]
    };
    
    // Encabezado de la tabla con diseño bicolor
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.roundedRect(margin, 115, 100, 12, 0, 0, 'F');
    
    doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.roundedRect(margin + 100, 115, pageWidth - (2 * margin) - 100, 12, 0, 0, 'F');
    
    // Aplicar autoTable con estilos personalizados
    autoTable(doc, {
      startY: 115,
      head: [['Descripción Item', 'Precio', 'Cant', 'Importe']],
      body: tableData.map(row => [row.description, row.price, row.quantity, row.amount]),
      theme: 'grid',
      headStyles: { 
        fillColor: [0, 0, 0, 0] as unknown as [number, number, number], // Transparente porque ya dibujamos el fondo
        textColor: [255, 255, 255] as [number, number, number],
        fontStyle: 'bold',
        halign: 'left'
      },
      alternateRowStyles: tableBodyStyles,
      styles: { 
        fontSize: 10,
        cellPadding: 6
      },
      columnStyles: {
        0: { cellWidth: pageWidth - 160 - (2 * margin) },
        1: { cellWidth: 40, halign: 'right' },
        2: { cellWidth: 20, halign: 'center' },
        3: { cellWidth: 40, halign: 'right' }
      },
      margin: { left: margin, right: margin }
    });
    
    // Información de pago y totales
    const finalY = doc.lastAutoTable.finalY + 20;
    
    // Método de pago
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text("Método de Pago", margin, finalY);
    
    // Información bancaria
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const bankAccount = company.bankAccount || "ES00 0000 0000 0000 0000 0000";
    doc.text(bankAccount, margin, finalY + 8);
    
    // Subtotal, impuestos y total
    const subtotalY = finalY;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text("Subtotal", pageWidth - margin - 80, subtotalY);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(invoice.baseAmount), pageWidth - margin, subtotalY, { align: 'right' });
    
    // IVA
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`IVA (${invoice.taxRate}%)`, pageWidth - margin - 80, subtotalY + 8);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(invoice.taxAmount), pageWidth - margin, subtotalY + 8, { align: 'right' });
    
    // Línea separadora
    doc.setLineWidth(0.2);
    doc.line(pageWidth - margin - 80, subtotalY + 12, pageWidth - margin, subtotalY + 12);
    
    // Total con fondo
    const totalY = subtotalY + 20;
    // Fondo bicolor para el total
    doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.roundedRect(pageWidth - margin - 80, totalY - 5, 40, 10, 0, 0, 'F');
    
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.roundedRect(pageWidth - margin - 40, totalY - 5, 40, 10, 0, 0, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("Total", pageWidth - margin - 60, totalY, { align: 'center' });
    doc.text(formatCurrency(invoice.totalAmount), pageWidth - margin - 20, totalY, { align: 'center' });
    
    // Términos y condiciones
    const termsY = finalY + 40;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text("Términos y Condiciones", margin, termsY);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const terms = "Esta factura debe ser pagada en los términos establecidos. Para cualquier consulta relacionada con esta factura, por favor contacte con nosotros.";
    const splitTerms = doc.splitTextToSize(terms, pageWidth - (2 * margin) - 100);
    doc.text(splitTerms, margin, termsY + 8);
    
    // Firma
    doc.setFontSize(9);
    doc.text("Firma digital:", pageWidth - margin - 100, termsY);
    // Línea para firma
    doc.setLineWidth(0.5);
    doc.line(pageWidth - margin - 100, termsY + 5, pageWidth - margin - 20, termsY + 5);
    
    // Información de la empresa
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(company.companyName, pageWidth - margin - 100, termsY + 15);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`CIF: ${company.taxId}`, pageWidth - margin - 100, termsY + 20);
    
    // Pie de página con fondo redondeado
    const footerY = doc.internal.pageSize.height - 25;
    
    // Fondo del pie de página
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.roundedRect(0, footerY - 5, pageWidth, 30, 20, 20, 'F');
    
    // Información de contacto en tres columnas
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    
    // Columna 1: Centro de llamadas
    doc.text("Centro de Atención", margin + 15, footerY + 5, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(company.phone || "No disponible", margin + 15, footerY + 12, { align: 'center' });
    
    // Columna 2: Oficina central
    const midX = pageWidth / 2;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text("Oficina Central", midX, footerY + 5, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const addressParts = company.address.split(',');
    doc.text(addressParts[0] || company.address, midX, footerY + 12, { align: 'center' });
    
    // Columna 3: Soporte
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text("Soporte", pageWidth - margin - 15, footerY + 5, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(company.email || "soporte@empresa.com", pageWidth - margin - 15, footerY + 12, { align: 'center' });
    
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
const formatDate = (dateString: string, includeDay: boolean = true): string => {
  const date = new Date(dateString);
  if (includeDay) {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  } else {
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};
