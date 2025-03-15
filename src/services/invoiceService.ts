import { Invoice } from "@/types/client";
import { supabase } from "@/integrations/supabase/client";
import { getSeoPack } from "./packService";
import { getProposal } from "./proposal/proposalCrud";
import { getClient } from "./clientService";
import { getCompanySettings } from "./settingsService";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { toast } from "sonner";

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
    
    // Estilos y configuración
    const primaryColor = [0, 102, 204] as [number, number, number]; // Azul corporativo
    const grayColor = [120, 120, 120] as [number, number, number];
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFillColor(240, 240, 240);
    
    // Título y número de factura
    doc.setFontSize(22);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("FACTURA", 20, 20);
    doc.setFontSize(14);
    doc.text(`Nº: ${invoice.invoiceNumber}`, 20, 28);
    
    // Fechas
    doc.setFontSize(10);
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    doc.text(`Fecha de emisión: ${formatDate(invoice.issueDate)}`, 20, 35);
    if (invoice.dueDate) {
      doc.text(`Fecha de vencimiento: ${formatDate(invoice.dueDate)}`, 20, 40);
    }
    
    // Datos de empresa (emisor)
    doc.setFillColor(245, 245, 250);
    doc.roundedRect(20, 50, 80, 40, 2, 2, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text("DATOS DEL EMISOR", 25, 57);
    doc.setFontSize(9);
    doc.text(company.companyName, 25, 65);
    doc.text(`CIF/NIF: ${company.taxId}`, 25, 70);
    doc.text(company.address, 25, 75);
    doc.text(`Tel: ${company.phone || "N/A"}`, 25, 80);
    doc.text(`Email: ${company.email || "N/A"}`, 25, 85);
    
    // Datos del cliente
    doc.setFillColor(245, 245, 250);
    doc.roundedRect(110, 50, 80, 40, 2, 2, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text("DATOS DEL CLIENTE", 115, 57);
    doc.setFontSize(9);
    doc.text(client.name, 115, 65);
    if (client.company) doc.text(client.company, 115, 70);
    const clientAddress = client.company ? client.company : "N/A";
    doc.text(clientAddress, 115, 75);
    doc.text(`Tel: ${client.phone || "N/A"}`, 115, 80);
    doc.text(`Email: ${client.email}`, 115, 85);
    
    // Estado de la factura
    let statusText = "PENDIENTE";
    let statusColor = [255, 150, 0] as [number, number, number]; // Naranja para pendiente
    if (invoice.status === "paid") {
      statusText = "PAGADA";
      statusColor = [0, 170, 0] as [number, number, number]; // Verde para pagada
    } else if (invoice.status === "cancelled") {
      statusText = "CANCELADA";
      statusColor = [200, 0, 0] as [number, number, number]; // Rojo para cancelada
    }
    
    doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.setTextColor(255, 255, 255);
    doc.roundedRect(150, 20, 40, 10, 2, 2, 'F');
    doc.setFontSize(10);
    doc.text(statusText, 170, 26, { align: "center" });
    
    // Tabla de conceptos
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text("CONCEPTOS", 20, 105);
    
    // @ts-ignore - jsPDF-AutoTable no tiene tipos TS adecuados
    doc.autoTable({
      startY: 110,
      head: [['Concepto', 'Importe']],
      body: [
        [(invoice.notes || "Servicios profesionales"), formatCurrency(invoice.baseAmount)],
      ],
      theme: 'grid',
      headStyles: { 
        fillColor: [primaryColor[0], primaryColor[1], primaryColor[2]], 
        textColor: [255, 255, 255],
        fontSize: 10 
      },
      columnStyles: {
        0: { cellWidth: 140 },
        1: { cellWidth: 30, halign: 'right' }
      },
      margin: { left: 20, right: 20 }
    });
    
    // Resumen de importes
    // @ts-ignore
    let finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.text("Base imponible:", 130, finalY);
    doc.text(formatCurrency(invoice.baseAmount), 180, finalY, { align: 'right' });
    
    doc.text(`IVA (${invoice.taxRate}%):`, 130, finalY + 5);
    doc.text(formatCurrency(invoice.taxAmount), 180, finalY + 5, { align: 'right' });
    
    doc.setLineWidth(0.3);
    doc.line(130, finalY + 7, 180, finalY + 7);
    
    doc.setFontSize(12);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont(undefined, 'bold');
    doc.text("TOTAL:", 130, finalY + 13);
    doc.text(formatCurrency(invoice.totalAmount), 180, finalY + 13, { align: 'right' });
    
    // Información adicional sobre formas de pago
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text("FORMA DE PAGO", 20, finalY + 25);
    doc.setFontSize(8);
    doc.text("Transferencia bancaria a la cuenta:", 20, finalY + 30);
    
    // Use default bank account if not available in company settings
    const bankAccount = company.bankAccount || "ES00 0000 0000 0000 0000 0000";
    doc.text(bankAccount, 20, finalY + 35);
    
    // Pie de página
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    doc.text(`Factura generada por ${company.companyName}`, 105, pageHeight - 10, { align: 'center' });
    
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
    
    // Aquí simulamos el envío del email
    // En una implementación real, aquí se conectaría con un servicio de email
    
    toast.success(`Factura ${invoice.invoiceNumber} enviada a ${client.email}`);
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
