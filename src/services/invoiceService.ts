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
    
    // Paleta de colores moderna y profesional
    const primaryColor = [80, 82, 209]; // Azul moderno #5052D1
    const secondaryColor = [247, 250, 252]; // Gris muy claro #F7FAFC
    const accentColor = [113, 128, 150]; // Gris medio #7180BF
    const darkColor = [45, 55, 72]; // Gris oscuro #2D3748
    const successColor = [56, 161, 105]; // Verde #38A169
    
    // Configuración de la página
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;
    
    // Fondo superior con degradado
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Franja decorativa
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 40, pageWidth, 8, 'F');
    
    // Logo y nombre de la empresa
    if (company.logoUrl) {
      try {
        doc.addImage(company.logoUrl, 'JPEG', margin, 10, 30, 20);
      } catch (e) {
        // Si falla la carga del logo, usar texto como respaldo
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(company.companyName.toUpperCase(), margin, 25);
      }
    } else {
      // Nombre de la empresa como texto
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(company.companyName.toUpperCase(), margin, 25);
    }
    
    // Título "FACTURA" y número
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text("FACTURA", pageWidth - margin - 90, 25);
    
    doc.setFontSize(12);
    doc.text(`#${invoice.invoiceNumber}`, pageWidth - margin - 40, 25);
    
    // Datos de la empresa
    doc.setDrawColor(230, 230, 230);
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.roundedRect(margin, 58, (pageWidth / 2) - margin - 10, 60, 3, 3, 'F');
    
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("DE", margin + 10, 70);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(company.companyName, margin + 10, 80);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`CIF/NIF: ${company.taxId}`, margin + 10, 88);
    doc.text(company.address, margin + 10, 96);
    if (company.phone) doc.text(`Tel: ${company.phone}`, margin + 10, 104);
    if (company.email) doc.text(`Email: ${company.email}`, margin + 10, 112);
    
    // Datos del cliente
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.roundedRect(pageWidth / 2 + 10, 58, (pageWidth / 2) - margin - 10, 60, 3, 3, 'F');
    
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("PARA", pageWidth / 2 + 20, 70);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(client.name, pageWidth / 2 + 20, 80);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    if (client.company) doc.text(client.company, pageWidth / 2 + 20, 88);
    const yStartClient = client.company ? 96 : 88;
    doc.text(`Email: ${client.email}`, pageWidth / 2 + 20, yStartClient);
    if (client.phone) doc.text(`Tel: ${client.phone}`, pageWidth / 2 + 20, yStartClient + 8);
    
    // Información de la factura (fechas, estado)
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2], 0.1); // Color primario con transparencia
    doc.roundedRect(margin, 130, pageWidth - (margin * 2), 35, 3, 3, 'F');
    
    // Fecha de emisión
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text("FECHA EMISIÓN", margin + 15, 142);
    doc.setFont('helvetica', 'normal');
    doc.text(formatDate(invoice.issueDate, false), margin + 15, 152);
    
    // Fecha de vencimiento
    doc.setFont('helvetica', 'bold');
    doc.text("FECHA VENCIMIENTO", margin + (pageWidth - margin * 2) / 3 + 15, 142);
    doc.setFont('helvetica', 'normal');
    const dueDateStr = invoice.dueDate 
      ? formatDate(invoice.dueDate, false) 
      : "N/A";
    doc.text(dueDateStr, margin + (pageWidth - margin * 2) / 3 + 15, 152);
    
    // Estado de la factura
    doc.setFont('helvetica', 'bold');
    doc.text("ESTADO", margin + (pageWidth - margin * 2) * 2 / 3 + 15, 142);
    
    doc.setFont('helvetica', 'normal');
    const statusText = {
      pending: "PENDIENTE",
      paid: "PAGADA",
      cancelled: "CANCELADA"
    }[invoice.status];
    
    // Color según el estado
    const statusColors = {
      pending: [226, 160, 63],  // Naranja #E2A03F
      paid: [56, 161, 105],     // Verde #38A169
      cancelled: [229, 62, 62]  // Rojo #E53E3E
    };
    
    const statusColor = statusColors[invoice.status] || [113, 128, 150];
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.text(statusText, margin + (pageWidth - margin * 2) * 2 / 3 + 15, 152);
    
    // Volver al color normal
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    
    // Tabla de conceptos
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("Detalles", margin, 180);
    
    // Estilos para la tabla
    const tableHeaders = [
      { header: 'Descripción', dataKey: 'description' },
      { header: 'Precio', dataKey: 'price' },
      { header: 'Cant.', dataKey: 'quantity' },
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
    
    // Aplicar autoTable con estilos modernos
    autoTable(doc, {
      startY: 185,
      head: [['Descripción', 'Precio', 'Cant.', 'Importe']],
      body: tableData.map(row => [row.description, row.price, row.quantity, row.amount]),
      theme: 'grid',
      headStyles: { 
        fillColor: primaryColor as [number, number, number],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'left',
        valign: 'middle'
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      },
      styles: { 
        fontSize: 9,
        cellPadding: 6
      },
      columnStyles: {
        0: { cellWidth: pageWidth - 180 - (2 * margin) },
        1: { cellWidth: 50, halign: 'right' },
        2: { cellWidth: 30, halign: 'center' },
        3: { cellWidth: 50, halign: 'right' }
      },
      margin: { left: margin, right: margin }
    });
    
    // Obtener la posición Y final de la tabla
    const finalY = doc.lastAutoTable.finalY + 15;
    
    // Totales - Caja con estilo
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.roundedRect(pageWidth - 120 - margin, finalY, 120, 70, 3, 3, 'F');
    
    // Subtotal
    doc.setFontSize(9);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFont('helvetica', 'normal');
    doc.text("Subtotal", pageWidth - 110 - margin, finalY + 15);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(invoice.baseAmount), pageWidth - margin - 20, finalY + 15, { align: 'right' });
    
    // IVA
    doc.setFont('helvetica', 'normal');
    doc.text(`IVA (${invoice.taxRate}%)`, pageWidth - 110 - margin, finalY + 30);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(invoice.taxAmount), pageWidth - margin - 20, finalY + 30, { align: 'right' });
    
    // Línea separadora
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(pageWidth - 110 - margin, finalY + 40, pageWidth - margin - 10, finalY + 40);
    
    // Total
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("TOTAL", pageWidth - 110 - margin, finalY + 55);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(14);
    doc.text(formatCurrency(invoice.totalAmount), pageWidth - margin - 20, finalY + 55, { align: 'right' });
    
    // Información de pago
    const paymentY = finalY + 100;
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("INSTRUCCIONES DE PAGO", margin, paymentY);
    
    // Línea decorativa bajo el título
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, paymentY + 5, margin + 80, paymentY + 5);
    
    // Método de pago - Transferencia
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text("Por favor, realice el pago mediante transferencia bancaria a la siguiente cuenta:", margin, paymentY + 15);
    
    // Datos bancarios
    doc.setFont('helvetica', 'bold');
    const bankAccount = company.bankAccount || "ES00 0000 0000 0000 0000 0000";
    doc.text(bankAccount, margin, paymentY + 25);
    
    // Referencia
    doc.setFont('helvetica', 'normal');
    doc.text(`Incluya como referencia el número de factura: ${invoice.invoiceNumber}`, margin, paymentY + 35);
    
    // Notas
    if (invoice.notes) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text("NOTAS", margin, paymentY + 50);
      
      // Línea decorativa bajo el título
      doc.setLineWidth(0.5);
      doc.line(margin, paymentY + 55, margin + 30, paymentY + 55);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      
      // Dividir el texto en líneas para evitar que se salga de la página
      const splitNotes = doc.splitTextToSize(invoice.notes, pageWidth - (2 * margin));
      doc.text(splitNotes, margin, paymentY + 65);
    }
    
    // Pie de página
    const footerY = pageHeight - 25;
    
    // Línea separadora
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.5);
    doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
    
    // Texto de agradecimiento
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text("Gracias por su confianza. Para cualquier consulta, no dude en contactarnos.", pageWidth / 2, footerY, { align: 'center' });
    
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
